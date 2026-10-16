import Link from 'next/link';
import { processSteps } from '@/lib/site';
import styles from './HomeProcess.module.css';

const outcomes = ['A shared picture of the task.', 'The scope, agreed together.', 'Working milestones. Tested cases.', 'Source, access and operating notes.'];

export default function HomeProcess() {
  return <section id="process" className={`shell ${styles.section}`} aria-labelledby="home-process-heading">
    <header className={styles.heading}><div><p className="eyebrow">THE WAY WE WORK</p><h2 id="home-process-heading">From the first task<br/>to a clear handover.</h2></div><p>Know what is included, evaluate the exceptions and leave with a workflow you can understand and operate.</p></header>
    <ol className={styles.steps}>{processSteps.map((step, index) => <li key={step.title}>
      <span className={styles.number} aria-hidden="true">0{index + 1}</span>
      <div className={styles.stepTitle}><h3>{step.title}</h3><p>{outcomes[index]}</p></div>
      <p className={styles.description}>{step.text}</p>
    </li>)}</ol>
    <aside id="pricing" className={styles.scope}><div><p className={styles.scopeLabel}>SCOPE FIRST</p><h3>A clear price starts with a clear scope.</h3><p>The proposal defines deliverables, milestones and costs. Hosting, model usage and other third-party fees are identified separately. Support and handover are agreed before work starts.</p></div><Link href="/pricing">How estimates work <span aria-hidden="true">↗</span></Link></aside>
  </section>;
}
