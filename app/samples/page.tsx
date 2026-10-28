import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';

const title = 'Inquiry pilot sample documents';
const description = 'Read a sample scope and acceptance document and operating notes for a focused inquiry workflow pilot.';
export const metadata: Metadata = {
  title, description, alternates: { canonical: site.url + '/samples' },
  openGraph: { title, description, url: site.url + '/samples', images: [{ url: '/samples/opengraph-image', width: 1200, height: 630, alt: 'BuildZn inquiry pilot documents' }] },
  twitter: { card: 'summary_large_image', title, description, images: ['/samples/opengraph-image'] },
};
export default function Samples() {
  return <main id="main-content">
    <section className="shell page-hero"><h1>See the documents before the build.</h1><p className="section-copy">These examples show how I would define a focused inquiry pilot and explain its day-to-day operation.</p></section>
    <article className="shell content-page">
      <h2>Scope and acceptance</h2><p>Inputs, owners, approval points, deliverables, exclusions and the checks used to decide whether the agreed work is complete.</p><p><Link href="/samples/inquiry-pilot-scope">Read the scope and acceptance document</Link> or <a href="/samples/inquiry-pilot-scope.pdf" download>download its PDF</a>.</p>
      <h2>Operating notes</h2><p>Daily and weekly checks, log fields, recovery, pausing the workflow and replacing credentials.</p><p><Link href="/samples/inquiry-pilot-operating-notes">Read the operating notes</Link> or <a href="/samples/inquiry-pilot-operating-notes.pdf" download>download their PDF</a>.</p>
      <p>The web pages are also formatted for printing. <Link href="/pricing#inquiry-pilot">Read the inquiry pilot offer</Link> and <Link href="/security">check data handling</Link> before sending a brief.</p>
    </article>
  </main>;
}
