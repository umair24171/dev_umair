import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { OpsError } from './core';
export const cookieName = 'buildzn-ops';
function secret() { const s = process.env.OPS_SESSION_SECRET; if (!s || s.length < 48)
    throw new OpsError('Operations authentication is not configured.', 503); return s; }
export function makeSession(now = Date.now()) { const payload = Buffer.from(JSON.stringify({ role: 'owner', expires: now + 8 * 3600000, nonce: crypto.randomBytes(16).toString('hex') })).toString('base64url'); return payload + '.' + crypto.createHmac('sha256', secret()).update(payload).digest('base64url'); }
export function validSession(value: string, now = Date.now()) { try {
    const [payload, sig] = value.split('.');
    const expected = crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
    if (!sig || sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected)))
        return false;
    const p = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return p.role === 'owner' && p.expires > now && p.expires <= now + 8 * 3600000;
}
catch {
    return false;
} }
export function passwordMatches(password: unknown) { if (typeof password !== 'string' || password.length > 300)
    return false; const configured = process.env.OPS_PASSWORD_HASH; if (!configured)
    throw new OpsError('Operations login is not configured.', 503); const [salt, digest] = configured.split(':'); if (!salt || !digest)
    return false; const value = crypto.scryptSync(password, salt, 64).toString('hex'); return digest.length === value.length && crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(value)); }
export async function authenticated() { return validSession((await cookies()).get(cookieName)?.value || ''); }
export async function requireAuth() { if (!await authenticated())
    throw new OpsError('Sign in to operations.', 401); }
export function sameOrigin(request: Request) { const origin = request.headers.get('origin'); const url = new URL(request.url); const expected = process.env.OPS_PUBLIC_ORIGIN || `${url.protocol}//${request.headers.get('host') || url.host}`; if (origin !== expected)
    throw new OpsError('Request origin is not permitted.', 403); }
export async function body(request: Request) { if (!request.headers.get('content-type')?.includes('application/json'))
    throw new OpsError('JSON is required.', 415); const raw = await request.text(); if (raw.length > 60000)
    throw new OpsError('Request is too large.', 413); let parsed; try {
    parsed = JSON.parse(raw);
}
catch {
    throw new OpsError('Invalid JSON.');
} if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
    throw new OpsError('An object is required.'); return parsed as Record<string, unknown>; }
export function failure(error: unknown) { return Response.json({ error: error instanceof OpsError ? error.message : 'Operation failed safely. Retry with the same operation ID or inspect private diagnostics.' }, { status: error instanceof OpsError ? error.status : 503, headers: { 'Cache-Control': 'no-store' } }); }
