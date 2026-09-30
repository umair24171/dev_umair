import { cookies } from 'next/headers';
import { body, cookieName, failure, makeSession, passwordMatches, sameOrigin } from '@/lib/ops/auth';
import { hash, OpsError, audit } from '@/lib/ops/core';
import { transaction } from '@/lib/ops/store';
export const runtime = 'nodejs';
export async function POST(request: Request) { try {
    sameOrigin(request);
    const data = await body(request);
    const bucket = hash(request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-forwarded-for') || 'local');
    const allowed = await transaction(s => { const now = Date.now(); let slot = s.security[bucket]; if (!slot || slot.until < now)
        slot = s.security[bucket] = { count: 0, until: now + 900000 }; slot.count++; for (const [k, v] of Object.entries(s.security))
        if (v.until < now)
            delete s.security[k]; return slot.count <= 5; });
    if (!allowed)
        throw new OpsError('Too many login attempts. Try again in 15 minutes.', 429);
    if (!passwordMatches(data.password))
        throw new OpsError('Incorrect operations password.', 401);
    await transaction(s => { audit(s, 'owner', 'session.login', 'owner'); });
    (await cookies()).set(cookieName, makeSession(), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 8 * 3600 });
    return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}
catch (e) {
    return failure(e);
} }
export async function DELETE(request: Request) { try {
    sameOrigin(request);
    (await cookies()).delete(cookieName);
    return Response.json({ ok: true });
}
catch (e) {
    return failure(e);
} }
