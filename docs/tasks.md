# Tasks — milestone checklist

Working plan for building the MVP. M0–M5 are complete; M6 is the next thing to
build. Each completed milestone summary is for orientation only — the
authoritative record of what was actually built is the code plus the
corresponding commit message.

## M0 — Repository foundation ✅

Monorepo (npm workspaces), Vite + vanilla JS client, Node + Express server,
docs scaffold (spec, mvp, architecture, tasks, setup, open-questions,
upgrade-knowledge), `.env.example`, `.gitignore`, `.nvmrc`. `npm install &&
npm run dev` brings up both servers.

## M1 — Static chat shell ✅

Chat UI with no AI behind it: header (app name + New Chat), message list
(user right / assistant left), composer (textarea + file picker + send,
Enter to submit + Shift+Enter for newline), empty-state landing with three
starter prompts, attachment chip, accessibility pass (`role="log"`,
`aria-live`, focus return). Mobile media query at ≤600px.

## M2 — Real `/chat` powered by Anthropic ✅

`POST /api/v1/ai-consultant/chat` streams NDJSON (`{type:"delta",text}` →
`{type:"done",stopReason,usage}` / `{type:"error",code,message}`). Defaults:
`claude-opus-4-7`, adaptive thinking, `max_tokens: 64000`, ephemeral prompt
caching on the system block. System prompt built by
[server/src/lib/prompt.js](../server/src/lib/prompt.js) inlines
[docs/upgrade-knowledge/concepts.md](upgrade-knowledge/concepts.md) +
[client-integration.md](upgrade-knowledge/client-integration.md). Uses
`client.messages.create({stream:true})` not the `messages.stream()` helper —
that helper's iterator interacts badly with Express's request lifecycle.

## M3 — File upload (images first, PDF later) ✅

`POST /api/v1/ai-consultant/uploads` via multer; disk storage at
`server/uploads/<id>.<ext>` (gitignored). Central MIME allowlist in
[server/src/lib/uploads.js](../server/src/lib/uploads.js): PNG/JPEG/WebP for
now, adding PDF later is one allowlist entry + a `document` block branch in
chat.js. 8MB cap (`MAX_UPLOAD_BYTES`). `/chat` accepts `attachments: [{id}]`
and inlines as base64 image content blocks. Client renders an
uploading→ready→error chip + inline thumbnails in past turns. Uploads dir
wiped on server boot to stay in sync with the in-memory registry.

## M4 — Simulation / preflight (via AI tool call) ✅

The recursive **tool-use loop** in [server/src/routes/chat.js](../server/src/routes/chat.js)
is the load-bearing architectural piece introduced here — it unlocks M5 too.
New NDJSON events: `tool_start`, `tool_progress`, `tool_end`. Empty thinking
blocks (Opus 4.7 `display: "omitted"` default) filtered before round-trip.
Tool registry at [server/src/lib/tools.js](../server/src/lib/tools.js); add a
tool = one file + one REGISTRY entry.

`run_simulation` tool in [server/src/lib/tools/run-simulation.js](../server/src/lib/tools/run-simulation.js)
orchestrates the documented UpGrade flow: save metrics → create experiment →
start → init/assign/mark/log per participant (20 concurrent, behind a
semaphore) → fetch enrollment + analyse → cleanup in `finally`. Cohort
default 200, range 10–1000. Server overrides app context to `"add"` at
simulation time (the only context the demo backend has). AI generates
synthetic value specs implicitly; never surfaces unless asked.

UpGrade client in [server/src/lib/upgrade.js](../server/src/lib/upgrade.js):
cached Google service-account bearer for management endpoints, `User-Id`
header only for `/v6/*`. `displayNameForMetric()` derives
`"completionRate (Percent = COMPLETED)"` from the structured query — AI never
parses display strings.

Debug logging in [server/src/lib/log.js](../server/src/lib/log.js), toggled by
`DEBUG_LOGGING` (defaults on in dev). Categories `[tool] [upgrade] [sim]
[chat] [warn]`. The `assignUser` silent-failure path is explicitly logged,
and each simulation prints an end-of-run summary line.

Client renders a tool-run widget above the assistant bubble with
in-place-updating cohort counter (via `replaceKey` on `tool_progress`).

## M5 — Report generation (AI tool + side-panel artifact) ✅

`generate_report` tool in [server/src/lib/tools/generate-report.js](../server/src/lib/tools/generate-report.js)
takes a structured payload (AI prose for dynamic sections + the
`run_simulation`-shaped experiment + optional simulation result + section
toggles) and emits an `artifact` NDJSON event. **No Anthropic call inside the
tool** — composition is deterministic, done in
[server/src/lib/report.js](../server/src/lib/report.js).

Four `.md` templates in
[server/src/lib/report-templates/](../server/src/lib/report-templates/)
(setup-guide, experiment-creation-guide, client-integration-guide,
notes-and-limitations) substitute `{{app_context}}`, `{{name}}`,
`{{description}}`, `{{decision_point_block}}`, `{{conditions_block}}`,
`{{metrics_block}}`, `{{site}}`, `{{target}}`, `{{conditions_branch_code}}`,
`{{metrics_log_block}}`. Placeholder filler text is grep-friendly so the user
can swap in real content later. Section numbering re-flows when sections are
omitted.

Client renders the artifact in a slide-in side panel
([client/index.html](../client/index.html) `<aside id="artifact-panel">`),
~50vw with 480px min on wide screens, full-width overlay on ≤900px. Copy /
download / close in the header. A 📄 chip inside the producing assistant
bubble reopens the panel; multiple reports per session each get their own
chip.

Assistant chat bubbles also render markdown via `marked` (was plaintext
until now). Two render-context tiers: chat bubbles use compact heading
hierarchy (h1=18 → h4=15) and tight list spacing; the artifact panel uses
full document hierarchy (h1=24 → h4=14). `breaks: true` (GitHub-flavored,
forgiving for single-newline content). `.msg__bubble--md` sets
`white-space: normal` so block layout — not source-HTML whitespace —
controls vertical rhythm.

System prompt updates: one yes/no-answerable question at a time (no
compound "rerun or move on?" prompts); enumerate all 12–13 sections
explicitly when confirming before report generation; UpGrade Setup Guide
and UpGrade Experiment Creation Guide are separate sections; the AI's
post-tool reply is one short sentence (the report lives in the panel, not
the chat). Design presentation uses markdown lists, not plain-text code
blocks ([concepts.md](upgrade-knowledge/concepts.md) updated accordingly).

---

## M6 — Demo polish (ChatGPT/Claude-style UI) ← next

Goal: presentable for the PELE 2026 workshop demo. Target visual language:
ChatGPT / Claude.ai web UI.

### Layout & conversation column

- [ ] **Full page width:** drop the 820px `#app` max-width — let the page use the full viewport. Constrain the conversation column separately for readability (next item).
- [ ] **Assistant turns without a bubble:** render assistant prose as flush body text aligned to the conversation column. User turns keep a subtle bubble for separation.
- [ ] **Conversation reading width:** cap the conversation column width so assistant prose doesn't run edge-to-edge on wide screens.

### Composer

- [ ] Redesign as a single rounded panel hugging the bottom of the viewport: textarea + attach icon (left) + send arrow icon (right), ChatGPT-style.
- [ ] Drop the current "Prototype build…" hint from the UI entirely — the AI already mentions the synthetic-data caveat after a simulation, and a standalone disclaimer banner adds noise without value.

### Typography & iconography

- [ ] **Typography pass:** pick a body font, lock the heading scale, tighten line-height for assistant prose.
- [ ] **Icons where text reads worse:** identify places to swap a text button for an icon (likely candidates: New Chat, Send, artifact panel Copy / Download / Close).

### Empty state / first-load

- [ ] Replace the current empty-state copy with a **fixed initial AI greeting** (see [spec.md](spec.md) §14) plus two starter prompt chips below it:
  - "I don't have an app yet"
  - "Walk me through with an example"

  Both are escape hatches for users who can't or don't want to describe their own app. The greeting needs to be included in the `messages` payload on the user's first send so the model doesn't re-introduce itself in its real response.

### Attachments

- [ ] **Lightbox thumbnails:** make inline thumbnails in past turns clickable. Click expands the image (toward original size) centered with a dimmed backdrop and an "X" close button in the top-right (Escape also closes), matching ChatGPT / Claude.
- [ ] **More upload formats:** extend [`ALLOWED_UPLOADS`](../server/src/lib/uploads.js) with PDF / txt / CSV (and any other Anthropic-supported formats useful for the consulting flow). Add a `document` content-block branch in [`toAnthropicMessage`](../server/src/routes/chat.js). PDFs are the highest-value addition; skip any individual format that turns out fiddly to wire up. Refs: <https://platform.claude.com/docs/en/build-with-claude/files>, <https://platform.claude.com/docs/en/build-with-claude/pdf-support>.

### Polish (nice-to-haves)

- [ ] **Artifact panel keyboard support** — Escape closes the panel; focus management on open/close.
- [ ] **Smarter auto-scroll** — don't fight the user when they've scrolled up mid-stream.
- [ ] Other ChatGPT/Claude-style refinements surfaced during implementation.

A Stop button while streaming was considered and dropped — aborting cleanly mid-tool-call (e.g. while `run_simulation` is mid-flight against UpGrade) isn't worth the reliability risk for a demo. The Send button already disables while a request is in flight, which is enough.

### Housekeeping

- [ ] Remove [`server/.env.example`](../server/.env.example) — verified as a documentation mirror of the root `.env.example`; nothing loads from it.

## M7 — Deployment (clarification needed)

Goal: the prototype is reachable at `/ai-consultant` on the existing demo host.

- [ ] Build script outputs static assets ready to be served at `/ai-consultant`
- [ ] Server process management on the demo host (pm2 / systemd — TBD)
- [ ] Reverse proxy config sketch for routing `/ai-consultant` → static build, `/api/v1/ai-consultant/*` → Express
- [ ] Smoke test the deployed URL

## M8 — Paper (clarification needed)

Goal: the 4-page PELE 2026 WIP/Demo paper. (Not a code milestone, but tracked so it stays visible.)

- [ ] Outline aligned with [spec.md](spec.md) §39
- [ ] First draft
- [ ] Internal review
- [ ] Submit

## M9 — Workshop demo prep

Goal: ready to present the demo at the PELE 2026 workshop. Address closer to the workshop date.

- [ ] Demo script + walkthrough notes in [docs/setup.md](setup.md)'s "Demo walkthrough" section — sample inputs, the path through the six phases, and what to highlight for the audience.

## Deferred (post-MVP) (clarification needed)

- Persistent project history
- Related-paper retrieval (needs a curated source first)
- Variant content generation
- Client code generation
- Repo / PR integration
- Multi-decision-point and factorial experiments
- Authentication — add to the existing UpGrade demo app, not this codebase, if needed at all
