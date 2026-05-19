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

## M1 — Static chat shell

Goal: a usable chat UI with no AI behind it. Echoes user messages locally; backend `/chat` is still a 501 stub.

- [ ] Header (app name, "New Chat" button)
- [ ] Message list (user right-aligned, assistant left-aligned)
- [ ] Composer: textarea + file picker + send. Enter submits, Shift+Enter for newline.
- [ ] Frontend state: messages array, pending-upload list
- [ ] "New Chat" clears state
- [ ] Pass an accessibility sniff: focus management on send, aria-live on message list
- [ ] Tiny CSS pass; readable on desktop, doesn't crash on mobile

## M2 — Real `/chat` powered by Anthropic

Goal: the consultant actually responds. Six-phase awareness lives in the system prompt.

- [ ] Add `@anthropic-ai/sdk` to `server/`
- [ ] System prompt in `server/src/lib/prompt.js` that:
  - establishes the consultant role
  - encodes the six-phase flow
  - encodes the supported-experiment-shape constraints from `docs/upgrade-knowledge/`
  - explicitly forbids unsupported experiment types in MVP
- [ ] `POST /api/v1/ai-consultant/chat`:
  - accepts `{ messages: [...], attachments?: [...] }`
  - returns `{ message: { role: 'assistant', content: '...' } }`
- [ ] Wire UI to the real endpoint; remove echo behavior
- [ ] Add a basic "thinking" indicator on the assistant slot
- [ ] Decide on streaming (SSE) vs full response — implement whichever feels acceptable in the demo
- [ ] Include prompt caching for the system prompt + upgrade-knowledge context (it doesn't change per turn)

## M3 — File upload (images)

Goal: user can attach a screenshot to a chat turn.

- [ ] `POST /api/v1/ai-consultant/uploads` accepting `multipart/form-data` (multer); returns `{ id, mimeType, size }`
- [ ] Server stores files under `server/uploads/<id>` (gitignored)
- [ ] Frontend file-picker → upload → attach reference to next message
- [ ] `/chat` accepts attachment references and includes the image in the Anthropic request as a content block
- [ ] Strict file-type allowlist (start with `image/png`, `image/jpeg`, `image/webp`)
- [ ] Size cap (e.g. 8 MB)
- [ ] Inline thumbnails in the chat UI

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
- [ ] Frontend renders the report in a markdown view (add `marked` or similar)
- [ ] Copy-to-clipboard button
- [ ] Confirmation step: AI lists included sections and asks whether the user wants to exclude anything before generation

## M6 — Demo polish

Goal: presentable for the PELE 2026 workshop demo.

- [ ] Visual polish pass on the chat UI
- [ ] First-load empty state with example prompts ("Tell me about your learning app", "Help me design an experiment for...")
- [ ] Persistent banner that this is a planning prototype, not a live experiment runner
- [ ] Demo script + walkthrough notes in `docs/setup.md`

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
