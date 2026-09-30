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
updated: 2026-09-30T11:30:00Z
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
| 1 | Measurement layer | [P-NOJIRA-figma-to-code](NOJIRA-figma-to-code/plan.md) | approved · `phase: approved` | Coverage, two fidelity dimensions, run-to-run variance, per-run cost by model tier, design intake report, published baseline. Pipeline unchanged. |
| 1b | Requirement triage | [P-NOJIRA-requirement-triage](NOJIRA-requirement-triage/plan.md) | proposed · `phase: conceptual` | **Runs in parallel with slice 1, not after it.** Turn the inherited 31-item list into a true one: confirm the nine already satisfied, defer three behind the consumer trigger, hand accessibility to its own initiative, convert five into registry entries, decide the four that conflict with the pipeline's autonomy design, publish the remaining eight in argued order. |
| 2 | Stage split and the intermediate artifact | not written yet | — | Split the run into **Figma → HTML** and **HTML → application**, with a durable artifact between them ([A-NOJIRA-pipeline-staging](../analyzes/NOJIRA-pipeline-staging/analysis.md)). Its first task defines that artifact — annotated HTML paired with the retained Figma extraction, joined by node id — written against what the baseline shows stage one actually preserves. Absorbs the increment candidates: per-node geometry, freezing the decomposition decision, moving computable checks out of prompts. Ordering from slice 1b. |
| 3 | Stage two — fitting HTML to the application | not written yet | — | Map the artifact onto the application's architecture, detect whether a similar design already exists in code and diff against it, build fresh where it does not. Much of the "does this already exist?" capability is a second consumer of slice 1's comparison machinery rather than new work. This is where the architecture review gate belongs. |
| 4 | The remaining open requirements | not written yet | — | The eight that survive triage, admitted one at a time and only with a corpus case attached. |
| 5 | Caching and change detection | not written yet | — | Skip unchanged designs, diff against the previous run. Deferred on two grounds: efficiency before correctness hides variance, and it is not buildable at all until the node-id join key from slice 2 exists — regenerating only what changed requires knowing which output came from which node. |

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

Slice 1b is the exception, deliberately: it needs no baseline, it produces the ordering slice 2
depends on, and it is document work that can be owned by a different person at the same time.

## Where the inherited requirements went

The 31 requirements from the prior attempt are re-scored in
[A-NOJIRA-requirement-backlog](../analyzes/NOJIRA-requirement-backlog/analysis.md): nine already
satisfied here, three deferred behind a named trigger, five that are measurements rather than
features, four in conflict with the pipeline's design, two gone to a separate accessibility
initiative, and **eight genuinely open now**. They do not appear as a slice of their own — slice 1b
establishes which are real and slice 3 works what remains.

## The shape the pipeline is heading towards

One run today goes from a Figma node to finished components, deciding both what the design *is* and
how it should be structured as code. Those are different questions with different evidence, and
conflating them is why a bad result cannot be attributed to a cause.

Slice 2 splits them:

```
Figma ──▶ [stage 1] ──▶ annotated HTML  +  retained Figma extraction ──▶ [stage 2] ──▶ application
           mechanical      (joined by node id — the provenance link)       architecture
           autonomous                                                      review gate here
           judged on fidelity                                              judged on fit and reuse
```

The artifact between them is a **pair, not a choice**. HTML renders, so it can be pixel-compared and
opened in a browser; the retained Figma extraction carries what HTML cannot express at all — bound
variables, instance properties, and hug/fill/fixed layout intent. Our own reverse-direction skill
has to *infer* which containers can become auto-layout, which is the in-house evidence that this
intent does not survive a DOM round trip.

Keeping both is also the answer to the cascade risk: an intermediate artifact that discards its
provenance turns every stage-one error into a permanent one, because nothing downstream can tell an
error from a decision. Accuracy reduces how often that starts; provenance is what makes it
reversible.

## Not a slice, but decided

**Distribution.** The pipeline is developed here and distributed later as an installable plugin, so
developers can run it against their own repositories. Two marketplaces could host it — this one, or
the organisation's toolkit, where an empty `sl-design` plugin is already reserved. The choice is
cheap now and expensive once consumers pin a source.

**Accessibility.** R30 and R31 leave for their own initiative, with their own analysis and owner.
Accessibility cannot be retrofitted onto generated code, so absorbing it would change the pipeline's
shape rather than lengthen a list.

## Parallel, not a slice

Completing the 14 unmapped Code Connect scaffolds runs alongside all of this, owned by the design
system team. It is a hard dependency for strict-mode cases and no dependency at all for as-is mode,
so it sequences against slice 2 rather than blocking slice 1.
