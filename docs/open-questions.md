# Open questions

Decisions that aren't blocking foundation work but will need answers before the
relevant milestone. Update as we get clarity. Closed items move out of this file.

## UpGrade integration (blocks M4)

- **Create / start / delete temporary experiment.** `spec.md` §22 lists these as needed for simulation, but the endpoints aren't documented in our notes. Need to verify against the demo backend before writing simulation code.
  - Source to confirm against: https://upgrade-platform.gitbook.io/upgrade-documentation
  - Demo backend base: `https://upgrade-demo.carnegielearning.com/api`
- ~~**Auth / API key.** Does the demo UpGrade backend require credentials for the create/start/delete endpoints?~~ Resolved: yes, via a Google service-account access token. Pattern is in [docs/upgrade-knowledge/upgrade-auth.js](upgrade-knowledge/upgrade-auth.js), key at `upgrade-service-account-key.json` (git-ignored), path env var `UPGRADE_SERVICE_ACCOUNT_KEY_PATH`. Still to confirm in M4: *which* `/v6/*` endpoints actually require the token.
- **Cleanup safety.** What happens if simulation fails after creating an experiment but before deleting it? Need an idempotent cleanup strategy.
- **`/v6/init`, `/v6/assign`, `/v6/mark`, `/v6/log` payload shapes.** Confirm exact request/response schemas; do not invent.
- **App context / context name** for the simulation. Pick a stable identifier reserved for this tool so we don't collide with other demo users.

## Simulation behavior (M4)

- **Default cohort size.** Spec lists 100 / 200 / 500 / 1000. Smaller is faster and more demo-friendly; larger gives more stable splits. Provisional default: **200**. Revisit after we see how it behaves.
- **How synthetic metric values are generated.** Distribution per condition? Should the variant always look "better" in synthetic data to make the demo land, or should it be honest noise? Provisional plan: light noise around realistic baselines, with a clear "this is synthetic" label, but document the choice once decided.
- **Run simulation server-side or client-side?** Provisional plan: server-side. The server already needs `UPGRADE_API_URL` and can stream progress back to the client.

## AI behavior (M2)

- **Streaming or full responses?** Streaming improves perceived latency. Vanilla JS + SSE is workable. Provisional: ship M2 with full responses, add streaming in M2.5 if it feels slow.
- **Related-paper lookup.** Spec calls for a curated paper-search MCP/source rather than open web search. No source identified yet. Probably deferred past MVP unless someone surfaces a usable option.
- **Where structured state lives.** Provisional plan: derived on each turn from the conversation by the model (returned in a structured tool call). Reconsider if extraction is unreliable.
- **Prompt cache strategy.** System prompt + `upgrade-knowledge` content is stable per session — cache it. Conversation history is appended per turn — don't.

## Product / UX

- **Are the six phases visually surfaced?** Provisional: no. Keep them implicit in chat per spec §11.2 and §13. Revisit after early user testing.
- **Inline image rendering in chat?** Provisional: yes, thumbnails, click-to-expand.
- **Empty state.** What does the chat show before the first user message? Probably the consultant's opening question from spec §14, plus a couple of "try asking..." prompts. Decide in M6.

## Deployment (M7)

- **Process manager on the demo host.** pm2, systemd, or Docker? Need to find out what the existing demo app uses and match it.
- **Where does the build run?** On the host or in CI? No CI yet, so provisionally: on the host.
- **TLS / domain.** Inherits from the existing demo deployment. Confirm before M7.

## Authentication (deferred)

- **Is auth needed at all for the workshop demo?** The user has explicitly excluded auth from this prototype. The current assumption is that if any access control is needed, it will be added to the surrounding existing UpGrade demo Express app rather than to this codebase. Revisit only if asked.
