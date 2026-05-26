# Open questions

Decisions that aren't blocking foundation work but will need answers before
the relevant milestone. Items resolved by completed milestones (M0–M5) have
been moved out of this file — see the corresponding commit messages and
[tasks.md](tasks.md) for the answers.

## Product / UX

- **Related-paper lookup.** Spec calls for a curated paper-search MCP/source rather than open web search. No source identified yet. Probably deferred past MVP unless someone surfaces a usable option.
- **Structured state.** Currently implicit — the AI rebuilds the experiment shape on demand from conversation history when it calls `run_simulation` or `generate_report`. Working fine for MVP. A dedicated `record_field` tool could improve consistency in long conversations; revisit if extraction starts looking unreliable.

## Deployment (M7)

- **Process manager on the demo host.** pm2, systemd, or Docker? Find out what the existing demo app uses and match it.
- **Where does the build run?** On the host or in CI? No CI yet, so provisionally: on the host.
- **TLS / domain.** Inherits from the existing demo deployment. Confirm before M7.

## Authentication (deferred)

The user has explicitly excluded auth from this prototype. If any access control is needed, it will be added to the surrounding existing UpGrade demo Express app rather than to this codebase. Revisit only if asked.
