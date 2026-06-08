# Client integration (MVP-narrow)

Curated reference for what the AI consultant should tell users about
integrating UpGrade into a client app for a simple, MVP-shaped experiment.

This is a **skeleton** — many specifics are TODOs that should be verified
against the real UpGrade documentation before being baked into the consultant's
prompt or the generated report.

Authoritative source: https://upgrade-platform.gitbook.io/upgrade-documentation

## Conceptual flow

For a simple between-subject experiment with one decision point, the client
app does roughly this:

1. **Initialize** the UpGrade client SDK with the app context and a user identifier.
2. At the decision point, **request an assignment** to find out which condition this participant is in.
3. **Render the appropriate UI** for that condition (control or variant).
4. **Mark** that the participant reached the decision point.
5. **Log metric events** as the relevant outcomes happen.

Steps 4 and 5 are what feed UpGrade's enrollment numbers and metric results.

## Code snippets

> **TODO(upgrade):** Confirm SDK names, function signatures, and the exact JSON
> request/response shapes against the real UpGrade docs before exposing these
> in the consultant's generated reports. The snippets below are intentionally
> placeholder-shaped so reviewers can spot them.

### TypeScript / JavaScript (placeholder)

```js
// TODO(upgrade): replace with the real UpGrade client SDK init.
const upgrade = new UpgradeClient({
  apiBaseUrl: 'https://upgrade-demo.carnegielearning.com/api',
  context: 'example-math-app',
  userId: currentUser.id,
});

// At the decision point:
const assignment = await upgrade.getAssignment({
  site: 'problem_page',
  target: 'problem_123_hint_support',
});

if (assignment.condition === 'hint_button') {
  renderHintButton();
} else {
  renderControl();
}

await upgrade.markDecisionPoint({
  site: 'problem_page',
  target: 'problem_123_hint_support',
  condition: assignment.condition,
});

// When the relevant outcome happens:
await upgrade.logMetric({
  metric: 'completionRate',
  value: 'COMPLETED',
});
```

### Python (placeholder)

> **TODO(upgrade):** Confirm whether an official Python SDK exists. If not,
> sketch a minimal `requests`-based wrapper here instead.

## What the consultant should and shouldn't promise

- It is fine to describe this conceptual flow and propose decision point /
  condition / metric names tailored to the user's app.
- It is **not** fine to claim that the consultant has read the user's repo, or
  that the snippets it produces can be dropped in without review.
- The report template should always end the client-integration section with a
  "review with your developers before shipping" note.

## TODOs to resolve before M5

- TODO(upgrade): Confirm whether SDK methods are async / sync / callback-based.
- TODO(upgrade): Confirm the exact metric `value` semantics (string enums? numbers? both?).
- TODO(upgrade): Confirm any required headers, auth tokens, or context registration steps.
- TODO(upgrade): Decide which language(s) the generated report should include snippets for. Spec §28 mentions TypeScript/JavaScript and Python — confirm scope.
