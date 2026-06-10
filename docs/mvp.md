# MVP — buildable v1 scope

This is the dev-focused companion to [spec.md](spec.md). `spec.md` describes
the product vision; this file describes the **slice we are actually building**
for the PELE 2026 prototype and the demo presentation.

## Single-sentence goal

A web app where a user chats with an AI consultant, walks through six
consulting phases, optionally runs a synthetic UpGrade simulation, and copies
a final markdown experiment-plan report.

## In scope for v1

- Single-page chat UI (Vite + vanilla JS).
- One backend `/chat` endpoint that calls the Anthropic API with conversation
  history and curated UpGrade context.
- File uploads (images at minimum) attached to chat turns.
- Six-phase consulting flow, kept implicit in the chat rather than rendered as
  explicit steppers.
- Simple structured state extracted from the conversation (app description,
  page/problem, hypothesis, experiment design, simulation result, report).
- Simulation/preflight against the existing UpGrade demo backend at
  `https://upgrade-demo.carnegielearning.com/api` using its `/v6/...` endpoints.
- Markdown report generation with a copy button.
- All backend routes mounted at `/api/v1/ai-consultant/*` so the app can sit
  behind the `/ai-consultant` sub-path on the existing demo host.

## Out of scope for v1

- **Authentication.** Open local/demo access. May be added later directly in
  the existing UpGrade demo Express app.
- Persistent database. In-memory session state only; reload starts fresh.
- Saved chat history or projects across sessions.
- Production UpGrade integration (real experiments on real users).
- Repo analysis, PR generation, or any automatic code modification.
- Open-web search. Related-paper lookup is deferred to post-MVP unless a
  curated source becomes available.
- Complex UpGrade experiment types — see "Supported experiment shape" below.

## Supported experiment shape (the AI consultant must stay inside this box)

- Between-subject, individual-level assignment.
- One decision point.
- Two conditions (`control` and a single variant) with simple weights (default 50/50).
- `Include All` participants.
- A small number of simple metrics (e.g. one binary completion metric + one mean numeric metric).

If the user asks for factorial designs, within-subject designs, group assignment,
payloads, exclude-if-reached, repeatable metrics, or multi-decision-point
experiments, the consultant should explain the MVP limitation and propose a
supported alternative. This constraint is also encoded in the consultant's
prompt knowledge ([server/src/lib/prompt-knowledge/upgrade-concepts.md](../server/src/lib/prompt-knowledge/upgrade-concepts.md))
so the prompt context reflects it.

## Phases (internal state, not user-facing UI)

1. Learning app description
2. Page / problem description
3. Experiment ideation and hypothesis refinement
4. UpGrade experiment planning
5. Simulation / preflight
6. Report generation

The UI does not render these as explicit steps. They exist as fields the
backend tracks so the consultant can recognize where it is in the flow and
generate the right kind of next message.

## Primary API surface

All under `/api/v1/ai-consultant`:

| Endpoint | Method | Purpose |
|---|---|---|
| `/health` | GET | Liveness probe |
| `/chat` | POST | Append a user turn and stream/return the assistant response |
| `/uploads` | POST | Accept image (and later file) uploads, return a reference id |
| `/simulation` | POST | Run a synthetic UpGrade experiment against the demo backend |
| `/report` | POST | Generate the final markdown report from collected state |

Exact request/response shapes are defined in [architecture.md](architecture.md).

## Acceptance for "MVP complete"

- A user can open the app, type a learning-app description, and get a
  reasonable consulting response.
- The user can iterate through the six phases entirely in chat.
- The user can run a synthetic simulation and see condition assignment +
  metric summaries grounded in the demo UpGrade backend (or, if the demo
  backend isn't available, a clearly labeled placeholder result that explains
  the gap).
- The user can ask for the final report and receive a copyable markdown document
  that includes all dynamic sections plus the fixed template sections (setup
  guide, client integration guide).
- The report explicitly labels simulated data as synthetic / preflight only.

## What this prototype is intentionally *not* trying to prove

- It is not trying to demonstrate that an educational intervention works.
- It is not trying to autonomously launch real experiments.
- It is not trying to be a general-purpose research assistant.

It is trying to demonstrate that an AI consultant can reduce the
onboarding burden of adopting UpGrade by turning vague experiment ideas
into structured, human-reviewable plans.
