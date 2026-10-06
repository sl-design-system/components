---
type: claim
schema_version: 1
id: CL-NOJIRA-figma-ingestion-04
title: marcin.ludwig implements T-NOJIRA-figma-ingestion-04
description: 'Claim on the fourteen-case probe, the measurement that can falsify this plan on its own'
jira: null
resource: null
status: in-progress
owner: marcin.ludwig
created: 2026-10-06T00:00:00Z
updated: 2026-10-06T12:00:00Z
tags: [board]
unit: T-NOJIRA-figma-ingestion-04
---

# marcin.ludwig implements T-NOJIRA-figma-ingestion-04

> Claims [T-NOJIRA-figma-ingestion-04](../work/NOJIRA-figma-ingestion/04-fourteen-case-probe.md).

## Notes

Claimed 2026-10-06. Pre-gates green: clean tree, `T-NOJIRA-figma-ingestion-05` done, 479 tests
and `tsc --noEmit` over seventeen files.

Phase A first, and it may end the unit: if none of the fourteen converts, the diagnosis is wrong
and Phase B is not run. The prediction it is measured against — eight convert, six turn on
causes A and B — was recorded and dated before the claim was taken.

**Released unfinished 2026-10-06**, at `b438293f2`, blocked on
`T-NOJIRA-figma-ingestion-08`.

Phase A ran and produced 29 verbatim Code Connect responses in `runs/probe-04/`. It established
the mechanism of the halt — all fourteen roots answer `{}`, three of them falsely, one is a
declared timeout, two are real — and then found a third reader defect of the same family as 05's
two: a node inside a **resolved** instance is filed as a pipeline bug, and the CLI halts on it.

No conversion count was produced and the prediction has not been read against anything. Both are
deliberate: a count taken through a known-broken classifier would be the fourth measurement
fault in this slice, and reading a prediction against a broken count would be the first
dishonest one.

**Re-claimed 2026-10-06** after `T-NOJIRA-figma-ingestion-08` landed at `cbd556b40`. Pre-gates
green: clean tree, 08 done, 490 tests and `tsc --noEmit` over seventeen files.

Resuming at the eight remaining mode decisions. The prediction is still unread.
