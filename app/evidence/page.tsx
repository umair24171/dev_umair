import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';

const title = "What this site does and doesn't show";
const description = 'A clear guide to the browser demos, public source walkthroughs, BuildZn systems and recorded project tests on this site.';
export const metadata: Metadata = {
  title, description, alternates: { canonical: site.url + '/evidence' },
  openGraph: { title, description, url: site.url + '/evidence', images: [{ url: '/evidence/opengraph-image', width: 1200, height: 630, alt: 'What the BuildZn portfolio shows' }] },
  twitter: { card: 'summary_large_image', title, description, images: ['/evidence/opengraph-image'] },
};

export default function Evidence() {
  return <main id="main-content">
    <section className="shell page-hero"><h1>What this site does and doesn&apos;t show</h1><p className="section-copy">Use the work to inspect how a system behaves and where its limits begin.</p></section>
    <article className="shell content-page">
      <p>The three browser demos run on sample data and take no external business actions. The public builds link to public source. Nothing on this site is a client result, a certification or a measured business outcome.</p>
      <h2>Browser workflows</h2>
      <p>I built the inquiry, support and document interfaces and their deterministic functions. You can inspect required-field checks, source matching, editable drafts, validation and review gates.</p>
      <p>These pages do not run a live language model or connected business accounts. They do not prove model quality, production integration or reliability under a client workload. The CSV and JSON downloads are real files created in your browser after review.</p>
      <h2>Public source walkthroughs</h2>
      <p>The NexusOS, content production and video production pages explain selected code from linked public repositories. The screenshots show this site’s walkthrough of that code.</p>
      <p>They do not show connected external application accounts. Reading a source path does not establish that a deployed account, database or publishing flow was exercised. Each page keeps its specific technical limits beside its evidence.</p>
      <h2>BuildZn’s own systems</h2>
      <p>The web platform and SEO content agent pages describe my own site and editorial tooling. Their source and checks make the implementation inspectable.</p>
      <p>They do not establish conversion improvements, search rankings or customer adoption. The editorial tooling is separate from the three browser workflows.</p>
      <h2>Command line agents</h2>
      <p>The four database workflow projects link to public source, recorded runs and test output. Those records show which bounded cases were exercised with fictional fixtures and a deterministic provider.</p>
      <p>Passing those tests does not establish live model quality or reliability in another business environment. Project pages identify the tested version, environment and remaining limits.</p>
      <h2>What to check before a build</h2>
      <p>A useful starting point is one input, one expected result and a named reviewer. The scope should identify permissions, failures, acceptance checks and the accounts needed to run it.</p>
      <p><Link href="/samples/inquiry-pilot-scope">Read a scope and acceptance example</Link>, <Link href="/security">check data handling</Link>, or <Link href="/work">inspect the work</Link>.</p>
    </article>
  </main>;
}
