---
type: use-case
schema_version: 1
id: UC-NOJIRA-figma-to-code-11
title: A requirement with no corpus case cannot be activated
description: Proves the one-requirement-one-case rule is enforced by a check rather than remembered by a person
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-09-30T08:20:00Z
updated: 2026-09-30T08:20:00Z
tags: [process, governance]
tests_task: T-NOJIRA-figma-to-code-11
---

# A requirement with no corpus case cannot be activated

> Verifies [T-NOJIRA-figma-to-code-11](../../work/NOJIRA-figma-to-code/T-NOJIRA-figma-to-code-11-requirement-registry.md).

## Preconditions
The registry is implemented and seeded with the thirty-one requirements from the prior attempt, all at proposed.

## Scenario
Attempt to set one seeded requirement to active without attaching a corpus case. Then attach a case to another and activate it.

## Result
The first attempt is refused with a message naming the requirement and the missing case. The second succeeds and records the measured score delta on the entry. All remaining seeded requirements stay at proposed with no cases.

## Edge cases
An entry marked model-judged rather than computed is accepted only with a written reason attached.
