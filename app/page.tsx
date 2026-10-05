import ProblemEntries from './components/ProblemEntries';
import FirstEngagement from './components/FirstEngagement';
import WorkflowPreview from './components/WorkflowPreview';
import Link from 'next/link';
import type { Metadata } from 'next';
import { faqs, processSteps, projects, services } from '@/lib/site';
import ContactForm from './components/ContactForm';
import ProjectCard from './components/ProjectCard';
import TrackedLink from './components/TrackedLink';

export const metadata: Metadata = {
  title: 'BuildZn — AI Agents & Business Automation',
  description: 'AI agents and automation for service businesses and small operations teams. Capture inquiries, prepare support replies, process documents and connect business tools.',
  alternates: { canonical: 'https://www.buildzn.com' },
  openGraph: { title: 'BuildZn — Automate repetitive business work', description: 'AI agents, workflow automation, API integrations and repair. Work directly with Umair Bilal.', url: 'https://www.buildzn.com' },
};
export default function Home() {
  return <main id="main-content">
    <section className="hero shell"><div className="hero-copy">
      <p className="eyebrow"><span className="status-dot"/> AI AGENTS & AUTOMATION STUDIO</p>
      <h1>Automate the busywork<br/><span>behind your<br/>service business.</span></h1>
      <p className="hero-description">For service businesses and small operations teams: capture inquiries, prepare source-backed support replies, check invoice fields and keep records in sync. BuildZn connects the tools and adds human review where it matters.</p>
      <div className="hero-actions"><TrackedLink href="/contact" className="button" location="hero">Discuss your workflow <span aria-hidden="true">↗</span></TrackedLink><Link href="/work" className="button button-secondary">Explore the work <span aria-hidden="true">↓</span></Link></div>
      <div className="hero-note"><span className="founder-mark" aria-hidden="true">UB</span><p>Work directly with Umair Bilal.<br/><span>Clear scope. Human review. Documented handover.</span></p></div>
    </div><WorkflowPreview/></section>
    <div className="capability-strip"><div className="shell"><span>Practical systems for everyday operations.</span><div><span>Intake</span><span>Support</span><span>Documents</span><span>Connected tools</span></div></div></div>
    <ProblemEntries/>
    <section id="portfolio" className="section shell"><div className="section-heading"><div><p className="eyebrow">BUILDZN SYSTEMS & DEMONSTRATIONS</p><h2>Business tasks.<br/>Visible next steps.</h2></div><div><p className="section-copy">Explore working sample workflows and public technical builds. Inspect the implementation, evidence and limits of each system.</p><Link href="/work" className="text-link">View all 8 projects ↗</Link></div></div><div className="project-grid">{projects.filter(p => ['inquiry-assistant', 'support-assistant', 'document-processing', 'nexusos-agent-operations'].includes(p.slug)).map(project => <ProjectCard key={project.slug} project={project}/>)}</div></section>
    <section id="services" className="section services-section"><div className="shell"><div className="section-heading"><div><p className="eyebrow">HOW I CAN HELP</p><h2>Start with the problem.<br/>Build what solves it.</h2></div><p className="section-copy">Missed inquiries, repeated support questions, manual data entry or a broken integration. Start with one task and a useful outcome.</p></div><div className="service-list">{services.map(service => <Link href={`/services/${service.slug}`} className="service-row" key={service.slug}><span className="service-number">{service.number}</span><div><h3>{service.name}</h3><p>{service.description}</p></div><span className="service-arrow" aria-hidden="true">↗</span></Link>)}</div></div></section>
    <section id="process" className="section shell"><div className="section-heading"><div><p className="eyebrow">THE WAY WE WORK</p><h2>Less guesswork.<br/>More dependable workflows.</h2></div><p className="section-copy">Know what is included, evaluate the exceptions and leave with a workflow you can understand and operate.</p></div><div className="process-grid">{processSteps.map((step, i) => <div key={step.title}><span className="process-number">0{i + 1}</span><h3>{step.title}</h3><p>{step.text}</p></div>)}</div><div id="pricing" className="scope-note"><div><p className="eyebrow">SCOPE FIRST</p><h3>A clear price starts with a clear scope.</h3><p>The proposal defines deliverables, milestones and costs. Hosting, model usage and other third-party fees are identified separately. Support and handover are agreed before work starts.</p></div><Link href="/pricing" className="text-link">How estimates work ↗</Link></div></section>
    <div className="shell"><FirstEngagement/></div>
    <section className="section founder-section"><div className="shell founder-grid"><div className="founder-monogram" aria-hidden="true">UB<span>UMAIR BILAL / BUILDZN</span></div><div><p className="eyebrow">YOUR AUTOMATION PARTNER</p><h2>The person you talk to<br/>is the person building.</h2><p className="section-copy">I’m Umair, the developer behind BuildZn. This is an independent AI agents and business automation studio. I work directly with you to connect your systems, define safe actions and make repetitive workflows easier to manage.</p><p className="section-copy">Share where you are today and what needs to work better. We’ll start there.</p><Link href="/about" className="text-link">More about Umair ↗</Link></div></div></section>
    <section className="section shell faq-section"><div><p className="eyebrow">BEFORE WE START</p><h2>Good questions.<br/>Clear answers.</h2></div><div className="faq-list">{faqs.map(faq => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div></section>
    <ContactForm/>
  </main>;
}
