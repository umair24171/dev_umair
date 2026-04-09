import Link from 'next/link';
import Image from 'next/image';
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/posts';
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

  const ogImageUrl = `https://www.buildzn.com/blog/${slug}/opengraph-image`;

  return {
    title: `${post.title} | BuildZn`,
    description: post.excerpt,
    keywords: post.keywords?.length ? post.keywords : post.tags,
    authors: [{ name: 'Umair Bilal', url: 'https://www.buildzn.com' }],
    alternates: {
      canonical: `https://www.buildzn.com/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://www.buildzn.com/blog/${slug}`,
      siteName: 'BuildZn',
      type: 'article',
      publishedTime: post.date,
      authors: ['Umair Bilal'],
      tags: post.tags,
      images: [
        {
          url: ogImageUrl,
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
      creator: '@umairbilal',
      images: [ogImageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = getRelatedPosts(slug, post.tags, 3);

  const htmlContent = marked(post.content) as string;

  const postUrl   = `https://www.buildzn.com/blog/${slug}`;
  const ogImageUrl = `${postUrl}/opengraph-image`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    keywords: (post.keywords?.length ? post.keywords : post.tags).join(', '),
    author: {
      '@type': 'Person',
      name: 'Umair Bilal',
      jobTitle: 'Senior Flutter Developer',
      url: 'https://www.buildzn.com',
      sameAs: [
        'https://github.com/umair24171',
        'https://www.buildzn.com',
      ],
    },
    datePublished: post.date,
    dateModified: post.date,
    url: postUrl,
    publisher: {
      '@type': 'Organization',
      name: 'BuildZn',
      url: 'https://www.buildzn.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.buildzn.com/logo.svg',
        width: 240,
        height: 60,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    image: {
      '@type': 'ImageObject',
      url: ogImageUrl,
      width: 1200,
      height: 630,
    },
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
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image src="/logo.svg" alt="BuildZn" width={130} height={33} priority style={{ minWidth: 130 }} />
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
            <p className="text-sm font-semibold">Umair <span className="text-white/40 font-normal text-[12px]">· Senior Flutter Developer</span></p>
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

        {/* Author Bio Block */}
        <div className="mt-12 p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl flex gap-5 items-start">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-base flex-shrink-0">U</div>
          <div>
            <p className="text-sm font-bold mb-1">Umair Bilal</p>
            <p className="text-[13px] text-white/40 leading-relaxed">
              Senior Flutter Developer with 4+ years experience and 20+ apps shipped to App Store and Google Play. Founder of{' '}
              <a href="https://apps.apple.com/pk/app/farahgpt/id6746275409" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">FarahGPT</a>{' '}
              (5,100+ users) and{' '}
              <a href="https://www.muslifie.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">Muslifie</a>{' '}
              (200+ verified companies). Full-stack: Flutter, Node.js, Next.js, AI, Stripe, RevenueCat, Firebase, MongoDB.
            </p>
            <div className="flex gap-4 mt-3">
              <a href="https://www.linkedin.com/in/umair-bilal-/" target="_blank" rel="noopener noreferrer" className="text-[12px] text-purple-400 hover:text-purple-300 font-medium transition-colors">LinkedIn →</a>
              <a href="https://www.buildzn.com" className="text-[12px] text-purple-400 hover:text-purple-300 font-medium transition-colors">BuildZn →</a>
            </div>
          </div>
        </div>

        {/* CTA at bottom */}
        <div className="mt-8 p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl text-center">
          <h3 className="text-xl font-bold mb-2">Need a Flutter developer?</h3>
          <p className="text-white/40 text-sm mb-5">I build production apps from scratch — iOS, Android, AI features, payments. Fixed price, App Store guaranteed.</p>
          <Link href="/#contact" className="inline-flex bg-gradient-to-r from-purple-500 to-pink-500 text-white px-7 py-3 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-purple-500/40 transition-all hover:-translate-y-0.5">
            Get a Free Proposal →
          </Link>
        </div>

        {/* ─── RELATED POSTS ─── */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold mb-6 text-white/80">Related Posts</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden hover:border-purple-500/30 hover:bg-white/[0.05] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className={`h-0.5 bg-gradient-to-r ${related.coverGradient}`} />
                  <div className="p-5">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {related.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/15 text-purple-300 border border-purple-500/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-sm font-bold leading-snug mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-[11px] text-white/30 line-clamp-2 mb-3">{related.excerpt}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                      <span className="text-[11px] text-white/25">
                        {new Date(related.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-[11px] text-white/25">{related.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <footer className="border-t border-white/5 py-10 px-6 text-center">
        <p className="text-[12px] text-white/15">© 2026 BuildZn. All rights reserved.</p>
      </footer>
    </div>
  );
}
