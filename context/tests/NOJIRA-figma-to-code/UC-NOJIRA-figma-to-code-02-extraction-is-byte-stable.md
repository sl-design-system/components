---
type: use-case
schema_version: 1
id: UC-NOJIRA-figma-to-code-02
title: Extracting the same unchanged node twice produces identical bytes
description: Proves the ingest layer contributes no variance of its own
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-09-30T08:20:00Z
updated: 2026-09-30T08:20:00Z
tags: [ingest, determinism]
tests_task: T-NOJIRA-figma-to-code-02
---

# Extracting the same unchanged node twice produces identical bytes

> Verifies [T-NOJIRA-figma-to-code-02](../../work/NOJIRA-figma-to-code/T-NOJIRA-figma-to-code-02-node-tree-extraction.md).

## Preconditions
Node-tree extraction is implemented and a corpus case is registered and frozen.

## Scenario
Extract the node tree for one case. Extract it again without changing anything. Diff the two artifacts.

## Result
The diff is empty. Every node from the source tree appears exactly once. A deliberately detached instance in the case is classified as detached and is distinguishable from both a mapped instance and a plain frame.

## Edge cases
A null-mapped node that the resolution heuristic identifies as a known design system component is counted as mapped, not as unmapped.
