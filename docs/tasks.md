## Now

## Backlog

## Done

- [x] **M0 — Repository foundation.** npm-workspaces monorepo, Vite + vanilla JS client, Node + Express server (ESM), docs scaffold.
- [x] **M1 — Static chat shell.** Chat UI with no AI: message list, composer (Enter / Shift+Enter), empty-state landing, accessibility pass.
- [x] **M2 — Real `/chat` via Anthropic.** NDJSON streaming, system prompt assembly, ephemeral prompt caching.
- [x] **M3 — File upload.** multer + disk store, central MIME allowlist, base64 image blocks, client upload chips + thumbnails.
- [x] **M4 — Simulation / preflight.** `run_simulation` AI tool over the recursive tool-use loop; orchestrates the UpGrade demo-backend flow.
- [x] **M5 — Report generation.** `generate_report` AI tool + deterministic template composition; slide-in artifact panel with copy/download.
- [x] **M6 — Demo polish (ChatGPT/Claude-style UI).** Full-width layout with a constrained reading column, redesigned composer, typography pass, fixed greeting + starter chips, image lightbox.
- [x] **M10 — Related Research Grounding (optional).** Semantic Scholar `search_papers` tool; optional post-hypothesis step that pulls up to three related papers; degrades gracefully.
- [x] **M11 — Prompt knowledge moved server-side.** Curated UpGrade knowledge relocated to `server/src/lib/prompt-knowledge/upgrade-concepts.md` and trimmed to consulting-only; client-integration dropped from the prompt; `docs/upgrade-knowledge/` removed.
- [x] **Cleanup.** External links open in a new tab; removed dead simulation/report REST stubs and the empty `client/public` dir.
- [x] **Stop generation.** Send button becomes a Stop button while a response/tool streams; aborts the stream and backend cleanly and recovers the UI; Enter is inert mid-response.
- [x] **Login page redesign.** Sign-in page rebuilt as a product-landing split card (blue→purple value-prop + Google sign-in) on lavender that explains the tool before sign-in; Google login flow and templating preserved.
- [x] **Chat UI redesign (cohesion with login).** Restyled the post-login chat to match the login page — light lavender + blue→purple brand, gradient brand mark/send button, light report panel, no dark mode, centered welcome state that collapses into normal chat. Visual/CSS-only; behavior preserved.
