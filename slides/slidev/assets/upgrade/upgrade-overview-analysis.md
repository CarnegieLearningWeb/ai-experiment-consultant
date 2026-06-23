# UpGrade overview and slide-design analysis

This document records the working understanding of UpGrade used to design the
PELE 2026 introduction slide. It separates UpGrade's actual responsibilities
from general A/B-testing concepts and identifies the minimum context the
audience needs for the rest of the AI Experiment Consultant talk.

## Working definition

UpGrade is an open-source experimentation platform developed by Carnegie
Learning for educational software. It provides the infrastructure to configure,
deploy, operate, and monitor randomized experiments and feature flags that are
integrated with a client learning application.

This is more specific than saying that UpGrade is simply "an A/B-testing
platform." For this talk, the useful distinction is that UpGrade is an
experiment orchestration and management layer connected to an EdTech client
application.

Primary sources:

- https://www.upgradeplatform.org/about-upgrade/
- https://upgrade-platform.gitbook.io/upgrade-documentation
- https://github.com/CarnegieLearningWeb/UpGrade

## Who interacts with it

- Researchers and product teams configure and operate experiments.
- Developers integrate a learning application with UpGrade through a client
  library or API.
- Learners continue using the learning application; they do not interact with
  UpGrade directly.

This last point matters: UpGrade is designed to sit behind the learning
experience rather than become a separate student-facing activity.

## What is configured in UpGrade

An experiment definition can include:

- **App context:** the client application in which the experiment runs.
- **Decision point:** the location in the client application where UpGrade is
  asked for an assignment. In the current project this is represented by a
  `site` and `target`.
- **Conditions:** the treatment labels and assignment weights.
- **Participants:** who is eligible, including individual- or group-based
  inclusion and exclusion options.
- **Metrics:** outcomes used to monitor and compare conditions.
- **Operational settings:** experiment type, assignment unit and consistency,
  start/end criteria, status, and related lifecycle controls.

The AI Experiment Consultant MVP deliberately supports only a narrow subset:
one decision point, two or three conditions, individual-level assignment,
Include All participants, and one to three simple metrics. Those are MVP limits,
not limits of UpGrade.

## Runtime interaction with a learning application

At a high level, the integrated application follows this flow:

1. Initialize the learner and relevant group context with UpGrade.
2. When the learner reaches the configured decision point, request an
   assignment.
3. UpGrade returns the assigned condition.
4. The learning application implements and displays the behavior associated
   with that condition.
5. The application marks whether the decision point and condition were
   successfully applied, which records enrollment.
6. The application logs relevant outcome metrics.
7. UpGrade exposes enrollment and metric summaries for monitoring and later
   analysis/export.

Primary sources:

- https://upgrade-platform.gitbook.io/upgrade-documentation/how-upgrade-works
- https://upgrade-platform.gitbook.io/upgrade-documentation/developer-guide/walkthroughs/your-application-and-upgrade
- `server/src/lib/report-templates/client-integration-guide.md`
- `server/src/lib/upgrade.js`

## The key responsibility boundary

### UpGrade is responsible for

- storing and operating the experiment configuration;
- assigning eligible participants to conditions;
- maintaining assignment and group-consistency rules;
- recording enrollment at decision points;
- managing experiment status and lifecycle;
- receiving metrics and exposing experiment data;
- supporting monitoring, export, and experiment-management workflows.

### The client learning application is responsible for

- containing the actual intervention or condition-specific behavior;
- deciding where in its code to request an assignment;
- applying the returned condition correctly;
- providing stable user and group identifiers;
- marking successful or failed condition application;
- computing or collecting the outcome events sent as metrics.

Therefore, UpGrade does not invent or implement the alternative learning
experiences. It orchestrates the experiment around experiences implemented in
the client application.

## What is distinctive for educational settings

UpGrade supports issues that are especially relevant in real educational
software:

- assignment and consistency at the individual, class, school, or district
  level;
- group consistency that reduces classroom disruption and teacher burden;
- adaptive or asynchronous applications in which learners may reach the same
  content at different times;
- experiments embedded in authentic learning environments at scale;
- researchers, product teams, and engineers sharing one operational platform.

UpGrade also supports designs beyond the AI consultant MVP, including group
assignment, factorial designs, within-subject designs, stratified sampling,
adaptive experiments, segmentation, and feature flags.

## Evidence of use and support

UpGrade has been used with Carnegie Learning applications and external EdTech
platforms. Public examples include MATHia and Playpower Labs' Battleship
Numberline. Public UpGrade materials report experiments reaching hundreds of
thousands of learners.

Development has received support from the Gates Foundation, Schmidt Futures,
the Institute of Education Sciences, and the National Science Foundation. This
funding history establishes project continuity but is less important than the
platform's responsibility boundary for a sub-one-minute introductory slide.

Primary sources:

- https://www.upgradeplatform.org/demo/
- https://www.upgradeplatform.org/upgrade-2022-year-in-review/
- https://www.upgradeplatform.org/
- `slides/slidev/assets/upgrade/reference.md`

## What this audience already knows

PELE workshop attendees can be expected to understand A/B testing and
randomized experiments. The slide therefore should not explain generic concepts
such as why conditions are compared or what an A/B test is.

## What the audience needs before the next slide

The rest of the talk assumes that the audience understands:

1. UpGrade is separate infrastructure integrated with a learning application.
2. An UpGrade experiment is configured using concrete fields such as decision
   point, conditions, participants, and metrics.
3. At runtime the app requests a condition from UpGrade, implements the
   corresponding experience, and sends enrollment/outcome data back.
4. UpGrade manages experiment execution, but the client team must still decide
   what to test, where to integrate it, and what to implement.

These four points make the following "onboarding problem" slide legible. They
explain why a team can have access to UpGrade and still need expert consultation
before it has an implementation-ready experiment plan.

## Information that does not belong on this one slide

- A generic explanation of A/B testing.
- A history of every grant or integration.
- A list of every experimental design supported by UpGrade.
- Low-level API names such as `/init`, `/assign`, `/mark`, and `/log`.
- Detailed site/target syntax or assignment weights.
- The AI consultant MVP's constraints, which are covered later.

## Recommended slide message

The slide should present UpGrade as the bridge between an experiment definition
and its execution in a learning application:

1. **Configure in UpGrade:** decision point, conditions, participants, metrics.
2. **Connect the learning app:** request a condition at the decision point and
   apply the corresponding app behavior.
3. **Operate and monitor:** UpGrade manages assignment, enrollment, lifecycle,
   and experiment data.

The most important takeaway is the responsibility boundary:

> UpGrade orchestrates the experiment; the learning app implements the
> condition-specific experience.

Usage scale can appear as a small credibility signal, but it should not compete
with this mental model. Funding should stay out of the slide unless the talk's
purpose changes from product understanding to project history or sustainability.
