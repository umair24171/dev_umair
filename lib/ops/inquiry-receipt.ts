import crypto from 'node:crypto';
import { hash, type State } from './core';
import { transaction } from './store';
export type VisitorReceipt = { status: 'disabled' | 'pending' | 'sending' | 'accepted' | 'rejected' | 'uncertain' | 'suppressed'; createdAt: string; claim?: string; claimedAt?: string; finishedAt?: string };
export type ReceiptMessage = { to: string; subject: string; text: string; idempotencyKey: string };
export type ReceiptTransport = { senderVerified: boolean; send: (message: ReceiptMessage) => Promise<'accepted' | 'rejected' | 'uncertain'> };
type Configuration = { enabled?: boolean; replyTime?: string; transport?: ReceiptTransport };
// Activation requirement: select a transactional provider, verify the sender, agree reply time and add its server-only adapter.
// There is deliberately no live transport or environment-only switch for sending.
export function receiptReady(config: Configuration = {}) { return config.enabled === true && config.transport?.senderVerified === true && !!config.replyTime?.trim(); }
export function queueReceipt(s: State, leadId: string, config: Configuration = {}, now = Date.now()) {
  s.visitorReceipts ||= {};
  if (s.visitorReceipts[leadId]) return;
  const lead = s.leads.find(l => l.id === leadId);
  if (!lead) return;
  let status: VisitorReceipt['status'] = 'disabled';
  if (receiptReady(config)) {
    const key = 'visitor-receipt-' + hash(lead.email);
    let slot = s.security[key];
    if (!slot || slot.until <= now) slot = s.security[key] = { count: 0, until: now + 86400000 };
    status = slot.count >= 1 || lead.optedOut || lead.declined ? 'suppressed' : 'pending';
    if (status === 'pending') slot.count++;
  }
  s.visitorReceipts[leadId] = { status, createdAt: new Date(now).toISOString() };
}
export function receiptMessage(to: string, leadId: string, replyTime: string): ReceiptMessage {
  return { to, idempotencyKey: 'inquiry-receipt-' + leadId, subject: 'Your BuildZn inquiry',
    text: 'I received your workflow inquiry through buildzn.com.\n\nExpected reply: ' + replyTime.trim() + '.\n\nThis confirmation does not add you to a sales sequence.\n\nUmair / BuildZn' };
}
export async function deliverReceipt(leadId: string, config: Configuration & { transact?: typeof transaction } = {}) {
  if (!receiptReady(config)) return 'disabled' as const;
  const transact = config.transact || transaction;
  const attempt = await transact(s => {
    const receipt = s.visitorReceipts?.[leadId], lead = s.leads.find(l => l.id === leadId);
    if (!receipt || !lead) return { status: 'disabled' as const };
    if (receipt.status === 'sending' && Date.now() - Date.parse(receipt.claimedAt || '') > 120000) receipt.status = 'uncertain';
    if (receipt.status !== 'pending') return { status: receipt.status };
    if (lead.optedOut || lead.declined) { receipt.status = 'suppressed'; return { status: receipt.status }; }
    receipt.status = 'sending'; receipt.claim = crypto.randomUUID(); receipt.claimedAt = new Date().toISOString();
    return { status: receipt.status, claim: receipt.claim, to: lead.email };
  });
  if (!attempt.claim || !attempt.to) return attempt.status;
  let status: 'accepted' | 'rejected' | 'uncertain' = 'uncertain';
  try { status = await config.transport!.send(receiptMessage(attempt.to, leadId, config.replyTime!)); } catch { /* Ambiguous sends are never retried automatically. */ }
  await transact(s => {
    const receipt = s.visitorReceipts?.[leadId];
    if (receipt?.status !== 'sending' || receipt.claim !== attempt.claim) return;
    receipt.status = status; receipt.finishedAt = new Date().toISOString();
    s.audit.push({ id: crypto.randomUUID(), at: receipt.finishedAt, actor: 'visitor-receipt', action: 'inquiry.receipt.' + status, target: leadId, detail: 'Transactional receipt status only; no inquiry content.' });
  });
  return status;
}
