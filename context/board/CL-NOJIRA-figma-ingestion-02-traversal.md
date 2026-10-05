---
type: claim
schema_version: 1
id: CL-NOJIRA-figma-ingestion-02
title: marcin.ludwig implements T-NOJIRA-figma-ingestion-02
description: 'Claim on the scripted traversal that uses Code Connect as its stopping rule'
jira: null
resource: null
status: done
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T23:55:00Z
tags: [board]
unit: T-NOJIRA-figma-ingestion-02
---

# marcin.ludwig implements T-NOJIRA-figma-ingestion-02

> Claims [T-NOJIRA-figma-ingestion-02](../work/NOJIRA-figma-ingestion/02-traversal-stopping-rule.md).

## Notes

Delivered 2026-10-05 at `4330e5f5c`. Live verification found what the task was written about, in the
wild: thirteen Code Connect calls on one symbol, every one answering `{}` after ~31 seconds, and
fifteen nested ids the server emitted and would have refused. Twenty-eight nodes the old reading
calls unmapped, and not one of them is a missing mapping.

Also priced step 2: **per-node probing costs ~31 s per instance** against the Dev Mode server.
`T-NOJIRA-figma-ingestion-04` needs that figure before it plans fourteen re-runs.
