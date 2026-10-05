---
type: task
schema_version: 1
id: T-NOJIRA-corpus-census-04
title: Publish the figures, and recommend full scope or narrowed
description: Two fidelity numbers with their N, and the decision the downstream plan depends on
jira: null
resource: null
status: todo
independent: false
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T00:00:00Z
tags: [measurement, reporting, decision]
source_plan: P-NOJIRA-corpus-census
depends_on: [T-NOJIRA-corpus-census-03]
---

# Publish the figures, and recommend full scope or narrowed

## Objective

Run the comparator wherever the census says the population supports it, and end the slice with
the decision `P-NOJIRA-html-artifacts` is waiting for.

Measured today: the overlap between declared and rendered node sets is ~330 on `a3` and `a7`, and
**zero on four runs**. The independent-comparison population may be about four.

## Steps

1. Run the comparator on every run the census admits.
2. Publish each figure **with its N** and the comparator version.
3. Write the recommendation: **full scope or narrowed**, with the number that decides it.

## Acceptance criteria

- **Every published figure states its N.** A figure without N is not published.
- The recommendation is explicit and carries the number behind it.
- If N stays near four after task 01, the recommendation says so plainly: the corpus must be
  re-captured under the protocol before it can carry a fidelity claim.

## Verification

The recommendation is readable by someone who was not in the session and leads to the same conclusion.
