---
theme: default
fonts:
  sans: Roboto
  serif: Hepta Slab
  weights: '300,400,500,600,700'
title: AI Experiment Consultant — PELE 2026
info: |
  AI-assisted experimentation consulting for UpGrade adoption (Work-in-Progress / Demo).

  Slidev port of the finalized Marp deck at ../pele-2026-ai-experiment-consultant.md,
  which remains the source of truth and fallback. Speaker notes are in each slide's
  trailing HTML comment and show in Slidev presenter mode.
drawings:
  persist: false
transition: slide-left
layout: cover
---

# AI Experiment Consultant

#### From an idea, pain point, or screenshot to an implementation-ready UpGrade experiment plan

PELE 2026 · Work-in-Progress / Demo

**Zack Lee and April Murphy**

Carnegie Learning

<!--
Hi everyone, I'm Zack Lee, a software engineer on the Research team at Carnegie Learning. This is joint work with April Murphy.

Today, I'll introduce AI Experiment Consultant, a prototype that helps educational software teams turn an app idea, a pain point, or a screenshot into an implementation-ready UpGrade experiment plan.

I'll start with the practical problem that motivated this work.
-->

---

# The onboarding problem

<div class="cl-onboarding-flow">
  <section class="cl-onboarding-stage cl-planning-stage">
    <div class="cl-onboarding-label">Before the plan is clear</div>
    <h2>The hard part often comes earlier.</h2>
    <p>A rough idea, pain point, or specific interaction still has to become a clear experiment plan.</p>
    <div class="cl-onboarding-questions">
      <div><strong>What</strong> should we test?</div>
      <div><strong>Where</strong> does condition assignment happen?</div>
      <div><strong>Which</strong> conditions and metrics?</div>
      <div><strong>What</strong> needs to change in the app?</div>
    </div>
  </section>

  <div class="cl-onboarding-arrow" aria-hidden="true">→</div>

  <section class="cl-onboarding-stage cl-upgrade-stage">
    <div class="cl-onboarding-label">Once a clear plan exists</div>
    <h2><span>UpGrade</span> runs and manages the experiment</h2>
    <p>Carnegie Learning's open-source platform for educational A/B testing</p>
  </section>
</div>

<div class="cl-onboarding-callout">
  <span class="cl-callout-label">Planning gap</span>
  <span class="cl-callout-copy">Today, turning an idea into that plan often requires <strong>expert consultation</strong>.</span>
</div>

<!--
The practical problem is that teams often need support before they have a clear experiment plan.

In recent onboarding work with external EdTech teams, we saw that a team may have a rough idea, a pain point, or a specific interaction they want to improve, but still need to decide what to test, where condition assignment should happen, what the conditions and metrics should be, and what needs to change in the app.

Once that plan exists, UpGrade — Carnegie Learning's open-source platform for educational A/B testing — helps teams run and manage the experiment.

Today, that earlier planning step usually requires expert consultation. This project addresses that planning gap.
-->

---

# What it does

<div class="cl-consulting-flow">
  <div class="cl-flow-card cl-flow-input">
    <img src="./assets/icon/universal1.png" alt="" aria-hidden="true" />
    <div class="cl-flow-label">Input</div>
    <p>An idea, a pain point, or a screenshot</p>
  </div>

  <div class="cl-flow-arrow" aria-hidden="true">→</div>

  <div class="cl-flow-card cl-flow-chat">
    <img src="./assets/icon/universal4.png" alt="" aria-hidden="true" />
    <div class="cl-flow-label">Guided consultation</div>
    <p>A web-based, <strong class="cl-nowrap">chat-driven</strong> consultant for educational software teams</p>
  </div>

  <div class="cl-flow-arrow" aria-hidden="true">→</div>

  <div class="cl-flow-card cl-flow-output">
    <img src="./assets/icon/universal3.png" alt="" aria-hidden="true" />
    <div class="cl-flow-label">Output</div>
    <p>A concrete A/B test plan + an implementation-ready <strong>markdown report</strong> tailored to UpGrade</p>
  </div>
</div>

<div class="cl-human-control">
  <span class="cl-callout-label">Guiding principle</span>
  <span class="cl-callout-copy"><strong>Human-controlled and planning-focused</strong> — the tool suggests; the user decides.</span>
</div>

<!--
AI Experiment Consultant is a web-based, chat-driven consultant for educational software teams.

The starting point can be an idea, a pain point, or a screenshot.

Through a guided consultation, the tool asks follow-up questions, suggests possible directions, and helps turn that input into a concrete A/B test plan.

The main output is an implementation-ready markdown report tailored to UpGrade, so the plan can be shared and acted on after the conversation.

Throughout the process, the tool remains human-controlled and planning-focused: it suggests options and structures the plan, but the user decides what to approve or change.
-->

---

# Six-phase consulting workflow

<div class="cl-workflow-main">
  <div class="cl-workflow-group cl-context-group">
    <div class="cl-workflow-group-label">Context collection</div>
    <div class="cl-workflow-two">
      <div class="cl-phase-node">
        <div class="cl-phase-number">01</div>
        <div class="cl-phase-title">Learning<br>app</div>
      </div>
      <div class="cl-phase-arrow" aria-hidden="true">→</div>
      <div class="cl-phase-node">
        <div class="cl-phase-number">02</div>
        <div class="cl-phase-title">Page /<br>problem /<br>interaction</div>
      </div>
    </div>
  </div>
  <div class="cl-group-arrow" aria-hidden="true">→</div>
  <div class="cl-workflow-group cl-core-group">
    <div class="cl-workflow-group-label">AI-guided planning</div>
    <div class="cl-workflow-three">
      <div class="cl-phase-node">
        <div class="cl-phase-number">03</div>
        <div class="cl-phase-title">Hypothesis<br>refinement</div>
        <div class="cl-optional-tag">Optional research grounding</div>
      </div>
      <div class="cl-phase-gate" aria-label="User approval">
        <span>✓</span><b aria-hidden="true">→</b>
      </div>
      <div class="cl-phase-node">
        <div class="cl-phase-number">04</div>
        <div class="cl-phase-title">A/B test<br>design</div>
      </div>
      <div class="cl-phase-gate" aria-label="User approval">
        <span>✓</span><b aria-hidden="true">→</b>
      </div>
      <div class="cl-phase-node cl-optional-node">
        <div class="cl-phase-number">05</div>
        <div class="cl-phase-title">Synthetic<br>preflight</div>
        <div class="cl-optional-tag">Optional</div>
      </div>
    </div>
  </div>
  <div class="cl-group-arrow" aria-hidden="true">→</div>
  <div class="cl-workflow-group cl-handoff-group">
    <div class="cl-workflow-group-label">Handoff</div>
    <div class="cl-phase-node cl-report-node">
      <div class="cl-phase-number">06</div>
      <div class="cl-phase-title">Report<br>generation</div>
    </div>
  </div>
</div>

<div class="cl-workflow-approval">
  <span class="cl-callout-label">Approval gates</span>
  <span class="cl-callout-copy">The user approves every major transition.</span>
</div>

<!--
The consultant follows a six-phase workflow, but to the user it still feels like a guided chat.

First, it asks about the learning app: what it does, who uses it, and what students are trying to learn.

Second, it asks about the specific page, problem, or interaction where an experiment might happen. A screenshot can help, but the user can also describe it in text.

Third, it helps turn the starting point into a testable hypothesis. This is where it can suggest possible interventions and outcome metrics, and also offer optional related research grounding.

Fourth, it translates the approved hypothesis into an UpGrade experiment design, including the decision point, conditions, and metrics.

Fifth, it can run an optional synthetic preflight using simulated participants. This is mainly meant to show what enrollment and metric data look like in UpGrade, not to provide evidence of learning effects.

Sixth, it generates the final markdown report.

The user approves every major transition before the tool moves on.
-->

---

# Why the report matters

<div class="cl-report-layout">
  <div class="cl-report-artifact">
    <div class="cl-report-heading">
      <img src="./assets/icon/universal3.png" alt="" aria-hidden="true" />
      <div>
        <div class="cl-report-kicker">Primary handoff</div>
        <h2>Structured markdown report</h2>
      </div>
    </div>
    <div class="cl-report-summary">Captures the complete experiment plan</div>
    <div class="cl-report-sections" aria-label="Report contents">
      <span>Hypothesis</span>
      <span>UpGrade experiment design</span>
      <span>Simulation summary</span>
      <span>Implementation guidance</span>
    </div>
  </div>
  <div class="cl-report-benefits">
    <div class="cl-report-benefit cl-report-shared">
      <div class="cl-benefit-label">One shared artifact</div>
      <div class="cl-benefit-copy">For researchers, developers, and product teams</div>
    </div>
    <div class="cl-report-benefit cl-report-spec">
      <div class="cl-benefit-label">Concrete specification</div>
      <div class="cl-benefit-copy">For later implementation work</div>
    </div>
  </div>
</div>

<!--
Before the demo, I want to highlight the report as the main output, not just the last step in the chat.

The conversation ends as a structured markdown report. It pulls together the hypothesis, the UpGrade experiment design, the simulation summary, and step-by-step implementation guidance.

This makes the report a shared artifact. Researchers, developers, and product teams can use it to align on the experiment design and implementation plan.

And because it's plain markdown, it can also serve as a concrete spec for later implementation work. This can include work supported by AI coding tools, with a person still reviewing any resulting changes.
-->

---

# Live demo — MiniMathApp

<div class="cl-demo-layout">
  <div class="cl-demo-context">
    <section class="cl-demo-card cl-demo-scenario">
      <div class="cl-demo-label">Demo scenario</div>
      <h2>A fictional math-practice app</h2>
      <p>An area word problem about a rectangular garden</p>
    </section>
    <section class="cl-demo-card cl-demo-pain-point">
      <div class="cl-demo-label">Pain point</div>
      <h2>Students often <strong>get stuck or answer incorrectly</strong> on the first try</h2>
    </section>
  </div>
  <figure class="cl-demo-screen">
    <img src="./assets/minimath-screenshot.png" alt="MiniMathApp area word problem screen" />
  </figure>
</div>

<!--
Now let's see this in a short demo. I'll use a fictional app called MiniMathApp — a simple math-practice app for middle-school students.

The screen shows an area word problem about a rectangular garden, with a diagram, an answer box, and a "Check answer" button. The team noticed that many students get stuck or answer incorrectly on the first try.

Notice that we haven't chosen an intervention yet. We'll start from this problem page and the pain point, and ask the consultant to help us plan an experiment.

Let's switch to the live demo.
-->

---
layout: iframe
url: http://localhost:5173/ai-consultant/login
scale: 0.8
---

<!--
====================================

MiniMathApp is a math practice app for middle-school students.

Many students get stuck or answer incorrectly on the first try on this area word-problem page.

We have not chosen an intervention yet. Please suggest a few A/B test ideas and recommend a good starting experiment.

====================================

So this is the login page. I'll sign in. (Click "Sign in as Zack")

Now we're in the chat. The consultant starts by asking about the learning app, so I'll share the MiniMathApp screenshot and a short description.

First, I'll upload the screenshot. (Click +, choose minimath-screenshot.png, Open)

Then I'll paste the description and send both together. (Paste prompt and send)

(After response) OK, it gave me three experiment ideas and recommended the first one: an optional hint button.

It also drafted a hypothesis about improving first-attempt correctness without substantially increasing time-on-task.

I'll accept that and move forward. (Type "yes" and send)

(After response) Now it asks whether I want to look for related research papers before creating the UpGrade experiment design.

I'll say yes here. (Type "yes" and send)

(While search_papers is running) Now it's looking for related research papers. Internally, it searches Semantic Scholar with a few different queries, collects up to 12 candidate papers, and then summarizes up to 3 relevant ones.

(After response) It found a few related papers with relevance notes and design implications.

(After reading suggested refinement) It also suggested a refinement. This sounds good to me, so I'll accept it.

I'll continue to the UpGrade experiment design. (Type "yes" and send)

(After response) Now it has turned the approved hypothesis into an UpGrade experiment design: where the experiment runs, what the conditions are, and which metrics we will track.

I could revise the details here, but for the demo, I'll accept this design. (Type "yes" and send)

(If it asks about the preflight simulation) Now it asks whether to run a preflight simulation with synthetic participants.

I'll say yes to run the simulation. (Type "yes" and send)

(While run_simulation is running) Now it is running a synthetic preflight. It creates a temporary UpGrade experiment, simulates 200 students going through the decision point, logs synthetic metric events, and then cleans everything up.

This is not testing real learners. It is a quick check of what assignment, enrollment, and metrics would look like in UpGrade.

(After response) Now we can see the preflight result: enrollment by condition, followed by metric summaries.

It also summarizes the synthetic result and reminds us that this is not evidence of a real learning effect.

Now it asks whether to generate the final report. I'll say yes so we can see the shared handoff artifact. (Type "yes" and send)

(While generate_report is running) This usually takes about 20 seconds.

The report pulls together the full plan: the app and page description, the hypothesis, the related research, the UpGrade experiment design, the simulation summary, and guidance for UpGrade setup, experiment creation, and client integration.

Any section can be excluded from the report, but for this demo I'm keeping everything in.

(After report opens) Now the final report opens in the side panel.

This is the main handoff artifact. It starts with the summary, the learning app, the page and problem, the experiment idea, and the hypothesis. (Scroll slowly)

It also includes the related research grounding, the UpGrade experiment design, and the simulation result summary. (Scroll)

Later sections are more implementation-focused. They give setup guidance, experiment creation steps, and client-integration guidance with code examples. (Scroll)

In practice, this report can be shared with the people who need to act on the plan. A researcher can review the design, a developer can use the integration guidance, and an AI coding tool could use the report as a starting spec, with a human still reviewing the work.

The report can be copied or downloaded from here. (Point to copy/download buttons)

(Return to the slides)
-->

---

# Scope today, future direction

<div class="cl-scope-timeline">
  <div class="cl-scope-stage cl-scope-today">
    <div class="cl-stage-label">Today</div>
    <h2>Planning‑focused MVP</h2>
    <div class="cl-stage-copy">Simple UpGrade experiment designs</div>
  </div>
  <div class="cl-scope-arrow" aria-hidden="true">→</div>
  <div class="cl-scope-stage cl-scope-evaluation">
    <div class="cl-stage-label">Fall 2026</div>
    <h2>Real‑team evaluation</h2>
    <div class="cl-stage-copy">Planned during UpGrade onboarding</div>
  </div>
  <div class="cl-scope-arrow" aria-hidden="true">→</div>
  <div class="cl-scope-stage cl-scope-future">
    <div class="cl-stage-label">Future</div>
    <h2>Human‑reviewed pipeline</h2>
    <div class="cl-stage-copy">An approved report connects planning, implementation, UpGrade setup, and analysis</div>
  </div>
</div>

<div class="cl-scope-guardrail">
  <span class="cl-callout-label">Guardrail</span>
  <span class="cl-callout-copy"><strong>Synthetic preflight</strong> demonstrates UpGrade mechanics, not evidence of learning effects.</span>
</div>

<!--
Now I'll wrap up with the current scope and future direction.

Today, this is a planning-focused MVP, designed for simple UpGrade experiments such as one decision point with basic conditions and metrics. That's a deliberate choice for this prototype, not a limit of UpGrade.

One guardrail from the demo is that the synthetic preflight is mainly meant to show what enrollment and metric data look like in UpGrade, not to provide evidence of learning effects.

The next step is evaluation with real teams, which we haven't done yet. We plan to do that during Fall 2026 UpGrade onboarding.

Looking ahead, an approved report could become the shared input for a human-reviewed pipeline. AI and automation could help draft client-app changes, prepare the UpGrade configuration, and later support experiment analysis, with humans reviewing each step.

-->

---
layout: thanks
---

# Thank you

### Questions?

Try the app: <https://upgrade-demo.carnegielearning.com/ai-consultant>

Repository: <https://github.com/CarnegieLearningWeb/ai-experiment-consultant>

Contact: <zlee@carnegielearning.com>

<!--
Thanks for listening. I'm happy to take questions.
-->
