import Image from 'next/image';
import Link from 'next/link';
import TrackedLink from './TrackedLink';
import styles from './HomeHero.module.css';

const steps = [
  { title: 'Incoming inquiry', caption: 'Capture the request', icon: 'inquiry' },
  { title: 'Structured record', caption: 'Organize the details', icon: 'record' },
  { title: 'Human approval', caption: 'Review the reply', icon: 'approval' },
] as const;

function WorkflowIcon({ type }: { type: typeof steps[number]['icon'] }) {
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {type === 'inquiry' && <><path d="M9 4h10l5 5v19H8V5a1 1 0 0 1 1-1Z"/><path d="M19 4v6h5M12 15h8M12 19h8M12 23h5"/></>}
    {type === 'record' && <><rect x="5" y="5" width="22" height="7" rx="2"/><rect x="5" y="12" width="22" height="7" rx="2"/><rect x="5" y="19" width="22" height="7" rx="2"/><path d="M10 8.5h.01M10 15.5h.01M10 22.5h.01M15 8.5h7M15 15.5h7M15 22.5h7"/></>}
    {type === 'approval' && <><circle cx="14" cy="10" r="5"/><path d="M4 27v-3a10 10 0 0 1 16-8M21 24l3 3 5-7"/></>}
  </svg>;
}

export default function HomeHero() {
  return <section className={styles.hero} aria-labelledby="hero-heading">
    <div className={styles.content}>
      <div className={styles.copy}>
        <h1 id="hero-heading">Automate the busywork<br className={styles.lineBreak}/> behind your<br className={styles.lineBreak}/><span> service business.</span></h1>
        <p className={styles.description}>I build workflows that sort inquiries, prepare support answers and move information between your tools. You review the decisions that need your judgment.</p>
        <div className={styles.actions}>
          <TrackedLink href="/contact" className={styles.primary} location="hero">Discuss your workflow</TrackedLink>
          <Link href="/work" className={styles.secondary}>Explore the work</Link>
        </div>
        <div className={styles.founder}>
          <Image src="/umair-bilal.webp" alt="" width={40} height={40}/>
          <p>Work directly with Umair Bilal.<br/><span>Clear scope. Human review. Documented handover.</span></p>
        </div>
      </div>
      <div className={styles.visual} role="group" aria-label="Inquiry workflow">
        <ol className={styles.flow}>
          {steps.map(step => <li className={styles.step} key={step.icon}>
            <span className={styles.icon}><WorkflowIcon type={step.icon}/></span>
            <div className={styles.stepCopy}>
              <h2>{step.title}</h2>
              <p>{step.caption}</p>
            </div>
          </li>)}
        </ol>
        <div className={styles.portrait}>
          <Image src="/hero/umair-pointing.webp" alt="Umair Bilal gesturing toward the inquiry workflow." width={1024} height={1536} sizes="(max-width: 600px) 280px, (max-width: 1000px) 420px, 440px" priority/>
        </div>
      </div>
    </div>
  </section>;
}
