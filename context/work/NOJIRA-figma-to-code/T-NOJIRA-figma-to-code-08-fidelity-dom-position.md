---
type: task
schema_version: 1
id: T-NOJIRA-figma-to-code-08
title: "Fidelity dimension: DOM position accuracy"
description: Compare each rendered element against the Figma bounding box it came from, within a stated tolerance
jira: null
resource: null
status: todo
independent: false
owner: marcin.ludwig
created: 2026-09-30T08:20:00Z
updated: 2026-09-30T08:20:00Z
tags: [fidelity, measurement]
source_plan: P-NOJIRA-figma-to-code
depends_on: [T-NOJIRA-figma-to-code-03, T-NOJIRA-figma-to-code-06]
---

# Fidelity dimension: DOM position accuracy

> From [P-NOJIRA-figma-to-code](../../plan/NOJIRA-figma-to-code/plan.md).

## Objective
The first of the two fidelity dimensions, and the sharper signal of the pair: it is fully
deterministic, it needs no image comparison, and it localises a failure to a named element rather
than to a region of pixels.

It also subsumes most of what the existing validation prompt asks a model to notice by eye — width
against container, inset on four sides, shared edges across rows are all arithmetic on rectangles.

## Steps
- [ ] For every accounted element, compare the rendered rectangle against the Figma bounding box on all four measures
- [ ] Score as the fraction of elements within tolerance, and report every failing element by name with its measured deltas
- [ ] Derive the checks the existing validation prompt performs by eye — element width against its container, child inset per side, shared left edge and centreline across rows — from the same rectangles, as computed results rather than prompt instructions
- [ ] Make the tolerance a stated, configurable value, not a constant buried in the implementation

## Acceptance criteria
- [ ] Every failing element is named with its four deltas — no aggregate-only output
- [ ] The checks the validation prompt currently asks for by eye are computed here and reported as pass or fail per element
- [ ] The score is stable across repeated runs on unchanged input

## Verification
Run against a corpus case, then shift one element by a known offset in CSS and confirm the report
names that element with the expected delta.
- Use case: `UC-NOJIRA-figma-to-code-08` — `../../tests/NOJIRA-figma-to-code/UC-NOJIRA-figma-to-code-08-position-drift-is-localised.md`
