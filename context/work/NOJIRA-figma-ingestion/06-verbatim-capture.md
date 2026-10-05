---
type: task
schema_version: 1
id: T-NOJIRA-figma-ingestion-06
title: Capture what Figma actually returns, by script, over the whole tree
description: "Three of nineteen runs carry verbatim captures; every plan here rests on agents' summaries of the data rather than the data"
jira: null
resource: null
status: todo
independent: false
owner: marcin.ludwig
created: 2026-10-06T00:00:00Z
updated: 2026-10-06T00:00:00Z
tags: [figma, capture, provenance, contract]
source_plan: P-NOJIRA-figma-ingestion
depends_on: [T-NOJIRA-figma-ingestion-05]
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

So the corpus is not ground truth. It is nineteen summaries, and the metadata contract
(`A-NOJIRA-figma-metadata-contract`, still `draft`) was derived from them.

**The remedy is a script, not a better instruction.** An agent that _may_ summarise sometimes
will; a script has no judgement. The guarantee has to be structural.

## Steps

1. **Settle the token first.** The remote server accepts a Figma personal access token:
   `Authorization: Bearer figd_…` answers `figd_ tokens must be passed via X-Figma-Token header`,
   so the scheme is supported and no OAuth dance is needed. **What is unproven is which tools a
   PAT unlocks.** One `tools/list` with a real token answers it. If Code Connect is not among
   them, capture the rest by script and record that Code Connect stays with the editor — that is
   a result, not a blocker.
2. **Walk the whole tree, not the top.** `traverse.mjs` already does this and already handles the
   three things that make it hard: depth-limited metadata, instance boundaries, and the `;` ids
   the server emits and refuses. Run it with `--expand-mapped` — pruning at a mapped node is
   right when producing HTML and wrong when recording what Figma returns.
3. **Call every tool the HTML needs, not two.** The capture today uses four; a design becomes
   HTML from six:

   | call                   | what it carries          | note                                        |
   | ---------------------- | ------------------------ | ------------------------------------------- |
   | `get_metadata`         | structure                | depth-limited; recurse                      |
   | `get_code_connect_map` | mappings                 | answers about descendants, see task 05      |
   | `get_design_context`   | layout, text, styles     | subtree-complete until it is truncated      |
   | `get_variable_defs`    | bound tokens             | **per node, not once per run** — see step 4 |
   | `download_assets`      | **the icons and images** | never called by any run; see step 5         |
   | `get_screenshot`       | the reference raster     | pass `maxDimension` explicitly; see step 6  |

4. **`get_variable_defs` per node.** `A-NOJIRA-figma-metadata-contract` F12 measured 37 of 399
   token names resolving to more than one value — the same `color/background/primary/bold` is
   `#137271` in one ETSL frame and `#3366ff` in another, because the variable mode is invisible.
   Every run captured one call at the root, so that difference cannot be read out of the corpus
   at all. Per node it can.
5. **Download the assets in the same run.** Probed 2026-10-06 on `334:20573`:
   `download_assets` returns an `export` render, `rawImages` and `svgAssets`, **and reports its
   own truncation** — `rawImagesTruncated: true`, `svgAssetsTruncated: true`, with a message
   naming the cap of 20 each. All three URL classes were downloaded successfully at the time of
   capture. They are short-lived, so the download happens in the run, not afterwards.
6. **Record the raster's parameters.** `get_screenshot` defaults to `maxDimension: 1024`. a8's
   frame is 1280×1024 and its stored screenshot is **1024×820** — that is the default, not a
   distortion. `download_assets.export` returned the same node at native **1280×1024**. Capture
   both, record which is which, and pass `maxDimension` explicitly so the number is a choice.
7. **Make the frontier truncation-driven.** `get_design_context` is subtree-complete and
   `download_assets` caps at 20 — both say so when they stop. Recurse where a response declared
   itself incomplete, and nowhere else. The call count then scales with truncation events rather
   than with node count, which is what makes a very large design tractable: a 10,936-node design
   returned 27 top-level nodes from `get_metadata`.
8. **Every file gets a call record.** Tool, arguments, server, HTTP status, elapsed time, byte
   count and a hash of the response. `verbatim` then becomes checkable rather than inferred —
   the measurement above needed a heuristic, and the first heuristic was wrong by four runs.
9. **Budget, resumability and honest incompleteness.** A per-design call and byte budget, a
   checkpoint so an interrupted capture resumes rather than restarts, and `complete: false` with
   the reason whenever a budget, a cap or a `429` stopped it. The server sends
   `X-Figma-Rate-Limit-Type` and `Retry-After`; a run that quietly waited must not look like one
   that did not.

## The token's scopes

Mapped against the scope list Figma offers, 2026-10-06.

| Scope                                                                      | Why                                                                                                                                                                                                                                                                    |              |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `file_content:read`                                                        | _"Read the contents of and render images from files"_ — carries `get_metadata`, `get_design_context`, `get_variable_defs`, `get_screenshot` **and** `download_assets`                                                                                                  | **required** |
| `file_metadata:read`                                                       | the file's name and identity. `A-NOJIRA-figma-metadata-contract` **F10**: across all nineteen capture trees there is no file key, no file name and no `lastModified` — Figma does not identify the design, the operator does                                           | **required** |
| `file_versions:read`                                                       | version history. `mode-decision.mjs` caches on `(fileKey, version)` and fills version with the literal string `unknown`, so **every cache entry today is `<key>@unknown`**. This is what makes the key real and makes "has it changed?" answerable without re-fetching | **required** |
| `library_content:read`, `team_library_content:read`, `library_assets:read` | component and style identity published from libraries — the `componentKey` / `assetKey` that `P-NOJIRA-mapping-adapters` needs because name matching gives confident wrong answers                                                                                     | **required** |
| `file_code_connect:write`                                                  | `get_code_connect_map`. **There is no `file_code_connect:read`** — see below                                                                                                                                                                                           | see below    |

Not needed: `current_user:read`, `file_comments:*`, `file_dev_resources:*`,
`private_sandbox:connect`, `folders:read`, `webhooks:*`.

### The Code Connect scope is write-only, and that matters here

Figma offers no read variant. Reading the map means granting a token that can **write component
code into the file**, and `get_code_connect_suggestions` returns a payload whose last line is an
instruction to an agent to call `send_code_connect_mappings` — a write tool — against that same
file. A token with this scope, held by a session that reads that response, is a loaded gun
pointed at the design system's own file.

So: **two tokens, not one.**

- A **capture token** without `file_code_connect:write`, which is what step 1 tests first. If the
  four content calls work with it, every part of this task except Code Connect is done with a
  token that cannot change anything.
- A **Code Connect token** with the write scope, used only by the script, never exported into a
  session where a model reads tool output. If that separation cannot be held, Code Connect stays
  with the editor and the capture records that it did — which is a result, not a failure.

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

Re-run two designs and diff. Then re-derive two findings of
`A-NOJIRA-figma-metadata-contract` from the new captures rather than the old ones —
**F14** (raster distortion) and **F16** (assets), both of which this task's probes already
contradict in part: the downscales are the `maxDimension` default, and the asset URLs resolve.
If the contract's findings survive on real data, it leaves `draft` with evidence behind it.
