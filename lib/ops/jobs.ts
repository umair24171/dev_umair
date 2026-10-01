import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { audit, capture, hash, OpsError, text, type Draft, type Job } from './core';
import { transaction, readState } from './store';
import {freshSnapshot} from './schedules';
import { buildPlan, history, parseSearchConsoleCSV, prepareDraft, resumeDraft, geminiJSON } from '../../agent/lib/pipeline.js';
async function editorialRecords() { const s = await readState(); return [...history(), ...s.jobs.filter(j => j.kind === 'blog-writer-draft' && j.status === 'review').flatMap(j => { const report = (j.result as {
        report?: {
            status: string;
            topic: Record<string, string>;
        };
    })?.report; return report?.status === 'ready-for-human-review' ? [{ ...report.topic, route: '/ops', state: 'draft' }] : []; })]; }
function operationKey(key: string) { if (!/^[\w-]{8,100}$/.test(key))
    throw new OpsError('Invalid operation ID.'); }
async function start(kind: string, key: string, reservedCalls = 0, costPerAttempt = 0, usdCap = 0): Promise<Job> { operationKey(key); return transaction(s => { const existing = s.jobs.find(j => j.key === key); if (existing) {
    if (existing.kind !== kind) throw new OpsError('Operation ID belongs to a different job.', 409);
    if (existing.status === 'running')
        throw new OpsError('This job is already running. Refresh its status; do not start duplicate provider work.', 409);
    return existing;
} const day = new Date().toISOString().slice(0, 10); if (reservedCalls && ((s.dailyCalls[day] || 0) + reservedCalls) * costPerAttempt > usdCap)
    throw new OpsError('Daily dollar reservation ceiling exceeded.', 429); if (reservedCalls && (s.dailyCalls[day] || 0) + reservedCalls > s.config.providerDailyLimit)
    throw new OpsError('Daily provider attempt limit reached. Try again tomorrow.', 429); s.dailyCalls[day] = (s.dailyCalls[day] || 0) + reservedCalls; const j: Job = { id: crypto.randomUUID(), key, kind, status: 'running', attempts: 0, startedAt: new Date().toISOString(), reservedCalls }; s.jobs.push(j); audit(s, 'owner', 'job.start', j.id, kind); return j; }); }
async function finish(job: Job, result: unknown, error?: string, content?: Draft) { await transaction(s => { const j = s.jobs.find(j => j.id === job.id)!; j.status = error ? 'failed' : 'review'; j.finishedAt = new Date().toISOString(); j.error = error; j.result = result; if (content) {
    s.content.push(content);
    audit(s, 'worker', 'article.unpublished', content.id, job.id);
} audit(s, 'worker', error ? 'job.failed' : 'job.review', j.id, error || job.kind); }); }
export async function researchJob(key: string) {
    const job = await start('public-request-discovery', key);
    if (job.status !== 'running' || job.attempts)
        return job;
    await transaction(s => { s.jobs.find(j => j.id === job.id)!.attempts = 1; });
    try {
        let r: Response | undefined;
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                r = await fetch('https://api.github.com/repos/n8n-io/n8n/issues?state=open&per_page=30&sort=updated&direction=desc', { cache: 'no-store', signal: AbortSignal.timeout(15000), headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'BuildZnResearch/1.0' } });
                if (r.ok)
                    break;
                if (![429, 500, 502, 503, 504].includes(r.status))
                    break;
            }
            catch {
                if (attempt === 2)
                    throw new OpsError('Public research timed out. Retry manually with a new operation ID.', 503);
            }
            await new Promise(r => setTimeout(r, 250 * 2 ** attempt));
        }
        if (!r?.ok)
            throw new OpsError(`Public request API failed (HTTP ${r?.status || 'timeout'}).`, 503);
        const rows = await r.json();
        if (!Array.isArray(rows))
            throw new OpsError('Invalid public request API response.', 503);
        const matches = rows.filter((item: Record<string, unknown>) => !item.pull_request && typeof item.body === 'string' && typeof item.title === 'string' && /webhook|workflow|integration|automation/i.test(item.title + ' ' + item.body) && /help|looking for|how (?:can|do|to)|assistance/i.test(item.body)).slice(0, 8);
        const imported = await transaction(s => matches.map(item => { if (!/^https:\/\/github.com\/n8n-io\/n8n\/issues\/\d+$/.test(item.html_url) || !item.created_at)
            throw new OpsError('Public request has invalid source metadata.'); const found = s.leads.find(l => l.evidence.some(e => e.url === item.html_url)); if (found)
            return { leadId: found.id, duplicate: true }; const result = capture(s, { name: item.title.slice(0, 120), email: '', company: 'Public n8n support request', message: String(item.body).slice(0, 5000), source: 'public-request', sourceDetail: item.html_url, tools: 'n8n' }, 'research'); const l = s.leads.find(l => l.id === result.leadId)!; l.evidence.push({ id: crypto.randomUUID(), url: item.html_url, date: item.created_at.slice(0, 10), text: String(item.body).slice(0, 12000), kind: 'public-request', reviewed: false, retrievedAt: new Date().toISOString(), digest: hash(item.body) }); l.nextAction = 'Review request, business fit and permission before contact. Support issue is not consent or purchase intent.'; return result; }));
        const result = { imported, scanned: rows.length, matched: matches.length, source: 'Official n8n public issues API', limitations: 'Bounded public support requests. No contact list harvested. Request dates and exact source text recorded. Support requests do not establish buyer intent, verified defects, or permission to contact.' };
        await finish(job, result);
        return result;
    }
    catch (e) {
        const message = e instanceof Error ? e.message : 'Research failed';
        await finish(job, null, message);
        throw new OpsError(message, 503);
    }
}
export async function editorialPlan(data: Record<string, unknown>, key: string) { const job = await start('seo-plan', key); if (job.status !== 'running')
    return job; try {
    const saved = data.useSavedSearchConsole ? (await readState()).searchConsole : undefined;
    if (data.useSavedSearchConsole && !freshSnapshot(saved)) {
        const result = {status:'skipped',reason:'Import a real Search Console Queries export from the last seven days before scheduled SEO planning. No fresh data was inferred.'};
        await finish(job,result);
        return result;
    }
    const csv = text(saved?.csv || data.csv, 'Search Console CSV', 40000);
    const range = text(saved?.range || data.range, 'reporting date range and filters', 300);
    if (csv && !range)
        throw new OpsError('Supply the Search Console reporting date range and filters.');
    const signals = csv ? parseSearchConsoleCSV(csv) : [];
    if (csv && !data.useSavedSearchConsole) await transaction(s=>{s.searchConsole={csv,range,importedAt:new Date().toISOString()};});
    const plan = buildPlan({ records: await editorialRecords(), signals });
    const result = { ...plan, searchConsoleContext: range || 'No Search Console export supplied. Demand remains explicitly unmeasured.' };
    await finish(job, result);
    return result;
}
catch (e) {
    const message = e instanceof Error ? e.message : 'SEO planning failed';
    await finish(job, null, message);
    throw new OpsError(message);
} }
export async function editorialJob(data: Record<string, unknown>, key: string) {
    // Dollar ceiling uses configured account rates, with a conservative 100k-input/12k-output-token reservation per attempt. It is a cap, not actual billing.
    const inputRate = Number(process.env.OPS_AI_INPUT_USD_PER_MILLION), outputRate = Number(process.env.OPS_AI_OUTPUT_USD_PER_MILLION), cap = Number(process.env.OPS_AI_DAILY_USD_CAP);
    if (!process.env.OPS_AI_ENABLED || process.env.OPS_AI_ENABLED !== 'true' || !Number.isFinite(inputRate) || inputRate <= 0 || !Number.isFinite(outputRate) || outputRate <= 0 || !Number.isFinite(cap) || cap <= 0)
        throw new OpsError('AI spending is disabled. Configure current account token rates, a daily dollar ceiling and OPS_AI_ENABLED after review. Evidence planning and deterministic drafts remain available.', 503);
    const worstPerAttempt = (100000 * inputRate + 12000 * outputRate) / 1000000;
    // Resume reuses the brief and candidate; reserve eight attempts and stop before exceeding them.
    const reservedCalls = data.resumeJobId ? 8 : 15;
    const state = await readState();
    operationKey(key);
    const previousOperation = state.jobs.find(j => j.key === key);
    if (previousOperation) {
        if (previousOperation.kind !== 'blog-writer-draft') throw new OpsError('Operation ID belongs to a different job.', 409);
        if (previousOperation.status === 'running') throw new OpsError('This job is already running. Refresh its status; do not start duplicate provider work.', 409);
        const savedReport = (previousOperation.result as { report?: { status?: string } } | undefined)?.report;
        return { jobId: previousOperation.id, status: savedReport?.status || previousOperation.status };
    }
    const day = new Date().toISOString().slice(0, 10);
    if (((state.dailyCalls[day] || 0) + reservedCalls) * worstPerAttempt > cap)
        throw new OpsError('Conservative model cost reservation exceeds the daily spending ceiling.', 429);
    const job = await start('blog-writer-draft', key, reservedCalls, worstPerAttempt, cap);
    if (job.status !== 'running' || job.attempts)
        return job;
    const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'buildzn-editorial-'));
    try {
        const generator = async (stage: string, payload: unknown) => { if (Buffer.byteLength(JSON.stringify(payload)) > 94000)
            throw new OpsError('Editorial context exceeds the reserved input ceiling.'); return geminiJSON(stage, payload, { onAttempt: async () => { await transaction(s => { const j = s.jobs.find(j => j.id === job.id)!; if (j.attempts >= j.reservedCalls)
                throw new OpsError('Provider attempt reservation exhausted.', 429); j.attempts++; }); } }); };
        let result;
        let sourceUrls: string[] = [];
        if (data.resumeJobId) {
            const previous = (await readState()).jobs.find(j => j.id === data.resumeJobId && j.kind === 'blog-writer-draft' && j.status === 'failed');
            const saved = previous?.result as {
                files?: Record<string, string>;
            } | undefined;
            if (!previous || !saved?.files)
                throw new OpsError('No retained editorial pack exists for this failed job. Prepare a fresh article.');
            const runDirectory = path.join(temporary, 'content/drafts/runs', previous.id);
            fs.mkdirSync(runDirectory, { recursive: true });
            for (const file of ['topic.json', 'sources.json', 'brief.json', 'candidate-1.json', 'candidate-2.json', 'report.json'])
                if (saved.files[file])
                    fs.writeFileSync(path.join(runDirectory, file), saved.files[file]);
            fs.mkdirSync(path.join(temporary, 'content/posts'), { recursive: true });
            fs.cpSync(path.join(process.cwd(), 'content/posts'), path.join(temporary, 'content/posts'), { recursive: true });
            result = await resumeDraft(previous.id, { directory: temporary, generator, allowUpdate: data.update === true });
            const priorTopic = JSON.parse(saved.files['topic.json']);
            sourceUrls = priorTopic.sources.map((s: {
                url: string;
            }) => s.url);
        }
        else {
            const plan = buildPlan({ records: await editorialRecords() });
            const topic = plan.topics.find(t => t.id === data.topic);
            if (!topic)
                throw new OpsError('Choose a current editorial topic.');
            if (topic.action === 'update-existing' && data.update !== true)
                throw new OpsError('Approve an existing-page update explicitly.');
            result = await prepareDraft(topic, { directory: temporary, records: await editorialRecords(), generator });
            sourceUrls = topic.sources.map((s: {
                url: string;
            }) => s.url);
        }
        const files = Object.fromEntries(fs.readdirSync(result.runDir).map(file => [file, fs.readFileSync(path.join(result.runDir, file), 'utf8')]));
        const content: Draft | undefined = result.report.status === 'ready-for-human-review' ? { id: crypto.randomUUID(), kind: 'article', body: files['draft.md'], version: 1, approvedVersion: null, createdAt: new Date().toISOString(), evidenceIds: sourceUrls } : undefined;
        await finish(job, { report: result.report, files }, result.report.status === 'failed' ? (result.report as typeof result.report & {
            error?: string;
        }).error : undefined, content);
        return { jobId: job.id, status: result.report.status };
    }
    catch (e) {
        const message = e instanceof Error ? e.message : 'Editorial generation failed';
        await finish(job, null, message);
        throw new OpsError(message, 503);
    }
    finally {
        fs.rmSync(temporary, { recursive: true, force: true });
    }
}
