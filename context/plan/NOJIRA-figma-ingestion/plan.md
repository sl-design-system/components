---
type: plan
schema_version: 1
id: P-NOJIRA-figma-ingestion
title: Stop the pipeline refusing the designs that need it most
description: Decide the mode from evidence, make Code Connect the traversal's stopping rule, classify the empty map into five causes with owners instead of halting — and measure the result against the fourteen cases that halt today
jira: null
resource: null
status: approved
phase: approved
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T00:00:00Z
tags: [figma, design-to-code, ingestion, determinism, instrumentation]
source_analysis: A-NOJIRA-ds-conformance
slice: halt-diagnosis
depends_on: []
approved_by: marcin.ludwig
approved_date: 2026-10-05
open_questions: []
---

# Ingestion quality — knowing what came out of Figma, and whether it came out whole

> Derived from [A-NOJIRA-ds-conformance](../../analyzes/NOJIRA-ds-conformance/analysis.md), with
> the measured baseline in
> [`control-runs.md`](../../analyzes/NOJIRA-figma-to-code/control-runs.md) and the mechanics in
> [`fetch-completeness-and-prior-art.md`](../../analyzes/NOJIRA-figma-to-code/fetch-completeness-and-prior-art.md).

## Goal

Make the fetch a scripted step whose completeness and correctness are checkable, and whose cost
is countable.

The baseline this moves: **38 unassisted control runs produced code 5 times**, with 14 of 19
cases halting in Stage 1 on an empty Code Connect map — in both passes. The remedy the halt
prints, _publish mappings and re-run_, is unactionable for most of the corpus, because those
designs are drawn in other libraries and there is nothing to map.

## Approach

**Replace one halt with a classification, and a judgement with a lookup.**

The empty map is five different situations wearing one symptom: a retrieval failure, a rejected
nested id, a design from another library, an unwritten mapping, and a stale one. Two are our bug,
one is expected, and only two are what the halt message describes. Each has a different owner,
and the diagnosis is cheap — `theme-match` already discriminates the other-library case, the
mapping inventory is in this repository, and a per-node retry is both the test and the fix for
the rest.

Three further positions carry the design:

**Code Connect is the traversal's stopping rule, not a verification step after it.** A resolved
mapping prunes its subtree, which is where the token saving comes from: `get_design_context` on a
mapped node returned `<sl-grid></sl-grid>` for ten thousand nodes, against ~233k tokens to expand
the same node. A failed call therefore costs more than a missing snippet — it loses the stopping
rule. The fallback must fail **open**: descend, and record that it descended because the map was
unreadable rather than because the node was unmapped. Those produce identical markup and mean
opposite things.

**Completeness is a closure, not a ratio.** `get_metadata` also stops at instance boundaries, so
the universe is discovered rather than declared and every descent enlarges it. There is no
denominator. Instead: every node entering the frontier leaves it resolved, captured, descended,
hidden or excluded, and the run is complete when the frontier is empty.

**One change at a time, measured.** v2 introduced exhaustive extraction, an independent verifier,
hard gates and cache discipline — most of what this plan proposes — all at once, and came out
worse than v1 with nothing attributable. Five of its ten recorded issues are _built but never
run_. The difference here is that a baseline and a frozen corpus exist, and the discipline is to
use them between changes rather than after them.

## Scope

**In:** the scripted traversal with Code Connect as its stopping rule; the five-cause
classification with owners; asset capture; the eight boundary checks; the closure check applied
during ingestion; the call ledger and per-run metrics.

**Out:** the common format and the HTML generators — `P-NOJIRA-html-contract`; component
decomposition and implementation, which stay with the agent; growing Code Connect coverage, which
is design system team work this plan only ranks.

## Work breakdown

- `T-NOJIRA-figma-ingestion-01` — Mode decision, cached per file: library membership from
  `list_file_components_for_code_connect`, written to disk and grepped, never read into context
- `T-NOJIRA-figma-ingestion-02` — Scripted traversal with Code Connect as the stopping rule,
  probing per node, **failing open** and recording _why_ it descended — genuinely unmapped, or
  map unreadable. Those produce identical markup and mean opposite things
- `T-NOJIRA-figma-ingestion-03` — Unresolved-node classification: suggestions call, filter out
  internals of resolved instances and pure assets, sort into the five causes with owners.
  `A-NOJIRA-ds-conformance` F3b (attached but **overridden**) and F4 (the similarity layer) are a
  second axis this task must carry or explicitly reject
- `T-NOJIRA-figma-ingestion-04` — **The fourteen-case probe.** Re-run only the cases that halt
  today. A third of the cost of the full control, and it can falsify this plan on its own

**Each task is measured on landing, not batched to the end** — that structure is what made v2's
good ideas indistinguishable from its bad ones:

| After | Measure                                                    | Against                           |
| ----- | ---------------------------------------------------------- | --------------------------------- |
| 01    | does the mode agree with what the traversal then observes? | the 19 designs, no code generated |
| 02    | **the fourteen-case probe.** If none converts, stop        | 14 halts                          |
| 03    | is the cause stable across two passes of one design?       | counts that moved up to threefold |
| 04    | completions **and** recorded conformance                   | 5 of 38                           |

**Deliberately not here:** the ledger, the boundary checks, asset capture and the metrics. They
are instrumentation rather than diagnosis, they are weeks rather than days, and one of them
contains the REST-versus-MCP fork. `P-NOJIRA-ingestion-hardening` owns them and depends on this
plan.

## Risks & dependencies

**The success test is misread as "more runs produce code".** Fourteen low-fidelity ports with
invented content would satisfy that and be worse than halting, because halting at least tells the
truth. The test is _more runs produce code whose conformance is recorded_. Stated here because it
is the one misreading that would make the plan actively harmful.

**This plan has no dependencies, by design.** It measures halts, and a halt needs no fidelity
figure. An earlier draft made it depend on the HTML plan for a number it does not use, which
would have delayed the only slice with a measured baseline to move.

**The ledger under-reports if any agent calls Figma directly.** Discouraging it is not enough;
the second open question asks whether the implementation agents lose the tools outright. Without
that, the ledger is complete by compliance, which is the same failure shape as self-reported cost
— nineteen runs disagreed by two orders of magnitude and one fabricated a figure.

**The MCP surface is undocumented and unversioned.** Six behaviours we depend on were found by
being surprised. 02 is the mitigation and also the detector: a schema over an undocumented format
breaks loudly when the format moves, which is the point rather than a defect.

**A file-level call can cost 545k tokens.** `list_file_components_for_code_connect` returned
2.18 MB on a 153-component file. 03 must treat it as a file-producing call — fetch, grep — and a
run that reads it into context loses its window.

## Acceptance

- Every Figma call in a run appears in the ledger, with its status and attempt. A run's call count
  is derivable without reading a transcript.
- The eight boundary checks run at capture time; a failing capture is recorded as failing rather
  than passed downstream.
- The mode is decided from evidence, cached per file, and recorded with that evidence.
- **No run halts on an empty map in as-is mode.** Strict mode still halts, deliberately — that is
  `A-NOJIRA-ds-conformance` F6, and a halt with a recorded cause is a first-class result rather
  than a failure. Every unresolved node carries a cause and an owner, and the
  blocked-node count is stable between two passes of the same design — the control's moved by up
  to threefold.
- Assets are captured during the fetch and resolve locally; no generated artifact references a
  Figma URL.
- The closure check reports an empty frontier, or names what is still in it.
- The 19 × 2 re-run is compared against 5 of 38 **on completions and on recorded conformance**,
  and the comparison states which of the two moved.

## Approval

**Approved 2026-10-05 by marcin.ludwig.**

The two questions that were open are not closed but **assigned**: the REST-versus-MCP split is
decided in task 02, and whether implementation agents keep the Figma tools in task 01. Both are
decisions the task cannot avoid making, so recording them as plan-level unknowns would only have
delayed the same choice.

Sequencing still binds: everything fidelity-shaped waits on `P-NOJIRA-html-contract` task 07b.
The exception is the 14-case halt probe after task 04, which measures halts and needs no fidelity
figure — it can run as soon as 04 lands, and it can falsify this plan on its own for a third of
the cost of the full re-run.
