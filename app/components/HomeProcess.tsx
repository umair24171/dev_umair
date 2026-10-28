import Link from 'next/link';
import { processSteps } from '@/lib/site';
import styles from './HomeProcess.module.css';

const outcomes = ['A shared picture of the task.', 'The scope, agreed together.', 'Working milestones. Tested cases.', 'Source, access and operating notes.'];
const artifacts = [
  { label: 'Task map', title: 'Inputs, tools and owner', detail: 'Exceptions made visible' },
  { label: 'Agreed scope', title: 'Deliverables and boundaries', detail: 'Approval points and price' },
  { label: 'Test examples', title: 'Complete, missing and duplicate', detail: 'Failures tested too' },
  { label: 'Handover', title: 'Source and operating notes', detail: 'Access and ownership' },
];

export default function HomeProcess() {
  return <section id="process" className={styles.section} aria-labelledby="home-process-heading">
    <div className={styles.container}>
      <header className={styles.heading}><div><h2 id="home-process-heading">From the first task<br/><span>to a clear handover.</span></h2></div><p>Know what is included, evaluate the exceptions and leave with a workflow you can understand and operate.</p></header>
      <div className={styles.layout}>
        <ol className={styles.steps}>{processSteps.map((step, index) => <li key={step.title}>
          <div className={styles.artifact}><span>{artifacts[index].label}</span><strong>{artifacts[index].title}</strong><small>{artifacts[index].detail}</small></div>
          <span className={styles.number} aria-hidden="true">0{index + 1}</span>
          <div><h3>{step.title}</h3><p className={styles.outcome}>{outcomes[index]}</p><p className={styles.description}>{step.text}</p></div>
        </li>)}</ol>
      </div>
      <aside id="pricing" className={styles.scope}><div><h3>A clear price starts with a clear scope.</h3><p>The proposal defines deliverables, milestones and costs. Hosting, model usage and other third-party fees are identified separately. Support and handover are agreed before work starts.</p></div><Link href="/pricing">How estimates work </Link></aside><p className="section-copy"><Link href="/samples/inquiry-pilot-scope">Read the sample scope</Link>. <Link href="/samples/inquiry-pilot-operating-notes">Read the sample operating notes</Link>.</p>
    </div>
  </section>;
}
