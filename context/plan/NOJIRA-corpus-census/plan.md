---
type: plan
schema_version: 1
id: P-NOJIRA-corpus-census
title: Know what the nineteen runs actually are, before building anything on them
description: Repair the one splitter bug that stops six runs rendering, inventory every run's provenance and reference state, and build the geometry comparator — producing the first fidelity number in the effort and the decision of whether the HTML plan runs at full scope
jira: null
resource: null
status: approved
phase: approved
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T00:00:00Z
tags: [figma, design-to-code, measurement, corpus]
source_analysis: A-NOJIRA-figma-to-code
slice: corpus-census
depends_on: []
approved_by: marcin.ludwig
approved_date: 2026-10-05
open_questions: []
---

# Know what the nineteen runs actually are, before building anything on them

> Derived from [A-NOJIRA-figma-to-code](../../analyzes/NOJIRA-figma-to-code/analysis.md); ordered
> by [`what-to-do-next.md`](../../analyzes/NOJIRA-figma-to-code/what-to-do-next.md); grounded in
> the feasibility measurements recorded in
> [`sequencing.md`](../../analyzes/NOJIRA-figma-to-code/sequencing.md).

## Goal

Two plans were approved assuming nineteen usable runs. **Nine render.** This slice establishes
what the corpus actually contains and produces the first fidelity number the effort has ever had.

It exists because both downstream plans' scope depends on the answer, and the answer costs days.

## Approach

**Measure before building, using only what exists.** No Figma call, no schema, no new plan. Three
of the four tasks reuse scripts already in `runs/harness/`.

The sequence is deliberate: the splitter fix comes first because it changes the denominator every
later number is computed over, and the census comes before the comparator because a comparator
run over unknown provenance produces a number nobody can interpret.

**Two risks this slice introduces, and the rule for each.** Re-normalising changes derived
artifacts that downstream work will read — so **a re-normalised index is a new versioned artifact,
never an overwrite**, and the original run markdown stays the source of truth. And a fidelity
number computed here will be compared against later ones — so the comparator's inputs and
version are recorded with every figure it emits.

## Scope

**In:** the `extractBlocks` repair, the census, the geometry comparator, and running it where the
population supports it.

**Out:** the common format and its schema (`P-NOJIRA-html-contract`), anything that calls Figma
(`P-NOJIRA-figma-ingestion`), the overlay, and any repair to a capture's _content_ — a capture
that is agent prose stays agent prose and is classified as such.

## Work breakdown

- `T-NOJIRA-corpus-census-01` — Repair the advisory-block split in `normalise-captures.mjs`
  (`extractBlocks`). The blocks arrive with no separator and prose ends up concatenated with code,
  which a TSX loader then rejects. **Six of the ten non-rendering runs fail for this reason
  alone.** Output is a versioned re-normalisation, not an overwrite.
- `T-NOJIRA-corpus-census-02` — `census.json`: per run, the **provenance class** (Figma's bytes /
  reconstructed / summarised / agent prose), whether it renders, and the **reference state**
  (exact / downscaled with its factor / channel-halved / undeclared frame).
- `T-NOJIRA-corpus-census-03` — The geometry comparator: metadata's declared `x/y/w/h`, summed
  through the ancestor chain, against `getBoundingClientRect` in the browser `shoot.mjs` already
  drives.
- `T-NOJIRA-corpus-census-04` — Run it wherever the census says the population supports it, and
  publish the figures with their N.

## Risks & dependencies

**The splitter fix may not recover six runs.** The estimate comes from one measurement pass. If
it recovers two, the corpus stays near nine and the HTML plan narrows — which is the decision this
slice exists to force, so a disappointing result is still a result.

**The comparison population may stay small.** Declared and rendered node sets barely overlap
because `get_metadata` stops where Code Connect starts; today the overlap is ~330 on two runs and
zero on four. If N stays around four after the repair, **fidelity-from-declared-geometry is built
on four data points**, and the honest conclusion is that the corpus must be re-captured under the
protocol before it can carry a fidelity claim. Better learned here than after the schema.

**Re-normalisation compounds an existing problem.** Every index was already rebuilt once from the
runs' own markdown, with all nineteen timestamps inside 64 ms. Versioning the output is what stops
this slice adding a second undisclosed layer.

**Nothing depends on this slice that cannot start without it.** `P-NOJIRA-figma-ingestion` tasks
03–05 are independent and should run in parallel.

## Acceptance

- `extractBlocks` splits on the known sentinels, and the count of rendering runs is reported
  **before and after** — a number, not an impression.
- `census.json` carries all nineteen runs with no `unknown` provenance. A run whose class cannot
  be determined is itself a finding and must be named, not defaulted.
- The geometry comparator is tested against a fixture with known offsets before it is run on a
  real capture.
- Every published figure states its **N** and the comparator version. A figure without N is not
  published.
- The slice ends with an explicit recommendation: **full scope or narrowed**, for
  `P-NOJIRA-html-contract`, with the number that decides it.

## Approval

**Approved 2026-10-05 by marcin.ludwig.** Small, reversible, and it gates two larger plans —
approving it is cheaper than deciding its scope twice.
