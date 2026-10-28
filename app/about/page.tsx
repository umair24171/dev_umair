import PageContext from '@/app/components/PageContext';
import Image from 'next/image';
import type { Metadata } from 'next';
import Link from 'next/link';
import { processSteps, site } from '@/lib/site';
export const metadata: Metadata = {
  "title": "About the automation studio",
  "description": "BuildZn is Umair Bilal’s independent AI agents and business automation studio. Direct collaboration, bounded workflows and clear handover.",
  "alternates": {
    "canonical": "https://www.buildzn.com/about"
  },
  "openGraph": {
    "title": "About the automation studio | BuildZn",
    "description": "BuildZn is Umair Bilal’s independent AI agents and business automation studio. Direct collaboration, bounded workflows and clear handover.",
    "url": "https://www.buildzn.com/about",
    "type": "website",
    "images": [
      {
        "url": "/opengraph-image",
        "width": 1200,
        "height": 630,
        "alt": "BuildZn: AI agents and business automation"
      }
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "About the automation studio | BuildZn",
    "description": "BuildZn is Umair Bilal’s independent AI agents and business automation studio. Direct collaboration, bounded workflows and clear handover.",
    "images": [
      "/opengraph-image"
    ]
  }
};
export default function About() { return <main id="main-content"><PageContext path="/about" name="About" type="AboutPage"/><section className="shell page-hero about-intro"><div><h1>Useful automation starts<br/>with understanding the work.</h1><p className="section-copy">I’m Umair, the developer behind BuildZn. I help businesses define and build AI agents, automations and integrations around specific operational tasks.</p></div><figure className="founder-portrait"><Image src="/umair-bilal.webp" alt="Umair Bilal, the developer behind BuildZn" width={960} height={960} sizes="(max-width: 600px) 80vw, 320px" priority/><figcaption><strong>Umair Bilal</strong><span>Your direct point of contact at BuildZn</span></figcaption></figure></section><section className="shell detail-grid"><div><h2>Direct collaboration.<br/>Clear responsibility.</h2><p>BuildZn is my independent AI agents and business automation studio, based in Pakistan and working worldwide. You work directly with me on discovery, scope and implementation. Additional collaborators or specialist work are discussed within the project.</p><p>The starting point is your process: where information arrives, which tools hold it, who makes the decisions and what happens when a step fails. The system should make those responsibilities easier to manage.</p><p>I built the three interactive intake, support and invoice workflows on this site. You can run them with sample data and inspect the code, outputs and review gates. The portfolio also includes technical case studies of public systems: agent operations, content and media pipelines, and BuildZn’s own editorial and web platforms. Each page links its evidence and explains its limitations.</p><Link href="/work" className="text-link">Explore the systems </Link><section className="case-sources"><h2>Public implementation record</h2><p>These dated source records make specific contributions inspectable. They document public software work, not client endorsements or measured business outcomes.</p><ul><li>On October 6, 2026, the BuildZn repository recorded the intake, support and document-review workflow logic and its explicit authorship: <a className="text-link" href="https://github.com/umair24171/dev_umair/blob/5aa7d572894d1a364cc951bc5453f7a3de9d9184/lib/demos.ts">inspect the sample workflow implementation</a>.</li><li>On October 1, 2026, the editorial pipeline revision added retrieved-citation matching and bounded review resumes: <a className="text-link" href="https://github.com/umair24171/dev_umair/commit/6c06c9f4d2b08b35eca40913655d59dfc1749926">inspect the recorded change</a>. This is publishing-support software; a review result does not establish search performance.</li></ul></section></div><div className="detail-panel"><h3>Technology around the task.</h3><p><strong>Workflows:</strong> intake, routing, data updates, review queues and exception handling.</p><p><strong>AI agents:</strong> structured outputs, approved knowledge, bounded tool access and evaluation.</p><p><strong>Integrations:</strong> APIs, webhooks, field mapping and validation between your tools.</p><p><strong>Operations:</strong> documentation, logging, recovery and ownership of source and service accounts.</p><p>Tool selection follows your systems, permissions and operating budget.</p></div></section><section className="shell section"><h2>Know what will happen next.</h2><div className="process-grid">{processSteps.map((step, i) => <div key={step.title}><span className="process-number">0{i + 1}</span><h3>{step.title}</h3><p>{step.text}</p></div>)}</div><div className="scope-note"><div><h3>Bring one repetitive task.</h3><p>Share a sample input, your tools and the decisions that need a person.</p></div><Link href={site.contact} className="button">Discuss your workflow </Link></div></section></main>; }
