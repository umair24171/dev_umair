import Link from 'next/link';
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { marked } from 'marked';

// Generate static paths at build time
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// Dynamic metadata per post
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Dev.Umair`,
    description: post.excerpt,
    alternates: {
      canonical: `https://devumair.vercel.app/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://devumair.vercel.app/blog/${slug}`,
      type: 'article',
      images: [
        {
          url: `https://devumair.vercel.app/og-image.png`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [`https://devumair.vercel.app/og-image.png`],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const htmlContent = marked(post.content) as string;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: 'Umair Bilal',
      url: 'https://devumair.vercel.app',
    },
    datePublished: post.date,
    dateModified: post.date,
    url: `https://devumair.vercel.app/blog/${slug}`,
    publisher: {
      '@type': 'Person',
      name: 'Umair Bilal',
      url: 'https://devumair.vercel.app',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://devumair.vercel.app/blog/${slug}`,
    },
    image: 'https://devumair.vercel.app/og-image.png',
  };

  return (
    <div className="min-h-screen bg-[#06080f] text-white overflow-x-hidden">

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ─── NAV ─── */}
      <nav className="fixed top-0 w-full z-50 bg-[#06080f]/85 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center h-[70px]">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-extrabold text-lg">U</div>
            <span className="text-xl font-extrabold tracking-tight">Dev.Umair</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/blog" className="text-sm font-medium text-white/50 hover:text-white transition-colors">← All Posts</Link>
            <Link href="/#contact" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-purple-500/40 transition-all">
              Hire Me →
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── ARTICLE ─── */}
      <article className="max-w-[780px] mx-auto px-6 pt-[120px] pb-24">

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full text-[12px] font-medium bg-purple-500/15 text-purple-300 border border-purple-500/20">
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-[clamp(28px,4.5vw,52px)] font-black leading-[1.1] tracking-[-1.5px] mb-4">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-lg md:text-xl text-white/40 leading-relaxed mb-6">
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 pb-8 border-b border-white/[0.06] mb-8">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm">U</div>
          <div>
            <p className="text-sm font-semibold">Umair Bilal</p>
            <p className="text-[12px] text-white/30">{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · {post.readTime}</p>
          </div>
        </div>

        {/* Gradient divider */}
        <div className={`h-0.5 bg-gradient-to-r ${post.coverGradient} rounded-full mb-10 opacity-60`} />

        {/* Content */}
        <div
          className="prose-custom"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* CTA at bottom */}
        <div className="mt-16 p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl text-center">
          <h3 className="text-xl font-bold mb-2">Need a Flutter developer?</h3>
          <p className="text-white/40 text-sm mb-5">I build production apps from scratch — iOS, Android, AI features, payments. Let&apos;s talk.</p>
          <Link href="/#contact" className="inline-flex bg-gradient-to-r from-purple-500 to-pink-500 text-white px-7 py-3 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-purple-500/40 transition-all hover:-translate-y-0.5">
            Book Free Call →
          </Link>
        </div>
      </article>

      <footer className="border-t border-white/5 py-10 px-6 text-center">
        <p className="text-[12px] text-white/15">© 2026 Dev.Umair. All rights reserved.</p>
      </footer>
    </div>
  );
}
