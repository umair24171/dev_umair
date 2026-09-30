import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import Analytics from './components/Analytics';
import './globals.css';
const font = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-plus-jakarta', display: 'swap' });
export const metadata: Metadata = {
  metadataBase: new URL('https://www.buildzn.com'),
  title: { default: 'BuildZn — AI Agents & Business Automation', template: '%s | BuildZn' },
  description: 'BuildZn builds AI agents and automations that handle repetitive business work. Workflow automation, API integrations and automation repair.',
  authors: [{ name: 'Umair Bilal', url: 'https://www.buildzn.com/about' }],
  creator: 'Umair Bilal',
  openGraph: { type: 'website', locale: 'en_US', siteName: 'BuildZn', title: 'BuildZn — AI Agents & Business Automation', description: 'Work directly with Umair Bilal on bounded workflows, human review and documented handover.', images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'BuildZn — AI agents and business automation' }] },
  twitter: { card: 'summary_large_image', title: 'BuildZn — AI Agents & Business Automation', description: 'AI agents and business automation with Umair Bilal.', images: ['/opengraph-image'] },
  robots: { index: true, follow: true },
  verification: { google: 'DxcZGz0CMVtxATKxT5aQgk2uyzSkSqBXDcKhbV7lu6U' },
};
const schema = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'Organization', '@id': 'https://www.buildzn.com/#organization', name: 'BuildZn', url: 'https://www.buildzn.com', logo: 'https://www.buildzn.com/logo.svg', founder: { '@id': 'https://www.buildzn.com/#person' }, sameAs: ['https://www.linkedin.com/in/umair-bilal-/', 'https://github.com/umair24171'] },
  { '@type': 'Person', '@id': 'https://www.buildzn.com/#person', name: 'Umair Bilal', jobTitle: 'AI agents and automation developer', url: 'https://www.buildzn.com/about', worksFor: { '@id': 'https://www.buildzn.com/#organization' }, knowsAbout: ['AI agents', 'Business automation', 'API integrations', 'Workflow evaluation'] },
  { '@type': 'WebSite', '@id': 'https://www.buildzn.com/#website', name: 'BuildZn', url: 'https://www.buildzn.com', publisher: { '@id': 'https://www.buildzn.com/#organization' } },
] };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><head><meta name="theme-color" content="#090b12"/><link rel="icon" href="/favicon.ico?v=2" sizes="any"/><link rel="icon" href="/logo-icon.svg?v=2" type="image/svg+xml"/><link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2"/><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}/></head><body className={`${font.variable} ${font.className}`}><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader/>{children}<SiteFooter/><Analytics/></body></html>;
}
