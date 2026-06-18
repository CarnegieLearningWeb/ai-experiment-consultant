---
marp: true
title: "AI Experiment Consultant — PELE 2026"
description: "AI-assisted experimentation consulting for UpGrade adoption (Work-in-Progress / Demo)."
paginate: true
theme: default
---

<!--
First draft — concise slide text plus draft speaker-note narration.

- Source of truth: ./presentation-plan.md, ../paper/, ../server/src/lib/prompt.js (background: ../docs/spec.md).
- Speaker notes live in the notes comment on each slide and are draft narration to refine, written for easy spoken delivery.
- Target: about 5 minutes of slides, then a ~5 minute live demo (MiniMathApp), then ~5 minutes of Q&A.
- Render / export: the VS Code "Marp for VS Code" extension, or the Marp CLI
  (e.g. marp slides/pele-2026-ai-experiment-consultant.md --pdf).
-->

<!-- _class: lead -->

# AI Experiment Consultant

#### From an idea, pain point, or screenshot to an implementation-ready UpGrade experiment plan

PELE 2026 · Work-in-Progress / Demo

**Zack Lee and April Murphy**

Carnegie Learning

<!-- notes:
Hi everyone, I'm Zack Lee, a software engineer on the Research team at Carnegie Learning. This is joint work with April Murphy.

Today, I'll introduce AI Experiment Consultant, a prototype that helps educational software teams turn an app idea, a pain point, or a screenshot into an implementation-ready UpGrade experiment plan.

I'll start with the practical problem that motivated this work.
-->

---

# The onboarding problem

- **UpGrade** is Carnegie Learning's open-source platform for educational A/B testing
- It supports **running and managing** experiments — *once a team has a clear experiment plan*
- The hard part often comes **earlier**: turning a rough idea, pain point, or specific interaction into that plan
- *What* should we test? *Where* does condition assignment happen? *Which* conditions and metrics? *What needs to change in the app?*
- Today, that planning gap often requires **expert consultation**

<!-- notes:
UpGrade is Carnegie Learning's open-source platform for A/B testing in educational software. It helps teams run and manage experiments once they have a clear experiment plan.

But in recent onboarding work with external EdTech teams, we saw that the hard part often comes earlier. A team may have a rough idea, a pain point, or a specific interaction they want to improve, but they still need to decide what to test, where condition assignment should happen, what the conditions and metrics should be, and what needs to change in the app.

That planning step usually takes expert consultation. This project is about supporting that earlier planning layer.
-->

---

# What it does

- A web-based, **chat-driven** consultant for educational software teams
- **Input:** an idea, a pain point, or a screenshot
- **Output:** a concrete A/B test plan + an implementation-ready **markdown report** tailored to UpGrade
- **Human-controlled** and **planning-focused** — the tool suggests, the user decides

<!-- notes:
AI Experiment Consultant is a web-based, chat-driven consultant for educational software teams.

The input can be an idea, a pain point, or a screenshot of a page or interaction the user wants to improve. The tool asks follow-up questions, suggests possible directions, and helps turn that input into a concrete A/B test plan in UpGrade terms.

The main output is an implementation-ready markdown report tailored to UpGrade, so the plan can be shared and acted on after the conversation.

The tool is intentionally human-controlled and planning-focused. It suggests options and structures the plan, but the user decides what to approve or change. It stays at the planning layer; it does not run real experiments or change client app code.
-->

---

# Six-phase consulting workflow

1. Learning app description
2. Page / problem / interaction description
3. Ideation & hypothesis refinement (*optional research grounding*)
4. UpGrade experiment design
5. Synthetic preflight simulation (*optional*)
6. Report generation

**The user approves every major transition.**

<!-- notes:
The consultant follows six phases, but to the user it still feels like a guided chat.

First, it asks about the learning app: what it does, who uses it, and what students are trying to learn.

Second, it asks about the specific page, problem, or interaction where an experiment might happen. A screenshot can help, but the user can also describe it in text.

Third, it helps turn the starting point into a testable hypothesis. This is where it can suggest possible interventions and outcome metrics, and also offer optional related research grounding.

Fourth, it translates the approved hypothesis into a concrete UpGrade experiment design: the decision point, conditions, assignment weights, and metrics.

Fifth, it can run an optional synthetic preflight simulation, using simulated participants, to show enrollment and metric outputs.

Sixth, it generates the final markdown report.

The user approves every major transition before the tool moves on.
-->

---

# Why the report matters

- The conversation ends as a **structured markdown report**
- It captures the **hypothesis, UpGrade design, simulation summary, and implementation guidance**
- It gives researchers, developers, and product teams **one shared artifact**
- It can also serve as a **concrete spec** for later implementation work

<!-- notes:
Before the demo, I want to highlight the report as the main output, not just the last step in the chat.

The conversation ends as a structured markdown report. It pulls together the hypothesis, the UpGrade experiment design, the simulation summary, and step-by-step implementation guidance.

That turns the report into one shared artifact. Researchers, developers, and product managers can all work from the same document, instead of reading a long chat transcript.

And because it's plain markdown, it can also seed later work — for example, a team could hand it to an AI coding tool as a starting spec, with a person still reviewing everything.
-->

---

# Live demo — MiniMathApp

- A **fictional** math-practice app · an area word problem (a rectangular garden)
- Pain point: students often **get stuck or answer incorrectly on the first try**

![w:560](../demo/minimath-app/screenshot.png)

**Next:** we give the consultant this screenshot and ask it to help plan an experiment →

<!-- notes:
Let's make this concrete. For the demo, I'll use a fictional app called MiniMathApp — a simple math-practice app for upper-elementary and middle-school students.

Here's the screen: an area word problem about a rectangular garden, with a diagram, an answer box, and a "Check answer" button. The team noticed that many students get stuck or answer incorrectly on the first try.

Notice we haven't picked an intervention yet — no hint button, no app change. We'll give the consultant this screenshot and ask it to help us plan an experiment.

Let's switch to the live demo.
-->

---

# Scope today, future direction

- Today: a **planning-focused MVP** for simple UpGrade-shaped experiments
- Synthetic preflight shows **UpGrade mechanics**, not learning effects
- Not yet evaluated with real teams — planned during **Fall 2026 onboarding**
- Future: the report as a **human-reviewed handoff** to coding, UpGrade setup, and analysis tools

<!-- notes:
That's the workflow end to end. Let me wrap up with where the prototype stands.

Today it's a planning-focused MVP. It supports simple, UpGrade-shaped experiments — a single decision point, individual assignment, a control and a variant, and basic metrics. That's a deliberate choice for the prototype, not a limit of UpGrade.

One caution about the simulation: the synthetic preflight only shows UpGrade mechanics — how assignment, enrollment, and metrics look. It is not evidence that an intervention improves learning.

We also haven't tested the tool with real teams yet. That's planned during onboarding in Fall 2026.

Looking ahead, the report could become a human-reviewed handoff into other tools — for coding the change, setting up UpGrade, and analyzing results.
-->

---

<!-- _class: lead -->

# Thank you

### Questions?

Repository: <https://github.com/CarnegieLearningWeb/ai-experiment-consultant>

Contact: <zlee@carnegielearning.com>

<!-- TODO: add the public paper link when available. -->
<!-- notes:
Thanks for listening. The repository and my email are on the slide. I'm happy to take questions.
-->
