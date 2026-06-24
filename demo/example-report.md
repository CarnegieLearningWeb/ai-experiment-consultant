# Hint Button Experiment Plan

## 1. Summary

This plan proposes a 50/50 experiment in MiniMathApp comparing the current area word-problem page with a version that adds an optional hint button. It measures first-attempt correctness and total time-on-task while monitoring whether students open the hint before their first answer submission.

## 2. Learning App Description

MiniMathApp is a math practice app for middle-school students who work through one problem at a time in topic-based practice units.

## 3. Page / Problem Description

The target is an area word-problem page about a rectangular garden. The page presents the problem, a labeled rectangle diagram, an answer field, and a Check answer button. Many students get stuck or answer incorrectly on the first try.

## 4. Experiment Idea

Add an optional Show hint button to the existing area word-problem page while leaving the control experience unchanged. At the first answer submission, record first-attempt correctness and whether the hint was opened before that submission. Record total time-on-task when the student completes or exits the problem.

## 5. Hypothesis

Adding an optional hint button will improve first-attempt correctness without substantially increasing time-on-task compared with the current page. Premature hint use is a diagnostic measure used to interpret how students engage with the intervention, not an additional predicted outcome.

## 6. Related Research Grounding

The papers below were selected as related background for this experiment idea. They do not verify that the proposed intervention will work, but they may help refine the hypothesis, condition design, and metrics.

1. **[Revisiting the Hint Button: Consistent Negative Associations Between Unproductive Hint Use and Learning Outcomes in Intelligent Tutoring Systems](https://www.semanticscholar.org/paper/71eb7a29ba027978057bec9018a054fa383bacef)** — An et al., 2026
   - Relevance: A multi-semester study of 999 K-12 math students that directly examines on-demand hint buttons in tutoring systems. This is the same mechanism in a closely related school-age population.
   - Design implication: Suggests tracking how hints are used (e.g. premature requests, superficial reading), so consider a hint-usage metric alongside first-attempt correctness rather than assuming hints are always productive.

2. **[Designing for Metacognition — Applying Cognitive Tutor Principles to the Tutoring of Help Seeking](https://www.semanticscholar.org/paper/722b988491e01647ac2827ec010de4f24196d0ae)** — Roll, Aleven, McLaren & Koedinger, 2007
   - Relevance: A foundational, heavily-cited study on help-seeking and on-demand help in math cognitive tutors, directly relevant to how students engage an optional hint.
   - Design implication: Reinforces measuring whether students use help appropriately, supporting a hint-engagement metric and caution against interpreting correctness gains in isolation.

3. **[Typifying Students' Help-Seeking Behavior in an Intelligent Tutoring System for Mathematics](https://www.semanticscholar.org/paper/fcc06aae6014ac5f6702f016bf1853b3b680e4fb)** — Meléndez-Armenta et al., 2021
   - Relevance: Studies help-seeking behavior among secondary math students in an ITS, matching MiniMathApp's mechanism, subject, and age range.
   - Design implication: Indicates that help-seeking varies across students, reinforcing the need to monitor hint use rather than interpret it as a uniform behavior.

## 7. Proposed UpGrade Experiment Design

**Name:** Hint Button Experiment

**Description:** Tests whether adding an optional Show hint button on the area word-problem page improves first-attempt correctness without substantially increasing time-on-task, while monitoring whether students open the hint before submitting a first answer.

**App context:** `minimath-app`

**Decision point:**
- **Site:** `problem_page`
- **Target:** `area_rectangle_hint_support`

**Conditions:**

| Condition code | Weight |
|---|---|
| `control` | 50% |
| `hint_button` | 50% |

**Metrics:**

- **firstAttemptCorrect (Percent = CORRECT)** — categorical, allowed values: `CORRECT`, `INCORRECT`
- **timeOnTask (Mean)** — continuous
- **prematureHintUse (Percent = PREMATURE)** — categorical, allowed values: `PREMATURE`, `NOT_PREMATURE`

**Participants:** Include All  ·  **Assignment:** Individual, between-subject

## 8. Simulation Result Summary

> Synthetic / preflight only — these numbers demonstrate UpGrade's data flow and do not predict real learning outcomes.

**Cohort size:** 200

**Enrollment**

| Condition | Participants |
|---|---|
| `control` | 98 |
| `hint_button` | 102 |

**Metric results**

**firstAttemptCorrect (Percent = CORRECT)**

| Condition | Statistic value |
|---|---|
| `control` | 48.98 |
| `hint_button` | 61.76 |

**timeOnTask (Mean)**

| Condition | Statistic value |
|---|---|
| `control` | 29.85 |
| `hint_button` | 32.76 |

**prematureHintUse (Percent = PREMATURE)**

| Condition | Statistic value |
|---|---|
| `control` | 0 |
| `hint_button` | 30.39 |

In this synthetic run, the assignment split was close to the configured 50/50, with 98 participants in control and 102 in hint_button. First-attempt correctness was higher in hint_button (61.76%) than in control (48.98%), while mean time-on-task rose modestly from 29.85 seconds in control to 32.76 seconds in hint_button. Premature hint use was 30.39% in hint_button and a structural zero in control, since control has no hint button. These numbers are a preflight demonstration of how UpGrade collects and reports data. They are synthetic and not a prediction of real learning outcomes.

## 9. Recommended Implementation Order

1. Set up UpGrade locally.
2. Configure the app context, decision point, conditions, and metrics using the values from this report.
3. Create and start the experiment in UpGrade.
4. Add the UpGrade client integration to the learning app.
5. Run the learning app locally and trigger the configured decision point.
6. Confirm that enrollment and metric data appear in UpGrade.


## 10. UpGrade Setup Guide

Before creating this experiment in UpGrade, set up a local UpGrade environment where you can configure the experiment and test the client integration.

This guide uses the Docker-based UpGrade setup for macOS or Linux. Docker starts the UpGrade backend API, frontend UI, and PostgreSQL database together.

### 1. Install Node.js and Yarn

UpGrade uses Node.js `22.14.0` for development and build compatibility. The recommended way to install it is with `nvm`.

```bash
# Install nvm, if needed
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Load nvm into the current shell
source ~/.zshrc     # or ~/.bashrc, depending on your shell

# Install and use Node.js 22.14.0
nvm install 22.14.0
nvm use 22.14.0

# Install Yarn
npm install --global yarn

# Verify
node -v     # v22.14.0
yarn node -v
```

### 2. Install Docker

UpGrade's Docker environment requires Docker Engine and Docker Compose.

On macOS, install Docker Desktop:

1. Download Docker Desktop from https://www.docker.com/products/docker-desktop/
2. Install the `.dmg` file and move **Docker.app** into Applications
3. Open **Docker.app** before starting UpGrade

On Ubuntu/Debian Linux, install Docker Engine and Docker Compose:

```bash
sudo apt-get update
sudo apt-get install -y docker.io
sudo apt-get install -y docker-compose-plugin
sudo systemctl enable docker
sudo systemctl start docker

# Verify
docker --version
docker compose version
```

### 3. Clone and install UpGrade

```bash
git clone https://github.com/CarnegieLearningWeb/UpGrade.git
cd UpGrade
yarn
```

This installs all backend, types, and frontend dependencies in the correct order.

### 4. Configure the backend environment

Create the Docker local environment file:

```bash
cp packages/backend/.env.docker.local.example packages/backend/.env.docker.local
```

Open `packages/backend/.env.docker.local` and update the local app context and metric configuration:

```env
CONTEXT_METADATA={"minimath-app":{"CONDITIONS":["control","hint_button"],"GROUP_TYPES":[],"EXP_POINTS":["problem_page"],"EXP_IDS":["area_rectangle_hint_support"]}}
METRICS=[{"metrics":[{"metric":"firstAttemptCorrect","datatype":"categorical","allowedValues":["CORRECT","INCORRECT"]},{"metric":"timeOnTask","datatype":"continuous"},{"metric":"prematureHintUse","datatype":"categorical","allowedValues":["PREMATURE","NOT_PREMATURE"]}],"contexts":["minimath-app"]}]
```

### 5. Configure the frontend environment

Create the local frontend environment file:

```bash
cp packages/frontend/projects/upgrade/src/environments/environment.local.example.ts packages/frontend/projects/upgrade/src/environments/environment.local.ts
```

### 6. Start UpGrade

From the UpGrade repository root, start the backend API, frontend UI, and PostgreSQL database.

The commands below use `docker-compose`. If your machine does not recognize `docker-compose`, replace it with `docker compose`.

```bash
docker-compose -f singleContainerApp-docker-compose.yml up -d
```

To view logs:

```bash
docker-compose -f singleContainerApp-docker-compose.yml logs -f
```

To stop UpGrade:

```bash
docker-compose -f singleContainerApp-docker-compose.yml down
```

### Local URLs

After UpGrade starts, open:

* Backend API: http://localhost:3030/api
* Frontend UI: http://localhost:4200

Use `http://localhost:3030` as the local UpGrade host URL in the client application.


## 11. UpGrade Experiment Creation Guide

After the local UpGrade environment is running, use the UpGrade frontend UI to create and start the experiment.

Open the UpGrade frontend:

```text
http://localhost:4200
```

### 1. Create the experiment

On the **Experiments** page, click **Add Experiment**.

In the **Add Experiment** modal, enter the following values:

- **Name:** `Hint Button Experiment`
- **Description:** `Tests whether adding an optional Show hint button on the area word-problem page improves first-attempt correctness without substantially increasing time-on-task, while monitoring whether students open the hint before submitting a first answer.`
- **App Context:** `minimath-app`

Leave the remaining settings unchanged:

- **Experiment Type:** Simple Experiment
- **Unit of Assignment:** Individual
- **Consistency Rule:** Individual
- **Assignment Algorithm:** Random

Click **Create**.

After the experiment is created, UpGrade will open the experiment details page.

### 2. Add the decision point

In the **Decision Points** section, click **Add Decision Point**.

Enter the following values:

- **Site:** `problem_page`
- **Target:** `area_rectangle_hint_support`

Leave **Exclude If Reached** unchecked.

Click **Create**.

### 3. Add the conditions

In the **Conditions** section, add each condition listed below.

For each condition:

1. Click **Add Condition**.
2. Enter the condition in the **Condition** field.
3. Click **Create**.

Conditions to add:

- `control`
- `hint_button`

### 4. Include participants

In the **Include Lists** section, turn on **Include All**.

When the confirmation modal appears, click **Enable**.

This allows all participants to be included in the experiment unless they are explicitly excluded by an exclude list.

### 5. Add the metrics

In the **Metrics** section, add each metric listed below.

For each metric:

1. Click **Add Metric**.
2. Leave **Metric Type** set to **Global Metric**.
3. Enter the listed values.
4. Click **Create**.

**Metric: `firstAttemptCorrect`**

- **Metric ID:** `firstAttemptCorrect`
- **Aggregate Statistic:** Percent
- **Comparison:** Equal
- **Value:** `CORRECT`
- **Display Name:** `firstAttemptCorrect (Percent = CORRECT)`

**Metric: `timeOnTask`**

- **Metric ID:** `timeOnTask`
- **Aggregate Statistic:** Mean
- **Display Name:** `timeOnTask (Mean)`

**Metric: `prematureHintUse`**

- **Metric ID:** `prematureHintUse`
- **Aggregate Statistic:** Percent
- **Comparison:** Equal
- **Value:** `PREMATURE`
- **Display Name:** `prematureHintUse (Percent = PREMATURE)`

### 6. Start the experiment

Click the blue **Start** button in the top-right area of the experiment details page.

In the confirmation modal, click **Start**.

The experiment status should change from **Inactive** to **Running**.

### 7. View enrollment and metric data

After the client app is integrated and starts sending assignment and metric data, open the **Data** tab on the experiment details page.

Use this tab to review:

- **Enrollment Data:** how many participants were assigned to each condition
- **Metrics Data:** collected values for the metrics configured in this experiment

If the client app has not been integrated yet, these sections may show no data. Data will appear after the client app enrolls participants and logs metrics.


## 12. Client Integration Guide

This section shows how to connect your client application to UpGrade for the experiment described in this report.

The generated snippets are intended as a concrete starting point. The experiment values are pre-filled from this report; connect the user ID and implement the condition-specific client behavior in your app.

At a high level, the client app should:

1. Initialize the UpGrade client for the current user.
2. Request an assignment when the user reaches the configured decision point.
3. Apply the client-side experience for the assigned condition.
4. Mark whether the assigned condition was applied.
5. Log metric values when the relevant outcomes are known.

### JavaScript Client Library

Use this option if your client app runs plain JavaScript in the browser and loads the UpGrade client library with a `<script>` tag.

Add the UpGrade client library to your HTML page:

```html
<script src="https://cdn.jsdelivr.net/npm/upgrade_client_lib@6.4.0/dist/browser/index.min.js"></script>
```

Then add the reusable helper functions below. These helpers keep the UpGrade flow in one place, while the experiment-specific values are passed in from the usage example.

```js
async function visitDecisionPoint({
  userId,
  hostUrl,
  appContext,
  site,
  target,
  conditionHandlers,
  defaultHandler,
}) {
  const upClient = new UpgradeClient(userId, hostUrl, appContext);

  await upClient.init();

  const assignment = await upClient.getDecisionPointAssignment(site, target);
  const condition = assignment.getCondition();

  const conditionHandler = condition ? conditionHandlers[condition] : null;
  const handler = conditionHandler || defaultHandler;

  if (handler) {
    await handler();
  }

  const markStatus = condition
    ? conditionHandler
      ? "condition applied"
      : "condition not applied"
    : "no condition assigned";

  assignment.markDecisionPoint(markStatus);

  return { upClient, assignment, condition, markStatus };
}

async function logMetrics(upClient, attributes) {
  await upClient.log([
    {
      timestamp: new Date().toISOString(),
      metrics: {
        attributes,
      },
    },
  ]);
}
```

Call the helper from the part of your app where the user reaches the decision point. Run this from an async function or module context so `await` can be used. Replace `userIdFromYourApp()` with the code your app uses to read the current user's stable ID.

```js
const { upClient, condition, markStatus } = await visitDecisionPoint({
  userId: userIdFromYourApp(),
  hostUrl: "http://localhost:3030",
  appContext: "minimath-app",
  site: "problem_page",
  target: "area_rectangle_hint_support",
  conditionHandlers: {
    control: () => {
      // Apply the control experience here.
    },
    hint_button: () => {
      // Apply the hint_button experience here.
    },
  },
  defaultHandler: () => {
    // Apply the default experience when no condition is assigned or no matching condition handler is found.
  },
});
```

When the metric outcomes are known, log them with the same UpGrade client instance. Replace the example metric value functions with the code your app uses to compute or read each outcome.

```js
await logMetrics(upClient, {
  firstAttemptCorrect: firstAttemptCorrectFromYourApp(), // "CORRECT" or "INCORRECT"
  timeOnTask: timeOnTaskFromYourApp(),
  prematureHintUse: prematureHintUseFromYourApp(), // "PREMATURE" or "NOT_PREMATURE"
});
```

### TypeScript Client Library

Use this option if your client app uses TypeScript and installs the UpGrade client library through npm.

The TypeScript version follows the same flow as the JavaScript version, but uses imports and explicit types so the integration is easier to validate in a TypeScript codebase.

Install the client library:

```bash
npm install upgrade_client_lib@6.4.0
```

Import the UpGrade client and related types:

```ts
import UpgradeClient, {
  Assignment,
  ILogInput,
  MARKED_DECISION_POINT_STATUS,
} from "upgrade_client_lib";
```

Then add the reusable typed helper functions below. These helpers match the JavaScript version, but add types for the input config, condition handlers, metric attributes, and return value.

```ts
type ConditionHandler = () => void | Promise<void>;

type VisitDecisionPointParams = {
  userId: string;
  hostUrl: string;
  appContext: string;
  site: string;
  target: string;
  conditionHandlers: Record<string, ConditionHandler>;
  defaultHandler?: ConditionHandler;
};

type VisitDecisionPointResult = {
  upClient: UpgradeClient;
  assignment: Assignment;
  condition: string | null;
  markStatus: MARKED_DECISION_POINT_STATUS;
};

type MetricAttributes = Record<string, string | number | boolean | null>;

async function visitDecisionPoint({
  userId,
  hostUrl,
  appContext,
  site,
  target,
  conditionHandlers,
  defaultHandler,
}: VisitDecisionPointParams): Promise<VisitDecisionPointResult> {
  const upClient = new UpgradeClient(userId, hostUrl, appContext);

  await upClient.init();

  const assignment = await upClient.getDecisionPointAssignment(site, target);
  const condition = assignment.getCondition();

  const conditionHandler = condition ? conditionHandlers[condition] : null;
  const handler = conditionHandler || defaultHandler;

  if (handler) {
    await handler();
  }

  const markStatus = condition
    ? conditionHandler
      ? MARKED_DECISION_POINT_STATUS.CONDITION_APPLIED
      : MARKED_DECISION_POINT_STATUS.CONDITION_FAILED_TO_APPLY
    : MARKED_DECISION_POINT_STATUS.NO_CONDITION_ASSIGNED;

  assignment.markDecisionPoint(markStatus);

  return { upClient, assignment, condition, markStatus };
}

async function logMetrics(
  upClient: UpgradeClient,
  attributes: MetricAttributes
): Promise<void> {
  const metrics: ILogInput[] = [
    {
      timestamp: new Date().toISOString(),
      metrics: {
        attributes,
        groupedMetrics: [],
      },
    },
  ];

  await upClient.log(metrics);
}
```

Call the helper from the part of your app where the user reaches the decision point. Run this from an async function or module context so `await` can be used. Replace `userIdFromYourApp()` with the code your app uses to read the current user's stable ID.

```ts
const { upClient, condition, markStatus } = await visitDecisionPoint({
  userId: userIdFromYourApp(),
  hostUrl: "http://localhost:3030",
  appContext: "minimath-app",
  site: "problem_page",
  target: "area_rectangle_hint_support",
  conditionHandlers: {
    control: () => {
      // Apply the control experience here.
    },
    hint_button: () => {
      // Apply the hint_button experience here.
    },
  },
  defaultHandler: () => {
    // Apply the default experience when no condition is assigned or no matching condition handler is found.
  },
});
```

When the metric outcomes are known, log them with the same UpGrade client instance. Replace the example metric value functions with the code your app uses to compute or read each outcome.

```ts
await logMetrics(upClient, {
  firstAttemptCorrect: firstAttemptCorrectFromYourApp(), // "CORRECT" or "INCORRECT"
  timeOnTask: timeOnTaskFromYourApp(),
  prematureHintUse: prematureHintUseFromYourApp(), // "PREMATURE" or "NOT_PREMATURE"
});
```

### Developer Notes

* Use a stable per-user identifier from your application for `userId`. Do not hard-code a test user ID in production.
* The `appContext`, `site`, `target`, condition codes, and metric keys must exactly match the values configured in UpGrade.
* The default experience should be safe to apply when no condition is assigned or no matching condition handler is found.
* If the UpGrade request fails, the app should fall back to the default experience. The snippets above keep error handling minimal for readability, so add request-level error handling before using this in production.
* Metric logging should happen when the outcome is known, not necessarily immediately after the decision point is visited.
* Review this integration before using it in production.


## 13. Assumptions and Notes

- This report was generated from the information provided during the consulting session. Review the experiment design before using it with real students.
- The app context, site, target, condition codes, and metric keys must exactly match the values configured in UpGrade and used in the client app.
- Synthetic simulation results, if included, are only a preflight demonstration of UpGrade's data flow and are not evidence of the intervention's real effect.
