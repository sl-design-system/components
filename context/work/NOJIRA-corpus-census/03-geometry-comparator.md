---
type: task
schema_version: 1
id: T-NOJIRA-corpus-census-03
title: The geometry comparator
description: Figma declared geometry against the rendered box, with no reference image involved
jira: null
resource: null
status: todo
independent: false
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T00:00:00Z
tags: [fidelity, geometry, measurement]
source_plan: P-NOJIRA-corpus-census
depends_on: [T-NOJIRA-corpus-census-02]
---

# The geometry comparator

## Objective

The first fidelity measurement in the effort, and it needs **no raster**: metadata's declared
`x/y/w/h` against `getBoundingClientRect` in the browser `shoot.mjs` already drives.

Metadata geometry is the only **independent** statement of position — comparing the build against
`get_design_context`, which it was generated from, is close to tautological.

## Steps

1. Sum parent-relative metadata boxes through the ancestor chain to absolute coordinates.
2. Measure the rendered elements in the existing Chromium instance.
3. Join on node id and report per-node deltas.
4. **Test against a fixture with known offsets before running on any capture.**

## Acceptance criteria

- Tested against a fixture with known offsets first.
- Reports per-node deltas and the **count of nodes it could compare**.
- Where a node is declared but not rendered, or rendered but not declared, it is counted
  separately rather than dropped.

## Verification

Fixture with deliberately injected offsets; the comparator must find exactly those.
