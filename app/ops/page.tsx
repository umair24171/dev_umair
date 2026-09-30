import type { Metadata } from 'next';
import { authenticated } from '@/lib/ops/auth';
import { readState, storageMode } from '@/lib/ops/store';
import Workspace from './workspace';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Operations', robots: { index: false, follow: false }, referrer: 'no-referrer' };
export default async function Operations() { const signedIn = await authenticated(); let state = null, error = ''; if (signedIn) {
    try {
        state = await readState();
    }
    catch {
        error = 'Private storage is unavailable. No records have been discarded. Retry after checking account access.';
    }
} return <main id="main-content" className="ops-root"><Workspace initial={state} signedIn={signedIn} storage={signedIn ? storageMode() : ''} initialError={error}/></main>; }
