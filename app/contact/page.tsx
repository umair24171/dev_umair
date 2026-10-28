import PageContext from '@/app/components/PageContext';
import type { Metadata } from 'next';
import { services } from '@/lib/site';
import ContactForm from '../components/ContactForm';
export const metadata: Metadata = {
  "title": "Discuss your automation workflow",
  "description": "Share a repetitive business task, your tools and review requirements with BuildZn. Start a conversation about automation, AI agents, integrations or repair.",
  "alternates": {
    "canonical": "https://www.buildzn.com/contact"
  },
  "openGraph": {
    "title": "Discuss your automation workflow | BuildZn",
    "description": "Share a repetitive business task, your tools and review requirements with BuildZn. Start a conversation about automation, AI agents, integrations or repair.",
    "url": "https://www.buildzn.com/contact",
    "type": "website",
    "images": [
      {
        "url": "/opengraph-image",
        "width": 1200,
        "height": 630,
        "alt": "BuildZn: AI agents and business automation"
      }
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Discuss your automation workflow | BuildZn",
    "description": "Share a repetitive business task, your tools and review requirements with BuildZn. Start a conversation about automation, AI agents, integrations or repair.",
    "images": [
      "/opengraph-image"
    ]
  }
};
export default async function Contact({ searchParams }: { searchParams: Promise<{ service?: string | string[] }> }) { const { service } = await searchParams; const selected = services.find(item => item.slug === service); return <main id="main-content" className="contact-page"><PageContext path="/contact" name="Contact" type="ContactPage"/><ContactForm key={selected?.slug || "general"} initialProjectType={selected?.name} standalone/></main>; }
