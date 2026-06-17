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

- UpGrade makes **running and managing** experiments straightforward — *once you have a plan*
- For new teams, the hard part comes **earlier**: turning an idea into an implementable plan
- *What* to test? *Where* does assignment happen? *Which* conditions & metrics? *How* to instrument the app?
- Today that gap is filled by **expert consultation** — which doesn't scale

<!-- notes:
UpGrade is Carnegie Learning's open-source platform for running A/B experiments inside real learning apps. Once a team knows what to test, UpGrade supports setting up and managing experiments. But for new teams, the hard part often happens before they open UpGrade. They have an idea or a pain point. Turning that into an experiment raises many questions. What should we test? Where does the app pick a condition? Which metrics matter? Today, an expert answers these in meetings. That helps, but it doesn't scale.
-->

---

# What it does

- A web-based, **chat-driven** consultant for learning-app teams
- **Input:** an idea, a pain point, or a screenshot
- **Output:** a concrete A/B test plan + an implementation-ready **markdown report** targeting UpGrade
- **Human-controlled** and **planning-focused** — it advises, you decide

<!-- notes:
So we built AI Experiment Consultant to take on part of that work. It's a web app, and you use it by chatting. You describe your learning app and something you'd like to improve, and you can attach a screenshot. In one conversation, it helps you go from a rough idea to a clear experiment plan in UpGrade's terms. The result is a markdown report you can act on. Two things to remember. The tool suggests; the human decides. And it only plans — it doesn't run experiments or touch your code.
-->

---

# Six-phase consulting workflow

1. Learning app description
2. Page / problem description
3. Ideation & hypothesis refinement · *optional research grounding*
4. UpGrade experiment design
5. Synthetic preflight simulation · *optional*
6. Report generation

**You approve every major transition.**

<!-- notes:
Inside, it follows six phases, but to the user it just feels like a chat. First, it asks about the app and who uses it. Then it asks about the page or problem you care about — a screenshot helps here. The third phase is the most active. It turns a vague idea into a clear, testable hypothesis, and suggests changes to test and metrics to measure. It can also pull a few related papers. Fourth, it writes a concrete UpGrade design: decision point, conditions, split, and metrics. Fifth, it can run a quick synthetic check of enrollment and metrics. Sixth, it builds the report. At each major step, it waits for your approval.
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
