import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { site } from './site';
const POSTS_DIR = path.join(process.cwd(), 'content/posts');
export const redirectedPostSlugs = new Set([
  'flutter-vs-react-native-ai-apps-my-2026-take',
  'flutter-vs-native-ai-apps-2026-pick-right-save-millions',
  'flutter-vs-react-native-for-saas-2026-stack-choice',
]);
export interface PostMeta { slug: string; title: string; excerpt: string; date: string; updated?: string; tags: string[]; keywords: string[]; readTime: string; coverGradient?: string; reviewed: boolean; }
export interface Post extends PostMeta { content: string; }
export function getPostBySlug(slug: string): Post | null {
  if (!/^[a-z0-9-]+$/.test(slug) || redirectedPostSlugs.has(slug)) return null;
  const file = ['.mdx', '.md'].map(ext => path.join(POSTS_DIR, `${slug}${ext}`)).find(p => fs.existsSync(p));
  if (!file) return null;
  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  if (data.status !== 'published' || data.reviewed !== true) return null;
  const date = String(data.date || '');
  if (!date || Number.isNaN(Date.parse(date))) return null;
  const clean = content.replace(/https:\/\/(?:your-calendly-link\.com|yourwebsite\.com\/contact|example\.com\/book-umair-call)\/?/g, `${site.url}/#contact`).replace(/^# (.+)$/gm, '## $1');
  return { slug, title: String(data.title || 'Engineering note'), excerpt: String(data.excerpt || ''), date, updated: data.updated ? String(data.updated) : undefined, tags: Array.isArray(data.tags) ? data.tags : [], keywords: Array.isArray(data.keywords) ? data.keywords : [], readTime: `${Math.max(1, Math.ceil(clean.split(/\s+/).length / 220))} min read`, coverGradient: data.coverGradient, reviewed: data.reviewed === true, content: clean };
}
export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR).filter(f => /\.mdx?$/.test(f)).map(file => getPostBySlug(file.replace(/\.mdx?$/, ''))).filter((p): p is Post => p !== null).map(post => ({ slug: post.slug, title: post.title, excerpt: post.excerpt, date: post.date, updated: post.updated, tags: post.tags, keywords: post.keywords, readTime: post.readTime, reviewed: post.reviewed })).sort((a,b) => Date.parse(b.date) - Date.parse(a.date));
}
export function getRelatedPosts(slug: string, tags: string[], limit = 3): PostMeta[] {
  return getAllPosts().filter(p => p.slug !== slug).map(p => ({ ...p, score: p.tags.filter(t => tags.includes(t)).length })).filter(p => p.score > 0).sort((a,b) => b.score - a.score || Date.parse(b.date) - Date.parse(a.date)).slice(0,limit);
}
