---
type: plan
schema_version: 1
id: P-NOJIRA-figma-to-code
title: Measurement layer for the Figma-to-code pipeline
description: Build coverage, fidelity and design-intake measurement over the existing pipeline without changing it, producing a baseline and its run-to-run variance
jira: null
resource: null
status: proposed
phase: conceptual
owner: marcin.ludwig
created: 2026-09-30T08:02:22Z
updated: 2026-09-30T08:02:22Z
tags: [figma, design-to-code, measurement, determinism, tooling]
source_analysis: A-NOJIRA-figma-to-code
slice: measurement-layer
depends_on: []
approved_by: null
approved_date: null
open_questions:
  - Where the harness lives — inside the implement-design plugin or as a sibling tool usable against any generator
  - Who owns the frozen corpus Figma file and how it is protected from edits
  - Whether increments target the existing plugin, the prior skill set, or both behind one measurement layer
  - How mapping work and pipeline work are sequenced given they are mutually blocking
  - Whether a Jira ticket is created, which would rename every item in this initiative
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

Measuring without modifying is possible because the pipeline already persists what the harness
needs: the structural node tree, the Code Connect map, the design context and the reference
screenshot are written to the run folder on every run. The harness reads that folder and the
rendered page; it does not instrument the agents.

The requirement registry is seeded but not populated with active entries. The 31 requirements from
the prior attempt are recorded as proposals; an entry becomes active only when a corpus case
exercises it. That rule is what prevents the backlog from being re-adopted wholesale.

## Scope

**In scope.** Corpus registry and its freezing procedure; deterministic Figma node-tree extraction;
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

## Approval

**This section must be filled before creating tasks in `work/` (phase gate).**

- Approved by: <!-- name -->
- Approved date: <!-- YYYY-MM-DD -->
- Open questions resolved: <!-- Each of the five in frontmatter: answer here, or name the task that
     carries it. Questions 1 and 2 must be answered before T-01 and T-02 respectively — they decide
     where code goes and whether results are comparable at all. Questions 3, 4 and 5 may be carried:
     3 is settled by what the baseline shows, 4 is a standing coordination matter with the mapping
     work, and 5 is administrative. -->
- Outstanding concerns: <!-- none, or list -->

To approve: set `phase: approved`, `approved_by`, `approved_date` in frontmatter, and clear `open_questions: []` — in the **same commit** as this sign-off (CONVENTIONS § 4.1).
