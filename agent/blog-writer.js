// ─────────────────────────────────────────────
//  Blog Writer Agent — Dev.Umair Personal Brand
//  SEO-first: keyword targeting + uniqueness guard + quality gate
//  Run: node agent/blog-writer.js
//  Schedule: GitHub Actions Mon/Wed/Fri
// ─────────────────────────────────────────────

import { GoogleGenerativeAI } from '@google/generative-ai';
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
dotenv.config();

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const REPO_OWNER = process.env.GITHUB_OWNER;
const REPO_NAME  = process.env.GITHUB_REPO;
const BRANCH     = 'main';
const REGISTRY_PATH = 'agent/published-topics.json'; // tracks what's been published

// ─── SEO-first topic pool ───
// Each entry has a primaryKeyword (exact search query), secondaryKeywords (LSI),
// searchIntent, and targetAudience so Gemini can write with ranking in mind.
const TOPIC_POOL = [
  {
    topic: 'Flutter performance optimization: from 5 seconds to under 100ms',
    primaryKeyword: 'flutter performance optimization',
    secondaryKeywords: ['flutter app slow', 'flutter rendering lag', 'flutter jank fix', 'flutter frame rate'],
    searchIntent: 'informational — developer trying to fix a slow Flutter app',
    targetAudience: 'Flutter developers with production apps',
    tags: ['Flutter', 'Performance', 'Firebase'],
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    topic: 'RevenueCat Flutter integration: subscriptions from scratch to App Store',
    primaryKeyword: 'revenuecat flutter integration',
    secondaryKeywords: ['flutter in-app purchases', 'flutter subscription model', 'revenuecat setup ios android'],
    searchIntent: 'navigational/how-to — developer wants to add subscriptions',
    targetAudience: 'Flutter indie developers monetizing apps',
    tags: ['Flutter', 'RevenueCat', 'Monetization'],
    gradient: 'from-purple-500 to-pink-400',
  },
  {
    topic: 'Firebase vs Supabase for Flutter: honest comparison in 2026',
    primaryKeyword: 'firebase vs supabase flutter',
    secondaryKeywords: ['flutter backend comparison', 'supabase flutter tutorial', 'firebase flutter 2026'],
    searchIntent: 'commercial — developer choosing a backend for new app',
    targetAudience: 'Flutter developers starting a new project',
    tags: ['Flutter', 'Firebase', 'Backend'],
    gradient: 'from-orange-500 to-yellow-400',
  },
  {
    topic: 'App Store rejection: 7 reasons my Flutter app got rejected and how I fixed them',
    primaryKeyword: 'app store rejection flutter',
    secondaryKeywords: ['apple app store review guidelines', 'flutter app rejected', 'app store submission tips'],
    searchIntent: 'informational — developer whose app just got rejected',
    targetAudience: 'Flutter developers submitting to App Store for first time',
    tags: ['App Store', 'iOS', 'Flutter'],
    gradient: 'from-red-500 to-rose-400',
  },
  {
    topic: 'Real-time chat Flutter Firestore: building production messaging in one week',
    primaryKeyword: 'real-time chat flutter firestore',
    secondaryKeywords: ['flutter chat app tutorial', 'firestore real-time updates', 'flutter messaging feature'],
    searchIntent: 'how-to — developer adding chat to an existing app',
    targetAudience: 'Flutter developers building social or marketplace apps',
    tags: ['Flutter', 'Firebase', 'Chat'],
    gradient: 'from-cyan-500 to-blue-400',
  },
  {
    topic: 'Flutter AI chatbot integration: adding Claude or GPT to any Flutter app',
    primaryKeyword: 'flutter ai chatbot integration',
    secondaryKeywords: ['flutter openai api', 'flutter claude api', 'flutter llm integration', 'ai flutter app'],
    searchIntent: 'how-to — developer adding an AI feature to their app',
    targetAudience: 'Flutter developers building AI-powered apps',
    tags: ['Flutter', 'AI', 'OpenAI'],
    gradient: 'from-violet-500 to-purple-400',
  },
  {
    topic: 'Riverpod vs Bloc vs GetX: which Flutter state management actually scales',
    primaryKeyword: 'flutter state management comparison 2026',
    secondaryKeywords: ['riverpod vs bloc', 'flutter getx vs riverpod', 'best state management flutter'],
    searchIntent: 'commercial — developer choosing state management for new project',
    targetAudience: 'Flutter developers scaling past MVP',
    tags: ['Flutter', 'State Management', 'Architecture'],
    gradient: 'from-green-500 to-emerald-400',
  },
  {
    topic: 'Stripe Connect Flutter: building a marketplace payment system from scratch',
    primaryKeyword: 'stripe connect flutter',
    secondaryKeywords: ['flutter stripe payments', 'flutter marketplace payments', 'stripe connect tutorial 2026'],
    searchIntent: 'how-to — developer building a two-sided marketplace',
    targetAudience: 'Flutter developers building marketplace or gig economy apps',
    tags: ['Flutter', 'Stripe', 'Payments'],
    gradient: 'from-indigo-500 to-blue-400',
  },
  {
    topic: 'Flutter app architecture: how I structure production apps with 20+ screens',
    primaryKeyword: 'flutter app architecture production',
    secondaryKeywords: ['flutter folder structure', 'flutter clean architecture', 'flutter project structure 2026'],
    searchIntent: 'informational — developer planning architecture for serious project',
    targetAudience: 'Intermediate Flutter developers building their first real app',
    tags: ['Flutter', 'Architecture', 'Clean Code'],
    gradient: 'from-slate-500 to-gray-400',
  },
  {
    topic: 'How to hire a Flutter developer: what to look for and red flags to avoid',
    primaryKeyword: 'hire flutter developer',
    secondaryKeywords: ['flutter developer for hire', 'flutter freelancer', 'how to find flutter developer'],
    searchIntent: 'commercial — startup or business looking to hire',
    targetAudience: 'Non-technical founders and product managers',
    tags: ['Flutter', 'Hiring', 'Freelancing'],
    gradient: 'from-amber-500 to-orange-400',
  },
  {
    topic: 'Flutter RAG system: building retrieval-augmented generation for mobile apps',
    primaryKeyword: 'flutter rag system',
    secondaryKeywords: ['rag mobile app flutter', 'retrieval augmented generation flutter', 'flutter vector search'],
    searchIntent: 'how-to — developer building AI-powered search or Q&A in mobile',
    targetAudience: 'Advanced Flutter developers building AI features',
    tags: ['Flutter', 'AI', 'RAG'],
    gradient: 'from-purple-500 to-indigo-400',
  },
  {
    topic: 'Flutter developer Pakistan: freelancing rates, clients, and lessons from 3 years',
    primaryKeyword: 'flutter developer pakistan',
    secondaryKeywords: ['flutter freelancer pakistan', 'flutter developer salary pakistan', 'hire flutter developer pakistan'],
    searchIntent: 'informational/commercial — companies searching for Pakistani dev talent',
    targetAudience: 'International clients + Pakistani developers',
    tags: ['Flutter', 'Career', 'Freelancing'],
    gradient: 'from-emerald-500 to-teal-400',
  },
  {
    topic: 'Getting first 1000 Flutter app users: what worked and what was a waste of time',
    primaryKeyword: 'flutter app user growth',
    secondaryKeywords: ['flutter app marketing', 'how to get app users', 'flutter app store optimization'],
    searchIntent: 'informational — indie developer struggling with user acquisition',
    targetAudience: 'Flutter indie developers post-launch',
    tags: ['Growth', 'Mobile', 'ASO'],
    gradient: 'from-yellow-500 to-orange-400',
  },
  {
    topic: 'Flutter offline support: Hive vs Isar vs SQLite for local storage in 2026',
    primaryKeyword: 'flutter local storage 2026',
    secondaryKeywords: ['flutter hive vs isar', 'flutter sqlite', 'flutter offline first'],
    searchIntent: 'commercial — developer choosing local storage solution',
    targetAudience: 'Flutter developers building apps that need offline support',
    tags: ['Flutter', 'Storage', 'Offline'],
    gradient: 'from-rose-500 to-pink-400',
  },
  {
    topic: 'Flutter push notifications: Firebase FCM setup that actually works in 2026',
    primaryKeyword: 'flutter push notifications firebase',
    secondaryKeywords: ['flutter fcm setup', 'firebase cloud messaging flutter', 'flutter notifications ios android'],
    searchIntent: 'how-to — developer setting up push notifications',
    targetAudience: 'Flutter developers adding engagement features',
    tags: ['Flutter', 'Firebase', 'Notifications'],
    gradient: 'from-cyan-500 to-teal-400',
  },
  // ─── Agent / Automation topics ───
  {
    topic: 'How I built a live gold trading bot that runs 24/7 on $7/month',
    primaryKeyword: 'automated trading bot nodejs',
    secondaryKeywords: ['xauusd trading bot', 'forex trading automation nodejs', 'algorithmic trading bot 2026'],
    searchIntent: 'informational — developer or trader curious about trading automation',
    targetAudience: 'Developers interested in fintech and trading automation',
    tags: ['Node.js', 'Trading', 'Automation', 'AI'],
    gradient: 'from-yellow-500 to-amber-400',
  },
  {
    topic: 'Building an AI content pipeline that posts to LinkedIn and Twitter automatically',
    primaryKeyword: 'ai content pipeline automation',
    secondaryKeywords: ['automate linkedin posts', 'ai social media automation', 'gemini content generation nodejs'],
    searchIntent: 'how-to — developer or founder wanting to automate personal brand content',
    targetAudience: 'Developers and solopreneurs wanting automated LinkedIn presence',
    tags: ['Node.js', 'AI', 'Automation', 'LinkedIn'],
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    topic: 'AI agents vs simple scripts: what I learned building 4 live autonomous systems',
    primaryKeyword: 'ai agents for developers 2026',
    secondaryKeywords: ['building ai agents nodejs', 'autonomous ai systems', 'ai agent vs script', 'llm agents tutorial'],
    searchIntent: 'informational — developer evaluating whether to build agents or simple automation',
    targetAudience: 'Developers exploring AI agent architecture',
    tags: ['AI', 'Automation', 'Node.js', 'Gemini'],
    gradient: 'from-violet-500 to-purple-400',
  },
  {
    topic: 'GitHub Actions as a free cron job: how I run 4 AI agents for $0/month',
    primaryKeyword: 'github actions automation nodejs',
    secondaryKeywords: ['github actions cron job', 'free cron job hosting', 'github actions scheduled workflow'],
    searchIntent: 'how-to — developer wanting to schedule automation without paying for servers',
    targetAudience: 'Indie developers building automation on a budget',
    tags: ['GitHub Actions', 'Automation', 'Node.js', 'DevOps'],
    gradient: 'from-slate-500 to-zinc-400',
  },
  {
    topic: 'How I automated my entire personal brand as a Flutter developer',
    primaryKeyword: 'personal branding automation developer',
    secondaryKeywords: ['developer personal brand strategy', 'automate developer content', 'ai personal branding 2026'],
    searchIntent: 'informational — developer who wants visibility without spending hours on content',
    targetAudience: 'Flutter and mobile developers trying to attract clients organically',
    tags: ['Automation', 'AI', 'Personal Brand', 'Career'],
    gradient: 'from-pink-500 to-rose-400',
  },
];

// ─── Load published registry from GitHub ───
async function loadPublishedRegistry() {
  try {
    const { data } = await octokit.repos.getContent({
      owner: REPO_OWNER, repo: REPO_NAME,
      path: REGISTRY_PATH, ref: BRANCH,
    });
    const decoded = Buffer.from(data.content, 'base64').toString('utf8');
    return { registry: JSON.parse(decoded), sha: data.sha };
  } catch {
    return { registry: { published: [], lastRun: null }, sha: null };
  }
}

// ─── Save updated registry to GitHub ───
async function saveRegistry(registry, sha) {
  const content = Buffer.from(JSON.stringify(registry, null, 2)).toString('base64');
  await octokit.repos.createOrUpdateFileContents({
    owner: REPO_OWNER, repo: REPO_NAME,
    path: REGISTRY_PATH,
    message: 'chore: update published topics registry',
    content,
    branch: BRANCH,
    ...(sha ? { sha } : {}),
  });
}

// ─── Pick a topic guaranteed to be unique ───
async function pickTopic() {
  const { registry, sha } = await loadPublishedRegistry();
  const publishedKeywords = new Set(registry.published.map(p => p.primaryKeyword));

  // Filter out topics whose primaryKeyword has been used
  const unused = TOPIC_POOL.filter(t => !publishedKeywords.has(t.primaryKeyword));

  if (unused.length === 0) {
    // All topics exhausted — reset registry and start over
    console.log('⚠️  All topics used. Resetting registry...');
    registry.published = [];
    await saveRegistry(registry, sha);
    return TOPIC_POOL[Math.floor(Math.random() * TOPIC_POOL.length)];
  }

  // Pick randomly from unused topics
  return { topic: unused[Math.floor(Math.random() * unused.length)], registrySha: sha, registry };
}

// ─── SEO quality check ───
function runSeoChecks(post, topicData) {
  const issues = [];
  const content = post.content.toLowerCase();
  const title = post.title.toLowerCase();
  const keyword = topicData.primaryKeyword.toLowerCase();

  // 1. Primary keyword in title
  if (!title.includes(keyword.split(' ')[0]) && !title.includes(keyword.split(' ')[1] || '')) {
    issues.push(`Title missing primary keyword: "${topicData.primaryKeyword}"`);
  }

  // 2. Primary keyword in first 200 chars of content
  if (!content.substring(0, 200).includes(keyword.split(' ')[0])) {
    issues.push('Primary keyword not in opening paragraph');
  }

  // 3. Word count (aim for 1200+ for Google ranking)
  const wordCount = post.content.split(/\s+/).length;
  if (wordCount < 1000) {
    issues.push(`Too short: ${wordCount} words (minimum 1000 for SEO)`);
  }

  // 4. Has at least 3 H2 headings
  const h2Count = (post.content.match(/^## /gm) || []).length;
  if (h2Count < 3) {
    issues.push(`Only ${h2Count} H2 headings — needs at least 3 for structure`);
  }

  // 5. Has a code block
  if (!post.content.includes('```')) {
    issues.push('No code blocks — technical posts need code examples');
  }

  // 6. Has FAQ section
  if (!content.includes('faq') && !content.includes('frequently asked') && !content.includes('## questions')) {
    issues.push('No FAQ section — missed rich snippet opportunity');
  }

  // 7. Excerpt under 160 chars
  if (post.excerpt.length > 160) {
    issues.push(`Excerpt too long: ${post.excerpt.length} chars (max 160 for meta description)`);
    post.excerpt = post.excerpt.substring(0, 157) + '...';
  }

  const wordCountFinal = post.content.split(/\s+/).length;
  return { issues, wordCount: wordCountFinal };
}

// ─── Generate SEO-optimized post with Gemini ───
// Uses XML delimiters instead of JSON to avoid escaping issues with
// markdown content (code blocks, quotes, backticks inside a JSON string).
async function generatePost(topicData) {
  const model = gemini.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are Umair Bilal — a Senior Flutter developer and AI automation builder from Pakistan with 3+ years experience:

Apps you've shipped (15+ in production):
- Muslifie: Muslim travel marketplace (Stripe Connect, real-time chat, 70+ languages, iOS + Android live)
- FarahGPT: AI Islamic education app (5,100+ users, 7 AI personalities, RAG system, RevenueCat)
- MyAiPal: AI wellness companion (OpenAI integration, journaling, iOS + Android live)
- Voisbe: Voice-first social network (audio posts, Firebase, Node.js backend)

AI Agents you've built and run live:
- Gold Trading System: 4 sub-agents trading XAU/USD 24/7 — 51%+ win rate, 1.89 profit factor, ~115R/year, trained on 1.4M candles
- AI Content Pipeline: fully automated — researches topics, writes LinkedIn + Twitter + Instagram content, auto-posts 2x daily, zero human input
- Blog Writer Agent: this agent — SEO-targeted posts, 7 quality checks, commits to GitHub, Vercel auto-deploys Mon/Wed/Fri
- Job Hunting Agent: scrapes listings, AI-scores them, saves to Sheets, sends WhatsApp alerts via Twilio

Write a LONG, deeply technical blog post (1500-2000 words minimum) targeting this EXACT search query:

PRIMARY KEYWORD: "${topicData.primaryKeyword}"
SECONDARY KEYWORDS to weave in naturally: ${topicData.secondaryKeywords.join(', ')}
SEARCH INTENT: ${topicData.searchIntent}
TARGET AUDIENCE: ${topicData.targetAudience}
TOPIC ANGLE: ${topicData.topic}

─── SEO RULES (non-negotiable) ───
1. PRIMARY KEYWORD must appear: in the title, in the first 100 words, and in at least 2 H2 headings
2. Use SECONDARY KEYWORDS naturally — minimum 2 appearances each, never forced
3. Write AT LEAST 1500 words — Google ranks longer, more comprehensive posts higher
4. Use REAL numbers: percentages, load times, user counts, code line counts — specificity builds trust
5. Include at least 4 H2 (##) headings with keyword-rich text
6. Include at least 2 code blocks with real, working code
7. End with a ## Frequently Asked Questions section with 3-4 Q&As — this triggers Google's People Also Ask box
8. The meta excerpt must be exactly 140-155 characters, include the primary keyword, and create urgency/curiosity

─── VOICE & STYLE ───
- Write like a developer sharing a war story — specific, direct, opinionated
- Share real mistakes you made (shows authenticity, builds trust)
- Include real numbers from YOUR apps: "FarahGPT dropped from 4.2s to 180ms", "Muslifie had 200+ guide profiles"
- Use "I", "we", "my app" — first person throughout
- Technical enough to be credible, readable enough for a non-expert to follow
- No generic advice — every tip must come from a real situation

─── STRUCTURE ───
## [Problem/Hook — include primary keyword]
## What I Tried First (That Didn't Work)
## The Fix That Actually Worked — [include primary keyword]
## [Deep technical section with code]
## Results: Before and After
## [Tips/Lessons section]
## Frequently Asked Questions

─── OUTPUT FORMAT ───
Return ONLY the following format with XML-style tags. No explanation, no preamble:

<title>SEO-optimized title containing primary keyword, compelling, under 65 chars</title>
<excerpt>140-155 char meta description with primary keyword and a hook that makes people click</excerpt>
<readTime>X min read</readTime>
<content>
full markdown post here — 1500-2000+ words, with real code blocks, real numbers, FAQ section at the end
</content>`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Parse XML-delimited fields — handles any content inside (backticks, quotes, newlines)
  const extract = (tag) => {
    const match = text.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
    if (!match) throw new Error(`Missing <${tag}> tag in Gemini response`);
    return match[1].trim();
  };

  return {
    title: extract('title'),
    excerpt: extract('excerpt'),
    readTime: extract('readTime'),
    content: extract('content'),
  };
}

// ─── Create slug from title ───
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 65)
    .replace(/-$/, '');
}

// ─── Commit blog post to GitHub ───
async function commitPost(slug, fileContent) {
  const filePath = `content/posts/${slug}.md`;

  let sha;
  try {
    const { data } = await octokit.repos.getContent({
      owner: REPO_OWNER, repo: REPO_NAME, path: filePath, ref: BRANCH,
    });
    sha = data.sha;
  } catch { /* new file */ }

  const encoded = Buffer.from(fileContent).toString('base64');
  await octokit.repos.createOrUpdateFileContents({
    owner: REPO_OWNER, repo: REPO_NAME,
    path: filePath,
    message: `blog: "${slug}"`,
    content: encoded,
    branch: BRANCH,
    ...(sha ? { sha } : {}),
  });

  console.log(`✅ Committed: ${filePath}`);
}

// ─── Discord notification ───
async function notifyDiscord(title, slug, wordCount, seoIssues) {
  if (!process.env.DISCORD_WEBHOOK_URL) return;

  const statusEmoji = seoIssues.length === 0 ? '✅' : '⚠️';
  const issueText = seoIssues.length === 0
    ? 'All SEO checks passed!'
    : `${seoIssues.length} minor issues: ${seoIssues.join(' | ')}`;

  await fetch(process.env.DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      embeds: [{
        title: '📝 New Blog Post Published!',
        description: `**${title}**`,
        color: seoIssues.length === 0 ? 0x22C55E : 0xF59E0B,
        fields: [
          { name: '🔗 URL', value: `https://devumair.vercel.app/blog/${slug}`, inline: false },
          { name: '📊 Word Count', value: `${wordCount} words`, inline: true },
          { name: `${statusEmoji} SEO Check`, value: issueText, inline: false },
          { name: '⚡ Status', value: 'Deploying via Vercel (~2 min)', inline: true },
        ],
        footer: { text: 'Dev.Umair Blog Agent' },
        timestamp: new Date().toISOString(),
      }]
    }),
  });
}

// ─── Main pipeline ───
async function run() {
  try {
    console.log('🚀 Blog Writer Agent starting...\n');

    // 1. Pick unused topic
    const result = await pickTopic();
    const { topic: topicData, registrySha, registry } = result;
    console.log(`📌 Topic: ${topicData.topic}`);
    console.log(`🎯 Primary keyword: "${topicData.primaryKeyword}"`);
    console.log(`🔍 Search intent: ${topicData.searchIntent}\n`);

    // 2. Generate post (retry once if JSON parse fails)
    console.log('✍️  Generating SEO-optimized post with Gemini...');
    let post;
    try {
      post = await generatePost(topicData);
    } catch (e) {
      console.log('⚠️  First attempt failed, retrying...');
      post = await generatePost(topicData);
    }
    console.log(`✅ Generated: "${post.title}"`);

    // 3. Run SEO quality checks
    console.log('\n🔍 Running SEO checks...');
    const { issues, wordCount } = runSeoChecks(post, topicData);
    if (issues.length === 0) {
      console.log(`✅ All SEO checks passed! (${wordCount} words)`);
    } else {
      console.log(`⚠️  ${issues.length} SEO issue(s):`);
      issues.forEach(i => console.log(`   • ${i}`));
    }

    // Hard fail: word count too low (don't publish junk)
    if (wordCount < 700) {
      throw new Error(`Post too short (${wordCount} words). Minimum is 700. Not publishing.`);
    }

    // 4. Build frontmatter
    const slug = slugify(post.title);
    const today = new Date().toISOString().split('T')[0];

    const fileContent = `---
title: "${post.title.replace(/"/g, "'")}"
excerpt: "${post.excerpt.replace(/"/g, "'")}"
date: "${today}"
tags: [${topicData.tags.map(t => `"${t}"`).join(', ')}]
keywords: ["${topicData.primaryKeyword}", ${topicData.secondaryKeywords.map(k => `"${k}"`).join(', ')}]
readTime: "${post.readTime}"
coverGradient: "${topicData.gradient}"
---

${post.content}`;

    // 5. Commit post to GitHub → Vercel auto-deploys
    console.log('\n📦 Committing to GitHub...');
    await commitPost(slug, fileContent);

    // 6. Update registry so this topic is never repeated
    registry.published.push({
      primaryKeyword: topicData.primaryKeyword,
      slug,
      title: post.title,
      date: today,
      wordCount,
    });
    registry.lastRun = new Date().toISOString();
    await saveRegistry(registry, registrySha);
    console.log('📋 Registry updated — topic marked as published');

    // 7. Notify Discord
    await notifyDiscord(post.title, slug, wordCount, issues);

    console.log(`\n🎉 Done! Live in ~2 min: https://devumair.vercel.app/blog/${slug}`);
    console.log(`📊 Stats: ${wordCount} words | ${topicData.tags.join(', ')}`);

  } catch (err) {
    console.error('\n❌ Agent error:', err.message);
    process.exit(1);
  }
}

run();
