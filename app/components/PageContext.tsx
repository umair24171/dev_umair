import Link from 'next/link';
import { site } from '@/lib/site';
export default function PageContext({ path, name, type = 'WebPage', parent }: { path: string; name: string; type?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage'; parent?: { name: string; path: string } }) {
  const items = [{ name: 'Home', path: '/' }, ...(parent ? [parent] : []), { name, path }];
  const url = `${site.url}${path}`;
  const graph = { '@context': 'https://schema.org', '@graph': [
    { '@type': type, '@id': `${url}#webpage`, url, name, isPartOf: { '@id': `${site.url}/#website` }, ...(type === 'AboutPage' ? { about: { '@id': `${site.url}/#person` } } : {}), breadcrumb: { '@id': `${url}#breadcrumb` } },
    { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: `${site.url}${item.path}` })) },
  ] };
  return <div className="shell page-context"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, '\\u003c') }}/><nav aria-label="Breadcrumb"><ol>{items.map((item, index) => <li key={item.path}>{index === items.length - 1 ? <span aria-current="page">{item.name}</span> : <Link href={item.path}>{item.name}</Link>}</li>)}</ol></nav></div>;
}
