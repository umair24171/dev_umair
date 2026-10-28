import type { Metadata } from 'next';
import FirstEngagement from '../components/FirstEngagement';
import Link from 'next/link';
import { site } from '@/lib/site';

const title = 'Automation pricing and scope';
const description = 'Scope a focused inquiry pilot, review deliverables and acceptance checks, and separate the build fee from provider costs.';
export const metadata: Metadata = {
  title, description, alternates: { canonical: site.url + '/pricing' },
  openGraph: { title, description, url: site.url + '/pricing', images: [{ url: '/pricing/opengraph-image', width: 1200, height: 630, alt: 'BuildZn automation pricing and scope' }] },
  twitter: { card: 'summary_large_image', title, description, images: ['/pricing/opengraph-image'] },
};
export default function Pricing() {
  return <main id="main-content">
    <section className="shell page-hero"><h1>A clear scope.<br/>A price you can understand.</h1><p className="section-copy">I quote implementation against an agreed task and acceptance criteria. I assess feasibility before quoting a build. The final fee depends on the scope.</p></section>
    <div className="shell"><FirstEngagement/></div>
    <article className="shell content-page">
      <h2>Start with discovery</h2><p>Share one workflow, its current steps, representative inputs, connected tools and the person responsible for exceptions. If an investigation is needed, its deliverables and fee are agreed before it begins. Discovery can lead to a build, a repair or a recommendation to keep the task manual.</p>
      <h2>What determines the build scope</h2><ul>
        <li>The number of systems and the API access available on your plans.</li>
        <li>Data quality, volume, validation and duplicate handling.</li>
        <li>AI retrieval, tool permissions, evaluation examples and review steps.</li>
        <li>Security requirements, exception handling, logging and recovery.</li>
        <li>Migration, deployment, documentation and handover.</li>
      </ul>
      <h2>What the proposal includes</h2><p>Deliverables, exclusions, account dependencies, acceptance checks, milestones, payment terms and a price. I discuss changes to the workflow or connected systems before further work starts.</p>
      <h2>Operating costs are separate</h2><p>Model API calls, automation platform subscriptions, hosting, databases, messaging and provider fees may continue after delivery. I identify the required accounts and estimate usage under an agreed workload. You own your business accounts. Access and plan limits can affect what is feasible.</p>
      <h2>Data and account access</h2><p>I agree the data, providers, permissions and review points before implementation. <Link href="/security">Read how I handle data and access</Link> before sharing business records.</p>
      <h2>Repair and ongoing support</h2><p>A repair starts with logs and a reproducible failure. Investigation and implementation may be separate scopes. Monitoring, incident response, maintenance and new features require an agreed support arrangement. The proposal defines any included defect-support period.</p>
      <h2>Measure usefulness without guaranteed savings</h2><p>Choose a baseline and an evaluation method together. Handling time, error rates, review effort and provider costs can help assess a workflow. I do not promise guaranteed income, cost savings or universal AI accuracy.</p>
      <p><Link href="/evidence">See what the portfolio evidence shows</Link>.</p>
      <Link href="/contact" className="button">Share your workflow</Link>
    </article>
  </main>;
}
