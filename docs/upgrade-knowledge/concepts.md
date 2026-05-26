# UpGrade concepts (MVP-narrow)

Curated terminology and the supported experiment shape for the MVP consultant.
Mirrors [spec.md](../spec.md) §30 with stronger constraints.

## Core terms

- **App Context.** The client application where the experiment runs, identified by an app-name/key known to UpGrade.
- **Decision Point.** A specific location in the client app where UpGrade decides which condition a participant sees. Identified by `(site, target)`.
  - **Site.** Broader location category (page, function, interaction area).
  - **Target.** Specific element within the site (e.g. a problem ID, a hint button, a content area).
- **Condition.** A treatment variant (e.g. `control`, `hint_button`). MVP supports 2–3 conditions per experiment. The name `default` is reserved by UpGrade and **must never** be used as a condition name.
- **Assignment.** UpGrade's process of mapping a participant to a condition at the decision point.
- **Metric.** A measurable outcome (e.g. completion rate, time on task) used to evaluate the experiment. Each metric has a **key** (machine identifier like `completionRate`), a **datatype** (`categorical` or `continuous`), and — for categorical metrics — a list of **allowedValues** (up to 3). A metric on an experiment is referenced through a **query** that applies a statistic to the metric (see "Metric naming convention" below).
- **Participants — Include All.** MVP defaults all participants into the eligible group; no include/exclude filters.
- **Experiment Status.** Operational phase: `Inactive`, `Running`, `Paused`, `Completed`.

## Supported MVP experiment shape

The consultant must keep proposed designs inside this box:

- Between-subject, individual-level assignment (implicit — do not surface to the user).
- Exactly one decision point.
- **2 to 3 conditions.** At least one of them is conventionally named `control`, but the user may rename it. The name `default` is reserved by UpGrade and must never be used.
- **Weights default to equal across conditions** (50/50 for two, ~33.3/33.3/33.4 for three). The user may adjust but the sum should be 100.
- `Include All` participants.
- **1 to 3 simple metrics.** Each metric is either categorical or continuous (see "Metric naming convention" below). Categorical metrics support up to 3 `allowedValues`.

## Metric naming convention

When the consultant presents metrics to the user, name them in the format **`${metricKey} (${statistic})`**. This carries both the underlying metric and the way it's measured in a single human-readable string, and it matches the convention used in the UpGrade UI.

**For continuous metrics** the statistic is just the operation name:

| Display | UpGrade `operationType` |
|---|---|
| `Sum` | `sum` |
| `Min` | `min` |
| `Max` | `max` |
| `Count` | `count` |
| `Mean` | `avg` |
| `Mode` | `mode` |
| `Median` | `median` |
| `Standard Deviation` | `stddev` |

Examples: `timeOnTask (Mean)`, `attempts (Sum)`.

**For categorical metrics** the statistic combines an operation, a comparison, and a value:

| Display operation | UpGrade `operationType` |
|---|---|
| `Count` | `count` |
| `Percent` | `percentage` |

| Display compare | UpGrade `compareFn` |
|---|---|
| `=` | `=` |
| `!=` | `<>` |

`compareValue` must be one of the metric's `allowedValues`. Examples: `completionRate (Percent = COMPLETED)`, `outcome (Count != FAILED)`.

**Important:** the consultant only surfaces the single `compareValue` being measured (e.g. "Percent = COMPLETED"). It does **not** need to recite every `allowedValue` in the design. Mention the full allowed-values list only if the user asks or if it's load-bearing for the conversation (e.g. they want to switch which value gets the comparison).

The `repeatedMeasure` field on UpGrade queries is server-side concern, always `"MOST RECENT"` — the consultant never surfaces this and never picks something else.

## Presenting the design to the user

When you propose or summarize the experiment design in chat, **use a markdown list with this structure** — not a plain-text code block. Bullet-list rendering matches the rest of the chat surface and reads better than a monospace code block.

- **Name:** Hint Button Experiment
- **Description:** Tests whether adding an optional hint button improves completion rate on a target math problem.
- **App Context:** `ExampleMathApp`
- **Decision Point:**
  - Site: `problem_page`
  - Target: `problem_123_hint_support`
- **Conditions:**
  - `control` — 50%
  - `hint_button` — 50%
- **Participants:** Include All
- **Metrics:**
  - `completionRate (Percent = COMPLETED)`
  - `timeOnTask (Mean)`

Use this same shape whether you have two or three conditions, one to three metrics, etc. The values above are illustrative — replace with the user's actual experiment.

> **App context note for the simulation phase only:** during the consulting flow the AI uses whatever app context name fits the user (e.g. `ExampleMathApp`). At simulation time, the server overrides this with the only context the UpGrade demo backend has configured (`add`). The user does not need to know about this swap — the consultant should keep speaking the user's app context name.

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
- Condition names (~~other than the `control` label, which stays fixed~~ Even the `control` condition name can be changed when appropriate or asked by the user. Also, using "default" as condition name is not allowed when creating an experiment. We should prompt the AI to not use "default" for a condition name).
- Metric names (subject to keeping them simple).

Intentionally fixed in MVP:

- Single Decision Point
- Participants = Include All.
- Assignment design = individual-level, between-subject. (this will be implicit)
- ~~Condition count = 2.~~ Let's support up to 3 conditions and 3 metrics. At least 2 conditions and 1 metric is required.
- Weight default = ~~50 / 50~~ weighted equally (user may adjust, but consultant should default to this).

## TODO

- TODO(upgrade): If we identify a stable demo app-context name reserved for this tool, document it here so simulations consistently use it.
- TODO(upgrade): Confirm the canonical capitalization / casing UpGrade expects for site, target, and condition identifiers.
