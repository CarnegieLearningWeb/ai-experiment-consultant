# Architecture

Companion to [mvp.md](mvp.md). Records load-bearing technical decisions so
future Claude Code sessions can pick up without re-deriving them.

## Stack

- **Frontend:** Vite + vanilla JavaScript. ES modules. No framework.
- **Backend:** Node.js (>=20) + Express. ES modules.
- **AI:** Anthropic SDK (`@anthropic-ai/sdk`). Added in milestone M2; not yet installed.
- **Deployment target:** alongside the existing UpGrade demo app on its EC2 host, behind a reverse proxy that routes `/ai-consultant` to this app's static client build and `/api/v1/ai-consultant/*` to this app's Express server.

### Why this stack

- The user explicitly chose vanilla JS + Vite + Express for this prototype to keep the surface area small, avoid framework churn, and stay easy to iterate on with Claude Code in future sessions.
- No TypeScript: the prototype is small enough that the ergonomics aren't worth the setup cost. If the prototype grows past this, revisit.
- No Next.js / React / Auth.js / NextAuth: explicit non-goals for this codebase.

## Repository layout

```
upgrade-consultant/
├── package.json             npm workspaces root + dev orchestration
├── .env.example             Copy to .env locally
├── CLAUDE.md                Claude Code orientation
├── README.md
├── docs/                    Source of truth and dev docs
├── client/                  Vite + vanilla JS frontend (workspace)
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.js          Entry point; wires DOM + app
│       ├── app.js           Chat UI state and rendering
│       ├── api.js           Thin fetch wrapper for /api/v1/ai-consultant/*
│       └── styles.css
└── server/                  Express backend (workspace)
    ├── src/
    │   ├── index.js         Server entry (boot + listen)
    │   ├── app.js           Express app factory
    │   ├── config.js        Env var loading + validation
    │   ├── lib/
    │   │   └── (TODO: anthropic.js, upgrade.js helpers)
    │   └── routes/
    │       ├── index.js     Mounts all routes under /api/v1/ai-consultant
    │       ├── health.js
    │       ├── chat.js
    │       ├── uploads.js
    │       ├── simulation.js
    │       └── report.js
    └── .env.example         Mirror of root for clarity
```

## URLs and routing

| Concern | Value |
|---|---|
| Production app URL | `https://<host>/ai-consultant` |
| Production API namespace | `/api/v1/ai-consultant/*` |
| Vite dev server | `http://localhost:5173/ai-consultant/` |
| Express dev server | `http://localhost:3001` |
| Dev API proxy | Vite proxies `/api/*` → `http://localhost:3001` |

Vite's `base: '/ai-consultant/'` is set in [client/vite.config.js](../client/vite.config.js) so built asset URLs resolve correctly behind the sub-path. The frontend always uses **relative** paths (`/api/v1/ai-consultant/...`) so the same build works in dev and prod without changes.

## Environment variables

See [.env.example](../.env.example). Required:

- `PORT` — Express port (default 3001).
- `NODE_ENV` — `development` or `production`.
- `CLIENT_ORIGIN` — used by CORS in dev to allow the Vite origin (`http://localhost:5173`). In prod, the client and API share an origin so CORS is a no-op.
- `ANTHROPIC_API_KEY` — required once the chat endpoint is wired (M2).
- `UPGRADE_API_URL` — base URL of the UpGrade demo backend (default `https://upgrade-demo.carnegielearning.com/api`). Paths sit under `/v6/...`.
- `UPGRADE_SERVICE_ACCOUNT_KEY_PATH` — path to the Google service-account JSON used to mint OAuth tokens for UpGrade requests (default `upgrade-service-account-key.json` at the repo root, git-ignored). Pattern in [docs/upgrade-knowledge/upgrade-auth.js](../docs/upgrade-knowledge/upgrade-auth.js). Required for M4.

## Server design

- **One Express app, one process.** No microservices.
- **ESM throughout** (`"type": "module"`).
- **Route mounting:** [server/src/routes/index.js](../server/src/routes/index.js) is the single mount point under `/api/v1/ai-consultant`. Adding an endpoint = adding a file + one `router.use(...)` line.
- **In-memory state.** No DB. Conversation context is sent from the client each turn (the source of truth lives in the browser). The server stays stateless except for short-lived upload references.
- **Uploads:** stored under `server/uploads/` (gitignored) keyed by a server-generated id. Returned to the client as `{ id, mimeType, size }`. The id is referenced by subsequent `/chat` calls. Cleanup is post-MVP; for now, files live for the lifetime of the process.
- **Error envelope:** errors return `{ error: { code, message } }` with HTTP status. Code strings are stable for client-side handling.
- **No streaming yet.** `/chat` returns the full assistant turn in one response. Streaming (SSE) is a candidate for M2.5 if response latency feels bad in the demo.

## Frontend design

- **No framework.** Hand-written DOM updates in [client/src/app.js](../client/src/app.js).
- **State:** a single in-module store object with messages, structured fields, and upload references. UI re-renders on state changes via a small `render()` function.
- **No router.** The whole app is one page.
- **Markdown rendering:** report output uses a markdown-to-HTML library added in M5 (likely `marked`). Until then, report output is rendered in a `<pre>` block.
- **Composer:** textarea + file picker + send button. Enter submits, Shift+Enter inserts newline.

## AI behavior (planned)

The `/chat` endpoint constructs an Anthropic request with:

- A system prompt that establishes the consultant role, the six-phase flow,
  and the supported-experiment-shape constraints from [upgrade-knowledge/](upgrade-knowledge/).
- Conversation history sent by the client.
- Curated UpGrade context loaded from [upgrade-knowledge/](upgrade-knowledge/) — kept narrow on purpose so the model doesn't propose unsupported designs.
- Structured-output hints when extracting fields (app description, hypothesis, experiment design, etc.).

Implementation pattern not finalized; see [tasks.md](tasks.md) M2.

## Simulation flow (planned)

Outlined in [spec.md](spec.md) §22. Implementation details to be confirmed during M4 against the real UpGrade demo backend — endpoints for creating/starting/deleting a temporary experiment are **not yet documented for us**, so M4 starts with a verification spike before any code. See [open-questions.md](open-questions.md).

## Conventions

- ESM imports everywhere. Use `node:` prefix for built-ins (e.g. `import path from 'node:path'`).
- File names: kebab-case. Function/variable names: camelCase. Constants: UPPER_SNAKE.
- Routes: one resource per file. Export a router; mount it in `routes/index.js`.
- Avoid heavy abstraction. This is a prototype.
- `TODO(<area>):` markers for known gaps so they're grep-able. Areas in current use: `upgrade`, `chat`, `report`, `simulation`, `uploads`.

## Things we explicitly chose not to do

- No authentication. The user can decide later whether to add auth to the existing UpGrade demo app rather than to this prototype.
- No TypeScript.
- No tests yet. Add when behavior stabilizes.
- No CI yet.
- No Docker yet. The host already runs Node.
- No persistent storage. v1 is one-shot per session.
- No streaming responses in M1 — revisit if latency feels bad.
