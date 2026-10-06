---
type: task
schema_version: 1
id: T-NOJIRA-figma-ingestion-04
title: The fourteen-case probe
description: 'Re-run only the cases that halt today — a third of the cost of the control, and it can falsify the plan on its own'
jira: null
resource: null
status: todo
independent: false
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-06T08:00:00Z
tags: [measurement, baseline, control]
source_plan: P-NOJIRA-figma-ingestion
depends_on: [T-NOJIRA-figma-ingestion-05]
---

# The fourteen-case probe

## Objective

The measured baseline is **5 of 38**, with 14 of 19 cases halting on one branch in both passes.
Re-run only those fourteen.

**If none converts, stop.** The diagnosis is wrong and the remaining twenty-four runs are saved.

## Steps

1. Re-run the fourteen halting cases with tasks 01–03 and 05 in place.
2. Record, per case: did it halt, and if not, what did it produce.
3. Record the conformance figures — mapped, inferred, invented — for anything that produced
   output.
4. **Store every Code Connect response verbatim, with its hash** — the call, its arguments, the
   server that answered, the elapsed time, the byte count and a sha256, in the record shape
   `runs/harness/capture.mjs` already writes. See below for why this task is the only place it
   can be done.

### Why step 4 is here, added 2026-10-06 after T-05

`T-NOJIRA-figma-ingestion-05` fixed two defects in the Code Connect reader, both turning a
successful answer into an absence. Three measurements taken after it landed say its evidence is
thinner than its effect:

| Measured                                                                             | Result                                                                      |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| every recorded Code Connect capture in the corpus, 21 files and 39 entries           | **neither shape occurs** — 0 snippetless, 0 descendants-only                |
| the old reader against the new, replayed over 18 runs and 2 405 nodes                | **0 walks differ.** The fix is inert on everything on disk                  |
| instances in the REST captures with a `componentId`-bearing node strictly below them | **5 086 of 10 187, 49%** — the structure where the descendant case can bite |

So the fix touches half the corpus's instances by structure and is unfalsifiable by any data we
hold. **Its two fixtures are reconstructions of one probe**, not captured bytes, and they say so
in a `_provenance` key. The shapes live only on the remote server, which a personal access token
cannot reach — and this task is the only work that must run there anyway.

If fourteen designs produce neither shape, that is a result too: it means the 2026-10-06 probe
caught something rarer than assumed, and both fixtures must be relabelled rather than trusted.

**No plan amendment accompanies this.** The goal, the approach, the fourteen cases and the halt
policy are unchanged; one step and one criterion were added to a `todo` task because a
measurement said its instruments needed their own evidence.

## Acceptance criteria

- The number of the fourteen that converted is reported.
- **Every Code Connect response this probe saw is on disk, verbatim, with its hash** and the
  endpoint that produced it — no response is summarised, and a run that captured none says so
  rather than looking like a run that met none.
- `runs/harness/fixtures/code-connect-descendants.json` and `code-connect-snippetless.json` are
  **either replaced by captured bytes or relabelled** as shapes fourteen designs did not
  reproduce. Leaving a reconstruction in place unremarked after the evidence was available is
  the one outcome this criterion forbids.
- **Conformance is recorded for every converted case.** More runs producing code is _not_ the
  success test: fourteen low-fidelity ports with invented content would satisfy it and be worse
  than halting, because halting at least tells the truth.
- A case that still halts carries a cause and an owner.

## Verification

Compare against the control report in `runs/control/_reports-2026-10-04/`; the same fourteen cases, the same two passes.

Then re-run the replay that found the fix inert — the old reader against the new over the
captured responses. **It must now differ**, on at least the nodes whose maps answered about a
subtree, or the two defects were fixed against shapes the server does not send.

### The prediction, now complete

`T-NOJIRA-figma-ingestion-05` recorded it on 2026-10-06 with one design unmeasured, because a5
had not been captured. `T-NOJIRA-figma-ingestion-07` captured it: **745 instances, 109 of them
`sl-*` across 8 distinct names.** a5 is not a zero-`sl` design, so it falls on the other side.

|                          |                                                                                                                                     Designs | Predicted                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------: | ---------------------------- |
| zero `sl-*` instances    | **8** — a1, a11, a6, b-itsl-bookmk-course-files, b-itsl-bookmk-deleted, b-itsl-collab-add, b-itsl-course-course-files, b-kampus-notes-panel | convert under as-is, cause C |
| `sl-*` instances present |                                                    **6** — a4 (24), b-sesame-group-details (63), a8 (72), **a5 (109)**, a10 (122), a2 (801) | causes A and B, not D or E   |

Eight and six, and nothing unmeasured. 05 predicted nine and five from the MCP metadata; the
REST captures say eight and six. **That correction was made before this probe ran, not after
it**, which is the only thing that makes the prediction worth having.

**What falsifies the plan:** any of the eight halting again under as-is, or any of the six
resolving to cause D or E. A conversion count below eight is the signal to stop.
