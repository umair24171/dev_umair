import { body, failure, requireAuth, sameOrigin } from '@/lib/ops/auth';
import { deliverNotification } from '@/lib/ops/inquiry-mail';
import { OpsError } from '@/lib/ops/core';
export const runtime = 'nodejs';
export const maxDuration = 60;
export async function POST(request: Request) {
  try { await requireAuth(); sameOrigin(request); const data = await body(request);
    if (typeof data.leadId !== 'string' || !/^[a-f0-9-]{36}$/.test(data.leadId)) throw new OpsError('A stored notification reference is required.');
    return Response.json({ ownerNotification: await deliverNotification(data.leadId) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) { return failure(e); }
}
