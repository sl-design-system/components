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

## Verification

Re-run two designs and diff. Then re-derive two findings of
`A-NOJIRA-figma-metadata-contract` from the new captures rather than the old ones —
**F14** (raster distortion) and **F16** (assets), both of which this task's probes already
contradict in part: the downscales are the `maxDimension` default, and the asset URLs resolve.
If the contract's findings survive on real data, it leaves `draft` with evidence behind it.
