---
type: plan
schema_version: 1
id: P-NOJIRA-figma-to-code
title: Measurement layer for the Figma-to-code pipeline
description: Build coverage, fidelity and design-intake measurement over the existing pipeline without changing it, producing a baseline and its run-to-run variance
jira: null
resource: null
status: approved
phase: approved
owner: marcin.ludwig
created: 2026-09-30T08:02:22Z
updated: 2026-09-30T10:10:00Z
tags: [figma, design-to-code, measurement, determinism, tooling]
source_analysis: A-NOJIRA-figma-to-code
slice: measurement-layer
depends_on: []
approved_by: marcin.ludwig
approved_date: 2026-09-30
open_questions: []
---

# Measurement layer for the Figma-to-code pipeline

> Derived from [A-NOJIRA-figma-to-code](../../analyzes/NOJIRA-figma-to-code/analysis.md).

## Goal

A single command that takes a frozen set of Figma designs, runs the existing generation pipeline
against them, and reports — per design — how much of the design was transferred, how closely the
result matches, and how much the answer moves when the same input is run again.

Plus the read-only counterpart: a report that answers, for any Figma node, how much of it uses the
design system, what is detached, and which unmapped components recur across teams.

At the end of this plan the generation pipeline is **unchanged**. What changes is that every future
change to it becomes decidable.

## Approach

Four principles, taken from the analysis:

1. **Measure before improving.** Nothing in `tools/implement-design-plugin/` is modified by this
   plan. The harness observes from outside, so its own correctness can be established against a
   pipeline that is not moving underneath it.
2. **Coverage before fidelity.** Node accounting is deterministic, cheap, and catches omissions
   that pixel comparison is structurally blind to — a section that was never rendered has nothing
   to diff against. It also doubles as the design-system adoption traversal, so one walk over the
   node tree serves the harness and the intake report both.
3. **Variance is a first-class result.** Every score is reported with the spread observed over
   repeated runs of the same input. A mean without a spread cannot answer the question this work
   exists to answer.
4. **Two dimensions of fidelity, not five.** DOM position accuracy and per-component pixel
   comparison only. Token compliance, Code Connect compliance and responsive checks are deferred —
   admitting all five now would repeat the mistake the analysis documents.

The deliberate consequence of principle 4: this plan is itself the first demonstration of the
incremental method it establishes. Its acceptance criteria are narrow on purpose.

**Two decisions taken at approval.** The harness is a **sibling tool under `tools/`**, not part of
the `implement-design` plugin: it must be able to measure any generator — the plugin today, the
prior `sl-ds-*` skill set, whatever replaces either — and keeping it outside the plugin is what
keeps "measure from outside" true rather than aspirational. The corpus lives in a **new Figma file
owned by the design system team**, holding copies of nodes lifted from the product files, so the
product teams cannot edit it out from under a baseline.

Measuring without modifying is possible because the pipeline already persists what the harness
needs: the structural node tree, the Code Connect map, the design context and the reference
screenshot are written to the run folder on every run. The harness reads that folder and the
rendered page; it does not instrument the agents.

The requirement registry is seeded but not populated with active entries. The 31 requirements from
the prior attempt are recorded as proposals; an entry becomes active only when a corpus case
exercises it. That rule is what prevents the backlog from being re-adopted wholesale.

## Scope

**In scope.** The harness as a sibling tool under `tools/`; the corpus registry and its freezing
procedure; deterministic Figma node-tree extraction;
node-accounting coverage metric; design-system adoption and intake report as a skill; the runner and
its result schema; repeated-run variance; DOM position accuracy; per-component pixel comparison with
tiered tolerances; strict versus as-is mode declaration; a published baseline for the current
pipeline; the requirement registry format and its seeding.

**Out of scope.** Any change to the generation agents, their prompts, or the manifest schema.
Automatic repair. Token compliance, Code Connect compliance and responsive fidelity dimensions.
Completing the 14 unmapped Code Connect scaffolds — that work is Diana's and runs in parallel.
Choosing which pipeline improvements to make, which is what the baseline is for.

## Work breakdown

Tasks to be created in `work/NOJIRA-figma-to-code/` once this plan is approved:

- `T-NOJIRA-figma-to-code-01` — Harness location decision and skeleton; corpus registry format
- `T-NOJIRA-figma-to-code-02` — Frozen corpus: select and freeze the initial cases, document the freeze
- `T-NOJIRA-figma-to-code-03` — Deterministic Figma node-tree extraction shared by coverage and intake
- `T-NOJIRA-figma-to-code-04` — Coverage metric: node accounting and its report
- `T-NOJIRA-figma-to-code-05` — Design intake report as a skill: adoption, detached instances, unmapped-component demand ranking
- `T-NOJIRA-figma-to-code-06` — Runner command and result schema
- `T-NOJIRA-figma-to-code-07` — Repeated-run mode and variance reporting
- `T-NOJIRA-figma-to-code-08` — Fidelity: DOM position accuracy
- `T-NOJIRA-figma-to-code-09` — Fidelity: per-component pixel comparison with tiered tolerances
- `T-NOJIRA-figma-to-code-10` — Strict and as-is modes over one measurement
- `T-NOJIRA-figma-to-code-11` — Requirement registry format, seeded from the prior attempt's list
- `T-NOJIRA-figma-to-code-12` — Baseline run and published result
- `T-NOJIRA-figma-to-code-13` — Cost and model-tier accounting (added by Amendment 1)

Each task carries a use case in `tests/NOJIRA-figma-to-code/` naming the corpus case that proves it.
That link is the document-level expression of the plan's core rule: one requirement, one test case,
one measured delta.

## Risks & dependencies

| Risk | Consequence | Mitigation |
|---|---|---|
| The corpus Figma file is edited mid-effort | Results stop being comparable and degrade silently rather than failing loudly | Freeze by copying into a file the design teams do not own; record the last-modified stamp with every result and fail the run when it changes |
| Figma and browser renderers differ systematically | The pixel dimension produces noise rather than signal | Tiered tolerances by element class; if it still fails, the analysis already names the fallback — DOM geometry only, one dimension replaced, plan intact |
| Code Connect scaffolds block ingestion on real product designs | Some corpus cases cannot run at all | Select initial cases that avoid the 14 unmapped components; exercise the others in as-is mode, which does not require a mapping |
| The harness itself accretes requirements | The plan reproduces the failure it was written to prevent | Acceptance is fixed at two fidelity dimensions; anything further is a separate plan against a measured gap |
| Measurement is built but never used to gate changes | The numbers become decoration | The next plan's acceptance is expressed as a score delta against this baseline, which makes the gate structural rather than cultural |

**Dependencies.** Figma MCP access, with the desktop server for Code Connect resolution.
A runnable Storybook in this repository for rendering. Diana's mapping work is a parallel
dependency for strict-mode cases, not a blocker for this plan.

## Acceptance

1. One command runs the existing pipeline over every registered corpus case and writes, per case,
   a machine-readable result containing: coverage percentage with a named list of unaccounted
   nodes, a fidelity figure broken down by its two dimensions, and the mode the run was scored in.
2. The same command run with repetition reports the spread across runs alongside the mean, for both
   coverage and fidelity.
3. The intake report runs against at least five of the eleven team Figma files and produces, for
   each, a design-system adoption figure, a detached-instance count, and a cross-file ranking of
   unmapped components by how often they appear.
4. A baseline for the current pipeline is published: mean and spread per corpus case, with diff
   artifacts retained for inspection.
5. `git diff` over `tools/implement-design-plugin/` is empty for the whole plan — the pipeline was
   measured, not modified.
6. The requirement registry exists and is seeded, with every entry either active and carrying a
   corpus case, or proposed and carrying none.
7. Every task has a use case in `tests/` that states which corpus case proves it, and the context
   validates clean.
8. Every result records what the run cost — tokens by model tier and by pipeline stage — so a tier
   or effort change can be evaluated as a cost delta against a score delta rather than on intuition.

## Approval

- Approved by: marcin.ludwig
- Approved date: 2026-09-30
- Open questions resolved:
  - **Where the harness lives** — *answered.* A sibling tool under `tools/`, so it can measure any
    generator and not only the `implement-design` plugin. Recorded in `## Approach` and `## Scope`;
    executed by `T-NOJIRA-figma-to-code-01`.
  - **Who owns the frozen corpus and how it is protected** — *answered.* A new Figma file owned by
    the design system team, holding copies of nodes taken from the product files. Executed by
    `T-NOJIRA-figma-to-code-02`, which also records the freeze procedure and the last-modified
    guard.
  - **Whether increments target the plugin, the prior skill set, or both** — *carried.* This is
    settled by what the baseline shows, which is the output of `T-NOJIRA-figma-to-code-12`. Deciding
    it now would be guessing; it belongs to the slice 2 plan.
  - **How mapping work and pipeline work are sequenced** — *carried.* A standing coordination matter
    with the Code Connect work, not a precondition for this slice: strict-mode cases need the
    mappings, as-is mode does not, and `T-NOJIRA-figma-to-code-02` selects initial cases that avoid
    the fourteen unmapped components.
  - **Whether a Jira ticket is created** — *carried.* Administrative. If a ticket appears, every id
    in this initiative is renamed from `NOJIRA-figma-to-code` to its key and the cross-links updated.
- Outstanding concerns: the fidelity dimension rests on Figma and browser renderers agreeing within
  the tiered tolerances. If they do not, `T-NOJIRA-figma-to-code-09` is the task that will surface
  it, and the analysis already names the fallback — DOM geometry alone, one dimension replaced
  rather than the plan invalidated.

### Amendment 1 — 2026-09-30, after approval

Recorded because an approved plan that changes quietly is worse than one that was never approved.

**What changed.** The plan now measures a third axis: **what a run cost**. Every result records
tokens by model tier and by pipeline stage alongside the score and its spread — added as
`T-NOJIRA-figma-to-code-13` and as an eighth acceptance criterion.
`T-NOJIRA-figma-to-code-12` extends to publish cost per case in the baseline, and
`T-NOJIRA-figma-to-code-11` extends so a model-judged requirement records the tier and effort it was
validated at.

The reason is a standing requirement that had not been written down: use the cheapest model and the
lowest effort setting that does the job, and reserve the expensive tiers for work that genuinely
needs reasoning. Today that cannot be acted on, because downgrading a stage and asking "did anything
get worse" has no answer — the pipeline reports neither quality nor cost. With both recorded, a tier
change becomes an experiment: swap the tier, re-run with repetition, read the score delta against the
cost delta. **A change that leaves the score inside the measured spread while halving the cost is an
improvement**, and there is currently no way to state that, let alone prove it.

The prior attempt already tried this and left no evidence: its handover scores model-tier routing as
delivered in the newer version and absent in the older one, with no measurement of what the routing
bought or what it cost. That is the gap this amendment closes.

**What did not change.** The goal, the approach and the scope boundary all stand. Fidelity is still
two dimensions and not five. The pipeline is still not modified — cost is read from what a run
already reports, exactly as coverage and fidelity are. Sequencing is unchanged: the new task hangs
off the result schema and blocks nothing.

**Judgement to be aware of.** Cost is recorded per run and per stage, not attributed to individual
decisions within a stage. That will show *that* a stage is expensive, never *which* of its choices
made it so. Finer attribution was deliberately left out as the kind of instrumentation this slice
exists to avoid, and reverting that call costs nothing — the per-stage figure is a strict subset of
anything finer we might add later.

- Amended by: marcin.ludwig
- Amendment approved: 2026-09-30
