---
type: use-case
schema_version: 1
id: UC-NOJIRA-figma-to-code-14
title: A difference inside the spread is reported as indistinguishable, not as an improvement
description: Proves the bench cannot be used to justify a change that did nothing
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-09-30T12:25:00Z
updated: 2026-09-30T12:25:00Z
tags: [measurement, experiments]
tests_task: T-NOJIRA-figma-to-code-14
---

# A difference inside the spread is reported as indistinguishable, not as an improvement

> Verifies [T-NOJIRA-figma-to-code-14](../../work/NOJIRA-figma-to-code/T-NOJIRA-figma-to-code-14-experiment-comparison.md).

## Preconditions
Repeated-run mode and cost accounting are implemented, and at least one corpus case has a retained
result with a non-zero spread.

## Scenario
Run the case again with no change at all, and compare the two runs. Then change one stage's model
tier, run a third time, and compare that against the first.

## Result
The first comparison reports a delta inside the combined spread and states **indistinguishable** in
words, not merely two numbers a reader could interpret as a gain. The second reports both means,
both spreads, the quality delta, the cost delta, and a verdict — and names what differed between the
configurations from stored identity rather than from anything typed by the person running it.

## Edge cases
Comparing runs taken against different corpus freeze stamps is refused, with both stamps named. A
comparison that looks valid but rests on a changed corpus is the one failure this check exists to
prevent.

A series of more than two runs is readable as a trend, and a single anomalous run in the middle of
it remains individually inspectable rather than being smoothed away.
