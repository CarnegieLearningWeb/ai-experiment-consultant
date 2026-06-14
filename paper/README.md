# Paper — AI Experiment Consultant (PELE 2026)

Overleaf source and camera-ready revision notes for the workshop paper
**"AI-Assisted Experimentation Consulting for Educational Platform Adoption"**
(ACM `acmart` format, `ACM-Reference-Format` bibliography).

## Files

* `main.tex` — the paper source.
* `references.bib` — bibliography, referenced from `main.tex` as `\bibliography{references}`.
* `reviews.md` — PELE reviewer comments and revision guidance for the camera-ready version.
* `README.md` — notes about this folder and the paper workflow.

The LaTeX source files are intentionally kept flat so `main.tex` and
`references.bib` can be copied back into the Overleaf project root as-is. Keep
those filenames stable — `main.tex` resolves `references.bib` by name from the
same directory, so renaming either requires a matching edit.

`reviews.md` and `README.md` are repository-side support files. They are useful
for AI-assisted revision and project tracking, but they do not need to be copied
into Overleaf.

This is a project artifact, not app runtime code. It is intentionally a sibling
of `client/` and `server/` so it stays out of the npm-workspace build graph.

## Compiling

The expected workflow is to compile in Overleaf. Local compilation is optional
and not required.

LaTeX auxiliary files (`.aux`, `.bbl`, `.log`, `.out`, etc.) are git-ignored only
to avoid accidentally committing local build artifacts. The final camera-ready
PDF is **not** ignored and may be added to `paper/` later (see below).

## Final PDF (later)

Once the camera-ready version is finalized, add the compiled PDF here (e.g.
`main.pdf`). The login page's "Paper" link is the intended home for it: see the
`TODO(paper):` marker in [`server/src/views/login.html`](../server/src/views/login.html).
Wiring it up is a small follow-up — serve this PDF under the app's `/ai-consultant`
base (a static route or an asset copy) and point that link at it.
