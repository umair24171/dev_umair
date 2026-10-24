import Link from 'next/link';
import Image from 'next/image';
import { agentProjects, agentProjectPath } from '@/lib/agent-portfolio';
import styles from './AgentPortfolio.module.css';

export default function AgentPortfolioSection() {
  return <section className="shell section" aria-labelledby="agent-projects-title" style={{paddingTop:0}}>
    <p className="eyebrow">SOURCE / TESTS / RECORDED RUNS</p>
    <h2 id="agent-projects-title">Agents with database workflows.</h2>
    <p className={styles.intro}>Four command line projects with synthetic data, public source, native PostgreSQL tests and Docker demos. Each page records what was tested and where the implementation stops.</p>
    <div className={styles.grid}>
      {agentProjects.map(project => <article key={project.slug} className={`${styles.card} agent-portfolio-card`}>
        <Link href={agentProjectPath(project.slug)} className={styles.cardImageLink} aria-label={`View ${project.name}`}><Image className={styles.coverImage} src={project.image.src} alt={project.image.alt} width={project.image.width} height={project.image.height} sizes="(max-width: 600px) 100vw, 50vw" /></Link>
        <div className={styles.cardBody}>
        <h3><Link href={agentProjectPath(project.slug)}>{project.name}</Link></h3>
        <p>{project.summary}</p>
        <p className={styles.result}>{project.distinct} distinct test cases covered across native and embedded runs</p>
        <Link href={agentProjectPath(project.slug)} className="text-link" aria-label={`Read ${project.name}`}>Read project, tradeoffs and test evidence ↗</Link></div>
      </article>)}
    </div>
  </section>;
}
