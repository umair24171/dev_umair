// ─────────────────────────────────────────────
//  Blog Writer Agent — v3 (Quality Gate Edition)
//  - Jaccard similarity dedup vs full published history (not just last 30 slugs)
//  - Banned-word title gate with one regen attempt
//  - POV/specificity requirement enforced in prompt + post-check
//  - Keyword literalness: title must contain the exact primary keyword
//  Run: node agent/blog-writer.js
//  Schedule: GitHub Actions — Mon/Wed/Fri 9:00 AM PKT
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
- Benchmarks with real numbers (tokens/sec, latency, cost per 1M tokens)
- "I built [specific AI system] in [X] days — [one concrete thing that broke]"
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
<uniqueClaim>ONE specific claim, number, version, or error this post will make that is NOT in the SERP top 10</uniqueClaim>
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

  const prompt = `You are Umair — Flutter & AI Engineer from Pakistan. buildzn.com.
4+ years experience. 20+ production apps shipped to App Store and Google Play.
Built FarahGPT (5,100+ users), an AI gold trading system with multi-agent architecture, NexusOS (AI agent governance SaaS), and a 9-agent YouTube automation pipeline.
Full-stack: Flutter, Node.js, Next.js, Claude API, OpenAI, Firebase, MongoDB, Supabase, Vercel, Stripe, RevenueCat.
You write like a dev venting/helping on Slack. Direct, opinionated, zero fluff.

AUDIENCE AWARENESS: This post targets "${topicData.targetAudience}".
- If "clients": plain English, explain jargon, focus on cost/timeline/quality. CTA to book a call at the end.
- If "recruiters": demonstrate senior thinking, architecture decisions, real production experience. Mention specific apps and numbers.
- If "developers": dive into technical detail with working code. No hand-holding.
- If "tech-audience": Hacker News tone. Strong opinion, real numbers, no fluff.

TOPIC: ${topicData.topic}
ANGLE: ${topicData.angle}
PRIMARY KEYWORD: "${topicData.primaryKeyword}"
SECONDARY KEYWORDS: ${topicData.secondaryKeywords.join(', ')}
SEARCH INTENT: ${topicData.searchIntent}
UNIQUE CLAIM (this is what differentiates this post — build the whole post around delivering on this): ${topicData.uniqueClaim || 'Pick one specific, concrete claim not findable in SERP top 10. Put it in the post explicitly.'}

━━━ THE ONE HARD RULE (NON-NEGOTIABLE) ━━━
This post must contain at least ONE of the following that is NOT in the top 10 Google results for the primary keyword:
- A specific version number and a bug/behavior tied to it
- An actual error string a dev copy-pasted from their console
- A real benchmark number with methodology (e.g. "12.4 tok/s on RTX 4090, measured over 100 runs")
- A direct, unpopular opinion with reasoning
- A config value / flag / line of code that isn't in the official docs
If you cannot include one, ABANDON the post — do not write generic coverage.

━━━ TITLE (CRITICAL) ━━━
- MUST contain the exact phrase: "${topicData.primaryKeyword}"
- Under 65 characters
- Must contain EITHER: a number, OR a colon, OR start with "How I", "How We", "Why", "Fix", "Fixing", OR be "X vs Y: [verdict]"
- FORBIDDEN WORDS IN TITLE: ultimate, mastering, unleash, deep dive, practical guide, comprehensive, complete guide, zero bs, revolutionize, game-changer
- GOOD examples:
  • "Fix Flutter AI Streaming: 3 Gotchas in Claude 4.6"
  • "How I Cut LLM Latency 40% with Ollama Batching"
  • "Flutter vs SwiftUI for On-Device LLMs: Real Numbers"
- BAD examples (do NOT imitate):
  • "The Ultimate Guide to Flutter AI"
  • "Mastering Claude for Developers"
  • "Unleash the Power of On-Device LLMs"

━━━ OPENING (most important) ━━━
DO NOT start with a heading. Start with 2-3 sentences like:
"Spent 2 hours on this last week. Docs were useless, StackOverflow had 3 conflicting answers. Here's what actually worked."
OR: "Everyone talks about X but nobody explains Y. Figured it out the hard way."
Hook must match the EXACT problem the reader Googled. Primary keyword in first 80 words.

━━━ SEARCH INTENT ENFORCEMENT ━━━
- "fix/error" → solution first, minimal theory
- "how-to" → step-by-step, copy-paste ready code
- "comparison" → pick a winner in the first 200 words, reasoning after
- "opinion/trend" → strong take first, evidence after

━━━ STRUCTURE ━━━
1. No intro heading — just the hook paragraph
2. ## [H2 with primary keyword naturally in it] — background / why this matters
3. ## [H2] — the actual how-to or core concept
4. ## [H2] — step-by-step or implementation (2+ real code blocks if technical, OR real benchmark numbers if not)
5. ## What I Got Wrong First — real errors, wrong assumptions, real fixes
6. ## [Optional H2] — optimization or gotchas
7. ## FAQs — 3 questions a dev would ACTUALLY type into Google. Short, direct answers, 2-4 sentences each.
8. One closing paragraph. No heading. Strong opinion + key takeaway.

━━━ VOICE RULES ━━━
- Short paragraphs. 2-3 sentences max.
- At least 2 casual transitions: "Anyway,", "Here's the thing —", "Turns out", "So what I did was"
- At least 1 genuine opinion: "honestly X is overengineered", "I don't get why this isn't the default"
- Reference something SPECIFIC: a version number, an actual error string, a config value, a real number
- Secondary keywords woven in 2x each, naturally
- Bold key insights

━━━ BANNED PHRASES (anywhere in post) ━━━
"in today's world", "rapidly evolving", "deep dive", "let's explore", "revolutionize",
"game-changer", "production-ready", "best practices", "leverage", "utilize",
"in conclusion", "comprehensive guide", "it's worth noting", "seamlessly",
"robust solution", "delve into", "cutting-edge", "it goes without saying"

━━━ SEO REQUIREMENTS ━━━
- Primary keyword: title + first 80 words + 2+ H2s
- Length: 1400–1800 words
- Code blocks: copy-paste ready, real syntax (if technical)
- FAQ: 3 Google "People Also Ask" style questions, 2-4 sentence answers
- One bulleted or numbered list early (featured snippet bait)
- Excerpt: 140–155 chars, includes primary keyword, reads like a human wrote it

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
        footer:    { text: 'BuildZn Blog Agent — v3 Quality Gate' },
        timestamp: new Date().toISOString(),
      }]
    }),
  });
}

// ─── Main pipeline ───
async function run() {
  try {
    console.log('🚀 Blog Writer Agent v3 (Quality Gate) starting...\n');

    // 1. Gather trending topics
    const trendingItems = await gatherTrendingTopics();
    if (trendingItems.length === 0) {
      throw new Error('No trending topics found. Check network connectivity.');
    }

    // 2. Load full published registry (not just slugs — we need titles + keywords for dedup)
    const { registry, sha: registrySha } = await loadPublishedRegistry();
    const publishedPosts = registry.published || [];
    console.log(`📚 ${publishedPosts.length} posts in registry`);

    // 3. Pick topic (with dedup retry)
    console.log('\n🧠 Asking Gemini to pick a fresh topic...');
    const topicData = await pickTrendingTopicWithGemini(trendingItems, publishedPosts);
    console.log(`\n📌 Selected: ${topicData.topic}`);
    console.log(`🎯 Keyword: "${topicData.primaryKeyword}"`);
    console.log(`🔍 Intent: ${topicData.searchIntent}`);
    console.log(`👥 Audience: ${topicData.targetAudience}`);
    console.log(`💡 Unique claim: ${topicData.uniqueClaim || '(none specified)'}\n`);

    // 4. Generate post
    console.log('✍️  Generating post...');
    let post = await generatePost(topicData);
    console.log(`✅ Generated: "${post.title}"`);

    // 5. Title quality gate — regenerate once if it sucks
    const initialTitleScore = scoreTitle(post.title, topicData.primaryKeyword);
    if (initialTitleScore.score < 3) {
      console.warn(`⚠️  Title scored ${initialTitleScore.score}/5. Problems:`);
      initialTitleScore.problems.forEach(p => console.warn(`   - ${p}`));
      console.log('🔄 Regenerating title only...');
      const newTitle = await regenerateTitle(post.title, initialTitleScore.problems, topicData, post.content);
      const newScore = scoreTitle(newTitle, topicData.primaryKeyword);
      if (newScore.score > initialTitleScore.score) {
        console.log(`✅ Better title: "${newTitle}" (score ${newScore.score}/5)`);
        post.title = newTitle;
      } else {
        console.warn(`⚠️  Regen didn't improve. Keeping original.`);
      }
    }

    // 6. Full SEO checks
    console.log('\n🔍 Running SEO checks...');
    const { issues, wordCount, titleScore } = runSeoChecks(post, topicData);
    console.log(`   Title score: ${titleScore}/5`);
    if (issues.length === 0) {
      console.log(`✅ All SEO checks passed! (${wordCount} words)`);
    } else {
      console.log(`⚠️  ${issues.length} SEO issue(s):`);
      issues.forEach(i => console.log(`   • ${i}`));
    }

    if (wordCount < 800) {
      throw new Error(`Post too short (${wordCount} words). Not publishing.`);
    }

    // Hard fail if POV/specificity check failed
    if (issues.some(i => i.includes('no POV'))) {
      throw new Error('Post has no specific numbers/versions/errors — would be indistinguishable from AI spam. Not publishing.');
    }

    // 7. Build final markdown
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

    // 8. Commit
    console.log('\n📦 Committing to GitHub...');
    await commitPost(slug, fileContent);

    // 9. Cross-post to Dev.to
    const devToUrl = await crossPostToDevTo(post, topicData, slug);

    // 10. Update registry (include uniqueClaim for future dedup context)
    registry.published.push({
      slug,
      primaryKeyword: topicData.primaryKeyword,
      title:          post.title,
      topic:          topicData.topic,
      uniqueClaim:    topicData.uniqueClaim || null,
      date:           today,
      wordCount,
      devToUrl:       devToUrl || null,
    });
    registry.lastRun = new Date().toISOString();
    await saveRegistry(registry, registrySha);
    console.log('📋 Registry updated');

    // 11. Notify Discord
    await notifyDiscord(post.title, slug, wordCount, issues, topicData);

    console.log(`\n🎉 Done! Live in ~2 min: https://www.buildzn.com/blog/${slug}`);
    if (devToUrl) console.log(`🔗 Dev.to mirror: ${devToUrl}`);
    console.log(`📊 Stats: ${wordCount} words | Title: ${titleScore}/5 | Tags: ${topicData.tags.join(', ')}`);

  } catch (err) {
    console.error('\n❌ Agent error:', err.message);
    process.exit(1);
  }
}

run();