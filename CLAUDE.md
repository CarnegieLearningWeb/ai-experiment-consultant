# Claude Code Guidance — upgrade-consultant

## What this project is

An AI-assisted experimentation consultant that helps external teams plan
educational experiments using UpGrade. Prototype for the PELE 2026 workshop.
See [docs/spec.md](docs/spec.md) for the full product vision.

## Read these first, in order

1. [docs/spec.md](docs/spec.md) — product vision and intent (source of truth)
2. [docs/mvp.md](docs/mvp.md) — buildable v1 scope
3. [docs/architecture.md](docs/architecture.md) — stack, layout, design patterns
4. [docs/tasks.md](docs/tasks.md) — milestone checklist
5. [docs/setup.md](docs/setup.md) — local setup
6. [docs/upgrade-knowledge/](docs/upgrade-knowledge/) — curated UpGrade knowledge for the AI consultant (intentionally MVP-narrow)
7. [docs/open-questions.md](docs/open-questions.md) — things still undecided

## Stack at a glance

- **Frontend:** Vite + vanilla JavaScript ([client/](client/))
- **Backend:** Node.js + Express, ESM ([server/](server/))
- **Monorepo:** npm workspaces, root `package.json` orchestrates dev
- **Deployment target:** existing UpGrade demo EC2 host at `/ai-consultant`
- **Backend API namespace:** `/api/v1/ai-consultant/*`

## Important constraints

- **No login / auth in this prototype.** Open local/demo access. Auth may be added
  later directly in the existing UpGrade demo Express app, separately from this codebase.
- **No React, no Next.js, no TypeScript.** Plain Vite + vanilla JS by design.
- **Keep [docs/upgrade-knowledge/](docs/upgrade-knowledge/) narrow.** It scopes the AI consultant
  to simple, supported experiment designs. Do not lift advanced UpGrade features
  into it without an explicit reason — that narrowness is a safety rail.
- **Verify UpGrade behavior against real docs.** Do not invent endpoints,
  payloads, or fields. When details are missing, leave a `TODO(upgrade):` marker
  and ask. Authoritative source: https://upgrade-platform.gitbook.io/upgrade-documentation
- **Asset base path matters.** The Vite app is built with `base: '/ai-consultant/'`
  so it can be served behind that sub-path in production.

## Conventions

- ES modules throughout (`"type": "module"`).
- Backend routes live in [server/src/routes/](server/src/routes/), one file per resource.
- All backend endpoints sit under `/api/v1/ai-consultant/...`.
- Frontend talks to the backend using **relative** paths so the sub-path deployment works without changes.
- In dev, Vite proxies `/api/...` to the Express server (default port 3001).

## How to develop

```bash
npm install        # one-time, installs workspaces
npm run dev        # runs client (5173) + server (3001) concurrently
```

See [docs/setup.md](docs/setup.md) for details.

## What to do when something is unclear

If [docs/spec.md](docs/spec.md) doesn't cover it, drop a question into
[docs/open-questions.md](docs/open-questions.md) and pick a reasonable default
rather than blocking. Mark code with `TODO(<area>):` so it's grep-able.
