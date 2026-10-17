import './home-studio.css';
import HomeProblemEntries from './components/HomeProblemEntries';
import HomePilot from './components/HomePilot';
import HomeServices from './components/HomeServices';
import HomeProcess from './components/HomeProcess';
import HomeHero from './components/HomeHero';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { faqs, projects } from '@/lib/site';
import ContactForm from './components/ContactForm';
import HomeProjectCard from './components/HomeProjectCard';

export const metadata: Metadata = {
  title: 'BuildZn — AI Agents & Business Automation',
  description: 'AI agents and automation for service businesses and small operations teams. Capture inquiries, prepare support replies, process documents and connect business tools.',
  alternates: { canonical: 'https://www.buildzn.com' },
  openGraph: { title: 'BuildZn — Automate repetitive business work', description: 'AI agents, workflow automation, API integrations and repair. Work directly with Umair Bilal.', url: 'https://www.buildzn.com' },
};
export default function Home() {
  return <main id="main-content" data-home-studio>
    <HomeHero/>
    <div className="home-capability"><div className="shell"><span>Practical systems for everyday operations.</span><div><span>Intake</span><span>Support</span><span>Documents</span><span>Connected tools</span></div></div></div>
    <HomeProblemEntries/>
    <section id="portfolio" className="section shell"><div className="section-heading"><div><p className="eyebrow">BUILT BY BUILDZN / PUBLIC TECHNICAL WORK</p><h2>Business tasks.<br/>Visible next steps.</h2></div><div><p className="section-copy">Run three workflows we built for intake, support and invoice review. Inspect actual sample outputs and source, alongside clearly labeled public technical case studies.</p><Link href="/work" className="text-link">View all 8 projects ↗</Link></div></div><div className="project-grid">{projects.filter(p => ['inquiry-assistant', 'support-assistant', 'document-processing', 'nexusos-agent-operations'].includes(p.slug)).map(project => <HomeProjectCard key={project.slug} project={project}/>)}</div></section>
    <HomeServices/>
    <HomeProcess/>
    <HomePilot/>
    <section className="section founder-section"><div className="shell founder-grid"><figure className="founder-portrait"><Image src="/umair-bilal.webp" alt="Umair Bilal, the developer behind BuildZn" width={960} height={960} sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1000px) 42vw, 500px"/><figcaption><strong>Umair Bilal</strong><span>Your direct point of contact at BuildZn</span></figcaption></figure><div><p className="eyebrow">YOUR AUTOMATION PARTNER</p><h2>The person you talk to<br/>is the person building.</h2><p className="section-copy">I’m Umair, the developer behind BuildZn. This is an independent AI agents and business automation studio. I work directly with you to connect your systems, define safe actions and make repetitive workflows easier to manage.</p><p className="section-copy">Share where you are today and what needs to work better. We’ll start there.</p><Link href="/about" className="text-link">More about Umair ↗</Link></div></div></section>
    <section className="section shell faq-section"><div><p className="eyebrow">BEFORE WE START</p><h2>Good questions.<br/>Clear answers.</h2></div><div className="faq-list">{faqs.map(faq => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div></section>
    <ContactForm/>
  </main>;
}
