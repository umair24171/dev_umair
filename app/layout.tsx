import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from 'next/font/google';
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Professional Flutter App Development | Dev.Umair",
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
  ],
  authors: [{ name: "Umair Bilal", url: "https://devumair.vercel.app" }],
  creator: "Umair Bilal",
  metadataBase: new URL("https://devumair.vercel.app"),

  // Open Graph — Facebook, LinkedIn, WhatsApp previews
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://devumair.vercel.app",
    siteName: "Dev.Umair",
    title: "I Build Apps That People Actually Use | Dev.Umair",
    description: "Full-stack Flutter developer with 15+ apps live on App Store & Play Store. From concept to launch in 30-60 days. Book a free consultation.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dev.Umair — Professional Flutter App Development",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "I Build Apps That People Actually Use | Dev.Umair",
    description: "Full-stack Flutter developer with 15+ apps live on App Store & Play Store. Book a free consultation.",
    images: ["/og-image.png"],
    creator: "@umairbilal", // Update with your actual Twitter handle
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
    canonical: "https://devumair.vercel.app",
  },

  // Google Search Console verification
  verification: {
    google: "tHr48mzJn6BFes-GzZidXnfAmtIwQZwF29IWsEt78dM",
  },
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
      </head>
      <body className={`${plusJakarta.className} antialiased`}>{children}</body>
    </html>
  );
}