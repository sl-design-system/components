---
type: task
schema_version: 1
id: T-NOJIRA-harness-quality-02
title: Make render-design testable, and prove the decomposition changed nothing
description: '546 lines, zero exports, zero tests — and it produces every survivorship number in the effort, including the one figma-ingestion will be judged by'
jira: null
resource: null
status: done
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

## Outcome

Delivered 2026-10-05. 546 lines with no export became **24 exported functions and 83 tests**, and
the CLI at the foot of the file holds no logic.

- **Byte-identity, step 2's whole point:** the decomposition was measured with the frame fix
  pinned back to the old behaviour, so the comparison isolates the reshaping. **16/16 HTML
  byte-identical, 16/16 reports identical**, and the three runs that exit 1 did so with identical
  stderr. `capturedAt` never appears in this tool's output, so no field had to be excepted.
- **Mutation-checked, not merely covered.** A plausible wrong edit was applied to each of the 24
  exports in turn; three survived (`readRegions`, `CodeConnectSnippet`, `buildReport`) and gained
  tests until they did not. Coverage is not the criterion — a test that fails when the function
  breaks is.
- **The fabricated frame was six runs, not three — and the data was never missing.** `a4`, `a5`,
  `a9`, `b-itsl-collab-add-element`, `b-nsp-home` and `b-sanna-account-creation` all fell back,
  and all six **declare a root box**. The reader looked at line 0 only and matched `<frame` only,
  so it missed a root behind a prose header, behind an HTML comment, inside an escaped MCP
  envelope, and one spelled `<symbol`. Searching for it corrects six frames and leaves the other
  ten runs untouched to the byte.
- Because no corpus run is genuinely undeclared, the negative control is anchored to
  `fixtures/metadata-no-root.txt` rather than to `a9`. A control built on `a9` would now pass for
  the wrong reason, which is the failure this plan exists to stop.

## Verification

`node runs/harness/render-design.mjs --run <run> --index captures-v2` over all nineteen,
diffed against the kept before-state; then the damaged-input control.
