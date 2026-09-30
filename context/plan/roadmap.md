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
updated: 2026-10-01T12:00:00Z
tags: [figma, design-to-code, roadmap]
---

# Figma-to-code roadmap

Derived from [A-NOJIRA-figma-to-code](../analyzes/NOJIRA-figma-to-code/analysis.md).

Only the current slice is planned in detail. Later slices are named, scoped in one line, and
deliberately left unplanned — their content should be chosen from what the baseline shows is
actually broken, not from what we guess today. Planning them now would repeat the failure the
analysis documents.

## Slices

| #   | Slice                                       | Plan                                                             | Status                       | One-line scope                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| --- | ------------------------------------------- | ---------------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Measurement layer                           | [P-NOJIRA-figma-to-code](NOJIRA-figma-to-code/plan.md)           | approved · `phase: approved` | `tools/sl-bench` — coverage, two fidelity dimensions, run-to-run variance, per-run cost by model tier, comparison across configurations and over time, design intake report, published baseline. Pipeline unchanged. The bench serves **both** halves of the pipeline, which is why its name and its result schema are stage-neutral.                                                                                                                                                                                                      |
| 1b  | Requirement triage                          | [P-NOJIRA-requirement-triage](NOJIRA-requirement-triage/plan.md) | approved · `phase: approved` | **Runs in parallel with slice 1, not after it.** Turn the inherited 31-item list into a true one: confirm the nine already satisfied, defer three behind the consumer trigger, hand accessibility to its own initiative, convert five into registry entries, decide the four that conflict with the pipeline's autonomy design, publish the remaining eight in argued order.                                                                                                                                                               |
| 2   | Stage split and the intermediate artifact   | not written yet                                                  | —                            | Split the run into **Figma → HTML** and **HTML → application**, with a durable artifact between them ([A-NOJIRA-pipeline-staging](../analyzes/NOJIRA-pipeline-staging/analysis.md)). Its first task defines that artifact — annotated HTML paired with the retained Figma extraction, joined by node id — written against what the baseline shows stage one actually preserves. Absorbs the increment candidates: per-node geometry, freezing the decomposition decision, moving computable checks out of prompts. Ordering from slice 1b. |
| 3   | Stage two — fitting HTML to the application | not written yet                                                  | —                            | Map the artifact onto the application's architecture, detect whether a similar design already exists in code and diff against it, build fresh where it does not. Much of the "does this already exist?" capability is a second consumer of slice 1's comparison machinery rather than new work. This is where the architecture review gate belongs.                                                                                                                                                                                        |
| 4   | The remaining open requirements             | not written yet                                                  | —                            | The eight that survive triage, admitted one at a time and only with a corpus case attached.                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 5   | Caching and change detection                | not written yet                                                  | —                            | Skip unchanged designs, diff against the previous run. Deferred on two grounds: efficiency before correctness hides variance, and it is not buildable at all until the node-id join key from slice 2 exists — regenerating only what changed requires knowing which output came from which node.                                                                                                                                                                                                                                           |

## Second track — the designer handover contract

[A-NOJIRA-designer-workflow](../analyzes/NOJIRA-designer-workflow/analysis.md) asks a different
question: what a designer hands over, what each direction costs, and how the working model itself
gets tested. It concludes with **no plan yet, deliberately** — three of its four questions depend on
figures not yet in hand (Figma seat inventory, API limits, and the per-run cost of the forward
direction, which slice 1 produces as a by-product).

Its one immediately actionable recommendation is a **rehearsal**: take one real ticket through the
whole path with a real designer and record where it stalled. That needs no build, and it is the only
evidence in this initiative that money cannot buy.

The two tracks meet at one point: the intake report (`T-NOJIRA-figma-to-code-03`) is the instrument
for measuring design system adoption, and the designer analysis extends its remit from Figma files to
canvas-built prototypes.

## What each track produces

A deliberate bias runs through all of it: **everything that can be a script is a script.** A script
runs identically every time, costs no tokens, and is testable. A skill is for the places where
judgement is genuinely needed, or where the entry point has to be conversational — and a skill
should be a thin orchestrator over scripts rather than a place where work happens.

| Track             | Produces                                                                                                                    | Kind                                                                                         |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 1 — measurement   | `tools/sl-bench` — one CLI with `list` / `run` / `compare` / `test`, and the metrics beneath it                             | tool (scripts)                                                                               |
|                   | the design intake report                                                                                                    | **1 skill** — a developer or designer points it at a Figma URL                               |
|                   | corpus registry, requirement registry, published baseline                                                                   | artifacts                                                                                    |
| 1b — triage       | nine confirmations, three deferral records, an accessibility handoff, five registry entries, one ADR, one published backlog | documents only, no code                                                                      |
| 2 — stage split   | Figma → structured artifact                                                                                                 | **1 skill** (extraction; orchestrates scripts, judgement only where the source is ambiguous) |
|                   | structured artifact → HTML                                                                                                  | **library, no skill** — a pure function, so it is code and tested with fixtures              |
|                   | the package schemas                                                                                                         | schema files + fixtures                                                                      |
| 3 — stage two     | package → application code: architecture mapping, reuse detection, diff against what exists                                 | **1 skill** + scripts for the comparison, which reuses the bench's machinery                 |
| 3 — HTML → Figma  | improvements to the existing `sl-ds-html-to-figma`                                                                          | existing skill, extended                                                                     |
| 4 — accessibility | validation of the produced HTML; design-time guidance                                                                       | script (the check) + **1 skill** (the guidance)                                              |
| 5 — conformance   | classification and routing of unresolved nodes; the detached-instance signature matcher                                     | scripts, most likely extending the intake skill rather than a new one                        |

Roughly **four new skills across the whole programme**, and one existing one extended. Everything
else is scripts, schemas and documents. If that count grows, it is worth asking what judgement the
new skill is supposed to supply that a script could not.

## The working rhythm

Once the baseline exists, every slice after it runs the same loop, and the loop is the method:

```
pick ONE requirement  →  implement it  →  bench run, --repeat 3  →  compare against the baseline
                                                                      │
                    ┌─────────────────────────────────────────────────┤
                    │                                                 │
        score moved beyond the spread              score moved less than the spread
        and cost did not get worse                 or cost got worse for nothing
                    │                                                 │
              keep · record the delta                          revert · record why
              raise the threshold                              the entry stays proposed
```

Before that loop can start, three things happen in order: a **smoke run** of the current pipeline by
hand (reconnaissance — does it even complete), then **slice 1** task by task, then the **baseline**.
The loop is not available earlier, because a delta needs something to be a delta against.

### When the bench runs again

Fixed up front, so it is structural rather than remembered: a requirement lands · a model, tier or
effort setting changes · the pipeline changes for any other reason · a new model is released · the
corpus is refreshed (which invalidates comparison rather than producing a delta) · **and on a
schedule with nothing changed at all**, which is the only one that catches drift nobody caused.

Always the whole corpus, never only the case believed to be affected — a change that fixes one
screen and breaks another is exactly what this is for.

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

One run today goes from a Figma node to finished components, deciding both what the design _is_ and
how it should be structured as code. Those are different questions with different evidence, and
conflating them is why a bad result cannot be attributed to a cause.

Slice 2 splits them — **along the line where the work changes hands**, not merely into two technical
phases:

```
   DESIGNER (has Figma)                        │  handover  │      DEVELOPER (no Figma seat)
                                               │            │
   Figma ──▶ [ stage 1 ] ──▶  the package  ────┼────────────┼───▶ [ stage 2 ] ──▶ application
              mechanical      ├ annotated HTML │            │      architecture mapping
              autonomous      ├ Figma extract  │            │      reuse detection + diff
              all Figma       └ fidelity       │            │      review gate lives here
              comparison        attestation    │            │      judged on fit and reuse
              happens here                     │            │
              judged on fidelity               │            │
```

The developer holds no Figma seat, so they cannot open the design, re-read a value, or check the
HTML against anything. Everything reaches them through the package or not at all — which is what
fixes its contents.

The package has three parts and **none of them is optional**. HTML renders, so it can be
pixel-compared and opened in a browser. The retained Figma extraction carries what HTML cannot
express at all — bound variables, instance properties, hug/fill/fixed layout intent — and since the
developer cannot reach Figma, it is the only channel by which that intent travels; our own
reverse-direction skill has to _infer_ which containers can become auto-layout, which is the
in-house evidence that this intent does not survive a DOM round trip. The attestation carries the
fidelity score and the named deviations, generated by the tool rather than written by hand, because
the side receiving it cannot check the work.

That is also the answer to the cascade risk: an artifact that discards its provenance turns every
stage-one error into a permanent one, since nothing downstream can tell an error from a decision.
Accuracy reduces how often that starts; shipping the evidence is what keeps it visible and
reversible.

Two consequences worth reading off the diagram: the two stages are **separately distributed** —
designer-facing tooling that needs Figma, developer-facing tooling that must work without it — and
the route **back** from developer to designer, for when the HTML is wrong, is part of this flow
rather than an exception to it. Nothing describes that route yet.

## Sixth track — speed and cost, deliberately last

The first real run took **372,844 tokens and about 27 minutes** to produce two components on the
simplest screen in the corpus, before any visual validation. The inherited R8 target was 1–2
minutes per screen with 10 as a ceiling. For scale, the prior `ds-*`/`sdl-*` attempt ran 40–60
minutes, so this is already better — the target was the thing that was unrealistic.

Optimising this is its own analysis and its own plan, and it comes **after** the quality work, for
the reason the whole programme is built on: an optimisation you cannot measure is a guess, and one
measured against an unstable baseline is worse than a guess. Once a rerun produces a number with a
spread, a speed change becomes the same experiment as any other — swap it, rerun, read the cost
delta against the score delta. The bench already records cost per tier per stage precisely so this
track has something to work with when it starts.

Not planned yet, and deliberately not started.

## Fifth track — design-system conformance of a design

[A-NOJIRA-ds-conformance](../analyzes/NOJIRA-ds-conformance/analysis.md). "Unresolved by Code
Connect" hides five different situations that belong to four different people: a missing mapping, a
detached instance, a component that could have been from the design system and was not, and a
genuine gap in the library. Classifying and routing them is the design system team's instrument.

Its own plan, sequenced after the measurement slice and building on the intake report's traversal.
Kept separate deliberately: it carries a heuristic layer of varying confidence and a different
audience, and folding it into a slice whose acceptance is deliberately narrow is the pattern this
roadmap exists to avoid.

Sequenced by confidence rather than by value — missing mappings and library gaps fall out of the
traversal nearly free, detached instances need a structural matcher built from the mappings
themselves, and similarity matching comes last, reported with its uncertainty and never used as a
gate.

## Fourth track — accessibility

Its own plan, dependent on the HTML stage but not part of it. See _Not a slice, but decided_ below
for why the three pieces of accessibility work are kept apart.

## Third track — HTML back to Figma

Accessibility fixes and visual corrections will be made on the HTML, and will then need to reach
Figma so the design and the build do not diverge. A skill for this exists in the organisation's
toolkit (`sl-ds-html-to-figma`); it works but is not good enough to rely on. Improving it is a third
track, not part of either stage, and it is not planned yet.

It is also where the constraint from
[A-NOJIRA-designer-workflow](../analyzes/NOJIRA-designer-workflow/analysis.md) bites hardest: the
reverse direction **writes** to Figma, and a Dev seat is read-only. Whoever runs it needs a full
design seat.

## How the package gets built and delivered — undecided, two candidates

Both end with the same output: HTML plus its metadata document. That is why the choice can be
deferred without blocking the package format.

- **Cloud build.** The designer triggers it, everything is computed centrally, the artifact is
  downloadable or viewable. One environment, one run, and extra gates such as the accessibility
  check attach naturally.
- **Local build, then upload.** The designer generates on their own machine and distributes —
  manually, or by triggering a pipeline to upload. Lower latency and no infrastructure, at the cost
  of reproducibility and of a natural place to hang gates.

## Not a slice, but decided

**Distribution.** The pipeline is developed here and distributed later as an installable plugin, so
developers can run it against their own repositories. Two marketplaces could host it — this one, or
the organisation's toolkit, where an empty `sl-design` plugin is already reserved. The choice is
cheap now and expensive once consumers pin a source.

**Accessibility.** Its own plan, not a part of either stage. Three distinct pieces of work that are
easy to conflate and should not be: automated validation of the produced HTML, whose result belongs
in the package metadata and can gate a pipeline; the designer review and approval that follows it,
which is process rather than tooling; and accessibility in the generated application code — R30 and
R31 — which is behaviour and mostly not automatable.

It may **depend** on the HTML stage, since the artifact it validates has to exist first. A
dependency is not a reason to merge plans: accessibility brings its own conformance question, its
own tooling and a human sign-off, and folding that into a slice whose acceptance is deliberately
narrow would give it a second discipline of a different shape.

## Parallel, not a slice

Completing the 14 unmapped Code Connect scaffolds runs alongside all of this, owned by the design
system team. It is a hard dependency for strict-mode cases and no dependency at all for as-is mode,
so it sequences against slice 2 rather than blocking slice 1.
