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
updated: 2026-10-06T10:00:00Z
tags: [measurement, baseline, control]
source_plan: P-NOJIRA-figma-ingestion
depends_on: [T-NOJIRA-figma-ingestion-08]
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

### The fourteen, with everything needed to reach them

The Code Connect halts of pass 2 in `runs/control/_reports-2026-10-04/FULL-SUMMARY.md`. Keys and
root nodes are from `runs/captures/index.json`, which `T-NOJIRA-figma-ingestion-07` completed to
nineteen of nineteen. `sl-*` is the count of instance names beginning `sl-` in the REST capture —
a better denominator than MCP metadata, which stops at instance boundaries.

|   # | Design                          | File key                 | Root node      | `sl-*` | Predicted                     |
| --: | ------------------------------- | ------------------------ | -------------- | -----: | ----------------------------- |
|  11 | `a1-kampus-subchapter-feed`     | `73YHtIYl0UHXH8ST4J7VKI` | `5311:37116`   |      0 | **converts** — as-is, cause C |
|   9 | `a11-sesame-learning-materials` | `UBr399hnydpNF9P5Jb2vfx` | `116:19049`    |      0 | **converts** — as-is, cause C |
|  10 | `a6-itsl-collab-shared-folder`  | `Q3gzx1pCseyKnFNDUOOjCw` | `4200:13792`   |      0 | **converts** — as-is, cause C |
|  16 | `b-itsl-bookmk-course-files`    | `ya00uFyX1rjxYWF0dlOsoT` | `4886:12955`   |      0 | **converts** — as-is, cause C |
|  14 | `b-itsl-bookmk-deleted-course`  | `ya00uFyX1rjxYWF0dlOsoT` | `4549:8339`    |      0 | **converts** — as-is, cause C |
|  15 | `b-itsl-collab-add-element`     | `Q3gzx1pCseyKnFNDUOOjCw` | `5006:43051`   |      0 | **converts** — as-is, cause C |
|   1 | `b-itsl-course-course-files`    | `mONnHPTYNNaBwV3cFUHIYv` | `4007:3161`    |      0 | **converts** — as-is, cause C |
|  19 | `b-kampus-notes-panel`          | `73YHtIYl0UHXH8ST4J7VKI` | `5308:32158`   |      0 | **converts** — as-is, cause C |
|  17 | `a4-sesame-my-groups`           | `UBr399hnydpNF9P5Jb2vfx` | `2847:14994`   |     24 | causes A and B                |
|  12 | `b-sesame-group-details`        | `UBr399hnydpNF9P5Jb2vfx` | `2142:48093`   |     63 | causes A and B                |
|   5 | `a8-nsp-group-list`             | `4TdMrcnIVOn3Hrfj2OpVZU` | `334:20573`    |     72 | causes A and B                |
|  18 | `a5-etsl-metadata-usage-widget` | `S5QgDy8X9eqhvECPANSZMM` | `17214:103584` |    109 | causes A and B                |
|   7 | `a10-etsl-fam-users`            | `S5QgDy8X9eqhvECPANSZMM` | `17264:29098`  |    122 | causes A and B                |
|   6 | `a2-nsp-class-overview`         | `sSrpLCZm302ces3khoBGls` | `2422:87039`   |    801 | causes A and B                |

**Eight and six, nothing unmeasured.** `T-NOJIRA-figma-ingestion-05` predicted nine and five from
the MCP metadata; the REST captures say eight and six, and a5 — unmeasured when 05 wrote the
prediction — turns out to hold **109** `sl-*` instances, so it falls on the second side. That
correction was made **before this probe ran**, which is the only thing that makes a prediction
worth having.

**What falsifies the plan:** any of the eight halting again under as-is, or any of the six
resolving to cause D or E. A conversion count below eight is the signal to stop.

## How to reach Code Connect, which is the thing that was blocking

| Transport                                          | Verdict                                                                                                                                                                                         |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `runs/harness/capture.mjs` with `FIGMA_READ_TOKEN` | **cannot.** `mcp.figma.com` answers a `figd_` token with 401 whatever its scopes                                                                                                                |
| The Dev Mode server, `http://127.0.0.1:3845/mcp`   | reachable with no auth, but **only for the file the editor has as its active tab**, it answers every valid node `{}` after ~31 s, and **it does not send either shape this task must exercise** |
| **This session's `mcp__figma__*` tools**           | **yes.** `get_code_connect_map(fileKey, nodeId)` against the remote server, OAuth already held by the editor connection                                                                         |

Measured 2026-10-06 against `4TdMrcnIVOn3Hrfj2OpVZU` through those tools: three calls, each
answering in well under a second. **The ~31 s plateau recorded in `T-NOJIRA-figma-ingestion-02`
is a Dev Mode property**, so the cost objection to probing fourteen designs is gone.

The tool takes `fileKey` **and** `nodeId`, which the Dev Mode tool does not — so every call in
this task names the file it is asking about, and the halt that ends it cannot be about the wrong
design.

## Two phases, and the first can stop the plan on its own

The Objective says _"if none converts, stop … the remaining twenty-four runs are saved"_. That
implies a split which was never written down, so here it is:

**Phase A — does it still halt?** Traversal plus classification on each of the fourteen, through
`runs/harness/traverse.mjs` and `runs/harness/classify-unresolved.mjs`, with the Code Connect
answers coming from this session's MCP tools. **No code is generated.** This is minutes per
design, and it answers the question the plan rests on: how many of the fourteen no longer halt.

**If none converts, stop here.** Phase B is not run, the diagnosis is wrong, and the plan's own
halt policy applies.

**Phase B — is what it produced any good?** Only for the cases Phase A converted: a full
`implement-design` run, to get the conformance figures. The control took between 1.5 minutes and
2 h 31 per case, so this is the expensive half and it must not be entered on a Phase A that
failed. Acceptance criterion two exists precisely to stop more-runs-producing-code being read as
success.

Phase A is also what the Verification's replay needs: the captured responses come from it.

## The fixtures are captures now, not reconstructions

Done 2026-10-06, before this task runs, so its instruments rest on bytes rather than on a
transcription:

- `runs/harness/fixtures/code-connect-descendants.json` — `get_code_connect_map(334:20594)`
- `runs/harness/fixtures/code-connect-snippetless.json` — `get_code_connect_map(334:20605)`
- `runs/harness/fixtures/code-connect-remote-snippet.json` — `get_code_connect_map(334:20593)`,
  the one that **does** carry a snippet
- `runs/harness/fixtures/code-connect-remote.provenance.md` — the calls, byte counts and hashes,
  kept outside the files so the files stay byte-exact

**What the captures changed.** The reconstruction they replaced gave every entry a GitHub URL as
`source` and the Figma layer names as `componentName`. The server sends `source: ""` on four of
five entries and `componentName` on one. The shapes were right; the fields were invented.

**And one claim in `T-NOJIRA-figma-ingestion-05` is falsified by them.** That task says _"the
snippet arrives only when the exact node is asked for."_ `334:20605` was asked for exactly and
came back with no snippet; `334:20593` asked the same way came back with one. Whether an entry
carries a snippet is a property of the entry, not of the request. 05 is `done` and is not
edited; this is the correction.

So acceptance criterion three is **already half met**: the two fixtures are captured bytes. What
remains is the other half — if fourteen designs produce neither shape in the wild, say so, because
three calls against one node is not a frequency.

## Verification

Compare against the control report in `runs/control/_reports-2026-10-04/`; the same fourteen cases, the same two passes.

Then re-run the replay that found the fix inert — the old reader against the new over the
captured responses. **It must now differ**, on at least the nodes whose maps answered about a
subtree, or the two defects were fixed against shapes the server does not send.

## Phase A, run 2026-10-06 and not finished

The evidence is in `runs/probe-04/` — **29 Code Connect responses, verbatim, with hashes** —
and summarised in its README. The claim was released unfinished because Phase A found an
instrument defect, which is what Phase A is for.

### What it established

**All fourteen roots answer `{}`.** Thirteen bare, one — a2 — with the server's own
`Note: the Code Connect lookup timed out`.

**Three of those empty roots are false.** Asked one level down:

| Design                        | Below the root                                                | The root's `{}` |
| ----------------------------- | ------------------------------------------------------------- | --------------- |
| a8-nsp-group-list             | `334:20578` → **14 entries, 5 snippets**                      | false           |
| a10-etsl-fam-users            | `17264:29106` → **6 entries, 5 snippets**                     | false           |
| a5-etsl-metadata-usage-widget | `17214:103593` → **10 entries, 5 snippets**                   | false           |
| a4-sesame-my-groups           | `{}`, and the `sl-button` instance asked directly is `{}` too | **true**        |
| b-sesame-group-details        | `{}`                                                          | true so far     |
| a2-nsp-class-overview         | `{}` with the timeout note again                              | a timeout       |

Thirty mapped nodes and fifteen snippets hidden behind three empty roots. Sesame's is real —
`sl-button` carries `componentId: 2:48281`, outside the mapped library. **One halt message, at
least three situations**, which is this plan's thesis measured.

**The scope is not a node count.** 468 nodes answer fourteen entries; 620 answer nothing, twice,
in both id spellings. Asking at the node in the design's URL is the one way to get nothing — and
that is the node an agent is handed.

**One mode decided end to end.** `b-itsl-course-course-files` → `as-is`, _"no sl-\* externals;
depends on .Main menu, .Navigation item, Cell"_. Cause C. It converts. One of the predicted
eight, confirmed through `mode-decision.mjs` rather than by reading the components.

### What stopped it

`classify` files **every** nested node as cause B, owner pipeline, including the two inside an
`sl-avatar` that resolved with a snippet — and the CLI exits non-zero on any pipeline-owned
node. No design can convert through that. `T-NOJIRA-figma-ingestion-08` fixes it, and this task
now depends on it.

### What remains when it resumes

- eight mode decisions, one per remaining file, through `list_file_components_for_code_connect`
- Phase A per design with 08 in place, for the conversion count
- Phase B, conformance, **only** for whatever Phase A converted

**Nothing here has been read against the prediction.** Eight and six is still unexamined, and
should stay that way until Phase A produces a count.
