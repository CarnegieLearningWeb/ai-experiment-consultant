# UpGrade concepts (MVP-narrow)

Curated terminology and the supported experiment shape for the MVP consultant.
Mirrors [spec.md](../spec.md) §30 with stronger constraints.

## Core terms

- **App Context.** The client application where the experiment runs, identified by an app-name/key known to UpGrade.
- **Decision Point.** A specific location in the client app where UpGrade decides which condition a participant sees. Identified by `(site, target)`.
  - **Site.** Broader location category (page, function, interaction area).
  - **Target.** Specific element within the site (e.g. a problem ID, a hint button, a content area).
- **Condition.** A treatment variant. MVP uses two: `control` and one variant (e.g. `hint_button`).
- **Assignment.** UpGrade's process of mapping a participant to a condition at the decision point.
- **Metric.** A measurable outcome (e.g. completion rate, time on task) used to evaluate the experiment.
- **Participants — Include All.** MVP defaults all participants into the eligible group; no include/exclude filters.
- **Experiment Status.** Operational phase: `Inactive`, `Running`, `Paused`, `Completed`.

## Supported MVP experiment shape

The consultant must keep proposed designs inside this box:

- Between-subject, individual-level assignment.
- Exactly one decision point.
- Exactly two conditions: `control` plus one named variant.
- Simple condition weights, default 50 / 50.
- `Include All` participants.
- A small number of simple metrics — typically one binary completion-style metric and one mean numeric metric. (Up to ~3 metrics is fine.)

## Example design (use as a shape reference, not a fixed template)

```text
Name:         Hint Button Experiment
Description:  Tests whether adding an optional hint button improves
              completion rate on a target math problem.
App Context:  ExampleMathApp
Decision Point:
  Site:       problem_page
  Target:     problem_123_hint_support
Conditions:
  control:    50%
  hint_button:50%
Participants: Include All
Metrics:
  completionRate (Percent = COMPLETED)
  timeOnTask     (Mean)
```

## Not supported in MVP

The consultant should recognize these patterns and explain that the MVP can't
configure them, then propose a supported alternative when possible. Don't
encode setup details for these — the goal is recognition, not capability.

- Factorial experiments (multiple factors crossed).
- Within-subject designs (same participant sees multiple conditions).
- Group-based assignment (assignment by class, school, cohort).
- Multiple decision points.
- Condition payloads.
- Exclude-if-reached behavior.
- Repeatable metrics.
- Complex include/exclude or stratification rules.
- Anything not explicitly listed under "Supported MVP experiment shape".

## Field-editing guidance

Free for the user to set or change:

- Name, description, app context.
- Site, target (with consultant guidance on naming conventions).
- Condition names (other than the `control` label, which stays fixed).
- Metric names (subject to keeping them simple).

Intentionally fixed in MVP:

- Participants = Include All.
- Assignment design = individual-level, between-subject.
- Condition count = 2.
- Weight default = 50 / 50 (user may adjust, but consultant should default to this).

## TODO

- TODO(upgrade): If we identify a stable demo app-context name reserved for this tool, document it here so simulations consistently use it.
- TODO(upgrade): Confirm the canonical capitalization / casing UpGrade expects for site, target, and condition identifiers.
