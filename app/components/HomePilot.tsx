import Link from 'next/link';
import styles from './HomePilot.module.css';

const deliverables = [
  'A map of the input, required fields, owner and approval points.',
  'One intake-to-record workflow with validation and duplicate handling.',
  'An editable reply draft for human approval; no unattended sending.',
  'Tests for complete, incomplete, duplicate and failed requests.',
  'Source or workflow access, operating notes and a handover walkthrough.',
];

export default function HomePilot() {
  return <section className={styles.section} aria-labelledby="pilot-heading">
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>A SMALL FIRST ENGAGEMENT</p>
          <h2 id="pilot-heading">Start with an<br/><span>inquiry workflow pilot.</span></h2>
          <p className={styles.description}>For a service business that copies incoming requests into a tracker and writes each first reply by hand. Scope one intake source, one agreed destination and a named human reviewer.</p>
          <div className={styles.flow}><span>One intake source</span><span className={styles.flowArrow} aria-hidden="true">→</span><span>One destination</span><span className={styles.flowArrow} aria-hidden="true">→</span><span>Human review</span></div>
          <div className={styles.actions}><Link href="/contact?service=workflow-automation" className={styles.button}>Discuss an inquiry pilot <span aria-hidden="true">↗</span></Link><Link href="/work/inquiry-assistant" className={styles.link}>Try the sample workflow <span aria-hidden="true">→</span></Link></div>
        </div>
        <div className={styles.deliverables}><h3>Deliverables to agree</h3><ol>{deliverables.map((item, index) => <li key={item}><span aria-hidden="true">0{index + 1}</span><p>{item}</p></li>)}</ol></div>
      </div>
      <div className={styles.notes}>
        <div><h3>Outside this starting scope</h3><p>Bulk outreach, additional channels or integrations, historic data migration, ongoing monitoring and tool subscriptions. Any additions require a separate agreement.</p></div>
        <p>Feasibility, final deliverables, fee and timing are agreed after reviewing your tools and sample data. If intake is not your bottleneck, we can scope a focused investigation of one other workflow instead.</p>
      </div>
    </div>
  </section>;
}
