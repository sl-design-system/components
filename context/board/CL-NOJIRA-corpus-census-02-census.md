---
type: claim
schema_version: 1
id: CL-NOJIRA-corpus-census-02
title: marcin.ludwig implements T-NOJIRA-corpus-census-02
description: 'Claim on the corpus census: provenance class, render state and reference state per run, written to census.json'
jira: null
resource: null
status: done
owner: marcin.ludwig
created: 2026-10-07T11:55:00Z
updated: 2026-10-07T12:25:00Z
tags: [board]
unit: T-NOJIRA-corpus-census-02
---

# marcin.ludwig implements T-NOJIRA-corpus-census-02

> Claims [T-NOJIRA-corpus-census-02](../work/NOJIRA-corpus-census/02-census-and-reference-integrity.md).

## Notes

Started 2026-10-07 from Copilot CLI on `feature/figma-to-code-quality-harness`. Baseline green:
`tsc -p runs/harness` clean, 510 harness tests passing. No Figma call is needed; every input is on
disk (`render-failure-taxonomy.md`, the nineteen run folders, `render-design.mjs --run`).

Done 2026-10-07, commit `7d71496b6cf048721aae5405a749d6b115b54eea`. Implemented by a cheap subagent,
reviewed and corrected before commit: its 1 % exact-tolerance read two height-trimmed references as
exact; tightened to one pixel, which surfaces them as `mismatched` (so: exact 10, downscaled 6,
mismatched 2, channel-halved 1 refused). 9 of 19 render; no `unknown` provenance; 546 harness
tests green, `tsc` clean. Released.
