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
  title: "Professional Flutter App Development | BuildZn",
  description: "Get your mobile app built and launched in 30-60 days. 15+ apps live on iOS & Android. Full-stack Flutter development with proven results.",
  keywords: [
    "flutter developer",
    "mobile app development",
    "ios app developer",
    "android app developer",
    "react native developer",
    "hire app developer",
    "freelance flutter developer",
    "app development services",
    "MVP development",
    "startup app developer",
    "AI app development",
    "cross platform app development",
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
    title: "I Build Apps That People Actually Use | BuildZn",
    description: "Full-stack Flutter developer with 15+ apps live on App Store & Play Store. From concept to launch in 30-60 days. Book a free consultation.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BuildZn — Professional Flutter App Development",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "I Build Apps That People Actually Use | BuildZn",
    description: "Full-stack Flutter developer with 15+ apps live on App Store & Play Store. Book a free consultation.",
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
      jobTitle: 'Senior Flutter Developer',
      description:
        'Senior Flutter Developer with 4+ years experience and 20+ apps shipped to App Store and Google Play. Founder of FarahGPT (5,100+ users) and Muslifie (200+ companies).',
      url: 'https://www.buildzn.com',
      image: 'https://www.buildzn.com/og-image.png',
      worksFor: { '@id': 'https://www.buildzn.com/#organization' },
      address: { '@type': 'PostalAddress', addressCountry: 'PK' },
      sameAs: [
        'https://www.linkedin.com/in/umair-bilal-/',
        'https://github.com/umair24171',
      ],
      knowsAbout: [
        'Flutter', 'Dart', 'Mobile App Development', 'iOS Development',
        'Android Development', 'Node.js', 'Next.js', 'AI Integration',
        'Stripe', 'RevenueCat', 'Firebase', 'MongoDB', 'Supabase',
      ],
    },
    // WebSite
    {
      '@type': 'WebSite',
      '@id': 'https://www.buildzn.com/#website',
      url: 'https://www.buildzn.com',
      name: 'BuildZn',
      description: 'Professional Flutter app development. Fixed price. App Store guaranteed.',
      publisher: { '@id': 'https://www.buildzn.com/#organization' },
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
          name: 'Growth',
          price: '2500',
          priceCurrency: 'USD',
          description: 'Full-featured app with custom Node.js backend, payments, AI features, and admin dashboard.',
        },
        {
          '@type': 'Offer',
          name: 'Scale',
          price: '5000',
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
          name: 'How much does a Flutter app cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'BuildZn Flutter app projects start at $800 for a simple MVP (10–12 screens, Firebase backend, iOS + Android). A full-featured app with custom backend, payments, and AI features typically runs $2,500–$5,000. All prices are fixed — no hourly billing. Compare that to a mobile agency charging $15,000–$50,000 for the same output.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does it take to build a Flutter app?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Simple apps (10–15 screens): 3–4 weeks. Full-featured apps with backend, payments, and AI: 5–8 weeks. Muslifie — a full marketplace with Stripe Connect, real-time chat, and 70+ language support — went from discovery call to App Store in 6 weeks.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you build for both iOS and Android?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, always. Flutter produces a single codebase that runs natively on both platforms. Every BuildZn package includes iOS and Android deployment at no extra cost.',
          },
        },
        {
          '@type': 'Question',
          name: "What's included in each package?",
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'All packages include: Flutter app (iOS + Android), backend integration, App Store and Google Play submission, and 1 month of bug support post-launch. Growth and Scale packages add custom Node.js backends, AI features, admin dashboards, and Stripe/RevenueCat integration.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does the fixed-price model work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You pay 50% upfront and 50% on delivery. The scope is locked in your proposal — no surprise invoices, no hourly tracking. If the agreed app cannot be delivered, you get your money back.',
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
          name: 'What if I need changes after delivery?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Every package includes 1 month of bug support after launch. For new features, we scope a follow-on project at the same fixed-price model.',
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