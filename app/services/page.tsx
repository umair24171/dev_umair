import type { Metadata } from 'next';
import ProblemEntries from '../components/ProblemEntries';
import FirstEngagement from '../components/FirstEngagement';
import Link from 'next/link';
import { services } from '@/lib/site';
export const metadata: Metadata = { title: 'AI agents & automation services', description: 'Workflow automation, AI agents, API integrations and automation repair from BuildZn. Concrete deliverables and review boundaries for business operations.', alternates: { canonical: 'https://www.buildzn.com/services' } };
export default function Services() { return <main id="main-content"><section className="shell page-hero"><p className="eyebrow">BUILDZN SERVICES</p><h1>Build around the work<br/>your team repeats.</h1><p className="section-copy">From the first manual handoff to the integration that stopped working. Start with a bounded task, an accountable owner and a clear outcome.</p></section><ProblemEntries/><section className="shell section service-list" aria-label="Services by implementation type">{services.map(s => <Link className="service-row" href={`/services/${s.slug}`} key={s.slug}><span className="service-number">{s.number}</span><div><h2>{s.name}</h2><p>{s.description}</p></div><span className="service-arrow">↗</span></Link>)}</section><div className="shell"><FirstEngagement/></div></main>; }
