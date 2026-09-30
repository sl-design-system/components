---
type: use-case
schema_version: 1
id: UC-NOJIRA-figma-to-code-10
title: A known CSS offset shows up as a named element with the expected delta
description: Proves the geometry dimension localises a failure rather than reporting a diffuse score
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-09-30T08:20:00Z
updated: 2026-09-30T08:20:00Z
tags: [fidelity, measurement]
tests_task: T-NOJIRA-figma-to-code-10
---

# A known CSS offset shows up as a named element with the expected delta

> Verifies [T-NOJIRA-figma-to-code-10](../../work/NOJIRA-figma-to-code/T-NOJIRA-figma-to-code-10-fidelity-dom-position.md).

## Preconditions
DOM position accuracy is implemented and a corpus case scores above zero on it.

## Scenario
Record the score. Shift one element by a known offset in the generated CSS. Re-run.

## Result
The score falls. The report names that element and its four deltas, and the reported offset matches the one introduced. Elements that did not move are unaffected. The container-width, per-side inset and shared-edge checks appear as computed per-element results, not as prose.

## Edge cases
An element present in Figma but absent from the DOM is reported as missing by the coverage metric, not as a position failure here.
