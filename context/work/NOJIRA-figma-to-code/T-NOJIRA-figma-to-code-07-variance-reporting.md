---
type: task
schema_version: 1
id: T-NOJIRA-figma-to-code-07
title: Repeated-run mode and variance reporting
description: Run the same input N times and report the spread alongside the mean, making repeatability itself a measured quantity
jira: null
resource: null
status: todo
independent: false
owner: marcin.ludwig
created: 2026-09-30T08:20:00Z
updated: 2026-09-30T08:20:00Z
tags: [determinism, measurement]
source_plan: P-NOJIRA-figma-to-code
depends_on: [T-NOJIRA-figma-to-code-06]
---

# Repeated-run mode and variance reporting

> From [P-NOJIRA-figma-to-code](../../plan/NOJIRA-figma-to-code/plan.md).

## Objective
This is the task the whole effort exists for. The reported problem is not that output is bad but
that it is inconsistent, and inconsistency is invisible to any single run. Until spread is a number
on the report, no one can tell an improvement from noise.

## Steps
- [ ] Implement `--repeat N`: run the same case N times against the same frozen input and collect every result
- [ ] Compute and report the spread alongside the mean for every metric, not only for the composite
- [ ] State in the report that a difference smaller than the observed spread is not a change — put the rule where the reader sees the numbers, not only in documentation
- [ ] Retain every individual run, not just the aggregate, so a suspicious outlier can be opened and examined
- [ ] Flag a case whose spread exceeds a configured limit as unstable, and say so before quoting its mean

## Acceptance criteria
- [ ] `--repeat 3` reports mean and spread per metric per case
- [ ] A case with high spread is labelled unstable in the report, ahead of its score
- [ ] Every individual run remains inspectable after the aggregate is written

## Verification
Run `--repeat 3` on all corpus cases. Confirm the spread is computed per metric and that the
individual runs are retained and openable.
- Use case: `UC-NOJIRA-figma-to-code-07` — `../../tests/NOJIRA-figma-to-code/UC-NOJIRA-figma-to-code-07-variance-is-reported.md`
