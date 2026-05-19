# Simulation API surface (mostly TODO)

The simulation feature (M4) calls the demo UpGrade backend to create a
temporary experiment, simulate synthetic participant visits, log metric values,
fetch results, and tear the experiment down. This file is the working notes
for that API surface.

**Most of this is unconfirmed.** Treat every section labeled "TODO(upgrade)"
as something that must be verified against the real UpGrade documentation or
the demo backend before code depends on it.

Authoritative source: https://upgrade-platform.gitbook.io/upgrade-documentation
Demo backend base: `https://upgrade-demo.carnegielearning.com/api`

## High-level flow (from spec §22)

1. Create a temporary experiment matching the approved design.
2. Start the experiment.
3. For each synthetic participant:
   - `init` the participant.
   - `assign` to a condition at the decision point.
   - `mark` the decision point.
   - `log` synthetic metric values for that condition.
4. Retrieve enrollment and metric result data.
5. Delete the temporary experiment.

## Endpoints we expect to use

These are based on `spec.md` §22. **All paths and shapes need verification.**

### `POST /v6/init`

Initialize a participant in UpGrade.

- TODO(upgrade): Confirm request body shape (likely includes `userId` and `context`).
- TODO(upgrade): Confirm response shape.

### `POST /v6/assign`

Get a condition assignment for a participant at a decision point.

- TODO(upgrade): Confirm request body shape (likely includes `userId`, `context`, `site`, `target`).
- TODO(upgrade): Confirm response shape — what field carries the condition name?

### `POST /v6/mark`

Mark that a participant reached a decision point.

- TODO(upgrade): Confirm request body shape and required fields.

### `POST /v6/log`

Log metric values for a participant.

- TODO(upgrade): Confirm request body shape (metric key, value, value type — string enum vs numeric).
- TODO(upgrade): Confirm whether metrics need to be pre-declared on the experiment.

### Experiment lifecycle (create / start / delete)

- TODO(upgrade): Find the endpoints to create a new experiment programmatically. Spec §22 lists this as a required capability but it isn't yet documented in our notes.
- TODO(upgrade): Find the endpoint to transition an experiment to `Running`.
- TODO(upgrade): Find the endpoint to delete a temporary experiment.
- Auth: a Google service-account key (path in `UPGRADE_SERVICE_ACCOUNT_KEY_PATH`) is exchanged for an OAuth access token and sent as a bearer token. See [upgrade-auth.js](upgrade-auth.js) for the working reference pattern from the existing UpGrade demo proxy. TODO(upgrade) M4: verify *which* `/v6/*` endpoints actually require the token vs. which are open.

### Result retrieval

- TODO(upgrade): Confirm the endpoint(s) for retrieving enrollment counts and metric statistics per condition.
- TODO(upgrade): Confirm whether result data is available immediately after metric logging or whether there is a lag.

## App context

- TODO(upgrade): Decide on a stable app context name reserved for this tool's simulations so we don't collide with other demo users.

## Cleanup safety

The simulation must clean up its temporary experiment even when something
fails mid-run. Design constraints (to be implemented in M4):

- Wrap the create → simulate → fetch sequence in a try/finally so the delete
  call always runs.
- Tag temporary experiments with a recognizable prefix (e.g. `aiconsult-sim-`)
  so manual cleanup is possible if a delete call fails.
- TODO(upgrade): Decide what happens if delete itself fails — log + surface to the user vs. silent retry.

## Non-goals

- The simulation does not retry indefinitely on transient failures. One retry, then surface the error.
- The simulation does not concurrently run multiple experiments per session.
- The simulation does not preserve results across browser reloads.
