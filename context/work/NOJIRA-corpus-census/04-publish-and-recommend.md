---
type: task
schema_version: 1
id: T-NOJIRA-corpus-census-04
title: Publish the figures, and recommend full scope or narrowed
description: Two fidelity numbers with their N, and the decision the downstream plan depends on
jira: null
resource: null
status: in-progress
independent: false
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-07T14:05:00Z
tags: [measurement, reporting, decision]
source_plan: P-NOJIRA-corpus-census
depends_on: [T-NOJIRA-corpus-census-02, T-NOJIRA-corpus-census-03]
---

# Publish the figures, and recommend full scope or narrowed

## Objective

Run the comparator wherever the census says the population supports it, and end the slice with
the decision `P-NOJIRA-html-artifacts` is waiting for.

Measured today: the overlap between declared and rendered node sets is ~330 on `a3` and `a7`, and
**zero on four runs**. The independent-comparison population may be about four.

**This is where the two strands join** — the census says which runs are admissible, the
comparator says what their geometry does. Neither alone produces a publishable figure.

## Steps

1. Run the comparator on every run the census admits.
2. Publish each figure **with its N** and the comparator version.
3. Write the recommendation: **full scope or narrowed**, with the number that decides it.

## Acceptance criteria

- **Every published figure states its N.** A figure without N is not published.
- The recommendation is explicit and carries the number behind it.
- If N stays near four after task 01, the recommendation says so plainly: the corpus must be
  re-captured under the protocol before it can carry a fidelity claim.

## Verification

The recommendation is readable by someone who was not in the session and leads to the same conclusion.

## Result

**Narrowed.** The recommendation, with every figure and its N, is
[`recommendation.md`](../../plan/NOJIRA-corpus-census/recommendation.md) beside the plan; the
figures are `runs/census-geometry.json` with per-node deltas in `runs/census-geometry/<run>.json`,
produced by `runs/harness/census-geometry.mjs` (12 tests) over the census and the comparator.

### The number that decides it

Nine of nineteen runs are admitted — Figma bytes, rendering, frame declared. **Five** of those have
an anchored overlap between declared and rendered nodes: `a7` 331, `a3` 205, `a4` 88, `b-sesame`
38, `a2` 10 — **N = 672 nodes**, 80 % in two runs. Four admitted runs have an overlap of **zero**:
each is a single region whose root has no metadata box, so nothing inside it has a position Figma
vouched for. Five is the plan's "near four", and its consequence is applied as written: build and
test the artifacts on five runs, publish five numbers, no corpus headline — and the corpus must be
re-captured under the protocol before it can carry a fidelity _claim_.

Across the 672 (comparator **v2**, index `captures-v2`, census v1): 151 within 1 px, 249 within
4 px, weighted mean 29.13 px, max 961 px. What is measured is the probe's reconstruction of
Figma's own design-context markup — the baseline a pipeline build will be compared against, not
the build; no build carries `data-node-id` yet.

### The instrument moved under the first figures — three times

The first aggregate reported 6 614 px on a 1280×768 frame and zero nodes within 4 px on eight runs.
All three causes were in the instrument, each is fixed in place with a test pinned to the shape
that produced it, and the comparator version is bumped to 2:

1. `parseBoxes` let a re-listed instance (`x="0" y="0"`, after the tree closes) clobber its in-tree
   position. First declaration now wins and anchors the expanded children.
2. An unboxed region's `margin: 8px 0` collapsed through `body`, shifting every placed region by
   `(0, +8)` on seven runs. `body` is now `display: flow-root`.
3. Nodes inside an unboxed region were scored against the probe's fallback position. They are now
   `unplaced`, counted on both sides and kept out of the join. Compared went 1 122 → 672.

### Out-of-scope edits, surfaced

`render-design.mjs` (`parseBoxes`, `buildBody`, `buildDocument`) and `compare-geometry.mjs` were
changed to fix the three defects above — task 03's deliverable, re-opened because the figures this
task publishes were wrong without it. `census.json` is byte-identical before and after.
`.oxfmtrc.json` ignores the generated geometry JSON so the generator's bytes stay canonical.
