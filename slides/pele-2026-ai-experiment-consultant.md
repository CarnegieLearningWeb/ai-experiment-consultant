---
marp: true
title: "AI Experiment Consultant — PELE 2026"
description: "AI-assisted experimentation consulting for UpGrade adoption (Work-in-Progress / Demo)."
paginate: true
theme: default
# Editor notes (YAML comments — ignored by Marp, so they stay out of slide 1's speaker notes):
# Source of truth: ./presentation-plan.md, ../paper/, ../server/src/lib/prompt.js (background: ../docs/spec.md).
# Speaker notes live in the per-slide comment blocks below, written for easy spoken delivery.
# Target: ~5 min slides, then a ~5 min live demo (MiniMathApp), then ~5 min Q&A.
# Export via the VS Code "Marp for VS Code" extension, or the Marp CLI. The MiniMathApp screenshot
# is a local file, so PDF/PPTX export needs --allow-local-files, e.g.:
#   npx --yes @marp-team/marp-cli@latest slides/pele-2026-ai-experiment-consultant.md --allow-local-files -o deck.pdf
---

<!-- _class: lead -->

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

- **UpGrade** is Carnegie Learning's open-source platform for educational A/B testing
- It supports **running and managing** experiments — *once a team has a clear experiment plan*
- The hard part often comes **earlier**: turning a rough idea, pain point, or specific interaction into that plan
- *What* should we test? *Where* does condition assignment happen? *Which* conditions and metrics? *What needs to change in the app?*
- Today, that planning gap often requires **expert consultation**

<!--
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

<!--
AI Experiment Consultant is a web-based, chat-driven consultant for educational software teams.

The input can be an idea, a pain point, or a screenshot of a page or interaction the user wants to improve. The tool asks follow-up questions, suggests possible directions, and helps turn that input into a concrete UpGrade experiment design.

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

<!--
The consultant follows six phases, but to the user it still feels like a guided chat.

First, it asks about the learning app: what it does, who uses it, and what students are trying to learn.

Second, it asks about the specific page, problem, or interaction where an experiment might happen. A screenshot can help, but the user can also describe it in text.

Third, it helps turn the starting point into a testable hypothesis. This is where it can suggest possible interventions and outcome metrics, and also offer optional related research grounding.

Fourth, it translates the approved hypothesis into a concrete UpGrade experiment design, including the decision point, conditions, and metrics.

Fifth, it can run an optional synthetic preflight simulation, using simulated participants, to show enrollment and metric outputs.

Sixth, it generates the final markdown report.

The user approves every major transition before the tool moves on.
-->

---

# Why the report matters

- The conversation ends as a **structured markdown report**
- It captures the **hypothesis, UpGrade experiment design, simulation summary, and implementation guidance**
- It gives researchers, developers, and product teams **one shared artifact**
- It can also serve as a **concrete spec** for later implementation work

<!--
Before the demo, I want to highlight the report as the main output, not just the last step in the chat.

The conversation ends as a structured markdown report. It pulls together the hypothesis, the UpGrade experiment design, the simulation summary, and step-by-step implementation guidance.

This makes the report a shared artifact. Researchers, developers, and product teams can use it to align on the experiment design and implementation plan.

And because it's plain markdown, it can also be used by AI coding tools as a concrete spec for implementation, with a person still reviewing the work.
-->

---

# Live demo — MiniMathApp

- A **fictional** math-practice app · an area word problem (a rectangular garden)
- Pain point: students often **get stuck or answer incorrectly on the first try**

![w:560](../demo/minimath-app/screenshot.png)

**Next:** we give the consultant this screenshot and ask it to help plan an experiment →

<!--
Now let's make this concrete with a short demo. I'll use a fictional app called MiniMathApp — a simple math-practice app for upper-elementary and middle-school students.

The screen shows an area word problem about a rectangular garden, with a diagram, an answer box, and a "Check answer" button. The team noticed that many students get stuck or answer incorrectly on the first try.

Notice we haven't picked an intervention yet. We'll start from the current screen and the pain point, and ask the consultant to help us plan an experiment.

Let's switch to the live demo.
-->

---

# Scope today, future direction

- Today: a **planning-focused MVP** for simple, concrete UpGrade experiment designs
- Synthetic preflight shows **UpGrade mechanics**, not evidence of learning effects
- Not yet evaluated with real teams — planned during **Fall 2026 onboarding**
- Future: an approved report could connect planning, implementation, UpGrade setup, and analysis in a **human-reviewed pipeline**

<!--
Now I'll wrap up with the current scope and future direction.

Today, this is a planning-focused MVP. It focuses on simple, concrete UpGrade experiment designs, such as one decision point with basic conditions and metrics. That's a deliberate choice for this prototype, not a limit of UpGrade.

One caveat from the demo: the synthetic preflight shows UpGrade mechanics, not evidence of learning effects.

We also haven't evaluated the tool with real teams yet. We plan to do that during Fall 2026 onboarding.

Looking ahead, an approved report could become the shared input for a human-reviewed pipeline. AI and automation could use it to draft the client-app changes, prepare the UpGrade configuration, and later support analysis, with humans reviewing each step.
-->

---

<!-- _class: lead -->

# Thank you

### Questions?

Try the app: <https://upgrade-demo.carnegielearning.com/ai-consultant>

Repository: <https://github.com/CarnegieLearningWeb/ai-experiment-consultant>

Contact: <zlee@carnegielearning.com>

<!--
Thanks for listening. I'm happy to take questions.
-->
