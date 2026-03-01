'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useForm, ValidationError } from '@formspree/react';

// ─── Animated Star Field Canvas ───
const StarField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    let w = (c.width = window.innerWidth);
    let h = (c.height = 900);
    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.3 + 0.05,
      opacity: Math.random() * 0.8 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      stars.forEach((s) => {
        s.pulse += 0.01;
        s.y += s.speed;
        if (s.y > h) { s.y = 0; s.x = Math.random() * w; }
        const o = s.opacity * (0.5 + 0.5 * Math.sin(s.pulse));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,160,255,${o})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { w = c.width = window.innerWidth; h = c.height = 900; };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full pointer-events-none" style={{ height: 900 }} />;
};

// ─── Fixed Count-up Animation ───
const CountUp = ({ end, suffix = '' }: { end: number; suffix?: string }) => {
  const [val, setVal] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (hasAnimated) return;
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1200;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(eased * end);
            setVal(current);
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setVal(end);
            }
          };
          requestAnimationFrame(animate);
          obs.disconnect();
        }
      },
      { threshold: 0.3, rootMargin: '50px' }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [end, hasAnimated]);

  return <span ref={ref}>{val}{suffix}</span>;
};

// ─── WhatsApp Floating Button ───
const WhatsAppButton = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <a
      // TODO: Replace with your real WhatsApp number
      href="https://wa.me/923067128817?text=Hi%20Umair!%20I%20visited%20your%20website%20and%20I%27m%20interested%20in%20getting%20an%20app%20built."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-110 transition-all duration-300 animate-[bounceIn_0.5s_ease-out]"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.502 1.14 6.742 3.072 9.372L1.062 31.29l6.166-1.976A15.91 15.91 0 0016.004 32C24.826 32 32 24.826 32 16.004 32 7.176 24.826 0 16.004 0zm9.302 22.602c-.388 1.094-1.938 2.002-3.164 2.266-.84.178-1.938.32-5.632-1.21-4.726-1.956-7.77-6.756-8.004-7.07-.226-.314-1.894-2.52-1.894-4.808s1.196-3.41 1.622-3.876c.388-.424.852-.532 1.136-.532.282 0 .566.004.812.014.262.012.612-.098.958.73.354.852 1.21 2.942 1.316 3.158.108.216.178.468.036.748-.142.282-.214.458-.428.706-.214.248-.45.554-.644.744-.214.214-.436.446-.188.874.248.428 1.104 1.82 2.37 2.948 1.63 1.45 3.004 1.9 3.432 2.112.428.214.678.178.926-.108.248-.282 1.064-1.236 1.348-1.662.282-.428.566-.354.958-.214.39.142 2.48 1.17 2.908 1.382.428.214.712.32.82.496.106.178.106 1.024-.282 2.116z" />
      </svg>
      <span className="absolute w-full h-full rounded-full bg-[#25D366] animate-ping opacity-20" />
    </a>
  );
};

// ─── Phone Mockup Component ───
const PhoneMockup = ({ gradient, appName, screens }: { gradient: string; appName: string; screens: string[] }) => {
  return (
    <div className="relative w-[140px] h-[280px] md:w-[160px] md:h-[320px] flex-shrink-0">
      {/* Phone Frame */}
      <div className="absolute inset-0 rounded-[24px] border-2 border-white/10 bg-[#0a0d18] shadow-2xl overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#0a0d18] rounded-b-xl z-10" />
        {/* Screen Content - Gradient placeholder */}
        <div className={`absolute inset-[3px] rounded-[21px] bg-gradient-to-br ${gradient} overflow-hidden`}>
          {/* App UI Simulation */}
          <div className="absolute inset-0 flex flex-col p-3 pt-7">
            {/* Status bar dots */}
            <div className="flex justify-between items-center mb-3 px-1">
              <div className="text-[8px] font-bold text-white/90">9:41</div>
              <div className="flex gap-0.5">
                <div className="w-3 h-1.5 rounded-sm bg-white/70" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
              </div>
            </div>
            {/* App name */}
            <div className="text-[10px] font-bold text-white mb-2">{appName}</div>
            {/* Simulated UI elements */}
            {screens.map((type, i) => {
              if (type === 'card') return (
                <div key={i} className="bg-white/15 backdrop-blur-sm rounded-lg p-2 mb-1.5">
                  <div className="h-1.5 w-3/4 bg-white/30 rounded-full mb-1" />
                  <div className="h-1 w-1/2 bg-white/20 rounded-full" />
                </div>
              );
              if (type === 'list') return (
                <div key={i} className="space-y-1 mb-1.5">
                  {[1,2,3].map(j => (
                    <div key={j} className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-md bg-white/20" />
                      <div className="flex-1">
                        <div className="h-1 w-3/4 bg-white/25 rounded-full mb-0.5" />
                        <div className="h-1 w-1/2 bg-white/15 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              );
              if (type === 'chat') return (
                <div key={i} className="space-y-1 mb-1.5">
                  <div className="bg-white/20 rounded-lg rounded-bl-none p-1.5 w-3/4">
                    <div className="h-1 w-full bg-white/30 rounded-full mb-0.5" />
                    <div className="h-1 w-2/3 bg-white/20 rounded-full" />
                  </div>
                  <div className="bg-white/10 rounded-lg rounded-br-none p-1.5 w-2/3 ml-auto">
                    <div className="h-1 w-full bg-white/25 rounded-full" />
                  </div>
                </div>
              );
              if (type === 'hero') return (
                <div key={i} className="bg-white/10 rounded-xl p-2 mb-1.5 flex-1">
                  <div className="h-2 w-2/3 bg-white/30 rounded-full mb-1.5" />
                  <div className="h-1 w-full bg-white/15 rounded-full mb-0.5" />
                  <div className="h-1 w-4/5 bg-white/15 rounded-full mb-2" />
                  <div className="h-5 w-16 bg-white/25 rounded-full" />
                </div>
              );
              return null;
            })}
            {/* Bottom nav */}
            <div className="mt-auto flex justify-around pt-2 border-t border-white/10">
              {[1,2,3,4].map(j => (
                <div key={j} className={`w-3 h-3 rounded-full ${j === 1 ? 'bg-white/50' : 'bg-white/15'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Mobile Menu ───
const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div className={`fixed top-0 right-0 h-full w-[280px] bg-[#0a0d18] border-l border-white/10 z-[100] transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-extrabold text-sm">U</div>
            <span className="font-bold">Dev.Umair</span>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors" aria-label="Close menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <nav className="p-6 space-y-2">
          {['Services', 'Portfolio', 'Agents', 'Pricing', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={onClose}
              className="block py-3 px-4 text-[15px] font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              {item}
            </a>
          ))}
          <Link
            href="/blog"
            onClick={onClose}
            className="block py-3 px-4 text-[15px] font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            Blog
          </Link>
        </nav>
        <div className="p-6 mt-4">
          <a
            href="#contact"
            onClick={onClose}
            className="block text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3.5 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-purple-500/40 transition-all"
          >
            Book Free Call →
          </a>
        </div>
        <div className="absolute bottom-8 left-6 right-6 flex justify-center gap-6">
          <a href="mailto:umairbilal207@gmail.com" className="text-white/30 hover:text-purple-400 transition-colors text-sm">Email</a>
          <a href="https://www.linkedin.com/in/umair-bilal-/" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-purple-400 transition-colors text-sm">LinkedIn</a>
          <a href="https://github.com/umair24171" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-purple-400 transition-colors text-sm">GitHub</a>
        </div>
      </div>
    </>
  );
};

// ─── Data ───
const apps = [
  {
    name: 'Muslifie',
    desc: 'Muslim travel marketplace connecting travelers with verified local guides. Stripe payments, real-time chat, 70+ languages.',
    tags: ['Flutter', 'Next.js', 'Node.js', 'Stripe', 'MongoDB'],
    ios: 'https://apps.apple.com/us/app/muslifie/id6749224199',
    android: 'https://play.google.com/store/apps/details?id=com.app.muslifie&hl=en',
    web: 'https://www.muslifie.com/',
    users: 'Live',
    color: 'from-blue-500 to-cyan-400',
    screens: ['hero', 'list', 'card'] as string[],
  },
  {
    name: 'FarahGPT',
    desc: 'AI Islamic education platform with 7 AI personalities, habit tracking, and personalized learning for 2,100+ active users.',
    tags: ['Flutter', 'AI/RAG', 'Firebase', 'RevenueCat'],
    ios: 'https://apps.apple.com/pk/app/farahgpt/id6746275409',
    android: 'https://play.google.com/store/apps/details?id=com.app.farahgpt',
    users: '2,100+',
    color: 'from-purple-500 to-pink-400',
    screens: ['chat', 'card', 'list'] as string[],
  },
  {
    name: 'MyAiPal',
    desc: 'AI-powered wellness companion with mental health support, journaling, and personalized guidance with subscriptions.',
    tags: ['Flutter', 'OpenAI', 'Firebase', 'RevenueCat'],
    ios: 'https://apps.apple.com/us/app/myaipal/id6753610068',
    android: 'https://play.google.com/store/apps/details?id=com.app.myaipal&hl=en',
    users: 'Live',
    color: 'from-emerald-500 to-teal-400',
    screens: ['hero', 'chat', 'card'] as string[],
  },
  {
    name: 'Voisbe',
    desc: 'Voice-first social network — audio posts, voice comments, rich media backgrounds. Instagram for voice.',
    tags: ['Flutter', 'Firebase', 'Node.js', 'Audio'],
    ios: 'https://apps.apple.com/us/app/voisbe/id6702029635',
    android: 'https://play.google.com/store/search?q=Voisbe&c=apps&hl=en',
    users: 'Live',
    color: 'from-orange-500 to-rose-400',
    screens: ['list', 'hero', 'card'] as string[],
  },
];

const services = [
  { icon: '📱', title: 'Mobile Apps', desc: 'Cross-platform Flutter apps with native performance, deployed to both stores.', features: ['iOS & Android', 'App Store deployment', 'Push notifications', 'Offline support'] },
  { icon: '⚡', title: 'AI Integration', desc: 'Smart features powered by OpenAI, custom RAG systems, and ML models.', features: ['ChatGPT / Claude API', 'AI chatbots', 'RAG systems', 'Smart recommendations'] },
  { icon: '🌐', title: 'Backend & Admin', desc: 'Scalable Node.js APIs with beautiful Next.js admin dashboards.', features: ['REST APIs', 'Admin panels', 'Real-time features', 'Database design'] },
  { icon: '💳', title: 'Payments & Growth', desc: 'Monetization systems with Stripe, RevenueCat, and analytics.', features: ['Stripe Connect', 'In-app purchases', 'Subscription systems', 'Analytics dashboards'] },
];

const agents = [
  {
    name: 'Gold Trading System',
    status: 'Live 24/7',
    statusColor: 'green',
    desc: '4 sub-agents trading XAU/USD live. Trained on 1.4M candles (6 years of data). Swing agent runs 24/7; NY + London scalpers fire at market open; News Bias agent filters high-impact events to avoid bad trades.',
    stats: [
      { label: 'Win Rate', value: '51%+' },
      { label: 'Profit Factor', value: '1.89' },
      { label: 'Annual Return', value: '~115R' },
      { label: 'Sub-agents', value: '4' },
    ],
    tags: ['Node.js', 'TwelveData API', 'Forex Factory', 'Render', 'Discord'],
    color: 'from-yellow-500 to-amber-400',
  },
  {
    name: 'AI Content Pipeline',
    status: 'Runs 2x Daily',
    statusColor: 'blue',
    desc: 'Fully automated content engine. Researches trending topics from RSS + GitHub + NewsAPI → Gemini scores and picks the best → writes LinkedIn posts, Twitter threads, Instagram captions → auto-posts. Zero human input.',
    stats: [
      { label: 'Platforms', value: '4' },
      { label: 'Runs/Day', value: '2×' },
      { label: 'Human input', value: 'Zero' },
      { label: 'Content types', value: '3' },
    ],
    tags: ['Node.js', 'Gemini 2.5', 'LinkedIn API', 'Twitter API', 'Google Sheets'],
    color: 'from-blue-500 to-cyan-400',
  },
  {
    name: 'Blog Writer Agent',
    status: 'Mon / Wed / Fri',
    statusColor: 'purple',
    desc: 'SEO-first blog automation for this site. Targets real search queries, runs 7 quality checks before publishing (keyword placement, word count, FAQ section, code blocks), commits to GitHub → Vercel auto-deploys.',
    stats: [
      { label: 'Words/Post', value: '1500+' },
      { label: 'SEO Checks', value: '7' },
      { label: 'Topics queued', value: '15' },
      { label: 'Deploy time', value: '~2 min' },
    ],
    tags: ['Node.js', 'Gemini 2.5', 'Octokit', 'GitHub Actions', 'Vercel'],
    color: 'from-purple-500 to-pink-400',
  },
  {
    name: 'Job Hunting Agent',
    status: 'On Demand',
    statusColor: 'green',
    desc: 'Scrapes job listings automatically, scores each against my skills using AI, saves high-match opportunities to Google Sheets, and fires a WhatsApp notification via Twilio so I never miss a good lead.',
    stats: [
      { label: 'Sources', value: 'Multi' },
      { label: 'Scoring', value: 'AI' },
      { label: 'Alert channel', value: 'WhatsApp' },
      { label: 'Storage', value: 'Sheets' },
    ],
    tags: ['Puppeteer', 'Gemini', 'Twilio', 'Google Sheets', 'GitHub Actions'],
    color: 'from-emerald-500 to-teal-400',
  },
];

const pricing = [
  { name: 'Starter', price: '3,000', sub: 'Perfect for MVPs', features: ['Simple app (10-12 screens)', 'Firebase backend', 'iOS + Android deployment', '30 days delivery', '1 month bug support'], highlight: false },
  { name: 'Professional', price: '6,000', sub: 'For growing businesses', features: ['Complex app (20+ screens)', 'Custom Node.js backend', 'Next.js admin panel', 'Stripe payment integration', '45 days delivery', '3 months support'], highlight: true },
  { name: 'Enterprise', price: '12,000', sub: 'Full-scale platforms', features: ['Marketplace / booking platform', 'AI features (chat, recs, etc)', 'Full admin dashboard', 'Multi-language (70+)', '60 days delivery', '6 months support'], highlight: false },
];

// ─── Main Page ───
export default function Home() {
  const [formState, handleFormSubmit] = useForm("xykywokz");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#06080f] text-white overflow-x-hidden">

      {/* ─── NAV ─── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-400 ${scrolled ? 'bg-[#06080f]/85 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
        <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center h-[70px]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-extrabold text-lg">U</div>
            <span className="text-xl font-extrabold tracking-tight">Dev.Umair</span>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex gap-7">
              {['Services', 'Portfolio', 'Agents', 'Pricing'].map(s => (
                <a key={s} href={`#${s.toLowerCase()}`} className="text-sm font-medium text-white/50 hover:text-white transition-colors">{s}</a>
              ))}
              <Link href="/blog" className="text-sm font-medium text-white/50 hover:text-white transition-colors">Blog</Link>
            </div>
            <a href="#contact" className="hidden sm:inline-flex bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-purple-500/40 transition-all hover:-translate-y-0.5">
              Get Started →
            </a>
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              aria-label="Open menu"
            >
              <span className="w-5 h-[2px] bg-white/70 rounded-full" />
              <span className="w-5 h-[2px] bg-white/70 rounded-full" />
              <span className="w-3.5 h-[2px] bg-white/70 rounded-full self-start ml-[10px]" />
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* ─── HERO ─── */}
      <section className="relative min-h-[900px] flex items-center overflow-hidden">
        <StarField />
        <div className="absolute -top-[10%] left-[60%] w-[600px] h-[600px] rounded-full bg-purple-500/20 blur-[80px] pointer-events-none animate-[float_6s_ease-in-out_infinite_alternate]" />
        <div className="absolute top-[30%] -left-[10%] w-[500px] h-[500px] rounded-full bg-pink-500/15 blur-[80px] pointer-events-none animate-[float_8s_ease-in-out_infinite_alternate]" />
        <div className="absolute top-[60%] left-[70%] w-[400px] h-[400px] rounded-full bg-blue-500/15 blur-[80px] pointer-events-none animate-[float_10s_ease-in-out_infinite_alternate]" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-purple-500/[0.08] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-purple-500/[0.05] pointer-events-none" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 pt-[140px] pb-20 text-center w-full">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8 animate-[fadeUp_0.6s_ease-out]">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-purple-300">20+ Apps Live in Production</span>
          </div>

          <h1 className="text-[clamp(36px,6vw,80px)] font-black leading-[1.05] tracking-[-2px] mb-6 animate-[fadeUp_0.8s_ease-out]">
            I build apps that<br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">people actually use.</span>
          </h1>

          <p className="text-lg md:text-xl text-white/40 max-w-[600px] mx-auto mb-10 font-normal leading-relaxed animate-[fadeUp_1s_ease-out]">
            Full-stack Flutter developer with a track record of shipping real products. From concept to App Store — no fluff, just results.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 animate-[fadeUp_1.2s_ease-out]">
            <a href="#contact" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/40 transition-all hover:-translate-y-0.5 inline-flex items-center justify-center gap-2">
              Book Free Call <span className="text-xl">→</span>
            </a>
            <a href="#portfolio" className="bg-white/5 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg border border-white/15 hover:bg-white/10 hover:border-white/30 transition-all hover:-translate-y-0.5 inline-flex items-center justify-center gap-2">
              See Live Apps ↗
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden max-w-[800px] mx-auto animate-[fadeUp_1.4s_ease-out]">
            {[
              { val: 15, suffix: '+', label: 'Apps Shipped' },
              { val: 10, suffix: 'K+', label: 'Active Users' },
              { val: 100, suffix: '%', label: 'Delivery Rate' },
              { val: 5, suffix: '★', label: 'Client Rating' },
            ].map((s, i) => (
              <div key={i} className={`py-7 px-4 text-center ${i < 3 ? 'md:border-r md:border-white/[0.06]' : ''} ${i < 2 ? 'border-b md:border-b-0 border-white/[0.06]' : ''} ${i === 2 ? 'border-b md:border-b-0 border-white/[0.06]' : ''}`}>
                <div className="text-[28px] md:text-[32px] font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  <CountUp end={s.val} suffix={s.suffix} />
                </div>
                <div className="text-[12px] md:text-[13px] text-white/30 mt-1 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DEPLOYED ON ─── */}
      <div className="border-y border-white/5 py-6 text-center px-4">
        <span className="text-[11px] md:text-[13px] font-medium text-white/25 tracking-[2px] uppercase">
          Deployed on &nbsp;•&nbsp; Apple App Store &nbsp;•&nbsp; Google Play Store &nbsp;•&nbsp; Web &nbsp;•&nbsp; Firebase &nbsp;•&nbsp; AWS
        </span>
      </div>

      {/* ─── SERVICES ─── */}
      <section id="services" className="max-w-[1200px] mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-purple-500 uppercase tracking-[2px] mb-3">Services</p>
          <h2 className="text-[clamp(28px,4vw,48px)] font-extrabold tracking-tight mb-4">Everything you need to launch</h2>
          <p className="text-base md:text-lg text-white/35 max-w-[500px] mx-auto">End-to-end development — from UI design to production deployment.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s, i) => (
            <div key={i} className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-7 md:p-8 transition-all duration-400 hover:border-purple-500/30 hover:bg-white/[0.05] hover:-translate-y-1 cursor-default">
              <div className="text-[40px] mb-4">{s.icon}</div>
              <h3 className="text-lg md:text-xl font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-white/35 leading-relaxed mb-5">{s.desc}</p>
              {s.features.map((f, j) => (
                <div key={j} className="flex items-center gap-2 mb-2">
                  <span className="text-green-500 text-sm">✓</span>
                  <span className="text-[13px] text-white/45">{f}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ─── PORTFOLIO (Updated with Phone Mockups) ─── */}
      <section id="portfolio" className="bg-purple-500/[0.03]">
        <div className="max-w-[1200px] mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-purple-500 uppercase tracking-[2px] mb-3">Portfolio</p>
            <h2 className="text-[clamp(28px,4vw,48px)] font-extrabold tracking-tight mb-4">Live apps. Real users. Real proof.</h2>
            <p className="text-base md:text-lg text-white/35 max-w-[500px] mx-auto">Not mockups or demos — these are in production right now.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {apps.map((app, i) => (
              <div key={i} className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-400 hover:border-purple-500/30 hover:bg-white/[0.05] hover:-translate-y-1">
                <div className={`h-1 bg-gradient-to-r ${app.color}`} />
                <div className="p-6 md:p-7 flex gap-5">
                  {/* Phone Mockup */}
                  <div className="hidden sm:block">
                    <PhoneMockup gradient={app.color} appName={app.name} screens={app.screens} />
                  </div>
                  {/* App Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl md:text-[22px] font-bold">{app.name}</h3>
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-green-500/15 text-green-400 border border-green-500/20 whitespace-nowrap">
                        {app.users} users
                      </span>
                    </div>
                    <p className="text-sm text-white/35 leading-relaxed mb-4">{app.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {app.tags.map((t, j) => (
                        <span key={j} className="px-3 py-1 rounded-full text-[12px] font-medium bg-purple-500/15 text-purple-300 border border-purple-500/20">{t}</span>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      <a href={app.ios} target="_blank" rel="noopener noreferrer" className="text-[13px] font-medium text-purple-400 hover:text-purple-300 transition-colors">App Store ↗</a>
                      <a href={app.android} target="_blank" rel="noopener noreferrer" className="text-[13px] font-medium text-purple-400 hover:text-purple-300 transition-colors">Play Store ↗</a>
                      {app.web && <a href={app.web} target="_blank" rel="noopener noreferrer" className="text-[13px] font-medium text-purple-400 hover:text-purple-300 transition-colors">Website ↗</a>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AGENTS ─── */}
      <section id="agents" className="max-w-[1200px] mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-purple-500 uppercase tracking-[2px] mb-3">Agents</p>
          <h2 className="text-[clamp(28px,4vw,48px)] font-extrabold tracking-tight mb-4">AI Agents. Running while I sleep.</h2>
          <p className="text-base md:text-lg text-white/35 max-w-[560px] mx-auto">Not just apps — autonomous systems that trade, write, post, and hunt for jobs 24/7 without me touching them.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {agents.map((agent, i) => (
            <div key={i} className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-400 hover:border-purple-500/30 hover:bg-white/[0.05] hover:-translate-y-1">
              <div className={`h-1 bg-gradient-to-r ${agent.color}`} />
              <div className="p-6 md:p-7">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        agent.statusColor === 'green' ? 'bg-green-400 animate-pulse' :
                        agent.statusColor === 'blue' ? 'bg-blue-400 animate-pulse' :
                        'bg-purple-400 animate-pulse'
                      }`} />
                      <span className={`text-[11px] font-semibold uppercase tracking-wider ${
                        agent.statusColor === 'green' ? 'text-green-400' :
                        agent.statusColor === 'blue' ? 'text-blue-400' :
                        'text-purple-400'
                      }`}>{agent.status}</span>
                    </div>
                    <h3 className="text-xl font-bold">{agent.name}</h3>
                  </div>
                  <span className="text-2xl">🤖</span>
                </div>

                {/* Description */}
                <p className="text-sm text-white/35 leading-relaxed mb-5">{agent.desc}</p>

                {/* Stats grid */}
                <div className="grid grid-cols-4 gap-2 mb-5 p-3 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                  {agent.stats.map((s, j) => (
                    <div key={j} className="text-center">
                      <div className={`text-base font-extrabold bg-gradient-to-r ${agent.color} bg-clip-text text-transparent`}>{s.value}</div>
                      <div className="text-[10px] text-white/25 mt-0.5 leading-tight">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Tech stack tags */}
                <div className="flex flex-wrap gap-1.5">
                  {agent.tags.map((t, j) => (
                    <span key={j} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/[0.05] text-white/40 border border-white/[0.07]">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PROCESS ─── */}
      <section className="max-w-[1200px] mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-purple-500 uppercase tracking-[2px] mb-3">Process</p>
          <h2 className="text-[clamp(28px,4vw,48px)] font-extrabold tracking-tight">Idea to App Store in 4 steps</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { num: '01', title: 'Discovery Call', desc: 'Free 15-30 min consultation to understand your vision and goals.', icon: '🎯' },
            { num: '02', title: 'Proposal & Plan', desc: 'Detailed quote with timeline, milestones and deliverables in 24 hours.', icon: '📋' },
            { num: '03', title: 'Build & Iterate', desc: "Weekly updates and demos. You're involved at every step of development.", icon: '⚡' },
            { num: '04', title: 'Launch & Grow', desc: 'App Store deployment, QA testing, and ongoing support included.', icon: '🚀' },
          ].map((step, i) => (
            <div key={i} className="text-center py-6 px-4 md:py-8 md:px-6">
              <div className="text-4xl md:text-5xl mb-3">{step.icon}</div>
              <span className="text-[12px] font-bold text-purple-500 tracking-[2px]">{step.num}</span>
              <h3 className="text-base md:text-lg font-bold my-2">{step.title}</h3>
              <p className="text-xs md:text-sm text-white/35 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="bg-purple-500/[0.03]">
        <div className="max-w-[1200px] mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-purple-500 uppercase tracking-[2px] mb-3">Pricing</p>
            <h2 className="text-[clamp(28px,4vw,48px)] font-extrabold tracking-tight mb-4">Transparent pricing. No surprises.</h2>
            <p className="text-base text-white/35">50% upfront, 50% on delivery. All prices in USD.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 items-start">
            {pricing.map((p, i) => (
              <div key={i} className={`rounded-3xl p-7 md:p-9 relative overflow-hidden transition-all duration-400 ${
                p.highlight
                  ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/40 md:scale-[1.03] shadow-[0_0_30px_rgba(139,92,246,0.2)]'
                  : 'bg-white/[0.03] border border-white/[0.06] hover:border-purple-500/20'
              }`}>
                {p.highlight && (
                  <div className="absolute top-4 right-4 px-3.5 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-[11px] font-bold tracking-wider uppercase">
                    Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold text-white/50 mb-1">{p.name}</h3>
                <div className="text-4xl md:text-5xl font-extrabold tracking-tight mb-1">${p.price}</div>
                <p className="text-sm text-white/25 mb-7">{p.sub}</p>
                <div className="border-t border-white/[0.06] pt-6 mb-7">
                  {p.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2.5 mb-3">
                      <span className={`text-sm ${p.highlight ? 'text-purple-400' : 'text-green-500'}`}>✓</span>
                      <span className="text-sm text-white/45">{f}</span>
                    </div>
                  ))}
                </div>
                <a href="#contact" className={`block text-center rounded-full font-bold text-sm py-3.5 px-6 transition-all hover:-translate-y-0.5 ${
                  p.highlight
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/40'
                    : 'bg-white/5 border border-white/15 text-white hover:bg-white/10'
                }`}>
                  Get Started →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REAL SOCIAL PROOF (Replaced fake testimonials) ─── */}
      <section className="max-w-[1200px] mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-purple-500 uppercase tracking-[2px] mb-3">Proof</p>
          <h2 className="text-[clamp(28px,4vw,48px)] font-extrabold tracking-tight mb-4">Results speak louder than words</h2>
          <p className="text-base md:text-lg text-white/35 max-w-[500px] mx-auto">Real numbers from real apps — verified on the App Store and Google Play.</p>
        </div>

        {/* Results Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {/* Result Card 1 */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-7 hover:border-purple-500/30 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center text-lg font-bold">F</div>
              <div>
                <div className="text-sm font-bold">FarahGPT</div>
                <div className="text-[11px] text-white/30">AI Islamic Education</div>
              </div>
            </div>
            <div className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">2,100+</div>
            <p className="text-sm text-white/40 leading-relaxed">Active users and growing. Built from scratch with 7 AI personalities, habit tracking, subscription model via RevenueCat, and a full RAG chat system.</p>
            <div className="mt-4 flex gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-green-500/15 text-green-400 border border-green-500/20">iOS Live</span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-green-500/15 text-green-400 border border-green-500/20">Android Live</span>
            </div>
          </div>

          {/* Result Card 2 */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-7 hover:border-purple-500/30 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-lg font-bold">M</div>
              <div>
                <div className="text-sm font-bold">Muslifie</div>
                <div className="text-[11px] text-white/30">Travel Marketplace</div>
              </div>
            </div>
            <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">Full Platform</div>
            <p className="text-sm text-white/40 leading-relaxed">Complete marketplace with Stripe Connect payments, real-time chat, 70+ language translations, guide verification system, and a Next.js admin panel.</p>
            <div className="mt-4 flex gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-green-500/15 text-green-400 border border-green-500/20">iOS Live</span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-green-500/15 text-green-400 border border-green-500/20">Android Live</span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/20">Web Live</span>
            </div>
          </div>

          {/* Result Card 3 */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-7 hover:border-purple-500/30 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-lg font-bold">A</div>
              <div>
                <div className="text-sm font-bold">MyAiPal</div>
                <div className="text-[11px] text-white/30">AI Wellness Companion</div>
              </div>
            </div>
            <div className="text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">AI-Powered</div>
            <p className="text-sm text-white/40 leading-relaxed">Wellness app with OpenAI integration, journaling system, personalized guidance, and a full subscription model. Live on both app stores.</p>
            <div className="mt-4 flex gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-green-500/15 text-green-400 border border-green-500/20">iOS Live</span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-green-500/15 text-green-400 border border-green-500/20">Android Live</span>
            </div>
          </div>
        </div>

        {/* Verification Banner */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
          <div className="text-2xl">🔍</div>
          <div>
            <p className="text-sm font-semibold text-white/60">Don&apos;t take my word for it — verify everything yourself</p>
            <p className="text-[13px] text-white/30 mt-1">Every app listed above is live and searchable on the Apple App Store and Google Play Store right now.</p>
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contact" className="bg-purple-500/[0.03]">
        <div className="max-w-[700px] mx-auto px-6 py-24">
          <div className="text-center mb-12">
            <h2 className="text-[clamp(28px,4vw,48px)] font-extrabold tracking-tight mb-4">
              Let&apos;s build something{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_3s_linear_infinite]">
                incredible.
              </span>
            </h2>
            <p className="text-base md:text-lg text-white/35">Book a free 15-minute consultation. No commitment.</p>
          </div>

          {formState.succeeded ? (
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-3xl p-12 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
              <p className="text-white/35">I&apos;ll get back to you within 2 hours via WhatsApp or email.</p>
            </div>
          ) : (
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-3xl p-7 md:p-9">
              <form onSubmit={handleFormSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="Your Name"
                      className="w-full px-[18px] py-3.5 rounded-xl border border-white/10 bg-white/5 text-white text-[15px] outline-none focus:border-purple-500/50 transition-colors placeholder:text-white/25"
                    />
                    <ValidationError prefix="Name" field="name" errors={formState.errors} className="text-red-400 text-sm mt-1" />
                  </div>
                  <div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="Email Address"
                      className="w-full px-[18px] py-3.5 rounded-xl border border-white/10 bg-white/5 text-white text-[15px] outline-none focus:border-purple-500/50 transition-colors placeholder:text-white/25"
                    />
                    <ValidationError prefix="Email" field="email" errors={formState.errors} className="text-red-400 text-sm mt-1" />
                  </div>
                </div>
                <div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="WhatsApp / Phone Number"
                    className="w-full px-[18px] py-3.5 rounded-xl border border-white/10 bg-white/5 text-white text-[15px] outline-none focus:border-purple-500/50 transition-colors placeholder:text-white/25"
                  />
                </div>
                {/* Budget Range Selector */}
                <div>
                  <select
                    id="budget"
                    name="budget"
                    className="w-full px-[18px] py-3.5 rounded-xl border border-white/10 bg-white/5 text-white text-[15px] outline-none focus:border-purple-500/50 transition-colors appearance-none"
                    defaultValue=""
                    style={{ color: 'rgba(255,255,255,0.25)' }}
                    onFocus={(e) => { e.target.style.color = 'white'; }}
                    onChange={(e) => { e.target.style.color = e.target.value ? 'white' : 'rgba(255,255,255,0.25)'; }}
                  >
                    <option value="" disabled>Select your budget range</option>
                    <option value="under-3k" style={{ color: 'white', backgroundColor: '#0a0d18' }}>Under $3,000</option>
                    <option value="3k-6k" style={{ color: 'white', backgroundColor: '#0a0d18' }}>$3,000 – $6,000</option>
                    <option value="6k-12k" style={{ color: 'white', backgroundColor: '#0a0d18' }}>$6,000 – $12,000</option>
                    <option value="12k-plus" style={{ color: 'white', backgroundColor: '#0a0d18' }}>$12,000+</option>
                    <option value="not-sure" style={{ color: 'white', backgroundColor: '#0a0d18' }}>Not sure yet</option>
                  </select>
                </div>
                <div>
                  <textarea
                    id="message"
                    name="message"
                    required
                    placeholder="Tell me about your app idea..."
                    rows={4}
                    className="w-full px-[18px] py-3.5 rounded-xl border border-white/10 bg-white/5 text-white text-[15px] outline-none focus:border-purple-500/50 transition-colors placeholder:text-white/25 resize-y"
                  />
                  <ValidationError prefix="Message" field="message" errors={formState.errors} className="text-red-400 text-sm mt-1" />
                </div>
                <button
                  type="submit"
                  disabled={formState.submitting}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-full font-bold text-base hover:shadow-2xl hover:shadow-purple-500/40 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {formState.submitting ? 'Sending...' : 'Send Message →'}
                </button>
              </form>
              <p className="text-center text-[13px] text-white/25 mt-3">⚡ Average response time: Under 2 hours</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-extrabold text-base">U</div>
            <span className="font-bold">Dev.Umair</span>
          </div>
          <div className="flex gap-6">
            <a href="mailto:umairbilal207@gmail.com" className="text-[13px] text-white/30 hover:text-purple-400 transition-colors">Email</a>
            <a href="https://www.linkedin.com/in/umair-bilal-/" target="_blank" rel="noopener noreferrer" className="text-[13px] text-white/30 hover:text-purple-400 transition-colors">LinkedIn</a>
            <a href="https://github.com/umair24171" target="_blank" rel="noopener noreferrer" className="text-[13px] text-white/30 hover:text-purple-400 transition-colors">GitHub</a>
          </div>
          <p className="text-[12px] text-white/15">© 2026 Dev.Umair. All rights reserved.</p>
        </div>
      </footer>

      {/* ─── WHATSAPP FLOATING BUTTON ─── */}
      <WhatsAppButton />
    </div>
  );
}