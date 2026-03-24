import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About Umair Bilal — Senior Flutter Developer | BuildZn',
  description:
    'Senior Flutter Developer with 4+ years experience, 20+ apps shipped to App Store & Google Play. Founder of FarahGPT (5,100+ users) and Muslifie. Open to senior remote Flutter roles.',
  alternates: { canonical: 'https://www.buildzn.com/about' },
  openGraph: {
    title: 'About Umair Bilal — Senior Flutter Developer | BuildZn',
    description:
      'Senior Flutter Developer with 4+ years experience and 20+ apps shipped. Available for freelance projects and senior remote roles.',
    url: 'https://www.buildzn.com/about',
    siteName: 'BuildZn',
    type: 'profile',
  },
};

const techStack = [
  { category: 'Mobile', items: ['Flutter', 'Dart', 'iOS', 'Android', 'App Store', 'Google Play'] },
  { category: 'Backend', items: ['Node.js', 'Express', 'REST APIs', 'WebSockets'] },
  { category: 'Frontend', items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'] },
  { category: 'AI & ML', items: ['OpenAI', 'Gemini', 'RAG Systems', 'LangChain', 'Claude'] },
  { category: 'Payments', items: ['Stripe', 'Stripe Connect', 'RevenueCat', 'In-App Purchases'] },
  { category: 'Databases', items: ['Firebase', 'Supabase', 'MongoDB', 'PostgreSQL'] },
  { category: 'Cloud & DevOps', items: ['AWS', 'Vercel', 'GitHub Actions', 'Docker'] },
  { category: 'Tools', items: ['Figma', 'Postman', 'Xcode', 'Android Studio'] },
];

const apps = [
  {
    name: 'FarahGPT',
    tagline: 'Islamic habit-building app with 5,100+ active users',
    desc: 'AI Islamic education platform featuring 7 AI personalities, streak tracking, RAG-powered chat, Ramadan Mode, and a full subscription model. Built with Flutter and Supabase.',
    stat: '5,100+ active users',
    color: 'from-purple-500 to-pink-400',
    initial: 'F',
    ios: 'https://apps.apple.com/pk/app/farahgpt/id6746275409',
    android: 'https://play.google.com/store/apps/details?id=com.app.farahgpt',
    tags: ['Flutter', 'Supabase', 'AI/RAG', 'RevenueCat'],
  },
  {
    name: 'Muslifie',
    tagline: 'Muslim travel marketplace with 200+ verified companies',
    desc: 'Full marketplace connecting Muslim travelers with verified local guides worldwide. Stripe Connect payouts, real-time chat, guide verification, 70+ language support, private tour booking, and a Next.js admin panel.',
    stat: '200+ companies onboarded',
    color: 'from-blue-500 to-cyan-400',
    initial: 'M',
    ios: 'https://apps.apple.com/us/app/muslifie/id6749224199',
    android: 'https://play.google.com/store/apps/details?id=com.app.muslifie&hl=en',
    web: 'https://www.muslifie.com/',
    tags: ['Flutter', 'Node.js', 'Next.js', 'MongoDB', 'Stripe'],
  },
  {
    name: 'MyAiPal',
    tagline: 'AI wellness and voice journaling companion',
    desc: 'Mental wellness app with Gemini-powered AI conversations, voice journaling, personalized guidance, and subscription monetization via RevenueCat. Live on iOS and Android.',
    stat: 'Live on both stores',
    color: 'from-emerald-500 to-teal-400',
    initial: 'A',
    ios: 'https://apps.apple.com/us/app/myaipal/id6753610068',
    android: 'https://play.google.com/store/apps/details?id=com.app.myaipal&hl=en',
    tags: ['Flutter', 'Gemini', 'Firebase', 'RevenueCat'],
  },
  {
    name: 'Voisbe',
    tagline: 'Voice-first social network for authentic audio sharing',
    desc: 'Social platform for voice — audio posts, voice comments, and rich media backgrounds. Instagram for voice. Live on iOS.',
    stat: 'Live on iOS',
    color: 'from-orange-500 to-rose-400',
    initial: 'V',
    ios: 'https://apps.apple.com/us/app/voisbe/id6702029635',
    tags: ['Flutter', 'Firebase', 'Node.js', 'Audio'],
  },
];

const process = [
  { step: '01', title: 'Discovery Call', desc: 'Free 15-minute call to scope your project, understand your users, and confirm fit.' },
  { step: '02', title: 'Fixed-Price Proposal', desc: 'Detailed proposal with mockups, milestone breakdown, and locked price delivered within 24 hours.' },
  { step: '03', title: 'Build & Demo', desc: 'Weekly updates and live demos. You see real progress every week — no black boxes.' },
  { step: '04', title: 'App Store Launch', desc: 'Full iOS and Android submission handled. Includes QA, screenshots, and App Store metadata.' },
];

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Umair Bilal',
    jobTitle: 'Senior Flutter Developer',
    description:
      'Senior Flutter Developer with 4+ years experience and 20+ apps shipped to App Store and Google Play. Founder of FarahGPT and Muslifie.',
    url: 'https://www.buildzn.com',
    image: 'https://www.buildzn.com/og-image.png',
    worksFor: {
      '@type': 'Organization',
      name: 'BuildZn',
      url: 'https://www.buildzn.com',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'PK',
    },
    sameAs: [
      'https://www.linkedin.com/in/umair-bilal-/',
      'https://github.com/umair24171',
      'https://www.buildzn.com',
    ],
    knowsAbout: [
      'Flutter', 'Dart', 'Mobile App Development', 'iOS Development',
      'Android Development', 'Node.js', 'Next.js', 'AI Integration',
      'Stripe', 'RevenueCat', 'Firebase', 'MongoDB', 'Supabase',
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
          <Link href="/" className="flex items-center">
            <Image src="/logo.svg" alt="BuildZn" width={130} height={33} priority />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-white/50 hover:text-white transition-colors">← Home</Link>
            <Link href="/blog" className="text-sm font-medium text-white/50 hover:text-white transition-colors">Blog</Link>
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
      <section className="max-w-[1200px] mx-auto px-6 pt-[140px] pb-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/25 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-medium text-green-300">🟢 Open to 2 new projects — April 2026</span>
            </div>
            <h1 className="text-[clamp(36px,5vw,64px)] font-black leading-[1.05] tracking-[-2px] mb-6">
              Umair Bilal<br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Senior Flutter Dev
              </span>
            </h1>
            <p className="text-lg text-white/50 leading-relaxed mb-4">
              4+ years building production mobile apps. 20+ apps shipped to App Store and Google Play. Based in Pakistan, working with clients worldwide.
            </p>
            <p className="text-base text-white/40 leading-relaxed mb-8">
              I built FarahGPT (5,100+ active users) and Muslifie (200+ verified international companies) — and a handful of AI agents that run 24/7 without me touching them. I write, ship, and support real products.
            </p>

            {/* Key numbers */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { val: '4+', label: 'Years Experience' },
                { val: '20+', label: 'Apps Shipped' },
                { val: '6,100+', label: 'Live Users' },
              ].map((s, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl py-5 px-4 text-center">
                  <div className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">{s.val}</div>
                  <div className="text-[11px] text-white/30 font-medium">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/#contact"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-purple-500/40 transition-all hover:-translate-y-0.5"
              >
                Start a Project →
              </a>
              <a
                href="https://www.linkedin.com/in/umair-bilal-/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 border border-white/15 text-white/70 px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/10 hover:text-white transition-all hover:-translate-y-0.5"
              >
                LinkedIn →
              </a>
              <a
                href="https://github.com/umair24171"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 border border-white/15 text-white/70 px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/10 hover:text-white transition-all hover:-translate-y-0.5"
              >
                GitHub →
              </a>
            </div>
          </div>

          {/* Right: Recruiter signal */}
          <div>
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/25 rounded-2xl p-7 mb-5">
              <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-[2px] mb-3">Open to Senior Remote Roles</p>
              <h3 className="text-xl font-bold mb-3">Also available for full-time</h3>
              <p className="text-sm text-white/45 leading-relaxed mb-5">
                Looking for senior remote Flutter roles. I bring a full-stack background, strong product instincts, and a track record of shipping apps that users actually keep on their phones.
              </p>
              <ul className="space-y-2 mb-5">
                {[
                  'Senior Flutter Developer',
                  'Lead Mobile Engineer',
                  'Full-Stack Flutter + Node.js',
                  'AI-Enabled Mobile Apps',
                ].map((role, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/55">
                    <span className="text-emerald-400 text-xs">✓</span> {role}
                  </li>
                ))}
              </ul>
              <a
                href="https://www.linkedin.com/in/umair-bilal-/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-emerald-500/25 transition-all"
              >
                View LinkedIn Profile →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="bg-white/[0.02] border-y border-white/[0.05] py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-purple-500 uppercase tracking-[2px] mb-3">Tech Stack</p>
            <h2 className="text-[clamp(24px,3.5vw,40px)] font-extrabold tracking-tight">Full-stack from Day 1</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {techStack.map((group, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
                <p className="text-[11px] font-bold text-purple-400 uppercase tracking-[1.5px] mb-3">{group.category}</p>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item, j) => (
                    <span key={j} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/[0.04] text-white/45 border border-white/[0.07]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APP PORTFOLIO */}
      <section className="max-w-[1200px] mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-purple-500 uppercase tracking-[2px] mb-3">Portfolio</p>
          <h2 className="text-[clamp(24px,3.5vw,40px)] font-extrabold tracking-tight mb-4">Apps people actually use</h2>
          <p className="text-base text-white/35">All 4 apps are live on App Store and/or Google Play — search them yourself.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {apps.map((app, i) => (
            <div key={i} className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all">
              <div className={`h-1 bg-gradient-to-r ${app.color}`} />
              <div className="p-7">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center font-extrabold text-base`}>
                    {app.initial}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{app.name}</h3>
                    <p className="text-[12px] text-white/35">{app.tagline}</p>
                  </div>
                </div>
                <p className="text-sm text-white/45 leading-relaxed mb-5">{app.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {app.tags.map((t, j) => (
                    <span key={j} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/[0.05] text-white/40 border border-white/[0.07]">{t}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {app.ios && (
                    <a href={app.ios} target="_blank" rel="noopener noreferrer" className="text-[12px] font-semibold text-white/50 hover:text-white bg-white/[0.04] border border-white/[0.08] px-3.5 py-1.5 rounded-full transition-all hover:border-white/20">
                      App Store →
                    </a>
                  )}
                  {app.android && (
                    <a href={app.android} target="_blank" rel="noopener noreferrer" className="text-[12px] font-semibold text-white/50 hover:text-white bg-white/[0.04] border border-white/[0.08] px-3.5 py-1.5 rounded-full transition-all hover:border-white/20">
                      Google Play →
                    </a>
                  )}
                  {app.web && (
                    <a href={app.web} target="_blank" rel="noopener noreferrer" className="text-[12px] font-semibold text-white/50 hover:text-white bg-white/[0.04] border border-white/[0.08] px-3.5 py-1.5 rounded-full transition-all hover:border-white/20">
                      Website →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-purple-500/[0.03] py-24 px-6">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-purple-500 uppercase tracking-[2px] mb-3">Process</p>
            <h2 className="text-[clamp(24px,3.5vw,40px)] font-extrabold tracking-tight mb-4">How I work</h2>
            <p className="text-base text-white/35">Fixed-price. Real milestones. App Store or your money back.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {process.map((p, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 text-center hover:border-purple-500/20 transition-all">
                <span className="text-[12px] font-bold text-purple-500 tracking-[2px] mb-3 block">{p.step}</span>
                <h3 className="text-base font-bold mb-2">{p.title}</h3>
                <p className="text-xs text-white/35 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="max-w-[700px] mx-auto px-6 py-24 text-center">
        <h2 className="text-[clamp(28px,4vw,48px)] font-extrabold tracking-tight mb-4">
          Ready to ship your app?
        </h2>
        <p className="text-base text-white/35 mb-8">
          Book a free 15-minute call. No commitment — just a clear proposal within 24 hours.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/#contact"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-bold text-base hover:shadow-2xl hover:shadow-purple-500/40 transition-all hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
          >
            Get a Free Proposal →
          </a>
          <a
            href="https://www.linkedin.com/in/umair-bilal-/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/5 border border-white/15 text-white/70 px-8 py-4 rounded-full font-semibold text-base hover:bg-white/10 hover:text-white transition-all hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
          >
            Also open to senior remote Flutter roles →
          </a>
        </div>
      </section>

      <footer className="border-t border-white/5 py-10 px-6 text-center">
        <p className="text-[12px] text-white/15">© 2026 BuildZn · Umair Bilal. All rights reserved.</p>
      </footer>
    </div>
  );
}
