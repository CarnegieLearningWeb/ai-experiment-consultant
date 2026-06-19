---
theme: default
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

<img src="./assets/minimath-screenshot.png" alt="MiniMathApp area word problem screen" class="block mx-auto mt-4 rounded shadow" style="max-height: 360px" />

**Next:** we give the consultant this screenshot and ask it to help plan an experiment →

<!--
Now let's make this concrete with a short demo. I'll use a fictional app called MiniMathApp — a simple math-practice app for middle-school students.

The screen shows an area word problem about a rectangular garden, with a diagram, an answer box, and a "Check answer" button. The team noticed that many students get stuck or answer incorrectly on the first try.

Notice we haven't picked an intervention yet. We'll start from the current screen and the pain point, and ask the consultant to help us plan an experiment.

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

So this is the login page. I'll sign in with my Google account. (Click "Sign in as Zack")

Now we're in the chat. I'll upload the MiniMathApp screenshot first. (Click +, choose minimath-app.png, Open)

I have a short description ready, so I'll paste it here and send both together. (Paste prompt and send)

(After response) OK, it gave me three experiment ideas and recommended the first one: an optional hint button.

It also drafted a hypothesis about improving first-attempt correctness without substantially increasing time-on-task.

I'll accept that and move forward. (Type "yes" and send)

(After response) Now it asks whether I want to look for related research papers before creating the UpGrade experiment design.

I'll say yes here. (Type "yes" and send)

(While search_papers is running) Now it's looking for related research papers. Internally, it searches Semantic Scholar with a few different queries, collects up to 12 candidate papers, and then summarizes up to 3 relevant ones.

(After response) It found a few related papers with relevance notes and design implications.

(After reading suggested refinement) It also suggested a refinement. This sounds good to me, so I'll accept it.

I'll continue to the UpGrade experiment design. (Type "yes" and send)

(After response) Now it has turned the approved hypothesis into a concrete UpGrade experiment design: where the experiment runs, what the conditions are, and which metrics we will track.

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
layout: center
---

# Thank you

### Questions?

Try the app: <https://upgrade-demo.carnegielearning.com/ai-consultant>

Repository: <https://github.com/CarnegieLearningWeb/ai-experiment-consultant>

Contact: <zlee@carnegielearning.com>

<!--
Thanks for listening. I'm happy to take questions.
-->
