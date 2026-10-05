---
type: claim
schema_version: 1
id: CL-NOJIRA-figma-ingestion-03
title: marcin.ludwig implements T-NOJIRA-figma-ingestion-03
description: 'Claim on the five-cause classification of unresolved nodes, with owners'
jira: null
resource: null
status: done
owner: marcin.ludwig
created: 2026-10-06T00:00:00Z
updated: 2026-10-06T00:30:00Z
tags: [board]
unit: T-NOJIRA-figma-ingestion-03
---

# marcin.ludwig implements T-NOJIRA-figma-ingestion-03

> Claims [T-NOJIRA-figma-ingestion-03](../work/NOJIRA-figma-ingestion/03-five-cause-classification.md).

## Notes

Delivered 2026-10-06 at `b5df6480b`. The granularity instability the control measured has a mechanism:
**135 suggestions for a walk of 13 instances**, 121 of them the library's internals in the same
field as the design's own nodes. Stability was then measured rather than argued — two live
traversals, byte-identical diagnoses.

Step 1 of the task did not survive contact: the tool takes `nodeId` only and returns one id per
suggestion, so the `mainComponentNodeId`/`instanceNodeId` pair it relied on does not exist. The
traversal supplies an exact discriminator instead.

Flagged for a human decision: the suggestions response ends by instructing an agent to call
`send_code_connect_mappings` against the user's Figma file.
