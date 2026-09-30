'use client';
import { useForm, ValidationError } from '@formspree/react';
import { useEffect, useRef } from 'react';
import { site } from '@/lib/site';
import { track } from './Analytics';
export default function ContactForm() {
  const [state, submit] = useForm(site.formId);
  const started = useRef(false);
  const sent = useRef(false);
  function start() { if (!started.current) { track('form_started', { location: 'contact' }); started.current = true; } }
  useEffect(() => { if (state.succeeded && !sent.current) { sent.current = true; track('form_submitted', { location: 'contact' }); } }, [state.succeeded]);
  return <section id="contact" className="section contact-section"><div className="shell contact-grid"><div>
    <p className="eyebrow">LET’S TALK</p><h2>What needs<br/>to work better?</h2>
    <p className="section-copy">A new product, an existing app, or a workflow that takes too much time. Tell me the problem and we can work out a useful next step.</p>
    <p className="contact-next"><strong>What happens next</strong><br/>I’ll review your brief and reply by email. If a call would help, we can arrange one.</p>
    <a className="text-link" href={site.whatsapp} target="_blank" rel="noopener noreferrer" onClick={() => track('contact_alternative_clicked', { channel: 'whatsapp' })}>Prefer WhatsApp? Start a conversation ↗</a>
    <a className="contact-email" href={`mailto:${site.email}`}>{site.email}</a>
  </div><div className="form-panel">
    {state.succeeded ? <div className="form-success" role="status"><span aria-hidden="true">✓</span><h3>Your brief has been sent.</h3><p>I’ll reply to the email address you provided with the next step.</p></div> : <form onSubmit={submit} onFocus={start}>
      <div className="form-row"><div><label htmlFor="contact-name">Name</label><input id="contact-name" name="name" autoComplete="name" required maxLength={120} placeholder="Your name"/></div><div><label htmlFor="contact-email">Email</label><input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" aria-describedby="email-error"/><ValidationError prefix="Email" field="email" errors={state.errors} id="email-error" className="form-error"/></div></div>
      <label htmlFor="contact-type">What can I help with?</label><select id="contact-type" name="projectType" defaultValue="" required><option value="" disabled>Select a project type</option><option>New mobile app</option><option>SaaS or web product</option><option>AI workflow or integration</option><option>Improve an existing product</option><option>Something else</option></select>
      <label htmlFor="contact-budget">Budget range <span className="optional">(optional)</span></label><select id="contact-budget" name="budget" defaultValue=""><option value="">Not decided yet</option><option>Under $1,000</option><option>$1,000–$3,000</option><option>$3,000–$10,000</option><option>$10,000+</option></select>
      <label htmlFor="contact-message">Project brief</label><p id="brief-help" className="field-help">What should it do, who will use it, and what is the main problem today?</p><textarea id="contact-message" name="message" required rows={5} minLength={10} maxLength={5000} aria-describedby="brief-help message-error" placeholder="A few details are enough to start…"/><ValidationError prefix="Brief" field="message" errors={state.errors} id="message-error" className="form-error"/>
      <div className="honeypot" aria-hidden="true"><label htmlFor="website-field">Leave this field empty</label><input id="website-field" name="_gotcha" tabIndex={-1} autoComplete="off"/></div>
      {state.errors && <p className="form-error" role="alert">Your brief could not be sent. Check the fields and try again, or <a href={`mailto:${site.email}`}>email me directly</a>. Your details remain in the form.</p>}
      <button type="submit" className="button form-submit" disabled={state.submitting}>{state.submitting ? 'Sending your brief…' : 'Send project brief'}<span aria-hidden="true">↗</span></button>
      <p className="privacy-note">Your details are used to respond to this inquiry. <a href="/privacy">Read the privacy policy</a>.</p>
    </form>}
  </div></div></section>;
}
