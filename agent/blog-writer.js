// ─────────────────────────────────────────────
//  Blog Writer Agent — v3 (Quality Gate Edition)
//  - Jaccard similarity dedup vs full published history (not just last 30 slugs)
//  - Banned-word title gate with one regen attempt
//  - POV/specificity requirement enforced in prompt + post-check
//  - Keyword literalness: title must contain the exact primary keyword
//  Run: node agent/blog-writer.js
//  Manual only. Writes unpublished local drafts; never commits or cross-posts.
// ─────────────────────────────────────────────

import { GoogleGenerativeAI } from '@google/generative-ai';
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
import fs from 'node:fs/promises';
dotenv.config();

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const REPO_OWNER    = process.env.REPO_OWNER || process.env.GITHUB_OWNER;
const REPO_NAME     = process.env.REPO_NAME  || process.env.GITHUB_REPO;
const BRANCH        = 'main';
const REGISTRY_PATH = 'agent/published-topics.json';

// ─── Similarity threshold for topic dedup ───
// If new primaryKeyword or title has Jaccard similarity > this against ANY
// published post, we reject and ask Gemini to pick something else.
const MAX_TOPIC_SIMILARITY = 0.4;

// ─── Words banned from titles (filler / AI-blog tells) ───
// These murder CTR. If the generated title contains any, we regenerate once.
const BANNED_TITLE_WORDS = [
  'ultimate', 'mastering', 'unleash', 'deep dive', 'practical guide',
  'comprehensive guide', 'complete guide', 'your guide to',
  'everything you need to know', 'zero bs', 'no bs',
  'revolutionize', 'game-changer', 'game changer',
  'let\'s explore', 'the complete', 'the ultimate',
  'seamlessly', 'leverage', 'utilize', 'delve into',
  'cutting-edge', 'state-of-the-art',
];

// ─── Gradient pool for cover images ───
const GRADIENTS = [
  'from-blue-500 to-cyan-400',
  'from-purple-500 to-pink-400',
  'from-orange-500 to-yellow-400',
  'from-green-500 to-emerald-400',
  'from-red-500 to-rose-400',
  'from-violet-500 to-purple-400',
  'from-indigo-500 to-blue-400',
  'from-cyan-500 to-teal-400',
  'from-amber-500 to-orange-400',
  'from-slate-500 to-gray-400',
  'from-pink-500 to-rose-400',
  'from-emerald-500 to-teal-400',
  'from-yellow-500 to-orange-400',
];

// ─── Stopwords stripped before Jaccard similarity ───
const STOPWORDS = new Set([
  'a','an','the','for','and','or','but','is','of','to','in','on','at',
  'with','by','from','as','it','this','that','these','those','vs','my',
  'your','our','how','why','what','when','where','which','who','i','we',
  'you','be','been','being','are','was','were','do','does','did','get',
  'got','has','have','had','can','will','should','would','could',
]);

// ─── Tokenize a string into comparable lowercased tokens ───
function tokenize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .map(w => w.replace(/s$/, '')) // crude depluralize: apps → app
    .filter(w => w.length >= 3 && !STOPWORDS.has(w));
}

// ─── Jaccard similarity of two strings (0 = no overlap, 1 = identical) ───
function jaccard(a, b) {
  const A = new Set(tokenize(a));
  const B = new Set(tokenize(b));
  if (A.size === 0 || B.size === 0) return 0;
  const intersection = [...A].filter(x => B.has(x)).length;
  const union = new Set([...A, ...B]).size;
  return intersection / union;
}

// ─── Find the most similar published post to a candidate ───
function findMostSimilar(candidateKeyword, candidateTitle, publishedPosts) {
  let best = { similarity: 0, post: null };
  for (const p of publishedPosts) {
    const kwSim    = jaccard(candidateKeyword, p.primaryKeyword || '');
    const titleSim = jaccard(candidateTitle || candidateKeyword, p.title || '');
    const sim = Math.max(kwSim, titleSim);
    if (sim > best.similarity) best = { similarity: sim, post: p };
  }
  return best;
}

// ─── Fetch trending stories from Hacker News ───
async function fetchHackerNewsTrends() {
  try {
    console.log('🔍 Fetching Hacker News top stories...');
    const topRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const topIds = await topRes.json();
    const ids    = topIds.slice(0, 30);

    const stories = await Promise.all(
      ids.map(id =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
          .then(r => r.json())
          .catch(() => null)
      )
    );

    return stories
      .filter(s => s && s.title && s.score > 50 && s.type === 'story')
      .map(s => ({
        title:  s.title,
        url:    s.url || `https://news.ycombinator.com/item?id=${s.id}`,
        score:  s.score,
        source: 'HackerNews',
      }));
  } catch (err) {
    console.warn('⚠️  HackerNews fetch failed:', err.message);
    return [];
  }
}

// ─── Fetch trending posts from Dev.to ───
async function fetchDevToTrends() {
  try {
    console.log('🔍 Fetching Dev.to trending articles...');
    const res      = await fetch('https://dev.to/api/articles?top=1&per_page=20');
    const articles = await res.json();

    return articles
      .filter(a => a.positive_reactions_count > 50)
      .map(a => ({
        title:  a.title,
        url:    a.url,
        score:  a.positive_reactions_count,
        tags:   a.tag_list,
        source: 'DevTo',
      }));
  } catch (err) {
    console.warn('⚠️  Dev.to fetch failed:', err.message);
    return [];
  }
}

// ─── Fetch trending repos from GitHub (new repos gaining stars fast) ───
async function fetchGitHubTrending() {
  try {
    console.log('🔍 Fetching GitHub trending repos...');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0];

    const res  = await fetch(
      `https://api.github.com/search/repositories?q=created:>${dateStr}&sort=stars&order=desc&per_page=10`,
      { headers: { 'Accept': 'application/vnd.github.v3+json' } }
    );
    const data = await res.json();

    return (data.items || []).map(r => ({
      title:  `${r.name}: ${r.description || 'New trending open-source repo'}`,
      url:    r.html_url,
      score:  r.stargazers_count,
      source: 'GitHub',
    }));
  } catch (err) {
    console.warn('⚠️  GitHub trending fetch failed:', err.message);
    return [];
  }
}

// ─── Aggregate all trending sources ───
async function gatherTrendingTopics() {
  const [hn, devto, gh] = await Promise.all([
    fetchHackerNewsTrends(),
    fetchDevToTrends(),
    fetchGitHubTrending(),
  ]);

  const all = [...hn, ...devto, ...gh];
  console.log(`\n📊 Gathered ${all.length} trending items (HN: ${hn.length}, Dev.to: ${devto.length}, GitHub: ${gh.length})`);
  return all;
}

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

// ─── Retry wrapper for Gemini 503 / overload errors ───
async function callGeminiWithRetry(promptFn, {
  models     = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'],
  maxRetries = 3,
  baseDelay  = 15_000,
} = {}) {
  const isOverload = (err) =>
    /503|Service Unavailable|high demand|overloaded/i.test(err?.message || '');

  for (let m = 0; m < models.length; m++) {
    const modelName = models[m];
    const model     = gemini.getGenerativeModel({ model: modelName });

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        if (m > 0 || attempt > 1) {
          console.log(`   🤖 ${modelName} — attempt ${attempt}/${maxRetries}`);
        }
        return await promptFn(model);
      } catch (err) {
        const isLast = m === models.length - 1 && attempt === maxRetries;
        if (isOverload(err) && !isLast) {
          const delay = baseDelay * attempt;
          console.warn(`   ⚠️  ${modelName} overloaded (503). Waiting ${delay / 1000}s…`);
          await new Promise(r => setTimeout(r, delay));
        } else if (isOverload(err) && attempt === maxRetries && m < models.length - 1) {
          console.warn(`   ⚠️  ${modelName} — all ${maxRetries} retries failed. Trying fallback model…`);
          break;
        } else {
          throw err;
        }
      }
    }
  }
  throw new Error('All Gemini models exhausted after retries. Cannot proceed.');
}

// ─── Build the topic-selection prompt ───
function buildTopicPrompt(trendingItems, publishedPosts, rejectedCandidate = null) {
  const itemsList = trendingItems
    .slice(0, 40)
    .map((t, i) => `${i + 1}. [${t.source}] ${t.title} (score: ${t.score})`)
    .join('\n');

  // Show LAST 80 published posts with title + primary keyword, not just slugs.
  // This is what Gemini needs to actually avoid duplicates semantically.
  const publishedList = publishedPosts
    .slice(-80)
    .map(p => `- "${p.title}" (kw: ${p.primaryKeyword})`)
    .join('\n') || 'none yet';

  const rejectionNote = rejectedCandidate
    ? `\n━━━ PREVIOUS CANDIDATE REJECTED ━━━\nYour last pick "${rejectedCandidate.primaryKeyword}" was too similar to existing post "${rejectedCandidate.similarTo.title}" (similarity ${(rejectedCandidate.similarity * 100).toFixed(0)}%).\nPICK A DIFFERENT TOPIC, DIFFERENT KEYWORD. Do not just reword the same idea.\n`
    : '';

  return `You are an SEO and content strategist for a Flutter & AI Engineer's portfolio blog (buildzn.com).
The author is Umair — Flutter dev, Node.js backend dev, AI agent builder. Full-stack. Pakistani dev working internationally.

The blog serves FOUR audiences — pick a topic that serves at least one:
- CLIENTS: Founders/PMs researching app development costs, AI integration, timelines
- RECRUITERS: Hiring managers looking for senior Flutter/AI/full-stack talent
- DEVELOPERS: Devs who search for tutorials, tool comparisons, how-to guides
- TECH AUDIENCE: Hacker News / general dev readers

TRENDING ITEMS (inspiration — pick one or use as a jumping-off point):
${itemsList}

━━━ ALREADY PUBLISHED — DO NOT DUPLICATE OR REWRITE THESE ━━━
${publishedList}

HARD DEDUP RULES:
- If your candidate topic shares 2 or more significant keywords with ANY post above, REJECT IT and pick something else.
- "flutter vs react native" was already covered multiple times — DO NOT WRITE ANOTHER ONE under any framing.
- If a topic you want to cover is already on the list, pick a completely different angle, tool, or problem.
- Novelty check: can you name ONE specific thing in this post that is NOT in any of the above posts? If no, pick something else.
${rejectionNote}
TOPIC TIERS (pick from highest priority available based on trending items):

TIER 1 — AI & Agents (highest traffic right now):
- Specific tool tutorials with version numbers or error strings (e.g. "Claude 4.6 streaming bug", "Ollama + Docker connection refused")
- Evaluation methods for cost, latency and reliability; no invented benchmark results
- How to evaluate a specific AI workflow before committing to implementation
- Honest takes: "[AI tool] is overrated — here's what beats it"

TIER 2 — Flutter & Mobile:
- Specific integration guides (e.g. "Flutter + Supabase realtime chat with presence")
- Production debugging stories with actual error messages
- Migration posts ("Moved from Firebase to Supabase — here's what broke")

TIER 3 — Full-Stack & Dev Tools:
- Architecture decisions with real numbers (RPS, p95 latency, $/month)
- Tool comparisons where you've used both in production

TIER 4 — Tech Industry (last resort):
- Only if you have a strong, unpopular take that isn't already everywhere

HARD RULES:
- Every post MUST serve developers, founders, or tech recruiters
- NO generic "state of X" news recaps
- Must include real code OR real numbers OR a concrete opinion not found elsewhere
- Target 500–2000 monthly search volume — practical, not viral
- Prefer LONG-TAIL specific keywords over broad ones ("llm architecture" loses, "llm serving latency ollama vs vllm" wins)

KEYWORD RULES:
- Primary keyword must be 3-6 words, a phrase a dev would LITERALLY TYPE INTO GOOGLE
- NO marketing phrases ("ultimate guide to", "mastering") in the keyword
- If your keyword is generic (e.g. "ai coding"), make it specific (e.g. "ai coding assistants for jetbrains")

Output ONLY this XML, nothing else:
<selectedTopic>topic</selectedTopic>
<primaryKeyword>3-6 word SEO keyword (must be literal search query)</primaryKeyword>
<secondaryKeywords>kw1, kw2, kw3, kw4</secondaryKeywords>
<searchIntent>who is searching and why</searchIntent>
<targetAudience>clients OR recruiters OR developers OR tech-audience</targetAudience>
<angle>specific hook that makes this worth reading today</angle>
<uniqueClaim>A specific decision or question to investigate; no unsupported metrics or firsthand claims</uniqueClaim>
<tags>Tag1, Tag2, Tag3, Tag4</tags>`;
}

// ─── Pick topic with Gemini; retry once if too similar to published posts ───
async function pickTrendingTopicWithGemini(trendingItems, publishedPosts) {
  const extract = (text, tag) => {
    const match = text.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
    if (!match) throw new Error(`Missing <${tag}> in Gemini topic-picker response`);
    return match[1].trim();
  };

  const parse = (text) => ({
    topic:             extract(text, 'selectedTopic'),
    primaryKeyword:    extract(text, 'primaryKeyword'),
    secondaryKeywords: extract(text, 'secondaryKeywords').split(',').map(s => s.trim()),
    searchIntent:      extract(text, 'searchIntent'),
    targetAudience:    extract(text, 'targetAudience'),
    angle:             extract(text, 'angle'),
    uniqueClaim:       (() => { try { return extract(text, 'uniqueClaim'); } catch { return ''; } })(),
    tags:              extract(text, 'tags').split(',').map(s => s.trim()),
  });

  // Attempt 1
  let prompt = buildTopicPrompt(trendingItems, publishedPosts, null);
  let text   = await callGeminiWithRetry((model) => model.generateContent(prompt).then(r => r.response.text()));
  let pick   = parse(text);

  let sim = findMostSimilar(pick.primaryKeyword, pick.topic, publishedPosts);
  if (sim.similarity > MAX_TOPIC_SIMILARITY) {
    console.warn(`⚠️  Topic "${pick.primaryKeyword}" is ${(sim.similarity * 100).toFixed(0)}% similar to existing "${sim.post.title}". Retrying with explicit rejection...`);

    // Attempt 2 with explicit feedback
    prompt = buildTopicPrompt(trendingItems, publishedPosts, {
      primaryKeyword: pick.primaryKeyword,
      similarity: sim.similarity,
      similarTo: sim.post,
    });
    text = await callGeminiWithRetry((model) => model.generateContent(prompt).then(r => r.response.text()));
    pick = parse(text);

    sim = findMostSimilar(pick.primaryKeyword, pick.topic, publishedPosts);
    if (sim.similarity > MAX_TOPIC_SIMILARITY) {
      throw new Error(
        `Gemini picked another duplicate after retry ("${pick.primaryKeyword}" vs "${sim.post.title}" @ ${(sim.similarity * 100).toFixed(0)}%). ` +
        `Not publishing today to avoid SERP cannibalization.`
      );
    }
    console.log(`✅ Retry picked a fresh topic: "${pick.primaryKeyword}"`);
  }

  return {
    ...pick,
    gradient: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
  };
}

// ─── Title quality scorer. Returns { score, problems[] } ───
// score >= 3 passes. Below that triggers a regen.
function scoreTitle(title, primaryKeyword) {
  const problems = [];
  let score = 0;
  const lower = title.toLowerCase();

  // Banned words
  const banned = BANNED_TITLE_WORDS.find(b => lower.includes(b));
  if (banned) {
    problems.push(`Contains banned filler: "${banned}"`);
    score -= 3;
  }

  // Must contain primary keyword (literal, full phrase)
  if (lower.includes(primaryKeyword.toLowerCase())) {
    score += 2;
  } else {
    // Partial credit if >=70% of keyword tokens are present
    const kwTokens = tokenize(primaryKeyword);
    const titleTokens = new Set(tokenize(title));
    const overlap = kwTokens.filter(t => titleTokens.has(t)).length;
    if (kwTokens.length > 0 && overlap / kwTokens.length >= 0.7) {
      score += 1;
    } else {
      problems.push(`Title does not contain primary keyword "${primaryKeyword}"`);
    }
  }

  // Length
  if (title.length <= 65) score += 1;
  else problems.push(`Title too long: ${title.length} chars (max 65)`);

  // Specificity: number, year, colon, or "how i/we"
  if (/\d/.test(title) || title.includes(':') || /^(how i|how we|why i|fixing|fix[:\s])/i.test(title)) {
    score += 1;
  } else {
    problems.push('No number, colon, or story-framing — feels generic');
  }

  // No trailing "-"/cut-off signal
  if (title.endsWith('-') || title.endsWith('...')) {
    score -= 1;
    problems.push('Title appears truncated');
  }

  return { score, problems };
}

// ─── Regenerate ONLY the title if it failed quality check ───
async function regenerateTitle(currentTitle, problems, topicData, contentSnippet) {
  const prompt = `You wrote this blog post title: "${currentTitle}"

It failed SEO quality checks:
${problems.map(p => `- ${p}`).join('\n')}

Rewrite the title. Rules:
- Must contain the exact phrase: "${topicData.primaryKeyword}"
- Under 65 characters
- Must contain either a number, a colon, a version, or start with "How I/We", "Why", "Fix", "Fixing", or "X vs Y"
- FORBIDDEN WORDS: ${BANNED_TITLE_WORDS.join(', ')}
- Do not use "Guide" alone at the end. If you say "guide", make it a "[something specific] guide"
- Sound like a developer wrote it, not a content mill

Post context (first 300 chars of body):
${contentSnippet.substring(0, 300)}

Output ONLY the new title. No explanation. No quotes. Just the plain title text on one line.`;

  const text = await callGeminiWithRetry(
    (model) => model.generateContent(prompt).then(r => r.response.text())
  );
  return text.trim().replace(/^["']|["']$/g, '').split('\n')[0].trim();
}

// ─── SEO quality check ───
function runSeoChecks(post, topicData) {
  const issues  = [];
  const content = post.content.toLowerCase();
  const title   = post.title.toLowerCase();
  const keyword = topicData.primaryKeyword.toLowerCase();
  const kwWords = keyword.split(' ').filter(w => w.length > 3);

  // Title quality
  const titleScore = scoreTitle(post.title, topicData.primaryKeyword);
  titleScore.problems.forEach(p => issues.push(`Title: ${p}`));

  if (!kwWords.some(w => title.includes(w))) {
    issues.push(`Title missing primary keyword: "${topicData.primaryKeyword}"`);
  }

  if (!content.substring(0, 200).includes(kwWords[0] || keyword)) {
    issues.push('Primary keyword not in opening paragraph');
  }

  const wordCount = post.content.split(/\s+/).length;
  if (wordCount < 800) {
    issues.push(`Too short: ${wordCount} words (minimum 800)`);
  }

  const h2Count = (post.content.match(/^## /gm) || []).length;
  if (h2Count < 3) {
    issues.push(`Only ${h2Count} H2 headings — needs at least 3`);
  }

  if (!post.content.includes('```')) {
    issues.push('No code blocks — consider adding code examples');
  }

  if (!/##\s*(faq|frequently|questions)/i.test(post.content)) {
    issues.push('No FAQ section — missed rich snippet opportunity');
  }

  // Specificity check: post must contain at least one number, version, or error string
  const hasSpecifics = /\b\d{1,4}(\.\d+)?\b/.test(post.content) || /\berror:|exception|traceback\b/i.test(post.content);
  if (!hasSpecifics) {
    issues.push('No numbers, versions, or error strings — too generic, no POV');
  }

  if (post.excerpt.length > 160) {
    issues.push(`Excerpt too long: ${post.excerpt.length} chars (max 160)`);
    post.excerpt = post.excerpt.substring(0, 157) + '...';
  }

  return { issues, wordCount, titleScore: titleScore.score };
}

// ─── Generate the full blog post with Gemini ───
async function generatePost(topicData) {

  const prompt = `Prepare an UNPUBLISHED research draft for BuildZn, an independent product-development practice.
Topic: ${topicData.topic}
Audience: ${topicData.targetAudience}
Primary keyword: ${topicData.primaryKeyword}
Angle: ${topicData.angle}

Write clear practical prose about the product problem, constraints, decision, tradeoffs and useful next step.
Do not impersonate Umair or claim firsthand experience, client work, screenshots, production results, benchmarks or bills that were not supplied as evidence.
Do not invent usage numbers, timelines, percentages, quotations, model versions or sources.
Label hypothetical examples explicitly. List technical facts that require primary-source verification in a Sources to verify section.
Use code only where it serves the explanation. Label untested code as illustrative; never promise it is copy-paste ready.
Use this exact commercial CTA destination if needed: https://www.buildzn.com/#contact . Never create placeholder domains.
Do not force a word count, repeated keywords, FAQ or an artificial contrarian hook.
Do not begin with an H1: the publishing template supplies the title.
Finish with a Reviewer checklist covering source verification, code validation, metric evidence, client permissions and CTA verification.
Output ONLY this XML:
<title>clear specific title</title>
<excerpt>accurate short description</excerpt>
<readTime>estimated reading time</readTime>
<content>markdown draft</content>`;

  const rawText = await callGeminiWithRetry(
    (model) => model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 8192, temperature: 0.9 },
    }).then(r => r.response.text())
  );

  const text = rawText
    .replace(/^```(?:xml|markdown|md|text)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();

  const extract = (tag) => {
    const pattern = new RegExp(`<${tag}>([\\s\\S]*)<\\/${tag}>`);
    let match = text.match(pattern);

    if (!match && tag === 'content') {
      const openPattern = new RegExp(`<${tag}>([\\s\\S]*)`);
      match = text.match(openPattern);
      if (match) {
        console.warn('⚠️  </content> closing tag missing — response was likely truncated. Using full remainder.');
      }
    }

    if (!match) {
      console.error(`⚠️  Gemini response snippet (first 500 chars):\n${text.substring(0, 500)}`);
      throw new Error(`Missing <${tag}> tag in Gemini response`);
    }

    let value = match[1].trim();

    if (tag !== 'content') {
      value = value.replace(/<\/?[a-zA-Z][^>]*>/g, '').trim();
    }

    if (tag === 'title' || tag === 'excerpt' || tag === 'readTime') {
      value = value.replace(/\s*\n\s*/g, ' ').trim();
    }

    return value;
  };

  return {
    title:    extract('title'),
    excerpt:  extract('excerpt'),
    readTime: extract('readTime'),
    content:  extract('content'),
  };
}

// ─── Create URL-safe slug from title ───
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 65)
    .replace(/-$/, '');
}

async function run() {
  try {
    const trendingItems = await gatherTrendingTopics();
    if (!trendingItems.length) throw new Error('No research topics available.');
    const { registry } = await loadPublishedRegistry();
    const topicData = await pickTrendingTopicWithGemini(trendingItems, registry.published || []);
    const post = await generatePost(topicData);
    if (/https?:\/\/(?:example\.com|yourwebsite\.com|your-calendly-link\.com)/i.test(post.content)) throw new Error('Draft contains a placeholder destination.');
    const slug = slugify(post.title);
    const today = new Date().toISOString().slice(0, 10);
    const content = `---
status: draft
reviewed: false
title: ${JSON.stringify(post.title)}
excerpt: ${JSON.stringify(post.excerpt)}
date: ${JSON.stringify(today)}
tags: ${JSON.stringify(topicData.tags)}
---

${post.content}
`;
    await fs.mkdir('content/drafts', { recursive: true });
    await fs.writeFile(`content/drafts/${slug}.md`, content, 'utf8');
    console.log(`Unpublished draft saved to content/drafts/${slug}.md. Human review is required before moving it to content/posts.`);
  } catch (err) {
    console.error('Draft preparation failed:', err.message);
    process.exitCode = 1;
  }
}
run();
