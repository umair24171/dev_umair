# Portfolio assumptions

All four agent projects passed their required native PostgreSQL and fresh-checkout Docker gates before portfolio source changes began. Existing portfolio records and demos remain as they were; the new CLI projects have a separate section and four generated pages. All new data is synthetic and measurements come from recorded CI runs. No live endpoint or real Claude quality is claimed.

A minimal branch-specific vercel.json disables automatic Git deployments for portfolio/agent-showcases. This is the only change outside portfolio content/tests/reporting, and is necessary to honor the explicit instruction not to deploy anything. It does not disable deployment of main or change production settings. The branch starts at a commit that already contains this guard, rather than pushing an unguarded intermediate branch. Do not merge without approval.

The portfolio uses server components, static JSON evidence, existing styles and a small scoped CSS module. No client hooks, network data fetching, new dependencies, live demos or generated screenshots were added. Actual CLI output is copied from Docker stdout in each project's verified native-ci-output.txt.

The first website CI run failed in an unchanged pre-existing operations test. Its tamper fixture replaces the random authentication-tag prefix with a fixed `a`; when it already starts with `a`, no bytes change and the expected rejection does not occur. The portfolio PR does not modify operations code/tests. The unchanged suite was rerun, and this pre-existing flaky test remains explicitly disclosed rather than broadening the requested portfolio-only scope.
