'use client';
import { useRef, useState } from 'react';
import { site } from '@/lib/site';
import { analyticsService } from '@/lib/analytics';
import { track } from './Analytics';
export default function ContactForm({ initialProjectType = '', standalone = false }: { initialProjectType?: string; standalone?: boolean }) {
  const [state,setState]=useState({succeeded:false,submitting:false,errors:'',ownerNotification:''});
  async function submit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();const form=event.currentTarget;setState({succeeded:false,submitting:true,errors:'',ownerNotification:''});
    try {
      const data=Object.fromEntries(new FormData(form));
      const response=await fetch('/api/inquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      const result=await response.json();if(!response.ok)throw new Error(result.error||'Please try again.');
      track('form_submit', { service: analyticsService(String(data.projectType || '')) });
      setState({succeeded:true,submitting:false,errors:'',ownerNotification:result.ownerNotification||'uncertain'});
    } catch(error) { setState({succeeded:false,submitting:false,errors:error instanceof Error?error.message:'Please try again.',ownerNotification:''}); }
  }
  const started = useRef(false);
  function start(event: React.FocusEvent<HTMLFormElement>) {
    if (!started.current) {
      const selected=event.currentTarget.elements.namedItem('projectType') as HTMLSelectElement | null;
      track('form_start', { service: analyticsService(selected?.value || '') }); started.current=true;
    }
  }
  return <section id="contact" className="section contact-section"><div className="shell contact-grid"><div>
    {standalone ? <h1 className="contact-page-title">Tell me where<br/>the work gets stuck.</h1> : <h2>What needs<br/>to work better?</h2>}
    <p className="section-copy">{standalone ? 'Tell me what you want to make easier and which tools you use. A few sentences are enough to start.' : 'An inquiry to route, a support question to answer, a document to process or an integration to repair. Share the task, your tools and where human review is needed.'}</p>
    <p className="contact-next"><strong>What happens next</strong><br/>I review your brief personally and reply to the email you provide. I will clarify the scope with you before proposing the next step. A call can be arranged by email.</p>
    {site.replyTime && <p className="field-help">Reply time: {site.replyTime}</p>}<p className="field-help">Timezone: {site.timezone}.</p>
    <a className="text-link" href={site.whatsapp} target="_blank" rel="noopener noreferrer" onClick={() => track('whatsapp_click')}>Prefer WhatsApp? Start a conversation </a>
    {site.bookingUrl && <a className="text-link" href={site.bookingUrl} target="_blank" rel="noopener noreferrer" onClick={() => track('booking_click')}>Book a call </a>}
    <a className="contact-email" href={`mailto:${site.email}`}>{site.email}</a>
  </div><div className="form-panel">
    {state.succeeded ? <div className="form-success" role="status"><span aria-hidden="true">✓</span><h3>Your brief was accepted.</h3><p>Your inquiry was saved in my private workspace for review. I will reply personally to the email you entered. No automatic visitor receipt is sent yet. This confirmation does not add you to a sales sequence.</p><p>{state.ownerNotification === 'accepted' ? 'The email service accepted an owner notification for me.' : 'Owner email notification could not be confirmed. Your saved brief is still available for review; you can also contact me directly.'}</p><a className="text-link" href={`mailto:${site.email}`}>For a direct email conversation: {site.email}</a></div> : <form onSubmit={submit} onFocus={start}>
      <div className="form-row"><div><label htmlFor="contact-name">Name</label><input id="contact-name" name="name" autoComplete="name" required maxLength={120} placeholder="Your name"/></div><div><label htmlFor="contact-email">Email</label><input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" /></div></div>
      <label htmlFor="contact-type">What kind of work do you need?</label><select id="contact-type" name="projectType" defaultValue={initialProjectType} required><option value="" disabled>Select a service</option><option>Workflow automation</option><option>AI agents</option><option>API integrations</option><option>Automation repair</option><option value="Something else">Not sure yet. Help me choose.</option></select>
      <label htmlFor="contact-message">Workflow brief</label><p id="brief-help" className="field-help">Tell me what takes too much time and which tools you use. A few sentences are enough. Please leave out credentials and confidential records.</p><textarea id="contact-message" name="message" required rows={5} minLength={10} maxLength={5000} aria-describedby="brief-help" placeholder="A few details are enough to start…"/>
      <details className="contact-extras"><summary>Budget and referral details <span className="optional">(optional)</span></summary><div><label htmlFor="contact-source">How did you find BuildZn? <span className="optional">(optional)</span></label><select id="contact-source" name="source" defaultValue="direct"><option value="direct">Direct / not sure</option><option value="search">Search</option><option value="referral">Referral</option><option value="social">Social post</option></select><label htmlFor="contact-budget">Budget range <span className="optional">(optional)</span></label><select id="contact-budget" name="budget" defaultValue=""><option value="">Not decided yet</option><option>Under $1,000</option><option>$1,000–$3,000</option><option>$3,000–$10,000</option><option>$10,000+</option></select></div></details>
      <div className="honeypot" aria-hidden="true"><label htmlFor="website-field">Leave this field empty</label><input id="website-field" name="_gotcha" tabIndex={-1} autoComplete="off"/></div>
      {state.errors && <p className="form-error" role="alert">Your brief could not be sent. {state.errors} Check the fields and try again, or <a href={`mailto:${site.email}`}>email me directly</a>. Your details remain in the form.</p>}
      <button type="submit" className="button form-submit" disabled={state.submitting}>{state.submitting ? 'Sending your brief…' : 'Send workflow brief'}</button>
      <p className="field-help">You will see a confirmation here after your brief is saved. An automatic email receipt is not available yet. No sales sequence follows.</p><p className="privacy-note">I use your details to respond to this inquiry. <a href="/security">Read about security and data handling</a>. <a href="/privacy">Read the privacy policy</a>.</p>
    </form>}
  </div></div></section>;
}
