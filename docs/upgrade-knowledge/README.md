# UpGrade knowledge base (MVP-narrow)

This folder holds curated UpGrade context that the AI consultant pulls into
its prompt. The content here is intentionally **narrow**: it should cover only
the small slice of UpGrade behavior the MVP supports, plus what the consultant
must explicitly steer users **away** from.

The narrowness is a feature, not a gap. A small, curated knowledge base keeps
the consultant on the supported path and prevents it from confidently
proposing experiment designs we can't actually run in the MVP.

## Files

- [concepts.md](concepts.md) — terminology and supported MVP experiment shape.
- [client-integration.md](client-integration.md) — what client-side integration looks like for a simple decision-point flow.
- [simulation-api.md](simulation-api.md) — API surface the simulation feature relies on. **Mostly TODO** — verify against the real demo backend before relying on any field.
- [upgrade-auth.js](upgrade-auth.js) — **reference code** copied from the existing UpGrade demo proxy. Shows the auth pattern: a Google service account key (`UPGRADE_SERVICE_ACCOUNT_KEY_PATH`) is exchanged for an OAuth access token via `google-auth-library`, cached, and attached to outbound UpGrade requests as a bearer token. We will likely adopt this pattern in M4. The matching service-account JSON sits at the repo root (`upgrade-service-account-key.json`) and is git-ignored.

## Authoritative sources

When in doubt, the real UpGrade documentation is the source of truth, not this folder:

- Official docs: https://upgrade-platform.gitbook.io/upgrade-documentation
- Demo backend: `https://upgrade-demo.carnegielearning.com/api` (paths under `/v6/...`)

## How this folder is used

- The Express server reads the `.md` files in this folder at startup and bakes
  them into the system prompt for `/chat`. (Implementation lands in M2.) The
  `.js` reference file is **not** loaded into the prompt — it's example code
  for human and Claude reading.
- Updates here change AI behavior the next time the server restarts. There is
  no live-reload mechanism in v1.

## Do not lift advanced UpGrade features into this folder

If the consultant should *recognize* an unsupported feature (factorial designs,
within-subject designs, group assignment, payloads, exclude-if-reached,
repeatable metrics, multi-decision-point experiments), describe it briefly in
[concepts.md](concepts.md) under "Not supported in MVP" so the consultant can
explain the limitation. Do not include enough detail to actually configure
those features — that invites the consultant to use them.
