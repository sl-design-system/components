---
type: task
schema_version: 1
id: T-NOJIRA-figma-ingestion-06
title: Capture what Figma actually returns, by script, over the whole tree
description: "Three of nineteen runs carry verbatim captures; every plan here rests on agents' summaries of the data rather than the data"
jira: null
resource: null
status: done
independent: false
owner: marcin.ludwig
created: 2026-10-06T00:00:00Z
updated: 2026-10-06T03:30:00Z
tags: [figma, capture, provenance, contract]
source_plan: P-NOJIRA-figma-ingestion
depends_on: [T-NOJIRA-figma-ingestion-05]
commit: dc100e98a
---

# Capture what Figma actually returns, by script, over the whole tree

## Objective

The `implement-design` skill already instructs its analyst to persist every Figma call
**"preserving the response verbatim"**. Measured 2026-10-06 across all nineteen runs:

| file                          | verbatim | authored by the agent | absent |
| ----------------------------- | -------: | --------------------: | -----: |
| `figma-metadata.txt`          |       15 |                     4 |      0 |
| `figma-code-connect-map.json` |    **8** |                 **8** |      3 |
| `figma-design-context.md`     |       12 |                     6 |      1 |
| `figma-variable-defs.json`    |       19 |                     0 |      0 |

**Three runs of nineteen have all three of the first group verbatim.** Code Connect — the single
source every plan in this slice rests on — is the tool's own output in eight cases; the rest is
hand-assembled JSON carrying `_note`, `probe_method`, `_per_node_probes`. The agents described
what they saw instead of recording what they received. The instruction existed and nothing
checked it.

**The remedy is a script, not a better instruction.** An agent that _may_ summarise sometimes
will; a script has no judgement.

### What the token probe found, and why this task changed shape

Probed 2026-10-06 with a six-scope read token:

|                                          |                                                                                                                                                                                                                                                                                                                                     |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mcp.figma.com` with `X-Figma-Token`     | **401 Unauthorized.** The token is well-formed and the server recognises the type — it rejected `Authorization: Bearer` with _"figd\_ tokens must be passed via X-Figma-Token header"_ — and still refuses. The MCP endpoint wants OAuth with `scope="mcp:connect"`; a personal access token does not reach it, whatever its scopes |
| `api.figma.com` REST with the same token | **200, and it returns more than MCP does**                                                                                                                                                                                                                                                                                          |

So the capture is **REST-first**, and the MCP half stays with the editor. That reopens the
REST-versus-MCP fork `T-NOJIRA-figma-ingestion-02` closed in favour of MCP — correctly, for the
traversal, which needs Code Connect and gets it from the Dev Mode server. For **capture** the
answer is the other one, and the two are not in conflict.

### What REST returns, measured

On `4TdMrcnIVOn3Hrfj2OpVZU`, the file holding `a8-nsp-group-list`:

| call                                     | result                                                                                             |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `GET /v1/files/:key`                     | **287 MB, 96 s, 200 248 nodes** — the whole document, no pagination, no depth limit, no truncation |
| `GET /v1/files/:key/nodes?ids=334:20573` | **915 KB, 2.6 s, 620 nodes** — the frame's complete subtree, descending **through** instances      |
| `GET /v1/files/:key/versions`            | 24 KB of version history                                                                           |

**`get_metadata` reported 98 nodes for that same frame. REST reports 620.** The corpus captured
roughly **one node in six**, because MCP metadata stops at instance boundaries and REST does not.
That single ratio is the answer to "are we looking at the design or at a summary of it".

Four things REST carries that MCP withholds, each of which closes a question another document
has open:

| REST field                                              | closes                                                                                                                                                                                      |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`, `lastModified`, `version` on the file           | **F10** — _Figma does not identify the design_. And `mode-decision.mjs` caches on `(fileKey, version)` with the literal string `unknown`, so **every cache entry today is `<key>@unknown`** |
| `componentId` on every instance                         | the identity key `P-NOJIRA-mapping-adapters` needs. Name matching calls `sl-card Actionable` an exact match for `card.figma.ts`; `componentId` cannot                                       |
| `overrides` and `componentProperties` on every instance | **F3b** — `A-NOJIRA-ds-conformance` left open _"whether overrides are visible in the fetched data at all"_. In REST they are                                                                |
| `explicitVariableModes` on each canvas                  | **F12** — the variable mode MCP omits, which is why 37 of 399 token names resolve to more than one value with no way to tell which                                                          |

**Neither source supersedes the other.** REST is the authoritative document model; MCP is the
interpreted view — `get_design_context`'s markup and Code Connect's snippets exist nowhere in
REST. The contract is the correspondence between them, and nobody has written it down because
until now only one side was on disk.

## Steps

1. **Capture REST, per node, streaming to disk.** `GET /v1/files/:key/nodes?ids=<root>` for each
   of the nineteen designs. 915 KB and 2.6 s for a 620-node frame, so the corpus is minutes, not
   hours. **The response is never read into memory or a context window** — `mode-decision.mjs`
   already has that discipline and `mcp.mjs` the streaming primitive. One whole-file
   `GET /v1/files/:key` is worth taking **once**, as ground truth, with the 287 MB figure in mind.
2. **Capture the file's identity alongside it** — `name`, `lastModified`, `version`, and
   `/versions` — so `(fileKey, version)` stops being `@unknown` and "has it changed?" is
   answerable without re-fetching.
3. **Capture the MCP side as it is reachable, and record which half is missing.** The Dev Mode
   server answers `get_metadata`, `get_design_context`, `get_variable_defs`,
   `get_code_connect_map`, `get_screenshot` and `download_assets` without a token, for the file
   the editor has open. That is a per-file manual step for twelve files; it is also the only
   path to Code Connect until somebody holds an OAuth credential. **A design whose MCP half was
   not captured says so** rather than looking like one with nothing to report.
4. **Download the assets in the same run.** Probed 2026-10-06: `download_assets` returns an
   `export` render, `rawImages` and `svgAssets`, **reports its own truncation** —
   `rawImagesTruncated`, `svgAssetsTruncated`, cap of 20 each — and all three URL classes
   downloaded successfully. They are short-lived. REST's `GET /v1/images/:key?ids=` is the
   token-reachable equivalent for renders and should be captured too, so the two can be compared.
5. **Record the raster's parameters.** `get_screenshot` defaults to `maxDimension: 1024`; a8's
   frame is 1280×1024 and its stored screenshot is **1024×820**, which is that default and not a
   distortion. `download_assets.export` returned the same node at native size. Capture both,
   record which is which, and pass `maxDimension` explicitly so the number is a choice.
6. **Make the MCP frontier truncation-driven.** `get_design_context` is subtree-complete and
   `download_assets` caps at 20 — both say so when they stop. Recurse where a response declared
   itself incomplete, and nowhere else, so the call count scales with truncation events rather
   than node count. REST needs none of this: it returns the subtree whole.
7. **Every file gets a call record.** Endpoint, arguments, status, elapsed time, byte count and a
   hash of the response. `verbatim` then becomes checkable rather than inferred — the measurement
   above needed a heuristic, and the first heuristic was wrong by four runs.
8. **Budget, resumability and honest incompleteness.** A per-design call and byte budget, a
   checkpoint so an interrupted capture resumes rather than restarts, and `complete: false` with
   the reason whenever a budget, a cap or a `429` stopped it. Record `Retry-After` when it
   arrives: a run that quietly waited must not look like one that did not.
9. **Commit the per-node captures; do not commit the whole-file dumps.** Measured on four
   designs: 915 KB / 1.19 MB / 1.79 MB / 2.18 MB raw, compressing 12-19× — **roughly 28 MB raw
   and under 2 MB of git objects for all nineteen**, against a repository whose `.git` is
   already 112 MB. Re-fetching later is not free and may not even be possible: the token is
   temporary and `lastModified` is already `2026-09-23`, so a capture is a snapshot of a file
   that will move. The whole-file `GET /v1/files/:key` is **287 MB for one file** and twelve of
   them is ~3.4 GB; GitHub rejects any single file over 100 MB outright. Take it once if it is
   wanted, keep it out of git, and record its hash.

   Add a `.gitattributes` entry marking the captures `-diff linguist-generated` so they do not
   swamp reviews.

10. **Publication is a separate decision, and it is not made by committing.** This repository is
    **public**, the branch is **not pushed** — 184 unpushed commits, and the 1 355-file corpus
    already committed here has never left the machine. A REST capture is the complete design:
    every string, every layer name, every unreleased screen of Kampus, itslearning, NSP, Sesame,
    ETSL and MyPortal. Committing it to this branch is safe and reversible; **pushing it is
    neither**, because git history keeps it.

    So: **the branch must not be pushed until somebody decides whether this corpus belongs in a
    public repository.** That gate already exists because of the corpus committed before this
    task; this task only makes it larger and writes it down.

11. **The token is temporary.** It lives in `.env` as `FIGMA_READ_TOKEN`, which is gitignored and
    untracked, and it is revoked when this task ends. Nothing may bake it into a committed file,
    a fixture or a cache path, and the capture must still be readable after it is gone.

## The token's scopes

Granted and in use, confirmed by the REST API naming them back in a 403:
`file_content:read`, `file_metadata:read`, `file_versions:read`, `library_content:read`,
`team_library_content:read`, `library_assets:read`. Mapped against the scope list Figma offers.

| Scope                                                                      | Why                                                                                                                                                                                                                                                                    |              |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `file_content:read`                                                        | _"Read the contents of and render images from files"_ — carries `get_metadata`, `get_design_context`, `get_variable_defs`, `get_screenshot` **and** `download_assets`                                                                                                  | **required** |
| `file_metadata:read`                                                       | the file's name and identity. `A-NOJIRA-figma-metadata-contract` **F10**: across all nineteen capture trees there is no file key, no file name and no `lastModified` — Figma does not identify the design, the operator does                                           | **required** |
| `file_versions:read`                                                       | version history. `mode-decision.mjs` caches on `(fileKey, version)` and fills version with the literal string `unknown`, so **every cache entry today is `<key>@unknown`**. This is what makes the key real and makes "has it changed?" answerable without re-fetching | **required** |
| `library_content:read`, `team_library_content:read`, `library_assets:read` | component and style identity published from libraries — the `componentKey` / `assetKey` that `P-NOJIRA-mapping-adapters` needs because name matching gives confident wrong answers                                                                                     | **required** |
| `file_code_connect:write`                                                  | `get_code_connect_map`. **There is no `file_code_connect:read`** — see below                                                                                                                                                                                           | see below    |

Not needed: `current_user:read`, `file_comments:*`, `file_dev_resources:*`,
`private_sandbox:connect`, `folders:read`, `webhooks:*`.

### The Code Connect scope is write-only — and moot, for now

Figma offers no read variant. Reading the map means granting a token that can **write component
code into the file**, and `get_code_connect_suggestions` returns a payload whose last line is an
instruction to an agent to call `send_code_connect_mappings` — a write tool — against that same
file. A token with this scope, held by a session that reads that response, is a loaded gun
pointed at the design system's own file.

**The probe settled it without anyone having to decide.** `mcp.figma.com` refuses personal
access tokens whatever their scopes, so no token reaches `get_code_connect_map` and the write
scope would be granted for nothing. Code Connect stays with the editor, which is where the
credential already is, and the capture records which designs it covered.

If an OAuth credential is ever minted for the script, this paragraph is the reason to keep it in
a separate one from the capture token, and to keep it out of any session where a model reads
tool output.

## How the script knows it missed nothing

**There is no denominator, by construction.** `get_metadata` stops at instance boundaries, so the
universe is discovered rather than declared and every descent enlarges it — the plan says this in
its own words. A completeness _ratio_ would therefore be invented. What replaces it is five
checks that are independently falsifiable, and a control that proves they can fail.

1. **Frontier closure.** Every node that entered the frontier left it with a recorded
   disposition — resolved, captured, descended, nested, hidden, excluded or failed — and the
   frontier is empty. `traverse.mjs` already produces exactly this shape. A node with no
   disposition is a bug in the walk, not a gap in the design.
2. **Nothing declared itself incomplete.** Every tool that truncates says so:
   `rawImagesTruncated`, `svgAssetsTruncated`, the MCP output cap, and the remote server's
   `Note: the Code Connect lookup timed out` appended to a `{}`. Complete means no response
   declared itself partial and no budget bit — not that the walk finished.
3. **Cross-tool reconciliation, which is the strongest of the five.** Three tools see the same
   tree from different angles and must agree about which nodes exist: `get_metadata` gives ids
   structurally, `get_design_context` emits them as `data-node-id`, and
   `get_code_connect_suggestions` lists component ids. Every id seen by one must be accounted
   for by the others or explicitly classified — hidden, nested, library-internal. **Disagreement
   between tools is the detector**, and it is known to fire: F11 measured 16 of 84 design-context
   captures rooted at a different node than the one queried, and 6 that never mention it at all.
4. **The raster is an independent witness.** `download_assets.export` is a pixel image of the
   node at native size, produced by Figma and owing nothing to our traversal. The union of the
   captured nodes' bounding boxes should cover the frame; **a region of the export that no
   captured node covers is something we did not see.** Geometry is on every metadata node
   already, and `T-NOJIRA-corpus-census-03` is building the comparator.
5. **Re-run determinism.** Capture one design twice and compare hashes. A difference is either a
   real change — which `file_versions:read` can now confirm — or nondeterminism worth a name.

**And the control.** Delete a known subtree from a capture and prove checks 1, 3 and 4 go red.
A completeness check nobody has seen fail is decoration; this is the same rule that caught three
measurement faults in the harness.

**What none of them catches**, stated so nobody reads the five as a guarantee: a node Figma never
mentions in any tool's output and which covers no visible pixels is invisible to all five. The
Dev Mode server already showed a version of this — nine of ten pages reported no children, and
the only one that did was the page the editor had open. Whether the remote server does the same
with a token is untested and is part of step 1.

## Acceptance criteria

- Every stored response carries its call record and hash, and **no file is written by any path
  that could summarise it**.
- The capture covers the whole tree, not the root: the node count it reports is reconcilable
  with `get_metadata`'s own structure.
- Assets are on disk — the export, the raw images and the SVGs — with the truncation flag
  recorded wherever the cap of 20 bit.
- A design that could not be captured whole says so, with which budget or cap stopped it.
- Re-running one design twice produces the same hashes, or names every field that differed.
- `tools/list` for the token in use is stored with the run, so a later reader knows what was
  reachable.
- **The five closure checks run on every capture, and the deletion control shows three of them
  going red.**
- The file's real version is recorded, so `(fileKey, version)` stops being `<key>@unknown`.

## Verification

Re-run two designs and diff. Then re-derive four findings of
`A-NOJIRA-figma-metadata-contract` from the new captures rather than the old ones — **F10**
(the design is unidentified), **F12** (variable modes invisible), **F14** (raster distortion)
and **F16** (assets). This task's probes already contradict all four in part: REST carries the
file version and the variable modes, the downscales are the `maxDimension` default, and the
asset URLs resolve. If the rest of the contract survives on real data, it leaves `draft` with
evidence behind it.

The sharpest single check: **`get_metadata` reported 98 nodes for a8's frame and REST reports 620.** Any capture that does not reconcile those two numbers, or explain the difference node by
node, has not understood what it captured.

## Result

`runs/harness/rest.mjs` and `runs/harness/capture.mjs`, with 64 tests across `rest.test.mjs` and
`capture.test.mjs`. The harness gate is **431 tests** and `tsc --noEmit` over seventeen files.
**32 mutations, 0 survivors.**

**18 of 19 designs captured: 26 466 nodes, 103 stored responses, 67 MB raw.** Every one of the
five closure checks is green on every design, and `capture.mjs --verify` re-hashes all 103
against their records on demand.

### The dependency, taken as soft

`T-NOJIRA-figma-ingestion-05` is `todo`. It fixes two defects in **`classifyMap`** and makes the
endpoint an explicit choice. This task writes bytes to disk and reads none of them through that
path — a capture that passed a response through a reader able to summarise it would violate its
own first acceptance criterion. Same shape as `T-02`'s soft dependency on `T-01`, and named here
rather than worked around quietly. 05 is still before 04.

### The eight criteria

| Criterion                                              | How it is shown                                                                                                                           |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Every stored response carries its call record and hash | 103 records, each with URL, status, elapsed time, bytes and sha256; `--verify` re-derives them                                            |
| No file is written by any path that could summarise it | `getTo` streams to disk and returns a record whose **key set is asserted closed**, so a later edit cannot add a field carrying a body out |
| The capture covers the whole tree                      | **26 260 frame nodes against the corpus's 98-for-620**; every id `get_metadata` and `get_design_context` emit is held, on all eighteen    |
| Assets are on disk with truncation recorded            | 18 renders downloaded, because `/v1/images` answers with a **short-lived S3 URL**; the MCP asset half is unreachable and says so          |
| A design that could not be captured whole says so      | `complete: false` with the reason; a5 is `unidentified` with the reason and the CLI exits 5                                               |
| Re-running one design produces the same hashes         | a8 and b-nsp-home re-captured into a scratch tree: **5 records each, every hash identical**, the render included                          |
| `tools/list` for the token is stored with the run      | REST publishes none, so each manifest carries `reach` — `files: 200, versions: 200, me: 403`                                              |
| The file's real version is recorded                    | all 18 carry `name`, `lastModified` and a real `version`; **none is `unknown`**                                                           |

### The five checks, and the control

| #   | Check                              | On the corpus                    |
| --- | ---------------------------------- | -------------------------------- |
| 1   | frontier closure                   | green ×18                        |
| 2   | nothing declared itself incomplete | green ×18                        |
| 3   | cross-tool reconciliation          | green ×18 — **after two passes** |
| 4   | geometry witness                   | green ×18, reported not gated    |
| 5   | re-run determinism                 | green on the two re-run          |

**The deletion control shows three going red**, and bounds the fourth. Removing `334:20578` —
468 of a8's 620 nodes — turns checks 1, 3 and 4 red. Removing `334:20585`, an interior frame
holding **220 nodes**, turns 1 and 3 red and leaves **coverage completely unchanged**. A check
nobody has seen fail is decoration; a check nobody has seen fail _to_ fail is worse.

### Check 3 did not pass. It converged.

The first pass left **163 ids** that `get_design_context` named and the capture did not hold.
Rather than classify them by heuristic, the capture **asks Figma**. All 49 of a2's resolved:
`COMPONENT` definitions and their internals, living on another page of the same file, outside
the design frame. So the capture now runs two passes — fetch, reconcile, fetch what was named,
reconcile again — and an id that comes back `null` is Figma saying it is not in this file, which
is an answer too.

Two corpus runs hold a `123-456.txt`: a prose probe log an agent named after the server's own
error message template, `Node ID must be in the format "123:456"`. REST's `null` is what settles
that, not a guess about filenames.

### Four faults the data caught before they were believed

This is the fourth task in a row where the instrument was wrong in the same direction, so they
are listed rather than quietly fixed.

| Fault                                      | How it showed                                   | What it would have cost                                                                                                                                                                          |
| ------------------------------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`outside > 0` read as an error**         | fired on 14 of 18 healthy designs               | a1-kampus has **920** nodes outside its frame because the frame is `clipsContent: true` and 720px tall while its table of contents runs past 11443. Every one is real and deliberately invisible |
| **`data-node-id="1:2"` counted as a node** | the same phantom id in four unrelated files     | it is the example in `get_design_context`'s **own preamble**: _"Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`."_ Documentation counted as design data       |
| **The CLI forked its readers**             | the preamble fix did not change the output      | the two id regexes were inlined in the CLI instead of calling the tested functions. The tested code and the running code had diverged                                                            |
| **The formatter rewrote the evidence**     | 71 of 71 stored captures, on their first commit | `oxfmt` pretty-printed every JSON response. Nothing looked wrong; only the hashes did. `runs/captures` now sits in `ignorePatterns`, and `--verify` exists because of this                       |

The last one is the first acceptance criterion of this task firing on this task, within minutes
of it being written. It is also why `verifyStored` is a function with a negative control rather
than a line in a runbook.

### The four findings, re-derived

|         | `A-NOJIRA-figma-metadata-contract` said | What the captures say                                                                                                                                                                                                                                                                                                                        |
| ------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **F10** | the design is unidentified              | **contradicted.** 18 of 18 carry `name`, `lastModified` and a real `version`; none is `unknown`. `mode-decision.mjs`'s `<key>@unknown` cache key can become a key                                                                                                                                                                            |
| **F12** | variable modes are invisible            | **contradicted, and by a better field than the one predicted.** `explicitVariableModes` is on **8 nodes**, not on each canvas — a frame fetch does not include its page. What REST does carry is `boundVariables` on **19 521 of 42 568 nodes**, naming the variable id per bound property, which is what resolves a token name to one value |
| **F14** | the raster is distorted                 | **contradicted.** Every render is exactly 2× its frame, which is the scale that was asked for. The six that read 2.02-2.73 render _more_ than the frame, which is the same out-of-frame content check 4 counts                                                                                                                               |
| **F16** | assets                                  | **partly contradicted.** All 18 render URLs resolved and the renders are on disk. The raw images and SVGs come from `download_assets`, which a token cannot reach                                                                                                                                                                            |

Three of four contradicted on real data. The contract leaves `draft` with evidence behind it —
but **not by this task**, which measured four of its findings and not the rest.

### What a capture still cannot see

Said plainly so the five checks are not read as a guarantee:

- A node Figma never mentions in any tool's output and which covers no visible pixels is
  invisible to all five.
- **Check 4 is blind to 220 nodes vanishing**, measured above.
- The MCP half — `get_design_context`'s markup, Code Connect's snippets, `download_assets` — is
  not captured here. `mcp.figma.com` refuses a personal access token with a 401 whatever its
  scopes. The corpus's existing MCP captures are what this reconciles against, and they are the
  ones `T-NOJIRA-corpus-census-02` is normalising.
- **a5-etsl-metadata-usage-widget was not captured.** Its run records no root node id and no link
  anywhere in the repository names one. It is the nineteenth design and it is not here. That is
  F10 in its operational form: the identity was the operator's to record and for one design
  nobody did.

### The gate before a push, restated because it is now larger

67 MB over 122 files, roughly 13.6 MB of git objects, largest single file 14 MB — against a
`.git` already at 112 MB and GitHub's 100 MB per-file limit. The estimate in step 9 said ~28 MB
raw and under 2 MB of objects; it was taken from four designs before the extra roots, the named
nodes and the renders existed. **The real number is a little over twice that**, and it is still
not the reason to hesitate.

The reason to hesitate is unchanged and now concerns more bytes: this repository is **public**,
the branch is **not pushed**, and a REST capture is the complete design — every string, every
layer name, every unreleased screen. Committing is safe and reversible. Pushing is neither.
