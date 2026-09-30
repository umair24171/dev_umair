import Link from 'next/link';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Page not found', robots: { index: false, follow: false } };
export default function NotFound() { return <main id="main-content" className="shell page-hero" style={{minHeight:'60vh'}}><p className="eyebrow">404 / PAGE NOT FOUND</p><h1>This page isn’t available.</h1><p className="section-copy">The address may have changed, or the content may be under review. Explore the current work or return to the homepage.</p><div className="hero-actions"><Link href="/" className="button">Back to Home</Link><Link href="/work" className="button button-secondary">Explore the work</Link></div></main>; }
