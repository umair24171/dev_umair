import assert from 'node:assert/strict';
const base = process.env.SMOKE_URL || 'http://127.0.0.1:3100';
const routes = ['/', '/about', '/work', '/work/inquiry-assistant', '/work/support-assistant', '/work/document-processing', '/services', '/services/workflow-automation', '/services/ai-agents', '/services/api-integrations', '/services/automation-repair', '/privacy', '/pricing', '/contact', '/blog', '/blog/ai-workflow-scope-human-review', '/blog/automation-operating-costs', '/blog/automation-validation-before-export', '/blog/n8n-webhook-not-working', '/blog/ai-blog-writer-duplicate-topics', '/blog/agent-kill-boundary', ...['nexusos-agent-operations','content-production-pipeline','video-production-pipeline','seo-content-agent','buildzn-web-platform'].map(s=>`/work/${s}`)];
for (const route of routes) {
  const r = await fetch(base + route); const html = await r.text();
  assert.equal(r.status,200,route); assert.equal((html.match(/<h1\b/g)||[]).length,1,`Single H1: ${route}`);
  assert.ok(html.includes('id="main-content"'),route); assert.ok(html.includes('rel="canonical"'),`Canonical: ${route}`);
  assert.ok(!/Flutter|mobile app|App Store|20\+ Apps/.test(html),`Legacy positioning: ${route}`);
  assert.ok(!html.includes('https://yourwebsite.com'),route);
}
for (const slug of ['mobile-mvp-scope-before-screen-count','firebase-performance-optimization','flutter-vs-react-native-ai-apps-my-2026-take','fixing-claude-opus-55-video-api-drift-40-scene-consistency']) {
  const r=await fetch(`${base}/blog/${slug}`); assert.equal(r.status,404,slug);
  assert.ok((await r.text()).includes('noindex'),`Retired URL not noindexed: ${slug}`);
}
for (const [source,destination] of [['/flutter-app-cost','/pricing'],['/work/muslifie','/work'],['/services/mobile-app-development','/services'],['/services/ai-workflow-integration','/services/ai-agents'],['/labs','/work']]) {
  const r=await fetch(base+source,{redirect:'manual'}); assert.equal(r.status,308,source); assert.ok(r.headers.get('location').endsWith(destination),source);
}
const sitemap=await (await fetch(`${base}/sitemap.xml`)).text();
assert.ok(sitemap.includes('/work/document-processing')); assert.ok(sitemap.includes('/services/api-integrations')); assert.ok(!/flutter|myaipal|muslifie|firebase-performance/.test(sitemap));
const api=await (await fetch(`${base}/api/posts`)).json(); assert.equal(api.length,3); assert.ok(!/flutter|mobile/.test(JSON.stringify(api)));
const search=await (await fetch(`${base}/blog?q=not-an-existing-article-unique-test`)).text(); assert.ok(search.includes('No matching articles'));
for (const path of ['/opengraph-image', '/blog/ai-workflow-scope-human-review/opengraph-image', ...['inquiry-assistant','support-assistant','document-processing','nexusos-agent-operations','content-production-pipeline','video-production-pipeline','seo-content-agent','buildzn-web-platform'].map(s=>`/demos/${s}.png`)]) {
  const r=await fetch(base+path); assert.equal(r.status,200,path); assert.ok(r.headers.get('content-type').startsWith('image/'),path); await r.arrayBuffer();
}
assert.equal((await fetch(`${base}/muslifie-app.png`)).status,404);
console.log(`Passed: ${routes.length} public routes, retired articles, permanent redirects, sitemap, article API, search, real screenshots and social images.`);
