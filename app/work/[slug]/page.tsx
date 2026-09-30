import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { projects, site } from '@/lib/site';
import DemoWorkbench from '@/app/components/DemoWorkbench';
export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{slug: string}> }): Promise<Metadata> {
  const { slug } = await params; const p = projects.find(p => p.slug === slug);
  return p ? { title: `${p.name} — BuildZn demonstration`, description: p.summary, alternates: { canonical: `${site.url}/work/${slug}` }, openGraph: { title: `${p.name} — BuildZn demonstration`, description: p.summary, url: `${site.url}/work/${slug}`, images: [{ url: p.image, width: p.imageWidth, height: p.imageHeight, alt: p.imageAlt }] } } : {};
}
export default async function Project({ params }: { params: Promise<{slug: string}> }) {
  const { slug } = await params; const p = projects.find(p => p.slug === slug); if (!p) notFound();
  return <main id="main-content"><section className="shell page-hero"><Link href="/work" className="breadcrumb">← All demonstrations</Link><p className="eyebrow">BUILDZN DEMONSTRATION / SAMPLE DATA</p><h1>{p.name}</h1><p className="section-copy">{p.summary}</p><div className="tags">{p.stack.map(tag => <span key={tag}>{tag}</span>)}</div></section><div className="shell"><DemoWorkbench slug={slug}/></div><section className="shell section detail-grid"><div><p className="eyebrow">WALKTHROUGH</p><h2>Follow the work.</h2><ol className="walkthrough">{p.features.map(step => <li key={step}>{step}</li>)}</ol><h2>Technical scope</h2><p>{p.scope}</p><h2>The decision that matters</h2><p>{p.decision}</p></div><aside><div className="detail-panel"><p className="eyebrow">LIMITATIONS / BEFORE PRODUCTION</p><h3>See exactly what this proves.</h3><p>{p.limitations}</p><p>These are BuildZn demonstrations, not client engagements or evidence of business results. Connected production workflows require scoped implementation and access to your accounts. Hosting, provider subscriptions and model usage may incur separate costs.</p></div><figure className="demo-capture"><Image src={p.image} alt={p.imageAlt} width={p.imageWidth} height={p.imageHeight} sizes="(max-width:600px) 100vw, 560px"/><figcaption>Actual screenshot of this working preview using fictional sample data. Captured October 1, 2026.</figcaption></figure></aside></section><section className="shell closing-cta"><h2>Have a similar repetitive task?</h2><p>Share the input, the tools and the decision that should stay with a person.</p><Link href={site.contact} className="button">Discuss your workflow ↗</Link></section></main>;
}
