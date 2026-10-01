# BuildZn client acquisition and sales operations

## Operating interface

`/ops` is the authenticated owner workspace. Public routes never read the operations store. An eight-hour, signed, HttpOnly, SameSite=Strict cookie authenticates the owner. Passwords use scrypt with a random salt. All mutations require the same browser origin. Operations pages/API responses are private/no-store and noindex; the sitemap omits them. The workspace omits public navigation and analytics.

The initial offer is an **inquiry workflow pilot**: one intake source, validation, duplicate prevention, private records, editable reply drafts, human review, failure recovery and handover. This is an internal offer assumption based on the working inquiry demonstration, not evidence of client results or demand. Delivery dates, prices, payment terms and ongoing service require individual approval. The proposal editor requires the operator to enter an internal proposed price; no default public price is invented.

## Workflows

1. **Inquiry:** website form → same-origin validation and abuse limits → durable private lead → source attribution → missing discovery information → operator confirmation of service fit and qualification → editable reply → approval of the exact version → manual download. An inquiry is not authority to accept a project or send an automated reply. Public capture returns only an acceptance flag, never lead identity or whether an email is already in the store.
2. **Opportunity:** manually scan the official n8n issues API → bounded support requests with source URL, original date, retrieval time and source-text digest → review exact evidence → technical assessment → approve assessment → outreach draft. No contact list is scraped, no personal contact address is inferred, and a support request does not establish buyer intent or consent. Broader sources need a reviewed allowlist/API adapter.
3. **Assessment:** reviewed supplied workflow or public source → recorded observation/report → fit and suggested diagnostic approach → explicit unverified assumptions. A reviewed report is not a reproduced defect, security audit or savings measurement.
4. **Proposal:** save discovery notes → approve a hash of those notes → draft deliverables, milestones, acceptance criteria, dependencies, exclusions, proposed maintenance and operator-supplied USD price → individually approve → advance to proposal. Editing notes revokes proposal approvals. Won requires confirmation of an actual external agreement; handoff prepares access and acceptance notes. Marking won is a bookkeeping action, not an acceptance message.
5. **Follow-up:** choose a future time → due reminder → manually prepare draft → individual review. No background worker sends anything. Declines and opt-outs close all records for the same supplied email, suppress future contact preparation for that address, clear reminders and revoke all draft approvals. A lost record cannot re-enter the active pipeline automatically.
6. **SEO:** import an actual English Search Console Queries export with date range and filters, or use clearly identified editorial hypotheses → existing Blog Writer ranking and overlapping-intent checks → article/update preparation → grounded deterministic checks and independent model review → human gate. Site query metrics are not market search volume. No Search Console account is automatically connected.
7. **Content:** inspect the shared public portfolio evidence and limitations → explicitly approve the selected evidence → truthful case study, walkthrough or social draft → edit/review → exact-version approval → manual download. Samples remain identified. Private client evidence is not imported.
8. **Reporting:** source-linked observed inquiries/requests, qualification, actual call records, approved proposals advanced in the pipeline and externally confirmed agreements. Samples are excluded by default. Agreement value is not collected revenue. No traffic attribution, savings or conversion uplift is inferred from these counts.

## Storage and access

Production uses a separate **private GitHub repository**, never the public source repository. State is encrypted with AES-256-GCM and a random nonce before upload. Every read verifies the repository remains private. GitHub file SHA comparison provides optimistic concurrency; conflict retries rerun side-effect-free state changes. Client operation IDs prevent duplicate mutations and reject reuse with different data. Provider calls run outside retryable state transactions. GitHub snapshots supply a recovery history, but are not a substitute for an independently tested backup.

This is a bounded low-volume deployment, with a maximum of 500 lead records and 700 KB encrypted state. API quota, write latency and Git history make it unsuitable for high-volume ingestion or indefinite retention. Jobs, receipts, audit events and evidence also consume the size limit. Fail closed rather than evicting personal data silently. Move to a private transactional database before reaching either limit. Do not represent local-file or mocked-storage tests as a live GitHub integration.

Development uses an encrypted file under ignored `work/`. Writes acquire a filesystem lock and use atomic rename. If a process crashes, inspect active writers before removing a stale `.lock` directory. Production rejects a local ephemeral store unless explicitly configured for a controlled local preview; Vercel always rejects it.

Required server-only environment variables:

- `OPS_PASSWORD_HASH`: `salt:scrypt(password,salt,64).hex`. Never use the test password in production.
- `OPS_SESSION_SECRET`: random secret of at least 48 characters. Rotation invalidates sessions.
- `OPS_DATA_KEY`: 32 random bytes represented as 64 hexadecimal characters. Back it up securely; loss makes stored records unreadable.
- `OPS_STORE_REPO`: separate private `owner/repository`, with a `main` branch.
- `OPS_STORE_TOKEN`: Contents read/write for that private repository. Prefer a fine-grained token with only this repository. Do not expose it to the browser or add it to source.
- Optional `OPS_PUBLIC_ORIGIN`: exact public origin when a proxy rewrites Host. Otherwise origin is matched to the request host/protocol.

The old Vercel `GITHUB_TOKEN` was observed to return HTTP 401 during this audit. Do not claim that connection works. The confirmed GitGuardian alert on `url.password || url.port` in commit cd1081f remains a false positive and was not treated as a credential leak.

**Deletion and retention:** encrypted prior snapshots remain in Git history. Removing a current record alone does not erase historical records. Handle requests by removing current data and purging retained repository history/backups through an explicit, approved administrative process, or migrate retained live records to a new encrypted store with a new key and retire/purge the old repository. Confirm deletion with the storage provider; do not promise cryptographic erasure while recoverable keys or snapshots remain. No destructive purge is automated by this implementation.

## Spending and model operation

`OPS_AI_ENABLED` defaults to disabled. To enable article drafting, first verify the account's current model and pricing, then configure:

- `GEMINI_API_KEY` and explicit `GEMINI_MODEL`.
- `OPS_AI_INPUT_USD_PER_MILLION` and `OPS_AI_OUTPUT_USD_PER_MILLION` from the current applicable account rates.
- `OPS_AI_DAILY_USD_CAP`, a positive, approved daily maximum.
- `OPS_AI_ENABLED=true` after reviewing the above values.

Each fresh article run reserves at most 15 provider attempts before work starts; a saved-pack resume reserves eight and stops before exceeding that reservation; the default daily maximum is 24 reserved attempts per UTC day. Each attempt reserves up to 100,000 input and 12,000 output tokens, including retries. Context size is bounded conservatively. Reservations use account rates and are estimates, not bills; confirm that rates include the chosen model's applicable reasoning/context pricing. Reservations stay counted on failure to prevent repeated outage calls from overspending. Actual charges are controlled by the provider. No silent model fallback is installed. No provider calls occur if rate/cap setup is incomplete or a reservation would exceed the cap.

A real recovery run on 2026-10-01 completed all independent reviews using `gemini-3.1-flash-lite` and reached `ready-for-human-review`; the article remains unpublished. The prior `gemini-3.8-flash` encountered HTTP 503 and later free-tier HTTP 429. The model was changed explicitly, without an automatic fallback. Approved topic wording is accepted without keyword stuffing, and code excerpts receive a truthful execution disclaimer. Citations may use either the approved source URL or its actual recorded retrieval URL; other external files remain rejected.

Actual Search Console data was exported from the signed-in verified `https://www.buildzn.com/` property on 2026-10-01 and imported into production SEO planning: Web, 2026-06-29 through 2026-09-28, no additional filters. This is a manual CSV import, not an automatic OAuth integration. New exports can be pasted into Research & SEO with their reporting range and filters. Search impressions are observed property impressions, not market search volume or evidence of client conversions.

The existing Blog Writer CLI is still manual and uses provider account quota. Its separate recovery path reuses brief/candidate work and requires fresh, approved source packs less than 24 hours old. The new workspace preserves failed run evidence, candidates and review reports in encrypted job results. A failed model review never produces an accepted article. Use Resume saved article review to reuse the retained source pack, brief and candidate while evidence is less than 24 hours old; it rechecks current published intents and editorial gates. Start fresh when the pack is stale or incomplete. Manually retry after inspecting the provider/account; do not loop indefinitely during an outage.

## Disabled schedules

`content/business/operations-schedules.json` documents disabled proposed jobs:

- Public requests: weekly, Monday 09:00 Asia/Karachi; bounded GitHub API reads, no model calls.
- SEO planning: monthly after actual Search Console data; deterministic, no model calls.
- Follow-up review: weekdays 10:00 Asia/Karachi; draft preparation only, no sending.

A disabled `scripts/ops-runner.mjs` is supplied. It requires both the checked-in manifest flags and OPS_JOBS_ENABLED=true, plus an authorized HTTPS origin and server-only owner credential. No scheduler is installed or active. Before activation, review source terms/API quotas and hosting costs, approve the specific schedule, install a draft-only runner and reuse deterministic operation keys for its scheduled window. A schedule never grants authority for a message, price, proposal, publication or commitment.

No service was purchased, paid subscription started, or prospect outreach sent. GitHub/Vercel usage consumes existing account allowances; overage amounts are not known. Production manual drafting uses the existing Gemini account with explicit `gemini-3.1-flash-lite`, a conservative $1 daily reservation ceiling, and reference text token rates of $0.25 input / $1.50 output per million tokens (including thinking). Each fresh article reserves $0.645 at these rates; a saved-pack resume reserves $0.344. One fresh run plus one resume can fit under the $1 ceiling; a second full article in the same UTC day is blocked. This estimates a maximum reservation, not an observed bill; the account may use free quota. No billing was enabled. See https://ai.google.dev/gemini-api/docs/pricing before changing the model or rates. Inbox notification/email sending integrations are not installed.

## Recovery and approvals

- Storage outage: keep entered data, fix account/network access, retry the identical command. The UI preserves its operation ID for an identical retry. A successful commit with a lost HTTP response does not duplicate a lead.
- Conflict: bounded reload/replay; return a recoverable conflict if contention persists.
- Invalid/uncertain model response: reject incomplete JSON, unsupported claims and failed independent review. Preserve run diagnostics. No fallback is labeled as model output.
- Public API outage: bounded retries; save a failed job and its reason. Re-run manually after recovery. Source links and request dates remain inspectable.
- Interrupted long-running job: inspect activity, provider status and retained output before a fresh manual run; do not treat a `running` record as proof of successful completion.
- Approval: save all changes, check facts/recipient/evidence/terms, approve the current version, then download. Sending/publication adapters are intentionally unavailable; use the individually approved artifact manually. Edits revoke approvals.
- Access loss: rotate owner password hash/session secret through the configured Vercel account. Token and encryption key stay server-only. Restore a known valid encrypted snapshot if needed, first preserving the failed version for diagnosis.

## Validation

Run `npm run lint`, `npm run check`, `npm test`, `npm run build`, then start the controlled preview with `node scripts/ops-test-server.mjs` and run `npm run test:browser`. The preview creates test-only authentication and an encrypted local store; it is not production account setup. Browser tests use fictional records and simulated public contact responses. Run deployed tests only with the production owner password supplied privately in `OPS_TEST_PASSWORD`; all created records are labeled samples.

Tests cover inquiry qualification, duplicate inputs and conflicting operation IDs; evidence approval and withdrawal; technical assessment/outreach gates; discovery/proposal/pipeline/follow-up/handoff; opt-outs; approved project content; source attribution; encryption/tamper rejection; concurrent local storage and simulated GitHub CAS conflicts; sessions, origin validation, unauthorized API/export access and blocked sending/publication; provider outage/attempt budgeting; the Blog Writer's grounded article checks; and desktop/390px/320px browser accessibility.

A live Blog Writer recovery test on October 1, 2026 reused retained evidence and candidate work and again returned HTTP 503 during editorial review after bounded retries. It did not produce a final accepted draft or publish content. See the separate handoff test record for final deployed validation and exact account dependencies.
