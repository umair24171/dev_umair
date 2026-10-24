import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { agentProjects, agentProjectPath } from '@/lib/agent-portfolio';
import { site } from '@/lib/site';
import styles from '@/app/components/AgentPortfolio.module.css';

export function generateStaticParams() { return agentProjects.map(({slug}) => ({slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata> {
  const {slug}=await params;const project=agentProjects.find(p=>p.slug===slug);
  return project?{title:project.name,description:project.summary,openGraph:{images:[{url:project.image.src,width:project.image.width,height:project.image.height,alt:project.image.alt}]},twitter:{card:'summary_large_image',images:[project.image.src]},alternates:{canonical:site.url+agentProjectPath(slug)}}:{};
}
export default async function AgentProjectPage({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;const project=agentProjects.find(p=>p.slug===slug);if(!project)notFound();
  return <main id="main-content">
    <section className="shell page-hero">
      <Link href="/work#agent-projects-title" className="breadcrumb">← All work</Link>
      <p className="eyebrow">BUILDZN / WORK</p>
      <h1>{project.name}</h1><p className={styles.intro}>{project.summary}</p>
      <div className="tags">{project.stack.map(tag=><span key={tag}>{tag}</span>)}</div>
      <div className={styles.evidence}><a className="button button-small" href={project.repoUrl} target="_blank" rel="noopener noreferrer">View GitHub source ↗</a><a className="button button-small button-secondary" href={project.ciUrl} target="_blank" rel="noopener noreferrer">Inspect passing CI ↗</a></div>
    </section>
    <div className={`shell ${styles.content}`}>
      <figure className={styles.heroFigure}><Image className={styles.coverImage} src={project.image.src} alt={project.image.alt} width={project.image.width} height={project.image.height} sizes="(max-width: 800px) 100vw, 1200px" priority /><figcaption>Project illustration. All project data is synthetic.</figcaption></figure>
      <div className={styles.proof}><p><strong>Synthetic data.</strong> This is a portfolio implementation with recorded command line runs. No customer data, paid model calls or hosting deployment were used.</p><p>Tests and demos use a deterministic mock provider. A Claude adapter sits behind the same interface; its live quality remains unmeasured.</p></div>
      <section aria-labelledby="agent-problem"><h2 id="agent-problem">Problem</h2><p>{project.problem}</p></section>
      <section aria-labelledby="agent-architecture"><h2 id="agent-architecture">Architecture</h2><ol className={styles.architecture}>{project.architecture.map(([title,detail],index)=><li key={title}><h3>{index+1}. {title}</h3><p>{detail}</p></li>)}</ol></section>
      <section aria-labelledby="agent-tradeoffs"><h2 id="agent-tradeoffs">Tradeoffs</h2><ul className={styles.notes}>{project.tradeoffs.map(item=><li key={item}>{item}</li>)}</ul></section>
      <section aria-labelledby="agent-tests"><h2 id="agent-tests">Test results</h2><p>{project.distinct} distinct test cases passed in at least one appropriate environment. Zero failures in the linked CI run.</p>
        <div className={styles.tableWrap}><table className={styles.table}><caption>Actual results from the linked GitHub Actions run</caption><thead><tr><th scope="col">Environment</th><th scope="col">Passed</th><th scope="col">Skipped</th></tr></thead><tbody><tr><th scope="row">Native PostgreSQL</th><td>{project.nativePassed}</td><td>{project.nativeSkipped}</td></tr><tr><th scope="row">Embedded PostgreSQL</th><td>{project.embeddedPassed}</td><td>{project.embeddedSkipped}</td></tr></tbody></table></div>
        <p className={styles.notes}>{project.nativeSkipped||project.embeddedSkipped?'The embedded disk-reopen test runs only on the embedded engine. The two process-kill tests run only on native PostgreSQL. Both native process-kill tests passed.':'No test cases were skipped in either environment.'}</p>
        <p>{project.evaluation}</p><p className={styles.notes}>Docker Compose built and ran the seeded demo from a fresh Actions checkout. These fixture measurements do not establish production accuracy, security certification or business outcomes.</p>
        <p className={styles.hash}>Verified code: <a className="text-link" href={`${project.repoUrl}/tree/${project.codeCommit}`} target="_blank" rel="noopener noreferrer">{project.codeCommit}</a></p>
      </section>
      <section aria-labelledby="agent-demo"><h2 id="agent-demo">Recorded demo output</h2><p className={styles.notes}>Real stdout from the Docker demo in the linked CI run. All records, identities and messages are synthetic.</p><pre className={styles.output} tabIndex={0} aria-label="Recorded synthetic Docker demo output"><code>{project.demoOutput}</code></pre><a className="text-link" href={`${project.repoUrl}/blob/main/docs/demo-output.md`} target="_blank" rel="noopener noreferrer">Read the recorded output in the repository ↗</a></section>
      <section aria-labelledby="agent-limits"><h2 id="agent-limits">Known limits</h2><ul className={styles.notes}>{project.limits.map(item=><li key={item}>{item}</li>)}</ul><a className="text-link" href={`${project.repoUrl}/blob/main/docs/ASSUMPTIONS.md`} target="_blank" rel="noopener noreferrer">Read policy and implementation assumptions ↗</a></section>
      <Link className="button button-secondary" href="/work#agent-projects-title">Back to portfolio</Link>
    </div>
  </main>;
}
