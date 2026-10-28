import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import styles from '../SampleDocument.module.css';

const title = 'Sample inquiry pilot scope and acceptance';
const description = 'A fictional inquiry pilot scope covering inputs, ownership, review points, deliverables, acceptance tests, milestones and commercial terms.';
export const metadata: Metadata = {
  title, description, alternates: { canonical: site.url + '/samples/inquiry-pilot-scope' },
  openGraph: { title, description, url: site.url + '/samples/inquiry-pilot-scope', images: [{ url: '/samples/inquiry-pilot-scope/opengraph-image', width: 1200, height: 630, alt: 'Sample inquiry pilot scope and acceptance' }] },
  twitter: { card: 'summary_large_image', title, description, images: ['/samples/inquiry-pilot-scope/opengraph-image'] },
};
export default function ScopeSample() {
  return <main id="main-content" className={`shell content-page ${styles.document}`}>
    <p className={styles.note}>This is a sample document using fictional business data.</p>
    <h1>Inquiry pilot: scope and acceptance</h1>
    <p>Prepared for an example service business. Version 1. The written scope defines dates, account access and commercial terms before work starts.</p>
    <nav className={styles.actions} aria-label="Sample document actions"><a href="/samples/inquiry-pilot-scope.pdf" download>Download PDF</a><Link href="/samples">All sample documents</Link></nav>
    <section><h2>1. Purpose and boundaries</h2><p>Capture an incoming service request once, check the required information, create a record and prepare an editable first reply for a named person to review.</p><p>The pilot covers one intake source, one agreed destination and one human review step. It does not send a reply without approval.</p></section>
    <section><h2>2. Input map and required fields</h2><dl>
      <dt>Source and trigger</dt><dd>One website inquiry form. A valid submission starts the workflow.</dd>
      <dt>Required input</dt><dd>A unique request ID, contact name, valid email, requested task and tools involved. The agreed source supplies the request ID.</dd>
      <dt>Optional input</dt><dd>Company and expected request volume. Other fields require an agreed reason and retention rule.</dd>
      <dt>Destination</dt><dd>One inquiry tracker with an agreed field map and access owner.</dd>
      <dt>Output</dt><dd>One traceable record with input reference, required details, owner, status, timestamps, missing information and a reply draft.</dd>
    </dl><p>Fictional acceptance input: request INQ-EXAMPLE-001; contact Example Contact; email contact@example.invalid; task “Route website inquiries to a reviewer”; tools “Website form and inquiry tracker”.</p><p>Credentials, confidential records and sensitive personal information are not part of the test input.</p></section>
    <section><h2>3. Owners and approval points</h2><ul>
      <li>The client names an intake owner, a reviewer and a backup reviewer.</li>
      <li>I implement the agreed workflow and provide the acceptance record and handover notes.</li>
      <li>The reviewer checks the record and edits the reply before approval. An edit requires another review.</li>
      <li>Sending, account changes and financial actions need separately agreed permissions. This starting scope does not include unattended sending.</li>
    </ul></section>
    <section><h2>4. Deliverables</h2><ul>
      <li>An input map showing required fields, field ownership and review points.</li>
      <li>One intake-to-record workflow with validation, duplicate handling and a visible failure state.</li>
      <li>An editable reply draft with an explicit human approval step.</li>
      <li>Results for the acceptance checks below, including failures and recovery.</li>
      <li>Source or workflow access, operating notes and a handover walkthrough.</li>
    </ul></section>
    <section><h2>5. Exclusions and dependencies</h2><p>Bulk outreach, extra intake channels or integrations, historic data migration, OCR, ongoing monitoring, tool subscriptions and performance guarantees are outside this starting scope.</p><p>The client supplies authorized access, representative redacted inputs, an accountable reviewer and the required provider plans. Provider API access and quotas are checked before work is committed.</p></section>
    <section><h2>6. Acceptance tests</h2><dl>
      <dt>Complete request</dt><dd>Submit INQ-EXAMPLE-001 with every required field. Exactly one record contains the agreed mapped values. A reply draft is available for review. No reply is sent automatically.</dd>
      <dt>Incomplete request</dt><dd>Remove the email or requested task. The missing field is visible to the operator. The workflow does not silently treat the request as complete or send a reply.</dd>
      <dt>Duplicate request</dt><dd>Deliver the same request ID twice. The destination has one record and the second delivery is identifiable. A safe replay does not produce a second reply draft for sending.</dd>
      <dt>Failed request</dt><dd>Simulate destination unavailability. The operator can identify the failed request and stage without exposing credentials. After recovery, an approved retry completes once without a duplicate.</dd>
      <dt>Approval reset</dt><dd>Approve a draft, then edit it. The revised content requires review again.</dd>
    </dl><p>The client reviewer checks the evidence against these agreed cases. New requirements are recorded as changes rather than added silently to acceptance.</p></section>
    <section><h2>7. Milestones</h2><ol>
      <li>Confirm the input map, access, reviewers and acceptance examples.</li>
      <li>Review the implemented workflow and failure paths.</li>
      <li>Run the agreed acceptance checks and record corrections.</li>
      <li>Accept the agreed scope and complete the handover.</li>
    </ol></section>
    <section><h2>8. Fees, costs and payment</h2><p>Final fees depend on the agreed scope. Agree the fee, currency and payment terms in writing before work starts.</p><p>Hosting, model usage, databases, automation subscriptions, email and other provider costs are listed separately.</p></section>
    <section><h2>9. Changes and handover</h2><p>Record a requested change, its reason and its effect on scope, acceptance checks, dates and price. I agree those effects in writing before implementing work outside the approved scope.</p><p>At handover, the client owns the business accounts and API keys. Record source or workflow access, the operating notes, acceptance results and the removal of project permissions.</p></section>
    <p><Link href="/samples/inquiry-pilot-operating-notes">Read the operating notes</Link> or <Link href="/pricing#inquiry-pilot">return to the pilot offer</Link>.</p>
  </main>;
}
