# context/ — the knowledge base for this repository

Everything being decided, planned and worked on around the Figma-to-code effort lives here, in one
format, so a person joining can read it in order instead of assembling it from conversations.

This is an **sl-aipdlc knowledge context** in embedded mode (marker: `.sl-aipdlc.yaml`). The rules
are in [CONVENTIONS.md](CONVENTIONS.md), the document contract in [SCHEMA.md](SCHEMA.md), and the
templates in [`_templates/`](_templates/). Documents are **English only**, even though the team
speaks Polish — a validator enforces it.

## Start here

| If you want to know…                                                   | Read                                                                                                                                                        |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Why any of this exists, and what is actually wrong today               | [`A-NOJIRA-figma-to-code`](analyzes/NOJIRA-figma-to-code/analysis.md)                                                                                       |
| What is being built first, and what is deliberately not                | [`P-NOJIRA-figma-to-code`](plan/NOJIRA-figma-to-code/plan.md)                                                                                               |
| The whole sequence, both tracks, at a glance                           | [`plan/roadmap.md`](plan/roadmap.md)                                                                                                                        |
| What a designer hands over, what it costs, how the flow gets tested    | [`A-NOJIRA-designer-workflow`](analyzes/NOJIRA-designer-workflow/analysis.md)                                                                               |
| Where the pipeline architecture is heading, and why                    | [`A-NOJIRA-pipeline-staging`](analyzes/NOJIRA-pipeline-staging/analysis.md)                                                                                 |
| How a run is scored — the five dimensions and what each is blind to    | [`ARCH-fidelity-scoring`](architecture/NOJIRA-figma-to-code/fidelity-scoring.md)                                                                            |
| How the handover package is laid out, written safely, and verified     | [`ARCH-handover-package`](architecture/NOJIRA-figma-to-code/handover-package.md)                                                                            |
| What to do with a node the design system does not resolve              | [`A-NOJIRA-ds-conformance`](analyzes/NOJIRA-ds-conformance/analysis.md)                                                                                     |
| What the first real run of the pipeline found                          | [`smoke-run-findings.md`](analyzes/NOJIRA-figma-to-code/smoke-run-findings.md)                                                                              |
| What happened to the 31 inherited requirements                         | [`A-NOJIRA-requirement-backlog`](analyzes/NOJIRA-requirement-backlog/analysis.md) → [`P-NOJIRA-requirement-triage`](plan/NOJIRA-requirement-triage/plan.md) |
| What was tried before and what it cost                                 | [`foundation/prior-art-ds-skills.md`](foundation/prior-art-ds-skills.md) → `reference/prior-art-ds-skills/`                                                 |
| What to do next, in order                                              | [`what-to-do-next.md`](analyzes/NOJIRA-figma-to-code/what-to-do-next.md)                                                                                    |
| Why nine of ten remaining render failures cannot be fixed by parsing   | [`render-failure-taxonomy.md`](analyzes/NOJIRA-figma-to-code/render-failure-taxonomy.md)                                                                    |
| What the 2026-10-05 working session settled                            | [`session-2026-10-05.md`](analyzes/NOJIRA-figma-to-code/session-2026-10-05.md)                                                                              |
| Why name matching mis-resolves Code Connect, and what to count instead | [`A-NOJIRA-mapping-coverage`](analyzes/NOJIRA-mapping-coverage/analysis.md)                                                                                 |
| How the harness scripts were made deterministic and testable           | [`A-NOJIRA-harness-testability`](analyzes/NOJIRA-harness-testability/analysis.md)                                                                           |
| What a Figma metadata payload must carry for ingestion to be countable | [`A-NOJIRA-figma-metadata-contract`](analyzes/NOJIRA-figma-metadata-contract/analysis.md)                                                                   |
| How the design system's own architecture shapes the mapping            | [`A-NOJIRA-design-system-architecture`](analyzes/NOJIRA-design-system-architecture/analysis.md)                                                             |
| How the pipeline is intended to be packaged and shipped                | [`A-NOJIRA-plugin-packaging`](analyzes/NOJIRA-plugin-packaging/analysis.md)                                                                                 |
| The fourteen-case halt probe, byte-for-byte evidence                   | [`runs/probe-04/README.md`](../runs/probe-04/README.md)                                                                                                     |

## Where things stand (2026-10-07)

The work is grouped into five epics (see [`plan/roadmap.md`](plan/roadmap.md)). The only shipped
code so far is the harness scripts in [`../runs/harness/`](../runs/harness/) (`mode-decision`,
`traverse`, `classify-unresolved`, `capture`, `normalise-captures`, `rest-metadata`,
`render-design`, `theme-match`, `typecheck`, and more, each with a `.test.mjs`). **No design has
yet gone Figma → HTML through the new path**; `tools/implement-design-plugin/` is the legacy
pipeline being measured, unchanged by design.

**E1 — Evidence.** `P-NOJIRA-corpus-census` — approved; tasks 1/4 done.

**E2 — Ingestion.** `P-NOJIRA-figma-ingestion` — approved; tasks 8/9 done, the remaining one is
the fourteen-case probe (`T-NOJIRA-figma-ingestion-04`, `todo`), 12 of 14 designs walked. ·
`P-NOJIRA-mapping-adapters` — `proposed` / `phase: conceptual`, **not yet approved** (created
2026-10-06). · `P-NOJIRA-ingestion-hardening` — approved; no task files yet.

**E3 — The deliverable.** `P-NOJIRA-html-contract` — approved; no task files yet. ·
`P-NOJIRA-html-artifacts` — approved; no task files yet.

**E4 — The bench.** `P-NOJIRA-figma-to-code` — approved; 16 task files (7 todo, 8 blocked,
1 cancelled, 0 done), scope reduced by Amendment 6. The harness scripts above are its output so
far. · `P-NOJIRA-harness-quality` — approved; 4/4 tasks done, 4 use cases passing.

**E5 — Adoption and hygiene.** `P-NOJIRA-requirement-triage` — approved; 0/6 tasks done.

**The designer handover contract.** [`A-NOJIRA-designer-workflow`](analyzes/NOJIRA-designer-workflow/analysis.md)
asks which of the three existing directions a piece of work should use, what each costs, and how the
working model is tested as distinct from the generated code. Analysis only, **no plan by design** —
three of its four questions await figures that do not exist yet.

## Three numbers, three populations

These three ratios recur and are **different populations** — they are never one series:

- **5 / 38** — unassisted control runs of the _old_ pipeline (19 designs × 2) that produced any code.
- **9 / 19** — corpus designs that render to HTML after the advisory-split repair (up from 6/19);
  these runs were supervisor-assisted.
- **9/9 as-is + 3/3 strict** — the fourteen-case probe of designs that previously halted: 9 of 9
  as-is designs convert (exit 0), 3 of 3 strict designs halt correctly (exit 5/6), mode prediction
  scored 11/12.

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

Items with no Jira ticket use a `NOJIRA-<slug>` key. The keys in use are, under `analyzes/`:
`NOJIRA-design-system-architecture`, `NOJIRA-designer-workflow`, `NOJIRA-ds-conformance`,
`NOJIRA-figma-metadata-contract`, `NOJIRA-figma-to-code`, `NOJIRA-harness-testability`,
`NOJIRA-mapping-coverage`, `NOJIRA-pipeline-staging`, `NOJIRA-plugin-packaging`,
`NOJIRA-requirement-backlog`; and under `plan/`: `NOJIRA-corpus-census`, `NOJIRA-figma-ingestion`,
`NOJIRA-figma-to-code`, `NOJIRA-harness-quality`, `NOJIRA-html-artifacts`, `NOJIRA-html-contract`,
`NOJIRA-ingestion-hardening`, `NOJIRA-mapping-adapters`, `NOJIRA-requirement-triage`. If tickets
appear, the items are renamed to their keys.

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
