---
type: roadmap
schema_version: 1
id: ROADMAP-figma-to-code
title: Figma-to-code roadmap
description: The slices of the Figma-to-code effort in dependency order, and which of them are planned in detail
jira: null
resource: null
status: current
owner: marcin.ludwig
created: 2026-09-30T08:02:22Z
updated: 2026-09-30T09:50:00Z
tags: [figma, design-to-code, roadmap]
---

# Figma-to-code roadmap

Derived from [A-NOJIRA-figma-to-code](../analyzes/NOJIRA-figma-to-code/analysis.md).

Only the current slice is planned in detail. Later slices are named, scoped in one line, and
deliberately left unplanned — their content should be chosen from what the baseline shows is
actually broken, not from what we guess today. Planning them now would repeat the failure the
analysis documents.

## Slices

| # | Slice | Plan | Status | One-line scope |
|---|---|---|---|---|
| 1 | Measurement layer | [P-NOJIRA-figma-to-code](NOJIRA-figma-to-code/plan.md) | approved · `phase: approved` | Coverage, two fidelity dimensions, run-to-run variance, design intake report, published baseline. Pipeline unchanged. |
| 2 | Pipeline increments | not written yet | — | One requirement at a time against the baseline. First candidates from the analysis: per-node geometry carried into the manifest, freezing the decomposition decision in a reviewable artifact, moving the computable finish checks out of the validation prompt into a script. |
| 3 | Requirement backlog | not written yet | — | The remaining items from the prior attempt's 31-requirement list, admitted one at a time and only with a corpus case attached. |
| 4 | Caching and change detection | not written yet | — | Skip unchanged designs, diff against the previous run. Explicitly deferred: it is an efficiency concern, and efficiency before correctness hides variance. |

## Second track — the designer handover contract

[A-NOJIRA-designer-workflow](../analyzes/NOJIRA-designer-workflow/analysis.md) asks a different
question: what a designer hands over, what each direction costs, and how the working model itself
gets tested. It concludes with **no plan yet, deliberately** — three of its four questions depend on
figures not yet in hand (Figma seat inventory, API limits, and the per-run cost of the forward
direction, which slice 1 produces as a by-product).

Its one immediately actionable recommendation is a **rehearsal**: take one real ticket through the
whole path with a real designer and record where it stalled. That needs no build, and it is the only
evidence in this initiative that money cannot buy.

The two tracks meet at one point: the intake report (`T-NOJIRA-figma-to-code-05`) is the instrument
for measuring design system adoption, and the designer analysis extends its remit from Figma files to
canvas-built prototypes.

## Gating rule between slices

A slice may not start until the previous one can express its own success as a number. Slice 2's
acceptance is written as a score delta against slice 1's baseline; slice 3's against slice 2's.
That is what makes the gate structural rather than a matter of discipline.

## Parallel, not a slice

Completing the 14 unmapped Code Connect scaffolds runs alongside all of this, owned by the design
system team. It is a hard dependency for strict-mode cases and no dependency at all for as-is mode,
so it sequences against slice 2 rather than blocking slice 1.
