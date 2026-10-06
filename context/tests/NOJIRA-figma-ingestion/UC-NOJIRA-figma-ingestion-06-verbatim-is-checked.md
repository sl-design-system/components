---
type: use-case
schema_version: 1
id: UC-NOJIRA-figma-ingestion-06
title: What Figma returned is on disk, and that it is unaltered is checked rather than assumed
description: 'A capture whose bytes nobody re-hashed is a summary nobody noticed; five closure checks and a deletion control say which one this is'
jira: null
resource: null
status: passing
owner: marcin.ludwig
created: 2026-10-06T00:00:00Z
updated: 2026-10-06T03:30:00Z
tags: [figma, capture, provenance, negative-control]
tests_task: T-NOJIRA-figma-ingestion-06
---

# What Figma returned is on disk, and that it is unaltered is checked rather than assumed

> Verifies [T-NOJIRA-figma-ingestion-06](../../work/NOJIRA-figma-ingestion/06-verbatim-capture.md).

## Preconditions

- `runs/captures/a8-nsp-group-list/rest/nodes-334-20573.json` — what `api.figma.com` returned for
  a8's frame, byte for byte: **620 nodes**, 504 of them carrying the `;` ids the MCP tools emit
  and then refuse, 252 with `componentId` and `overrides`, 620 with a bounding box
- `runs/captures/a8-nsp-group-list/manifest.json` — the call records, each with URL, status,
  elapsed time, byte count and sha256, and the five checks
- `runs/2026-10-01-a8-nsp-group-list/captures/metadata/334-20573.txt` — the corpus's own
  `get_metadata` capture of the same frame: **98 ids**
- `runs/2026-10-01-a8-nsp-group-list/captures/design-context/` — three `get_design_context`
  captures of the same frame: **176 ids**, 110 of them nested
- `runs/captures/index.json` — all eighteen designs, and the one that cannot be identified

No fixture here was authored. The transport's own tests run against a stub HTTP server on
`127.0.0.1` and reach no network.

## Scenario

| Step | Action                                                         | Expected result                                                              |
| ---- | -------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 1    | Read the stored capture of a8's frame                          | **620 nodes**, against the **98** `get_metadata` reported for the same frame |
| 2    | Read the file's identity out of it                             | `name`, `lastModified` and a real `version` — never `unknown`                |
| 3    | Reconcile REST, `get_metadata` and `get_design_context`        | every MCP id is held; **412 nodes only REST saw**                            |
| 4    | Run the five closure checks over each of the eighteen captures | all green; `complete: true`                                                  |
| 5    | Re-capture two designs into a separate tree and diff           | **5 records each, every hash identical**, the render included                |
| 6    | Re-hash all 103 stored responses against their records         | **0 no longer verbatim**                                                     |
| 7    | Delete `334:20578` — 468 of a8's 620 nodes — and re-check      | checks **1, 3 and 4 go red**                                                 |
| 8    | Delete `334:20585` — an interior frame of **220 nodes**        | checks 1 and 3 go red; **check 4 does not move at all**                      |
| 9    | Hand the transport an id containing a comma, or no ids         | refused at the boundary, before a request is made                            |
| 10   | Hand the reader a `403` body, or prose                         | refused; it does not become an empty design                                  |
| 11   | Hand `designContextIds` the tool's own preamble                | **no ids** — `data-node-id="1:2"` there is documentation                     |
| 12   | Hand `verifyStored` a reformatted file                         | red, naming the file and both hashes                                         |
| 13   | Capture a run whose root node no link names                    | `unidentified` with the reason, and **exit 5**                               |

Steps 7 through 13 are the negative controls. Step 8 is not a control that passes — it is the
bound on step 7, and it is in the scenario so that three reds are never read as four.

## Edge cases

- **`null` is an answer.** REST returns `nodes: { "123:456": null }` for an id a file does not
  hold. Two corpus runs contain a `123-456.txt` — a prose probe log an agent named after the
  server's own error template — and this is what settles it rather than a guess about filenames.
- **An omitted `visible` means visible.** 121 of a8's 620 nodes carry `visible: false`; the other
  499 carry no such key. Reading absence as hidden would hide the design.
- **A box outside the frame is normal.** a1-kampus has **920**, because its root frame clips a
  list that runs past the bottom. The number is reported; it is not a fault.
- **The render URL expires.** `/v1/images` answers with a short-lived S3 URL, so the raster is
  downloaded in the same run or the capture holds a future 404.
- **A call record is committed.** The token therefore travels only in `X-Figma-Token`, never in a
  URL, and the record's key set is asserted closed so a later edit cannot add a field that
  carries a response body out.

## Result

**Passing**, 2026-10-06. `runs/harness/rest.mjs` and `runs/harness/capture.mjs`, 64 tests; the
harness gate is **431 tests** and `tsc --noEmit` over seventeen files. **32 mutations, 0
survivors.**

| Step | Outcome                                                                                   |
| ---- | ----------------------------------------------------------------------------------------- |
| 1    | 620 against 98 — **one node in six** was what the corpus held                             |
| 2    | 18 of 18 identified; `version: 2402425610621681042`, `lastModified: 2026-09-23T14:00:01Z` |
| 3    | `onlyMetadata` **0** and `onlyDesignContext` **0** on all eighteen — after a second pass  |
| 4    | 26 466 nodes, 103 responses, 67 MB; every check green                                     |
| 5    | byte-identical, including the PNG                                                         |
| 6    | 103 checked, 0 altered                                                                    |
| 7    | red, red, red: `claimedButAbsent`, `onlyMetadata`, coverage 0.851 → 0.148                 |
| 8    | red, red, **0.851 → 0.851**                                                               |
| 9-13 | each refuses, and the mutation driver confirms each refusal is load-bearing               |

**Step 3 did not pass on the first attempt and was not made to.** The first pass left 163 ids
`get_design_context` named and the capture did not hold. The capture now asks REST for them: all
49 of a2's resolved as `COMPONENT` definitions on another page of the same file. Converging is
the result; classifying by heuristic would have been the fault.

**Step 6 is in this list because it failed in production within minutes of being written.** The
pre-commit formatter pretty-printed **71 of 71** stored JSON captures on their first commit.
Nothing about the files looked wrong. Only the hashes did.
