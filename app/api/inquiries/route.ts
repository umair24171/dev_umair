import { captureWithNotification, deliverNotification } from '@/lib/ops/inquiry-mail';
import { body, failure, sameOrigin } from '@/lib/ops/auth';
import { hash, OpsError } from '@/lib/ops/core';
import { transaction } from '@/lib/ops/store';
export const runtime = 'nodejs';
export const maxDuration = 60;
export async function POST(request: Request) { try {
    sameOrigin(request);
    const data = await body(request);
    if (data._gotcha)
        return Response.json({ accepted: true });
    const ip = hash(request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-forwarded-for') || 'local');
    const saved = await transaction(s => { const now = Date.now(), key = 'intake-' + ip; let slot = s.security[key]; if (!slot || slot.until < now)
        slot = s.security[key] = { count: 0, until: now + 3600000 }; if (slot.count >= 10)
        throw new OpsError('Too many inquiries. Please try again later.', 429); slot.count++; return captureWithNotification(s, { ...data, sample: false, source: typeof data.source === 'string' && ['direct', 'search', 'referral', 'social', 'public-request'].includes(data.source) ? data.source : 'direct' }); });
    let ownerNotification = 'uncertain';
    try { ownerNotification = await deliverNotification(saved.leadId); } catch { /* Inquiry is already durable; mail/storage diagnostics must not reverse acceptance. */ }
    return Response.json({ accepted: true, ownerNotification, receipt: 'on-screen' }, { headers: { 'Cache-Control': 'no-store' } });
}
catch (e) {
    return failure(e);
} }
