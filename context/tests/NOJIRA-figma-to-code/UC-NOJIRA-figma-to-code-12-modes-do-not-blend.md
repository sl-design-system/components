---
type: use-case
schema_version: 1
id: UC-NOJIRA-figma-to-code-12
title: The same case scored strict and as-is yields two separate results with different verdicts
description: Proves the two audiences are served without averaging their criteria into a number that serves neither
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-09-30T08:20:00Z
updated: 2026-09-30T08:20:00Z
tags: [modes, design-system]
tests_task: T-NOJIRA-figma-to-code-12
---

# The same case scored strict and as-is yields two separate results with different verdicts

> Verifies [T-NOJIRA-figma-to-code-12](../../work/NOJIRA-figma-to-code/T-NOJIRA-figma-to-code-12-strict-and-as-is-modes.md).

## Preconditions
Both modes are implemented. One corpus case deliberately contains a component instance with no design system mapping.

## Scenario
Score the case in strict mode, then in as-is mode. Compare the two retained results.

## Result
Two results exist; neither overwrote the other; each states its mode prominently. Strict mode counts the unmapped instance as a defect and scores lower. As-is mode does not, but still reports the non-design-system fraction — the design system team gets that figure from either run.

## Edge cases
A registry entry with no declared mode is rejected at load time rather than defaulted.
