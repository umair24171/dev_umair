import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import styles from '../SampleDocument.module.css';

const title = 'Sample inquiry pilot operating notes';
const description = 'Fictional operating notes for checking an inquiry workflow, reading logs, recovering failures, pausing intake and rotating keys.';
export const metadata: Metadata = {
  title, description, alternates: { canonical: site.url + '/samples/inquiry-pilot-operating-notes' },
  openGraph: { title, description, url: site.url + '/samples/inquiry-pilot-operating-notes', images: [{ url: '/samples/inquiry-pilot-operating-notes/opengraph-image', width: 1200, height: 630, alt: 'Sample inquiry pilot operating notes' }] },
  twitter: { card: 'summary_large_image', title, description, images: ['/samples/inquiry-pilot-operating-notes/opengraph-image'] },
};
export default function OperatingSample() {
  return <main id="main-content" className={`shell content-page ${styles.document}`}>
    <p className={styles.note}>This is a sample document using fictional business data.</p>
    <h1>Inquiry pilot: operating notes</h1>
    <p>For an example service business with one website form, one inquiry tracker and a named reviewer. The handover identifies the deployed workflow, account owners and operator controls.</p>
    <nav className={styles.actions} aria-label="Sample document actions"><a href="/samples/inquiry-pilot-operating-notes.pdf" download>Download PDF</a><Link href="/samples">All sample documents</Link></nav>
    <section><h2>1. How it runs</h2><ol>
      <li>A website inquiry arrives with a request ID.</li>
      <li>The workflow checks required fields and looks for an earlier delivery of the same request.</li>
      <li>A valid request becomes one tracker record. Missing details and failures stay visible.</li>
      <li>A reply draft is prepared for the reviewer. Editing a draft resets approval.</li>
      <li>The reviewer chooses the next action. Sending and financial actions require the permissions agreed in scope.</li>
    </ol><p>Keep secret values out of operating notes.</p></section>
    <section><h2>2. Daily checks</h2><ul>
      <li>Compare new intake requests with tracker records. Investigate a missing or repeated request ID.</li>
      <li>Review requests with missing fields and drafts waiting for approval.</li>
      <li>Check failed runs and interrupted attempts before replaying anything.</li>
      <li>Confirm who owns each unresolved exception. Do not assume an alert means someone acted.</li>
    </ul></section>
    <section><h2>3. Weekly checks</h2><ul>
      <li>Review repeated failures, duplicates and time spent resolving exceptions.</li>
      <li>Check provider quotas and usage against the agreed workload.</li>
      <li>Check that account permissions still match the workflow scope.</li>
      <li>Use an agreed controlled request to check intake, review and recovery after a provider or workflow change.</li>
      <li>Apply the agreed retention and deletion schedule.</li>
    </ul></section>
    <section><h2>4. Read the logs</h2><p>At handover, record where an authorized operator can see run history and how long it is kept.</p><dl>
      <dt>Request ID</dt><dd>Connects the intake, tracker record and run history. Example: INQ-EXAMPLE-001.</dd>
      <dt>Stage and status</dt><dd>Shows whether validation, record creation or review preparation completed, failed or needs attention.</dd>
      <dt>Timestamp and attempt</dt><dd>Helps distinguish an original delivery from a later retry.</dd>
      <dt>Safe failure reason</dt><dd>Names the failed stage and whether recovery is possible without exposing credentials or copying a full inquiry into diagnostic logs.</dd>
    </dl><p>A successful record save is different from a delivered email or a completed downstream action. Check the result for the specific stage.</p></section>
    <section><h2>5. Recognize a failure and recover</h2><p>A missing required field needs correction. An expired credential needs authorized access repair. A quota or destination outage may need a later retry. A saved record with an uncertain later action needs reconciliation before replay.</p><ol>
      <li>Find the request ID and last confirmed successful stage.</li>
      <li>Check whether the destination already has the record or action.</li>
      <li>Resolve the cause or ask the account owner for help.</li>
      <li>Use the agreed retry control only after checking duplicate protection.</li>
      <li>Confirm the destination and review queue, then record the resolution.</li>
    </ol><p>Do not repeatedly resubmit a request when the last outcome is uncertain.</p></section>
    <section><h2>6. Pause the workflow</h2><p>Use the agreed disable control for the intake trigger. Then check any in-flight run and queued work before resuming. Preserve the request references needed for recovery.</p><p>Ask the named operator before changing a live workflow if you do not know the pause and recovery controls.</p></section>
    <section><h2>7. Rotate a key</h2><ol>
      <li>Have the client account owner create a replacement with only the required permissions.</li>
      <li>Update the credential through the agreed secret store or platform control. Do not paste it into source, logs or these notes.</li>
      <li>Check a controlled request and its destination.</li>
      <li>Revoke the old key and verify it is no longer used.</li>
      <li>Record who changed it and when, without recording the value.</li>
    </ol><p>If a key is exposed, pause affected work and have the account owner revoke it.</p></section>
    <section><h2>8. Ownership and contacts</h2><p>The client owns the business accounts and API keys. Project permissions are removed at handover.</p><p>For a question about the agreed BuildZn implementation, contact <a href={`mailto:${site.email}`}>{site.email}</a>. Include the request ID, failed stage and a redacted observation. Do not send credentials or full confidential records.</p><p>An inquiry address is not an ongoing monitoring service.</p></section>
    <section><h2>9. Outside these notes</h2><p>New channels, additional integrations, historic migration, bulk outreach, unattended sending, new features and ongoing monitoring require a separate scope. A new provider limit or changed API can require investigation rather than a routine retry.</p></section>
    <p><Link href="/samples/inquiry-pilot-scope">Read the scope and acceptance document</Link> or <Link href="/pricing#inquiry-pilot">return to the pilot offer</Link>.</p>
  </main>;
}
