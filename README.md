# AI Experiment Consultant

An AI consultant that helps educational software teams turn an idea or pain
point into a concrete, implementation-ready A/B experiment plan for
[UpGrade](https://www.upgradeplatform.org/), an
experimentation platform for educational software.

## What it does

You describe your learning app and something you'd like to improve, and the
consultant guides you — in a single conversation — to a plan you can act on:

- **Guided consulting flow** — app description → page/problem → hypothesis →
  experiment design → preflight simulation → final report.
- **Screenshots & files** — attach images or PDFs to ground the discussion.
- **Research grounding** — pulls related papers from Semantic
  Scholar to help sharpen a hypothesis.
- **Preflight simulation** — runs a synthetic cohort against UpGrade's demo
  backend so you can see how assignment, enrollment, and metrics would look (no
  real users).
- **Shareable report** — a structured markdown plan, including UpGrade setup and
  client-integration guides, ready to hand to researchers, developers, or an AI
  coding tool.

See [docs/spec.md](docs/spec.md) for the product vision and [docs/mvp.md](docs/mvp.md)
for scope.

## Tech stack

- **Frontend:** Vite + vanilla JavaScript ([client/](client/))
- **Backend:** Node.js + Express, ES modules ([server/](server/))
- **AI:** Anthropic Claude — streaming chat with tool use

## Getting started

**Requirements:** Node.js 20+

```bash
# Clone and install (installs both the frontend and the server)
git clone https://github.com/CarnegieLearningWeb/ai-experiment-consultant.git
cd ai-experiment-consultant
npm install
cp server/.env.example server/.env   # then fill in your credentials
npm run dev
```

Then open the URL Vite prints — by default <http://localhost:5173/ai-consultant/>.

## Project structure

```
ai-experiment-consultant/
├── client/   Vite + vanilla JS frontend
├── server/   Express backend (API under /api/v1/ai-consultant/*)
└── docs/     Product spec, architecture, setup, and reference notes
```
