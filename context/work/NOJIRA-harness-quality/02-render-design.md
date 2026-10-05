---
type: task
schema_version: 1
id: T-NOJIRA-harness-quality-02
title: Make render-design testable, and prove the decomposition changed nothing
description: '546 lines, zero exports, zero tests — and it produces every survivorship number in the effort, including the one figma-ingestion will be judged by'
jira: null
resource: null
status: todo
independent: false
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T00:00:00Z
tags: [harness, render, testing, zod]
source_plan: P-NOJIRA-harness-quality
depends_on: [T-NOJIRA-harness-quality-01]
---

# Make render-design testable, and prove the decomposition changed nothing

## Objective

`render-design.mjs` is the instrument. **9 of 19** comes out of it, and
`P-NOJIRA-figma-ingestion` will be measured against that figure. It is 546 lines with no
exported function and no test.

This task does not redesign it. It makes it testable and proves the reshaping was behaviour-
preserving, so a later plan can absorb or replace it cheaply.

## Steps

1. Write the use case first, with preconditions naming **real runs** — `a2-nsp-class-overview`
   renders 8 of 8 regions, `a6-itsl-collab-shared-folder` renders 0 of 3 and why.
2. Capture the before-state: run over all nineteen runs and keep the output as the comparison
   artifact.
3. Decompose into exported functions — at least JSX-to-HTML conversion, region placement from
   metadata, frame resolution, and the summary. The CLI becomes a thin shell over them.
4. Unit-test each in isolation, including the geometry: a fixture with **known offsets**, which
   the census plan already requires of the comparator.
5. Validate `captures/index.json` with zod at the read boundary. Reject, do not score — this is
   a measurement tool.
6. Add the negative control: the hardcoded `1440×1024` frame fallback. Three runs' metadata
   begins with prose, and the tool silently substitutes a **fabricated frame** rather than
   refusing. Make it report.

## Acceptance criteria

- Output over all nineteen runs is **byte-identical before and after**, `capturedAt` excepted —
  it is the run directory's mtime and restamps on every write.
- Every exported function has a unit test that fails when the function is broken.
- A malformed `index.json` is reported, never scored.
- **The negative control is shown going red** against a deliberately damaged input, not merely
  shown green against a good one.
- The run with an undeclared frame is named rather than measured against `1440×1024`.

## Verification

`node runs/harness/render-design.mjs --run <run> --index captures-v2` over all nineteen,
diffed against the kept before-state; then the damaged-input control.
