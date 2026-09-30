---
type: use-case
schema_version: 1
id: UC-NOJIRA-figma-to-code-16
title: A pipeline change with no rerun is flagged, and an unchanged rerun agrees with itself
description: Proves the measurement happens because of structure rather than memory, and that the spread is honest
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-09-30T23:40:00Z
updated: 2026-09-30T23:40:00Z
tags: [measurement, process, ci]
tests_task: T-NOJIRA-figma-to-code-16
---

# A pipeline change with no rerun is flagged, and an unchanged rerun agrees with itself

> Verifies [T-NOJIRA-figma-to-code-16](../../work/NOJIRA-figma-to-code/T-NOJIRA-figma-to-code-16-rerun-policy.md).

## Preconditions
The baseline is published, comparison across runs works, and the rerun command exists.

## Scenario
Make a change under the pipeline's paths and open it without running the bench. Separately, run the
scheduled rerun twice with nothing changed at all between them. Finally, refresh one corpus case and
attempt to compare a post-refresh run against a pre-refresh one.

## Result
The unmeasured change is flagged by CI, naming what changed and that no rerun is recorded against
it. The two unchanged runs agree within the measured spread. The cross-refresh comparison is
refused, naming both freeze stamps, rather than producing a number that looks valid.

## Edge cases
If the two unchanged runs disagree beyond the spread, the finding is about the **bench**, not the
pipeline: the spread is understated and every verdict resting on it is weaker than it reads. That
outcome must be surfaced as a bench defect rather than logged as pipeline variance.

A change that touches only documentation or tests should not be flagged — otherwise the flag
becomes noise and people learn to ignore it, which is worse than not having it.
