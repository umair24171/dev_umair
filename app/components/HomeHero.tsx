import Image from 'next/image';
import Link from 'next/link';
import TrackedLink from './TrackedLink';
import styles from './HomeHero.module.css';

export default function HomeHero() {
  return <section className={styles.hero} aria-labelledby="hero-heading">
    <div className={styles.content}>
      <p className={styles.eyebrow}>AI AGENTS & AUTOMATION STUDIO</p>
      <div className={styles.top}>
        <h1 id="hero-heading">Automate the busywork<br/>behind your<br/><span>service business.</span></h1>
        <div className={styles.intro}>
          <p className={styles.description}>Spend less of your day sorting inquiries, repeating support answers and copying data between tools. BuildZn builds focused workflows for service businesses, with you in control of the decisions.</p>
          <div className={styles.actions}>
            <TrackedLink href="/contact" className={styles.primary} location="hero">Discuss your workflow <span aria-hidden="true">↗</span></TrackedLink>
            <Link href="/work" className={styles.secondary}>Explore the work <span aria-hidden="true">↓</span></Link>
          </div>
          <div className={styles.founder}>
            <Image src="/umair-bilal.webp" alt="" width={35} height={35}/>
            <p>Work directly with Umair Bilal.<span>Clear scope. Human review. Documented handover.</span></p>
          </div>
        </div>
      </div>
      <figure className={styles.scene}>
        <Image
          className={styles.image}
          src="/home-studio/workflow-planning.webp"
          alt="Illustrative photograph of an inquiry workflow being mapped on a glass board, ending at human review."
          width={1536}
          height={1024}
          sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1050px) calc(100vw - 64px), (max-width: 1376px) calc(100vw - 96px), 1280px"
          loading="eager"
          fetchPriority="high"
        />
        <figcaption className={styles.caption}>
          <div>
            <strong>A lead and a reply. The decision stays yours.</strong>
            <span>Illustrative workflow-planning scene · Based on the inquiry demo · Sample data</span>
          </div>
          <Link href="/work/inquiry-assistant">Try the working demo <span aria-hidden="true">↗</span></Link>
        </figcaption>
      </figure>
    </div>
  </section>;
}
