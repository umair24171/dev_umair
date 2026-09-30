import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
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
    return routes.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};
export default nextConfig;
