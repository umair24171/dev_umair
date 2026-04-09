import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found | BuildZn',
  description: 'This page does not exist. Head back to BuildZn to explore Flutter app development services and the developer blog.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      style={{ background: '#0A0E27', minHeight: '100vh', fontFamily: 'var(--font-plus-jakarta, sans-serif)' }}
      className="flex flex-col items-center justify-center px-6 text-center relative overflow-hidden"
    >
      {/* Ambient glow blobs */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, rgba(0,217,255,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '30%',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(123,47,190,0.09) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Logo */}
      <Link
        href="/"
        style={{
          position: 'absolute',
          top: 28,
          left: 32,
          fontSize: 20,
          fontWeight: 800,
          color: '#00D9FF',
          textDecoration: 'none',
          letterSpacing: '-0.5px',
        }}
      >
        BuildZn
      </Link>

      {/* 404 number */}
      <div
        style={{
          fontSize: 'clamp(100px, 20vw, 180px)',
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: '-4px',
          background: 'linear-gradient(135deg, #00D9FF 0%, #7B2FBE 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: 16,
          userSelect: 'none',
        }}
        aria-hidden="true"
      >
        404
      </div>

      {/* Heading */}
      <h1
        style={{
          fontSize: 'clamp(22px, 4vw, 36px)',
          fontWeight: 800,
          color: '#E2E8F0',
          marginBottom: 12,
          letterSpacing: '-0.5px',
        }}
      >
        This page doesn&apos;t exist
      </h1>

      {/* Subtext */}
      <p
        style={{
          fontSize: 16,
          color: 'rgba(226,232,240,0.55)',
          maxWidth: 440,
          lineHeight: 1.7,
          marginBottom: 40,
        }}
      >
        The URL might be mistyped, the post may have moved, or it was never here.
        Either way — you&apos;re not missing much on this particular page.
      </p>

      {/* CTA buttons */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#00D9FF] text-[#0A0E27] font-bold text-[15px] rounded-lg no-underline transition-opacity duration-200 hover:opacity-80"
        >
          ← Back to home
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.06] text-[#E2E8F0] font-semibold text-[15px] rounded-lg no-underline border border-white/10 transition-colors duration-200 hover:bg-white/10"
        >
          Read the blog →
        </Link>
      </div>

      {/* Quick nav links */}
      <div
        style={{
          marginTop: 56,
          display: 'flex',
          gap: 24,
          flexWrap: 'wrap',
          justifyContent: 'center',
          fontSize: 13,
          color: 'rgba(226,232,240,0.35)',
        }}
      >
        {[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: 'About', href: '/about' },
          { label: 'Flutter App Cost', href: '/flutter-app-cost' },
        ].map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="text-white/40 no-underline transition-colors duration-200 hover:text-[#00D9FF]"
          >
            {label}
          </Link>
        ))}
      </div>
    </main>
  );
}
