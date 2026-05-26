> **PLACEHOLDER:** Replace this section with your team's real UpGrade onboarding instructions (account access, environment configuration, where the docs live, who to ping for help). The text below is filler so the report has something to render today.

Before you can run experiments with UpGrade, you'll need access to an UpGrade environment for `{{app_context}}`. The high-level steps are:

1. Make sure your app context (`{{app_context}}`) is registered in the UpGrade environment you intend to use. App contexts are configured at the deployment level — if it isn't already listed, work with whoever administers your UpGrade instance to add it.
2. Confirm you have an UpGrade account with permission to create experiments and define metrics in this environment.
3. Familiarize yourself with the [UpGrade documentation](https://upgrade-platform.gitbook.io/upgrade-documentation) — at a minimum, the sections on experiment configuration, decision points, conditions, and metrics.
4. Make sure your client application's user identifier is something that won't collide between deployments (e.g. a stable per-user UUID, not a session id).

If you don't yet have an UpGrade environment available, ask your platform owner about provisioning one before you proceed.
