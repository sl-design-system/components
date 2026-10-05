---
type: plan
schema_version: 1
id: P-NOJIRA-figma-ingestion
title: Ingestion quality — knowing what came out of Figma, and whether it came out whole
description: Turn the Figma fetch into a scripted, instrumented, verifiable step — Code Connect as the traversal's stopping rule, the empty map classified into five causes with owners, assets captured before their URLs expire, boundary checks at the schema edge, and a ledger that makes the cost and flakiness of every call countable
jira: null
resource: null
status: proposed
phase: conceptual
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T00:00:00Z
tags: [figma, design-to-code, ingestion, determinism, instrumentation]
source_analysis: A-NOJIRA-ds-conformance
slice: ingestion-quality
depends_on: [P-NOJIRA-html-contract]
approved_by: null
approved_date: null
open_questions:
  - Structure from the documented REST API and semantics from the undocumented MCP server, or everything from MCP? The MCP surface has produced six undocumented behaviours, four of which cost a run.
  - Do the implementation agents lose the Figma tools outright? It is what makes the ledger complete by construction rather than by compliance, and it is a constraint on every future skill.
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

- `T-NOJIRA-figma-ingestion-01` — The call wrapper and the append-only ledger: call, node,
  duration, bytes, status, attempt, whether a retry rescued it, cache hit
- `T-NOJIRA-figma-ingestion-02` — Boundary validation: the eight checks, at capture time, without
  transforming the stored bytes
- `T-NOJIRA-figma-ingestion-03` — Mode decision, cached per file: library membership from
  `list_file_components_for_code_connect`, written to disk and grepped, never read into context
- `T-NOJIRA-figma-ingestion-04` — Scripted traversal with Code Connect as the stopping rule,
  probing per node, failing open and recording why it descended
- `T-NOJIRA-figma-ingestion-05` — Unresolved-node classification: suggestions call, filter out
  internals of resolved instances and pure assets, sort into the five causes with owners
- `T-NOJIRA-figma-ingestion-06` — Asset capture during the fetch, after mapping resolution, with
  the cap-of-20 signal treated as "probably more"
- `T-NOJIRA-figma-ingestion-07` — Closure check during ingestion, emitting the census
- `T-NOJIRA-figma-ingestion-08` — Per-run metrics derived from the ledger, and cross-run analysis
  over the corpus
- `T-NOJIRA-figma-ingestion-09` — Re-run the 19 × 2 control and compare against 5 of 38

**01 and 02 come first and are not negotiable**, because every later claim in this plan is a
measurement, and an unmeasured change here is how v2 happened.

### The review caught this plan committing v2's mistake

As first written, tasks 03 to 08 all changed ingestion and task 09 measured once at the end —
**eight changes, one measurement**, which is precisely the structure that made v2's good ideas
indistinguishable from its bad ones. The plan preached incremental measurement and did not
practise it.

Corrected: **each behaviour-changing task is measured on landing**, and the cheap probe comes
before the expensive one.

| After             | Measure                                                    | Against                                                                                 |
| ----------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 03 mode decision  | does the mode agree with what the traversal then observes? | the 19 designs, no code generated                                                       |
| 04 stopping rule  | **re-run only the 14 cases that halted**                   | 14 halts. If none converts, stop — the diagnosis is wrong and 24 further runs are saved |
| 05 classification | is the cause stable across two passes of one design?       | the control's blocked-node counts, which moved up to threefold                          |
| 06 assets         | do generated artifacts still reference Figma URLs?         | the batch's 404s                                                                        |
| 09 full re-run    | completions **and** recorded conformance                   | 5 of 38                                                                                 |

The 14-case probe after 04 is the one that matters: it is a third of the cost of 09 and it can
falsify the plan's central claim on its own.

**04 before 05**, because the classification needs the resolved set to filter against. **06 after
04**, because an icon that maps to `sl-icon` is a component and downloading it as a raster
converts a mapped component into a picture.

## Risks & dependencies

**The success test is misread as "more runs produce code".** Fourteen low-fidelity ports with
invented content would satisfy that and be worse than halting, because halting at least tells the
truth. The test is _more runs produce code whose conformance is recorded_. Stated here because it
is the one misreading that would make the plan actively harmful.

**Nothing to measure against until `P-NOJIRA-html-contract` lands.** 09 compares against a
baseline of completion counts, which exists — but a change to ingestion should also move fidelity,
and there is no comparable fidelity figure until that plan's task 07b. Hence the dependency. The
14-case probe after 04 is the exception: it measures halts, which need no fidelity figure, so it
can run earlier than the rest.

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
- No run halts on an empty map. Every unresolved node carries a cause and an owner, and the
  blocked-node count is stable between two passes of the same design — the control's moved by up
  to threefold.
- Assets are captured during the fetch and resolve locally; no generated artifact references a
  Figma URL.
- The closure check reports an empty frontier, or names what is still in it.
- The 19 × 2 re-run is compared against 5 of 38 **on completions and on recorded conformance**,
  and the comparison states which of the two moved.

## Approval

Not approved. Depends on `P-NOJIRA-html-contract` reaching its task 07, and on the two open
questions in the frontmatter — the REST-versus-MCP split, and whether implementation agents keep
the Figma tools.
