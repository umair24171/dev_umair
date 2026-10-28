const demos = ['inquiry-assistant', 'support-assistant', 'document-processing'];
const serviceNames: Record<string, string> = { 'Workflow automation': 'workflow-automation', 'AI agents': 'ai-agents', 'API integrations': 'api-integrations', 'Automation repair': 'automation-repair' };
const serviceSlugs = Object.values(serviceNames);
export function analyticsService(value: string) { return serviceNames[value] || (serviceSlugs.includes(value) ? value : 'unspecified'); }
export function analyticsParameters(pathname: string, input: Record<string, string> = {}) {
  const fixedPages = ['/', '/about', '/blog', '/contact', '/pricing', '/privacy', '/security', '/evidence', '/samples', '/services', '/work'];
  const page = fixedPages.includes(pathname) ? pathname
    : pathname.startsWith('/blog/') ? '/blog/[slug]'
    : serviceSlugs.some(s => pathname === '/services/' + s) ? pathname
    : pathname.startsWith('/work/agents/') ? '/work/agents/[slug]'
    : pathname.startsWith('/work/') ? '/work/[slug]'
    : pathname.startsWith('/samples/') ? '/samples/[slug]' : '/other';
  const pathDemo = pathname.split('/').pop() || '';
  const demo = demos.includes(input.demo) ? input.demo : demos.includes(pathDemo) ? pathDemo : 'none';
  const service = analyticsService(input.service || (pathname.startsWith('/services/') ? pathDemo : ''));
  return { page, demo, service };
}
