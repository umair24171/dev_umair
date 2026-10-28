import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';

const title = 'Data handling and security';
const description = 'What the BuildZn website stores, which services receive data, and the access and review decisions to agree before a client build.';
export const metadata: Metadata = {
  title, description, alternates: { canonical: site.url + '/security' },
  openGraph: { title, description, url: site.url + '/security', images: [{ url: '/security/opengraph-image', width: 1200, height: 630, alt: 'BuildZn data handling and security' }] },
  twitter: { card: 'summary_large_image', title, description, images: ['/security/opengraph-image'] },
};

export default function Security() {
  return <main id="main-content">
    <section className="shell page-hero"><h1>Know where your data goes.</h1><p className="section-copy">I’m Umair, the developer behind BuildZn. Here is how this website handles information and what needs to be agreed before I build a workflow for your business.</p></section>
    <article className="shell content-page">
      <h2>What to share in an inquiry</h2>
      <p>The contact form asks for your name, email, service and a short workflow brief. Budget and referral details are optional. Describe the task, the tools involved and who checks the result. A redacted example is enough to start.</p>
      <p>Please leave out passwords, API keys, sensitive personal data and confidential client records. Do not paste credentials into the form or public demos. If the work needs sensitive material, ask me how to share it before sending it.</p>
      <h2>The three browser demos</h2>
      <p>The inquiry, support and document workflows run in your browser. They use local parsing, matching and templates. They do not call an AI provider or model, send your input to a server, or connect to a CRM, help desk or accounting account.</p>
      <p>Input stays in the current page and clears when you reload. The invoice workflow can download a CSV or JSON file after review. A downloaded file remains wherever you save it. <Link href="/evidence">Read what the site shows</Link>.</p>
      <h2>Your website inquiry</h2>
      <p>After validation, your inquiry is saved in my authenticated operations workspace. The application encrypts its records before saving them in a separate private GitHub repository. Vercel hosts the website and the workspace.</p>
      <p>Formspree receives an owner notification with a record reference and a link to the workspace. It does not receive the brief or contact details in that notification. Historical submissions may still exist in Formspree and email inboxes from earlier form handling.</p>
      <p>The on-screen receipt confirms that an inquiry was saved. It reports whether the owner notification service accepted an alert, which does not establish inbox delivery. Visitor email receipts are not enabled yet. No automatic sales sequence follows a form submission.</p>
      <h2>Storage, logs and retention</h2>
      <p>Inquiry records include the submitted details and operational information such as status, timestamps and review history. The server also keeps a hashed IP rate-limit record to limit repeated submissions. The inquiry route checks a honeypot.</p>
      <p>The private storage repository keeps encrypted historical versions until its history is purged. Removing the latest record alone does not remove those versions. No automatic time-based deletion period is configured in the inspected storage code.</p>
      <p>Vercel can process technical request information to host the site. Optional Google Analytics runs only after you allow it. Custom events do not include form content, names, emails or phone numbers. Your choice is stored in your browser and can be changed through Analytics settings.</p>
      <h2>AI providers in client builds</h2>
      <p>The provider, model and data sent depend on the project. I agree those choices in writing before a build starts. That agreement should name the inputs, permitted uses and retention settings. There is no single model provider or retention promise for every client build.</p>
      <h2>Accounts, permissions and secrets</h2>
      <p>You own your business accounts and API keys. Access is granted for the project and removed at handover. The scope identifies which accounts and permissions the workflow needs.</p>
      <p>On this website, server credentials and the storage encryption key are read from environment variables. They are not form fields or analytics parameters.</p>
      <h2>Human review and approval</h2>
      <p>I agree approval points before implementation. Unattended sending and financial actions stay outside the scope unless they are explicitly agreed. An editable draft should return to review when its content changes.</p>
      <h2>Limits</h2>
      <p>I do not offer a security certification through this service or guarantee AI accuracy. A test can check an agreed example. It cannot prove that every future input is safe or correct.</p>
      <h2>Raise a concern</h2>
      <p>Email <a href={`mailto:${site.email}`}>{site.email}</a> to ask about access, correct an inquiry or request deletion. Include enough context to identify the request and leave out sensitive documents.</p>
    </article>
  </main>;
}
