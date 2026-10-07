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
updated: 2026-10-07T18:00:00Z
tags: [measurement, baseline, control]
source_plan: P-NOJIRA-figma-ingestion
depends_on: [T-NOJIRA-figma-ingestion-09]
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

### Phase A, resumed after 08 — the mode of all fourteen

Eight files, every verdict from `mode-decision.mjs` rather than from reading the listing, stored
in `runs/probe-04/modes/` with the byte count and sha256 of the listing it rests on.

| Design                          | File        | Mode       | `sl-*` externals | `sl-*` instances | Predicted      | Agrees |
| ------------------------------- | ----------- | ---------- | ---------------: | ---------------: | -------------- | ------ |
| `a1-kampus-subchapter-feed`     | `73YHtIYl…` | **as-is**  |                0 |                0 | converts       | yes    |
| `a11-sesame-learning-materials` | `UBr399hn…` | **as-is**  |                0 |                0 | converts       | yes    |
| `a4-sesame-my-groups`           | `UBr399hn…` | **as-is**  |                0 |               24 | causes A and B | **no** |
| `a6-itsl-collab-shared-folder`  | `Q3gzx1pC…` | **as-is**  |                0 |                0 | converts       | yes    |
| `b-itsl-bookmk-course-files`    | `ya00uFyX…` | **as-is**  |                0 |                0 | converts       | yes    |
| `b-itsl-bookmk-deleted-course`  | `ya00uFyX…` | **as-is**  |                0 |                0 | converts       | yes    |
| `b-itsl-collab-add-element`     | `Q3gzx1pC…` | **as-is**  |                0 |                0 | converts       | yes    |
| `b-itsl-course-course-files`    | `mONnHPTY…` | **as-is**  |                0 |                0 | converts       | yes    |
| `b-kampus-notes-panel`          | `73YHtIYl…` | **as-is**  |                0 |                0 | converts       | yes    |
| `b-sesame-group-details`        | `UBr399hn…` | **as-is**  |                0 |               63 | causes A and B | **no** |
| `a10-etsl-fam-users`            | `S5QgDy8X…` | **strict** |               21 |              122 | causes A and B | yes    |
| `a2-nsp-class-overview`         | `sSrpLCZm…` | **strict** |                4 |              801 | causes A and B | yes    |
| `a5-etsl-metadata-usage-widget` | `S5QgDy8X…` | **strict** |               21 |              109 | causes A and B | yes    |
| `a8-nsp-group-list`             | `4TdMrcnI…` | **strict** |                7 |               72 | causes A and B | yes    |

**Ten as-is, four strict.** So ten of the fourteen have no mapping gap to report to anybody:
their unresolved nodes become cause C, owner nobody.

### The prediction, read for the first time: twelve of fourteen

`T-NOJIRA-figma-ingestion-05` predicted from **instances named `sl-*`**. The mode is decided
from the file's **component dependency graph**. They disagree about `a4-sesame-my-groups` and
`b-sesame-group-details` — 24 and 63 instances named `sl-*` in a file with **zero `sl-*`
externals**, because MySesame names its own local components `sl-*`.

**Naming is not dependency**, and the prediction used the weaker signal. Phase A had already
shown it from the other direction: `2847:14998`, an instance named `sl-button`, returns `{}`
when asked directly, because its `componentId` is `2:48281` — outside the mapped library.

Both halves were measured before either was read against the other.

### What still stops the count — the fourth defect of one shape

`T-NOJIRA-figma-ingestion-08` fixed the nested node whose enclosing instance **answered**. The
case where it **did not** answer is still cause B, owner pipeline, in every mode:

```
as-is → {"B nested-id-rejected": 1, "C another-library": 1}
        byOwner {"nobody": 1, "pipeline": 1}   → exit 6
```

The enclosing instance is already diagnosed — cause C, _another library, reproduce it as-is_ —
and its child carries a second, different story with an owner and a halt attached. Cause B's
remedy is _ask the enclosing instance_; it was asked, and `{}` is what cause C already explains.

In an as-is design, **A and B are the only two causes that can halt**, and A is a genuine
retrieval failure. So this is plausibly the last thing between the ten as-is designs and a
conversion count — but that is a prediction, and it is written here before it is tested.

### Phase A walked — thirteen of fourteen, 2026-10-06 and 2026-10-07

Full evidence, per-design tables and every call record in
[`runs/probe-04/README.md`](../../../runs/probe-04/README.md); 491 stored responses with hashes.

**Ten conversions, and they are exactly the ten as-is designs.** Three strict designs, none.
The split is the mode, with no exception in either direction, and every mode was decided from
the dependency graph before a single walk ran.

|  Exit | Designs                                                                                                                                                                                                                                                                    |
| ----: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **0** | a4-sesame-my-groups, a11-sesame-learning-materials, b-sesame-group-details, a1-kampus-subchapter-feed, b-itsl-bookmk-deleted-course, a6-itsl-collab-shared-folder, b-kampus-notes-panel, b-itsl-course-course-files, b-itsl-collab-add-element, b-itsl-bookmk-course-files |
|     5 | a10-etsl-fam-users (D ×35, E ×1), a8-nsp-group-list (D ×1, E ×5)                                                                                                                                                                                                           |
|     6 | a2-nsp-class-overview (A ×1, D ×1)                                                                                                                                                                                                                                         |

**The thesis, measured.** `a8-nsp-group-list` was reported by `T-NOJIRA-figma-ingestion-03` as
**28 unresolved, every one ours, exit 6** — _"not a single node routed to the design system
team"_. It now reports **6 findings, every one the design system team's, exit 5**.
`a10-etsl-fam-users` reports **35 components with no mapping written** and nothing owned by the
pipeline. One halt message has become three different answers with three different owners.

**837 nested ids** across the walks were accounted for rather than reported — 213 in a1-kampus
alone. Before `T-NOJIRA-figma-ingestion-09` each was a pipeline-owned finding and one is enough
to halt.

### The instrument moves, and the drift is bounded

The walk was interrupted at twelve on 2026-10-06. Before adding a thirteenth from a second day,
both classes of design were re-taken 24 hours apart:

| Re-walked                            |                            Responses changed | Verdict   |
| ------------------------------------ | -------------------------------------------: | --------- |
| `a8-nsp-group-list` (strict)         | **12 of 20** — resolved 5→1, unresolved 6→16 | 5 → **5** |
| `b-itsl-bookmk-course-files` (as-is) |                   **0 of 8**, byte-identical | 0 → **0** |

The split is clean: **every entry pointing at a real path in this repository is byte-identical
after 24 hours; every entry with `source: ""` moved, and those are exactly the ones carrying
snippets.** So Code Connect answers from two populations — the mappings this repository
publishes, which are stable, and snippet-bearing entries with no source, which are what made
designs resolve and are not stable day to day.

An empty map cannot degrade, so an as-is verdict is stable; a strict design lives off the
volatile population, so its numbers move and its verdict does not. **The conversion count is
therefore summable across the two days**, and the per-design statistics are not — each row in
the evidence carries its date.

### The prediction: eleven of thirteen, and both misses are one mistake

`T-NOJIRA-figma-ingestion-05` recorded eight designs by name, dated 2026-10-06 and written
before `T-08` and `T-09` existed — therefore before any design could convert at all. **All
eight are walked and all eight converted.**

Both misses are `b-sesame-group-details` and `a4-sesame-my-groups`: **63 and 24 instances named
`sl-*` in a file with zero `sl-*` externals.** MySesame names its own local components `sl-*`,
and `2142:48182` — an instance named `sl-text_input`, `componentId: 7:35563` — answers `{}` when
asked directly. **Naming is not dependency.** Two misses in one place from one wrong signal says
which input to replace; thirteen hits would not have.

### What remains

- **`a5-etsl-metadata-usage-widget`**, 124 calls, strict. The Dev seat allows **200 Code Connect
  calls a day and 20 a minute**; 172 were spent on 2026-10-07.
- **Phase B is not started.** Conformance, for the ten that converted, through
  `implement-design`. Criterion two of this task is **unmet**, and until it is, ten conversions
  are not success: _fourteen low-fidelity ports with invented content would satisfy a conversion
  count and be worse than halting._
- **Where the snippet-bearing entries come from**, given they are not this repository's
  published templates and do not survive a day, while Dev Mode still shows the component as
  "Connected". That question is bigger than this task and is not answered here.

### Transport, settled

Code Connect is served **per OAuth client**. A personal access token is refused outright; GitHub
Copilot CLI connects, gets metadata and design context in full, and receives **no Code Connect
data at all** — verified against a node whose mapping a human confirmed in Dev Mode the same
day. Figma's own documentation: _"Only clients listed in the Figma MCP Catalog can connect"_,
and registration is _"reach out to your account team"_. See
[`runs/probe-04/client-reachability-2026-10-07.md`](../../../runs/probe-04/client-reachability-2026-10-07.md).
