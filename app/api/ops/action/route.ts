import { body, failure, requireAuth, sameOrigin } from '@/lib/ops/auth';
import { command } from '@/lib/ops/core';
import { readState, transaction } from '@/lib/ops/store';
import { researchJob, editorialPlan, editorialJob } from '@/lib/ops/jobs';
export const runtime = 'nodejs';
export const maxDuration = 300;
export async function GET() { try {
    await requireAuth();
    const state = await readState();
    state.config.jobsEnabled = process.env.OPS_JOBS_ENABLED === 'true';
    return Response.json(state, { headers: { 'Cache-Control': 'no-store' } });
}
catch (e) {
    return failure(e);
} }
export async function POST(request: Request) { try {
    await requireAuth();
    sameOrigin(request);
    const data = await body(request);
    const action = String(data.action || '');
    const key = String(data.key || '');
    const input = (data.data || {}) as Record<string, unknown>;
    const result = action === 'discover' ? await researchJob(key) : action === 'seo-plan' ? await editorialPlan(input, key) : action === 'article' ? await editorialJob(input, key) : await transaction(s => command(s, action, input, key));
    return Response.json({ ok: true, result }, { headers: { 'Cache-Control': 'no-store' } });
}
catch (e) {
    return failure(e);
} }
