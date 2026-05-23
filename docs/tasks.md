# Tasks — milestone checklist

Working plan for building the MVP. Tick items off as they land. Each milestone
ends in something demoable.

## M0 — Repository foundation ✅

Goal: a clean repo that another Claude Code session can pick up and run.

- [x] `docs/spec.md` (user-authored)
- [x] `CLAUDE.md`, `README.md`
- [x] `docs/mvp.md`, `docs/architecture.md`, `docs/tasks.md`, `docs/setup.md`, `docs/open-questions.md`
- [x] `docs/upgrade-knowledge/` placeholder structure
- [x] npm workspaces root `package.json`
- [x] Vite + vanilla JS client scaffold (chat shell, no AI yet)
- [x] Express server scaffold with route stubs returning 501
- [x] `.env.example`, `.gitignore`, `.nvmrc`
- [x] `npm install && npm run dev` runs both servers and the placeholder UI loads

## M1 — Static chat shell ✅

Goal: a usable chat UI with no AI behind it. Echoes user messages locally; backend `/chat` is still a 501 stub.

- [x] Header (app name, "New Chat" button)
- [x] Message list (user right-aligned, assistant left-aligned)
- [x] Composer: textarea + file picker + send. Enter submits, Shift+Enter for newline.
- [x] Frontend state: messages array, pending-attachment slot
- [x] "New Chat" clears state
- [x] Pass an accessibility sniff: `role="log"` + `aria-live="polite"` on messages, focus returns to input after send, removable attachment chip with `aria-label`
- [x] Empty-state landing with three starter prompts (click to populate the composer)
- [x] Send button disabled when there's nothing to send or while an in-flight echo is pending (sets up the M2 loading affordance)
- [x] Tiny CSS pass; readable on desktop, mobile media query at ≤600px uses `100dvh` and tightens padding

## M2 — Real `/chat` powered by Anthropic ✅

Goal: the consultant actually responds. Six-phase awareness lives in the system prompt.

- [x] Add `@anthropic-ai/sdk` to `server/`
- [x] System prompt in [server/src/lib/prompt.js](../server/src/lib/prompt.js):
  - establishes the consultant role
  - encodes the six-phase flow (kept implicit in chat, not surfaced as a stepper)
  - bakes in supported-experiment-shape constraints by inlining [docs/upgrade-knowledge/concepts.md](upgrade-knowledge/concepts.md) and [client-integration.md](upgrade-knowledge/client-integration.md)
  - explicitly forbids unsupported experiment types and synthetic-data overclaims
- [x] `POST /api/v1/ai-consultant/chat`:
  - accepts `{ messages: [{role, content: string}] }`
  - streams NDJSON: `{type:"delta",text}` then `{type:"done",stopReason,usage}` (or `{type:"error",code,message}`)
- [x] Wire UI to the real endpoint; assistant bubble grows as deltas arrive
- [x] Thinking-dot indicator while we wait for the first delta
- [x] Streaming chosen over full response — works in vanilla JS via NDJSON + `ReadableStream`
- [x] Prompt caching: `cache_control: {type: "ephemeral"}` on the system block; verified `cache_read_input_tokens: 4050` on follow-up turns
- [x] Defaults: `claude-opus-4-7` with `thinking: {type: "adaptive"}` (model self-moderates depth), `max_tokens: 64000` (safe ceiling for streaming, plenty of headroom for full reports)
- [ ] Streaming — already done as part of M2 (was previously deferred to M2.5)

## M3 — File upload (images first, PDF later) ✅

Goal: user can attach a screenshot to a chat turn.

- [x] `POST /api/v1/ai-consultant/uploads` accepting `multipart/form-data` (multer); returns `{ id, mimeType, size, filename }`
- [x] Server stores files under `server/uploads/<id>.<ext>` (gitignored)
- [x] Allowlist is a single config table in [server/src/lib/uploads.js](../server/src/lib/uploads.js) keyed by MIME type → `{ ext, kind }`. Initial entries: `image/png`, `image/jpeg`, `image/webp`. Adding `application/pdf` later is a one-line addition + a `document` content-block branch in `chat.js` (link in code).
- [x] Size cap of 8 MB (configurable via `MAX_UPLOAD_BYTES`)
- [x] Frontend: file-picker → POST `/uploads` → store the returned id; render an upload-state chip (uploading → ready → error) with a removable thumbnail
- [x] `/chat` accepts `attachments: [{id}]` alongside the user message; server resolves the id, base64-encodes the file, and includes it in the Anthropic request as an `image` content block
- [x] Inline thumbnails in past chat turns (via blob URL — survives the page session but not a reload, since there's no persistence in v1)
- [x] Reject upload if MIME type not in allowlist with a structured 415 error
- [x] Garbage-collect: wipe `server/uploads/` on server boot (in-memory registry resets on restart too, so this keeps disk and registry in sync)
- [x] Verified end-to-end: uploaded a 1024×1024 PNG, attached to a chat turn, Claude correctly identified the image content

## M4 — Simulation / preflight (via AI tool call) ✅

Goal: when the user agrees to run a simulation, the AI calls a `run_simulation` tool. The tool orchestrates the documented UpGrade flow, streams progress back to the chat UI, returns enrollment + metric results to the AI, and the AI weaves those results into its next response. API shapes documented in [upgrade-knowledge/simulation-api.md](upgrade-knowledge/simulation-api.md).

Verified end-to-end on 2026-05-23: 30-participant simulation against the live demo backend, AI generated structured input + synthetic specs, all 7 lifecycle steps fired in order, cleanup confirmed (no leftover-warning logs), AI formatted the markdown result + disclaimer + follow-up offer correctly. Plain chat path still works (no regression).

**Implementation details captured in code:**
- Tool-use loop: [server/src/routes/chat.js](../server/src/routes/chat.js). Empty thinking blocks (Opus 4.7 `display: "omitted"` default) are filtered before re-sending to Anthropic.
- Tool registry: [server/src/lib/tools.js](../server/src/lib/tools.js) — one entry per tool. Add a new tool by adding a file under `tools/` and one entry to the REGISTRY.
- run_simulation: [server/src/lib/tools/run-simulation.js](../server/src/lib/tools/run-simulation.js). 20 concurrent participant calls, ~800ms-throttled progress events, `aiconsult-sim-<runId>-...` naming, try/finally cleanup.
- UpGrade client: [server/src/lib/upgrade.js](../server/src/lib/upgrade.js). Cached Google service-account token. Bearer flow implemented (server tested with demo backend's auth currently off, will keep working when re-enabled). `displayNameForMetric` derives `"completionRate (Percent = COMPLETED)"` from structured query.
- Service-account key path now resolves relative to repo root regardless of process cwd ([server/src/config.js](../server/src/config.js)).
- Client tool widget: rendered above the assistant bubble; shows progress lines as they stream in, ✓/⚠ on completion. The cohort counter ("Running N/M…") updates in place via the `replaceKey` field on `tool_progress` events.
- Debug logging in [server/src/lib/log.js](../server/src/lib/log.js), toggled by `DEBUG_LOGGING` env var (defaults on in dev). Categories: `[tool]`, `[upgrade]`, `[sim]`, `[chat]`, `[warn]`. Warnings always print. The `assignUser` silent-failure path (HTTP 200 with empty `assignedCondition`) explicitly logs, and the simulation summary line at the end of each run reports `enrollment + counters` so future enrollment shortfalls are diagnosable from the logs.

### Tool-use loop in `/chat` (new architectural piece)

Adding tool calling to the chat endpoint is the load-bearing change in M4. It also unlocks M5 (the report generator will be a tool) and future tools (`search_related_papers`, etc.).

- [ ] Replace the single-turn Anthropic call in [server/src/routes/chat.js](../server/src/routes/chat.js) with a recursive loop:
  - call Anthropic with current `messages` + `tools`
  - stream text deltas through to the client as today
  - collect any `tool_use` blocks from the response
  - if `stop_reason !== 'tool_use'`: emit `done` and return
  - otherwise: append the assistant turn (with its `tool_use` blocks) to `messages`, execute each tool, append a `tool_result` user turn for each, loop
- [ ] **Tools may execute in the same turn in any order; the AI can chain multiple tools before its final reply.** Accuracy + reliability over token cost, per the brief.
- [ ] Tool registry in [server/src/lib/tools.js](../server/src/lib/tools.js): one file per tool definition + handler, declared with `{ name, description, input_schema, run }`. The chat loop dispatches to `run({ input, emit })` where `emit` lets the tool stream progress events to the client during execution.
- [ ] Expand the NDJSON event vocabulary:
  - `{type: "tool_start",    tool, toolUseId, input}`
  - `{type: "tool_progress", tool, toolUseId, message}`  (free-form human-readable progress)
  - `{type: "tool_end",      tool, toolUseId, ok, error?}`
- [ ] **Safety cap:** abort if the same turn exceeds N consecutive tool-call rounds (e.g. N=8). Surface as an error event.

### `run_simulation` tool

- [ ] Tool input schema is structured (no fragile parsing of the metric display string):

  ```json
  {
    "experiment": {
      "name": "string", "description": "string",
      "decisionPoint": { "site": "string", "target": "string" },
      "conditions": [
        { "code": "control",     "weight": 50 },
        { "code": "hint_button", "weight": 50 }
      ],
      "metrics": [
        {
          "key": "completionRate",
          "datatype": "categorical",
          "allowedValues": ["COMPLETED", "NOT_COMPLETED"],
          "query": { "operationType": "percentage", "compareFn": "=", "compareValue": "COMPLETED" }
        },
        { "key": "timeOnTask", "datatype": "continuous", "query": { "operationType": "avg" } }
      ]
    },
    "cohortSize": 200,
    "syntheticSpecs": {
      "completionRate": {
        "control":     { "COMPLETED": 0.5, "NOT_COMPLETED": 0.5 },
        "hint_button": { "COMPLETED": 0.7, "NOT_COMPLETED": 0.3 }
      },
      "timeOnTask": {
        "control":     { "min": 8,  "max": 12 },
        "hint_button": { "min": 10, "max": 18 }
      }
    }
  }
  ```

- [ ] `cohortSize`: default 200, range **10–1000**. Validate at the tool boundary.
- [ ] `syntheticSpecs` are **implicit** — the AI generates them quietly based on its sense of how the intervention should behave (and any numeric hints the user dropped during consulting). The consultant does **not** surface these to the user unless the user asks. If the user asks ("can I see/change the values for simulation?"), the AI shares and lets them adjust.
- [ ] Display name of each metric (e.g. `"completionRate (Percent = COMPLETED)"`) is **derived deterministically** from `key + query` in [server/src/lib/upgrade.js](../server/src/lib/upgrade.js). The AI never parses or reconstructs this string.

### UpGrade client (`server/src/lib/upgrade.js`)

- [ ] Install `google-auth-library`.
- [ ] Token cache: read `UPGRADE_SERVICE_ACCOUNT_KEY_PATH`, mint a Google access token, cache until it's near expiry. Reuse [docs/upgrade-knowledge/upgrade-auth.js](upgrade-knowledge/upgrade-auth.js) as the pattern reference (it's CommonJS — port to ESM).
- [ ] Thin wrappers for each endpoint in [simulation-api.md](upgrade-knowledge/simulation-api.md): management endpoints (`/metric/*`, `/experiments`, `/experiments/state`, `/stats/enrollment/detail`, `/query/analyse`) get a `Bearer` token; client endpoints (`/v6/*`) send only `User-Id`. Implement the bearer flow even though the demo backend currently has auth checking disabled — it's documented to come back.
- [ ] Helpers: `experimentName({ runId })`, `userId({ runId, index })`, `repeatedMeasure: "MOST RECENT"` (always — never overrideable). Experiment name prefix: `aiconsult-sim-<runId>-<userExperimentName>`.

### Orchestrator (in the `run_simulation` handler)

The flow per [simulation-api.md](upgrade-knowledge/simulation-api.md):

1. `POST /metric/save` (using `"add"` as the only context — override here, the AI is not aware)
2. `POST /experiments` — generate UUID v4s for experiment / partition / condition / query ids in the payload; capture server-assigned ids from the response
3. `POST /experiments/state` → `enrolling`
4. **For each participant** (batched concurrent calls — see below):
   - `POST /v6/init`
   - `POST /v6/assign` → extract `data.find(...).assignedCondition?.[0]`
   - `POST /v6/mark` — always called, even if assign failed or assignedCondition was null
   - `POST /v6/log` with a single sampled value per metric drawn from `syntheticSpecs[metric][condition]`
5. `POST /stats/enrollment/detail` + `POST /query/analyse`
6. Cleanup in `finally`: `DELETE /experiments/:id` then `DELETE /metric/:key` for each metric. Log + continue if either fails — low risk per the doc.

- [ ] **Concurrency: 20 concurrent participant batches** behind a `p-limit`-style semaphore. With 200 participants and ~200ms per request that's ~2s of wall time; with 1000 it's ~10s. If the demo backend protests we can dial back.
- [ ] Per-participant failures: log + skip + count. Don't abort the whole cohort. Surface the failure count in the result summary.
- [ ] Stream `tool_progress` events: "creating experiment…", "saving metrics…", "running 47/200…" (throttled to ~once per second so we don't spam the channel), "fetching results…", "cleaning up…".

### Result formatting

- [ ] After results land, return a structured object to the AI (the tool's return value):
  ```json
  {
    "experimentId": "...",
    "enrollment":  { "control": 47, "hint_button": 53 },
    "queries": [
      { "metric": "completionRate", "display": "Percent = COMPLETED", "byCondition": { "control": 50.0, "hint_button": 70.2 } },
      { "metric": "timeOnTask",     "display": "Mean",                "byCondition": { "control": 10.4, "hint_button": 14.1 } }
    ],
    "failures": { "init": 0, "assign": 0, "mark": 0, "log": 0 },
    "warnings": ["control got 0 participants — try a larger cohort"]
  }
  ```
- [ ] The AI then formats this into a markdown summary in its reply (the table layout from simulation-api.md), adds interpretation, and includes the **synthetic-only disclaimer** ("these numbers do not predict real outcomes — the simulation is a preflight demonstration of how UpGrade collects and reports data"). The disclaimer is part of the system prompt so the AI does not forget it.
- [ ] If a warning condition is hit (zero enrollment in a condition, all participant calls failed for a metric, etc.) the AI may offer a single retry. One retry per turn, then surface the result.

### Client UI changes

- [ ] Render `tool_start` / `tool_progress` / `tool_end` events as a small "thinking" widget inside the assistant bubble — e.g.:
  ```
  🔧 Running simulation…
     • Created experiment
     • Running 200 participants (47/200)
     • Fetching results
     ✓ Done
  ```
  Above (or before) the assistant's eventual text reply for that turn.
- [ ] Errors during tool execution show in red inside the same widget; the AI still gets the error in its tool_result and can decide what to say.

### Verification

- [ ] End-to-end smoke test: run a 100-participant simulation against the live demo backend; confirm cleanup actually deletes both the experiment and the metrics.
- [ ] Re-run with the same experiment name — should succeed (no leftover state).
- [ ] Confirm the AI can chain tools: ask it to "summarize my plan and then run a small simulation" — verify the chat loop survives the back-to-back tool calls.
- [ ] Confirm graceful failure: temporarily point `UPGRADE_API_URL` at a dead host and verify the tool surfaces a clear error rather than hanging.

## M5 — Report generation

Goal: user can ask for a final markdown report and copy it.

- [ ] `POST /api/v1/ai-consultant/report` builds the report from current structured state
- [ ] Hybrid generation: deterministic templates for fixed sections (setup guide, client integration guide), AI generation for dynamic sections (app description, hypothesis, experiment design, simulation interpretation, TODOs)
- [ ] Report sections from `docs/spec.md` §28
- [ ] **Markdown rendering** — add `marked` (or similar) and render assistant turns + report output as HTML. The consultant already produces markdown today and it shows as plaintext; M5 fixes that since the report needs it anyway.
- [ ] Copy-to-clipboard button on the report
- [ ] Confirmation step: AI lists included sections and asks whether the user wants to exclude anything before generation

## M6 — Demo polish (ChatGPT/Claude-style UI)

Goal: presentable for the PELE 2026 workshop demo. Target visual language: ChatGPT / Claude.ai web UI.

- [ ] **Layout:** use the full page width (current 820px max-width is too narrow for a demo).
- [ ] **Assistant turns:** no bubble — render as flush body text aligned to the conversation column. User turns keep a subtle bubble for visual separation.
- [ ] **Composer:** redesign as a single rounded panel hugging the bottom of the viewport (textarea + attach icon + send arrow icon, like Claude.ai). Move the "prototype build" hint into a small footer below the composer or into the empty-state copy.
- [ ] **Reading width inside the conversation column** — assistant text shouldn't go edge-to-edge on wide screens.
- [ ] **Typography pass** — pick a real body font, lock heading scale, tighten line-height for assistant prose.
- [ ] First-load empty state with example prompts (already done in M1 — re-evaluate copy and visuals).
- [ ] Persistent banner that this is a planning prototype, not a live experiment runner.
- [ ] Demo script + walkthrough notes in `docs/setup.md`.
- [ ] If markdown rendering didn't land in M5, do it here.

## M7 — Deployment

Goal: the prototype is reachable at `/ai-consultant` on the existing demo host.

- [ ] Build script outputs static assets ready to be served at `/ai-consultant`
- [ ] Server process management on the demo host (pm2 / systemd — TBD)
- [ ] Reverse proxy config sketch for routing `/ai-consultant` → static build, `/api/v1/ai-consultant/*` → Express
- [ ] Smoke test the deployed URL

## M8 — Paper

Goal: the 4-page PELE 2026 WIP/Demo paper. (Not a code milestone, but tracked so it stays visible.)

- [ ] Outline aligned with `spec.md` §39
- [ ] First draft
- [ ] Internal review
- [ ] Submit

## Deferred (post-MVP)

- Persistent project history
- Related-paper retrieval (needs a curated source first)
- Variant content generation
- Client code generation
- Repo / PR integration
- Multi-decision-point and factorial experiments
- Authentication — add to the existing UpGrade demo app, not this codebase, if needed at all
