# BuildZn — AI agents & business automation

Next.js website for Umair Bilal’s independent automation studio. Services cover workflow automation, AI agents, API integrations and automation repair. The portfolio distinguishes working sample demonstrations from public build walkthroughs, with traceable implementation evidence and boundaries.

## Development and validation

Use Node 22. Run `npm ci`, then `npm run dev`. Before pushing: `npm run lint`, `npm run check`, `npm test`, `npm run build`. The build fetches Google Fonts and needs network access.

For browser checks install Chromium with `npx playwright install chromium`. Start the production server on port 3100 (`npm run start -- --port 3100`), then run `npm run test:smoke` and `npm run test:browser`. Set `SMOKE_URL` to validate a deployed site. Browser checks cover missing inquiry data, lead creation and approval resets; source-grounded support and handoff; invoice validation, correction and actual CSV/JSON downloads; mocked contact success/failure; responsive layout, keyboard navigation and WCAG accessibility scans.

Contact response tests simulate `/api/inquiries` and do not write a real inquiry. Operations browser tests create labeled fictional records in a private controlled store. Neither an accepted HTTP response nor these mocks confirm inbox delivery. A controlled real submission and inbox access are needed to verify that separately.

## Content and demonstrations

`lib/site.ts` holds shared services, process and FAQ content; `content/business/projects.json` holds the shared project evidence. `lib/demos.ts` implements local parsing, conservative support matching, invoice validation and safe CSV generation. `DemoWorkbench.tsx` renders the working previews.

- Inquiry: labeled text → requirements → local lead → editable recorded reply template → local approval.
- Support: sample knowledge → conservative exact matching → recorded answer with source → handoff outside coverage.
- Document: labeled text invoice → extracted fields → validation → manual review → CSV/JSON download.

No live model, CRM, email, ticketing or accounting accounts are connected to these previews. Inputs stay in browser memory and are cleared on reload. No real data should be entered. Production connections, OCR, semantic retrieval, permissions and evaluation require separate implementation. Provider subscriptions, model calls and hosting may have separate costs.

Screenshots in `public/demos/` are real captures of the sample previews and source walkthroughs. Regenerate the previews with `node scripts/capture-demos.mjs`, and walkthroughs with `node scripts/capture-case-studies.mjs` against the local server. Do not add fictional clients, credentials, testimonials, savings, income or results claims.

## Articles and retired routes

Published articles require `status: published` AND `reviewed: true`. All other legacy sources remain recoverable with `status: review`, but are absent from public pages, related posts, the API and sitemap. Retired blog URLs return 404 with noindex; there is no blanket redirect to unrelated articles. See `content/EDITORIAL.md` before publishing.

Old mobile/SaaS service URLs redirect permanently to the service overview; the former AI workflow and improvement services redirect to their relevant new services. Old product case studies redirect to the evidence-labeled work index, never to an invented replacement client story. `/flutter-app-cost` redirects to `/pricing`, `/labs` and `/portfolio` to `/work`, and the old static social image to `/opengraph-image`. Legacy app imagery is removed.

The manual draft-preparation workflow remains manual-only. It cannot publish, cross-post or send notifications. The private operations workspace adds bounded public-request research and human-reviewed drafts. No outreach is sent and no recurring job is activated.

## Contact, privacy and analytics

The form now stores inquiries in the encrypted private operations workspace. It keeps entered data on errors and provides direct email/WhatsApp alternatives. After durable storage, public submission attempts a fixed owner notification through the existing Formspree endpoint. Notification acceptance is tracked separately; failed/uncertain mail never reverses storage acceptance. No automatic sales reply or visitor email receipt is sent. An actual owner inbox notification was verified on October 5, 2026. See OPERATIONS.md for access, privacy, limits and activation.

Google Analytics loads only after opt-in. Custom events contain action/location categories, never form or demonstration text. Privacy settings allow withdrawal. Credentials never belong in source, URLs, content or analytics.

## Deployment

The GitHub repository is connected to Vercel. Push validated main to trigger deployment, verify Vercel’s deployed Git commit, then run smoke and browser checks on `https://www.buildzn.com`. Preserve unrelated work and verify the remote branch has not changed before updating main.

## Evidence-backed work and editorial pipeline

The portfolio now uses `content/business/projects.json` as its shared evidence register. Interactive previews are labeled sample demonstrations; public build walkthroughs link inspected source and identify unverified runtime/account boundaries. Captures of source walkthroughs are explicitly distinguished from production account screenshots.

The Blog Writer has been replaced with a manual research, brief, draft and review pipeline. See [agent/README.md](agent/README.md) for the audit, configuration, demand signals, existing-intent updates, review packs and publication rules. Run `npm ci --prefix agent` before the full test suite. Provider generation requires explicit model selection and uses account quota. No new recurring jobs, prospecting or outreach are enabled.

## Client acquisition and sales operations

See [OPERATIONS.md](OPERATIONS.md). The private `/ops` workspace connects inquiry capture, qualification, evidence review, assessments, proposals, follow-up reminders, public-request research, the existing Blog Writer, public-evidence content drafts, and observed source reporting. External sending and publication are unavailable.
