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
updated: 2026-10-06T00:00:00Z
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
- `T-NOJIRA-figma-ingestion-06` — **Capture what Figma actually returns, by script.** Added
  after 03; see Amendment 2. Three runs of nineteen carry verbatim captures and Code Connect is
  the tool's own output in eight; every plan in this slice rests on agents' summaries of the data
- `T-NOJIRA-figma-ingestion-07` — **The nineteenth design, and the budget the capture does not
  have.** Added after 06; see Amendment 3. a5 was reported unidentifiable while its root node id
  sat in its own capture and a link in this repository named it
- `T-NOJIRA-figma-ingestion-08` — **A node inside a resolved instance is not unresolved.** Added
  after 04's Phase A; see Amendment 4. The third reader defect of the same family, and the one
  that decides whether any of the fourteen can convert
- `T-NOJIRA-figma-ingestion-09` — **A nested node is never its own finding.** Added after 04's
  Phase A resumed; see Amendment 5. The fourth defect of one shape, and the last thing between
  the ten as-is designs and a conversion count
- `T-NOJIRA-figma-ingestion-04` — **The fourteen-case probe.** Re-run only the cases that halt
  today. A third of the cost of the full control, and it can falsify this plan on its own

**Each task is measured on landing, not batched to the end** — that structure is what made v2's
good ideas indistinguishable from its bad ones:

| After | Measure                                                    | Against                           |
| ----- | ---------------------------------------------------------- | --------------------------------- |
| 01    | does the mode agree with what the traversal then observes? | the 19 designs, no code generated |
| 02    | **the fourteen-case probe.** If none converts, stop        | 14 halts                          |
| 05    | `334:20594` stops being reported as unmapped               | the live walk, before the fix     |
| 06    | runs whose captures are verbatim and hashed                | **3 of 19**                       |
| 07    | designs captured, and unidentified                         | **18 of 19**, one unidentified    |
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

### Amendment 2 — 2026-10-06, after approval

**What changed.** A second task added, `T-NOJIRA-figma-ingestion-06`, after 05 and before 04.

The corpus is not what this plan assumed it was. The `implement-design` skill instructs its
analyst to persist every Figma call _"preserving the response verbatim"_; measured across all
nineteen runs, `figma-code-connect-map.json` is the tool's own output in **8 cases**, hand-authored
in 8 and absent in 3, and **3 runs of 19** have metadata, Code Connect and design context all
verbatim. The rest carry `_note`, `probe_method` and `_per_node_probes` — agents describing what
they saw instead of recording what they received.

Code Connect is the single source this whole slice rests on, so that is the ground under tasks
01 to 05. It is also the ground under `A-NOJIRA-figma-metadata-contract`, which is still `draft`
and was derived from these captures.

Three probes on 2026-10-06 decided the shape of the remedy:

- **A script can reach the remote server.** `Authorization: Bearer figd_…` answers _"figd\_ tokens
  must be passed via X-Figma-Token header"_, so a personal access token is a supported scheme and
  no OAuth dance is needed. Which tools a token unlocks is 06's first step.
- **`download_assets` exists, works, and no run has ever called it.** It returns an export, raw
  images and SVGs, reports its own truncation at a cap of 20 each, and all three URL classes
  downloaded successfully. `A-NOJIRA-figma-metadata-contract` F16 — _0 bytes saved, URLs 404
  immediately_ — is at least partly an artefact of nobody calling the tool that serves them.
- **Half of F14's raster distortion is a default.** `get_screenshot` clamps to
  `maxDimension: 1024`; a8's 1280×1024 frame is stored as 1024×820, which is that clamp exactly.
  `download_assets.export` returned the same node at native size.

**What did not change.** The goal, the approach, the five causes, the stopping rule, the halt
policy and the acceptance criteria. 06 produces data; it decides nothing this plan already
decided, and the fourteen-case probe generates its own data either way.

**Judgement to be aware of.** 06 is not needed by 04 and could have been deferred to its own
plan. It sits here because this plan already owns the Figma calls and the traversal, and because
leaving 04 to run while the corpus underneath it is 3-of-19 verbatim means the next person to
question a figure has to do this work anyway, with less context. Reverting costs one task; the
measurement stands either way.

- Amended by: marcin.ludwig
- Amendment approved: 2026-10-06

### Amendment 3 — 2026-10-06, after approval

**What changed.** A third task added, `T-NOJIRA-figma-ingestion-07`, after 06 and before 04.

`T-NOJIRA-figma-ingestion-06` captured 18 of 19 designs and reported the nineteenth,
a5-etsl-metadata-usage-widget, as unidentifiable. **It was identifiable.** Its root node id sits
in its own metadata capture, `<frame id="17214:103584" name="Metadata usage widget">`, and a link
already in this repository names that node in a file the token reaches with a 200. The resolver
pairs a run with a file only through the `rootNodeId` recorded in `captures/index.json`, and a5
is the one run of nineteen where that field is `null`.

This matters beyond one design. 06's Result offered a5 as F10 — _Figma does not identify the
design, the operator does_ — arriving in operational form. It is not that. The operator did
record it; the reader did not look. **The corpus's only genuine identity gap was a reader
defect**, and the contract finding it was offered as evidence for stands on one fewer case.

The same task carries a second omission, named rather than left: step 8 of 06 asked for a
per-design call and byte budget and it was not delivered, so 06's criterion _"a design that could
not be captured whole says so, with which budget or cap stopped it"_ passes vacuously.
a2-nsp-class-overview pulled 28 MB in one call with nothing able to stop it.

**A correction to Amendment 2, which is left standing as written.** That amendment records
_"a personal access token is a supported scheme and no OAuth dance is needed"_. It is not: with a
real token `mcp.figma.com` answers **401** whatever the token's scopes, and only `api.figma.com`
answers 200. 06 was rebuilt REST-first on that measurement before it ran. The amendment is a
record of what was believed on the day and is not rewritten; this is where it is corrected.

**What did not change.** The goal, the approach, the five causes, the stopping rule, the halt
policy and the acceptance criteria. 07 fixes a reader and adds a budget; it decides nothing this
plan already decided, and 04 does not depend on it.

**Judgement to be aware of.** 07 could be skipped: eighteen designs is enough corpus for 04, and
a5 is one of the fourteen halts only by name. It is here because the write-up of 06 put a wrong
sentence into the record — that a design could not be counted — and the cheapest moment to
correct a wrong sentence is before anything is built on it.

- Amended by: marcin.ludwig
- Amendment approved: 2026-10-06

### Amendment 4 — 2026-10-06, after approval

**What changed.** A fourth task added, `T-NOJIRA-figma-ingestion-08`, after 05 and before 04.
`T-NOJIRA-figma-ingestion-04` is claimed, its Phase A has run, and the claim is released
unfinished because Phase A found an instrument defect — which is what Phase A is for.

**Phase A's result, which stands whatever happens to the count.** All fourteen halting cases
return an **empty Code Connect map at the design's root node**. Asked one level down, three of
them — a8, a10 and a5 — return **thirty mapped nodes and fifteen snippets** between them. Two
are genuinely empty: Sesame's `sl-button` carries `componentId: 2:48281`, a component outside
the mapped library, and asking that instance directly still returns `{}`. One, a2, is a timeout
that declares itself. **The halt the control recorded is one message for at least three
situations**, which is this plan's thesis measured rather than argued.

The scope of a map response is not a node count: 468 nodes answer fourteen entries and 620
answer nothing, twice, in both id spellings. **Asking at the node in the design's URL is the one
way to get nothing** — and that is the node an agent is given.

**What blocks the count.** `classify` files every nested node as cause B, owner pipeline, even
when the traversal recorded that the enclosing instance resolved with a snippet. The CLI exits
non-zero on any pipeline-owned node, so a design cannot convert while a single resolved instance
contains nested children. The defect was invisible until now for the same reason 05's two were:
against the servers used so far, nothing had ever resolved.

**What did not change.** The goal, the approach, the five causes, the stopping rule, the halt
policy, the acceptance criteria, and 04's own prediction of eight and six, which is recorded and
dated and has not been read against any result.

**Judgement to be aware of.** This is the third defect of one shape — a successful answer read
as a failure — found in three consecutive tasks. Each was found by running the instrument
against a server that answers rather than one that times out. That is worth more than any of the
three fixes: **the corpus could not have found any of them**, and neither could any test written
against it.

- Amended by: marcin.ludwig
- Amendment approved: 2026-10-06

### Amendment 5 — 2026-10-06, after approval

**What changed.** A fifth task added, `T-NOJIRA-figma-ingestion-09`, after 08 and before 04.

**Phase A resumed and decided the mode of all fourteen: ten as-is, four strict.** Every verdict
came from `mode-decision.mjs`, stored with the hash of the component listing it rests on. Ten of
the fourteen therefore have no mapping gap to report to anyone — their unresolved nodes are
cause C, owner nobody.

**The prediction was read for the first time, and it agrees on twelve of fourteen.** It was
recorded and dated in `T-NOJIRA-figma-ingestion-05` before any of this ran. The two it misses
are `a4-sesame-my-groups` and `b-sesame-group-details`: **24 and 63 instances named `sl-*` in a
file with zero `sl-*` externals**, because MySesame names its own local components `sl-*`.
**Naming is not dependency**, and the prediction used the weaker of the two signals — which is
exactly what a prediction is for.

Phase A had already shown the same thing from the other direction without anyone connecting it:
the instance named `sl-button`, asked directly, returns `{}` because its `componentId` points
outside the mapped library. The empty map was true, and why it was true is why the mode is
as-is.

**What 09 is for.** A nested node whose enclosing instance did not answer is still cause B,
owner pipeline, and still exits 6 — in an as-is design whose parent is already diagnosed cause
C. Two findings about one situation, two owners, two remedies, and the child's remedy is _ask
the enclosing instance_, which was done. In an as-is design A and B are the only causes that can
halt and A is a genuine retrieval failure, so this is the last thing between the ten and a
count.

**What did not change.** The goal, the approach, the five causes, the stopping rule, the halt
policy and the acceptance criteria. 09 narrows one cause; it adds none and removes none.

**Judgement to be aware of.** This is the fourth defect of one shape in five tasks, and the
chain is a fair thing to be uneasy about. What bounds it: in an as-is design only two causes can
halt, and the other one is a real failure. The claim that 09 is the last blocker for the ten is
written into its Objective **before** it is tested, so the next amendment can say plainly if it
was wrong.

- Amended by: marcin.ludwig
- Amendment approved: 2026-10-06
