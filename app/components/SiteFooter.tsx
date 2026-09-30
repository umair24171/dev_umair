import Link from 'next/link';
import Logo from './Logo';
import { PrivacySettings } from './Analytics';
import { site } from '@/lib/site';
export default function SiteFooter() {
  return <footer className="site-footer"><div className="shell"><div className="footer-main">
    <div><Link href="/" aria-label="BuildZn home"><Logo width={138} height={35}/></Link><p>AI agents & business automation.<br/>Repetitive work, handled with care.</p></div>
    <div className="footer-links"><Link href="/work">Work</Link><Link href="/about">About Umair</Link><Link href="/blog">Insights</Link><Link href="/services">Services</Link><Link href="/pricing">Pricing</Link><Link href="/contact">Contact</Link></div>
    <div className="footer-links"><a href={`mailto:${site.email}`}>Email Umair</a><a href={site.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href={site.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a></div>
  </div><div className="footer-bottom"><p>© {new Date().getFullYear()} BuildZn · Umair Bilal</p><div><Link href="/privacy">Privacy</Link><PrivacySettings/></div><span>Based in Pakistan. Working worldwide.</span></div></div></footer>;
}
