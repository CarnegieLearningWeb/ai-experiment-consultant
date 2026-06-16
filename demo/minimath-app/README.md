# MiniMathApp (presentation screenshot app)

A tiny, **fictional** math-practice app screen built only to give the PELE 2026
live demo a concrete, believable context and to produce screenshots.

> **This is not part of the AI Experiment Consultant product.** It has **no
> UpGrade integration**, no analytics, and **no experimental variant**. It is a
> single static screen used for the talk. See the talk plan in
> [../../slides/presentation-plan.md](../../slides/presentation-plan.md).

## The scenario it represents

- **App:** `MiniMathApp` — a simple math-practice app for upper-elementary /
  middle-school students.
- **Screen:** an **area / geometry word problem** — a rectangular garden problem
  with a diagram, an answer input, and a submit button, plus light surrounding
  UI (app name, streak, lesson title, problem progress).
- **Pain point (the demo's hook):** many students get stuck or answer
  incorrectly on the first try.

During the live demo, the presenter uploads/refers to a screenshot of *this*
screen and asks the consultant for experiment ideas. The consultant proposes
candidate interventions **live** — so, deliberately, **nothing is pre-built
here**: no hint button, no worked example, no variant.

## What's on the screen

- Top bar: app name + logo, a streak chip, and a student avatar.
- Lesson context: unit/lesson title and a "Problem 3 of 8" progress bar.
- Problem card: the word problem, a simple garden/rectangle diagram (8 m × 5 m),
  a numeric answer input (`m²`), and a **Check answer** button.

The submit button does ordinary answer-checking (the correct area is
`8 × 5 = 40 m²`). A wrong first try shows a gentle "try again" message so you can
screenshot the first-try pain point if you want. That validation is normal base
practice-app behavior — **it is not an experiment.**

## Open it locally

It's fully static with no build step or dependencies.

- **Easiest:** double-click `index.html` (or open it in a browser).
- **Or** serve it (avoids any `file://` quirks):

  ```bash
  cd demo/minimath-app
  python3 -m http.server 8000
  # then open http://localhost:8000
  ```

## Screenshot tips

`screenshot.png` in this folder is the current **canonical clean capture** — the
one intended for the live-demo upload and the slide asset. One screenshot is
enough at this stage; the tips below are for any optional additional captures
later.

- Capture the whole app frame for the "current screen" slide.
- Optionally crop just the problem card / diagram for a tighter shot.
- Take a clean (unanswered) shot and, if useful, a "Not quite — try again" shot
  to illustrate the first-try pain point.

## Files

- `index.html` — the screen (markup + inline SVG diagram).
- `styles.css` — styling (self-contained, system fonts).
- `app.js` — minimal answer-checking only.
- `screenshot.png` — the current clean screenshot for the live-demo upload / slide asset.
