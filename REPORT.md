# REPORT.md: BuildZn agent portfolio

All four synthetic CLI projects are built, public and verified in GitHub Actions. No hosting deployment or production merge was performed.

## Projects and measured results

| Project and source | Distinct cases | Native passed / skipped | Embedded passed / skipped | CI and Docker demo |
| --- | ---: | ---: | ---: | --- |
| [Invoice to cash agent](https://github.com/umair24171/invoice-to-cash-agent) | 39 | 38 / 1 | 37 / 2 | [Passed](https://github.com/umair24171/invoice-to-cash-agent/actions/runs/40029159866) |
| [Support resolution agent](https://github.com/umair24171/support-resolution-agent) | 35 | 35 / 0 | 35 / 0 | [Passed](https://github.com/umair24171/support-resolution-agent/actions/runs/40030071043) |
| [Permission aware knowledge search](https://github.com/umair24171/permission-aware-knowledge-search) | 24 | 24 / 0 | 24 / 0 | [Passed](https://github.com/umair24171/permission-aware-knowledge-search/actions/runs/40030755414) |
| [Sales call to CRM sync](https://github.com/umair24171/sales-call-to-crm-sync) | 30 | 30 / 0 | 30 / 0 | [Passed](https://github.com/umair24171/sales-call-to-crm-sync/actions/runs/40031451224) |

There are 128 distinct cases, each passed in at least one appropriate environment. Zero failures in the linked verified runs. Invoice's two real process-kill tests passed on native PostgreSQL; its disk-reopen test passed on the embedded engine. Across all four runs, native execution passed 127 cases and skipped that one embedded-only case; the embedded complement passed 126 and skipped the two native-only process-kill cases. These are complementary environments, not 256 distinct tests.

Each native run also passed dependency installation, formatting, TypeScript, the configured full-history credential scan, the native seeded demo and a Docker Compose build/demo from a fresh checkout and isolated volume. Actual logs and output are committed under each repo's docs directory. No live Claude calls or network cost in tests.

## What was built

- Invoice to cash: explicit-reference reconciliation, partial/multiple/overpayments, duplicate and currency review, persistent day-14 jobs, a draft worker, history escalation, approval/dry-run gates, crash recovery and an idempotent transactional demonstration mailbox.
- Support resolution: mock store tools for refund, address change and reschedule; identity/policy/limit guards, persistent idempotency, atomic action audit, error audit and escalation. The 160-ticket synthetic replay resolved 50 (31.25%) and escalated 110 (68.75%), with zero wrong-action/state/label mismatches. It uses 16 templates and a deterministic provider, so it is not a production or Claude benchmark.
- Permission aware search: mock Drive/Slack/Notion ACL connectors, live group/link revocation, recursive folder inheritance, stale-content exclusion and access filtering inside SQL before pgvector ranking. Native and embedded leak suites each checked 1,728 synthetic user/query pairs with zero unauthorized chunks. A five-query lexical quality eval measured recall@3=1.0 and MRR=1.0.
- Sales call to CRM: evidence/quote validation, speaker/contact preservation, conflict merging across long transcripts, documented timezone interpretation, call deduplication, follow-up drafts, exact before/after diffs, approval hashes, version checks and atomic idempotent mock writes/audit. A 4,000-line synthetic transcript was included in tests.

Every repo contains a plan with written edge cases, assumptions, README architecture/tradeoffs/limits, PROGRESS.md, REPORT.md, synthetic fixtures, tests, mock/Claude provider interfaces, Docker Compose and CI. There is no project UI, so no fabricated UI screenshots or live demo links were added.

## Portfolio changes in this PR

Added a separate section to /work and four generated pages under /work/agents/. Each page shows the problem, architecture, tradeoffs, native/embedded test results, known limits, actual Docker stdout and links to public source and its verified CI run. Added sitemap entries and seven browser checks for source/evidence links, original filter behavior, 1440/390/320px layout, WCAG checks, unknown-route 404 and sitemap coverage. Existing portfolio records, browser demos, homepage, services and contact flow were preserved.

A minimal vercel.json disables Git-triggered deployment only for portfolio/agent-showcases. This is necessary to honor the no-deployment instruction while opening a PR on an existing Vercel-linked repo. The first remote branch commit already includes the guard. It leaves main deployment behavior unchanged. The branch must not be merged without user approval.

## Website validation

Local lint, type checks, 48 unit tests and the production build passed. The full [hosted website CI passed](https://github.com/umair24171/dev_umair/actions/runs/40032813329/attempts/2): lint, types, 48 unit tests (10 content/demo, 15 agent and 23 operations cases), production build, smoke checks covering 26 public routes plus redirects/sitemap/API/search/images, and all 22 browser tests. The seven new portfolio tests passed, including all four pages at 1440, 390 and 320 pixels with WCAG scans, evidence/source links, original filters, 404 and sitemap checks. Selected actual timestamped output is saved in docs/agent-portfolio-ci-output.txt. All tests used synthetic data. Local browser execution was unavailable on the authoring host; the complete browser suite ran on GitHub instead.

The React review checklist was applied: server components, static module data, no client hooks or request state, stable keys, semantic sections/tables/links, keyboard-scrollable output, scoped responsive styles, no new dependencies and no network data fetching.

## Assumptions, resolved blockers and limits

Owner umair24171 and site source umair24171/dev_umair were verified. The initial repository-creation blocker was resolved through secure browser authentication and public repo creation, then narrowly adding only the four synthetic repos to the existing connector installation. Existing repository grants stayed unchanged. No persistent credential was created, printed or committed. Docker/native PostgreSQL verification ran on standard public GitHub-hosted runners instead of requiring Docker in the authoring host.

The first invoice native run exposed a Node IPC harness bug: the message event includes an optional transport handle. The readiness assertion now checks its payload while preserving actual SIGKILL, rollback, resume and single-delivery requirements. No test was deleted or weakened.

All data is synthetic, operator identities are trusted local context, external tools are mocked, source is MIT licensed, and production model/connector/transport/authentication guarantees are outside scope. These limits are stated on each portfolio page and in each repo. No real customer actions, emails, CRM writes, paid API calls or hosting were performed. Credential-pattern scans and fixture review are bounded checks, not a guarantee that every possible secret pattern is detectable.

The first website attempt failed in an unchanged operations test: replacing a random authentication-tag prefix with a fixed `a` occasionally changes no bytes. The unchanged suite passed on rerun. This pre-existing flaky test remains disclosed and outside this portfolio-only change; no test was weakened or removed.

Final project documentation commits also passed their complete native/embedded/scan/Docker workflows: [invoice](https://github.com/umair24171/invoice-to-cash-agent/actions/runs/40033958271), [support](https://github.com/umair24171/support-resolution-agent/actions/runs/40034000594), [search](https://github.com/umair24171/permission-aware-knowledge-search/actions/runs/40034055390) and [CRM](https://github.com/umair24171/sales-call-to-crm-sync/actions/runs/40034112125).

[BuildZn PR #24](https://github.com/umair24171/dev_umair/pull/24) is open and unmerged. All requested implementation and demo work is complete. No project blockers remain. Production integration and live Claude quality remain documented limits; the existing site test flake remains a known issue. No deployment was created and main remains unchanged. Review and explicit user approval are required before a future merge.
