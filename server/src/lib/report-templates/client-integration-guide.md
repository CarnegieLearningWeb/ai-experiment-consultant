> **PLACEHOLDER:** The snippet below is a scaffold. Replace the `TODO: render variant for …` comments with the actual UI/behavior for each condition. Verify the SDK function names and signatures against the UpGrade documentation and your client's installed version.

Your client application needs to ask UpGrade which condition the current user is in at the decision point, render the appropriate variant, mark the decision point, and log metric outcomes as they happen.

Below is a JavaScript / TypeScript scaffold tailored to this experiment:

```js
// TODO(upgrade): replace with the real UpGrade client SDK init for your codebase.
const upgrade = new UpgradeClient({
  apiBaseUrl: 'https://upgrade-demo.carnegielearning.com/api',
  context: '{{app_context}}',
  userId: currentUser.id, // a stable per-user identifier
});

// 1. Initialize the user (idempotent).
await upgrade.init();

// 2. At the decision point, ask UpGrade which condition this user is in.
const assignment = await upgrade.getAssignment({
  site: '{{site}}',
  target: '{{target}}',
});

// 3. Render the appropriate variant for the assigned condition.
{{conditions_branch_code}}

// 4. Mark that the user reached the decision point.
await upgrade.markDecisionPoint({
  site: '{{site}}',
  target: '{{target}}',
  condition: assignment?.condition,
});

// 5. Log metric values as the relevant outcomes happen.
//    Call upgrade.logMetric(...) for each metric you defined on the experiment:
{{metrics_log_block}}
```

**Before shipping, review this with your developers.** The snippet above does not reflect your codebase's module structure, error handling, async patterns, or analytics conventions. Treat it as a structural guide, not production code.
