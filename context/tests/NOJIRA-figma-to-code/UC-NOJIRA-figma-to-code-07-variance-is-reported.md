---
type: use-case
schema_version: 1
id: UC-NOJIRA-figma-to-code-07
title: Repeated runs report spread alongside the mean, and an unstable case is labelled before it is scored
description: Proves repeatability itself is measured, which is the point of the whole slice
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-09-30T08:20:00Z
updated: 2026-09-30T08:20:00Z
tags: [determinism, measurement]
tests_task: T-NOJIRA-figma-to-code-07
---

# Repeated runs report spread alongside the mean, and an unstable case is labelled before it is scored

> Verifies [T-NOJIRA-figma-to-code-07](../../work/NOJIRA-figma-to-code/T-NOJIRA-figma-to-code-07-variance-reporting.md).

## Preconditions
Repeated-run mode is implemented and the corpus is frozen and registered.

## Scenario
Run every case with `--repeat 3`. Inspect the aggregate and then open the individual runs behind one case.

## Result
Mean and spread are reported per metric per case, not only for the composite. Any case whose spread exceeds the configured limit is labelled unstable ahead of its mean. Every individual run remains retained and openable after the aggregate is written. The report states, where the numbers are, that a difference smaller than the spread is not a change.

## Edge cases
A case that produces an identical result three times reports zero spread rather than omitting the field.
