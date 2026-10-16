import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/site';
import styles from './HomeProjectCard.module.css';

const covers: Record<string, { src: string; alt: string }> = {
  'inquiry-assistant': { src: '/project-covers/inquiry-assistant.webp', alt: 'Illustrative cover of a fictional inquiry lead and prepared reply awaiting human review.' },
  'support-assistant': { src: '/project-covers/support-assistant.webp', alt: 'Illustrative policy booklet linking a sample delivery answer to its KB-01 source and a human handoff.' },
  'document-processing': { src: '/project-covers/document-processing.webp', alt: 'Illustrative text-invoice input and extracted fields, checking 240 plus 24 equals 264 USD before CSV or JSON export.' },
  'nexusos-agent-operations': { src: '/project-covers/nexusos-agent-operations.webp', alt: 'Illustrative public-source review of an agent log-ingestion guard; external agent actions are not stopped.' },
};

export default function HomeProjectCard({ project }: { project: (typeof projects)[number] }) {
  const cover = covers[project.slug];
  return <article className={`project-card ${styles.card}`}>
    <p className={styles.category}>{project.category}</p>
    <Link href={`/work/${project.slug}`} className={styles.visual} aria-label={`Explore ${project.name}`}>
      <Image src={cover.src} alt={cover.alt} fill sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 1184px) calc((100vw - 64px) / 2), 546px" className={styles.image}/>
      <span className={styles.caption}><span>{project.kind === 'demo' ? 'Illustrative cover · Built working sample · Sample data' : 'Illustrative cover · Public source case study'}</span><span aria-hidden="true">↗</span></span>
    </Link>
    <div className={styles.description}>
      <h3><Link href={`/work/${project.slug}`}>{project.name}</Link></h3>
      <p>{project.summary}</p>
      <div className={`tags ${styles.tags}`}>{project.stack.map(tag => <span key={tag}>{tag}</span>)}</div>
      <Link href={`/work/${project.slug}`} className="text-link">{project.kind === 'demo' ? 'Run the workflow' : 'Read the technical case study'} <span aria-hidden="true">↗</span></Link>
    </div>
  </article>;
}
