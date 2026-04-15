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

const REPO_OWNER    = process.env.REPO_OWNER || process.env.GITHUB_OWNER;
const REPO_NAME     = process.env.REPO_NAME  || process.env.GITHUB_REPO;
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

// ─── Retry wrapper for Gemini 503 / overload errors ───
// Tries gemini-2.5-flash first, then falls back to gemini-2.0-flash and
// gemini-1.5-flash with exponential backoff between attempts.
async function callGeminiWithRetry(promptFn, {
  models     = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'],
  maxRetries = 3,
  baseDelay  = 15_000,  // 15 s
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
          const delay = baseDelay * attempt;          // 15 s → 30 s → 45 s
          console.warn(`   ⚠️  ${modelName} overloaded (503). Waiting ${delay / 1000}s…`);
          await new Promise(r => setTimeout(r, delay));
        } else if (isOverload(err) && attempt === maxRetries && m < models.length - 1) {
          // Exhausted retries on this model — move to the next
          console.warn(`   ⚠️  ${modelName} — all ${maxRetries} retries failed. Trying fallback model…`);
          break;
        } else {
          throw err;   // Non-overload error → propagate immediately
        }
      }
    }
  }
  throw new Error('All Gemini models exhausted after retries. Cannot proceed.');
}

// ─── Use Gemini to intelligently pick the best trending topic ───
async function pickTrendingTopicWithGemini(trendingItems, publishedSlugs) {

  const itemsList = trendingItems
    .slice(0, 40)
    .map((t, i) => `${i + 1}. [${t.source}] ${t.title} (score: ${t.score})`)
    .join('\n');

  const alreadyPublished = publishedSlugs.slice(-30).join(', ');

  // ─── TARGET AUDIENCES (rotate through these) ───
  // Each post must serve at least one of these audiences:
  // A) Clients: founders/PMs researching app development, AI integration, or dev tools
  // B) Recruiters: hiring managers looking for Flutter/AI/full-stack engineers
  // C) Developers: devs who search for tutorials, comparisons, and how-to guides
  // D) Tech audience: general tech readers following AI/industry trends

  const prompt = `You are an SEO and content strategist for a Flutter & AI Engineer's portfolio blog (buildzn.com).
The author is Umair — Flutter dev, Node.js backend dev, AI agent builder. Full-stack. Pakistani dev working internationally.

The blog serves FOUR audiences — pick a topic that serves at least one:
- CLIENTS: Founders/PMs researching app development costs, AI integration, timelines, and what's possible
- RECRUITERS: Hiring managers looking for senior Flutter/AI/full-stack talent
- DEVELOPERS: Devs who search for tutorials, tool comparisons, how-to guides
- TECH AUDIENCE: General tech readers following AI, industry trends, and developer tools

TRENDING ITEMS (use these for inspiration or pick one directly):
${itemsList}

ALREADY PUBLISHED (avoid): ${alreadyPublished || 'none'}

TOPIC TIERS (pick from highest priority available based on trending items):

TIER 1 — AI & Agents (highest traffic right now, always prioritize):
- "How to build [AI agent feature] with [tool/framework]"
- "[OpenAI / Claude / Gemini / Llama] vs [competitor] — which is better for [use case]"
- "I built [AI system] in [X] days — here's exactly how"
- "AI coding tools compared: [Cursor vs Copilot vs Claude Code] in [year]"
- "How to add AI features to your [app type] without blowing the budget"
- "Building multi-agent systems with Node.js — what I learned"
- "What [major AI news event] means for developers"
- "[AI tool] is overhyped / underrated — here's the real verdict"

TIER 2 — Flutter & Mobile (core audience):
- "Flutter vs [React Native / native iOS / Kotlin] for [use case] in [year]"
- "Flutter + [Stripe / RevenueCat / Supabase / Firebase / Gemini / OpenAI] — full integration guide"
- "How much does a Flutter app cost in [year]"
- "From idea to App Store in [X] weeks — the real timeline"
- "How to hire a Flutter developer — what to look for"

TIER 3 — Full-Stack & Dev Tools:
- "Node.js vs [Bun / Deno / Python] for [use case] in [year]"
- "[Supabase / Firebase / PlanetScale / Neon] — which backend wins for [use case]"
- "How I built [full-stack feature] with Next.js and [tool]"
- "Vercel vs [Render / Railway / Fly.io] — honest comparison"
- "[Dev tool] is replacing [old tool] — here's why"

TIER 4 — Tech Industry & Trends:
- "What [major tech news event] means for developers"
- "Why [company/product] is winning/losing in [year]"
- "The real impact of [AI/tech trend] on software development"
- "[Big tech move] — what developers should actually do about it"

TOPIC SELECTION RULES:
- FIRST PRIORITY: AI/agent topics — highest search traffic right now, always check Tier 1 first
- SECOND PRIORITY: Flutter/mobile topics — core audience, lead generation
- THIRD PRIORITY: Full-stack/backend/dev tools — broad developer audience
- FOURTH PRIORITY: Tech industry takes — for shares and general reach
- ALWAYS use the trending items from HN, Dev.to, GitHub as inspiration
- NEVER pick pure crypto, finance, politics, or non-dev topics
- Must pass: "Would a developer, founder, or tech recruiter find this useful?"
- Target 500–2000 search volume keywords — practical, not viral

KEYWORD VALIDATION:
- Prefer commercial or informational intent: "how to build X", "X vs Y", "X cost", "best X for Y"
- Include year (2026) in cost/comparison posts for freshness
- AVOID purely academic or theoretical topics with no practical angle

HARD RULES:
- Every post MUST be useful to developers, founders, or tech recruiters
- No generic news recaps — must have a developer angle or practical takeaway
- Must include real code OR real numbers OR a clear opinion

Output ONLY this XML, nothing else:
<selectedTopic>topic</selectedTopic>
<primaryKeyword>3-6 word SEO keyword</primaryKeyword>
<secondaryKeywords>kw1, kw2, kw3, kw4</secondaryKeywords>
<searchIntent>who is searching and why</searchIntent>
<targetAudience>clients OR recruiters OR developers OR tech-audience (pick primary)</targetAudience>
<angle>specific hook that makes this worth reading today</angle>
<tags>Tag1, Tag2, Tag3, Tag4</tags>`;

  const text = await callGeminiWithRetry(
    (model) => model.generateContent(prompt).then(r => r.response.text())
  );

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

  const prompt = `You are Umair — Flutter & AI Engineer from Pakistan. buildzn.com.
4+ years experience. 20+ production apps shipped to App Store and Google Play.
Built FarahGPT (5,100+ users), an AI gold trading system with multi-agent architecture, NexusOS (AI agent governance SaaS), and a 9-agent YouTube automation pipeline.
Full-stack: Flutter, Node.js, Next.js, Claude API, OpenAI, Firebase, MongoDB, Supabase, Vercel, Stripe, RevenueCat.
You write like a dev venting/helping on Slack. Direct, opinionated, zero fluff.

AUDIENCE AWARENESS: This post targets "${topicData.targetAudience}".
- If "clients": write in plain English, explain jargon, focus on outcomes (cost, timeline, quality). Include a CTA to book a call at the end.
- If "recruiters": demonstrate senior-level thinking, architecture decisions, and real production experience. Mention specific apps and numbers.
- If "developers": dive into technical detail with working code. No hand-holding.
- If "tech-audience": write like a sharp dev blogger (think Hacker News tone). Strong opinion, real numbers, no fluff. Link to your own relevant posts where natural.

TOPIC: ${topicData.topic}
ANGLE: ${topicData.angle}
PRIMARY KEYWORD: "${topicData.primaryKeyword}"
SECONDARY KEYWORDS: ${topicData.secondaryKeywords.join(', ')}
SEARCH INTENT: ${topicData.searchIntent}

━━━ OPENING (most important part) ━━━
DO NOT start with a heading. Start with 2-3 sentences like:
"Spent 2 hours on this last week. Docs were useless, StackOverflow had 3 conflicting answers. Here's what actually worked."
OR: "Everyone talks about X but nobody explains Y. Figured it out the hard way."
OR: "This error makes no sense until you understand one thing about how Z works."
Hook must match the EXACT problem the reader Googled. Primary keyword in first 80 words.

━━━ SEARCH INTENT ENFORCEMENT ━━━
- If intent is "fix/error" → solution first, minimal theory
- If intent is "how-to" → step-by-step clarity
- If intent is "comparison" → pick a winner, give clear reasoning
- If intent is "opinion/trend" → strong take first, evidence second
- Do NOT drift from the intent

━━━ STRUCTURE ━━━
1. No intro heading — just the hook paragraph
2. ## [H2 with primary keyword naturally in it] — background/why this matters
3. ## [H2] — the actual how-to or core concept
4. ## [H2] — step-by-step or implementation (MUST have 2+ real code blocks if technical, OR real numbers/data if non-technical)
5. ## What I Got Wrong First — real errors, wrong assumptions, real fixes
6. ## [Optional H2] — optimization or gotchas if relevant
7. ## FAQs — 3 questions a dev would ACTUALLY type into Google. Short punchy answers.
8. One closing paragraph. No heading. Strong opinion + key takeaway.

━━━ VOICE RULES ━━━
- Short paragraphs. 2-3 sentences max. Breathe.
- At least 2 casual transitions: "Anyway,", "Here's the thing —", "Turns out", "So what I did was"
- At least 1 genuine opinion: "honestly X is overengineered", "I don't get why this isn't the default", "this is underrated"
- Reference something SPECIFIC: a version number, an actual error string, a config value, a weird behavior, a real number
- Use bullet points where helpful (steps, comparisons, mistakes)
- Bold key insights — devs skim, make it scannable
- Mention 1-2 related topics naturally (internal linking)
- Secondary keywords woven in 2x each — naturally, not stuffed

━━━ TRENDING CONTEXT ━━━
The reader found this post by Googling a specific problem RIGHT NOW. They are not browsing — they need an answer in the next 30 seconds or they hit back. Rules:
- Answer the exact question in the FIRST paragraph — no warmup
- Write like you solved this problem last week and you're telling a friend
- Every H2 should answer a sub-question the reader has in their head
- If they can get the answer without scrolling — you win the ranking
- Speed to value beats everything else

━━━ BANNED PHRASES ━━━
"in today's world", "rapidly evolving", "deep dive", "let's explore", "revolutionize",
"game-changer", "production-ready", "best practices", "leverage", "utilize",
"in conclusion", "comprehensive guide", "it's worth noting", "seamlessly",
"robust solution", "delve into", "cutting-edge", "it goes without saying"

━━━ SEO REQUIREMENTS ━━━
- Primary keyword: title + first 80 words + 2+ H2s
- Length: 1400–1800 words
- Code blocks: copy-paste ready, real syntax, no pseudocode (if technical topic)
- FAQ: 3 Google-style "People Also Ask" questions with short direct answers
- Add 1 short numbered or bullet list early on (featured snippet bait)
- Excerpt: 140–155 chars, includes primary keyword, sounds human

━━━ TITLE RULES ━━━
- Under 65 characters
- Primary keyword present
- Prefer: "Fix [X]: What Actually Works", "[X] Not Working? Here's the Fix", "How I Fixed [X] (After Wasting Hours)", "[X] vs [Y]: Honest Take After Using Both"
- Must trigger curiosity OR urgency — pick one

Output ONLY this XML:
<title>title here</title>
<excerpt>meta description</excerpt>
<readTime>X min read</readTime>
<content>full markdown post</content>`;

  const rawText = await callGeminiWithRetry(
    (model) => model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 8192, temperature: 0.9 },
    }).then(r => r.response.text())
  );

  // Strip markdown code fences Gemini sometimes wraps the whole response in
  // (e.g. ```xml … ``` or ```markdown … ```) before we parse the XML tags.
  const text = rawText
    .replace(/^```(?:xml|markdown|md|text)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();

  const extract = (tag) => {
    // Use greedy match so the regex captures up to the LAST closing tag —
    // needed because the markdown body can contain XML-like strings that would
    // cause a non-greedy *? to terminate too early.
    const pattern = new RegExp(`<${tag}>([\\s\\S]*)<\\/${tag}>`);
    let match = text.match(pattern);

    // Fallback for <content>: if the closing tag is absent (response got
    // truncated by Gemini before it could emit </content>), capture everything
    // from the opening tag to the end of the string rather than crashing.
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

    // For non-content fields only: strip any stray XML/HTML tags Gemini may
    // have leaked in (e.g. a </title> that bleeds in when the greedy regex
    // overshoots). Leave the <content> body untouched so markdown with inline
    // HTML (<div>, <img>, code examples with angle brackets) survives intact.
    if (tag !== 'content') {
      value = value.replace(/<\/?[a-zA-Z][^>]*>/g, '').trim();
    }

    // For single-line fields, collapse internal newlines into a space so the
    // value never introduces a multi-line YAML key that breaks the build.
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

// ─── Cross-post to Dev.to for backlinks ───
async function crossPostToDevTo(post, topicData, slug) {
  if (!process.env.DEV_TO_API_KEY) {
    console.log('ℹ️  DEV_TO_API_KEY not set — skipping Dev.to cross-post');
    return null;
  }

  try {
    console.log('📤 Cross-posting to Dev.to...');

    // Prepend canonical notice so readers click through to www.buildzn.com
    const canonicalUrl = `https://www.buildzn.com/blog/${slug}`;
    const devToBody = `> *This article was originally published on [BuildZn](${canonicalUrl}).*\n\n${post.content}`;

    const payload = {
      article: {
        title:          post.title,
        body_markdown:  devToBody,
        published:      true,
        canonical_url:  canonicalUrl,
        description:    post.excerpt,
        tags:           topicData.tags.slice(0, 4).map(t => t.toLowerCase().replace(/[^a-z0-9]/g, '')),
      },
    };

    const res = await fetch('https://dev.to/api/articles', {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'api-key':       process.env.DEV_TO_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`⚠️  Dev.to cross-post failed (${res.status}): ${errText}`);
      return null;
    }

    const data = await res.json();
    console.log(`✅ Dev.to post live: ${data.url}`);
    return data.url;
  } catch (err) {
    console.warn('⚠️  Dev.to cross-post error:', err.message);
    return null;
  }
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
          { name: '🔗 URL',            value: `https://www.buildzn.com/blog/${slug}`, inline: false },
          { name: '📊 Word Count',     value: `${wordCount} words`,    inline: true },
          { name: '🎯 Keyword',        value: topicData.primaryKeyword, inline: true },
          { name: `${statusEmoji} SEO`, value: issueText,              inline: false },
          { name: '⚡ Status',         value: 'Deploying via Vercel (~2 min)', inline: true },
        ],
        footer:    { text: 'BuildZn Blog Agent — Trending Topics Edition' },
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

    // 4. Generate full blog post (with auto-retry + model fallback via callGeminiWithRetry)
    console.log('✍️  Generating SEO-optimized post with Gemini...');
    const post = await generatePost(topicData);
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

    if (wordCount < 800) {
      throw new Error(`Post too short (${wordCount} words). Minimum is 800. Not publishing.`);
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

    // 8. Cross-post to Dev.to for backlinks
    const devToUrl = await crossPostToDevTo(post, topicData, slug);

    // 9. Update registry
    registry.published.push({
      slug,
      primaryKeyword: topicData.primaryKeyword,
      title:          post.title,
      topic:          topicData.topic,
      date:           today,
      wordCount,
      devToUrl:       devToUrl || null,
    });
    registry.lastRun = new Date().toISOString();
    await saveRegistry(registry, registrySha);
    console.log('📋 Registry updated');

    // 10. Notify Discord
    await notifyDiscord(post.title, slug, wordCount, issues, topicData);

    console.log(`\n🎉 Done! Live in ~2 min: https://www.buildzn.com/blog/${slug}`);
    if (devToUrl) console.log(`🔗 Dev.to mirror: ${devToUrl}`);
    console.log(`📊 Stats: ${wordCount} words | Tags: ${topicData.tags.join(', ')}`);

  } catch (err) {
    console.error('\n❌ Agent error:', err.message);
    process.exit(1);
  }
}

run();