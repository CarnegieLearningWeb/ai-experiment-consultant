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

## M3 — File upload (images first, PDF later)

Goal: user can attach a screenshot to a chat turn.

- [ ] `POST /api/v1/ai-consultant/uploads` accepting `multipart/form-data` (multer); returns `{ id, mimeType, size, filename }`
- [ ] Server stores files under `server/uploads/<id>.<ext>` (gitignored)
- [ ] Allowlist is a single config table keyed by MIME type → `{ extension, anthropicBlockType }`. Initial entries: `image/png`, `image/jpeg`, `image/webp`. Adding `application/pdf` later is a one-line addition.
- [ ] Size cap of 8 MB (configurable via `MAX_UPLOAD_BYTES`)
- [ ] Frontend: file-picker → POST `/uploads` → store the returned id; render a thumbnail in the attachment tray; clear on send/cancel
- [ ] `/chat` accepts `attachments: [{id}]` alongside the user message; server resolves the id, base64-encodes the file, and includes it in the Anthropic request as the right content block (`image` block for images; PDF deferred)
- [ ] Inline thumbnails in past chat turns
- [ ] Reject upload if MIME type not in allowlist with a clear error
- [ ] Optional but worth doing: garbage-collect uploads older than the server process lifetime — for v1 just clear `server/uploads/` on boot

## M4 — Simulation / preflight

Goal: user can run a synthetic experiment against the demo UpGrade backend and see assignment + metric summaries.

**Spike first** — verify against the live UpGrade demo backend before writing code:

- [ ] Confirm endpoints for create / start / delete a temporary experiment (see `docs/open-questions.md`)
- [ ] Confirm request/response shapes for `/v6/init`, `/v6/assign`, `/v6/mark`, `/v6/log`
- [ ] Confirm how to retrieve enrollment + metric results
- [ ] Update `docs/upgrade-knowledge/simulation-api.md` with verified shapes

Then build:

- [ ] `POST /api/v1/ai-consultant/simulation` taking the approved experiment design + cohort size; orchestrating create → start → simulate N participants → fetch results → delete
- [ ] Synthetic cohort generator with a configurable size (default TBD — see open-questions.md)
- [ ] Synthetic metric distributions tied to the chosen condition so results "look reasonable" (with a comment that this is purely demo data)
- [ ] Markdown summary of enrollment + metrics included in the assistant's chat reply
- [ ] Explicit "synthetic / preflight only" labeling in both the chat and the eventual report

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
