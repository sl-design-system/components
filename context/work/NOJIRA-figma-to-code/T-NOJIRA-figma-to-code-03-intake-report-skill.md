---
type: task
schema_version: 1
id: T-NOJIRA-figma-to-code-03
title: Design intake report as a skill
description: Read-only report on how much of a Figma design uses the design system, what is detached, and which unmapped components recur across teams
jira: null
resource: null
status: todo
independent: true
owner: marcin.ludwig
created: 2026-09-30T08:20:00Z
updated: 2026-09-30T13:45:00Z
tags: [intake, adoption, skill, design-system]
source_plan: P-NOJIRA-figma-to-code
depends_on: [T-NOJIRA-figma-to-code-02]
---

# Design intake report as a skill

> From [P-NOJIRA-figma-to-code](../../plan/NOJIRA-figma-to-code/plan.md).

## Objective
Give both audiences the number they currently lack. A product developer learns, before generating
anything, how much of their design the pipeline can map and how much will be reproduced as-is. The
design system team learns which unmapped components are actually in demand across eleven teams, so
the mapping backlog is ranked by evidence instead of alphabetically.

Read-only by construction: this skill never generates code and never writes into the pipeline.

## Steps
- [ ] Build the report on the shared node-tree artifact — the same traversal as coverage, counting different things
- [ ] Report per design: the fraction of instances resolving to a design system component, the detached-instance count, the ratio of bound variables to local styles, and the unmapped components by name
- [ ] Aggregate across designs into a ranking of unmapped components by how many distinct files and teams they appear in
- [ ] Package it as a skill so a developer can point it at their own Figma URL without knowing anything about the harness
- [ ] Present the output so a non-developer can read it — the design system team is an audience for this report, not only engineers

## Acceptance criteria
- [ ] The skill runs against a Figma URL and produces the report without generating or modifying any code
- [ ] Run against at least five of the eleven team files, it produces per-file adoption figures and one cross-file ranking
- [ ] The ranking distinguishes a component appearing many times in one file from one appearing across many teams — demand is breadth, not volume

## Verification
Run against five team files from the analysis inventory. Verify by hand, on one file, that the
detached-instance count matches what Figma itself reports.
- Use case: `UC-NOJIRA-figma-to-code-03` — `../../tests/NOJIRA-figma-to-code/UC-NOJIRA-figma-to-code-03-adoption-report-is-actionable.md`
