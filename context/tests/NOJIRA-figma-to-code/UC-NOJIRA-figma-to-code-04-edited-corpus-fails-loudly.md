---
type: use-case
schema_version: 1
id: UC-NOJIRA-figma-to-code-04
title: An edited corpus case fails the run instead of silently shifting the baseline
description: Proves the freeze guard works, which is what makes every later number comparable
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-09-30T08:20:00Z
updated: 2026-09-30T08:20:00Z
tags: [corpus, figma, determinism]
tests_task: T-NOJIRA-figma-to-code-04
---

# An edited corpus case fails the run instead of silently shifting the baseline

> Verifies [T-NOJIRA-figma-to-code-04](../../work/NOJIRA-figma-to-code/T-NOJIRA-figma-to-code-04-freeze-corpus.md).

## Preconditions
Three cases are registered against the design-system-owned Figma file, each with a recorded `lastModified`. A baseline run has completed.

## Scenario
Edit one copied node in the corpus Figma file — a padding change is enough. Re-run the full corpus.

## Result
The edited case fails with a message naming the case and both the recorded and the live stamp. It produces no score. The two unedited cases complete normally and are scored.

## Edge cases
A refresh performed through the documented procedure updates the stamp and passes; an edit outside that procedure never does.
