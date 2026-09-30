import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { getAllPosts, getPostBySlug } from '../.test-build/lib/posts.js';
import { renderMarkdown } from '../.test-build/lib/markdown.js';

test('quarantined articles and redirected duplicates are not public', () => {
  const slugs = getAllPosts().map(p => p.slug);
  for (const slug of ['fixing-claude-opus-55-video-api-drift-40-scene-consistency', 'how-i-cut-llm-costs-90-with-multi-llm-chatroom-cli-agents', 'flutter-vs-react-native-ai-apps-my-2026-take']) {
    assert.equal(getPostBySlug(slug), null);
    assert.ok(!slugs.includes(slug));
  }
  assert.ok(!slugs.includes('flutter-vs-react-native-ai-app-2026-pick-the-right-stack'));
  assert.ok(slugs.includes('ai-workflow-scope-human-review'));
  assert.equal(slugs.length, 6);
});
test('drafts, invalid dates and traversal paths cannot be served', () => {
  const file = 'content/posts/editorial-test-fixture.md';
  try {
    fs.writeFileSync(file, '---\ntitle: Draft\ndate: "2026-10-01"\nstatus: draft\n---\nNot published');
    assert.equal(getPostBySlug('editorial-test-fixture'), null);
    fs.writeFileSync(file, '---\ntitle: Invalid\ndate: invalid\nstatus: published\nreviewed: true\n---\nNot published');
    assert.equal(getPostBySlug('editorial-test-fixture'), null);
    assert.equal(getPostBySlug('../../README'), null);
  } finally { fs.rmSync(file, { force: true }); }
});
test('unsafe markdown HTML and destinations do not execute', () => {
  const html = renderMarkdown('<script>alert(1)</script>\n\n[unsafe](javascript:alert%281%29)\n\n[safe](https://www.buildzn.com/#contact)\n\n![unsafe](data:text/html;base64,abc)');
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('href="javascript:'));
  assert.ok(!html.includes('src="data:'));
  assert.ok(html.includes('href="https://www.buildzn.com/#contact"'));
});
test('published articles have clean metadata and commercial destinations', () => {
  for (const post of getAllPosts()) {
    const article = getPostBySlug(post.slug);
    assert.ok(post.title && post.excerpt && !Number.isNaN(Date.parse(post.date)), post.slug);
    assert.ok(!/https?:\/\/(?:yourwebsite\.com|your-calendly-link\.com|example\.com\/book-umair-call)/.test(article.content), post.slug);
    assert.ok(!/^# /m.test(article.content), `Duplicate H1: ${post.slug}`);
  }
});

test('portfolio evidence separates interactive sample flows from documented builds',()=>{
 const projects=JSON.parse(fs.readFileSync('content/business/projects.json','utf8'));
 assert.equal(projects.filter(p=>p.kind==='demo').length,3);assert.equal(projects.filter(p=>p.kind==='build').length,5);
 for(const project of projects) {
  assert.ok(project.limitations && project.scope && project.proof,project.slug);assert.ok(fs.existsSync('public'+project.image),project.slug);
  if(project.kind==='build') {assert.ok(project.sources.length>0,project.slug);assert.ok(project.capture.includes('not a screenshot of a connected production account'),project.slug);for(const source of project.sources) assert.match(source.url,/^https:\/\/github.com\/umair24171\//);}
 }
});
