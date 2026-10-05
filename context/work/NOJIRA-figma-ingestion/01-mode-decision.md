---
type: task
schema_version: 1
id: T-NOJIRA-figma-ingestion-01
title: Decide the mode from evidence, once per file
description: 'Strict or as-is, derived from which library the file depends on — not from the team label'
jira: null
resource: null
status: todo
independent: true
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T00:00:00Z
tags: [figma, mode, caching]
source_plan: P-NOJIRA-figma-ingestion
depends_on: []
---

# Decide the mode from evidence, once per file

## Objective

A design drawn in another library is not a blocked run; it is the second audience. Decide which,
before the traversal starts, from evidence rather than from a product name — two NSP designs
resolve to two different themes, and the label was wrong both times it was guessed.

Probed 2026-10-05: SANNA's components depend on **24 distinct `sl-*`** externals; Course-files'
depend on `Cell` and `.Main menu`, with **zero**.

## Steps

1. Call `list_file_components_for_code_connect(fileKey)`. **Write it to disk and grep it** — it
   returned 2.18 MB on a 153-component file and must never be read into a context window.
2. Classify by the external dependencies of the file's own components: `sl-*` means **strict**,
   anything else means **as-is**.
3. Cache per `(fileKey, fileVersion)`. Nineteen designs sit in twelve files, so this is twelve
   calls for the corpus and zero on a re-run.
4. Record the verdict **with its evidence** — which externals, how many.

## Acceptance criteria

- The mode is recorded with the evidence that produced it, not as a bare label.
- Cached per file and version; a second design from the same file makes no call.
- The call is written to disk and never read whole.

## Verification

Run against one SLDS-based file and one itslearning file; the verdicts must differ and each must name the externals it saw.
