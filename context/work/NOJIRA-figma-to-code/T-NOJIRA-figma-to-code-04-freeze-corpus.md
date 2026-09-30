---
type: task
schema_version: 1
id: T-NOJIRA-figma-to-code-04
title: Freeze the initial corpus in a design-system-owned Figma file
description: Create the protected Figma file, copy in the initial cases, and record the freeze procedure and its guard
jira: null
resource: null
status: todo
independent: false
owner: marcin.ludwig
created: 2026-09-30T08:20:00Z
updated: 2026-09-30T13:45:00Z
tags: [corpus, figma, foundation]
source_plan: P-NOJIRA-figma-to-code
depends_on: [T-NOJIRA-figma-to-code-01, T-NOJIRA-figma-to-code-03]
---

# Freeze the initial corpus in a design-system-owned Figma file

> From [P-NOJIRA-figma-to-code](../../plan/NOJIRA-figma-to-code/plan.md).

## Objective
Create the Figma file the measurements are taken against, and make it impossible for a product
team to change a baseline out from under us without the harness noticing. This is the task the whole
method rests on: without a guaranteed-stable input, every later number is incomparable, and it fails
silently rather than loudly.

## Steps
- [ ] Create a new Figma file owned by the design system team, with product teams having view access only
- [ ] Run the intake report first and select from its output rather than by eye: the corpus should span the observed range of design-system adoption, not only the well-behaved end of it
- [ ] Select three initial cases of increasing complexity: a single design system component instance; a composition of several instances inside one container; a panel containing a list or accordion — the shape where the existing pipeline reported seam and inset defects
- [ ] Choose cases that avoid the fourteen unmapped Code Connect components, so strict mode is exercisable from day one — the intake report names which components each candidate design actually uses, so this is a lookup rather than a guess
- [ ] Copy the chosen nodes into the corpus file and register each one with its file key, node id and current `lastModified`
- [ ] Implement the freeze guard: every run compares the live `lastModified` against the registered stamp and fails the case when they differ, naming what changed
- [ ] Document the freeze procedure — how a case is added, how a deliberate refresh is done, and why an accidental edit must fail rather than warn

## Acceptance criteria
- [ ] Three cases are registered and every one resolves to a real node in the design-system-owned file
- [ ] Case selection cites the intake report — which adoption level each case represents and why that spread was chosen
- [ ] A run against an edited corpus case fails with a message naming the case and both stamps, and does not produce a score
- [ ] The freeze procedure is written down where the next person will find it, not only in this task

## Verification
Register the three cases, run the harness, then edit a copied node in Figma and re-run. The second
run must fail on the changed case and still process the unchanged ones.
- Use case: `UC-NOJIRA-figma-to-code-04` — `../../tests/NOJIRA-figma-to-code/UC-NOJIRA-figma-to-code-04-edited-corpus-fails-loudly.md`
