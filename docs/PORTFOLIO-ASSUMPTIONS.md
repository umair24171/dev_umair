# Portfolio assumptions

All four agent projects passed their required native PostgreSQL and fresh-checkout Docker gates before portfolio source changes began. Existing portfolio records and demos remain as they were; the new CLI projects have a separate section and four generated pages. All new data is synthetic and measurements come from recorded CI runs. No live endpoint or real Claude quality is claimed.

A minimal branch-specific vercel.json disables automatic Git deployments for portfolio/agent-showcases. This is the only change outside portfolio content/tests/reporting, and is necessary to honor the explicit instruction not to deploy anything. It does not disable deployment of main or change production settings. The branch starts at a commit that already contains this guard, rather than pushing an unguarded intermediate branch. Do not merge without approval.

The portfolio uses server components, static JSON evidence, existing styles and a small scoped CSS module. No client hooks, network data fetching, new dependencies, live demos or generated screenshots were added. Actual CLI output is copied from Docker stdout in each project's verified native-ci-output.txt.
