---
type: use-case
schema_version: 1
id: UC-NOJIRA-figma-to-code-05
title: The intake report gives both audiences a number they can act on
description: Proves the design-system adoption figure and the unmapped-component demand ranking are trustworthy
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-09-30T08:20:00Z
updated: 2026-09-30T08:20:00Z
tags: [intake, adoption]
tests_task: T-NOJIRA-figma-to-code-05
---

# The intake report gives both audiences a number they can act on

> Verifies [T-NOJIRA-figma-to-code-05](../../work/NOJIRA-figma-to-code/T-NOJIRA-figma-to-code-05-intake-report-skill.md).

## Preconditions
The intake skill is implemented. Access to at least five of the eleven team Figma files from the analysis inventory.

## Scenario
Run the skill against five team files. For one of them, verify the detached-instance count by hand against what Figma itself reports.

## Result
Each file yields an adoption fraction, a detached-instance count, a bound-variable to local-style ratio, and a named unmapped-component list. The hand-checked count matches. One cross-file ranking is produced, and a component appearing many times in a single file ranks below one appearing once in each of four teams.

## Edge cases
A file the pipeline cannot open is reported as unreadable with a reason; it does not silently drop out of the aggregate.
