# PELE 2026 deck — Slidev version

A [Slidev](https://sli.dev) port of the PELE 2026 *AI Experiment Consultant* talk,
created to make the **live, iframe-based demo** easier to run from inside the deck
(presenter notes on the laptop, interactive demo on the external display).

> **Source of truth / fallback:** the finalized **Marp** deck at
> [`../pele-2026-ai-experiment-consultant.md`](../pele-2026-ai-experiment-consultant.md)
> and its exports in [`../export/`](../export/) remain the canonical version and the
> backup. This Slidev deck mirrors that content slide-for-slide and adds **one**
> embedded live-demo slide. If anything goes wrong with Slidev on the day, present
> the Marp PDF/PPTX/HTML from `../export/`.

## Slides

Same 8 main slides as the Marp deck, plus an UpGrade introduction and 1 added live-demo iframe slide (10 total):

1. AI Experiment Consultant (title)
2. **What is UpGrade?** ← added
3. The onboarding problem
4. What it does
5. Six-phase consulting workflow
6. Why the report matters
7. Live demo — MiniMathApp (the screenshot / setup slide)
8. **Live demo — embedded AI Experiment Consultant (iframe)** ← added
9. Scope today, future direction
10. Thank you / Questions

Speaker notes are the trailing `<!-- ... -->` comment on each slide and appear in
Slidev presenter mode.

## Install

```bash
cd slides/slidev
npm install
```

This installs into `slides/slidev/node_modules` only — it does **not** touch the
root app workspace (`client` / `server`).

## Run (dev)

```bash
cd slides/slidev
npm run dev
```

Then open:

- **Audience view:** <http://localhost:3030/1>
- **Presenter view (notes + next slide + timer):** <http://localhost:3030/presenter/1>

(Slidev uses port **3030** by default. `npm run dev` also tries to open a browser;
use `npx slidev --port 3030` if you want to control it manually.)

## Presenting: external display + presenter notes

1. Connect the projector/TV as an **extended** display (not mirrored at the OS level).
2. Open the **audience view** (`/1`) and put that browser window **fullscreen on the
   external display** (press `F` in Slidev for fullscreen).
3. Open the **presenter view** (`/presenter/1`) on your **laptop** screen. Slidev keeps
   the two windows in sync, and the presenter view shows your notes, the next slide,
   and a timer.
4. On the live-demo slide, the **audience window (external display) holds the real,
   interactive iframe**. Presenter view's **Screen Mirror** gives you a live visual
   preview of that external display on your laptop, next to your notes — but Screen
   Mirror does not, on its own, send your clicks into the iframe.
5. To drive the demo, **move your mouse cursor onto the external display and operate the
   actual audience window / iframe there** — that is what the audience sees. While you do
   that, you can keep watching the mirrored external screen and reading these notes in
   presenter view on the laptop.

## Change the live-demo URL (one place)

Open [`slides.md`](slides.md), find the live-demo slide (`layout: iframe`) and edit its
`url:` field in the slide frontmatter:

```yaml
---
layout: iframe
url: http://localhost:5173/ai-consultant/login   # ← change this
scale: 0.8
---
```

- **Local app (default):** `http://localhost:5173/ai-consultant/login`
  (start the app from the repo root with `npm run dev`; the client serves on 5173)
- **Deployed app:** `https://upgrade-demo.carnegielearning.com/ai-consultant/login`

### Iframe zoom (scale)

The embedded app is rendered **slightly zoomed out** so more of it is visible. This uses
Slidev's built-in `iframe` layout `scale` field: `scale: 0.8` makes the layout size the
iframe to 125% (= 1 / 0.8) and apply `transform: scale(0.8)` from the top-left, so it
**fills the full slide canvas** while showing ~25% more of the app. To change the zoom,
edit `scale:` in that slide's frontmatter (lower = more zoomed out, e.g. `0.7`). The
built-in layout recomputes the sizing for you — no CSS to touch.

### Black area around the demo is expected (letterbox)

The demo iframe fills the entire **16:9 slide canvas** — there is no padding, card, or
background inside the canvas. Any **black around the slide in a browser window is Slidev's
letterbox** (`--slidev-slide-container-background`), shown when the window's aspect ratio
isn't 16:9. It is **outside** the slide canvas, so it is not something to remove from the
slide — it shrinks to nothing when you present **fullscreen** (press `F`) on a 16:9
external display.

### ⚠️ Login inside the iframe (manual check)

The app's login uses **Google OAuth**, which typically **refuses to load inside an
iframe** (Google sets framing restrictions). The login page itself frames fine, but the
"Sign in with Google" step may be blocked. Practical options:

- **Sign in before the talk** (in a normal tab on the same browser profile) so the
  embedded view already lands on the chat, **or**
- run the demo in a **separate browser window** (not embedded) if the embedded login is
  blocked — keep the Slidev presenter notes on the laptop either way.

Verify this in your venue/browser ahead of time. See **Follow-up** below.

## Export (optional)

```bash
cd slides/slidev
npm run build     # static SPA into ./dist (host anywhere)
npm run export    # PDF — requires: npm i -D playwright-chromium
```

The embedded iframe demo only works in the live dev/SPA build, not in a static PDF —
the Marp exports in `../export/` are the portable, self-contained backup.

## Keeping the Marp deck as fallback

Nothing here modifies the Marp deck or its exports. Keep `../export/*.pdf` (and `.pptx`)
on your laptop and a USB stick. If Slidev or the live demo fails on the day, present the
Marp PDF and talk through the demo using the recorded backup / screenshots.

## Follow-up (not done here — would need app-side work)

Running the demo *inside* the iframe is blocked mainly by the OAuth login step. A future,
app-side improvement (out of scope for this deck task) could add a presenter-only way to
reach the chat without the Google redirect — e.g. a demo/guest entry behind a flag — so
the whole demo runs embedded. This deck does **not** change app behavior; it only points
at a local or deployed URL.
