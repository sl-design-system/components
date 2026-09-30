---
type: task
schema_version: 1
id: T-NOJIRA-figma-to-code-03
title: Deterministic Figma node-tree extraction
description: Normalise the Figma calls into one stable node-tree artifact shared by the coverage metric and the intake report
jira: null
resource: null
status: todo
independent: false
owner: marcin.ludwig
created: 2026-09-30T08:20:00Z
updated: 2026-09-30T08:20:00Z
tags: [figma, ingest, determinism]
source_plan: P-NOJIRA-figma-to-code
depends_on: [T-NOJIRA-figma-to-code-01]
---

# Deterministic Figma node-tree extraction

> From [P-NOJIRA-figma-to-code](../../plan/NOJIRA-figma-to-code/plan.md).

## Objective
Produce the one structured artifact both measurement paths read. The analysis found that geometry
returned by Figma is currently written to disk and then not carried into any specification — this
task makes it a first-class, stable, machine-readable input instead.

Extraction must be fully deterministic: same node in, byte-identical artifact out. No model is
involved at any point.

## Steps
- [ ] Read the structural tree, the Code Connect map and the bound variable definitions — from the pipeline run folder when present, fetching only what is missing
- [ ] Normalise into one `node-tree.json`: per node its id, name, type, absolute bounding box, component id, bound variables, resolved Code Connect snippet or null, and whether the instance is detached
- [ ] Apply the existing plugin resolution heuristic for null-mapped nodes that are identifiable design system components, so an identifiable node is not miscounted as unmapped
- [ ] Guarantee stable ordering and stable serialisation so two extractions of an unchanged node produce identical bytes
- [ ] Record in the artifact which Figma server answered each call and when

## Acceptance criteria
- [ ] Two extractions of the same unchanged node produce byte-identical `node-tree.json`
- [ ] Every node in the source tree appears exactly once in the artifact
- [ ] A detached instance is distinguishable from a mapped one and from a plain frame

## Verification
Extract twice and diff the artifacts — the diff must be empty. Extract a node containing a
deliberately detached instance and confirm it is classified as detached.
- Use case: `UC-NOJIRA-figma-to-code-03` — `../../tests/NOJIRA-figma-to-code/UC-NOJIRA-figma-to-code-03-extraction-is-byte-stable.md`
