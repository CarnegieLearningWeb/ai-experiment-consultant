# Tasks — milestone checklist

The MVP build is complete. The summaries below are orientation only — the
authoritative record of what was actually built is the code plus the
corresponding commit messages.

## Completed milestones

- **M0 — Repository foundation.** Monorepo (npm workspaces), Vite + vanilla JS
  client, Node + Express server (ESM), docs scaffold, `.env.example`,
  `.gitignore`, `.nvmrc`. `npm install && npm run dev` brings up both servers.
- **M1 — Static chat shell.** Chat UI with no AI behind it: header, message list
  (user right / assistant left), composer (Enter submits, Shift+Enter newline),
  empty-state landing with starter prompts, attachment chip, accessibility pass,
  mobile breakpoint.
- **M2 — Real `/chat` via Anthropic.** `POST /api/v1/ai-consultant/chat` streams
  NDJSON (`delta` → `done` / `error`). System prompt assembled by
  [prompt.js](../server/src/lib/prompt.js); uses
  `client.messages.create({stream:true})`, adaptive thinking, and ephemeral
  prompt caching on the system block.
- **M3 — File upload.** `POST /api/v1/ai-consultant/uploads` via multer; disk
  storage (gitignored); central MIME allowlist in
  [uploads.js](../server/src/lib/uploads.js); 8MB cap; `/chat` inlines images as
  base64 blocks; client renders an uploading→ready→error chip + thumbnails.
- **M4 — Simulation / preflight (AI tool call).** Recursive tool-use loop in
  [chat.js](../server/src/routes/chat.js) (`tool_start` / `tool_progress` /
  `tool_end` events); `run_simulation` tool orchestrates the UpGrade flow against
  the demo backend; tool registry in [tools.js](../server/src/lib/tools.js);
  UpGrade client + cached service-account bearer in
  [upgrade.js](../server/src/lib/upgrade.js); debug logging in
  [log.js](../server/src/lib/log.js).
- **M5 — Report generation (AI tool + side-panel artifact).** `generate_report`
  tool emits an `artifact` event; deterministic composition in
  [report.js](../server/src/lib/report.js) from `.md` templates in
  [report-templates/](../server/src/lib/report-templates/); client renders a
  slide-in artifact panel (copy / download / close, per-report chips); assistant
  bubbles render markdown via `marked`.
- **M6 — Demo polish (ChatGPT/Claude-style UI).** Full-width layout with a
  constrained conversation reading column, bubble-less assistant turns, a single
  rounded composer, typography/icon pass, a fixed initial greeting + starter
  chips, image lightbox, and additional upload formats.
- **M10 — Related Research Grounding (optional).** Semantic Scholar client
  ([papers.js](../server/src/lib/papers.js)) + `search_papers` tool
  ([search-papers.js](../server/src/lib/tools/search-papers.js)); optional
  post-hypothesis step that pulls up to three related papers; `generate_report`
  gained an optional `relatedResearch.papers[]`; degrades gracefully and never
  blocks the planning flow.
- **M11 — Prompt knowledge moved server-side; trimmed to consulting-only.** The
  consultant's UpGrade knowledge now lives in
  [prompt-knowledge/upgrade-concepts.md](../server/src/lib/prompt-knowledge/upgrade-concepts.md),
  loaded by [prompt.js](../server/src/lib/prompt.js) — relocated out of `docs/`
  (now dev-reference only), trimmed of dev cruft (TODO markers, changelog notes,
  internal spec refs), with client-integration dropped from the prompt entirely
  (it's fixed report-template content per [spec.md](spec.md) §29–30). The
  obsolete `upgrade-auth.js` reference file was removed (its OAuth pattern is
  live in [upgrade.js](../server/src/lib/upgrade.js)), and the remaining
  UpGrade demo-backend API reference now lives at
  [docs/simulation-api.md](simulation-api.md).
