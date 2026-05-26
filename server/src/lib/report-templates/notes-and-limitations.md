> **PLACEHOLDER:** Replace or augment with whatever your team needs to communicate alongside experiment plans (legal, IRB, privacy, internal review process). The defaults below are intentionally conservative.

- **This plan was AI-assisted.** Have a human researcher and a developer review it before acting on it. The AI consultant proposes designs but does not verify them.
- **Simulation results, if included, are synthetic.** They are a preflight demonstration of how UpGrade collects and reports data — they do not predict real learning outcomes. Do not cite simulation numbers as evidence.
- **MVP scope.** This prototype supports a narrow slice of UpGrade experiment shapes: between-subject, individual-level assignment, one decision point, two or three conditions, one to three simple metrics. Designs outside that shape require manual configuration directly in UpGrade.
- **No real-world execution.** This report is a planning artifact. It does not configure UpGrade, modify your application, deploy code, or start an experiment.
- **Confirm dynamic identifiers against your real data.** Site names, target names, condition codes, metric keys, and `allowedValues` should match how your application actually instruments the decision point — verify before saving the experiment.
