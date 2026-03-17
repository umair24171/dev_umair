import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

export interface PostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  keywords: string[];
  readTime: string;
  coverGradient?: string;
}

export interface Post extends PostMeta {
  content: string;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.(mdx|md)$/, '');
    const filePath = path.join(POSTS_DIR, filename);
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(raw);

    return {
      slug,
      title: data.title || 'Untitled',
      excerpt: data.excerpt || '',
      date: data.date || '',
      tags: data.tags || [],
      keywords: data.keywords || data.tags || [],
      readTime: data.readTime || '5 min read',
      coverGradient: data.coverGradient || 'from-purple-500 to-pink-500',
    } as PostMeta;
  });

  // Sort newest first
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | null {
  const extensions = ['.mdx', '.md'];
  let filePath = '';

  for (const ext of extensions) {
    const p = path.join(POSTS_DIR, `${slug}${ext}`);
    if (fs.existsSync(p)) {
      filePath = p;
      break;
    }
  }

  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title || 'Untitled',
    excerpt: data.excerpt || '',
    date: data.date || '',
    tags: data.tags || [],
    keywords: data.keywords || data.tags || [],
    readTime: data.readTime || '5 min read',
    coverGradient: data.coverGradient || 'from-purple-500 to-pink-500',
    content,
  };
}
