# context/ — the knowledge base for this repository

Everything being decided, planned and worked on around the Figma-to-code effort lives here, in one
format, so a person joining can read it in order instead of assembling it from conversations.

This is an **sl-aipdlc knowledge context** in embedded mode (marker: `.sl-aipdlc.yaml`). The rules
are in [CONVENTIONS.md](CONVENTIONS.md), the document contract in [SCHEMA.md](SCHEMA.md), and the
templates in [`_templates/`](_templates/). Documents are **English only**, even though the team
speaks Polish — a validator enforces it.

## Start here

| If you want to know… | Read |
|---|---|
| Why any of this exists, and what is actually wrong today | [`A-NOJIRA-figma-to-code`](analyzes/NOJIRA-figma-to-code/analysis.md) |
| What is being built first, and what is deliberately not | [`P-NOJIRA-figma-to-code`](plan/NOJIRA-figma-to-code/plan.md) |
| The whole sequence, both tracks, at a glance | [`plan/roadmap.md`](plan/roadmap.md) |
| What a designer hands over, what it costs, how the flow gets tested | [`A-NOJIRA-designer-workflow`](analyzes/NOJIRA-designer-workflow/analysis.md) |
| Where the pipeline architecture is heading, and why | [`A-NOJIRA-pipeline-staging`](analyzes/NOJIRA-pipeline-staging/analysis.md) |
| How the handover package is laid out, written safely, and verified | [`ARCH-handover-package`](architecture/NOJIRA-figma-to-code/handover-package.md) |
| What to do with a node the design system does not resolve | [`A-NOJIRA-ds-conformance`](analyzes/NOJIRA-ds-conformance/analysis.md) |
| What happened to the 31 inherited requirements | [`A-NOJIRA-requirement-backlog`](analyzes/NOJIRA-requirement-backlog/analysis.md) → [`P-NOJIRA-requirement-triage`](plan/NOJIRA-requirement-triage/plan.md) |
| What was tried before and what it cost | [`foundation/prior-art-ds-skills.md`](foundation/prior-art-ds-skills.md) → `reference/prior-art-ds-skills/` |

## The two tracks

**Track 1 — measurement.** Nothing about the generation pipeline can be improved until a change to
it can be shown to help. Slice 1 builds `tools/sl-bench`: coverage, two fidelity dimensions, run-to-run
variance, per-run cost, and comparison across configurations and over time, against a frozen Figma
corpus — **without modifying the pipeline at all**. Approved and decomposed into fourteen tasks.

**Track 1b — requirement triage.** Runs alongside slice 1 and needs no baseline. The 31
requirements inherited from the previous attempt are roughly a third shorter than they look: nine
are already satisfied here, two belong to other backlogs, five are measurements rather than
features, and four contradict the pipeline's autonomy design and need a decision rather than an
implementation. This track confirms that and publishes the real, ordered list.

**Track 2 — the designer handover contract.** Which of the three existing directions a piece of work
should use, what each costs, and how the working model is tested as distinct from the generated code.
Analysis only, **no plan by design** — three of its four questions await figures that do not exist
yet.

## The rule the whole thing is built around

One requirement, one test case, one measured delta. A requirement with no corpus case exercising it
is a hypothesis and does not enter a prompt or a script. A change that does not move the score by
more than the measured spread is not an improvement. Thresholds ratchet upward only.

This exists because the previous attempt implemented 31 requirements together and could not attribute
any outcome to any of them. That evidence is in `reference/prior-art-ds-skills/`.

## Layout

```
analyzes/     research — A-<key>, what we know and how we know it
plan/         plans — P-<key> + roadmap.md; `phase` is the gate on creating tasks
work/         tasks — T-<key>-NN, one PR's worth each
tests/        use cases — UC-<key>-NN, each verifying one task
architecture/ design docs and ADRs (ADRs are gated on an approved analysis)
foundation/   pointers to material owned elsewhere
product/      product specs
prototypes/   prototype records; also the folder a design canvas is pointed at
board/        claims — who is working on which unit
```

Items with no Jira ticket use a `NOJIRA-<slug>` key; this initiative uses `NOJIRA-figma-to-code` and
`NOJIRA-designer-workflow`. If tickets appear, the items are renamed to their keys.

## Working here

Use the `sl-aipdlc` skills rather than editing by hand — `/sl-analysis`, `/sl-plan`, `/sl-tasks`,
`/sl-use-case`, `/sl-adr`, `/sl-implement`, `/sl-claim`. They know the contract and the gates.

Validate before committing:

```bash
TOOLKIT="git+ssh://git@bitbucket.org/sl-technology/sl-aipdlc-toolkit.git"
uvx --from "$TOOLKIT" sl-aipdlc validate context
uvx --from "$TOOLKIT" sl-aipdlc check-language context
```

Two invariants worth knowing before you edit anything: an **analysis is a snapshot** and is never
rewritten to match later reality — it gets superseded. An **approved plan** that changes records an
`### Amendment N` rather than quietly changing, and a **done task** is never edited — it gets a
follow-up.
