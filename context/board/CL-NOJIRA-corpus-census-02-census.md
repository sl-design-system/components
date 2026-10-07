---
type: claim
schema_version: 1
id: CL-NOJIRA-corpus-census-02
title: marcin.ludwig implements T-NOJIRA-corpus-census-02
description: 'Claim on the corpus census: provenance class, render state and reference state per run, written to census.json'
jira: null
resource: null
status: in-progress
owner: marcin.ludwig
created: 2026-10-07T13:55:00Z
updated: 2026-10-07T13:55:00Z
tags: [board]
unit: T-NOJIRA-corpus-census-02
---

# marcin.ludwig implements T-NOJIRA-corpus-census-02

> Claims [T-NOJIRA-corpus-census-02](../work/NOJIRA-corpus-census/02-census-and-reference-integrity.md).

## Notes

Started 2026-10-07 from Copilot CLI on `feature/figma-to-code-quality-harness`. Baseline green:
`tsc -p runs/harness` clean, 510 harness tests passing. No Figma call is needed; every input is on
disk (`render-failure-taxonomy.md`, the nineteen run folders, `render-design.mjs --run`).
