import Link from 'next/link';
import { site } from '@/lib/site';
import styles from './HomePilot.module.css';

export default function HomePilot() {
  return <section className={styles.section} aria-labelledby="pilot-heading"><div className={styles.container}>
    <div className={styles.main}>
      <div className={styles.intro}>
        <h2 id="pilot-heading">Start with an<br/><span>inquiry workflow pilot.</span></h2>
        <p className={styles.description}>One intake source, one destination and a reply draft for human approval. Agree the fields, owner and acceptance checks before the build.</p>
        {(site.pilotPrice || site.discoveryFee) && <p className={styles.description}>{site.pilotPrice && <>Pilot starting range: {site.pilotPrice}. </>}{site.discoveryFee && <>Discovery fee: {site.discoveryFee}. </>}The final fee depends on scope.</p>}
        <div className={styles.actions}><Link href="/pricing#inquiry-pilot" className={styles.button}>See the pilot scope and pricing</Link></div>
        <div className={styles.documents} aria-label="Pilot sample documents">
          <Link href="/samples/inquiry-pilot-scope">Sample scope</Link>
          <Link href="/samples/inquiry-pilot-operating-notes">Operating notes</Link>
        </div>
      </div>
      <aside className={styles.workflow} aria-labelledby="pilot-workflow-heading">
        <h3 id="pilot-workflow-heading">One request, ready for review.</h3>
        <ol className={styles.stages}>
          <li><span className={styles.marker} aria-hidden="true"/><div><h4>Intake</h4><p>One source, with agreed required fields.</p></div></li>
          <li><span className={styles.marker} aria-hidden="true"/><div><h4>Record</h4><p>One destination, with an owner and a clear request status.</p></div></li>
          <li><span className={styles.marker} aria-hidden="true"/><div><h4>Review</h4><p>An editable reply draft for a person to check and approve.</p></div></li>
        </ol>
        <p className={styles.approval}><span aria-hidden="true"/>Approval stays with your team.</p>
      </aside>
    </div>
  </div></section>;
}
