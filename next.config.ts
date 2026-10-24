import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  outputFileTracingIncludes: { '/api/ops/*': ['./agent/business.json', './agent/topics.json', './content/business/projects.json', './content/posts/**/*'] },
  async headers() {
    return [{source:'/ops/:path*',headers:[{key:'X-Robots-Tag',value:'noindex, nofollow'},{key:'Cache-Control',value:'private, no-store'}]},{source:'/api/ops/:path*',headers:[{key:'X-Robots-Tag',value:'noindex, nofollow'},{key:'Cache-Control',value:'private, no-store'}]},{ source: '/:path*', headers: [
      // Observation phase only. No reporting endpoint collects visitor data.
      { key: 'Content-Security-Policy-Report-Only', value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.google-analytics.com https://www.googletagmanager.com; font-src 'self'; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'" },
      { key: 'X-Content-Type-Options' , value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ] }];
  },
  async redirects() {
    // Retired offerings lead to the current service overview, not a fabricated replacement case study.
    const routes: [string, string][] = [
      ['/flutter-app-cost', '/pricing'], ['/labs', '/work'], ['/portfolio', '/work'], ['/og-image.png', '/opengraph-image'],
      ['/services/mobile-app-development', '/services'], ['/services/saas-product-development', '/services'],
      ['/services/ai-workflow-integration', '/services/ai-agents'], ['/services/product-improvement', '/services/automation-repair'],
      ...['muslifie', 'myaipal', 'farahgpt', 'voisbe'].map(slug => [`/work/${slug}`, '/work'] as [string, string]),
    ];
    // Unreviewed legacy articles return 404 and stay out of sitemap/API. No blanket unrelated blog redirects.
    return [...['buildzn.com', 'devumair.vercel.app'].map(host => ({ source: '/:path*', has: [{ type: 'host' as const, value: host }], destination: 'https://www.buildzn.com/:path*', permanent: true })), ...routes.map(([source, destination]) => ({ source, destination, permanent: true }))];
  },
};
export default nextConfig;
