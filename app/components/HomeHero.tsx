import Image from 'next/image';
import Link from 'next/link';
import TrackedLink from './TrackedLink';
import reviewScene from '@/public/hero/inquiry-review-1536.webp';
import styles from './HomeHero.module.css';

export default function HomeHero() {
  return <section className={styles.hero} aria-labelledby="hero-heading">
    <div className={styles.content}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}><span aria-hidden="true"/> AI AGENTS & AUTOMATION STUDIO</p>
        <h1 id="hero-heading">Automate the busywork<br className={styles.lineBreak}/> behind your<br className={styles.lineBreak}/><span> service business.</span></h1>
        <p className={styles.description}>Spend less of your day sorting inquiries, repeating support answers and copying data between tools. BuildZn builds focused workflows for service businesses, with you in control of the decisions.</p>
        <div className={styles.actions}>
          <TrackedLink href="/contact" className={styles.primary} location="hero">Discuss your workflow <span aria-hidden="true">↗</span></TrackedLink>
          <Link href="/work" className={styles.secondary}>Explore the work <span aria-hidden="true">↓</span></Link>
        </div>
        <div className={styles.founder}>
          <Image src="/umair-bilal.webp" alt="" width={40} height={40}/>
          <p>Work directly with Umair Bilal.<br/><span>Clear scope. Human review. Documented handover.</span></p>
        </div>
      </div>
    </div>
    <figure className={styles.scene}>
      <Image className={styles.image} src={reviewScene} alt="Illustrative scene of a sample inquiry organized into a lead and a draft reply awaiting human review." fill sizes="100vw" loading="eager" fetchPriority="high"/>
      <figcaption className={styles.caption}>
        <p>A lead and a reply. The decision stays yours.</p>
        <span>Illustrative scene · Based on the inquiry demo · Sample data</span>
        <Link href="/work/inquiry-assistant">Try the working demo <span aria-hidden="true">↗</span></Link>
      </figcaption>
    </figure>
  </section>;
}
