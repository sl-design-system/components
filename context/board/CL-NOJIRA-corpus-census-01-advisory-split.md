---
type: claim
schema_version: 1
id: CL-NOJIRA-corpus-census-01
title: marcin.ludwig implements T-NOJIRA-corpus-census-01
description: 'Claim on the advisory-block split repair in normalise-captures.mjs'
jira: null
resource: null
status: done
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T17:05:00Z
tags: [board]
unit: T-NOJIRA-corpus-census-01
---

# marcin.ludwig implements T-NOJIRA-corpus-census-01

> Claims [T-NOJIRA-corpus-census-01](../work/NOJIRA-corpus-census/01-advisory-split.md).

## Notes

Delivered in `cbe4455ef`. The split needed three paths, not one — `extractBlocks`, the
continuation branch, and the region ahead of the code — and the repair is worth +3 runs, not
the +6 the task file estimated. Numbers in the task's `## Result`.
