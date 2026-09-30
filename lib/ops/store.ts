import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { initialState, OpsError, type State } from './core';
function encryptionKey() { const value = process.env.OPS_DATA_KEY; if (!value || !/^[a-f0-9]{64}$/.test(value))
    throw new OpsError('Private storage encryption is not configured.', 503); return Buffer.from(value, 'hex'); }
export function encrypt(state: State) { const iv = crypto.randomBytes(12), cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey(), iv); return JSON.stringify({ v: 1, iv: iv.toString('base64'), tag: (() => { const data = Buffer.concat([cipher.update(JSON.stringify(state)), cipher.final()]); return { data: data.toString('base64'), tag: cipher.getAuthTag().toString('base64') }; })() }); }
export function decrypt(raw: string): State { const p = JSON.parse(raw); if (p.v !== 1)
    throw new OpsError('Unsupported storage format.', 503); const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey(), Buffer.from(p.iv, 'base64')); decipher.setAuthTag(Buffer.from(p.tag.tag, 'base64')); const s = JSON.parse(Buffer.concat([decipher.update(Buffer.from(p.tag.data, 'base64')), decipher.final()]).toString()); if (s.version !== 1 || !Array.isArray(s.leads) || !Array.isArray(s.audit))
    throw new OpsError('Storage is invalid. Restore a verified backup.', 503); return s; }
function repo() { const r = process.env.OPS_STORE_REPO; if (!r || !/^[-\w]+\/[-\w]+$/.test(r) || r === 'umair24171/dev_umair')
    throw new OpsError('A separate private storage repository is required.', 503); return r; }
async function api(endpoint: string, method = 'GET', body?: unknown) { const token = process.env.OPS_STORE_TOKEN; if (!token)
    throw new OpsError('Private storage access is not configured.', 503); let response: Response | undefined; for (let i = 0; i < 3; i++) {
    try {
        response = await fetch(`https://api.github.com/repos/${repo()}${endpoint}`, { method, headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}), cache: 'no-store', signal: AbortSignal.timeout(10000) });
    }
    catch {
        if (i === 2)
            throw new OpsError('Private storage timed out. Retry with the same operation ID.', 503);
        continue;
    }
    if (![429, 500, 502, 503, 504].includes(response.status))
        return response;
    await new Promise(r => setTimeout(r, 250 * 2 ** i));
} throw new OpsError('Private storage unavailable. Retry with the same operation ID.', 503); }
async function readRemote() { const metadata = await api(''); if (!metadata.ok || (await metadata.json()).private !== true)
    throw new OpsError('Storage must be a private repository. Access is blocked.', 503); const r = await api('/contents/state.enc?ref=main'); if (r.status === 404)
    return { state: initialState(), sha: undefined }; if (!r.ok)
    throw new OpsError('Cannot read private storage.', 503); const d = await r.json(); return { state: decrypt(Buffer.from(d.content, 'base64').toString()), sha: d.sha as string }; }
function localFile() { if (process.env.VERCEL || process.env.NODE_ENV === 'production' && !process.env.OPS_LOCAL_STORE)
    throw new OpsError('Durable private storage is required in production.', 503); return process.env.OPS_LOCAL_STORE || path.join(process.cwd(), 'work/private-ops/state.enc'); }
export function storageMode() { return process.env.OPS_STORE_REPO ? 'Encrypted private GitHub repository · live durable storage' : 'Encrypted local file · development only'; }
export async function readState() { if (process.env.OPS_STORE_REPO)
    return (await readRemote()).state; const file = localFile(); try {
    return decrypt(await fs.readFile(file, 'utf8'));
}
catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT')
        return initialState();
    throw e;
} }
// The callback must be deterministic and side-effect free: CAS conflicts can replay it.
export async function transaction<T>(fn: (s: State) => T): Promise<T> {
    if (process.env.OPS_STORE_REPO) {
        for (let i = 0; i < 5; i++) {
            const { state, sha } = await readRemote();
            const result = fn(state);
            state.revision++;
            const content = encrypt(state);
            if (Buffer.byteLength(content) > 700000)
                throw new OpsError('Storage limit reached; export and migrate before continuing.', 503);
            const r = await api('/contents/state.enc', 'PUT', { message: 'Update encrypted operations state', content: Buffer.from(content).toString('base64'), branch: 'main', ...(sha ? { sha } : {}) });
            if (r.ok)
                return result;
            if ([409, 422].includes(r.status)) {
                await new Promise(r => setTimeout(r, 100 * (i + 1)));
                continue;
            }
            throw new OpsError('Cannot save private storage. Retry the same operation ID.', 503);
        }
        throw new OpsError('Concurrent update conflict. Retry the same operation ID.', 409);
    }
    const file = localFile();
    await fs.mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
    const lock = file + '.lock';
    let acquired = false;
    for (let i = 0; i < 50; i++) {
        try {
            await fs.mkdir(lock);
            acquired = true;
            break;
        }
        catch (e) {
            if ((e as NodeJS.ErrnoException).code !== 'EEXIST')
                throw e;
            await new Promise(r => setTimeout(r, 20));
        }
    }
    if (!acquired)
        throw new OpsError('Storage lock busy. Verify no active writer before removing a stale .lock directory.', 503);
    try {
        const state = await readState();
        const result = fn(state);
        state.revision++;
        const tmp = file + '.' + crypto.randomUUID();
        await fs.writeFile(tmp, encrypt(state), { mode: 0o600 });
        await fs.rename(tmp, file);
        return result;
    }
    finally {
        await fs.rmdir(lock);
    }
}
