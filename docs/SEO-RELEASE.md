# BuildZn SEO implementation — 24 October 2026

User-authorized implementation and production release of the public audit action plan. Baseline production/source: `4d9887564b5abfb04a4a57bf9448c33a528822b4`. No private operations, sending behavior, pricing commitments, account permissions or paid services changed.

## Changes

- C1/O3: four clearly labeled illustrative service scenarios explain inputs, output, acceptance tests, failure handling and exclusions. Contextual links connect service decisions to engineering notes. Existing consent-controlled tracked links measure evidence navigation only when consent is granted.
- C2: founder biography links two dated public implementation records. Git author/profile identity and actual source changes checked; no client results, employment, credentials or endorsements invented.
- O2: first portfolio group now has an H2 above its H3 cards. Work links the review-boundary note.
- GEO-01: duplicate-topic article source/tests pinned to the inspected baseline SHA, explicitly identified as the new review snapshot rather than claiming the original reviewed revision.
- SCH-01/SCH-02: personal profile links belong to Person, not Organization. Visible breadcrumbs and matching BreadcrumbList/page context added to about, contact, work, services and articles. Shared identity IDs remain stable.
- O1: three long article titles shortened without changing canonical URLs or publication dates. Accurate updated date supplied.
- C3: fictional-rate operating estimate with checked arithmetic and an illustrative n8n request/observation worksheet. No live n8n reproduction or vendor price claimed. Primary Webhook docs rechecked.
- T-03: exact `devumair.vercel.app` production alias redirects permanently to corresponding www paths with queries retained. Preview deployment hosts are not redirected.
- T-02: matching permanent apex-host application fallback added. Existing Vercel domain-level redirect takes precedence and still needs its status changed from default307 to308. Available connector does not expose updating an existing project domain; cloud dashboard requires sign-in. Domain was not removed/re-added or DNS modified as a workaround. HTTP-to-HTTPS platform hop may remain.
- T-01: compatible report-only CSP observation phase. Existing security headers retained; no collection endpoint or new telemetry added. This permissive static baseline allows necessary Next inline code/styles and consented analytics, does not claim nonce-level protection, and is not enforced.
- M1: cloud build, responsive screenshots and automated accessibility checks run with npm-distributed Chromium after standard Playwright download failed. Narrow scroll regions made keyboard accessible after axe findings. Local Lighthouse is a controlled lab check, not production/CrUX field evidence.
- M2: no current owner-side Search Console/GA4 credentials or export available in this task. Old operational documentation mentions a historical import; that is not current indexing or traffic evidence. No URL submitted for indexing.

## Validation and limits

Run `npm run lint`, `npm run check`, `npm test`, `npm run build`; then `SMOKE_URL=http://127.0.0.1:3101 node scripts/seo-release-check.mjs` against a local production build. The release check reads every canonical sitemap page, verifies status, canonical, oneH1, identity graph, new service evidence and report-only header. Browser coverage: seven templates at375/390/768/1440px; axe WCAG2A/AA and2.1AA subset, page errors and horizontal overflow, screenshots. Automated checks are not a full accessibility certification.

The existing48 tests plus the new keyboard-scroll regression cover public content, demo logic, editorial boundary and private-operation regression without live records or outbound messages. Smoke checks cover26 routes, retired URLs/redirects, sitemap, article API, search and image endpoints. Private production stores and live contact submission are excluded.

## Validation targets and leading indicators

Check canonical alias redirect path/query preservation and no loop. Recheck all30 sitemap pages after release. Track service-to-note navigation with existing consent only, qualified inquiry quality if supplied, and verified GSC selected canonicals/query impressions when available. No traffic or ranking uplift predicted. Investigate report-only CSP violations before enforcement, and repeat field measurements when real data is available.

## Rollback

Previous production deployment: `dpl_CmWygvc5SLc9jsrhoCZ6eXSVKTc3` (baseline SHA above). Vercel rollback or re-promote that known build if a material regression appears. Keep source history and record actual deployed SHA. Existing main auto-deploy is disabled; release uses explicit Vercel deployment of the reviewed commit.

## Primary guidance checked

- https://nextjs.org/docs/app/guides/content-security-policy
- https://vercel.com/docs/routing/redirects
- https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/

## Pre-release result

All49 unit/regression tests, type checks, lint and production build passed. All30 canonical sitemap pages passed the release checks. The final28 browser samples (seven pages × four viewport widths) had no axe violations in the selected rules, no captured JavaScript page errors and no horizontal document overflow. The first pass found keyboard-scroll defects in the new table/code examples; these were fixed and retested. Screenshots retained in the release evidence bundle.

Lighthouse13.5.0 completed an incomplete local mobile run: performance score null because screenshot-derived audits reported `NO_SCREENSHOTS`; server-response audit also lacked navigation insights. Accessibility, best-practices and SEO categories were100 in that narrow local run. Reported local LCP2.9s/CLS0/TBT0ms are partial lab observations, not production field CWV, and should not be used to claim a passing production performance score.
