# PELE 2026 — Presentation Plan

> Planning/overview document for the AI Experiment Consultant workshop talk.
> This is **not** the slide deck — it captures the structure, scenario, demo
> path, and accuracy boundaries so the deck, screenshots, and script can be
> built from a single shared plan.
>
> Deck scaffold: [pele-2026-ai-experiment-consultant.md](pele-2026-ai-experiment-consultant.md)
> Demo app: [../demo/minimath-app/](../demo/minimath-app/)

## 1. Workshop context & timing

- **Workshop:** PELE 2026 — <https://sites.google.com/carnegielearning.com/pele-2026/home>
- **Submission type:** Work-in-Progress / Demo paper (camera-ready PDF in
  [../paper/](../paper/)).
- **Slot:** Papers/demos get roughly **10–15 minutes** to present, plus about
  **5 minutes** for questions.
- **Our target:** ~**10 minutes total** — about **5 minutes of slides** and
  **5 minutes of live demo** — leaving the Q&A buffer intact.

## 2. Core presentation goal

Clearly explain, in order:

1. the practical onboarding/planning problem that motivated the tool,
2. what AI Experiment Consultant does,
3. how the six-phase workflow works,
4. what the implemented prototype actually supports,
5. how the generated report acts as a shared handoff artifact,
6. why this matters for educational experimentation and UpGrade adoption.

The slides carry points 1–6 at a high level; the live demo makes points 2–5
concrete on a fresh example.

## 3. Core message (one sentence)

> Adopting an educational experimentation platform like UpGrade isn't just about
> tool access — teams need expert consultation to turn an idea, pain point, or
> screenshot into a concrete experiment plan. AI Experiment Consultant
> systematizes part of that consultation as a chat-driven, **human-controlled**,
> six-phase workflow whose output is an **implementation-ready markdown report**
> that serves as the shared handoff artifact.

Supporting emphasis: **planning-focused**, **human-in-the-loop at every major
transition**, and **deliberately narrow** in scope.

## 4. Source-of-truth files

Keep every claim consistent with these. If the talk and these disagree, these win.

| File | Use it for |
| --- | --- |
| [../paper/ai-experiment-consultant-pele-2026.md](../paper/ai-experiment-consultant-pele-2026.md) | **Primary** reference — framing, phases, scope, limitations. |
| [../paper/ai-experiment-consultant-pele-2026.pdf](../paper/ai-experiment-consultant-pele-2026.pdf) | Camera-ready wording and the two figures (workflow, design). |
| [../server/src/lib/prompt.js](../server/src/lib/prompt.js) | **Best source for the implemented flow** — six phases, the three tools (`search_papers`, `run_simulation`, `generate_report`), introduction-of-UpGrade timing, report sections. |
| [../docs/spec.md](../docs/spec.md) | Background motivation/vision/rationale. May not perfectly match the final implementation — defer to the paper + prompt when they differ. |

## 5. Planned slide structure (~5 minutes)

Roughly one minute per content beat. Adjust freely; this is the starting outline
mirrored in the deck scaffold.

| # | Slide | ~Time | Point |
| --- | --- | --- | --- |
| 1 | **Title** | 0:15 | Tool name, authors, PELE 2026, "paper + demo." |
| 2 | **The problem** | 1:00 | Onboarding gap: adopting UpGrade isn't just tool access; teams need help turning an idea/pain point into a plan — *what* to test, *where* the decision point is, *which* conditions/metrics, *how* to instrument the client. Motivated by real external onboarding (e.g., partner teams). |
| 3 | **What it is** | 0:45 | Web-based, chat-driven AI consultant. Input: idea / pain point / screenshot. Output: an A/B test plan and an implementation-ready markdown report targeting UpGrade. Human-controlled, planning-focused. |
| 4 | **Six-phase workflow** | 1:15 | The centerpiece. App description → page/problem → ideation & hypothesis refinement (+ optional research grounding) → UpGrade experiment design → optional synthetic preflight → report. Explicit user approval gates the major transitions. |
| 5 | **Scope & honest boundaries** | 1:00 | Supported shape is narrow *by design*. Planning-only. Simulation = preflight demo of UpGrade mechanics, **not** evidence. (See §8.) |
| 6 | **Report as shared artifact + why it matters** | 0:45 | The report is the central output — shareable across researchers/devs/PMs and usable as input to AI coding tools. Lowers UpGrade onboarding friction; gestures at the future human-supervised pipeline. |
| 7 | **→ Live demo** | 0:15 | Transition slide into MiniMathApp. |

## 6. MiniMathApp demo scenario

A small **fictional** learning app used only to give the live demo a concrete,
believable context and to produce screenshots.

- **App:** `MiniMathApp` — a simple math-practice app for upper-elementary /
  middle-school students.
- **Screen:** an **area / geometry word problem** page — a rectangle/garden area
  problem with a diagram, an answer input, and a submit button, plus light
  surrounding UI (app name, lesson title, problem progress).
- **Pain point:** many students get stuck or answer incorrectly on the first try.
- **In the demo:** the presenter uploads/refers to screenshots of this *current*
  screen and asks the consultant for experiment ideas.
- **Deliberately NOT included:** any experimental variant, hint feature, or
  UpGrade integration. The whole point is that the consultant **proposes**
  candidate interventions live — we don't pre-build one.

Built as a static page in [../demo/minimath-app/](../demo/minimath-app/).

> **Naming note (keep the talk consistent):** the *paper's* worked example
> (Section 5) is **ExampleMathApp** with a hint-button scenario. The *live demo*
> intentionally uses a **different, fresh** app — **MiniMathApp** with an
> area/garden problem — so the demo isn't a verbatim replay of the paper and
> shows the consultant reasoning about a new screen. Mention this framing so the
> audience isn't confused by the two names.

## 7. Likely live-demo path (high level)

Tight on time, so pre-stage where possible (see §9 / §10). Exact AI wording will
vary — it's a live model, not a script.

1. **Open the chat already signed in** (skip the OAuth round-trip on stage).
2. **Describe MiniMathApp** and **upload a screenshot** of the area-problem screen.
3. **State the pain point** — students get stuck / answer wrong on the first try.
4. **Ask for experiment ideas.** The consultant proposes candidate interventions
   (e.g., an on-demand hint, a worked example, a labeled diagram, scaffolding —
   *whatever it suggests live*; do not pre-commit to one).
5. **Refine into a hypothesis** with proposed outcome metrics (plausibly
   first-attempt correctness rate and time-on-task — illustrative, not scripted).
6. *(Optional, likely skipped for time)* research grounding via related papers.
7. **Approve → UpGrade experiment design** appears: app context, decision point
   (site/target), conditions with weights, metrics, participants (Include All).
8. **Run a synthetic preflight simulation** (small cohort) → enrollment per
   condition + per-condition metric summary, **with the synthetic caveat**.
9. **Generate the report** → opens in the side panel; copy/download.
10. **Land the message:** this report is the shareable handoff artifact.

Plausible total: ~4–5 min if steps 6 is skipped and the cohort is small.

## 8. Accuracy boundaries — claims to make and claims to avoid

Say these plainly; they match the paper and the implemented prompt.

**Say:**
- The prototype is **planning-focused**.
- It **does not run real experiments with real learners**.
- Synthetic simulation/preflight is a **demonstration of UpGrade mechanics**
  (assignment, enrollment, metric reporting) — **not evidence that an
  intervention works** and **not a prediction of real learning outcomes**.
- The generated report is a **shared handoff artifact** (a plan), not an
  executed experiment.
- The MVP supports a **narrow, simple experiment shape**: between-subjects,
  individual-level assignment, **one decision point**, simple conditions/weights,
  `Include All` participants, basic metrics. This is a **deliberate scoping
  choice for the prototype**, not a limitation of UpGrade itself.
- Every major phase transition requires **explicit user approval**.
- The prototype has **not yet been evaluated with real EdTech teams**; the
  walkthrough is illustrative. Evaluation is anticipated during onboarding in
  **Fall 2026**.

**Avoid implying:**
- persistent saved projects or account-based project history,
- automatic pull-request creation or client-code modification,
- real deployment or full production automation / autonomous experiment launch,
- that simulated numbers predict real learning effects,
- that it replaces researchers, the UpGrade UI, or UpGrade documentation.

**Live-demo honesty:** the consultant's wording is non-deterministic. Describe
its proposals as "what it's suggesting right now," not as fixed product behavior.

## 9. Later work (to be done before the talk)

Tracked in [../docs/tasks.md](../docs/tasks.md) under Backlog.

- [ ] **Finalize the slide outline** and write real slide content into the deck
      scaffold (replace the placeholders).
- [ ] **Capture MiniMathApp screenshots** — full screen + a cropped problem card
      / diagram — at presentation resolution.
- [ ] **Write speaker notes / script** — per-slide talking points plus demo
      narration; fill the notes comment blocks in the deck.
- [ ] **Prepare the live-demo prompt/script** — the exact text to type and which
      screenshot to upload, with a small-cohort simulation choice.
- [ ] **Rehearse timing** — confirm 5 min slides + 5 min demo, with a hard stop.
- [ ] **Export the Marp deck to PDF** for a portable backup.

## 10. Risk / fallback notes

- **Live AI demos are fragile.** Record a backup screen capture of a full
  successful run, and keep fallback screenshots of each step (proposed design,
  simulation summary, report panel) so the talk survives a network/API hiccup.
- **Pre-stage** the signed-in chat and have the MiniMathApp screenshot ready to
  upload to save stage time.
- **Use a small synthetic cohort** so the simulation returns quickly and the
  numbers are easy to read.
- Keep the **synthetic caveat** on screen/voiced whenever simulation numbers are
  shown.
