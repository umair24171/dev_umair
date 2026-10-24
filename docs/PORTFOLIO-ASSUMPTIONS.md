# Portfolio assumptions

All four agent projects passed their required native PostgreSQL and fresh-checkout Docker gates before portfolio source changes began. Existing portfolio records and demos remain as they were; the new CLI projects have a separate section and four generated pages. All new data is synthetic and measurements come from recorded CI runs. No live endpoint or real Claude quality is claimed.

The initial vercel.json disabled automatic Git deployment for portfolio/agent-showcases before the first push. The user approved the PR on 24 October 2026. The guard now also disables automatic deployment from main so merging cannot publish the site. This minimal deployment configuration exception is necessary to honor the no-hosting instruction. Other branches keep their existing behavior. A future publication requires explicit authorization.

The portfolio uses server components, static JSON evidence, existing styles and a small scoped CSS module. No client hooks, network data fetching, new dependencies or live demos were added. The later user-requested generated illustrations are conceptual covers, clearly labelled and not presented as screenshots; see PORTFOLIO-IMAGERY.md. Actual CLI output is copied from Docker stdout in each project's verified native-ci-output.txt.

The first website CI run failed in an unchanged pre-existing operations test. Its tamper fixture replaces the random authentication-tag prefix with a fixed `a`; when it already starts with `a`, no bytes change and the expected rejection does not occur. The portfolio PR does not modify operations code/tests. The unchanged suite was rerun, and this pre-existing flaky test remains explicitly disclosed rather than broadening the requested portfolio-only scope.

Publication authorization update, 24 October 2026: the user explicitly requested “Deploy it” and completed the Vercel team access approval. This authorizes the BuildZn website production release documented in DEPLOYMENT.md. It does not deploy any of the four CLI agent projects or enable recurring Git deployments. Earlier no-deployment assumptions describe the original task checkpoint.
