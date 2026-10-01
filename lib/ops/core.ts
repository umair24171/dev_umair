import crypto from 'node:crypto';
import projects from '../../content/business/projects.json';
export const stages = ['inquiry', 'discovery', 'proposal', 'won', 'lost', 'handoff'] as const;
export type Stage = typeof stages[number];
export type Evidence = {
    id: string;
    url: string;
    date: string;
    text: string;
    reviewed: boolean;
    kind: 'public-request' | 'supplied-workflow';
    retrievedAt?: string;
    digest?: string;
};
export type Draft = {
    id: string;
    kind: string;
    body: string;
    version: number;
    approvedVersion: number | null;
    createdAt: string;
    approvedAt?: string;
    recipient?: string;
    price?: number;
    currency?: string;
    evidenceIds: string[];
};
export type Lead = {
    id: string;
    name: string;
    email: string;
    company: string;
    message: string;
    tools: string;
    volume: string;
    budget: string;
    timeline: string;
    source: string;
    sourceDetail: string;
    sample: boolean;
    stage: Stage;
    createdAt: string;
    updatedAt: string;
    missing: string[];
    qualified: boolean;
    qualificationApproved: boolean;
    optedOut: boolean;
    declined: boolean;
    notes: string;
    notesApproved: boolean;
    evidence: Evidence[];
    drafts: Draft[];
    nextAction: string;
    dueAt: string | null;
    events: {
        type: string;
        at: string;
        detail: string;
    }[];
    wonValue: number | null;
};
export type Job = {
    id: string;
    kind: string;
    key: string;
    status: 'running' | 'failed' | 'review';
    attempts: number;
    startedAt: string;
    finishedAt?: string;
    error?: string;
    result?: unknown;
    reservedCalls: number;
};
export type State = {
    version: 1;
    revision: number;
    leads: Lead[];
    content: Draft[];
    jobs: Job[];
    audit: {
        id: string;
        at: string;
        actor: string;
        action: string;
        target: string;
        detail: string;
    }[];
    receipts: Record<string, {
        at: string;
        result: unknown;
        signature: string;
    }>;
    suppressed: Record<string, {reason:string;at:string}>;
    security: Record<string, {
        count: number;
        until: number;
    }>;
    dailyCalls: Record<string, number>;
    config: {
        jobsEnabled: false;
        providerDailyLimit: number;
        offer: string;
        offerAssumption: string;
    };
};
export const initialState = (): State => ({ version: 1, revision: 0, leads: [], content: [], jobs: [], audit: [], receipts: {}, suppressed: {}, security: {}, dailyCalls: {}, config: { jobsEnabled: false, providerDailyLimit: 24, offer: 'Inquiry workflow pilot', offerAssumption: 'Start with one intake source, validated lead storage, a reply draft and a human review gate. Based on the working sample inquiry demo; business demand and production client outcomes are unverified. Price and delivery dates require approval after discovery.' } });
export class OpsError extends Error {
    constructor(message: string, public status = 400) { super(message); }
}
const id = () => crypto.randomUUID();
export const hash = (value: unknown) => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function text(value: unknown, name: string, max = 5000, required = false): string { if (value === undefined && !required)
    return ''; if (typeof value !== 'string' || value.length > max || (required && !value.trim()))
    throw new OpsError(`Invalid ${name}.`); checkSecrets(value); return value.trim(); }
function checkSecrets(value: string) { if (/\b(?:AIza[\w-]{25,}|gh[pousr]_[\w]{20,}|github_pat_[\w]{20,}|sk-[\w-]{20,})|-----BEGIN .*PRIVATE KEY-----/.test(value))
    throw new OpsError('Remove credentials before saving.'); }
export function audit(s: State, actor: string, action: string, target: string, detail = '') { s.audit.push({ id: id(), at: new Date().toISOString(), actor, action, target, detail }); }
function event(lead: Lead, type: string, detail: string) { const at = new Date().toISOString(); lead.events.push({ type, at, detail }); lead.updatedAt = at; }
function qualify(l: Lead) { l.missing = [!l.tools && 'Tools and access', !l.volume && 'Frequency / volume', !l.budget && 'Budget', !l.timeline && 'Target timing'].filter(Boolean) as string[]; l.qualified = l.qualificationApproved === true && !!l.tools && !l.optedOut && !l.declined && l.missing.length === 0; }
export function capture(s: State, data: Record<string, unknown>, actor = 'intake') {
    const name = text(data.name, 'name', 120, true), email = text(data.email, 'email', 254, actor !== 'research').toLowerCase(), message = text(data.message, 'brief', 5000, true);
    if ((actor !== 'research' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) || message.length < 10)
        throw new OpsError('Use a valid email and a brief of at least 10 characters.');
    checkSecrets(message);
    const source = text(data.source, 'source', 80) || 'direct';
    const company = text(data.company, 'company', 160);
    const same = s.leads.find(l => l.email === email && !l.sample && data.sample !== true && l.message === message) || s.leads.find(l => l.email === email && l.message === message && l.sample === (data.sample === true));
    if (same)
        return { leadId: same.id, duplicate: true };
    if (s.leads.length >= 500)
        throw new OpsError('Record limit reached. Export and migrate storage before adding more records.', 503);
    s.suppressed ||= {};
    const suppression = email ? s.suppressed[hash(email)] : undefined;
    const now = new Date().toISOString();
    const parsed = (label: string) => message.match(new RegExp(`^${label}:[ \\t]*([^\\r\\n]+)$`, 'im'))?.[1]?.trim() || '';
    const l: Lead = { id: id(), name, email, company, message, tools: text(data.tools, 'tools', 600) || parsed('Tools'), volume: text(data.volume, 'volume', 200) || parsed('Volume'), budget: text(data.budget, 'budget', 200), timeline: text(data.timeline, 'timeline', 200), source, sourceDetail: text(data.sourceDetail, 'source detail', 500), sample: data.sample === true, stage: suppression ? 'lost' : 'inquiry', createdAt: now, updatedAt: now, missing: [], qualified: false, qualificationApproved: false, optedOut: suppression?.reason === 'opt-out', declined: suppression?.reason === 'decline', notes: '', notesApproved: false, evidence: [], drafts: [], nextAction: suppression ? 'Closed — no further contact' : 'Review requirements and missing information', dueAt: null, events: [], wonValue: null };
    qualify(l);
    s.leads.push(l);
    event(l, 'inquiry', 'Captured; no response sent');
    audit(s, actor, 'inquiry.capture', l.id);
    return { leadId: l.id, duplicate: false };
}
const getLead = (s: State, key: unknown) => { const l = s.leads.find(l => l.id === key); if (!l)
    throw new OpsError('Lead not found.', 404); return l; };
function draft(l: Lead, kind: string, body: string, extra: Partial<Draft> = {}) { const d: Draft = { id: id(), kind, body, version: 1, approvedVersion: null, createdAt: new Date().toISOString(), evidenceIds: [], ...extra }; l.drafts.push(d); event(l, 'draft', `${kind} prepared for review; nothing sent`); return d; }
function canContact(l: Lead) { if (l.optedOut || l.declined || l.stage === 'lost')
    throw new OpsError('This lead declined or opted out. Contact preparation is blocked.', 409); }
export function publicURL(raw: unknown) { let u: URL; try {
    u = new URL(text(raw, 'source URL', 1000, true));
}
catch {
    throw new OpsError('Use a valid evidence URL.');
} if (u.protocol !== 'https:' || u.username || u.password || u.port || u.search || !['github.com', 'api.github.com', 'raw.githubusercontent.com', 'www.buildzn.com'].includes(u.hostname))
    throw new OpsError('Use an approved public HTTPS evidence URL, without credentials or query parameters.'); if (/github/.test(u.hostname) && !/^\/(?:repos\/)?(?:n8n-io|umair24171|googleapis)\//.test(u.pathname))
    throw new OpsError('Repository is outside the permitted research sources.'); return u.href; }
export function mutate(s: State, action: string, data: Record<string, unknown>, actor = 'operator'): unknown {
    if (action === 'capture')
        return capture(s, data, actor);
    if (['send', 'publish', 'commitment', 'activate'].includes(action))
        throw new OpsError('External sending, publication and recurring activation are unavailable. Export an individually approved draft for manual use.', 403);
    if (action === 'recover-job') {
        const j = s.jobs.find(j => j.id === data.jobId);
        if (!j || j.status !== 'running' || Date.now() - Date.parse(j.startedAt) < 600000)
            throw new OpsError('Only a running job older than ten minutes can be marked interrupted.');
        j.status = 'failed';
        j.finishedAt = new Date().toISOString();
        j.error = 'Manually marked interrupted after inspection. Inspect provider activity before starting another run.';
        audit(s, actor, 'job.recovery', j.id);
        return { jobId: j.id };
    }
    if (action === 'prepare-due-follow-ups') {
        const due = s.leads.filter(l => l.dueAt && Date.parse(l.dueAt) <= Date.now() && !l.optedOut && !l.declined && l.stage !== 'lost');
        for (const lead of due) mutate(s, 'follow-up', {leadId: lead.id}, actor);
        audit(s, actor, 'follow-up.batch-prepared', 'pipeline', `${due.length} drafts; nothing sent`);
        return {drafts: due.length};
    }
    if (action === 'case-study') {
        const project = projects.find(p => p.slug === data.project);
        if (!project || data.evidenceApproved !== true)
            throw new OpsError('Select public project evidence and explicitly approve it.');
        const format = text(data.format, 'format', 30) || 'case-study';
        if (!['case-study', 'walkthrough', 'social'].includes(format))
            throw new OpsError('Unknown content format.');
        const d: Draft = { id: id(), kind: format, version: 1, approvedVersion: null, createdAt: new Date().toISOString(), evidenceIds: project.sources.map(p => p.url), body: format === 'social' ? `${project.name}: ${project.problem}\n\nDocumented scope: ${project.scope}\n\nBoundary: ${project.limitations}\n\nRead the evidence: https://www.buildzn.com/work/${project.slug}\n\nDraft based on approved public evidence. No client outcomes or savings claimed.` : `# ${project.name}\n\nUnpublished ${format} draft based on approved public project evidence.\n\n## Problem\n${project.problem}\n\n## Documented implementation\n${project.scope}\n${project.features.map(f => '- ' + f).join('\n')}\n\n## Decision\n${project.decision}\n\n## Verification\n${project.proof}\n\n## Limitations\n${project.limitations}\n\n## Evidence\n${project.sources.map(p => `- ${p.title}: ${p.url}`).join('\n') || 'Working sample demonstration; no client or live model integration claimed.'}\n\nNo savings, client results or search rankings are claimed.` };
        s.content.push(d);
        audit(s, actor, 'content.draft', d.id, project.slug);
        return { draftId: d.id };
    }
    if (action === 'content-edit' || action === 'content-approve') {
        const d = s.content.find(d => d.id === data.draftId);
        if (!d)
            throw new OpsError('Draft not found.', 404);
        if (action === 'content-edit') {
            d.body = text(data.body, 'body', 30000, true);
            checkSecrets(d.body);
            d.version++;
            d.approvedVersion = null;
        }
        else {
            if (data.version !== d.version)
                throw new OpsError('Draft changed; review the current version.', 409);
            d.approvedVersion = d.version;
            d.approvedAt = new Date().toISOString();
        }
        audit(s, actor, action, d.id);
        return { draftId: d.id };
    }
    const l = getLead(s, data.leadId);
    if (action === 'mark-sample') {
        l.sample = data.sample === true;
        event(l, 'sample-label', l.sample ? 'Controlled or fictional test record' : 'Non-sample record');
    }
    else if (action === 'approve-qualification') {
        canContact(l);
        if (l.missing.length)
            throw new OpsError('Complete missing discovery fields before confirming fit.');
        if (data.fitConfirmed !== true)
            throw new OpsError('Confirm business fit explicitly.');
        l.qualificationApproved = true;
        qualify(l);
        event(l, 'qualification-approval', 'Operator confirmed service fit and discovery readiness');
    }
    else if (action === 'qualify') {
        l.qualificationApproved = false;
        for (const d of l.drafts)
            d.approvedVersion = null;
        for (const field of ['tools', 'volume', 'budget', 'timeline', 'company'] as const)
            if (data[field] !== undefined)
                l[field] = text(data[field], field, 600);
        qualify(l);
        event(l, 'qualification', l.missing.length ? 'Missing: ' + l.missing.join(', ') : 'All discovery fields supplied; fit still requires operator judgment');
    }
    else if (action === 'reply') {
        canContact(l);
        if (!l.email)
            throw new OpsError('A supplied contact address is required for an inquiry reply.');
        draft(l, 'reply', `Hi ${l.name},\n\nThanks for sharing your workflow with BuildZn. I understand the request as:\n${l.message}\n\n${l.missing.length ? 'To assess the scope, could you clarify: ' + l.missing.join(', ') + '?' : 'Please confirm which steps require human approval and provide a sample input and expected output.'}\n\nI’ll review the scope before proposing a price, delivery date or commitment.\n\nUmair · BuildZn`, { recipient: l.email });
    }
    else if (action === 'evidence') {
        const url = publicURL(data.url);
        const date = text(data.date, 'source date', 10, true);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date || date > new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Karachi'}).format(new Date()))
            throw new OpsError('Use a valid source date, not a future date.');
        const body = text(data.text, 'quoted evidence', 12000, true);
        checkSecrets(body);
        if (l.evidence.some(e => e.url === url && e.text === body))
            return { duplicate: true };
        const kind = data.kind === 'supplied-workflow' ? 'supplied-workflow' : 'public-request';
        l.evidence.push({ id: id(), url, date, text: body, reviewed: false, kind });
        event(l, 'evidence', 'Unreviewed evidence added');
    }
    else if (action === 'review-evidence') {
        const e = l.evidence.find(e => e.id === data.evidenceId);
        if (!e)
            throw new OpsError('Evidence not found.');
        e.reviewed = data.approved === true;
        for (const d of l.drafts.filter(d => d.evidenceIds.includes(e.id)))
            d.approvedVersion = null;
        event(l, 'evidence-review', e.reviewed ? 'Evidence reviewed; source reports are not verified defects' : 'Evidence review withdrawn');
    }
    else if (action === 'assessment') {
        const es = l.evidence.filter(e => e.reviewed);
        if (!es.length)
            throw new OpsError('Review evidence before an assessment.');
        const fit = /workflow|automat|agent|api|integration|webhook|repetitive/i.test(l.message + ' ' + es.map(e => e.text).join(' '));
        draft(l, 'assessment', `## Verified observations\n${es.map(e => `- Reviewer accepted evidence ${e.id}: ${e.text}\n  Source: ${e.url} (${e.date}). This records a supplied or public report, not a verified runtime defect.`).join('\n')}\n\n## Business fit\n${fit ? 'Potential fit with workflow automation, API integrations or automation repair.' : 'Fit is uncertain; discovery required before outreach.'}\n\n## Proposed assessment\nMap input, validation, owner approval and downstream output. Reproduce failures with a sample workflow, add duplicate prevention and test recovery.\n\n## Assumptions to verify\nSystem access, ownership, permissions, workload, API constraints and expected output are unknown. No savings estimate or guaranteed result.`, { evidenceIds: es.map(e => e.id) });
    }
    else if (action === 'outreach') {
        canContact(l);
        const a = l.drafts.find(d => d.kind === 'assessment' && d.approvedVersion === d.version);
        if (!a)
            throw new OpsError('Approve an evidence-grounded assessment first.');
        draft(l, 'outreach', `Hi ${l.name},\n\nI read your public request: ${l.evidence.find(e => a.evidenceIds.includes(e.id))?.url}. BuildZn builds AI agents and automations that handle repetitive business work.\n\nA possible approach is to map the failing step, reproduce it with a sample and add validation and a human review gate. I have not inspected your runtime and cannot promise an outcome.\n\nWould a short workflow review be useful? If you prefer no contact, I’ll respect that.\n\nUmair · BuildZn`, { recipient: l.email, evidenceIds: a.evidenceIds });
    }
    else if (action === 'discovery') {
        l.notes = text(data.notes, 'discovery notes', 12000, true);
        checkSecrets(l.notes);
        l.notesApproved = false;
        for (const d of l.drafts.filter(d => d.kind === 'proposal'))
            d.approvedVersion = null;
        event(l, 'discovery', 'Notes saved; approval required');
    }
    else if (action === 'approve-discovery') {
        if (!l.notes)
            throw new OpsError('Discovery notes are empty.');
        if (data.notesHash !== hash(l.notes))
            throw new OpsError('Notes changed; review again.', 409);
        l.notesApproved = true;
        event(l, 'discovery-approval', 'Notes approved for proposal preparation');
    }
    else if (action === 'proposal') {
        canContact(l);
        if (!l.notesApproved)
            throw new OpsError('Approve discovery notes before drafting a proposal.');
        const price = Number(data.price);
        if (!Number.isFinite(price) || price <= 0 || price > 100000)
            throw new OpsError('Enter an internal proposed price between 0 and 100000 USD.');
        draft(l, 'proposal', `# BuildZn · Inquiry workflow pilot\n\nUnsent proposal draft — proposed price and all commitments require individual approval.\n\n## Approved discovery\n${l.notes}\n\n## Deliverables\nOne bounded workflow; validated intake; duplicate prevention; private lead records; editable reply drafts; explicit human approval; failure recovery; documented handover. Final tools and integration scope must match discovery.\n\n## Milestones and acceptance\n1. Confirm inputs, permissions, data map and sample acceptance cases.\n2. Implement the agreed workflow and failure paths.\n3. Validate duplicates, missing data, access control and recovery with controlled inputs.\n4. Review acceptance results and hand over operating notes.\nDates to be agreed after access and scope approval.\n\n## Dependencies\nClient supplies authorized system access, sample records, an accountable reviewer and provider quota.\n\n## Exclusions\nUnattended sending, bulk prospect lists, additional integrations, OCR, migrations and performance guarantees unless explicitly scoped.\n\n## Proposed price\nUSD ${price.toFixed(2)}, an internal estimate for review, not a public quote. Taxes, provider usage and hosting are excluded. Payment terms require explicit agreement.\n\n## Maintenance\nProposed 14-day defect correction period after accepted handover for the agreed scope. Ongoing monitoring, provider changes and feature work are separately scoped. No ongoing service starts automatically.`, { price, currency: 'USD', recipient: l.email });
    }
    else if (action === 'edit-draft' || action === 'approve-draft') {
        const d = l.drafts.find(d => d.id === data.draftId);
        if (!d)
            throw new OpsError('Draft not found.');
        if (action === 'edit-draft') {
            d.body = text(data.body, 'draft body', 30000, true);
            checkSecrets(d.body);
            if (d.kind === 'proposal' && data.price !== undefined) {
                const value = Number(data.price);
                if (!Number.isFinite(value) || value <= 0 || value > 100000)
                    throw new OpsError('Invalid proposed price.');
                d.price = value;
            }
            d.version++;
            d.approvedVersion = null;
        }
        else {
            if (['reply', 'outreach', 'proposal', 'follow-up'].includes(d.kind))
                canContact(l);
            if (d.kind === 'proposal' && !d.body.includes(`USD ${d.price?.toFixed(2)}`))
                throw new OpsError('Proposal text must match the recorded proposed USD price. Edit and save both before approval.');
            if (d.kind === 'proposal' && !l.notesApproved)
                throw new OpsError('Discovery approval was revoked. Recreate this proposal after review.');
            if (data.version !== d.version)
                throw new OpsError('Draft changed; approve the current version.', 409);
            if (d.evidenceIds.some(key => !l.evidence.some(e => e.id === key && e.reviewed)))
                throw new OpsError('Evidence approval is no longer valid.');
            d.approvedVersion = d.version;
            d.approvedAt = new Date().toISOString();
        }
        event(l, action, `${d.kind} version ${d.version}`);
    }
    else if (action === 'stage') {
        const next = data.stage as Stage;
        if (!stages.includes(next))
            throw new OpsError('Invalid stage.');
        const allowed: Record<Stage, Stage[]> = { inquiry: ['discovery', 'lost'], discovery: ['proposal', 'lost'], proposal: ['discovery', 'won', 'lost'], won: ['handoff'], lost: [], handoff: [] };
        if (!allowed[l.stage].includes(next))
            throw new OpsError('Invalid pipeline transition.', 409);
        if (next === 'proposal' || next === 'won') {
            if (!l.drafts.some(d => d.kind === 'proposal' && d.approvedVersion === d.version))
                throw new OpsError('An approved current proposal is required.');
        }
        if (next === 'won') {
            if (data.agreementConfirmed !== true)
                throw new OpsError('Record the externally confirmed agreement before marking won.');
            l.wonValue = l.drafts.filter(d => d.kind === 'proposal' && d.approvedVersion === d.version).at(-1)?.price ?? null;
        }
        if (next === 'handoff')
            draft(l, 'handoff', `Delivery handoff\n\nApproved discovery: ${l.notes}\n\nConfirm access owner, final scope, acceptance criteria, backup, incident contact and maintenance agreement before work starts.\n\nSource: ${l.source}. Approved proposal: ${l.drafts.filter(d => d.kind === 'proposal' && d.approvedVersion === d.version).at(-1)?.id}`);
        l.stage = next;
        if (next === 'lost') {
            l.dueAt = null;
            l.nextAction = 'Closed — no further contact';
        }
        event(l, 'stage', next);
    }
    else if (action === 'schedule') {
        canContact(l);
        const due = text(data.dueAt, 'follow-up date', 40, true);
        if (!/(?:Z|[+-]\d{2}:\d{2})$/.test(due) || Number.isNaN(Date.parse(due)) || Date.parse(due) <= Date.now())
            throw new OpsError('Choose a future follow-up time.');
        l.dueAt = new Date(due).toISOString();
        l.nextAction = text(data.nextAction, 'next action', 500, true);
        event(l, 'schedule', l.dueAt);
    }
    else if (action === 'follow-up') {
        canContact(l);
        if (!l.dueAt || Date.parse(l.dueAt) > Date.now())
            throw new OpsError('Follow-up is not due.');
        const kind = l.stage === 'proposal' ? 'proposal review' : 'workflow discovery';
        draft(l, 'follow-up', `Hi ${l.name},\n\nWould you like to continue the ${kind} for your request? There is no obligation. If timing has changed or you prefer no follow-up, let me know and I’ll close the loop.\n\nUmair · BuildZn`, { recipient: l.email });
        l.dueAt = null;
        l.nextAction = 'Review follow-up draft';
    }
    else if (action === 'opt-out' || action === 'decline') {
        s.suppressed ||= {};
        if (l.email) {
            s.suppressed[hash(l.email)] = {reason:action, at:new Date().toISOString()};
            for (const related of s.leads.filter(other => other.email === l.email && other.id !== l.id)) {
                related.optedOut = action === 'opt-out'; related.declined = action === 'decline'; related.stage = 'lost'; related.dueAt = null; related.nextAction = 'Closed — no further contact';
                for (const d of related.drafts) d.approvedVersion = null;
                qualify(related); event(related,action,'Contact preference applied across matching supplied email records');
            }
        }
        l.optedOut = action === 'opt-out';
        l.declined = action === 'decline';
        l.stage = 'lost';
        l.dueAt = null;
        l.nextAction = 'Closed — no further contact';
        for (const d of l.drafts)
            d.approvedVersion = null;
        qualify(l);
        event(l, action, 'All contact approvals revoked and reminders cancelled');
    }
    else if (action === 'call') {
        const details = text(data.detail, 'call record', 2000, true);
        event(l, 'call', details);
    }
    else
        throw new OpsError('Unknown action.');
    audit(s, actor, action, l.id);
    return { leadId: l.id };
}
export function command(s: State, action: string, data: Record<string, unknown>, key: string, actor = 'operator') { if (!/^[\w-]{8,100}$/.test(key))
    throw new OpsError('A valid operation ID is required.'); const receipt = s.receipts[key]; if (receipt) {
    if (receipt.signature !== hash({ action, data }))
        throw new OpsError('Operation ID was already used for different data.', 409);
    return receipt.result;
} const result = mutate(s, action, data, actor); s.receipts[key] = { at: new Date().toISOString(), result, signature: hash({ action, data }) }; return result; }
export function report(s: State, includeSamples = false) { const leads = s.leads.filter(l => includeSamples || !l.sample); const sources = [...new Set(leads.map(l => l.source))]; return { basis: includeSamples ? 'Sample-inclusive observed records — not live acquisition performance' : 'Observed non-sample records only; won amounts are recorded agreements, not collected revenue', sources: sources.map(source => { const ls = leads.filter(l => l.source === source); return { source, inquiries: ls.length, qualified: ls.filter(l => l.qualified).length, calls: ls.filter(l => l.events.some(e => e.type === 'call')).length, proposals: ls.filter(l => l.events.some(e => e.type === 'stage' && e.detail === 'proposal')).length, won: ls.filter(l => l.events.some(e => e.type === 'stage' && e.detail === 'won')).length, recordedAgreementValue: ls.reduce((sum, l) => sum + (l.wonValue || 0), 0) }; }), unattributed: leads.filter(l => l.source === 'direct' || l.source === 'unknown').length, estimatedSavings: null, marketSearchVolume: null }; }
