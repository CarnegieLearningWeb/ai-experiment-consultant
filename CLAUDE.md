# Claude Code Guidance — upgrade-consultant

## What this project is

An AI-assisted experimentation consultant that helps external teams plan
educational experiments using UpGrade. Prototype for the PELE 2026 workshop.
See [docs/spec.md](docs/spec.md) for the full product vision.

## Read these first, in order

1. [docs/spec.md](docs/spec.md) — product vision and intent (source of truth)
2. [docs/mvp.md](docs/mvp.md) — buildable v1 scope
3. [docs/architecture.md](docs/architecture.md) — stack, layout, design patterns
4. [docs/tasks.md](docs/tasks.md) — task board (Now / Backlog / Done)
5. [docs/setup.md](docs/setup.md) — local setup
6. [docs/simulation-api.md](docs/simulation-api.md) — UpGrade demo-backend API reference (used by the simulation feature)
7. [docs/open-questions.md](docs/open-questions.md) — things still undecided

## Task management

- Before starting any work, read [docs/tasks.md](docs/tasks.md).
- Work only on items under `## Now`; keep it small (1–2 items).
- When a task is done, flip `- [ ]` to `- [x]` (keep the same line).
- Don't start `## Backlog` items unless explicitly told to. If new work surfaces mid-task, add it to `## Backlog` rather than expanding the current task.

## Work cycle (required)

After finishing each task or bugfix:

1. Stop and tell the user what changed and what to manually test (specific actions to take in the browser).
2. Don't start the next task until the user confirms it works.
3. Once the user confirms, commit that task's changes before starting the next task.
4. Mark the task `- [x]` and move it to the **bottom** of `## Done` in [docs/tasks.md](docs/tasks.md) (the section is chronological — oldest first, newest last), then pull the next item into `## Now`.

## Stack at a glance

- **Frontend:** Vite + vanilla JavaScript ([client/](client/))
- **Backend:** Node.js + Express, ESM ([server/](server/))
- **Monorepo:** npm workspaces, root `package.json` orchestrates dev
- **Deployment target:** existing UpGrade demo EC2 host at `/ai-consultant`
- **Backend API namespace:** `/api/v1/ai-consultant/*`

## Where things live

- **Chat endpoint with recursive tool-use loop:** [server/src/routes/chat.js](server/src/routes/chat.js). NDJSON events: `delta`, `tool_start`, `tool_progress`, `tool_end`, `artifact`, `done`, `error`.
- **System prompt assembly:** [server/src/lib/prompt.js](server/src/lib/prompt.js). Inlines the curated UpGrade knowledge from [server/src/lib/prompt-knowledge/](server/src/lib/prompt-knowledge/) (`upgrade-concepts.md`). Client-integration is deliberately not in the prompt — it's a report-template section composed by [report.js](server/src/lib/report.js).
- **Tool registry:** [server/src/lib/tools.js](server/src/lib/tools.js). One file per tool under [server/src/lib/tools/](server/src/lib/tools/) with `{name, description, input_schema, run({input, emit})}`.
- **UpGrade client + token cache:** [server/src/lib/upgrade.js](server/src/lib/upgrade.js). `displayNameForMetric()` is here; AI never parses display strings.
- **Report composer + templates:** [server/src/lib/report.js](server/src/lib/report.js) and [server/src/lib/report-templates/](server/src/lib/report-templates/) (`.md` files with `{{placeholder}}` markers, grep-friendly placeholder text).
- **Upload registry + allowlist:** [server/src/lib/uploads.js](server/src/lib/uploads.js).
- **Debug logging:** [server/src/lib/log.js](server/src/lib/log.js). Off unless `DEBUG_LOGGING` is set truthy in `.env`. `log.warn` always prints.
- **Frontend state + render:** [client/src/app.js](client/src/app.js). Renders markdown via `marked` for assistant bubbles. Side panel is mounted in [client/index.html](client/index.html) as `<aside id="artifact-panel">`.

## Important constraints

- **No login / auth in this prototype.** Open local/demo access. Auth may be added
  later directly in the existing UpGrade demo Express app, separately from this codebase.
- **No React, no Next.js, no TypeScript.** Plain Vite + vanilla JS by design.
- **Keep the prompt knowledge in [server/src/lib/prompt-knowledge/](server/src/lib/prompt-knowledge/) narrow.** It scopes the AI consultant
  to simple, supported experiment designs. Do not lift advanced UpGrade features
  into it without an explicit reason — that narrowness is a safety rail. Anything
  loaded there ships verbatim to the model, so keep it reviewed and free of
  dev-only notes (TODOs, milestone refs). Dev reference lives under [docs/](docs/).
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
- In dev, Vite proxies `/api/...` to the Express server (port 3001, hardcoded).

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
