---
type: task
schema_version: 1
id: T-NOJIRA-figma-ingestion-03
title: Classify the unresolved into five causes, with owners
description: 'The empty map is a transport failure, an id-format limit, another library, an unwritten mapping or a stale one — and the pipeline answers all five by stopping'
jira: null
resource: null
status: todo
independent: false
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T00:00:00Z
tags: [figma, code-connect, classification]
source_plan: P-NOJIRA-figma-ingestion
depends_on: [T-NOJIRA-figma-ingestion-02]
---

# Classify the unresolved into five causes, with owners

## Objective

Replace one halt with a classification. Each cause has a different owner and a different remedy;
the printed remedy today is correct for two of five, impossible for one, and wrong for the two
that are our own bug.

## Steps

1. Call `get_code_connect_suggestions(root, fileKey, excludeMappingPrompt: true)` — it returns
   named components with **both** `mainComponentNodeId` and `instanceNodeId`, which is what ends
   the granularity instability the control measured.
2. **Filter**: drop descendants of resolved instances — SANNA's list includes `Button-Variants`
   and `Button-Base`, the internals its own mapping descends into — and drop pure assets.
3. Classify each survivor: **A** retrieval failed (per-node retry returns data) · **B** nested id
   rejected · **C** another library (task 01 said as-is) · **D** an SLDS component with no
   mapping — a **local** lookup against `scripts/connect-figma-components/src/`, no API call ·
   **E** mapping exists but stale.
4. Carry or explicitly reject the second axis: `A-NOJIRA-ds-conformance` **F3b** (attached but
   overridden, which it argues is the worse case) and **F4** (the similarity layer, reported with
   its uncertainty and never a gate).
5. Attach an owner to each.

## Acceptance criteria

- Every unresolved node carries a cause and an owner.
- Internals of resolved instances do not appear.
- F3b and F4 are carried or rejected in writing — not silently absent, as the audit found them.
- **The count is stable across two passes of one design.** The control's moved by up to
  threefold.

## Verification

Two passes over one itslearning design produce the same count and the same causes.
