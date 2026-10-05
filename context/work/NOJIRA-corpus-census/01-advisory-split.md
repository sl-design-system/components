---
type: task
schema_version: 1
id: T-NOJIRA-corpus-census-01
title: Repair the advisory-block split
description: Six of the ten non-rendering runs fail on one concatenation bug; fixing it decides whether the downstream plan runs at full scope
jira: null
resource: null
status: todo
independent: true
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T00:00:00Z
tags: [captures, parsing, corpus]
source_plan: P-NOJIRA-corpus-census
depends_on: []
---

# Repair the advisory-block split

## Objective

`get_design_context` returns the code **and five advisory blocks** — a stack-conversion notice,
a node-id notice, a style list, component descriptions, an asset-expiry notice — and they arrive
**with no separator**. `extractBlocks` in `runs/harness/normalise-captures.mjs` does not split
them, so prose ends up concatenated with code and a TSX loader rejects the file.

**Six of the ten runs that do not render fail for this reason alone.** Their captures are
otherwise sound.

## Steps

1. Identify the sentinels that begin each advisory block, from the captures themselves rather
   than from documentation that does not exist.
2. Split on them in `extractBlocks`, emitting the code block and each advisory as separate
   entries distinguished by the `part` field the capture protocol already defines.
3. Re-normalise **to a new versioned output**, never over the existing index. The nineteen
   indexes were already rebuilt once from the runs' own markdown, with every `capturedAt` inside
   64 ms; overwriting would add a second undisclosed layer.
4. Count how many runs render before and after.

## Acceptance criteria

- Each advisory block is its own entry with `part` set; the code block is unchanged bytes.
- The re-normalisation is a new versioned artifact and the original is untouched.
- **The count of rendering runs is reported before and after** — a number, not an impression.

## Verification

`node runs/harness/render-design.mjs --run <run>` over all nineteen, counted both ways.
