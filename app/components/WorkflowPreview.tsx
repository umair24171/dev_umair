import Link from 'next/link';
import styles from './WorkflowPreview.module.css';

function WorkflowIcon({ kind }: { kind: 'inbox' | 'spark' | 'record' | 'reply' }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === 'inbox' && <><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 7 9 6 9-6"/></>}
    {kind === 'spark' && <><path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4Z"/><path d="m20 2 .6 1.4L22 4l-1.4.6L20 6l-.6-1.4L18 4l1.4-.6Z"/></>}
    {kind === 'record' && <><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 8h8M8 12h8M8 16h4"/></>}
    {kind === 'reply' && <><path d="M8 10H5l4-4m-4 4 4 4M5 10h9a5 5 0 0 1 5 5v3"/></>}
  </svg>;
}

export default function WorkflowPreview() {
  return <figure className={styles.preview} aria-labelledby="workflow-caption">
    <figcaption className={styles.header} id="workflow-caption">
      <span><i aria-hidden="true"/> FROM REQUEST TO REVIEW</span>
      <span className={styles.sample}>SAMPLE / 01</span>
    </figcaption>
    <div className={styles.canvas}>
      <div className={styles.input}>
        <div className={styles.cardLabel}><span className={styles.icon}><WorkflowIcon kind="inbox"/></span><strong>Inquiry received</strong><span className={styles.step}>01</span></div>
        <p>“Help us organize service requests.”</p>
        <div className={styles.inputMeta}><span>Website inquiry</span><span>Fictional example</span></div>
      </div>
      <div className={styles.connector} aria-hidden="true"><span/></div>
      <div className={styles.processor}>
        <span className={styles.processorIcon}><WorkflowIcon kind="spark"/></span>
        <div><strong>Requirements structured</strong><span>Task · tools · missing information</span></div>
        <span className={styles.step}>02</span>
      </div>
      <div className={styles.branch} aria-hidden="true"><span/><span/></div>
      <div className={styles.outputs}>
        <div className={styles.output}>
          <div className={styles.cardLabel}><WorkflowIcon kind="record"/><strong>Lead record</strong><span className={styles.outputDot} aria-hidden="true"/></div>
          <dl><div><dt>Request</dt><dd>Service intake</dd></div><div><dt>Source</dt><dd>Website</dd></div><div><dt>Status</dt><dd><span className={styles.tag}>Needs review</span></dd></div></dl>
        </div>
        <div className={styles.output}>
          <div className={styles.cardLabel}><WorkflowIcon kind="reply"/><strong>Reply draft</strong><span className={styles.draft}>DRAFT</span></div>
          <p>Thanks for reaching out. Which tools do you use to track requests?</p>
          <div className={styles.draftLines} aria-hidden="true"><span/><span/></div>
          <span className={styles.editable}>Prepared for your review</span>
        </div>
      </div>
      <div className={`${styles.branch} ${styles.merge}`} aria-hidden="true"><span/><span/></div>
      <div className={styles.approval}>
        <span className={styles.reviewIcon} aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="3"/><path d="M5 21v-3a7 7 0 0 1 14 0v3"/></svg></span>
        <div><strong>Human approval</strong><span>Review before anything is sent</span></div>
        <span className={styles.reviewPill}>Your call <span aria-hidden="true">↗</span></span>
      </div>
    </div>
    <div className={styles.footer}><span>Sample data. Real workflow logic.</span><Link href="/work/inquiry-assistant">Try the demonstration <span aria-hidden="true">↗</span></Link></div>
  </figure>;
}
