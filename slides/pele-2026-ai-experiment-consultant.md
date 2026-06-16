---
marp: true
title: "AI Experiment Consultant — PELE 2026"
description: "AI-assisted experimentation consulting for UpGrade adoption (Work-in-Progress / Demo)."
paginate: true
theme: default
---

<!--
SCAFFOLD ONLY — placeholders, not final content.

- Build plan & talking points: ./presentation-plan.md
- Keep every claim consistent with ../paper/ and ../server/src/lib/prompt.js.
- Speaker notes go in the notes comment blocks below; they are still TODO.
- Target: ~5 min of slides + ~5 min live demo (MiniMathApp).
- Export to PDF later with the Marp CLI or the VS Code "Marp for VS Code" extension.
-->

# AI Experiment Consultant

### From idea, pain point, or screenshot → an implementation-ready UpGrade experiment plan

PELE 2026 · Work-in-Progress / Demo

<!-- TODO: authors / affiliation. -->
<!-- notes: TODO — open with the one-line core message (see presentation-plan.md §3). -->

---

# The problem

- Adopting an experimentation platform isn't just tool access
- Teams need help turning an idea into a plan: *what* to test, *where* the decision point is, *which* conditions & metrics, *how* to instrument the client
- Motivated by real UpGrade onboarding with external teams

<!-- TODO: tighten wording; optionally name partner-team onboarding context. -->
<!-- notes: TODO. -->

---

# What it is

- Web-based, chat-driven AI consultant for learning-app teams
- Input: an idea, a pain point, or a screenshot
- Output: an A/B test plan **and** an implementation-ready markdown report targeting UpGrade
- Human-controlled, planning-focused

<!-- notes: TODO. -->

---

# Six-phase workflow

1. Learning app description
2. Page / problem description
3. Ideation & hypothesis refinement *(+ optional research grounding)*
4. UpGrade experiment design
5. Synthetic preflight simulation *(optional)*
6. Report generation

**Explicit user approval gates every major transition.**

<!-- TODO: consider reusing the paper's workflow figure (Figure 1). -->
<!-- notes: TODO — this is the centerpiece slide; spend the most time here. -->

---

# Scope & honest boundaries

- Supported shape is **narrow by design**: between-subjects, individual-level assignment, one decision point, simple conditions/weights, Include All, basic metrics
- **Planning-only** — no real experiments, no code changes, no PRs, no deploy
- Simulation = **preflight demo of UpGrade mechanics**, *not* evidence an intervention works
- Not yet evaluated with real teams (planned: Fall 2026)

<!-- notes: TODO — voice the synthetic caveat clearly (presentation-plan.md §8). -->

---

# The report as a shared artifact

- The report is the central output
- Shareable across researchers, developers, product managers, stakeholders
- Usable as input to AI coding tools
- Lowers UpGrade onboarding friction; gestures at a future human-supervised pipeline

<!-- TODO: optionally show a thumbnail of a generated report. -->
<!-- notes: TODO. -->

---

# Live demo — MiniMathApp

- A fictional math-practice app; an **area / geometry word problem** screen
- Pain point: students get stuck / answer wrong on the first try
- We ask the consultant for experiment ideas **live** — nothing pre-built

<!-- TODO: drop in MiniMathApp screenshot(s) from ../demo/minimath-app/. -->
<!-- notes: TODO — see the demo path in presentation-plan.md §7; have fallback screenshots ready. -->

---

# Thank you / Questions

<!-- TODO: links — paper PDF, project repo, contact. -->
<!-- notes: TODO. -->
