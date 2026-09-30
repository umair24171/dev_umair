export const inquirySamples = {
  complete: 'Name: Alex Morgan\nEmail: alex@example.com\nCompany: Sample Studio\nTools: Website form, spreadsheet, CRM\nRequest: Capture service inquiries, structure requirements and draft a reply for approval.\nVolume: 25 inquiries per week',
  incomplete: 'Name: Sam Lee\nCompany: Sample Services\nRequest: Route new inquiries to the right person.',
};
export function parseInquiry(input: string) {
  const get = (label: string) => input.match(new RegExp(`^${label}:[ \t]*([^\\r\\n]+)$`, 'im'))?.[1]?.trim() || '';
  const contact = { name: get('Name'), email: get('Email'), company: get('Company') };
  const requirements = { request: get('Request'), tools: get('Tools'), volume: get('Volume') };
  const missing = [!contact.name && 'Contact name', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) && 'Valid email', !requirements.request && 'Business task', !requirements.tools && 'Tools involved'].filter(Boolean) as string[];
  return { contact, requirements, missing };
}
export const knowledge = [
  { id: 'KB-01', title: 'Sample delivery policy', text: 'Standard delivery takes 3–5 business days after dispatch. Tracking is emailed when the order ships.' },
  { id: 'KB-02', title: 'Sample returns policy', text: 'Unused items may be returned within 14 days of delivery. Contact support with the order number before returning an item.' },
  { id: 'KB-03', title: 'Sample support hours', text: 'The support team handles requests Monday to Friday, 09:00–17:00 UTC. This is a fictional policy for the demonstration.' },
];
export function answerSupport(question: string) {
  const q = question.trim().toLowerCase();
  const records = [
    { pattern: /^(how long does (standard )?(shipping|delivery) take|when will my order arrive)\??$/, source: knowledge[0], answer: 'Standard delivery takes 3–5 business days after dispatch. Tracking is emailed when your order ships.' },
    { pattern: /^(can i return an unused item|what is (the |your )?returns? policy)\??$/, source: knowledge[1], answer: 'Unused items may be returned within 14 days of delivery. Contact support with your order number before returning an item.' },
    { pattern: /^(when is support open|what are (the |your )?support hours)\??$/, source: knowledge[2], answer: 'Sample support hours are Monday to Friday, 09:00–17:00 UTC.' },
  ];
  const match = records.find(r => r.pattern.test(q));
  return match ? { status: 'grounded' as const, answer: match.answer, sources: [match.source], handoff: '' } : { status: 'handoff' as const, answer: 'The sample knowledge base does not support a reliable answer to this question. A person should review it.', sources: [], handoff: `Review requested: ${question.trim()}\nReason: outside verified sample coverage. No reply sent or ticket created.` };
}
export const invoiceSamples = {
  valid: 'Supplier: Sample Paper Co\nInvoice: DEMO-1042\nDate: 2026-09-28\nCurrency: USD\nSubtotal: 240.00\nTax: 24.00\nTotal: 264.00',
  mismatch: 'Supplier: Sample Paper Co\nInvoice: DEMO-1043\nDate: 2026-09-28\nCurrency: USD\nSubtotal: 240.00\nTax: 24.00\nTotal: 280.00',
};
export type Invoice = { supplier: string; invoice: string; date: string; currency: string; subtotal: string; tax: string; total: string };
export function extractInvoice(input: string): Invoice {
  const get = (label: string) => input.match(new RegExp(`^${label}:[ \t]*([^\\r\\n]+)$`, 'im'))?.[1]?.trim() || '';
  return { supplier: get('Supplier'), invoice: get('Invoice'), date: get('Date'), currency: get('Currency'), subtotal: get('Subtotal'), tax: get('Tax'), total: get('Total') };
}
export function validateInvoice(fields: Invoice): string[] {
  const errors: string[] = [];
  for (const [key, value] of Object.entries(fields)) if (!value.trim()) errors.push(`Missing ${key}.`);
  const date = new Date(`${fields.date}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fields.date) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== fields.date) errors.push('Use a real date in YYYY-MM-DD format.');
  if (!['USD', 'EUR', 'GBP', 'PKR'].includes(fields.currency)) errors.push('Supported sample currencies: USD, EUR, GBP, PKR.');
  const validAmounts = [fields.subtotal, fields.tax, fields.total].every(v => /^\d{1,9}(\.\d{1,2})?$/.test(v));
  if (!validAmounts) errors.push('Amounts must be non-negative numbers with at most two decimal places.');
  else if (Math.round(Number(fields.subtotal) * 100) + Math.round(Number(fields.tax) * 100) !== Math.round(Number(fields.total) * 100)) errors.push('Subtotal + tax does not match the total. Correct the fields before review.');
  return errors;
}
export function invoiceCsv(fields: Invoice) {
  const quote = (v: string) => `"${/^[\s]*[=+@\-]|^[\t\r\n]/.test(v) ? "'" : ''}${v.replace(/"/g, '""')}"`;
  return Object.keys(fields).map(quote).join(',') + '\r\n' + Object.values(fields).map(quote).join(',') + '\r\n';
}
