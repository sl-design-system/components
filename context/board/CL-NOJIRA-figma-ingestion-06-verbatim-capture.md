---
type: claim
schema_version: 1
id: CL-NOJIRA-figma-ingestion-06
title: marcin.ludwig implements T-NOJIRA-figma-ingestion-06
description: 'Claim on the verbatim REST-first capture of what Figma actually returns, over the whole tree'
jira: null
resource: null
status: in-progress
owner: marcin.ludwig
created: 2026-10-06T00:00:00Z
updated: 2026-10-06T00:00:00Z
tags: [board]
unit: T-NOJIRA-figma-ingestion-06
---

# marcin.ludwig implements T-NOJIRA-figma-ingestion-06

> Claims [T-NOJIRA-figma-ingestion-06](../work/NOJIRA-figma-ingestion/06-verbatim-capture.md).

## Notes

Claimed 2026-10-06.

**The `depends_on` gate is red and is being taken as soft**, on the precedent
`T-NOJIRA-figma-ingestion-02` set with 01. `T-NOJIRA-figma-ingestion-05` fixes two defects in
**`classifyMap`** — a map that answers about descendants, and `hasTemplate: true` without a
`snippet` — and makes the endpoint an explicit choice. This task writes bytes to disk and reads
none of them through that path: a capture that passed a response through a reader able to
summarise it would violate its own first acceptance criterion. The coupling is to 05's step 3,
no silent endpoint, which this task honours directly rather than waits for.

The claim is held with the token the owner placed in `.env` as `FIGMA_READ_TOKEN` and will
revoke when the task ends.
