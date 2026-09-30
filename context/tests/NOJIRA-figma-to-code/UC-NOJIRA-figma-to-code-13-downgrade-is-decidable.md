---
type: use-case
schema_version: 1
id: UC-NOJIRA-figma-to-code-13
title: Downgrading a stage to a cheaper model produces a decidable result
description: Proves cost and quality can be read against each other, which is what makes model-tier choices evidence-based
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-09-30T10:10:00Z
updated: 2026-09-30T10:10:00Z
tags: [cost, model-routing, measurement]
tests_task: T-NOJIRA-figma-to-code-13
---

# Downgrading a stage to a cheaper model produces a decidable result

> Verifies [T-NOJIRA-figma-to-code-13](../../work/NOJIRA-figma-to-code/T-NOJIRA-figma-to-code-13-cost-and-model-tier-accounting.md).

## Preconditions
Cost accounting is implemented, the corpus is frozen, and a baseline with repetition exists for at
least one case.

## Scenario
Run the case with repetition and note the score, its spread, and the cost per tier and per stage.
Downgrade one pipeline stage to a cheaper model tier — or to a lower effort setting — and run again
with the same repetition.

## Result
Both runs report cost per tier and per stage, each with its own spread. The recorded tier matches
what the stage actually ran at, verifiable independently of what was configured. The comparison
presents the score delta and the cost delta together and states plainly whether the score moved
beyond its measured spread, so the downgrade can be kept or reverted on evidence rather than on
impression.

## Edge cases
A stage that silently fell back to a different tier than the one requested is reported at the tier it
ran at, and the discrepancy is visible rather than averaged away.

A downgrade that reduces cost while moving the score beyond its spread is reported as a regression,
not as a trade to be judged by whoever reads it.
