import { failure, requireAuth } from '@/lib/ops/auth';
import { OpsError, audit } from '@/lib/ops/core';
import { transaction } from '@/lib/ops/store';
export async function GET(request: Request) { try {
    await requireAuth();
    const u = new URL(request.url);
    const body = await transaction(state => { const d = state.content.find(d => d.id === u.searchParams.get('draft')) || state.leads.flatMap(l => l.drafts).find(d => d.id === u.searchParams.get('draft')); if (!d || d.approvedVersion !== d.version)
        throw new OpsError('Approve this exact draft version before export.', 403); const lead = state.leads.find(l => l.drafts.some(x => x.id === d.id)); if (lead && (lead.optedOut || lead.declined))
        throw new OpsError('Export blocked for a closed contact.', 403); audit(state, 'owner', 'draft.export', d.id, `${d.kind} version ${d.version}; manual use only`); return d.body; });
    return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Content-Disposition': `attachment; filename="buildzn-approved-draft.md"`, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
}
catch (e) {
    return failure(e);
} }
