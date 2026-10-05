---
type: claim
schema_version: 1
id: CL-NOJIRA-figma-ingestion-01
title: marcin.ludwig implements T-NOJIRA-figma-ingestion-01
description: 'Claim on the per-file mode decision derived from Code Connect externals'
jira: null
resource: null
status: released
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T18:00:00Z
tags: [board]
unit: T-NOJIRA-figma-ingestion-01
---

# marcin.ludwig implements T-NOJIRA-figma-ingestion-01

> Claims [T-NOJIRA-figma-ingestion-01](../work/NOJIRA-figma-ingestion/01-mode-decision.md).

## Notes

Released, not done. The script and its nine tests are delivered and green; the two-file
verification needs `list_file_components_for_code_connect`, which the local Dev Mode server does
not publish and the remote gates behind OAuth. Unblocking condition in the task's `## Result`.
