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
updated: 2026-10-07T00:00:00Z
tags: [figma, design-to-code, roadmap]
---

# Figma-to-code roadmap

Derived from [A-NOJIRA-figma-to-code](../analyzes/NOJIRA-figma-to-code/analysis.md).

Only the current slice is planned in detail. Later slices are named, scoped in one line, and
deliberately left unplanned — their content should be chosen from what the baseline shows is
actually broken, not from what we guess today. Planning them now would repeat the failure the
analysis documents.

## Read this first

**Status as of 2026-10-07.** The fourteen-case probe (`T-NOJIRA-figma-ingestion-04`) is 12 of 14
designs walked — 9/9 as-is designs convert, 3/3 strict designs halt correctly, mode prediction
11/12 — with two designs left: `a4-sesame-my-groups` (as-is) and `a5-etsl-metadata-usage-widget`
(strict); evidence in [`runs/probe-04/README.md`](../../runs/probe-04/README.md).
`P-NOJIRA-harness-quality` is done (4/4). `P-NOJIRA-corpus-census` is 1/4. `P-NOJIRA-html-contract`,
`P-NOJIRA-html-artifacts` and `P-NOJIRA-ingestion-hardening` are approved with no task files yet.
The only shipped code is the harness scripts in `../../runs/harness/`; no design has gone Figma → HTML
through the new path.

**Two structures, two jobs.** Plans are **executable units** — each runs start to finish and
depends only on _other plans being finished_, never on a task inside one. Epics are a **grouping
for comprehension and monitoring** — thematic, and they do not execute.

Conflating them was a real error: plans were first cut by topic, which produced dependencies
between tasks in different plans and left no plan that could be run to completion. The cut below
is by executable unit; the epics restore the thematic view on top.

[`what-to-do-next.md`](../analyzes/NOJIRA-figma-to-code/what-to-do-next.md) is the ordered view.
Three facts settled 2026-10-05: the **cost question is closed** — the HTML is generated once and
consumed by hundreds of developers, so per-screen token cost against one developer was the wrong
unit — the **toolkit moves whole or not at all**, and **the target is all nineteen runs**.

### The target is all nineteen

Every design in the corpus fetches cleanly from Figma and becomes HTML. Early passes land short
and that is expected — **9 of 19 render** as of 2026-10-05, up from 6 before the advisory-split
repair — but nineteen is the number the work steers by.

[`render-failure-taxonomy.md`](../analyzes/NOJIRA-figma-to-code/render-failure-taxonomy.md)
measures what stands in the way, run by run, and the answer reorders nothing but sharpens why:
**nine of the ten remaining failures cannot be fixed by parsing.** Seven runs hold captures that
are not Figma's output at all, two are truncated at the MCP 25k output cap, and one carries a
Figma property literally named `↕️Size` that no JSX parser accepts. `P-NOJIRA-figma-ingestion`
owns nine of the ten; the harness owns none of them.

## Epics

| Epic                          | Outcome a stakeholder would recognise                                                                   | Plans                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **E1 — Evidence**             | we know which of the nineteen runs are evidence, and have the first fidelity figure with an N beside it | `P-NOJIRA-corpus-census`                                                                        |
| **E2 — Ingestion**            | runs stop refusing the designs that need them; the fetch becomes countable and provably complete        | `P-NOJIRA-figma-ingestion`, then `P-NOJIRA-mapping-adapters` and `P-NOJIRA-ingestion-hardening` |
| **E3 — The deliverable**      | a developer receives the design as HTML, plus an overlay marking what matched and what did not          | `P-NOJIRA-html-contract`, then `P-NOJIRA-html-artifacts`                                        |
| **E4 — The bench**            | quality is tracked over time: variance, baseline, cost, rerun policy                                    | `P-NOJIRA-figma-to-code` (reduced by Amendment 6)                                               |
| **E5 — Adoption and hygiene** | the thing is usable, honest, and its claims survive contact                                             | `P-NOJIRA-requirement-triage`, accessibility (unwritten), the designer rehearsal                |

## Plans, and what each waits for

| Plan                           | Epic | Depends on                          | Can start                                                 | Status (2026-10-07)                                 |
| ------------------------------ | ---- | ----------------------------------- | --------------------------------------------------------- | --------------------------------------------------- |
| `P-NOJIRA-corpus-census`       | E1   | —                                   | **now**                                                   | approved · tasks 1/4 done                           |
| `P-NOJIRA-figma-ingestion`     | E2   | —                                   | **now, in parallel**                                      | approved · tasks 8/9 done                           |
| `P-NOJIRA-harness-quality`     | E4   | —                                   | **now**                                                   | approved · tasks 4/4 done · 4 use cases passing     |
| `P-NOJIRA-html-contract`       | E3   | corpus-census                       | after E1                                                  | approved · no task files yet                        |
| `P-NOJIRA-html-artifacts`      | E3   | html-contract                       | after the contract is agreed                              | approved · no task files yet                        |
| `P-NOJIRA-mapping-adapters`    | E2   | figma-ingestion                     | after E2's first plan lands                               | `conceptual` / `proposed` — not yet approved        |
| `P-NOJIRA-ingestion-hardening` | E2   | figma-ingestion, html-artifacts     | after the traversal exists and the closure check is built | approved · no task files yet                        |
| `P-NOJIRA-figma-to-code`       | E4   | html-artifacts, ingestion-hardening | last                                                      | approved · 16 tasks: 7 todo, 8 blocked, 1 cancelled |
| `P-NOJIRA-requirement-triage`  | E5   | —                                   | anytime; documents only                                   | approved · tasks 0/6 done                           |

**Two plans can start today and they are independent of each other.** That is the point of the
re-cut: before it, nothing could be run to completion without waiting on a task inside another
plan.

**One rule that keeps it true:** a plan's dependency means _that plan is finished_, never _that
task is done_. A plan may consume a completed plan's output freely; it may not wait mid-flight on
somebody else's task.

**`P-NOJIRA-mapping-adapters` was added 2026-10-06, from a probe rather than from planning.** A
suspicion that designers had renamed component properties was tested and did not survive:
[A-NOJIRA-mapping-coverage](../analyzes/NOJIRA-mapping-coverage/analysis.md) traced one failing
design to `sl-card Actionable`, a component **Components 2.0 publishes and nobody mapped** —
alongside `sl-card`, which is mapped. Two Figma assets, one code component, one mapping. Three
things follow and all three are in the new plan: the recorded coverage figure counts the wrong
denominator, name matching produces confident wrong answers where asset identity would not, and
Code Connect currently cannot be checked by anything, which is why a second adapter is worth more
than its own coverage.

## Slices — superseded by the two tables above

The slice numbering predates the plan re-cut and the epics. It is kept only because earlier
documents cite slice numbers; **where it disagrees with the Epics and Plans tables, those win.**
This is a bare number → plan → phrase mapping; the scope prose that used to live here is now in the
plans themselves.

| #   | Plan                                                             | One phrase                                      |
| --- | ---------------------------------------------------------------- | ----------------------------------------------- |
| 0   | [P-NOJIRA-corpus-census](NOJIRA-corpus-census/plan.md)           | corpus census and the first fidelity figure     |
| 1   | [P-NOJIRA-figma-to-code](NOJIRA-figma-to-code/plan.md)           | the measurement bench                           |
| 1b  | [P-NOJIRA-requirement-triage](NOJIRA-requirement-triage/plan.md) | requirement triage, documents only              |
| 2   | [P-NOJIRA-html-contract](NOJIRA-html-contract/plan.md)           | the intermediate HTML artifact and its schema   |
| 2b  | [P-NOJIRA-figma-ingestion](NOJIRA-figma-ingestion/plan.md)       | ingestion quality; depends on nothing by design |
| 3   | not written yet                                                  | stage two — fitting HTML to the application     |
| 3b  | not written yet                                                  | accessibility — research then plan              |
| 4   | not written yet                                                  | the remaining open requirements                 |
| 5   | not written yet                                                  | caching and change detection                    |

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

| Track             | Produces                                                                                                                                                                                                 | Kind                                                                                         |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 1 — measurement   | `tools/sl-bench` — one CLI with `list` / `run` / `compare` / `test`, and the metrics beneath it (the scripts live in `runs/harness/` today; `tools/sl-bench` is the intended packaging, not yet created) | tool (scripts)                                                                               |
|                   | the design intake report                                                                                                                                                                                 | **1 skill** — a developer or designer points it at a Figma URL                               |
|                   | corpus registry, requirement registry, published baseline                                                                                                                                                | artifacts                                                                                    |
| 1b — triage       | nine confirmations, three deferral records, an accessibility handoff, five registry entries, one ADR, one published backlog                                                                              | documents only, no code                                                                      |
| 2 — stage split   | Figma → structured artifact                                                                                                                                                                              | **1 skill** (extraction; orchestrates scripts, judgement only where the source is ambiguous) |
|                   | structured artifact → HTML                                                                                                                                                                               | **library, no skill** — a pure function, so it is code and tested with fixtures              |
|                   | the package schemas                                                                                                                                                                                      | schema files + fixtures                                                                      |
| 3 — stage two     | package → application code: architecture mapping, reuse detection, diff against what exists                                                                                                              | **1 skill** + scripts for the comparison, which reuses the bench's machinery                 |
| 3 — HTML → Figma  | improvements to the existing `sl-ds-html-to-figma`                                                                                                                                                       | existing skill, extended                                                                     |
| 4 — accessibility | validation of the produced HTML; design-time guidance                                                                                                                                                    | script (the check) + **1 skill** (the guidance)                                              |
| 5 — conformance   | classification and routing of unresolved nodes; the detached-instance signature matcher                                                                                                                  | scripts, most likely extending the intake skill rather than a new one                        |

Roughly **four new skills across the whole programme** is the intended ceiling for conversational
entry points, and one existing one extended. **Zero skills have been built so far — everything
shipped is scripts** (the harness in `runs/harness/`). Everything else is scripts, schemas and
documents. If that count grows, it is worth asking what judgement the new skill is supposed to
supply that a script could not.

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

## Gating rule — superseded

> Replaced by the plan-level rule above: a plan's dependency means _that plan is finished_,
> never _that task is done_. What follows describes slice-to-slice gating and predates the re-cut.

### Original between slices

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

**Caching and change detection** (slice 5) sits in the same drawer, deferred on two grounds:
efficiency before correctness hides variance, and regenerating only what changed needs the node-id
join key that the HTML contract introduces — it is not buildable before that exists.

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
for why the three pieces of accessibility work are kept apart. Owner-assigned 2026-10-05, preceded
by research: the control shipped two WCAG 2.1 AA failures invisible to every gate — `autocomplete`
suppressed on a name/email form, and a `100vh` / `overflow: hidden` clip putting actions out of
reach ([`control-runs.md`](../analyzes/NOJIRA-figma-to-code/control-runs.md)). The research
question is which defects a static generated artifact can catch and which need the running
component; those two fall on opposite sides of it. Remediation may defer; detection must not.

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
