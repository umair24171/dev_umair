// ─────────────────────────────────────────────
//  Blog Writer Agent — Dev.Umair Personal Brand
//  Gemini writes post → commits to GitHub → Vercel auto-deploys
//  Run: node agent/blog-writer.js
//  Schedule: GitHub Actions 3x/week
// ─────────────────────────────────────────────

import { GoogleGenerativeAI } from '@google/generative-ai';
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
dotenv.config();

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const REPO_OWNER = process.env.GITHUB_OWNER;   // e.g. umair24171
const REPO_NAME  = process.env.GITHUB_REPO;    // e.g. portfolio
const BRANCH     = 'main';

// ─── Topic pools — rotate through these ───
const TOPIC_POOLS = [
  // Flutter & Mobile
  { topic: 'Flutter performance tips for production apps', tags: ['Flutter', 'Performance', 'Mobile'], gradient: 'from-blue-500 to-cyan-400' },
  { topic: 'How to implement RevenueCat subscriptions in Flutter', tags: ['Flutter', 'RevenueCat', 'Monetization'], gradient: 'from-purple-500 to-pink-400' },
  { topic: 'Firebase vs Supabase for Flutter apps in 2026', tags: ['Flutter', 'Firebase', 'Backend'], gradient: 'from-orange-500 to-yellow-400' },
  { topic: 'App Store rejection reasons and how to avoid them', tags: ['App Store', 'iOS', 'Flutter'], gradient: 'from-red-500 to-rose-400' },
  { topic: 'Building real-time chat in Flutter with Firestore', tags: ['Flutter', 'Firebase', 'Chat'], gradient: 'from-cyan-500 to-blue-400' },
  { topic: 'How to add AI chat to any Flutter app using Claude API', tags: ['Flutter', 'AI', 'Claude'], gradient: 'from-violet-500 to-purple-400' },
  { topic: 'Flutter state management showdown: Riverpod vs Bloc vs GetX', tags: ['Flutter', 'State Management'], gradient: 'from-green-500 to-emerald-400' },
  { topic: 'Stripe Connect integration lessons from building Muslifie', tags: ['Flutter', 'Stripe', 'Payments'], gradient: 'from-indigo-500 to-blue-400' },
  // Indie Dev & Business
  { topic: 'How I shipped 15 apps in 3 years as a solo developer', tags: ['Indie Dev', 'Flutter', 'Career'], gradient: 'from-pink-500 to-rose-400' },
  { topic: 'Getting your first 1000 app users without spending on ads', tags: ['Growth', 'Mobile', 'Marketing'], gradient: 'from-yellow-500 to-orange-400' },
  { topic: 'Freelancing as a Flutter developer: what actually works', tags: ['Freelancing', 'Career', 'Flutter'], gradient: 'from-teal-500 to-cyan-400' },
  // AI & Tech
  { topic: 'Building a RAG system for a mobile app — lessons learned', tags: ['AI', 'RAG', 'Flutter'], gradient: 'from-purple-500 to-indigo-400' },
  { topic: 'How I automated my content strategy with AI agents', tags: ['AI', 'Automation', 'Node.js'], gradient: 'from-fuchsia-500 to-pink-400' },
];

// ─── Pick a topic that hasn't been posted recently ───
async function pickTopic() {
  let existingTitles = [];
  try {
    const { data } = await octokit.repos.getContent({
      owner: REPO_OWNER, repo: REPO_NAME,
      path: 'content/posts', ref: BRANCH,
    });
    if (Array.isArray(data)) {
      existingTitles = data.map(f => f.name.replace(/\.(md|mdx)$/, '').toLowerCase());
    }
  } catch { /* posts folder might be empty */ }

  const unused = TOPIC_POOLS.filter(t => {
    const slug = t.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50);
    return !existingTitles.some(e => e.includes(slug.substring(0, 20)));
  });

  const pool = unused.length > 0 ? unused : TOPIC_POOLS;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ─── Generate blog post with Gemini ───
async function generatePost(topicData) {
  const model = gemini.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are Umair Bilal, a Senior Flutter developer from Pakistan with 3+ years experience.
You've shipped 15+ production apps including:
- Muslifie: Muslim travel marketplace with Stripe Connect, real-time chat, 70+ languages
- FarahGPT: AI Islamic education app with 5100+ users, 7 AI personalities, RevenueCat subscriptions
- MyAiPal: AI wellness app with OpenAI integration

Write a detailed, practical blog post about: "${topicData.topic}"

REQUIREMENTS:
- Write from REAL personal experience — mention specific problems you faced, real numbers, real code
- Include actual code snippets where relevant (Flutter/Dart or Node.js)
- Conversational but expert tone — like a senior dev talking to another dev
- No fluff, no obvious advice — give the hard-won lessons
- Length: 800-1200 words
- Structure: Problem → What I tried → What actually worked → Results → Key takeaway

Return ONLY valid JSON with this exact structure:
{
  "title": "exact blog post title",
  "excerpt": "2 sentence summary for SEO meta description, max 160 chars",
  "readTime": "X min read",
  "content": "full markdown content here with ## headings, code blocks, etc"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Gemini did not return valid JSON');

  return JSON.parse(jsonMatch[0]);
}

// ─── Create slug from title ───
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60)
    .replace(/-$/, '');
}

// ─── Commit file to GitHub ───
async function commitToGitHub(slug, content) {
  const filePath = `content/posts/${slug}.md`;

  let sha;
  try {
    const { data } = await octokit.repos.getContent({
      owner: REPO_OWNER, repo: REPO_NAME, path: filePath, ref: BRANCH,
    });
    sha = data.sha;
  } catch { /* new file */ }

  const encoded = Buffer.from(content).toString('base64');

  await octokit.repos.createOrUpdateFileContents({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    path: filePath,
    message: `blog: add post — ${slug}`,
    content: encoded,
    branch: BRANCH,
    ...(sha ? { sha } : {}),
  });

  console.log(`✅ Committed: ${filePath}`);
  return filePath;
}

// ─── Send Discord notification ───
async function notifyDiscord(title, slug) {
  if (!process.env.DISCORD_WEBHOOK_URL) return;

  await fetch(process.env.DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      embeds: [{
        title: '📝 New Blog Post Published!',
        description: `**${title}**`,
        color: 0x8B5CF6,
        fields: [
          { name: '🔗 URL', value: `https://devumair.vercel.app/blog/${slug}` },
          { name: '⚡ Status', value: 'Deploying via Vercel (2-3 min)' }
        ],
        footer: { text: 'Dev.Umair Blog Agent' }
      }]
    }),
  });
}

// ─── Main pipeline ───
async function run() {
  try {
    console.log('🚀 Blog Writer Agent starting...');

    // 1. Pick topic
    const topicData = await pickTopic();
    console.log(`📌 Topic: ${topicData.topic}`);

    // 2. Generate post with Gemini
    console.log('✍️  Generating post with Gemini...');
    const post = await generatePost(topicData);
    console.log(`✅ Generated: "${post.title}"`);

    // 3. Build MDX frontmatter
    const slug = slugify(post.title);
    const today = new Date().toISOString().split('T')[0];

    const fileContent = `---
title: "${post.title.replace(/"/g, "'")}"
excerpt: "${post.excerpt.replace(/"/g, "'")}"
date: "${today}"
tags: [${topicData.tags.map(t => `"${t}"`).join(', ')}]
readTime: "${post.readTime}"
coverGradient: "${topicData.gradient}"
---

${post.content}`;

    // 4. Commit to GitHub → triggers Vercel deploy
    await commitToGitHub(slug, fileContent);

    // 5. Notify Discord
    await notifyDiscord(post.title, slug);

    console.log(`\n🎉 Done! Post live in ~2 min: https://devumair.vercel.app/blog/${slug}`);

  } catch (err) {
    console.error('❌ Agent error:', err.message);
    process.exit(1);
  }
}

run();
