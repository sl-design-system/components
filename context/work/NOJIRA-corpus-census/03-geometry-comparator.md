---
type: task
schema_version: 1
id: T-NOJIRA-corpus-census-03
title: The geometry comparator
description: Figma declared geometry against the rendered box, with no reference image involved
jira: null
resource: null
status: in-progress
independent: true
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-07T13:20:00Z
tags: [fidelity, geometry, measurement]
source_plan: P-NOJIRA-corpus-census
depends_on: []
---

# The geometry comparator

## Objective

The first fidelity measurement in the effort, and it needs **no raster**: metadata's declared
`x/y/w/h` against `getBoundingClientRect` in the browser `shoot.mjs` already drives.

Metadata geometry is the only **independent** statement of position — comparing the build against
`get_design_context`, which it was generated from, is close to tautological.

**It does not depend on the census.** Building and testing the comparator needs a fixture with
known offsets, not the corpus — the census decides _which runs to point it at_, which is task 04.
Keeping it serial would have made the only multi-day task in this plan wait on hours of work for
no reason.

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

## Result

`runs/harness/compare-geometry.mjs` with `compare-geometry.test.mjs` (15 tests; 561 in the harness
suite, `tsc` clean). Deterministic output, no timestamp.

```
node runs/harness/compare-geometry.mjs --run runs/2026-10-01-<slug> [--html <path>] [--out <file.json>]
```

### Fixture first, as the task demands

`runs/harness/fixtures/geometry-metadata.txt` declares a root frame at canvas `(78, 248)` — a
non-zero origin on purpose — with parent-relative children; `geometry-rendered.html` places them
frame-relative with three deliberately injected offsets: `1:4` moved `dx +7, dy −3`, `1:5` widened
by `12`, `1:3` exact. The comparator found **exactly those** and nothing else: `1:4` distance
`7.62` (√58), `1:3` and `1:5` distance `0`, `dwidth 12` on `1:5`. Step 1 reuses `parseBoxes`, which
already sums the ancestor chain; the fixture pins that `1:3` resolves to frame-relative
`(30, 40)`, not `(108, 288)`.

### What is counted separately rather than dropped

- **Declared but not rendered** → `declaredOnly`; **rendered but not declared** → `renderedOnly`.
  Fixture: `['1:2', '1:9']` and `['9:9']`.
- **Placed wrappers.** `buildBody` positions each region's wrapper `<div data-region data-node-id>`
  straight from the metadata box, so measuring it against the metadata would score the harness's
  own arithmetic. Wrappers are excluded and counted as `placedWrappers`. Only the inner
  design-context elements, laid out by CSS, are an independent measurement — this exclusion is the
  reason the number means anything.
- **Repeated ids** → `duplicateIds`, first occurrence measured, collision named instead of
  last-element-wins.

### Refusal

An undeclared root frame is a refusal (`frame-undeclared`, exit 1), never a measurement against
`FABRICATED_FRAME`. Missing metadata or HTML exit 1 by name; both negative controls are tested.

### One read-only run, to prove it does not fall over on real input

`a7-myportal-materials-overviews`, stdout only, folder unchanged: **compared 331**, declaredOnly 19,
renderedOnly 237, placedWrappers 6, duplicateIds 0, maxDistance 157.28 px, meanDistance 21.65 px,
within 1 px 46, within 4 px 93. The 331 is the figure `sequencing.md` estimated as "~330
overlapping nodes". The 237 rendered-only ids are the design-context's instance-path ids
(`I…;…`) that `get_metadata` does not list — a join-key question for task 04, not a layout one.
None of this is a verdict; which runs the comparator is pointed at, and what a mismatch admits, is
`T-NOJIRA-corpus-census-04`.

### Out-of-scope edits, surfaced

Two lines in the `runs/harness/tsconfig.json` include register. `render-design.mjs`, `shoot.mjs`
and `census.mjs` untouched.
