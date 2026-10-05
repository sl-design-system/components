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

**In:** the mode decision; the scripted traversal with Code Connect as its stopping rule; the
five-cause classification with owners; the fourteen-case probe that measures all three.

**Out:** the ledger, the eight boundary checks, asset capture, the closure check and the full
19 × 2 re-run — all `P-NOJIRA-ingestion-hardening`, which is weeks where this is days; the common
format and the HTML generators; component decomposition and implementation, which stay with the
agent; growing Code Connect coverage, which is design system team work this plan only ranks.

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
- `T-NOJIRA-figma-ingestion-05` — **Two reader defects the remote server exposed.** Added after
  03; see Amendment 1. The map may answer about a node's descendants rather than the node, and
  the remote tool's map form carries no snippet — the reader calls both an absence. Both must be
  fixed before anything is measured on them
- `T-NOJIRA-figma-ingestion-04` — **The fourteen-case probe.** Re-run only the cases that halt
  today. A third of the cost of the full control, and it can falsify this plan on its own

**Each task is measured on landing, not batched to the end** — that structure is what made v2's
good ideas indistinguishable from its bad ones:

| After | Measure                                                    | Against                           |
| ----- | ---------------------------------------------------------- | --------------------------------- |
| 01    | does the mode agree with what the traversal then observes? | the 19 designs, no code generated |
| 02    | **the fourteen-case probe.** If none converts, stop        | 14 halts                          |
| 05    | `334:20594` stops being reported as unmapped               | the live walk, before the fix     |
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

- The mode is decided from evidence, cached per file, and recorded with that evidence.
- **No run halts on an empty map in as-is mode.** Strict mode still halts, deliberately — that is
  `A-NOJIRA-ds-conformance` F6, and a halt with a recorded cause is a first-class result rather
  than a failure.
- Every unresolved node carries a cause and an owner, and the **blocked-node count is stable
  between two passes of the same design** — the control's moved by up to threefold.
- A descent records _why_ it descended: genuinely unmapped, or map unreadable.
- **The fourteen-case probe reports how many of the fourteen converted.** If none did, the plan
  has falsified its own diagnosis and says so.

Everything else this plan used to assert — ledger completeness, the eight checks, assets
resolving locally, an empty closure frontier, the 19 × 2 comparison — now belongs to
`P-NOJIRA-ingestion-hardening` and was removed when the plans were re-cut by executable unit.

## Approval

**Approved 2026-10-05 by marcin.ludwig.**

The two questions that were open are not closed but **assigned**: the REST-versus-MCP split is
decided in task 02, and whether implementation agents keep the Figma tools in task 01. Both are
decisions the task cannot avoid making, so recording them as plan-level unknowns would only have
delayed the same choice.

**This plan depends on nothing and can start today.** An earlier draft made it wait on a
fidelity figure it does not use — it measures halts — which would have delayed the only slice
with a measured baseline to move. Its last task is the fourteen-case probe, a third of the cost
of the full control, and it can falsify the plan on its own.

### Amendment 1 — 2026-10-06, after approval

Recorded because an approved plan that changes quietly is worse than one that was never approved.

**What changed.** One task added, `T-NOJIRA-figma-ingestion-05`, between 03 and 04. Probing the
**remote** Figma server on 2026-10-06 — which is where 04 must run, and which 01 to 03 were not
exercised against — exposed two defects in the reader this plan delivered, both turning a
successful answer into an absence:

- `get_code_connect_map(334:20594)` returns entries for `334:20605`, `334:20610` and `334:20609`
  — nodes **inside** the instance — and nothing for the instance itself. `classifyMap` looks up
  one id, finds nothing, and files `genuinely-unmapped`.
- Those entries carry `hasTemplate: true` with **no `snippet`**, which is the remote tool's
  documented map form. `classifyMap` refuses it as a contradiction.

Together they would route cause E to the design system team about an instance whose internals the
map had just resolved. 04 is a measurement and both instruments are wrong, so it waits.

Two further observations from the same probe, carried into 05 rather than left loose: the remote
server appends `Note: the Code Connect lookup timed out` to a `{}` and the Dev Mode server does
not, and the ~31 s per-call plateau recorded in 02 is a **Dev Mode property** — the remote
answers in seconds, which removes the cost objection to running 04 over fourteen designs.

**What did not change.** The goal, the approach, the five causes, the mode decision, the
stopping rule, and the acceptance criteria. 05 repairs two readers; it adds no capability and
moves no boundary. The dependency chain is unchanged except that 04 now waits on 05.

**Judgement to be aware of.** 05 could have been folded into 04 as a first step. It is separate
because 04's output is a number this plan is judged on, and a measurement task that quietly
repairs its own instruments produces a figure nobody can date. Reverting costs one task boundary
and the ability to say when the instruments became trustworthy.

- Amended by: marcin.ludwig
- Amendment approved: 2026-10-06
