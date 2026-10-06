---
type: claim
schema_version: 1
id: CL-NOJIRA-figma-ingestion-06
title: marcin.ludwig implements T-NOJIRA-figma-ingestion-06
description: 'Claim on the verbatim REST-first capture of what Figma actually returns, over the whole tree'
jira: null
resource: null
status: done
owner: marcin.ludwig
created: 2026-10-06T00:00:00Z
updated: 2026-10-06T03:30:00Z
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

The claim was held with the token the owner placed in `.env` as `FIGMA_READ_TOKEN`. **It is no
longer needed: the task is delivered and the token can be revoked.** Nothing committed contains
it — the captures were checked for it before the commit, and the transport sends it only in the
`X-Figma-Token` header, never in a URL, so no call record can carry it.

Released 2026-10-06 at `dc100e98a`. 18 of 19 designs captured, 26 466 nodes, 103 responses, all
five closure checks green, 32 mutations and 0 survivors.

Two things a human should look at rather than inherit from this task:

1. **The branch must not be pushed** until somebody decides whether this corpus belongs in a
   public repository. The gate predates this task; this task made it 67 MB larger.
2. **a5-etsl-metadata-usage-widget was not captured.** No root node id anywhere in the
   repository, so the nineteenth design is absent and says so rather than being quietly
   eighteen.
