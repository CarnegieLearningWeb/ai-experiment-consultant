# upgrade-consultant

AI-assisted experimentation consultant that helps educational software teams
plan A/B experiments using [UpGrade](https://upgrade-platform.gitbook.io/upgrade-documentation).
A lightweight prototype built for the [PELE 2026 workshop](https://sites.google.com/carnegielearning.com/pele-2026/home).

> **Status:** scaffolding only. The MVP workflow is not yet implemented — see [docs/tasks.md](docs/tasks.md) for the milestone plan.

## What it does (planned)

The user chats with an AI consultant. The consultant walks them through six phases —
learning app description → page/problem → experiment idea → UpGrade plan →
simulation/preflight → final markdown report — and generates a structured,
actionable plan they can share with researchers, developers, or AI coding tools.
See [docs/spec.md](docs/spec.md) for the full product vision and [docs/mvp.md](docs/mvp.md)
for the buildable v1 scope.

## Stack

- **Frontend:** Vite + vanilla JavaScript ([client/](client/))
- **Backend:** Node.js + Express ([server/](server/))
- **Deployment target:** alongside the existing UpGrade demo at `/ai-consultant`

## Quick start

Requires Node.js 20+.

```bash
npm install
cp .env.example .env       # fill in ANTHROPIC_API_KEY when implementing chat
npm run dev
```

Open http://localhost:5173/ai-consultant/. The backend listens on port 3001;
Vite proxies `/api/...` to it during dev.

See [docs/setup.md](docs/setup.md) for more.

## Repository layout

```
upgrade-consultant/
├── client/                  Vite + vanilla JS frontend
├── server/                  Express backend (API at /api/v1/ai-consultant/*)
├── docs/
│   ├── spec.md              Product vision (source of truth)
│   ├── mvp.md               Buildable v1 scope
│   ├── architecture.md      Stack and design decisions
│   ├── tasks.md             Milestone checklist
│   ├── setup.md             Local setup
│   ├── open-questions.md    Open questions
│   └── upgrade-knowledge/   Curated UpGrade context for the AI consultant
└── CLAUDE.md                Orientation for Claude Code sessions
```

## Scope

- **In:** chat-based consulting flow, file upload, simulated UpGrade experiment, markdown report.
- **Out (for now):** authentication, persistent database, real production experiment launches,
  automated code changes, broad UpGrade feature support.

Authentication is intentionally excluded from this prototype. It may be added later directly in the existing UpGrade demo app, separately from this codebase.
