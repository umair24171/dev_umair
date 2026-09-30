import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { projects, site } from '@/lib/site';
import TrackedLink from '@/app/components/TrackedLink';
export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{slug: string}> }): Promise<Metadata> {
  const { slug } = await params; const p = projects.find(p => p.slug === slug);
  return p ? { title: `${p.name} — Product work`, description: p.summary, alternates: { canonical: `${site.url}/work/${slug}` }, openGraph: { title: `${p.name} — BuildZn product work`, description: p.summary, url: `${site.url}/work/${slug}` } } : {};
}
export default async function Project({ params }: { params: Promise<{slug: string}> }) {
  const { slug } = await params; const project = projects.find(p => p.slug === slug); if (!project) notFound();
  return <main id="main-content"><section className="shell page-hero"><Link href="/work" className="breadcrumb">← Selected work</Link><p className="eyebrow">{project.category.toUpperCase()}</p><h1>{project.name}</h1><p className="section-copy">{project.summary}</p><div className="tags">{project.stack.map(tag => <span key={tag}>{tag}</span>)}</div></section><section className="shell case-layout"><div><h2>The product</h2><p>{project.summary}</p><h2>Development scope</h2><p>{project.scope}</p><ul>{project.features.map(feature => <li key={feature}>{feature}</li>)}</ul><h2>A product decision that matters</h2><p>{project.decision}</p><h2>Explore the published product</h2><p>The public listings show the product experience. Product ownership and publishing accounts belong to their respective operators.</p><div className="case-links"><a className="button button-small button-secondary" href={project.ios} target="_blank" rel="noopener noreferrer">App Store ↗</a>{project.android && <a className="button button-small button-secondary" href={project.android} target="_blank" rel="noopener noreferrer">Google Play ↗</a>}{project.web && <a className="text-link" href={project.web} target="_blank" rel="noopener noreferrer">Product website ↗</a>}</div><div className="scope-note"><div><h3>Working on something similar?</h3><p>Share the user journey and the problem you need to solve.</p></div><TrackedLink href={site.contact} className="button button-small" location={`project-${slug}`}>Discuss your project ↗</TrackedLink></div></div>{project.image && <aside className="case-image"><Image src={project.image} alt={project.imageAlt} width={360} height={780} sizes="(max-width:600px) 240px, 290px"/><p>{project.imageSource}</p></aside>}</section></main>;
}
