import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "AI Systems & Agent Engineer | BuildZn",
  description: "I build AI agents, automated systems, and production apps that ship. 20+ apps live, agents running 24/7, fixed price with no surprises.",
  keywords: [
    "AI agent developer",
    "AI systems engineer",
    "AI agent governance",
    "LLM integration developer",
    "agentic AI development",
    "multi-agent systems",
    "flutter developer",
    "mobile app development",
    "ios app developer",
    "android app developer",
    "hire app developer",
    "AI app development",
    "MVP development",
    "startup app developer",
    "BuildZn",
    "buildzn.com",
  ],
  authors: [{ name: "Umair Bilal", url: "https://www.buildzn.com" }],
  creator: "Umair Bilal",
  metadataBase: new URL("https://www.buildzn.com"),

  // Open Graph — Facebook, LinkedIn, WhatsApp previews
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.buildzn.com",
    siteName: "BuildZn",
    title: "AI Systems That Run Themselves. Apps People Actually Use. | BuildZn",
    description: "I build AI agents, automation systems, and production mobile apps — 20+ apps live, agents running 24/7. Fixed price, book a free consultation.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BuildZn — AI Systems & Agent Engineer",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "AI Systems That Run Themselves. Apps People Actually Use. | BuildZn",
    description: "I build AI agents, automation systems, and production mobile apps. 20+ apps live, agents running 24/7. Book a free consultation.",
    images: ["/og-image.png"],
    creator: "@umairbilal",
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Additional
  alternates: {
    canonical: "https://www.buildzn.com",
  },

  // Google Search Console verification
  verification: {
    google: "DxcZGz0CMVtxATKxT5aQgk2uyzSkSqBXDcKhbV7lu6U",
  },
};

// ─── Site-wide JSON-LD Structured Data ───
const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    // Organization
    {
      '@type': 'Organization',
      '@id': 'https://www.buildzn.com/#organization',
      name: 'BuildZn',
      url: 'https://www.buildzn.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.buildzn.com/logo.svg',
        width: 240,
        height: 60,
      },
      founder: { '@id': 'https://www.buildzn.com/#person' },
      sameAs: [
        'https://www.linkedin.com/in/umair-bilal-/',
        'https://github.com/umair24171',
      ],
    },
    // Person
    {
      '@type': 'Person',
      '@id': 'https://www.buildzn.com/#person',
      name: 'Umair Bilal',
      jobTitle: 'AI Systems & Agent Engineer',
      description:
        'AI Systems & Agent Engineer with 4+ years experience building autonomous agent pipelines, LLM-integrated products, and 20+ apps shipped to App Store and Google Play. Built NexusOS (AI agent governance) and founded FarahGPT (5,100+ users) and Muslifie (200+ companies).',
      url: 'https://www.buildzn.com',
      image: 'https://www.buildzn.com/og-image.png',
      worksFor: { '@id': 'https://www.buildzn.com/#organization' },
      address: { '@type': 'PostalAddress', addressCountry: 'PK' },
      sameAs: [
        'https://www.linkedin.com/in/umair-bilal-/',
        'https://github.com/umair24171',
      ],
      knowsAbout: [
        'AI Agents', 'Multi-Agent Systems', 'AI Agent Governance', 'LLM Integration',
        'Agentic AI', 'Node.js', 'Flutter', 'Dart', 'Mobile App Development',
        'iOS Development', 'Android Development', 'Next.js',
        'Stripe', 'RevenueCat', 'Firebase', 'MongoDB', 'Supabase',
      ],
    },
    // WebSite
    {
      '@type': 'WebSite',
      '@id': 'https://www.buildzn.com/#website',
      url: 'https://www.buildzn.com',
      name: 'BuildZn',
      description: 'AI agents, automation systems, and production apps. Fixed price. Shipped and guaranteed.',
      publisher: { '@id': 'https://www.buildzn.com/#organization' },
    },
    // Service — AI Agent & Systems Development
    {
      '@type': 'Service',
      '@id': 'https://www.buildzn.com/#service-ai-agents',
      name: 'AI Agent & Systems Development',
      description:
        'AI agent pipelines, LLM feature integration, and automation systems that run in production without human input. Chat, RAG, multi-agent workflows, and agent governance.',
      provider: { '@id': 'https://www.buildzn.com/#organization' },
      areaServed: 'Worldwide',
      offers: [
        {
          '@type': 'Offer',
          name: 'Starter Automation',
          price: '300',
          priceCurrency: 'USD',
          description: 'One automated workflow, single AI/LLM integration, scheduled or triggered runs. 1-2 weeks delivery.',
        },
        {
          '@type': 'Offer',
          name: 'Growth Automation',
          price: '700',
          priceCurrency: 'USD',
          description: 'Multi-agent pipeline with 2-3 integrations and a dashboard or alerts. 2-3 weeks delivery.',
        },
        {
          '@type': 'Offer',
          name: 'Full System',
          price: '1500',
          priceCurrency: 'USD',
          description: 'Multi-agent orchestration with audit logs, kill switch, and a custom dashboard. 3-4 weeks delivery.',
        },
      ],
    },
    // Service — Flutter Development
    {
      '@type': 'Service',
      '@id': 'https://www.buildzn.com/#service-flutter',
      name: 'Flutter App Development',
      description:
        'Fixed-price Flutter app development for iOS and Android. Includes backend, AI integration, payments, and App Store deployment. Starting at $800.',
      provider: { '@id': 'https://www.buildzn.com/#organization' },
      areaServed: 'Worldwide',
      offers: [
        {
          '@type': 'Offer',
          name: 'Starter',
          price: '800',
          priceCurrency: 'USD',
          description: 'Simple MVP app — 10-12 screens, Firebase backend, iOS + Android deployment, 30 days delivery.',
        },
        {
          '@type': 'Offer',
          name: 'Professional',
          price: '2000',
          priceCurrency: 'USD',
          description: 'Full-featured app with custom Node.js backend, payments, AI features, and admin dashboard.',
        },
        {
          '@type': 'Offer',
          name: 'Enterprise',
          price: '4500',
          priceCurrency: 'USD',
          description: 'Complex marketplace or platform — multi-role auth, Stripe Connect, real-time features, full QA.',
        },
      ],
    },
    // FAQPage
    {
      '@type': 'FAQPage',
      '@id': 'https://www.buildzn.com/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much does an AI automation or agent system cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A single automated workflow with one integration starts at $300. A multi-agent pipeline with a dashboard runs $700. A full governed system with multi-agent orchestration, audit logs, and a kill switch is $1,500. All fixed price, no hourly billing.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does it take to build one?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A single automated workflow: 1-2 weeks. A multi-agent pipeline with a dashboard: 2-3 weeks. A full governed system with audit logging and a kill switch: 3-4 weeks. Timelines depend on how many existing tools it needs to plug into.',
          },
        },
        {
          '@type': 'Question',
          name: 'What if I need a mobile app instead?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Flutter app development is still a core service. Pricing starts at $800 for a simple MVP (10-12 screens, Firebase backend, iOS + Android) and runs up to $4,500 for a full marketplace-style platform with a custom backend and AI features. Simple apps take 3-4 weeks; full-featured ones take 5-8 weeks.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you build for both iOS and Android?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, always. Flutter produces a single codebase that runs natively on both platforms. Every app package includes iOS and Android deployment at no extra cost.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does the fixed-price model work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You pay 50% upfront and 50% on delivery. The scope is locked in your proposal — no surprise invoices, no hourly tracking. If the agreed work cannot be delivered, you get your money back.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can you handle the backend too?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Full-stack is the default. Node.js APIs, MongoDB or Supabase databases, Firebase, AWS — whatever fits your product. One developer owns the whole stack.',
          },
        },
        {
          '@type': 'Question',
          name: "What's included in each package?",
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Automation packages include the agent or workflow build, integration with your existing tools, and monitoring setup, plus 2 weeks to 2 months of support depending on tier. App packages include the Flutter app, backend integration, and store submission, plus 1 to 6 months of support depending on tier.',
          },
        },
        {
          '@type': 'Question',
          name: 'What if I need changes after delivery?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Every package includes bug support after launch, with the length depending on the tier. For new features, we scope a follow-on project at the same fixed-price model.',
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#06080f" />

        {/* Site-wide JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </head>
      <body className={`${plusJakarta.className} antialiased`}>{children}</body>
      <GoogleAnalytics gaId="G-FB9PXBHDW9" />
    </html>
  );
}