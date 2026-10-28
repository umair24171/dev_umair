import Link from 'next/link';
import { businessProblems, services } from '@/lib/site';
import styles from './HomeProblemEntries.module.css';

export default function HomeProblemEntries() {
  return <section id="services" className={styles.section} aria-labelledby="problem-heading">
    <div className={styles.content}>
      <div className={styles.heading}>
        <h2 id="problem-heading">Where does your team<br/><span>repeat the work?</span></h2>
        <p className={styles.description}>Choose the task that needs attention. Each service starts with your tools, an owner and a result you can check.</p>
      </div>
      <div className={styles.entries}>
        {businessProblems.map(problem => <article className={styles.entry} key={problem.title}>
          <div><h3>{problem.title}</h3><p>{problem.text}</p></div>
          <div className={styles.links}>
            <Link href={`/services/${problem.service}`}>{services.find(s => s.slug === problem.service)?.name}</Link>
            <Link href={problem.demo ? `/work/${problem.demo}` : `/services/${problem.service}#acceptance-example`}>{problem.demo ? `Try ${problem.demoName?.toLowerCase()}` : 'See the acceptance example'}</Link>
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}
