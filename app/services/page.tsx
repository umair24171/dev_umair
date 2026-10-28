import type { Metadata } from 'next';
import ProblemEntries from '../components/ProblemEntries';
import Link from 'next/link';
import { services } from '@/lib/site';
export const metadata: Metadata = {
  "title": "AI agents & automation services",
  "description": "Workflow automation, AI agents, API integrations and automation repair from BuildZn. Concrete deliverables and review boundaries for business operations.",
  "alternates": {
    "canonical": "https://www.buildzn.com/services"
  },
  "openGraph": {
    "title": "AI agents & automation services | BuildZn",
    "description": "Workflow automation, AI agents, API integrations and automation repair from BuildZn. Concrete deliverables and review boundaries for business operations.",
    "url": "https://www.buildzn.com/services",
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
    "title": "AI agents & automation services | BuildZn",
    "description": "Workflow automation, AI agents, API integrations and automation repair from BuildZn. Concrete deliverables and review boundaries for business operations.",
    "images": [
      "/opengraph-image"
    ]
  }
};
export default function Services() { return <main id="main-content"><section className="shell page-hero"><h1>Build around the work<br/>your team repeats.</h1><p className="section-copy">From the first manual handoff to the integration that stopped working. Start with a bounded task, an accountable owner and a clear outcome.</p></section><ProblemEntries/><section className="shell section service-list" aria-label="Services by implementation type">{services.map(s => <Link className="service-row" href={`/services/${s.slug}`} key={s.slug}><div><h2>{s.name}</h2><p>{s.description}</p></div><span className="service-arrow"></span></Link>)}</section><div className="shell"><section className="shell section"><h2>Start with an inquiry pilot</h2><p className="section-copy">See the scope, acceptance checks and next steps.</p><Link className="text-link" href="/pricing#inquiry-pilot">See the pilot offer</Link></section></div></main>; }
