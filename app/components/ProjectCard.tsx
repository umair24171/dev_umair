import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/site';
export default function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  return <article className="project-card"><Link href={`/work/${project.slug}`} className="project-visual demo-visual" aria-label={`Explore ${project.name}`}><span className="project-category">{project.category}</span><Image src={project.image} alt={project.imageAlt} width={project.imageWidth} height={project.imageHeight} sizes="(max-width: 600px) 100vw, 560px" className="demo-screen"/><span className="project-visual-caption">{project.label}<span aria-hidden="true">↗</span></span></Link><div className="project-description"><h3><Link href={`/work/${project.slug}`}>{project.name}</Link></h3><p>{project.summary}</p><div className="tags">{project.stack.map(tag => <span key={tag}>{tag}</span>)}</div><Link href={`/work/${project.slug}`} className="text-link">{project.kind === 'demo' ? 'Try the demonstration' : 'Read the technical case study'} ↗</Link></div></article>;
}
