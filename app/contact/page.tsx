import type { Metadata } from 'next';
import { services } from '@/lib/site';
import ContactForm from '../components/ContactForm';
export const metadata: Metadata = { title: 'Discuss your automation workflow', description: 'Share a repetitive business task, your tools and review requirements with BuildZn. Start a conversation about automation, AI agents, integrations or repair.', alternates: { canonical: 'https://www.buildzn.com/contact' } };
export default async function Contact({ searchParams }: { searchParams: Promise<{ service?: string | string[] }> }) { const { service } = await searchParams; const selected = services.find(item => item.slug === service); return <main id="main-content" className="contact-page"><ContactForm key={selected?.slug || "general"} initialProjectType={selected?.name} standalone/></main>; }
