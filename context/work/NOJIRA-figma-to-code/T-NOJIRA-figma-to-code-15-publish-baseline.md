---
type: task
schema_version: 1
id: T-NOJIRA-figma-to-code-15
title: Baseline run and published result
description: Measure the existing pipeline over the frozen corpus with repetition and publish the numbers every later slice is judged against
jira: null
resource: null
status: todo
independent: false
owner: marcin.ludwig
created: 2026-09-30T08:20:00Z
updated: 2026-09-30T14:20:00Z
tags: [baseline, measurement, milestone]
source_plan: P-NOJIRA-figma-to-code
depends_on: [T-NOJIRA-figma-to-code-08, T-NOJIRA-figma-to-code-09, T-NOJIRA-figma-to-code-11, T-NOJIRA-figma-to-code-12, T-NOJIRA-figma-to-code-14]
---

# Baseline run and published result

> From [P-NOJIRA-figma-to-code](../../plan/NOJIRA-figma-to-code/plan.md).

## Objective
The deliverable that makes every subsequent decision evidence-based. Until this exists, slice 2
cannot state its acceptance as a delta and the gating rule between slices is unenforceable.

It is also the artifact to bring to a conversation with the pipeline's author: not an opinion about
what could be improved, but a measurement of where it stands and how much it moves.

## Steps
- [ ] Run the current pipeline over every corpus case with repetition, in both modes where the case supports both
- [ ] Publish mean and spread per case and per dimension, with the diff artifacts retained and linked
- [ ] Publish the cost per case — tokens by model tier and by pipeline stage, with its spread — so slice 2 can argue a tier change on evidence
- [ ] Record the exact pipeline commit measured, so the baseline is anchored to a known state
- [ ] Do not publish until the bench's own integration test is green — numbers from an unverified instrument are worse than no numbers, because they are quoted
- [ ] Confirm and state that the pipeline was not modified — an empty diff over `tools/implement-design-plugin/` across the whole slice
- [ ] Write a short reading of the result: where the pipeline is strong, where it is weak, and which cases are unstable enough that their mean should not be quoted
- [ ] Carry the outstanding concern from the plan: if the tiered tolerances cannot absorb the renderer difference, say so here and record that the fidelity dimension falls back to geometry alone

## Acceptance criteria
- [ ] A published baseline exists with mean and spread for every corpus case and dimension, and cost per case by tier and stage
- [ ] `git diff` over `tools/implement-design-plugin/` is empty for the whole slice
- [ ] The reading names which cases are unstable and therefore not yet usable as a gate
- [ ] Slice 2 can be written with its acceptance expressed as a delta against this document

## Verification
Run the full corpus with repetition, publish, and verify the empty-diff claim with `git diff`
against the slice start commit.
- Use case: `UC-NOJIRA-figma-to-code-15` — `../../tests/NOJIRA-figma-to-code/UC-NOJIRA-figma-to-code-15-baseline-is-anchored.md`
