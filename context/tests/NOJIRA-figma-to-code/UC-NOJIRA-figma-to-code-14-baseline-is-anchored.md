---
type: use-case
schema_version: 1
id: UC-NOJIRA-figma-to-code-14
title: The published baseline states what it measured and proves the pipeline was untouched
description: Proves the baseline is usable as the gate for slice 2
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-09-30T08:20:00Z
updated: 2026-09-30T08:20:00Z
tags: [baseline, milestone]
tests_task: T-NOJIRA-figma-to-code-14
---

# The published baseline states what it measured and proves the pipeline was untouched

> Verifies [T-NOJIRA-figma-to-code-14](../../work/NOJIRA-figma-to-code/T-NOJIRA-figma-to-code-14-publish-baseline.md).

## Preconditions
Every preceding task is done and the corpus is frozen.

## Scenario
Run the full corpus with repetition in every mode each case supports. Publish the result. Run `git diff` over `tools/implement-design-plugin/` against the commit at which the slice began.

## Result
The published baseline carries mean and spread per case and per dimension, with diff artifacts linked. It records the exact pipeline commit measured. The `git diff` is empty. The written reading names which cases are too unstable for their mean to be quoted, and states whether the tiered tolerances absorbed the renderer difference or whether the fidelity dimension falls back to geometry alone.

## Edge cases
If any case is unstable, the baseline says so explicitly rather than publishing a mean that would later be read as a target.
