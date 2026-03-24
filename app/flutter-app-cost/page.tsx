import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'How Much Does a Flutter App Cost in 2026? | BuildZn',
  description:
    'Complete Flutter app cost breakdown for 2026. Agency vs freelancer vs fixed-price. BuildZn packages start at $800 with App Store delivery guaranteed. Get a free proposal.',
  alternates: { canonical: 'https://www.buildzn.com/flutter-app-cost' },
  openGraph: {
    title: 'How Much Does a Flutter App Cost in 2026? | BuildZn',
    description:
      'Complete Flutter app cost breakdown for 2026. Agency vs freelancer vs fixed-price. BuildZn packages start at $800.',
    url: 'https://www.buildzn.com/flutter-app-cost',
    siteName: 'BuildZn',
    type: 'article',
  },
};

const faqItems = [
  {
    q: 'How much does a simple Flutter app cost in 2026?',
    a: 'A simple Flutter app (10–12 screens, basic backend, iOS + Android) costs $800–$2,000 at BuildZn on a fixed-price basis. An Upwork freelancer would charge $25–60/hr which typically adds up to $3,000–$8,000+ for the same scope. A mobile agency would charge $15,000–$25,000.',
  },
  {
    q: 'What is included in the Flutter app cost?',
    a: 'At BuildZn, every package includes the Flutter app (iOS + Android), backend integration, App Store and Google Play submission, and 1 month of bug support. Higher tiers add custom Node.js backends, AI integration, admin dashboards, and Stripe/RevenueCat payments.',
  },
  {
    q: 'Is Flutter cheaper than React Native or native development?',
    a: 'Flutter is typically 30–50% cheaper than building separate native iOS and Android apps because one codebase covers both. Compared to React Native, Flutter tends to be similar in developer cost but often faster to ship because of fewer dependency issues.',
  },
  {
    q: 'How long does it take to build a Flutter app?',
    a: 'Simple apps: 3–4 weeks. Full-featured apps (payments, AI, real-time features): 5–8 weeks. Complex marketplaces or platforms: 8–12 weeks. BuildZn built Muslifie — a full international marketplace — in 6 weeks.',
  },
  {
    q: 'What is a fixed-price Flutter app development model?',
    a: 'Instead of paying hourly (where costs spiral), a fixed price means you agree on scope, price, and timeline upfront. BuildZn charges 50% at start, 50% on delivery. If the agreed scope cannot be delivered, you get your money back.',
  },
  {
    q: 'Should I hire an agency or a freelancer for my Flutter app?',
    a: 'Agencies are expensive ($15,000–$50,000+) and often use junior developers. Upwork freelancers are cheaper but carry disappearing-dev risk. BuildZn gives you a senior developer with a track record of 20+ shipped apps at a fixed price — without the agency markup.',
  },
];

export default function FlutterAppCostPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': 'https://www.buildzn.com/flutter-app-cost#article',
        headline: 'How Much Does a Flutter App Cost in 2026?',
        description:
          'Complete Flutter app cost breakdown for 2026. Agency vs freelancer vs fixed-price model explained with real BuildZn pricing.',
        author: {
          '@type': 'Person',
          name: 'Umair Bilal',
          url: 'https://www.buildzn.com/about',
          jobTitle: 'Senior Flutter Developer',
        },
        publisher: {
          '@type': 'Organization',
          name: 'BuildZn',
          url: 'https://www.buildzn.com',
        },
        datePublished: '2026-01-01',
        dateModified: '2026-03-24',
        url: 'https://www.buildzn.com/flutter-app-cost',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': 'https://www.buildzn.com/flutter-app-cost',
        },
      },
      {
        '@type': 'HowTo',
        name: 'How to budget for a Flutter app in 2026',
        description: 'Step-by-step guide to understanding Flutter app development costs and choosing the right development model.',
        step: [
          {
            '@type': 'HowToStep',
            name: 'Define your app scope',
            text: 'List your core features. Simple apps have 10–15 screens. Complex apps with payments, AI, or marketplace features need more time and budget.',
          },
          {
            '@type': 'HowToStep',
            name: 'Choose your development model',
            text: 'Agency ($15k–$50k), Upwork freelancer ($25–60/hr), or fixed-price developer like BuildZn (starting at $800).',
          },
          {
            '@type': 'HowToStep',
            name: 'Get a fixed-price proposal',
            text: 'Ask for a proposal with locked scope, timeline, and price. BuildZn delivers proposals within 24 hours of a free discovery call.',
          },
          {
            '@type': 'HowToStep',
            name: 'Review the delivery guarantee',
            text: 'Ensure your contract includes App Store submission and a bug support period. BuildZn includes 1 month post-launch support in all packages.',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#06080f] text-white overflow-x-hidden">

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 bg-[#06080f]/85 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center h-[70px]">
          <Link href="/">
            <Image src="/logo.svg" alt="BuildZn" width={130} height={33} priority />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-white/50 hover:text-white transition-colors">← Home</Link>
            <Link href="/about" className="text-sm font-medium text-white/50 hover:text-white transition-colors">About</Link>
            <a
              href="/#contact"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-purple-500/40 transition-all"
            >
              Get a Free Proposal →
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-[860px] mx-auto px-6 pt-[140px] pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-sm font-medium text-purple-300">Updated March 2026</span>
        </div>
        <h1 className="text-[clamp(32px,5.5vw,68px)] font-black leading-[1.05] tracking-[-2px] mb-6">
          How Much Does a Flutter App Cost in 2026?
        </h1>
        <p className="text-lg md:text-xl text-white/40 max-w-[640px] mx-auto mb-8 leading-relaxed">
          Agency vs Upwork freelancer vs fixed-price developer — real numbers, real timelines, and what BuildZn charges for the same work.
        </p>
        <a
          href="/#contact"
          className="inline-flex bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/40 transition-all hover:-translate-y-0.5 gap-2"
        >
          Get a Fixed-Price Proposal →
        </a>
      </section>

      {/* COMPARISON TABLE */}
      <section className="max-w-[1000px] mx-auto px-6 py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-8 text-center">
          Flutter App Development Cost Comparison 2026
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.08]">
                {['', 'Mobile Agency', 'Upwork Freelancer', 'BuildZn (Fixed Price)'].map((h, i) => (
                  <th key={i} className={`py-4 px-5 text-left text-[13px] font-bold ${i === 3 ? 'text-purple-400' : 'text-white/40'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {[
                { label: 'Simple app (10–15 screens)', agency: '$15,000–$25,000', upwork: '$3,000–$8,000', buildzn: '$800', highlight: true },
                { label: 'Full-featured app (payments, AI, backend)', agency: '$25,000–$50,000', upwork: '$8,000–$20,000', buildzn: '$2,500', highlight: false },
                { label: 'Complex marketplace / platform', agency: '$50,000+', upwork: '$15,000+', buildzn: '$5,000', highlight: false },
                { label: 'Timeline', agency: '3–6 months', upwork: 'Variable (often delayed)', buildzn: '3–8 weeks', highlight: false },
                { label: 'Pricing model', agency: 'Quote / hourly', upwork: '$25–60/hr', buildzn: 'Fixed price', highlight: false },
                { label: 'App Store submission included', agency: 'Extra cost', upwork: 'Usually extra', buildzn: '✓ Always included', highlight: false },
                { label: 'Bug support after launch', agency: 'Paid retainer', upwork: 'No guarantee', buildzn: '1 month included', highlight: false },
                { label: 'Senior developer guarantee', agency: 'Junior teams common', upwork: 'No guarantee', buildzn: '✓ 20+ apps shipped', highlight: false },
              ].map((row, i) => (
                <tr key={i} className={`${row.highlight ? 'bg-purple-500/[0.04]' : ''}`}>
                  <td className="py-4 px-5 text-sm text-white/55 font-medium">{row.label}</td>
                  <td className="py-4 px-5 text-sm text-white/35">{row.agency}</td>
                  <td className="py-4 px-5 text-sm text-white/35">{row.upwork}</td>
                  <td className="py-4 px-5 text-sm text-purple-300 font-semibold">{row.buildzn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* BUILDZN PRICING TIERS */}
      <section className="bg-purple-500/[0.03] py-20 px-6">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4">BuildZn Packages — What&apos;s Included</h2>
            <p className="text-base text-white/35">Fixed price. 50% upfront, 50% on App Store approval.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                name: 'Starter',
                price: '$800',
                sub: 'Perfect for MVPs and idea validation',
                highlight: false,
                features: [
                  'Simple app (10–12 screens)',
                  'Firebase backend',
                  'iOS + Android deployment',
                  'App Store submission included',
                  '30 days delivery',
                  '1 month bug support',
                ],
              },
              {
                name: 'Growth',
                price: '$2,500',
                sub: 'Most popular — real features, real launch',
                highlight: true,
                features: [
                  'Full-featured app (15–25 screens)',
                  'Custom Node.js + MongoDB backend',
                  'Stripe or RevenueCat payments',
                  'AI integration (OpenAI / Gemini)',
                  'Admin dashboard',
                  'iOS + Android + App Store',
                  '45 days delivery',
                  '1 month bug support',
                ],
              },
              {
                name: 'Scale',
                price: '$5,000',
                sub: 'Complex platforms and marketplaces',
                highlight: false,
                features: [
                  'Complex app (25+ screens)',
                  'Multi-role auth system',
                  'Stripe Connect or RevenueCat',
                  'Real-time chat / WebSockets',
                  'Full admin dashboard',
                  'AI/RAG features',
                  '60 days delivery',
                  '1 month bug support',
                ],
              },
            ].map((p, i) => (
              <div
                key={i}
                className={`rounded-3xl p-7 relative ${
                  p.highlight
                    ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/40 shadow-[0_0_30px_rgba(139,92,246,0.15)]'
                    : 'bg-white/[0.03] border border-white/[0.06]'
                }`}
              >
                {p.highlight && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-[11px] font-bold uppercase">
                    Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold text-white/50 mb-1">{p.name}</h3>
                <div className="text-4xl font-extrabold tracking-tight mb-1">{p.price}</div>
                <p className="text-sm text-white/25 mb-6">{p.sub}</p>
                <div className="border-t border-white/[0.06] pt-5 mb-6 space-y-2.5">
                  {p.features.map((f, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <span className={`text-sm mt-0.5 ${p.highlight ? 'text-purple-400' : 'text-green-500'}`}>✓</span>
                      <span className="text-sm text-white/45">{f}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="/#contact"
                  className={`block text-center rounded-full font-bold text-sm py-3.5 transition-all hover:-translate-y-0.5 ${
                    p.highlight
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/40'
                      : 'bg-white/5 border border-white/15 text-white hover:bg-white/10'
                  }`}
                >
                  Get a Free Proposal →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY FIXED PRICE */}
      <section className="max-w-[860px] mx-auto px-6 py-20">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-6 text-center">
          Why Fixed Price Beats Hourly Every Time
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {[
            {
              icon: '🔒',
              title: 'No scope creep surprises',
              desc: 'Scope is defined in your proposal. Adding features mid-project gets scoped separately — it never inflates your original quote.',
            },
            {
              icon: '📅',
              title: 'Real deadlines, not estimates',
              desc: 'Your timeline is locked in the contract. Muslifie: discovery call to App Store in 6 weeks. FarahGPT: live in under 5 weeks.',
            },
            {
              icon: '💳',
              title: '50% upfront, 50% on delivery',
              desc: 'You only pay the second half when your app is live on App Store and Google Play. No payment for promises.',
            },
            {
              icon: '👨‍💻',
              title: 'One senior developer, full stack',
              desc: 'No junior handoffs, no PM layers, no lost-in-translation bugs. One person owns your product end to end.',
            },
          ].map((item, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-purple-500/20 transition-all">
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-base font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-purple-500/[0.03] py-20 px-6">
        <div className="max-w-[860px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-base text-white/35">Everything founders ask before booking a call.</p>
          </div>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                <h3 className="text-sm md:text-base font-semibold mb-3">{item.q}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[700px] mx-auto px-6 py-24 text-center">
        <h2 className="text-[clamp(28px,4vw,48px)] font-extrabold tracking-tight mb-4">
          Ready to get a fixed-price proposal?
        </h2>
        <p className="text-base text-white/35 mb-8 leading-relaxed">
          Book a free 15-minute discovery call. I&apos;ll scope your project, give you a real timeline, and send a fixed-price proposal within 24 hours — no commitment required.
        </p>
        <a
          href="/#contact"
          className="inline-flex bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/40 transition-all hover:-translate-y-0.5 gap-2"
        >
          Get a Fixed-Price Proposal for Your App →
        </a>
        <p className="text-[12px] text-white/20 mt-5">
          Built FarahGPT (5,100+ users) and Muslifie (200+ companies). 20+ apps live on App Store & Google Play.
        </p>
      </section>

      {/* Author / Footer */}
      <div className="max-w-[860px] mx-auto px-6 pb-12">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 flex gap-5 items-start">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-base flex-shrink-0">U</div>
          <div>
            <p className="text-sm font-bold mb-1">Written by Umair Bilal</p>
            <p className="text-[13px] text-white/40 leading-relaxed">
              Senior Flutter Developer with 4+ years experience and 20+ apps shipped to App Store and Google Play. Founder of FarahGPT (5,100+ users) and Muslifie (200+ verified companies). Full-stack: Flutter, Node.js, Next.js, AI, Stripe, RevenueCat, Firebase, MongoDB.
            </p>
            <div className="flex gap-4 mt-3">
              <Link href="/about" className="text-[12px] text-purple-400 hover:text-purple-300 font-medium transition-colors">About →</Link>
              <a href="https://www.linkedin.com/in/umair-bilal-/" target="_blank" rel="noopener noreferrer" className="text-[12px] text-purple-400 hover:text-purple-300 font-medium transition-colors">LinkedIn →</a>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-white/5 py-10 px-6 text-center">
        <p className="text-[12px] text-white/15">
          © 2026 BuildZn · <Link href="/" className="hover:text-white/30 transition-colors">Home</Link> ·{' '}
          <Link href="/about" className="hover:text-white/30 transition-colors">About</Link> ·{' '}
          <Link href="/blog" className="hover:text-white/30 transition-colors">Blog</Link>
        </p>
      </footer>
    </div>
  );
}
