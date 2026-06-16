# Paper — AI Experiment Consultant (PELE 2026)

Overleaf source and the compiled PDF for the workshop paper
**"AI-Assisted Experimentation Consulting for Educational Platform Adoption"**
(ACM `acmart` format, `ACM-Reference-Format` bibliography).

## Files

* `main.tex` — the paper source.
* `references.bib` — bibliography, referenced from `main.tex` as `\bibliography{references}`.
* `ai-experiment-consultant-pele-2026.pdf` — the finalized compiled paper.
* `ai-experiment-consultant-pele-2026.md` — the finalized paper in markdown.
* `README.md` — notes about this folder and the paper workflow.

The LaTeX source files are intentionally kept flat so `main.tex` and
`references.bib` can be copied back into the Overleaf project root as-is. Keep
those filenames stable — `main.tex` resolves `references.bib` by name from the
same directory, so renaming either requires a matching edit.

`README.md` is a repository-side support file. It is useful for project
tracking but does not need to be copied into Overleaf.

This is a project artifact, not app runtime code. It is intentionally a sibling
of `client/` and `server/` so it stays out of the npm-workspace build graph.

## Compiling

The expected workflow is to compile in Overleaf. Local compilation is optional
and not required.

LaTeX auxiliary files (`.aux`, `.bbl`, `.log`, `.out`, etc.) are git-ignored only
to avoid accidentally committing local build artifacts. The compiled PDF is
**not** ignored.

## Hosted PDF

`ai-experiment-consultant-pele-2026.pdf` is the finalized compiled paper. The
app serves it inline under the `/ai-consultant` base at
`/ai-consultant/paper/ai-experiment-consultant-pele-2026.pdf`
([`server/src/routes/index.js`](../server/src/routes/index.js)), and the login
page's "Paper" link opens it in a new tab
([`server/src/views/login.html`](../server/src/views/login.html)). To update the
hosted paper, re-export from Overleaf and replace this file, keeping the
filename stable since the route and the link reference it by name.
