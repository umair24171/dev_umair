import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import { PrivacySettings } from '../components/Analytics';

const title = 'Privacy and your inquiry';
const description = 'How BuildZn handles website inquiries, encrypted operational records and optional analytics.';
export const metadata: Metadata = {
  title, description, alternates: { canonical: site.url + '/privacy' },
  openGraph: { title, description, url: site.url + '/privacy', images: [{ url: '/privacy/opengraph-image', width: 1200, height: 630, alt: 'BuildZn privacy and your inquiry' }] },
  twitter: { card: 'summary_large_image', title, description, images: ['/privacy/opengraph-image'] },
};
export default function Privacy() {
  return <main id="main-content">
    <section className="shell page-hero"><h1>Privacy and your inquiry.</h1><p className="section-copy">This page describes the services used by this website and how I handle your project inquiry. Updated October 26, 2026.</p></section>
    <article className="shell content-page">
      <h2>Who to contact</h2>
      <p>BuildZn is Umair Bilal’s independent AI agents and business automation studio. For privacy questions, correction or deletion requests, contact <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
      <h2>Project inquiries</h2>
      <p>The inquiry form asks for your name, email, service and brief. Budget and referral details are optional. Details are saved as encrypted records in a separate private GitHub repository so I can review the request, prepare a reply and discuss potential work. Vercel hosts the authenticated workspace. I review inquiries personally and reply using the supplied email.</p>
      <p>After storage, Formspree sends an owner notification containing a record reference and a link to the private workspace, rather than your brief or contact details. The form confirms storage and reports whether the notification service accepted the alert. It does not promise inbox delivery. Visitor email receipts are not enabled yet. No automatic sales sequence follows a submission.</p>
      <p>Do not include passwords, API keys, sensitive personal data or confidential client records. The form checks a honeypot and limits repeated submissions using a hashed IP record.</p>
      <h2>Retained records</h2>
      <p>GitHub retains encrypted historical versions until repository history is purged. Deletion must cover those versions as well as the current record. Formspree holds owner notification references, and older submissions may remain there or in email inboxes.</p>
      <p>No automatic time-based deletion period was found in the inspected inquiry storage code.</p>
      <p>You can ask me to correct or delete inquiry information I control. Some provider or transaction records may be retained by their operators. See <a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">Formspree’s privacy policy</a>.</p>
      <h2>Demo inputs</h2>
      <p>The three browser workflows process text in the current page. They do not call model providers, save your input to a server or send it to connected business systems. Reloading clears the preview. Exported files remain where you save them. See <Link href="/evidence">what the site shows</Link>.</p>
      <h2>Optional analytics</h2>
      <p>Google Analytics loads only after you allow analytics. It can process page views, device and browser information, and interactions with pages, demos and contact actions. Custom events do not contain form content, names, emails or phone numbers.</p>
      <p>Your choice is saved in local browser storage. Declining analytics does not prevent browsing or sending an inquiry. Change your choice here: <PrivacySettings/>. Withdrawing permission after analytics has loaded reloads the website without loading it again. Previously stored provider cookies may remain until you clear them.</p>
      <p>Read <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google’s privacy policy</a>.</p>
      <h2>Hosting and external services</h2>
      <p>Vercel hosts the website and may process technical request information to deliver and protect it. See <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel’s privacy policy</a>.</p>
      <p>WhatsApp, LinkedIn and other external destinations have their own privacy practices. Following a link takes you to that service. This site does not automatically submit your workflow brief to WhatsApp.</p>
      <h2>Client work and sensitive material</h2>
      <p>Data access, AI providers and retention for client builds are agreed per project before implementation. <Link href="/security">Read the data handling and security page</Link> before sharing business records.</p>
      <h2>Questions or requests</h2>
      <p>Email me to ask what inquiry information I hold, correct it or request deletion. Include enough context to identify the inquiry without sending sensitive documents. I will review the request and explain any applicable limits.</p>
    </article>
  </main>;
}
