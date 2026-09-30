# BuildZn editorial agent

This is a manual content research and review workflow, not a publisher. It cannot send outreach, change external records or start a recurring run. Generated Markdown remains `status: draft` and `reviewed: false` outside the public posts directory.

## What changed in the audit

The previous agent selected trending headlines without reading their sources. It lacked approved business/project context, used a stale remote topic registry, accepted incomplete XML responses and never invoked its SEO checks. Its prompts encouraged generic developer topics and conflicted with its unused title/word-count rules.

The replacement ranks a bounded problem backlog against BuildZn’s services and public project evidence. It reads actual local published articles and pending drafts, distinguishes a new intent from an update, retrieves primary source contents, prepares a brief/outline, generates structured JSON, runs deterministic checks and requests an independent editorial review. One revision is allowed. Failure preserves diagnostics and withholds the final Markdown draft.

## Run it

Use Node 22 or newer, then `npm ci --prefix agent`.

```sh
# Offline planning; no model calls or account required
node agent/blog-writer.js plan
node agent/blog-writer.js plan --out content/drafts/editorial-plan.json

# Optional bounded discovery of current first-party n8n issues
node agent/blog-writer.js plan --discover

# Use actual Search Console Queries CSV export, kept outside version control
node agent/blog-writer.js plan --search-console /absolute/path/queries.csv

# Generate an unpublished review pack using an approved topic ID
node agent/blog-writer.js draft --topic inquiry-approval-reset

# Prepare an unpublished revision of an existing intent
node agent/blog-writer.js draft --topic invoice-validation --update

# Resume a recent failed pack after provider recovery; reuse paid draft work
node agent/blog-writer.js resume --run RUN_DIRECTORY_NAME

npm test --prefix agent
```

Configure `GEMINI_API_KEY` and `GEMINI_MODEL` in `agent/.env` or the environment. The file is ignored. Select a text model that your account currently supports; the agent does not silently switch models. The existing account’s current `gemini-3.8-flash` model accepted a structured-response test during validation on October 1, 2026. Older model calls returned overload or access errors; model-list presence alone was not treated as proof of successful generation. Availability and pricing can change. Generation makes up to five successful model calls (brief, draft, review, optional revision and re-review), with bounded transient retries. Source requests and provider calls have timeouts. Planning and offline tests do not consume model quota.

GitHub Actions offers a manual `plan` / `draft` workflow. Choose the model explicitly, or configure the `BLOG_GEMINI_MODEL` repository variable. It uses only the existing `GEMINI_API_KEY` secret and read-only repository permissions. It saves a review artifact even on failure; it does not commit or publish. `--update` is exposed as a separate workflow input.

## Topic and demand decisions

`business.json` describes buyers, services, prohibited positioning, editorial voice and existing intent mappings. `topics.json` holds 16 specific troubleshooting and implementation candidates with primary source URLs, project evidence and service links. The shared `content/business/projects.json` supplies real scope and limitations.

The priority score is a transparent editorial heuristic, not an SEO forecast. It combines service fit, implementation/documentation evidence, urgency of the format and demand evidence. A reported GitHub issue proves that someone reported a problem; it does not prove a universal defect or keyword volume. Most backlog topics are explicitly hypotheses. The optional Search Console importer uses real site impressions/clicks/query data to improve priority; these are not market-wide volume. No search account is connected automatically.

The CSV importer expects the English Queries export headers `Top queries, Clicks, Impressions, CTR, Position`. Supply the reporting date range and filters to the human reviewer alongside the export. No private search data is committed. Partial or invalid metrics fail instead of being filled in. Discovery is bounded to 30 recently updated issues from the official n8n repository, matched to existing relevant intents; it does not follow arbitrary trending news.

A published intent produces `update-existing`; pending accepted drafts produce `review-existing-draft`. Related intents in the same cluster remain eligible. Published posts require both `status: published` and `reviewed: true`; quarantined legacy claims never become expertise evidence. A malformed run history stops planning rather than pretending there is no history.

## Research and quality boundaries

Research permits only approved public HTTPS hosts and repository owners, rejects credential-bearing URLs and arbitrary redirects, bounds response size and records retrieval time, resolved URL and SHA-256. Pinned source revisions support the public case studies. Source and issue text are untrusted data, never instructions to the model. Fetched text is a bounded context excerpt, not a complete security audit. Long sources are marked truncated and require reviewer inspection.

Topic-specific approved meta descriptions provide a truthful fallback when generated metadata exceeds its bounds, and an exact duplicate title H1 is removed for the page template. Both adjustments are recorded for human review. The gates check stable intent/slug/keyword, title relevance, specific metadata, section structure, verification and limitations, known internal routes, actual researched citations, claim source IDs, incomplete fences, unsupported promises, placeholders and unapproved client/first-person claims. Sources must appear in inline links supported by the website renderer. Code must identify whether it was executed or is illustrative. The independent reviewer compares claims with actual supplied source contents, rather than accepting the presence of a URL as proof.

Automated checks cannot establish truth, original authorship, legal permission or future search performance. No model-produced draft is published automatically. Inspect every material claim against the full source; run proposed commands in an appropriate sandbox; check versions, correctness, usefulness, privacy, media rights and internal links. A model `pass` is a request for human review.

Each run saves topic, source pack, brief, candidate JSON, review/check reports and a manifest in `content/drafts/runs/<unique-run>/`. `draft.md` exists only after all gates pass. Failed runs preserve candidates for repair. Resume reuses a valid source pack, brief and candidate from a failed run, requires matching approved sources less than 24 hours old, and creates a new linked review pack. It never overwrites the original. Stale or missing evidence requires a fresh run. Updates also stay in that directory; a reviewer must merge the useful revision into the original public article and preserve its canonical URL. The old `published-topics.json` is retained as a legacy archive and is never read by the pipeline.

Review performance after publishing using actual query impressions/clicks and consented business inquiries. Adjust topic evidence and intent choices from those measurements; do not manufacture engagement advice from the topics alone.

References: [Gemini generateContent](https://ai.google.dev/api/generate-content), [Google’s helpful-content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [scaled-content spam policy](https://developers.google.com/search/docs/essentials/spam-policies#scaled-content).

## Validation record — October 1, 2026

Offline regression checks cover intent updates, pending history, source restrictions, invalid metrics, missing evidence, unsafe claims, incomplete responses, unpublished output, canonical preservation and failed-run recovery. Live primary-source retrieval and first-party issue discovery were exercised. The configured provider generated a real brief and article candidate with `gemini-3.8-flash`; its final editorial-review calls returned HTTP 503 even after bounded retries and recovery. The failed packs were retained and no final model-reviewed draft was falsely marked ready. Provider availability remains an external limitation; use `resume` when it recovers. The public implementation guides were separately inspected and edited against their cited source before publication.

## Operations workspace integration

The authenticated `/ops` workspace reuses this planner and draft/review pipeline. Its provider path is disabled until account token rates and a daily dollar ceiling are configured. It reserves attempts in durable storage, including HTTP retries, and keeps run evidence/diagnostics encrypted. A live recovery recheck on October 1, 2026 again returned HTTP 503 during review; the retained candidate was reused, but no final accepted draft or publication resulted. The CLI remains manual and separately consumes provider quota.
