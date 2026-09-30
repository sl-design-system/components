---
type: use-case
schema_version: 1
id: UC-NOJIRA-figma-to-code-11
title: Text and layout containers are scored under different tiers, and a colour change fails
description: Proves tiered tolerance separates real defects from renderer noise
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-09-30T08:20:00Z
updated: 2026-09-30T08:20:00Z
tags: [fidelity, visual]
tests_task: T-NOJIRA-figma-to-code-11
---

# Text and layout containers are scored under different tiers, and a colour change fails

> Verifies [T-NOJIRA-figma-to-code-11](../../work/NOJIRA-figma-to-code/T-NOJIRA-figma-to-code-11-fidelity-pixelmatch.md).

## Preconditions
Per-component pixel comparison is implemented, with diff images retained.

## Scenario
Run the corpus and inspect the diff images by eye. Check which tier was applied to a text element versus a layout container. Then change one colour token in the generated output and re-run.

## Result
The tiers applied differ and each result states which one it used. Text passes despite sub-pixel font differences; the layout container is held to its stricter threshold. The colour change fails the affected element. Diff images exist for passing comparisons too, so a result can always be inspected.

## Edge cases
A rendered and reference pair with different dimensions is reported as a dimension mismatch, a distinct failure kind — never scaled to fit and reported as low similarity.
