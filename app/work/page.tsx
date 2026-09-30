import type { Metadata } from 'next';
import { projects } from '@/lib/site';
import ProjectCard from '../components/ProjectCard';
export const metadata: Metadata = { title: 'Selected product work', description: 'Explore mobile products Umair Bilal has worked on: Muslifie, MyAiPal, FarahGPT and Voisbe. Product screens, development scope and public listings.', alternates: { canonical: 'https://www.buildzn.com/work' } };
export default function Work() { return <main id="main-content"><section className="shell page-hero"><p className="eyebrow">SELECTED WORK</p><h1>Real products.<br/>Different problems to solve.</h1><p className="section-copy">A selection of mobile development work. Explore the product, the development scope and the public listing.</p></section><section className="shell project-grid" style={{ paddingBottom: 90 }}>{projects.map(project => <ProjectCard key={project.slug} project={project}/>)}</section></main>; }
