---
type: task
schema_version: 1
id: T-NOJIRA-figma-ingestion-01
title: Decide the mode from evidence, once per file
description: 'Strict or as-is, derived from which library the file depends on — not from the team label'
jira: null
resource: null
status: done
independent: true
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T18:40:00Z
tags: [figma, mode, caching]
source_plan: P-NOJIRA-figma-ingestion
depends_on: []
commit: cff8209113f0a8cbbca256f6b878a7b1806a6133
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

## Result

`runs/harness/mode-decision.mjs`, with twelve tests in `mode-decision.test.mjs`. Verified live on
both files the task names.

### The two verdicts

| file                                    | verdict    | the evidence that decided it                                                                                                                  |
| --------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `4TdMrcnIVOn3Hrfj2OpVZU` NSP group list | **strict** | 7 distinct `sl-*` — `sl-avatar`, `sl-badge`, `sl-button-bar/Pill`, `sl-button-pill`, `sl-button-rectangular`, `sl-card Actionable`, `sl-icon` |
| `mONnHPTYNNaBwV3cFUHIYv` Course-files   | **as-is**  | 0 `sl-*`; depends on `Cell` (9 of its 13 components), `.Main menu`, `.Navigation item`, `your-files`                                          |

The second row reproduces the 2026-10-05 probe exactly — _"13 components … `Cell`, `.Main menu`,
`.Navigation item`, `your-files` — zero `sl-*`"_. Both responses are kept under
`runs/harness/fixtures/`, so the verdicts are reproducible without a Figma call.

The NSP file also depends on two non-SLDS externals, `Hover state` and `Logo`. Any `sl-*` makes
it strict; a product file picking up a stray external does not make it someone else's design.

### What works

- **The mode is recorded with its evidence.** `evidence.slds`, `evidence.other`, both counts, and
  `dependents` — how many of the file's components depend on each external — plus the `reason`,
  the tool name and the source path.
- **Cached per `(fileKey, version)`.** A second design from the same file reads the cached verdict
  and makes no call; a test proves it by passing a fetcher that throws. Twelve files hold the
  nineteen designs.
- **The response is never read whole.** `fetchComponentsTo` streams the HTTP body to disk with
  `pipeline`; `externalsOf` scans in 64 KiB windows overlapping by 4 KiB, de-duplicating by
  absolute offset. A test pads 70 KB ahead of the payload so a name lands across a boundary.

### Two things only a live response could teach

Both were wrong in the first version, and both came from building against the probe's prose
rather than a stored response.

1. **`external: true` is the discriminator, not the `name`/`assetKey` pair.** The real entry is
   `{ name, external, assetKey }` — `external` sits _between_ them, so a pattern pairing `name`
   with `assetKey` matched nothing. Keying on the component list instead would be worse still:
   **neither file publishes an `sl-*` component**, because product files consume a library rather
   than republish it, so the list classifies both files identically.
2. **A response arrives wrapped in the MCP content envelope, with the payload as an escaped
   string** — `\"name\": \"sl-avatar\"`, `\n` for newlines. The reader found **zero externals in
   60 KB of real response** until it accepted escaped quotes and literal `\n`. `fetchComponentsTo`
   writes that envelope too, so this was not only a fixture problem.

### One decision the task did not specify

**No externals at all is `undecided`, not `as-is`,** and the CLI exits 1. An empty Code Connect
result is five causes wearing one symptom and only one means "another library". Letting it fall
through would convert a failed call into a verdict. Anything else means as-is, as written;
_nothing_ means we do not know.

### Reaching the call

The script talks MCP over HTTP to `--endpoint`, default the Dev Mode server on
`127.0.0.1:3845`. **That server does not publish this tool** — ten tools, and
`list_file_components_for_code_connect` is not among them; it answers `No matching
discriminator`, and that rejection streams to disk like any other response, which is the
transport working. The tool lives on `https://mcp.figma.com/mcp`, behind OAuth held by the
editor's MCP client, so a bare script gets `401`.

Two ways to run it, both exercised:

```
# the editor's Figma MCP holds the credential: let it write the response to a file, then classify
node runs/harness/mode-decision.mjs --file <fileKey> --from <response.json>

# with a bearer token in the environment, the script fetches and classifies in one step
FIGMA_MCP_TOKEN=... node runs/harness/mode-decision.mjs --file <fileKey> \
  --endpoint https://mcp.figma.com/mcp
```

The envelope is handled either way, so a response saved straight from the editor needs no
unwrapping.

### This call is the plan's only remote one

Measured across the four tasks: `get_code_connect_map`, `get_code_connect_suggestions`,
`get_design_context` and `get_metadata` — everything tasks 02, 03 and 04 call — **are all on the
local server**. Only this task needed the remote.
