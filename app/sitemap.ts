import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { projects, services, site } from '@/lib/site';
import { agentProjects, agentProjectPath } from '@/lib/agent-portfolio';
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ['', '/about', '/work', '/blog', '/services', '/privacy', '/pricing', '/contact', '/security', '/evidence', '/samples', '/samples/inquiry-pilot-scope', '/samples/inquiry-pilot-operating-notes', ...projects.map(p=>`/work/${p.slug}`), ...agentProjects.map(p=>agentProjectPath(p.slug)), ...services.map(s=>`/services/${s.slug}`)];
  return [...staticPaths.map(p=>({url:`${site.url}${p}`,changeFrequency:'monthly' as const,priority:p===''?1:0.7})),...getAllPosts().map(p=>({url:`${site.url}/blog/${p.slug}`,lastModified:new Date(p.updated||p.date),changeFrequency:'monthly' as const,priority:0.6}))];
}
