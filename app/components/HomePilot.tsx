import Link from 'next/link';
import { site } from '@/lib/site';
import styles from './HomePilot.module.css';

export default function HomePilot() {
  return <section className={styles.section} aria-labelledby="pilot-heading"><div className={styles.container}>
    <div className={styles.intro}>
      <h2 id="pilot-heading">Start with an<br/><span>inquiry workflow pilot.</span></h2>
      <p className={styles.description}>One intake source, one destination and a reply draft for human approval. Agree the fields, owner and acceptance checks before the build.</p>
      {(site.pilotPrice || site.discoveryFee) && <p className={styles.description}>{site.pilotPrice && <>Pilot starting range: {site.pilotPrice}. </>}{site.discoveryFee && <>Discovery fee: {site.discoveryFee}. </>}The final fee depends on scope.</p>}
      <div className={styles.actions}><Link href="/pricing#inquiry-pilot" className={styles.button}>See the pilot scope and pricing</Link></div>
    </div>
  </div></section>;
}
