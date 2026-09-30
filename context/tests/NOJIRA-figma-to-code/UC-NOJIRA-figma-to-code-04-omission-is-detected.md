---
type: use-case
schema_version: 1
id: UC-NOJIRA-figma-to-code-04
title: Deleting a rendered section lowers coverage and names the section
description: Proves coverage catches the failure class pixel comparison is blind to
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-09-30T08:20:00Z
updated: 2026-09-30T08:20:00Z
tags: [coverage]
tests_task: T-NOJIRA-figma-to-code-04
---

# Deleting a rendered section lowers coverage and names the section

> Verifies [T-NOJIRA-figma-to-code-04](../../work/NOJIRA-figma-to-code/T-NOJIRA-figma-to-code-04-coverage-metric.md).

## Preconditions
Coverage is implemented and a corpus case has been generated and rendered successfully.

## Scenario
Record the coverage figure. Remove one rendered section from the generated output. Re-render and re-run coverage.

## Result
Coverage falls. The report names the removed section in its unaccounted list, ordered by area. The skipped-node count is unchanged — the removed section becomes unaccounted, never quietly skipped.

## Edge cases
A node excluded by a documented skip rule is attributed to that rule by name in the report, so the denominator cannot shrink invisibly.
