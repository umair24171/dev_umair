import Link from 'next/link';
import type { Metadata } from 'next';
import { projects } from '@/lib/site';
import ProjectCard from '../components/ProjectCard';
export const metadata: Metadata = { title: 'Work — AI systems and automation', description: 'Explore BuildZn’s working automation demonstrations and evidence-backed technical case studies: agent operations, content systems, media workflows and the studio platform.', alternates: { canonical: 'https://www.buildzn.com/work' } };
export default async function Work({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const filter = ['demo', 'build'].includes(type || '') ? type : 'all';
  const visible = projects.filter(p => filter === 'all' || p.kind === filter);
  return <main id="main-content"><section className="shell page-hero"><p className="eyebrow">SYSTEMS / EVIDENCE / BOUNDARIES</p><h1>Explore the systems.<br/>See what they prove.</h1><p className="section-copy">{projects.length} projects across business intake, support, document review, agent operations and content production. Working previews sit alongside technical walkthroughs of public builds.</p><p className="demo-disclosure">Every page states its evidence and limitations. Sample demonstrations use fictional data; public source studies do not claim client results or verified production performance.</p><nav className="work-filters" aria-label="Filter portfolio">{[['all','All work'],['demo','Interactive demos'],['build','Technical case studies']].map(([value,label]) => <Link key={value} href={value === 'all' ? '/work' : `/work?type=${value}`} className="button button-small button-secondary" aria-current={filter === value ? 'page' : undefined}>{label}</Link>)}</nav></section><section className="shell project-grid" style={{ paddingBottom: 90 }}>{visible.map(project => <ProjectCard key={project.slug} project={project}/>)}</section><section className="shell closing-cta"><h2>Start with your operational problem.</h2><p>The implementation should follow your tools, data and review requirements.</p><Link className="button" href="/contact">Discuss your workflow ↗</Link></section></main>;
}
