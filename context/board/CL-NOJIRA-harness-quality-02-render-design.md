---
type: claim
schema_version: 1
id: CL-NOJIRA-harness-quality-02
title: marcin.ludwig implements T-NOJIRA-harness-quality-02
description: 'Claim on making render-design.mjs testable without changing a byte of its output'
jira: null
resource: null
status: done
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T00:00:00Z
tags: [board]
unit: T-NOJIRA-harness-quality-02
---

# marcin.ludwig implements T-NOJIRA-harness-quality-02

> Claims [T-NOJIRA-harness-quality-02](../work/NOJIRA-harness-quality/02-render-design.md).

## Notes

Delivered. The decomposition was proved byte-identical over all nineteen runs before any fix went
in, every export was mutation-checked, and the fabricated-frame control was shown red — on a
fixture, because all six corpus runs that hit the fallback turned out to declare a frame the
reader never searched for.
