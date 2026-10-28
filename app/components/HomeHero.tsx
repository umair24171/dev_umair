import Image from 'next/image';
import Link from 'next/link';
import TrackedLink from './TrackedLink';
import { createInquiryLead, inquirySamples, parseInquiry } from '@/lib/demos';
import styles from './HomeHero.module.css';

const input = inquirySamples.complete
  .replace('Alex Morgan', 'Operations lead')
  .replace('alex@example.com', 'intake@example.invalid')
  .replace('Sample Studio', 'Local service team');
const record = parseInquiry(input);
const lead = createInquiryLead(record)!;
const reply = lead.draft.split('Please review')[0].trim() + String.fromCharCode(10, 10) + 'Workflow owner';

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
      <div className={styles.workbench} aria-label="Inquiry workflow">
        <section className={styles.incoming} aria-labelledby="hero-inquiry-heading">
          <h2 id="hero-inquiry-heading">Incoming inquiry</h2>
          <p>{record.requirements.request}</p>
          <dl><dt>Tools</dt><dd>{record.requirements.tools}</dd><dt>Volume</dt><dd>{record.requirements.volume}</dd></dl>
        </section>
        <section className={styles.record} aria-labelledby="hero-record-heading">
          <h2 id="hero-record-heading">Structured record</h2>
          <dl><dt>Contact</dt><dd>{record.contact.name}</dd><dt>Owner</dt><dd>Workflow owner</dd><dt>Next step</dt><dd>Review requirements and reply</dd><dt>Status</dt><dd>Awaiting approval</dd></dl>
        </section>
        <div className={styles.reply}>
          <label htmlFor="hero-reply">Reply draft</label>
          <textarea id="hero-reply" defaultValue={reply} rows={7} spellCheck={false}/>
          <Link href="/work/inquiry-assistant">Open the inquiry workflow</Link>
        </div>
      </div>
    </div>
  </section>;
}
