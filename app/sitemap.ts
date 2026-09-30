import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { projects, services, site } from '@/lib/site';
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ['', '/about', '/work', '/blog', '/labs', '/privacy', '/flutter-app-cost', ...projects.map(p=>`/work/${p.slug}`), ...services.map(s=>`/services/${s.slug}`)];
  return [...staticPaths.map(p=>({url:`${site.url}${p}`,changeFrequency:'monthly' as const,priority:p===''?1:0.7})),...getAllPosts().map(p=>({url:`${site.url}/blog/${p.slug}`,lastModified:new Date(p.updated||p.date),changeFrequency:'monthly' as const,priority:0.6}))];
}
