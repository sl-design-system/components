---
type: claim
schema_version: 1
id: CL-NOJIRA-harness-quality-03
title: marcin.ludwig implements T-NOJIRA-harness-quality-03
description: 'Claim on making theme-match.mjs testable and able to report no match or a tie'
jira: null
resource: null
status: done
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T00:00:00Z
tags: [board]
unit: T-NOJIRA-harness-quality-03
---

# marcin.ludwig implements T-NOJIRA-harness-quality-03

> Claims [T-NOJIRA-harness-quality-03](../work/NOJIRA-harness-quality/03-theme-match.md).

## Notes

Delivered. 19/19 outputs byte-identical across the decomposition, then one verdict changed —
`a7-myportal-materials-overviews`, which had been settling a 100% hex tie by directory order. The pre-commit formatter then ate the regression fixture, which is why
`runs/harness/fixtures` is now in `.oxfmtrc.json`'s ignore list.
