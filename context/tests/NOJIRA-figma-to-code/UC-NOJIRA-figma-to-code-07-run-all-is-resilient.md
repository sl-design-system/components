---
type: use-case
schema_version: 1
id: UC-NOJIRA-figma-to-code-07
title: A broken case is reported as a failure and the rest of the corpus still completes
description: Proves one bad case cannot cost a whole measurement run
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-09-30T08:20:00Z
updated: 2026-09-30T08:20:00Z
tags: [harness, tooling]
tests_task: T-NOJIRA-figma-to-code-07
---

# A broken case is reported as a failure and the rest of the corpus still completes

> Verifies [T-NOJIRA-figma-to-code-07](../../work/NOJIRA-figma-to-code/T-NOJIRA-figma-to-code-07-runner-and-result-schema.md).

## Preconditions
The runner and result schema are implemented and the corpus has at least three registered cases.

## Scenario
Run the full corpus once. Then break one case — an unreachable node id is enough — and run again. Inspect the process table after each run.

## Result
The first run produces one result per case plus an aggregate. The second reports the broken case as a failure with a reason and still produces results for the others. Every result records the pipeline commit measured. No dev-server process survives either run.

## Edge cases
A run interrupted part-way leaves no orphaned server and no half-written result file.
