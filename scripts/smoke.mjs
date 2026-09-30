import assert from 'node:assert/strict';
const base = process.env.SMOKE_URL || 'http://127.0.0.1:3100';
const routes = ['/', '/about', '/work', '/work/muslifie', '/work/myaipal', '/work/farahgpt', '/work/voisbe', '/services/mobile-app-development', '/services/saas-product-development', '/services/ai-workflow-integration', '/services/product-improvement', '/privacy', '/labs', '/flutter-app-cost', '/blog', '/blog/firebase-performance-optimization'];
for (const route of routes) {
  const r = await fetch(base + route); const html = await r.text();
  assert.equal(r.status,200,route);
  assert.equal((html.match(/<h1\b/g)||[]).length,1,`Single H1: ${route}`);
  assert.ok(html.includes('id="main-content"'),route);
  assert.ok(html.includes('rel="canonical"'),`Canonical: ${route}`);
  assert.ok(!html.includes('https://yourwebsite.com'),route);
}
for (const slug of ['fixing-claude-opus-55-video-api-drift-40-scene-consistency','how-i-cut-llm-costs-90-with-multi-llm-chatroom-cli-agents']) assert.equal((await fetch(`${base}/blog/${slug}`)).status,404,slug);
const redirect=await fetch(`${base}/blog/flutter-vs-react-native-ai-apps-my-2026-take`,{redirect:'manual'});
assert.equal(redirect.status,308); assert.ok(redirect.headers.get('location').endsWith('/blog/flutter-vs-react-native-ai-app-2026-pick-the-right-stack'));
const sitemap=await (await fetch(`${base}/sitemap.xml`)).text();
assert.ok(sitemap.includes('/about')); assert.ok(sitemap.includes('/services/ai-workflow-integration')); assert.ok(!sitemap.includes('flutter-vs-react-native-ai-apps-my-2026-take')); assert.ok(!sitemap.includes('fixing-claude-opus-55-video-api-drift-40-scene-consistency'));
const api=await (await fetch(`${base}/api/posts`)).json(); assert.equal(api.length,3);
const search=await (await fetch(`${base}/blog?q=not-an-existing-article-unique-test`)).text(); assert.ok(search.includes('No matching articles'));
const og=await fetch(`${base}/opengraph-image`); assert.equal(og.status,200); assert.ok(og.headers.get('content-type').startsWith('image/'));
console.log(`Passed: ${routes.length} main routes, quarantined routes, canonical redirect, sitemap, article API, empty search and social image.`);
