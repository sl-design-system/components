---
type: use-case
schema_version: 1
id: UC-NOJIRA-figma-to-code-01
title: The bench reads a corpus registry and refuses one it does not understand
description: Proves the registry contract holds before anything depends on it
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-09-30T08:20:00Z
updated: 2026-09-30T12:25:00Z
tags: [harness, registry]
tests_task: T-NOJIRA-figma-to-code-01
---

# The bench reads a corpus registry and refuses one it does not understand

> Verifies [T-NOJIRA-figma-to-code-01](../../work/NOJIRA-figma-to-code/T-NOJIRA-figma-to-code-01-bench-skeleton.md).

## Preconditions
The bench exists at `tools/sl-bench/` and runs from the repo root. Three registry fixtures are available: empty, valid two-entry, and one declaring an unknown schema version.

## Scenario
Run `list` against each of the three fixtures in turn.

## Result
The empty registry produces a clear empty message, not an error and not a crash. The valid one prints both cases with their mode and freeze stamp. The unknown-version one fails with a message naming the version it found and the versions it supports — it is never partially read.

## Edge cases
A registry entry missing a required field fails naming the entry and the field, not the file as a whole.
