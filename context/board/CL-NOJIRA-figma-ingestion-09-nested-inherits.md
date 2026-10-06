---
type: claim
schema_version: 1
id: CL-NOJIRA-figma-ingestion-09
title: marcin.ludwig implements T-NOJIRA-figma-ingestion-09
description: 'Claim on the fourth defect of one shape — a nested node carrying a second story about a situation its parent already explains'
jira: null
resource: null
status: done
owner: marcin.ludwig
created: 2026-10-06T00:00:00Z
updated: 2026-10-06T14:00:00Z
tags: [board]
unit: T-NOJIRA-figma-ingestion-09
---

# marcin.ludwig implements T-NOJIRA-figma-ingestion-09

> Claims [T-NOJIRA-figma-ingestion-09](../work/NOJIRA-figma-ingestion/09-nested-inherits-the-diagnosis.md).

## Notes

Claimed 2026-10-06. Pre-gates green: clean tree, `T-NOJIRA-figma-ingestion-08` done.

`T-NOJIRA-figma-ingestion-04` is released twice over and waiting on this. The task's own
Objective predicts this is the last blocker for the ten as-is designs — written before the fix,
so it can be shown wrong.

Released 2026-10-06 at `0c9ac7e25`. On Phase A's shape: `{B:1, C:1}` and exit 6 becomes
`{C:1}`, `nestedBelow: 1`, exit 0. On `walk-live-sticky-toc.json`: **28 unresolved becomes 13**,
and the thirteen that remain are cause A — the Dev Mode plateau, a real retrieval failure.
9 mutations, 0 survivors; 499 tests.

**The task's own prediction is not confirmed by it.** That this is the last blocker for the ten
as-is designs stays a prediction until `T-NOJIRA-figma-ingestion-04` walks one. 04 is unblocked
and can be re-claimed a third time.
