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

# What it supports — and what it doesn't

- Deliberately **narrow** shape: between-subjects, individual assignment, one decision point, simple conditions & metrics
- **Planning only** — no real experiments, no code changes, no PRs, no deployment
- Simulation = a **preflight demo of UpGrade mechanics**, *not* evidence an intervention works
- Not yet evaluated with real teams *(planned: Fall 2026)*

<!-- notes:
The limits here are on purpose. The prototype supports one simple design: a single decision point, individual assignment, a control and a variant, and basic metrics. That's a choice for the prototype, not a limit of UpGrade. It only plans. It doesn't run real experiments with real learners, change code, open pull requests, or deploy. The simulation also needs care. It uses fake participants on a demo server, just to show how UpGrade assigns people and reports metrics. These numbers are only a preflight check; they don't prove the idea works. We haven't tested it with real teams yet — that's planned for Fall 2026.
-->

---

# The report: a shared handoff artifact

- The **markdown report** is the central output
- One shared language for **researchers, developers, product, stakeholders**
- **Tailored** to your app and experiment — not generic docs
- Can also seed an **AI coding tool** as a concrete spec — with humans reviewing

<!-- notes:
The report is the heart of the tool. It's not generic documentation — it's a plan made for this app and this experiment. It has the hypothesis, the UpGrade design with real names and metrics, the simulation summary with its warning, a suggested order of steps, and setup and integration guidance. So one document works for everyone — researchers, developers, and product people. And because it's markdown, you can hand it to an AI coding tool as a starting spec, with a person still checking the work. That's the direction we're excited about.
-->

---

# Live demo — MiniMathApp

- A **fictional** math-practice app · an area word problem (a rectangular garden)
- Pain point: students often **get stuck or answer incorrectly on the first try**

![w:560](../demo/minimath-app/screenshot.png)

**Next:** we hand the consultant this screenshot and ask it to help plan an experiment →

<!-- notes:
Let's make this concrete. For the demo I'll use a made-up app called MiniMathApp — a simple math practice app for upper-elementary and middle-school students. Here's the screen: an area word problem about a rectangular garden, with a picture, an answer box, and a submit button. The team noticed that many students get stuck or get it wrong on the first try. Notice we haven't picked a fix yet — no hint, no change. We'll give the consultant this screenshot and ask it to help us plan an experiment. Let's switch over.
-->

---

<!-- _class: lead -->

# Thank you

### Questions?

Repository: <https://github.com/CarnegieLearningWeb/ai-experiment-consultant>

Contact: <zlee@carnegielearning.com>

<!-- TODO: add the public paper link when available. -->
<!-- notes:
So that's the tool — a human-controlled way to turn an idea or a screenshot into a clear, shareable experiment plan for UpGrade. The repo and my email are on the slide. I'm happy to take questions.
-->
