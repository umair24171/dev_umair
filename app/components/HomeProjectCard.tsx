import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/site';
import styles from './HomeProjectCard.module.css';

export default function HomeProjectCard({ project }: { project: (typeof projects)[number] }) {
  return <article className={`project-card ${styles.card}`}>
    <p className={styles.category}>{project.kind === 'demo' ? project.category : project.label}</p>
    <Link href={`/work/${project.slug}`} className={styles.visual} aria-label={`Explore ${project.name}`}>
      <Image src={project.image} alt={project.imageAlt} width={project.imageWidth} height={project.imageHeight} sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 1184px) calc((100vw - 64px) / 2), 546px" className={styles.image}/>
    </Link>
    <div className={styles.description}>
      <h3><Link href={`/work/${project.slug}`}>{project.name}</Link></h3><p>{project.summary}</p>
      <div className={`tags ${styles.tags}`}>{project.stack.map(tag => <span key={tag}>{tag}</span>)}</div>
      <Link href={`/work/${project.slug}`} className="text-link">{project.kind === 'demo' ? 'Run the workflow' : 'Read the technical walkthrough'}</Link>
    </div>
  </article>;
}
