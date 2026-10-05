import crypto from 'node:crypto';
import { capture, type State } from './core';
import { transaction } from './store';
import { site } from '../site';
export type InquiryNotification = { status: 'pending' | 'sending' | 'accepted' | 'failed' | 'uncertain' | 'disabled'; attempts: number; createdAt: string; claim?: string; claimedAt?: string; finishedAt?: string; error?: string };
export function notificationsEnabled() { return process.env.VERCEL === '1' && process.env.OPS_INQUIRY_NOTIFICATIONS !== 'disabled'; }
export function captureWithNotification(s: State, data: Record<string, unknown>, enabled = notificationsEnabled()) {
  const result = capture(s, data, 'website');
  s.inquiryNotifications ||= {};
  if (!result.duplicate) s.inquiryNotifications[result.leadId] = { status: enabled ? 'pending' : 'disabled', attempts: 0, createdAt: new Date().toISOString() };
  return result;
}
export function claimNotification(s: State, leadId: string, now = Date.now()) {
  const notification = s.inquiryNotifications?.[leadId];
  if (!notification) return { status: 'disabled' as const };
  // Formspree has no documented idempotency contract. Never resend an ambiguous attempt.
  if (notification.status === 'sending' && now - Date.parse(notification.claimedAt || '') > 120000) {
    notification.status = 'uncertain'; notification.error = 'An interrupted attempt needs inbox reconciliation. Automatic resend is blocked.';
  }
  if (!['pending', 'failed'].includes(notification.status) || notification.attempts >= 3) return { status: notification.status };
  if (!s.leads.some(l => l.id === leadId)) return { status: 'disabled' as const };
  notification.status = 'sending'; notification.attempts++; notification.claim = crypto.randomUUID(); notification.claimedAt = new Date(now).toISOString(); delete notification.error;
  return { status: 'sending' as const, claim: notification.claim };
}
export function finishNotification(s: State, leadId: string, claim: string, status: 'accepted' | 'failed' | 'uncertain', error = '') {
  const n = s.inquiryNotifications?.[leadId];
  if (!n || n.claim !== claim || n.status !== 'sending') return;
  n.status = status; n.finishedAt = new Date().toISOString(); n.error = error;
  s.audit.push({ id: crypto.randomUUID(), at: n.finishedAt, actor: 'inquiry-notification', action: `inquiry.email.${status}`, target: leadId, detail: error || 'Email service accepted an owner notification; inbox delivery is not asserted.' });
}
// Alerts contain a record reference only; the visitor's details stay in private operations.
export function notificationPayload(leadId: string) {
  return { name: 'BuildZn inquiry notification', email: site.email, subject: `New BuildZn inquiry · ${leadId}`, message: `A website brief was saved in BuildZn’s private operations workspace.\nReference: ${leadId}\nReview: ${site.url}/ops\n\nThis is an owner notification, not a visitor receipt or sales message. Open the private workspace to read the brief and prepare a personal response.` };
}
type Transaction = typeof transaction;
export async function deliverNotification(leadId: string, options: { transact?: Transaction; send?: typeof fetch; enabled?: boolean } = {}) {
  if (!(options.enabled ?? notificationsEnabled())) return 'disabled' as const;
  const transact = options.transact || transaction, send = options.send || fetch;
  const attempt = await transact(s => claimNotification(s, leadId));
  if (!attempt.claim) return attempt.status;
  let status: 'accepted' | 'failed' | 'uncertain' = 'uncertain', error = 'Delivery is uncertain. Inspect the owner inbox before any manual recovery; no automatic resend.';
  try {
    const response = await send(`https://formspree.io/f/${site.formId}`, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(notificationPayload(leadId)), signal: AbortSignal.timeout(8000), redirect: 'error' });
    if (response.ok && (await response.json()).ok === true) { status = 'accepted'; error = ''; }
    else if ([400, 401, 403, 404, 413, 422, 429].includes(response.status)) { status = 'failed'; error = `Email service rejected the attempt (HTTP ${response.status}). The saved inquiry is intact; at most three inspected attempts are allowed.`; }
  } catch { /* Timeouts and malformed/5xx responses are ambiguous: do not replay a send. */ }
  await transact(s => finishNotification(s, leadId, attempt.claim!, status, error));
  return status;
}
