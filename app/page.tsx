import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { faqs, processSteps, projects, services } from '@/lib/site';
import ContactForm from './components/ContactForm';
import ProjectCard from './components/ProjectCard';
import TrackedLink from './components/TrackedLink';

export const metadata: Metadata = {
  title: 'BuildZn — Mobile Apps, SaaS & Useful AI',
  description: 'Work directly with Umair Bilal to develop mobile apps, SaaS products and AI workflows. Clear scope, working milestones and thoughtful product decisions.',
  alternates: { canonical: 'https://www.buildzn.com' },
  openGraph: { title: 'BuildZn — Build the product your business needs', description: 'Mobile apps, SaaS products and useful AI. Work directly with Umair Bilal.', url: 'https://www.buildzn.com' },
};
export default function Home() {
  return <main id="main-content">
    <section className="hero shell"><div className="hero-copy">
      <p className="eyebrow"><span className="status-dot"/> INDEPENDENT DEVELOPMENT STUDIO</p>
      <h1>Build the product<br/>your business<br/><span>actually needs.</span></h1>
      <p className="hero-description">Mobile apps, SaaS products and useful AI.<br className="desktop-break"/> Built with you, from the first decision to launch.</p>
      <div className="hero-actions"><TrackedLink href="/#contact" className="button" location="hero">Discuss your project <span aria-hidden="true">↗</span></TrackedLink><Link href="/work" className="button button-secondary">Explore the work <span aria-hidden="true">↓</span></Link></div>
      <div className="hero-note"><span className="founder-mark" aria-hidden="true">UB</span><p>Work directly with Umair Bilal.<br/><span>Clear scope. Working milestones. Thoughtful handover.</span></p></div>
    </div><div className="hero-product"><div className="product-label"><span>FROM THE PORTFOLIO</span><Link href="/work/muslifie">Muslifie ↗</Link></div><div className="hero-screen-frame"><Image src="/muslifie-app.png" alt="Actual Muslifie mobile app home screen, with travel discovery and local guide categories" width={1206} height={2622} sizes="(max-width: 600px) 250px, 300px" priority/></div><div className="product-footnote"><span>Travel discovery & booking</span><span>Flutter · iOS & Android</span></div></div></section>
    <div className="capability-strip"><div className="shell"><span>Product decisions, connected to development.</span><div><span>Flutter</span><span>Node.js</span><span>Next.js</span><span>AI integrations</span></div></div></div>
    <section id="portfolio" className="section shell"><div className="section-heading"><div><p className="eyebrow">SELECTED WORK</p><h2>Products beyond<br/>the pitch deck.</h2></div><div><p className="section-copy">Mobile products I’ve worked on, with real screens and links to their public listings.</p><Link href="/work" className="text-link">View all projects ↗</Link></div></div><div className="project-grid">{projects.slice(0, 2).map(project => <ProjectCard key={project.slug} project={project}/>)}</div></section>
    <section id="services" className="section services-section"><div className="shell"><div className="section-heading"><div><p className="eyebrow">HOW I CAN HELP</p><h2>Start with the problem.<br/>Build what solves it.</h2></div><p className="section-copy">A focused release, a better existing product, or a workflow worth automating. The technology follows the goal.</p></div><div className="service-list">{services.map(service => <Link href={`/services/${service.slug}`} className="service-row" key={service.slug}><span className="service-number">{service.number}</span><div><h3>{service.name}</h3><p>{service.description}</p></div><span className="service-arrow" aria-hidden="true">↗</span></Link>)}</div></div></section>
    <section id="process" className="section shell"><div className="section-heading"><div><p className="eyebrow">THE WAY WE WORK</p><h2>Less guesswork.<br/>More working software.</h2></div><p className="section-copy">Know what’s included, review what’s being built, and leave with a product you can own and operate.</p></div><div className="process-grid">{processSteps.map((step, i) => <div key={step.title}><span className="process-number">0{i + 1}</span><h3>{step.title}</h3><p>{step.text}</p></div>)}</div><div id="pricing" className="scope-note"><div><p className="eyebrow">SCOPE FIRST</p><h3>A clear price starts with a clear scope.</h3><p>The proposal defines deliverables, milestones and costs. Hosting, model usage and other third-party fees are identified separately. Support and handover are agreed before work starts.</p></div><Link href="/flutter-app-cost" className="text-link">How estimates work ↗</Link></div></section>
    <section className="section founder-section"><div className="shell founder-grid"><div className="founder-monogram" aria-hidden="true">UB<span>UMAIR BILAL / BUILDZN</span></div><div><p className="eyebrow">YOUR DEVELOPMENT PARTNER</p><h2>The person you talk to<br/>is the person building.</h2><p className="section-copy">I’m Umair, the developer behind BuildZn. I work across Flutter apps, Node.js backends and AI integrations, connecting technical decisions to what the product needs to do.</p><p className="section-copy">Share where you are today and what needs to work better. We’ll start there.</p><Link href="/about" className="text-link">More about Umair ↗</Link></div></div></section>
    <section className="section shell faq-section"><div><p className="eyebrow">BEFORE WE START</p><h2>Good questions.<br/>Clear answers.</h2></div><div className="faq-list">{faqs.map(faq => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div></section>
    <ContactForm/>
  </main>;
}
