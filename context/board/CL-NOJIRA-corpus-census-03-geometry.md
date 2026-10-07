---
type: claim
schema_version: 1
id: CL-NOJIRA-corpus-census-03
title: marcin.ludwig implements T-NOJIRA-corpus-census-03
description: 'Claim on the geometry comparator: metadata boxes summed to absolute against getBoundingClientRect, fixture-first'
jira: null
resource: null
status: done
owner: marcin.ludwig
created: 2026-10-07T13:08:00Z
updated: 2026-10-07T13:24:00Z
tags: [board]
unit: T-NOJIRA-corpus-census-03
---

# marcin.ludwig implements T-NOJIRA-corpus-census-03

> Claims [T-NOJIRA-corpus-census-03](../work/NOJIRA-corpus-census/03-geometry-comparator.md).

## Notes

Started 2026-10-07 from Copilot CLI on `feature/figma-to-code-quality-harness`, right after
census-02 (`7d71496b6`). Baseline green: `tsc -p runs/harness` clean, 546 harness tests passing.
Fixture-first per the task: no corpus run is measured until the comparator finds exactly the
injected offsets.

Done 2026-10-07, commit `bf0b6ca1eed883f13f8a71d26c357905eae4b5c3`. Implemented by a cheap
subagent; on review one accounting gap was closed before commit — a repeated `data-node-id` was
silently last-wins, now counted in `duplicateIds`. Fixture offsets found exactly; a7 read-only:
331 compared. 561 harness tests green, `tsc` clean. Released.
