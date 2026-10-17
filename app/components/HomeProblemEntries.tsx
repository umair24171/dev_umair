import Link from 'next/link';
import { businessProblems, services } from '@/lib/site';
import styles from './HomeProblemEntries.module.css';

export default function HomeProblemEntries() {
  return <section className={styles.section} aria-labelledby="problem-heading">
    <div className={styles.content}>
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>RECOGNIZE THE TASK?</p>
          <h2 id="problem-heading">Where does your team<br/><span>repeat the work?</span></h2>
        </div>
        <p className={styles.description}>For service businesses and small operations teams handling inquiries, support, documents and updates across several tools.</p>
      </div>
      <div className={styles.entries}>
        {businessProblems.map((problem, index) => <article className={styles.entry} key={problem.title}>
          <span className={styles.number} aria-hidden="true">0{index + 1}</span>
          <div>
            <h3>{problem.title}</h3>
            <p>{problem.text}</p>
          </div>
          <div className={styles.links}>
            <Link href={`/services/${problem.service}`}>{services.find(s => s.slug === problem.service)?.name} <span aria-hidden="true">↗</span></Link>
            {problem.demo && <Link href={`/work/${problem.demo}`}>See the {problem.demoName?.toLowerCase()} sample <span aria-hidden="true">→</span></Link>}
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}
