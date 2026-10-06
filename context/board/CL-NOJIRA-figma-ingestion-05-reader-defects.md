---
type: claim
schema_version: 1
id: CL-NOJIRA-figma-ingestion-05
title: marcin.ludwig implements T-NOJIRA-figma-ingestion-05
description: 'Claim on the two reader defects the remote server exposed, before anything is measured on them'
jira: null
resource: null
status: in-progress
owner: marcin.ludwig
created: 2026-10-06T00:00:00Z
updated: 2026-10-06T00:00:00Z
tags: [board]
unit: T-NOJIRA-figma-ingestion-05
---

# marcin.ludwig implements T-NOJIRA-figma-ingestion-05

> Claims [T-NOJIRA-figma-ingestion-05](../work/NOJIRA-figma-ingestion/05-reader-defects-remote.md).

## Notes

Claimed 2026-10-06. Pre-gates green: clean tree, `T-NOJIRA-figma-ingestion-03` done, 431 tests
and `tsc --noEmit` over seventeen files.

Both defects turn a successful answer into an absence, which is the failure mode this plan
exists to remove. `T-NOJIRA-figma-ingestion-04` measures on these instruments, so they are fixed
before it runs rather than after.
