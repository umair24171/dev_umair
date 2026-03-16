// ─────────────────────────────────────────────
//  Blog Writer Agent — Trending Topics Edition
//  Searches the internet daily for trending tech/dev topics
//  Generates SEO-optimized posts via Gemini and auto-deploys via GitHub
//  Run: node agent/blog-writer.js
//  Schedule: GitHub Actions — Daily at 9:00 AM PKT
// ─────────────────────────────────────────────

import { GoogleGenerativeAI } from '@google/generative-ai';
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
dotenv.config();

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const REPO_OWNER    = process.env.GITHUB_OWNER;
const REPO_NAME     = process.env.GITHUB_REPO;
const BRANCH        = 'main';
const REGISTRY_PATH = 'agent/published-topics.json';

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

// ─── Use Gemini to intelligently pick the best trending topic ───
async function pickTrendingTopicWithGemini(trendingItems, publishedSlugs) {
  const model = gemini.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const itemsList = trendingItems
    .slice(0, 40)
    .map((t, i) => `${i + 1}. [${t.source}] ${t.title} (score: ${t.score})`)
    .join('\n');

  const alreadyPublished = publishedSlugs.slice(-30).join(', ');

  const prompt = `You are a tech blog strategist. Your job is to pick the SINGLE best topic from today's trending tech/developer news for a high-traffic blog post.

Here are today's trending topics across Hacker News, Dev.to, and GitHub:

${itemsList}

Recently published topics to AVOID duplicating: ${alreadyPublished || 'none yet'}

Pick the ONE topic that would make the best long-form technical blog post today. Prioritise:
1. AI, machine learning, LLMs, developer tools — these get the most search traffic
2. Topics developers actively Google (how-to, comparison, tutorial angles work best)
3. Trending news that has a practical, actionable angle for developers
4. Avoid pure business/funding news unless it has strong developer implications

Output ONLY this XML format, nothing else:

<selectedTopic>The exact trending topic or angle you chose</selectedTopic>
<primaryKeyword>the main SEO keyword phrase (3-6 words) developers would search</primaryKeyword>
<secondaryKeywords>keyword1, keyword2, keyword3, keyword4</secondaryKeywords>
<searchIntent>informational/how-to/comparison — describe who is searching and why</searchIntent>
<targetAudience>who this post is for</targetAudience>
<angle>the specific hook that makes this post worth reading today</angle>
<tags>Tag1, Tag2, Tag3, Tag4</tags>`;

  const result = await model.generateContent(prompt);
  const text   = result.response.text();

  const extract = (tag) => {
    const match = text.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
    if (!match) throw new Error(`Missing <${tag}> in Gemini topic-picker response`);
    return match[1].trim();
  };

  return {
    topic:             extract('selectedTopic'),
    primaryKeyword:    extract('primaryKeyword'),
    secondaryKeywords: extract('secondaryKeywords').split(',').map(s => s.trim()),
    searchIntent:      extract('searchIntent'),
    targetAudience:    extract('targetAudience'),
    angle:             extract('angle'),
    tags:              extract('tags').split(',').map(s => s.trim()),
    gradient:          GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
  };
}

// ─── SEO quality check ───
function runSeoChecks(post, topicData) {
  const issues  = [];
  const content = post.content.toLowerCase();
  const title   = post.title.toLowerCase();
  const keyword = topicData.primaryKeyword.toLowerCase();
  const kwWords = keyword.split(' ').filter(w => w.length > 3);

  if (!kwWords.some(w => title.includes(w))) {
    issues.push(`Title may be missing primary keyword: "${topicData.primaryKeyword}"`);
  }

  if (!content.substring(0, 200).includes(kwWords[0] || keyword)) {
    issues.push('Primary keyword not in opening paragraph');
  }

  const wordCount = post.content.split(/\s+/).length;
  if (wordCount < 1000) {
    issues.push(`Too short: ${wordCount} words (minimum 1000 for SEO)`);
  }

  const h2Count = (post.content.match(/^## /gm) || []).length;
  if (h2Count < 3) {
    issues.push(`Only ${h2Count} H2 headings — needs at least 3`);
  }

  if (!post.content.includes('```')) {
    issues.push('No code blocks — consider adding code examples');
  }

  if (!content.includes('faq') && !content.includes('frequently asked') && !content.includes('## question')) {
    issues.push('No FAQ section — missed rich snippet opportunity');
  }

  if (post.excerpt.length > 160) {
    issues.push(`Excerpt too long: ${post.excerpt.length} chars (max 160)`);
    post.excerpt = post.excerpt.substring(0, 157) + '...';
  }

  return { issues, wordCount: post.content.split(/\s+/).length };
}

// ─── Generate the full blog post with Gemini ───
async function generatePost(topicData) {
  const model = gemini.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are a senior tech blogger and developer writing for devumair.vercel.app.

Write a LONG, deeply engaging, SEO-optimized blog post about this trending tech topic:

TOPIC: ${topicData.topic}
ANGLE: ${topicData.angle}
PRIMARY KEYWORD: "${topicData.primaryKeyword}"
SECONDARY KEYWORDS (weave in naturally): ${topicData.secondaryKeywords.join(', ')}
SEARCH INTENT: ${topicData.searchIntent}
TARGET AUDIENCE: ${topicData.targetAudience}

─── SEO RULES ───
1. PRIMARY KEYWORD must appear: in the title, in the first 100 words, and in at least 2 H2 headings
2. Weave in secondary keywords naturally — min 2 appearances each
3. Write AT LEAST 1500 words — aim for 1800-2200
4. Use real numbers, research stats, benchmarks wherever possible
5. Include at least 4 H2 headings (##)
6. Include at least 2 code blocks if technical (real, working code)
7. End with ## Frequently Asked Questions — 3-4 Q&As (triggers Google PAA box)
8. Excerpt must be 140-155 characters, include the primary keyword

─── VOICE & STYLE ───
- Expert developer voice — specific, opinionated, data-driven
- Not generic advice — back everything with real examples or stats
- Accessible for a mid-level developer, credible for a senior one
- First person occasionally to add authenticity

─── STRUCTURE ───
Opening hook paragraph (no heading) — immediately addresses the reader's pain/interest
## [Background/Context — with primary keyword]
## [How It Works / Core Concepts]
## [Practical Implementation or Deep Dive]
## [Comparison, Gotchas, or Advanced Tips]
## [What This Means for You / Takeaways]
## Frequently Asked Questions

─── OUTPUT FORMAT ───
Return ONLY this XML format, no preamble:

<title>SEO-optimized title with primary keyword, under 65 chars</title>
<excerpt>140-155 char meta description with primary keyword and a compelling hook</excerpt>
<readTime>X min read</readTime>
<content>
full markdown post — 1500-2200+ words, code blocks where relevant, FAQ at end
</content>`;

  const result = await model.generateContent(prompt);
  const text   = result.response.text();

  const extract = (tag) => {
    const match = text.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
    if (!match) throw new Error(`Missing <${tag}> tag in Gemini response`);
    return match[1].trim();
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
async function notifyDiscord(title, slug, wordCount, seoIssues, topicData) {
  if (!process.env.DISCORD_WEBHOOK_URL) return;

  const statusEmoji = seoIssues.length === 0 ? '✅' : '⚠️';
  const issueText   = seoIssues.length === 0
    ? 'All SEO checks passed!'
    : `${seoIssues.length} issues: ${seoIssues.join(' | ')}`;

  await fetch(process.env.DISCORD_WEBHOOK_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      embeds: [{
        title:       '📝 New Trending Blog Post Published!',
        description: `**${title}**`,
        color:       seoIssues.length === 0 ? 0x22C55E : 0xF59E0B,
        fields: [
          { name: '🔥 Trending Topic', value: topicData.topic,         inline: false },
          { name: '🔗 URL',            value: `https://devumair.vercel.app/blog/${slug}`, inline: false },
          { name: '📊 Word Count',     value: `${wordCount} words`,    inline: true },
          { name: '🎯 Keyword',        value: topicData.primaryKeyword, inline: true },
          { name: `${statusEmoji} SEO`, value: issueText,              inline: false },
          { name: '⚡ Status',         value: 'Deploying via Vercel (~2 min)', inline: true },
        ],
        footer:    { text: 'Dev.Umair Blog Agent — Trending Topics Edition' },
        timestamp: new Date().toISOString(),
      }]
    }),
  });
}

// ─── Main pipeline ───
async function run() {
  try {
    console.log('🚀 Blog Writer Agent (Trending Topics Edition) starting...\n');

    // 1. Gather trending topics from the internet
    const trendingItems = await gatherTrendingTopics();

    if (trendingItems.length === 0) {
      throw new Error('No trending topics found from any source. Check network connectivity.');
    }

    // 2. Load registry to avoid repeating topics
    const { registry, sha: registrySha } = await loadPublishedRegistry();
    const publishedSlugs = registry.published.map(p => p.slug || p.primaryKeyword || '');

    // 3. Ask Gemini to pick the best topic
    console.log('\n🧠 Asking Gemini to pick the best trending topic for today...');
    const topicData = await pickTrendingTopicWithGemini(trendingItems, publishedSlugs);
    console.log(`\n📌 Selected: ${topicData.topic}`);
    console.log(`🎯 Keyword: "${topicData.primaryKeyword}"`);
    console.log(`🔍 Intent: ${topicData.searchIntent}`);
    console.log(`👥 Audience: ${topicData.targetAudience}\n`);

    // 4. Generate full blog post (retry once on failure)
    console.log('✍️  Generating SEO-optimized post with Gemini...');
    let post;
    try {
      post = await generatePost(topicData);
    } catch (e) {
      console.log('⚠️  First attempt failed, retrying...');
      post = await generatePost(topicData);
    }
    console.log(`✅ Generated: "${post.title}"`);

    // 5. SEO quality checks
    console.log('\n🔍 Running SEO checks...');
    const { issues, wordCount } = runSeoChecks(post, topicData);
    if (issues.length === 0) {
      console.log(`✅ All SEO checks passed! (${wordCount} words)`);
    } else {
      console.log(`⚠️  ${issues.length} SEO issue(s):`);
      issues.forEach(i => console.log(`   • ${i}`));
    }

    if (wordCount < 700) {
      throw new Error(`Post too short (${wordCount} words). Minimum is 700. Not publishing.`);
    }

    // 6. Build final markdown file with frontmatter
    const slug  = slugify(post.title);
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

    // 7. Commit to GitHub → Vercel auto-deploys
    console.log('\n📦 Committing to GitHub...');
    await commitPost(slug, fileContent);

    // 8. Update registry
    registry.published.push({
      slug,
      primaryKeyword: topicData.primaryKeyword,
      title:          post.title,
      topic:          topicData.topic,
      date:           today,
      wordCount,
    });
    registry.lastRun = new Date().toISOString();
    await saveRegistry(registry, registrySha);
    console.log('📋 Registry updated');

    // 9. Notify Discord
    await notifyDiscord(post.title, slug, wordCount, issues, topicData);

    console.log(`\n🎉 Done! Live in ~2 min: https://devumair.vercel.app/blog/${slug}`);
    console.log(`📊 Stats: ${wordCount} words | Tags: ${topicData.tags.join(', ')}`);

  } catch (err) {
    console.error('\n❌ Agent error:', err.message);
    process.exit(1);
  }
}

run();
