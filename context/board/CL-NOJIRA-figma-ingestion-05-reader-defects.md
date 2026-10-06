---
type: claim
schema_version: 1
id: CL-NOJIRA-figma-ingestion-05
title: marcin.ludwig implements T-NOJIRA-figma-ingestion-05
description: 'Claim on the two reader defects the remote server exposed, before anything is measured on them'
jira: null
resource: null
status: done
owner: marcin.ludwig
created: 2026-10-06T00:00:00Z
updated: 2026-10-06T05:00:00Z
tags: [board]
unit: T-NOJIRA-figma-ingestion-05
---

# marcin.ludwig implements T-NOJIRA-figma-ingestion-05

> Claims [T-NOJIRA-figma-ingestion-05](../work/NOJIRA-figma-ingestion/05-reader-defects-remote.md).

## Notes

Claimed 2026-10-06. Pre-gates green: clean tree, `T-NOJIRA-figma-ingestion-03` done, 431 tests
and `tsc --noEmit` over seventeen files.

Both defects turn a successful answer into an absence, which is the failure mode this plan
exists to remove. `T-NOJIRA-figma-ingestion-04` measures on these instruments, so they are fixed
before it runs rather than after.

Released 2026-10-06 at `8ad685ae1`. 19 mutations, 0 survivors; 452 tests.

Three things a reader should carry out of this rather than re-derive:

1. **They were two defects, not one.** One sent a mapped component to the design system team as
   cause E; the other sent it to the pipeline as cause A. The task's own prose merged them.
2. **`334:20594` is a frame**, not the instance the Verification assumed, and frames are not
   probed — so it never appeared as a descent in the first place. Its sibling `334:20593` is the
   instance, and that is where the fix was measured.
3. **The fourteen-case prediction is recorded and dated in the task**, before `T-04` runs: eight
   convert, five turn on causes A and B, and a5 cannot be counted because nothing in the
   repository identifies it. The task predicted nine; eight is what the captures show.

`T-NOJIRA-figma-ingestion-04` is now unblocked.
