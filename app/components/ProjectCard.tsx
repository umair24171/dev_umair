import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/site';
export default function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  return <article className={`project-card project-${project.slug}`}>
    <Link href={`/work/${project.slug}`} className="project-visual" aria-label={`View ${project.name} project`}>
      <span className="project-category">{project.category}</span>
      {project.image ? <Image src={project.image} alt={project.imageAlt} width={360} height={780} sizes="(max-width: 600px) 220px, 280px" className="project-screen"/> : <div className="project-wordmark">{project.name}<span>Learning. Conversation. Habits.</span></div>}
      <span className="project-visual-caption">{project.image ? 'Actual product screen' : 'Product overview'}<span aria-hidden="true">↗</span></span>
    </Link>
    <div className="project-description"><h3><Link href={`/work/${project.slug}`}>{project.name}</Link></h3><p>{project.summary}</p><div className="tags">{project.stack.slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}</div><Link href={`/work/${project.slug}`} className="text-link">Explore the project <span aria-hidden="true">↗</span></Link></div>
  </article>;
}
