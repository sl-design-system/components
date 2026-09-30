---
type: task
schema_version: 1
id: T-NOJIRA-figma-to-code-01
title: Bench skeleton and corpus registry format
description: Create the sibling measurement tool at tools/sl-bench/ and define the machine-readable corpus registry every later task reads
jira: null
resource: null
status: todo
independent: true
owner: marcin.ludwig
created: 2026-09-30T08:20:00Z
updated: 2026-09-30T12:25:00Z
tags: [harness, tooling, foundation]
source_plan: P-NOJIRA-figma-to-code
depends_on: []
---

# Bench skeleton and corpus registry format

> From [P-NOJIRA-figma-to-code](../../plan/NOJIRA-figma-to-code/plan.md).

## Objective
Stand up the tool as a runnable, empty-but-real package at **`tools/sl-bench/`**, and
define the corpus registry — the single file that says which designs are measured, which mode each
is scored in, and what its frozen state is. Every later task reads that registry, so its shape is
decided once, here, before anything depends on it.

## Steps
- [ ] Create `tools/sl-bench/` with its own `package.json`, a CLI entry point, and no framework dependency beyond what the later tasks need (playwright, pixelmatch, pngjs). The name is stage-neutral by Amendment 2, because the bench measures both halves of the pipeline — do not create anything under the earlier `design-fidelity-harness` name
- [ ] Define the corpus registry schema: case id, Figma file key, node id, frozen `lastModified` stamp, scoring mode (`strict` | `as-is`), element-class overrides, and a free-text note on why the case is in the corpus
- [ ] Version the registry schema explicitly so a later change is a visible migration rather than a silent reinterpretation
- [ ] Implement `list` — read the registry and print the registered cases with their mode and freeze stamp
- [ ] Wire the tool into the repo so it runs from the root without a build step
- [ ] Add a README stating what the bench measures, what it deliberately does not, and that it never modifies the pipeline it measures

## Acceptance criteria
- [ ] `yarn bench list` runs from the repo root and prints the registered cases, or a clear empty-registry message
- [ ] The registry schema is documented and versioned; an unparseable or unknown-version registry fails loudly rather than being partially read
- [ ] The tool has no import path into `tools/implement-design-plugin/`

## Verification
Run `yarn bench list` against an empty registry and against a hand-written two-entry registry.
Confirm the tool errors on a registry whose schema version it does not recognise.
- Use case: `UC-NOJIRA-figma-to-code-01` — `../../tests/NOJIRA-figma-to-code/UC-NOJIRA-figma-to-code-01-registry-is-readable.md`
