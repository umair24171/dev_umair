# BuildZn production release

The user requested “Deploy it” on 24 October 2026 and completed the Vercel team access consent. This supersedes the original no-hosting instruction for the BuildZn website only. The four agent projects remain CLI showcases, with no hosted service or live paid-model calls.

- Public portfolio: https://www.buildzn.com/work
- Vercel project: dev_umair, prj_hiuaYV4cRx4ncwpGLythSqDIAawM
- Verified owning team: team_5CYTrZ5psJ5nWPujc5ri30eu
- Source: umair24171/dev_umair, commit 231a0f16dcde3e32a48985b216fe61eaec62fa54
- Production deployment: dpl_GqBWfAKvic9JH5VmsYRDU4S5cMKh
- State: READY, production, Node 22, Next.js 16.3.8
- Build duration: 62.479 seconds from the returned buildingAt/ready timestamps.
- Assigned domains include www.buildzn.com and buildzn.com. The apex redirects to www.
- Previous production / rollback candidate: dpl_Hx3dYyLV68j9NyECD9Q7uZ1jxFBs, commit 6c84964c09958a8a0ec180fae6bdbf2c7b98bad3.

## Public checks actually run

Ten anonymous HTTPS requests returned 200: /work, /sitemap.xml, the four project pages and their four WebP illustrations. Each page contained its expected heading, synthetic-data illustration disclosure and correct GitHub source link. The image bytes matched the exact committed Git blob hashes. All four routes appeared in the sitemap. buildzn.com/work redirected to https://www.buildzn.com/work.

The live browser showed the new section and confirmed all four optimized card images were complete with a nonzero natural width. Before release, the source passed 48 unit tests, 22 browser tests, smoke checks, lint, types and build; each page had 1440/390/320px layout and WCAG checks. This public smoke verification made no form submissions, customer actions or model calls.

Project routes:

- https://www.buildzn.com/work/agents/invoice-to-cash-agent
- https://www.buildzn.com/work/agents/support-resolution-agent
- https://www.buildzn.com/work/agents/permission-aware-knowledge-search
- https://www.buildzn.com/work/agents/sales-call-to-crm-sync

## Observability and limits

The error/fatal runtime-log count query scoped to this deployment returned no groups in the 10-minute window after release. This is a short observation window, not ongoing monitoring or proof that every runtime path is error-free. No project log drains are configured. Existing documented operations-test and Google font-loader flakes remain unchanged.

Automatic Git deployment remains disabled for main and the portfolio branch. The existing Vercel connection created this one explicitly authorized manual release from the verified commit. Future releases are manual until that policy is changed. This documentation commit does not change application source or trigger another deployment.
