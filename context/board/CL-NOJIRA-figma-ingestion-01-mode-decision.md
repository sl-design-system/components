---
type: claim
schema_version: 1
id: CL-NOJIRA-figma-ingestion-01
title: marcin.ludwig implements T-NOJIRA-figma-ingestion-01
description: 'Claim on the per-file mode decision derived from Code Connect externals'
jira: null
resource: null
status: done
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T18:00:00Z
tags: [board]
unit: T-NOJIRA-figma-ingestion-01
---

# marcin.ludwig implements T-NOJIRA-figma-ingestion-01

> Claims [T-NOJIRA-figma-ingestion-01](../work/NOJIRA-figma-ingestion/01-mode-decision.md).

## Notes

Delivered and verified live on both files. Two defects only a real response could expose: the
discriminator is `external: true`, not the `name`/`assetKey` pair, and the payload arrives
escaped inside the MCP envelope — the reader found zero externals in 60 KB until it handled that.
