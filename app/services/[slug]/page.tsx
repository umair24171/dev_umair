import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { services, site } from '@/lib/site';
import TrackedLink from '@/app/components/TrackedLink';
export function generateStaticParams() { return services.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const service = services.find(s => s.slug === slug);
  return service ? { title: service.name, description: service.description, alternates: { canonical: `${site.url}/services/${slug}` }, openGraph: { title: `${service.name} | BuildZn`, description: service.description, url: `${site.url}/services/${slug}` } } : {};
}
export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const service = services.find(s => s.slug === slug); if (!service) notFound();
  const schema = { '@context': 'https://schema.org', '@type': 'Service', name: service.name, description: service.description, url: `${site.url}/services/${slug}`, provider: { '@id': `${site.url}/#organization` }, areaServed: 'Worldwide' };
  return <main id="main-content"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}/><section className="shell page-hero"><Link href="/services" className="breadcrumb">← All services</Link><p className="eyebrow">{service.name.toUpperCase()}</p><h1>{service.short}</h1><p className="section-copy">{service.description}</p><TrackedLink href={site.contact} className="button" location={slug}>Discuss your workflow ↗</TrackedLink></section><section className="shell detail-grid"><div><h2>Start with the right question.</h2><p>{service.problem}</p><h3>Who this is for</h3><p>{service.audience}</p><h3>What we can scope together</h3><ul>{service.deliverables.map(item => <li key={item}>{item}</li>)}</ul><Link href="/work" className="text-link">Explore demonstrations and technical evidence ↗</Link></div><aside className="detail-panel"><p className="eyebrow">BEFORE IMPLEMENTATION</p><h3>Useful details to bring</h3><ul>{service.questions.map(question => <li key={question}>{question}</li>)}</ul><h3>A focused starting point</h3><p>For inquiry intake, scope one source, one destination and a response draft for review. For an existing failure, start with one reproducible issue and an agreed investigation.</p><Link href="/pricing" className="text-link">First engagement and scope ↗</Link><h3>Commercial boundaries</h3><p>{service.boundaries}</p><p>The proposal defines milestones, price, acceptance criteria, ownership and support. Changes outside the agreed scope are discussed before implementation.</p></aside></section></main>;
}
