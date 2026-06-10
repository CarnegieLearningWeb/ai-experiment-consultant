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
    └── src/
    │   ├── index.js         Server entry (boot + listen)
    │   ├── app.js           Express app factory
    │   ├── env.js           .env loading (repo root) + path resolution
    │   ├── lib/
    │   │   ├── prompt.js          System-prompt assembly
    │   │   ├── prompt-knowledge/  Curated UpGrade knowledge inlined into the prompt
    │   │   ├── tools.js           Tool registry (+ tools/ — one file per AI tool)
    │   │   ├── report.js          Report composer (+ report-templates/ static .md)
    │   │   ├── upgrade.js         UpGrade client + cached auth token
    │   │   ├── papers.js          Semantic Scholar client
    │   │   ├── uploads.js         Upload registry + MIME allowlist
    │   │   └── log.js             Debug logging
    │   └── routes/
    │       ├── index.js     Mounts all routes under /api/v1/ai-consultant
    │       ├── health.js
    │       ├── chat.js
    │       └── uploads.js
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

See [.env.example](../.env.example). Loaded from the repo root by [server/src/env.js](../server/src/env.js); the server reads `process.env` directly with no in-code fallbacks, so a missing required value fails fast.

- `ANTHROPIC_API_KEY` — Anthropic API key. The chat route constructs the client at module load, so a missing key fails on server boot.
- `ANTHROPIC_MODEL` — model id (e.g. `claude-opus-4-8`).
- `UPGRADE_API_URL` — base URL of the UpGrade demo backend (`https://upgrade-demo.carnegielearning.com/api`). Paths sit under `/v6/...`.
- `UPGRADE_SERVICE_ACCOUNT_KEY_PATH` — path to the Google service-account JSON used to mint OAuth tokens for UpGrade requests (`upgrade-service-account-key.json` at the repo root, git-ignored; relative paths resolve against the repo root). Implemented in [server/src/lib/upgrade.js](../server/src/lib/upgrade.js) (cached bearer token).
- `SEMANTIC_SCHOLAR_API_KEY` — optional; raises the Semantic Scholar rate cap for the Related Research Grounding step.
- `DEBUG_LOGGING` — set `true` to print categorized server-side activity; off otherwise. Warnings always print.

The Express port (3001) is hardcoded in [server/src/index.js](../server/src/index.js), and the Vite dev proxy targets it directly. In dev the client (`:5173`) and server (`:3001`) differ in origin, but Vite proxies `/api/*` to the server in-process, so no browser cross-origin request reaches Express and no CORS handling is needed.

## Server design

- **One Express app, one process.** No microservices.
- **ESM throughout** (`"type": "module"`).
- **Route mounting:** [server/src/routes/index.js](../server/src/routes/index.js) is the single mount point under `/api/v1/ai-consultant`. Adding an endpoint = adding a file + one `router.use(...)` line.
- **In-memory state.** No DB. Conversation context is sent from the client each turn (the source of truth lives in the browser). The server stays stateless except for short-lived upload references.
- **Uploads:** stored under `server/uploads/` (gitignored) keyed by a server-generated id. Returned to the client as `{ id, mimeType, size }`. The id is referenced by subsequent `/chat` calls. Cleanup is post-MVP; for now, files live for the lifetime of the process.
- **Error envelope:** errors return `{ error: { code, message } }` with HTTP status. Code strings are stable for client-side handling.
- **Streaming via NDJSON.** `/chat` streams the assistant response as newline-delimited JSON events. Core events: `{type:"delta",text}` per text chunk, then a final `{type:"done",stopReason,usage}` (or `{type:"error",code,message}` on failure). Tool execution adds `{type:"tool_start",tool,toolUseId,input}` / `{type:"tool_progress",...,message}` / `{type:"tool_end",...,ok,error?}` events so the client can render a tool-running widget inside the assistant bubble. SSE would also work but POST bodies aren't usable with the browser's `EventSource`, and NDJSON parses trivially from `fetch().body.getReader()` in vanilla JS.
- **Tool-use loop (M4+).** `/chat` runs Anthropic in a recursive loop: call → stream deltas → collect any `tool_use` blocks → if `stop_reason === 'tool_use'`, execute each tool (each tool can emit `tool_progress` events of its own), append the assistant turn + tool_result turn to `messages`, and loop. Tools may run multiple per turn; accuracy is prioritized over token cost. A safety cap (default 8 consecutive tool rounds) prevents runaway loops. Tool registry lives in `server/src/lib/tools.js`; one file per tool with `{ name, description, input_schema, run({input, emit}) }`.

## Frontend design

- **No framework.** Hand-written DOM updates in [client/src/app.js](../client/src/app.js).
- **State:** a single in-module store object with messages, structured fields, and upload references. UI re-renders on state changes via a small `render()` function.
- **No router.** The whole app is one page.
- **Markdown rendering:** report output uses a markdown-to-HTML library added in M5 (likely `marked`). Until then, report output is rendered in a `<pre>` block.
- **Composer:** textarea + file picker + send button. Enter submits, Shift+Enter inserts newline.

## AI behavior

The `/chat` endpoint constructs an Anthropic request with:

- A system prompt assembled by [server/src/lib/prompt.js](../server/src/lib/prompt.js) that inlines the consultant role, the six-phase flow, and the curated UpGrade knowledge in [server/src/lib/prompt-knowledge/](../server/src/lib/prompt-knowledge/) (`upgrade-concepts.md`). Kept narrow on purpose so the model doesn't propose unsupported designs. Client-integration details are intentionally **not** in the prompt — they're fixed report-template content composed by [report.js](../server/src/lib/report.js) (see [spec.md](spec.md) §29–30).
- Conversation history sent by the client (the server is stateless; the browser is the source of truth).
- Defaults: `claude-opus-4-8`, `thinking: {type: "adaptive"}` (model decides depth per turn), `max_tokens: 64000` (safe ceiling for streaming).
- Prompt caching: `cache_control: {type: "ephemeral"}` on the system block. The system prompt is over the 4096-token minimum for Opus 4.7, so cache hits kick in starting on the second turn. Verified `cache_read_input_tokens: 4050` on follow-up turns.
- Override the model via `ANTHROPIC_MODEL` env var if needed (e.g. for cost experiments with Sonnet 4.6).

Stream consumption uses `client.messages.create({ stream: true })` rather than the higher-level `client.messages.stream()` helper — the helper's async iterator wraps the underlying stream in an EventEmitter and aborts via `return()` semantics that interact badly with Express's request lifecycle. The plain `Stream` returned by `create({stream:true})` is a clean async iterator.

Structured-output hints (for extracting app description, hypothesis, etc. into typed fields) are not yet implemented — the report generator (M5) will decide whether to extract via the conversation transcript or via dedicated structured-output calls.

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
- No persistence in v1; conversation state lives in the browser.
