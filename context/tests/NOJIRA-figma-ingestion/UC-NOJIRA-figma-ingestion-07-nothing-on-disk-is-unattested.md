---
type: use-case
schema_version: 1
id: UC-NOJIRA-figma-ingestion-07
title: Nineteen designs, and no file on disk that nothing attests to
description: 'A capture missing a record is as unverifiable as a capture missing a file, and only one of the two was being checked'
jira: null
resource: null
status: passing
owner: marcin.ludwig
created: 2026-10-06T00:00:00Z
updated: 2026-10-06T07:00:00Z
tags: [figma, capture, provenance, negative-control]
tests_task: T-NOJIRA-figma-ingestion-07
---

# Nineteen designs, and no file on disk that nothing attests to

> Verifies [T-NOJIRA-figma-ingestion-07](../../work/NOJIRA-figma-ingestion/07-nineteenth-design-and-budget.md).

## Preconditions

- `runs/captures/index.json` — the capture index, which must say **19 designs** and
  `unidentified: []`
- `runs/captures/a5-etsl-metadata-usage-widget/manifest.json` — the nineteenth, resolved from
  its own capture: `17214:103584` in `S5QgDy8X9eqhvECPANSZMM`, `rootSource: capture`
- `runs/harness/fixtures/metadata-escaped-envelope.txt` — **a5's own metadata**, kept as a
  fixture by `render-design.mjs` because every quote in it is escaped, so `id="…"` appears
  nowhere in the file
- `runs/2026-10-01-a5-etsl-metadata-usage-widget/captures/index.json` — the one run of nineteen
  whose `rootNodeId` is `null`

## Scenario

| Step | Action                                                     | Expected result                                            |
| ---- | ---------------------------------------------------------- | ---------------------------------------------------------- |
| 1    | Read the capture index                                     | **19 designs**, nothing unidentified                       |
| 2    | Read the nineteenth design's manifest                      | the right file and node, `rootSource: capture`, complete   |
| 3    | Resolve a root from a run whose index records one          | the index wins, `rootSource: index`                        |
| 4    | Resolve a root from a run whose index records none         | the capture answers, `rootSource: capture`                 |
| 5    | Give the resolver an override                              | `source: override`, and the design is captured             |
| 6    | Set a budget below what the design needs                   | the capture stops **before** the call that would exceed it |
| 7    | Re-hash every stored response                              | **108 checked, 0 no longer verbatim**                      |
| 8    | Look for a file on disk that no record names               | none                                                       |
| 9    | Grep `id="…"` in a5's metadata                             | **no match** — and the fallback finds the root anyway      |
| 10   | Resolve from a frame that was fabricated rather than found | `none`, never the fabricated frame's id                    |
| 11   | Carry a record forward for a file that is gone             | dropped, not carried                                       |
| 12   | Resume a run                                               | nothing is cleared; run without resuming                   | the design is cleared first |

Steps 9 through 12 are the negative controls. Step 8 is the check that did not exist while this
task was being written, and is the reason it took as long as it did.

## Edge cases

- **An override is an assertion, not evidence.** It is recorded as `override` so a later reader
  can tell a design the resolver identified from one a person named.
- **A fabricated frame has no id and must never acquire one.** `resolveFrame` returns a
  1440×1024 default when it finds no root; the reader is injectable so this guard can be shown
  holding rather than trusted because of how a neighbouring module happens to behave.
- **A budget is off unless asked for.** Turning one on by surprise would make eighteen complete
  captures incomplete. a2-nsp-class-overview pulls 28 MB in a single call.
- **A non-resuming run starts from nothing.** Otherwise it reads what an earlier run left and
  reports it as its own — which is how fourteen designs came to depend on a `nodes-named.json`
  they did not fetch.

## Result

**Passing**, 2026-10-06. `runs/harness/capture.mjs` modified in place; the harness gate is
**476 tests** and `tsc --noEmit` over seventeen files. **19 mutations, 0 survivors.**

`runs/captures/index.json`: **19 designs, 0 unidentified, 28 323 nodes.** `--verify`: **108
stored responses, 0 no longer verbatim, 0 unattested.**

The task read as "capture one more design" and the fallback that did it is nine lines. What it
surfaced was three ways a file came to sit on disk with nothing attesting to it, and the worst
of them was invisible for a whole task because **`--verify` reported zero failures over 27 fewer
files**. The status was green the entire time. Only the count moved.
