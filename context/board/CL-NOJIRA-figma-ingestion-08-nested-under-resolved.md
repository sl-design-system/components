---
type: claim
schema_version: 1
id: CL-NOJIRA-figma-ingestion-08
title: marcin.ludwig implements T-NOJIRA-figma-ingestion-08
description: 'Claim on the third reader defect of one shape — a node inside a resolved instance filed as a pipeline bug'
jira: null
resource: null
status: done
owner: marcin.ludwig
created: 2026-10-06T00:00:00Z
updated: 2026-10-06T11:00:00Z
tags: [board]
unit: T-NOJIRA-figma-ingestion-08
---

# marcin.ludwig implements T-NOJIRA-figma-ingestion-08

> Claims [T-NOJIRA-figma-ingestion-08](../work/NOJIRA-figma-ingestion/08-nested-under-resolved.md).

## Notes

Claimed 2026-10-06. Pre-gates green: clean tree, `T-NOJIRA-figma-ingestion-05` done.

`T-NOJIRA-figma-ingestion-04` is released and waiting on this. The defect was found by its
Phase A against the remote server, and the evidence is in `runs/probe-04/`.

Released 2026-10-06 at `cbd556b40`. On Phase A's own shape: **2 unresolved, cause B, exit 6**
becomes **0 unresolved, exit 0.** 11 mutations, 0 survivors; 490 tests.

`T-NOJIRA-figma-ingestion-04` is unblocked and can be re-claimed. What it still needs is in its
own body: eight mode decisions, Phase A per design for the conversion count, and Phase B only
for whatever converted. Its prediction — eight and six — has still not been read against
anything, and should not be until there is a count.

One thing to carry rather than re-derive: **three defects of one shape in three consecutive
tasks, none of them findable from the corpus.** Every one needed a server that answers. That is
now the reason 04 runs against the remote rather than against recordings, and it is evidence
rather than a preference.
