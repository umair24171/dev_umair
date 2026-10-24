import assert from 'node:assert/strict';
const base = process.env.SMOKE_URL || 'http://127.0.0.1:3101';
const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
for (const url of urls) {
  if (!base.includes('127.0.0.1')) await new Promise(resolve => setTimeout(resolve, 1000));
  const path = new URL(url).pathname;
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, path);
  assert.ok(html.includes(`rel="canonical" href="${url}"`), path);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].flatMap(match => { const schema = JSON.parse(match[1]); return schema['@graph'] || [schema]; });
  const org = schemas.find(item => item['@type'] === 'Organization');
  const person = schemas.find(item => item['@type'] === 'Person');
  assert.ok(!org.sameAs?.some(url => url.includes('/in/') || url.includes('umair24171')), path);
  assert.ok(person.sameAs.includes('https://github.com/umair24171'), path);
  if (/^\/services\//.test(path)) {
    for (const phrase of ['Illustrative scope:', 'Acceptance and failure checks', 'Outside this example', 'BreadcrumbList']) assert.ok(html.includes(phrase), `${path}: ${phrase}`);
    assert.match(html, /href="\/blog\//);
  }
  assert.ok(response.headers.get('content-security-policy-report-only'), path);
}
console.log(`SEO release checks passed for all ${urls.length} canonical sitemap pages.`);
