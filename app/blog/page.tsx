import Link from 'next/link';
import Logo from '../components/Logo';
import { getAllPosts } from '@/lib/posts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Flutter, AI & Mobile Dev | BuildZn',
  description: 'Real lessons from shipping 15+ production apps. Flutter, Firebase, AI integration, App Store deployment, and indie dev insights.',
  alternates: {
    canonical: 'https://www.buildzn.com/blog',
  },
  openGraph: {
    title: 'Blog — Flutter, AI & Mobile Dev | BuildZn',
    description: 'Real lessons from shipping 15+ production apps.',
    url: 'https://www.buildzn.com/blog',
    siteName: 'BuildZn',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[#06080f] text-white overflow-x-hidden">

      {/* ─── NAV ─── */}
      <nav className="fixed top-0 w-full z-50 bg-[#06080f]/85 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center h-[70px]">
          <Link href="/" className="flex items-center flex-shrink-0">
            <Logo width={130} height={33} />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/#services" className="hidden md:block text-sm font-medium text-white/50 hover:text-white transition-colors">Services</Link>
            <Link href="/#portfolio" className="hidden md:block text-sm font-medium text-white/50 hover:text-white transition-colors">Portfolio</Link>
            <Link href="/blog" className="hidden md:block text-sm font-medium text-purple-400">Blog</Link>
            <Link href="/#contact" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-purple-500/40 transition-all">
              Get Started →
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="pt-[130px] pb-16 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
          <span className="text-sm font-medium text-purple-300">Real lessons from real apps</span>
        </div>
        <h1 className="text-[clamp(32px,5vw,64px)] font-black tracking-[-2px] mb-4">
          The Dev{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">Blog</span>
        </h1>
        <p className="text-lg text-white/40 max-w-[520px] mx-auto">
          Flutter tips, Firebase tricks, AI integration, App Store lessons — from someone who ships real apps.
        </p>
      </section>

      {/* ─── POSTS ─── */}
      <section className="max-w-[1200px] mx-auto px-6 pb-24">
        {posts.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">✍️</div>
            <p className="text-white/30 text-lg">First post coming soon...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden hover:border-purple-500/30 hover:bg-white/[0.05] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Gradient top bar */}
                <div className={`h-1 bg-gradient-to-r ${post.coverGradient}`} />
                <div className="p-6">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-500/15 text-purple-300 border border-purple-500/20">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-bold mb-2 leading-snug group-hover:text-purple-300 transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-sm text-white/35 leading-relaxed mb-5 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                    <span className="text-[12px] text-white/25">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="text-[12px] text-white/25">{post.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/5 py-10 px-6 text-center">
        <p className="text-[12px] text-white/15">© 2026 BuildZn. All rights reserved.</p>
      </footer>
    </div>
  );
}
