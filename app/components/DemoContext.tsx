import Link from 'next/link';
import { answerSupport, createInquiryLead, extractInvoice, inquirySamples, invoiceSamples, parseInquiry, validateInvoice } from '@/lib/demos';
import { demoServices, services } from '@/lib/site';
export default function DemoContext({ slug }: { slug: string }) {
  const inquiry = parseInquiry(inquirySamples.complete);
  const lead = createInquiryLead(inquiry)!;
  const support = answerSupport('How long does delivery take?');
  const invoice = extractInvoice(invoiceSamples.valid);
  const previews: Record<string, { task: string; output: string; build: string }> = {
    'inquiry-assistant': { task: 'A service inquiry arrives as free text. Someone must identify the contact, copy requirements into a lead record and prepare a first reply.', output: JSON.stringify({ id: lead.id, contact: lead.contact, requirements: lead.requirements, status: lead.status }, null, 2), build: 'I built the labeled-input parser, required-field checks, structured lead record, editable response template and approval reset. Run these steps below. A connected CRM and email adapter are separate production work.' },
    'support-assistant': { task: 'A support team repeatedly checks policies before replying. Questions outside those policies need a clear handoff.', output: `Question: How long does delivery take?\nAnswer: ${support.answer}\nSource: ${support.sources[0].id}
${support.sources[0].title}\nOutside coverage: human handoff, with no unsupported answer.`, build: 'I built a policy-matching workflow that returns source-linked answers for covered questions and a review summary for unsupported questions. It runs below with a fictional knowledge base. Live semantic retrieval and help-desk connections are separate production work.' },
    'document-processing': { task: 'Invoice fields are copied into a sheet. Missing details and incorrect totals must be caught before the data moves on.', output: `Invoice: ${invoice.invoice}\nSupplier: ${invoice.supplier}\nSubtotal: ${invoice.currency} ${invoice.subtotal}\nTax: ${invoice.currency} ${invoice.tax}\nTotal: ${invoice.currency} ${invoice.total}\nValidation: ${validateInvoice(invoice).length ? 'Review errors' : 'Field and arithmetic checks passed'}\nExport: CSV or JSON after human review.`, build: 'I built text-field extraction, editable corrections, date and total validation, a review gate and real CSV/JSON downloads. Run it below, including the mismatched-total case. PDF/OCR and accounting connections are separate production work.' },
  };
  const preview = previews[slug];
  if (!preview) return null;
  return <section className="demo-context" aria-labelledby="sample-output-heading"><div><p>{preview.task}</p><h2>What I built</h2><p>{preview.build}</p><div className="demo-service-links">{(demoServices[slug] || []).map(service => <Link key={service} className="text-link" href={`/services/${service}`}>{services.find(s => s.slug === service)?.name} </Link>)}</div></div><div><h2 id="sample-output-heading">Inspect the output.</h2><pre className="sample-record">{preview.output}</pre>{slug === 'document-processing' && <a className="text-link" href="/demos/document-processing-output.json" download>Download the reviewed output </a>}</div></section>;
}
