---
type: task
schema_version: 1
id: T-NOJIRA-figma-to-code-12
title: Strict and as-is scoring modes over one measurement
description: One measurement pipeline, two pass conditions, serving the design system team and product developers without blending their criteria
jira: null
resource: null
status: todo
independent: false
owner: marcin.ludwig
created: 2026-09-30T08:20:00Z
updated: 2026-09-30T13:45:00Z
tags: [modes, measurement, design-system]
source_plan: P-NOJIRA-figma-to-code
depends_on: [T-NOJIRA-figma-to-code-06]
---

# Strict and as-is scoring modes over one measurement

> From [P-NOJIRA-figma-to-code](../../plan/NOJIRA-figma-to-code/plan.md).

## Objective
The analysis found the two audiences have incompatible definitions of a correct transfer: for the
design system team an unmapped instance is a defect, for a product developer refusing to render it
is the defect. A single blended number satisfies neither.

Same machinery, two declared pass conditions, and the mode stated in the output so a score can never
be read against the wrong criterion.

## Steps
- [ ] Define the two modes precisely: in strict mode an unmapped component instance is a defect; in as-is mode it is reproduced from its design properties and reported as a non-design-system fraction
- [ ] Make the mode a required field on every corpus case, with no default — an unstated mode is a registry error
- [ ] Report the non-design-system fraction in both modes, since the design system team wants the figure even from an as-is run
- [ ] State the mode prominently in every result and summary, machine-readable and human-readable alike
- [ ] Confirm a case can be scored in both modes and that the two results are separately retained rather than overwriting each other

## Acceptance criteria
- [ ] The same case scored in both modes produces two retained results, each stating its mode
- [ ] In strict mode an unmapped instance lowers the score; in as-is mode it does not, but is still counted and reported
- [ ] A registry entry with no declared mode is rejected

## Verification
Score one corpus case containing a deliberately unmapped component in both modes and compare the
two results.
- Use case: `UC-NOJIRA-figma-to-code-12` — `../../tests/NOJIRA-figma-to-code/UC-NOJIRA-figma-to-code-12-modes-do-not-blend.md`
