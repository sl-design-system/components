# AGENTS.md

Instructions for AI agents working in this repository. Read by Claude Code and by any tool
following the AGENTS.md convention; GitHub Copilot additionally reads
[`.github/copilot-instructions.md`](.github/copilot-instructions.md), which covers the repository
layout, coding conventions and build commands.

## Knowledge base — read this before planning anything

**[`context/`](context/README.md) is the knowledge base.** Analyses, plans, tasks and use cases for
work in progress live there in a validated format, so the reasoning behind a decision is in the
repository rather than in someone's chat history.

Before proposing a plan, changing an approach, or starting work that already has documentation:

1. Read [`context/README.md`](context/README.md) — it is the entry point and says what to read next.
2. Check [`context/plan/roadmap.md`](context/plan/roadmap.md) for what is already sequenced.
3. If the work has a task in `context/work/`, follow it rather than re-deriving the approach.

Do not author documents there by hand. Use the **`sl-aipdlc` skills** — `/sl-analysis`, `/sl-plan`,
`/sl-tasks`, `/sl-use-case`, `/sl-adr`, `/sl-implement`, `/sl-claim` — which know the contract, the
required sections, and the gates. Validate before committing:

```bash
TOOLKIT="git+ssh://git@bitbucket.org/sl-technology/sl-aipdlc-toolkit.git"
uvx --from "$TOOLKIT" sl-aipdlc validate context
uvx --from "$TOOLKIT" sl-aipdlc check-language context
```

Documents there are **English only**, regardless of the language of the conversation that produced
them. A validator enforces it.

## Design-to-code tooling

- `tools/implement-design-plugin/` — the Figma-to-code pipeline. Installable as a plugin in Claude
  Code, Copilot CLI and VS Code. **This is the one that gets developed.**
- `scripts/connect-figma-components/` — Figma Code Connect mappings plus snippet validation, run in
  CI on every pull request. A mapping is what lets the pipeline resolve a Figma node to an `sl-*`
  component instead of guessing.
- `reference/prior-art-ds-skills/` — **reference only, never used or extended.** A frozen snapshot of
  two earlier attempts, kept as evidence for comparison. Nothing imports or executes it. If a
  question is "how was this done before", the answer is here; if it is "what should we build", the
  answer is in `context/`.

## Two working rules that apply to changes in this area

**Measure before improving.** A change to the generation pipeline that cannot be shown to move a
measured score is not known to be an improvement. See
[`A-NOJIRA-figma-to-code`](context/analyzes/NOJIRA-figma-to-code/analysis.md).

**One requirement, one test case, one measured delta.** Do not bundle several rules into one change
or one prompt — the outcome becomes unattributable. A requirement with nothing exercising it is a
hypothesis, not a requirement.

## Use the cheapest model that does the job

Route work by what it actually needs: a cheap tier at low effort for mechanical, deterministic steps,
and the expensive tiers only where judgement is genuinely required. Prefer moving a check out of a
prompt and into a script entirely — that removes run-to-run variance permanently and costs no tokens
at all.

Treat a tier choice as a claim to be tested, not a preference: record what a run cost, downgrade, and
compare the cost delta against the score delta. A change that leaves quality inside its measured
spread while reducing cost is an improvement.
