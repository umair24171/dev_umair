import { body, failure, sameOrigin } from '@/lib/ops/auth';
import { capture, hash, OpsError } from '@/lib/ops/core';
import { transaction } from '@/lib/ops/store';
export const runtime = 'nodejs';
export const maxDuration = 60;
export async function POST(request: Request) { try {
    sameOrigin(request);
    const data = await body(request);
    if (data._gotcha)
        return Response.json({ accepted: true });
    const ip = hash(request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-forwarded-for') || 'local');
    await transaction(s => { const now = Date.now(), key = 'intake-' + ip; let slot = s.security[key]; if (!slot || slot.until < now)
        slot = s.security[key] = { count: 0, until: now + 3600000 }; if (slot.count >= 10)
        throw new OpsError('Too many inquiries. Please try again later.', 429); slot.count++; return capture(s, { ...data, sample: false, source: typeof data.source === 'string' && ['direct', 'search', 'referral', 'social', 'public-request'].includes(data.source) ? data.source : 'direct' }, 'website'); });
    return Response.json({ accepted: true }, { headers: { 'Cache-Control': 'no-store' } });
}
catch (e) {
    return failure(e);
} }
