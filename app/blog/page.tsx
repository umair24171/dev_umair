import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Insights — Business automation', description: 'Notes on business workflows, AI agents, review points and operating costs. Practical scope guidance from BuildZn.', alternates: { canonical: 'https://www.buildzn.com/blog' } };
const categories = ['All topics', 'AI', 'Automation'];
export default async function Blog({ searchParams }: { searchParams: Promise<{ q?: string; topic?: string; page?: string }> }) {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q.slice(0,200).trim() : '';
  const topic = categories.includes(params.topic || '') ? params.topic! : 'All topics';
  const posts = getAllPosts().filter(p => {
    const haystack = `${p.title} ${p.excerpt} ${p.tags.join(' ')}`.toLowerCase();
    const categoryMatches = topic === 'All topics' || (topic === 'AI' ? /\bai\b|agent|model/.test(haystack) : /automation|workflow|integration/.test(haystack));
    return categoryMatches && haystack.includes(q.toLowerCase());
  });
  posts.sort((a,b) => Number(b.reviewed) - Number(a.reviewed) || Date.parse(b.date) - Date.parse(a.date));
  const pages = Math.max(1,Math.ceil(posts.length/12));
  const page = Math.min(pages,Math.max(1,Number.parseInt(params.page || '1',10)||1));
  const pageLink = (n: number) => `/blog?${new URLSearchParams({ ...(q ? {q} : {}), ...(topic !== 'All topics' ? {topic} : {}), page: String(n) })}`;
  return <main id="main-content"><section className="shell page-hero"><p className="eyebrow">BUSINESS AUTOMATION NOTES</p><h1>Useful decisions.<br/>Technical detail that helps.</h1><p className="section-copy">Practical notes on AI agents, integrations and the decisions around repetitive business work.</p></section><section className="shell" style={{paddingBottom:90}}><form action="/blog" method="get" className="blog-controls"><div><label htmlFor="blog-search">Search insights</label><input type="search" id="blog-search" name="q" defaultValue={q} placeholder="Search a problem, tool or topic" maxLength={200}/></div><div><label htmlFor="blog-topic">Topic</label><select id="blog-topic" name="topic" defaultValue={topic}>{categories.map(c => <option key={c}>{c}</option>)}</select></div><button type="submit" className="button">Find notes ↗</button></form><p className="blog-count">{posts.length} {posts.length === 1 ? 'article' : 'articles'}{q && ` matching “${q}”`}</p>{posts.length === 0 ? <div className="detail-panel"><h2>No matching articles.</h2><p>Try a broader term or explore all topics.</p><Link href="/blog" className="text-link">Clear search</Link></div> : <div className="blog-grid">{posts.slice((page-1)*12,page*12).map(post => <article className="article-card" key={post.slug}><p className="article-meta">{new Date(post.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'})} · {post.readTime}{!post.reviewed && ' · Archive'}</p><h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2><p>{post.excerpt}</p><Link href={`/blog/${post.slug}`} className="text-link">Read article ↗</Link></article>)}</div>}{pages > 1 && <nav className="pagination" aria-label="Article pages">{page > 1 && <Link href={pageLink(page-1)} className="button button-small button-secondary">← Previous</Link>}<span>Page {page} of {pages}</span>{page < pages && <Link href={pageLink(page+1)} className="button button-small button-secondary">Next →</Link>}</nav>}</section></main>;
}
