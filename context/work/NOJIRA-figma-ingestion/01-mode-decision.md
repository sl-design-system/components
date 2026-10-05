---
type: task
schema_version: 1
id: T-NOJIRA-figma-ingestion-01
title: Decide the mode from evidence, once per file
description: 'Strict or as-is, derived from which library the file depends on — not from the team label'
jira: null
resource: null
status: blocked
independent: true
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T18:40:00Z
tags: [figma, mode, caching]
source_plan: P-NOJIRA-figma-ingestion
depends_on: []
---

# Decide the mode from evidence, once per file

## Objective

A design drawn in another library is not a blocked run; it is the second audience. Decide which,
before the traversal starts, from evidence rather than from a product name — two NSP designs
resolve to two different themes, and the label was wrong both times it was guessed.

Probed 2026-10-05: SANNA's components depend on **24 distinct `sl-*`** externals; Course-files'
depend on `Cell` and `.Main menu`, with **zero**.

## Steps

1. Call `list_file_components_for_code_connect(fileKey)`. **Write it to disk and grep it** — it
   returned 2.18 MB on a 153-component file and must never be read into a context window.
2. Classify by the external dependencies of the file's own components: `sl-*` means **strict**,
   anything else means **as-is**.
3. Cache per `(fileKey, fileVersion)`. Nineteen designs sit in twelve files, so this is twelve
   calls for the corpus and zero on a re-run.
4. Record the verdict **with its evidence** — which externals, how many.

## Acceptance criteria

- The mode is recorded with the evidence that produced it, not as a bare label.
- Cached per file and version; a second design from the same file makes no call.
- The call is written to disk and never read whole.

## Verification

Run against one SLDS-based file and one itslearning file; the verdicts must differ and each must name the externals it saw.

## Result — implemented and tested, blocked on the one call it needs

`runs/harness/mode-decision.mjs`, with nine tests in `mode-decision.test.mjs`. Everything the
acceptance criteria ask for is built and green; the task's **Verification** step is what cannot
be done here, and the reason is not a defect.

### What works

- **The mode is recorded with its evidence.** The verdict carries `evidence.slds`,
  `evidence.other`, both counts, and `dependents` — how many of the file's components depend on
  each external — plus the `reason` sentence, the tool name and the source path.
- **Cached per `(fileKey, version)`.** A second design from the same file reads
  `.mode-cache/<fileKey>@<version>.verdict.json` and makes no call; the test proves it by passing
  a fetcher that throws. Twelve files hold the nineteen designs, so this is twelve calls, then
  none.
- **The response is never read whole.** `fetchComponentsTo` streams the HTTP body straight to
  disk with `pipeline`, and `externalsOf` scans the file in 64 KiB windows overlapping by 4 KiB,
  de-duplicating matches by absolute offset. A test puts a 70 KB pad before the payload so a
  dependency name lands across a window boundary and must still be found.

The discriminator is `dependencies[].name` paired with `assetKey`, as
[`code-connect-explained.md`](../../analyzes/NOJIRA-figma-to-code/code-connect-explained.md)
recorded — never the component list, because **neither file publishes an `sl-*` component** and
reading the list would classify both files the same way.

### One decision the task did not specify

**No externals at all is `undecided`, not `as-is`,** and the CLI exits 1. An empty Code Connect
result is five causes wearing one symptom and only one of them means "another library". Letting
it fall through to `as-is` would convert a failed call into a verdict — the mistake this task
exists to stop. Anything else means as-is, as written; _nothing_ means we do not know.

### Why Verification could not be run

The call lives on the **remote** Figma MCP (`https://mcp.figma.com/mcp`), behind OAuth held by
the editor's MCP client. The **local** Dev Mode server at `127.0.0.1:3845` publishes ten tools
and `list_file_components_for_code_connect` is not among them, so a harness script cannot reach
it. Requesting it there returns `No matching discriminator` — confirmed, and that rejection was
itself streamed to disk, which is the transport working.

The other route is to call it from an agent, but the response was **2.18 MB on SANNA's 153
components** and would land in a context window, which this task forbids in its own step 1.

So the two-file check — one SLDS file, one itslearning file, verdicts differing — is deferred.
Proven instead: the full transport live against the local server; all three verdict paths through
the CLI; and the classifier against the probe's recorded numbers.

**To unblock:** a Figma token in `FIGMA_MCP_TOKEN`, or any MCP client that can redirect a tool
result to a file. Then:

```
node runs/harness/mode-decision.mjs --file Mzc8BuOvMxOJGAQtv0h64M --endpoint https://mcp.figma.com/mcp   # SANNA   → strict
node runs/harness/mode-decision.mjs --file mONnHPTYNNaBwV3cFUHIYv --endpoint https://mcp.figma.com/mcp   # itsl    → as-is
```

One thing to check when it runs: the `dependencies[].name` + `assetKey` pairing is taken from the
probe's prose, not from a stored response. If the real shape differs, `externalsOf` is what
changes, and its tests carry the expected values.

### This blocker is task 01's alone

Measured across the plan's four tasks: `get_code_connect_map`, `get_code_connect_suggestions`,
`get_design_context` and `get_metadata` — everything tasks 02, 03 and 04 call — **are all on the
local server**. Only this task needs the remote. `T-NOJIRA-figma-ingestion-02` can start.
