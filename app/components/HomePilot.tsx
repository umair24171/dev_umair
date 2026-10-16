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
    <div className={styles.main}>
      <div className={styles.intro}>
        <p className={styles.eyebrow}>A SMALL FIRST ENGAGEMENT</p>
        <h2 id="pilot-heading">Start with an inquiry workflow pilot.</h2>
        <p className={styles.description}>For a service business that copies incoming requests into a tracker and writes each first reply by hand. Scope one intake source, one agreed destination and a named human reviewer.</p>
        <div className={styles.actions}><Link href="/contact?service=workflow-automation" className="button">Discuss an inquiry pilot <span aria-hidden="true">↗</span></Link><Link href="/work/inquiry-assistant">Try the sample workflow <span aria-hidden="true">→</span></Link></div>
      </div>
      <div className={styles.scope}><h3>Deliverables to agree</h3><ol>{deliverables.map(item => <li key={item}>{item}</li>)}</ol></div>
    </div>
    <div className={styles.boundary}><h3>Outside this starting scope</h3><p>Bulk outreach, additional channels or integrations, historic data migration, ongoing monitoring and tool subscriptions. Any additions require a separate agreement.</p></div>
    <p className={styles.feasibility}>Feasibility, final deliverables, fee and timing are agreed after reviewing your tools and sample data. If intake is not your bottleneck, we can scope a focused investigation of one other workflow instead.</p>
  </section>;
}
