---
type: task
schema_version: 1
id: T-NOJIRA-figma-to-code-09
title: "Fidelity dimension: per-component pixel comparison"
description: Element-level pixel diff with tolerances tiered by element class, retaining diff images for inspection
jira: null
resource: null
status: todo
independent: false
owner: marcin.ludwig
created: 2026-09-30T08:20:00Z
updated: 2026-09-30T08:20:00Z
tags: [fidelity, measurement, visual]
source_plan: P-NOJIRA-figma-to-code
depends_on: [T-NOJIRA-figma-to-code-08]
---

# Fidelity dimension: per-component pixel comparison

> From [P-NOJIRA-figma-to-code](../../plan/NOJIRA-figma-to-code/plan.md).

## Objective
The second dimension, catching what geometry cannot: colour, typography, icon rendering, and
anything drawn rather than laid out.

Tiered tolerance is the part that makes it usable at all. A flat threshold either drowns in font
hinting noise or misses real defects; text, icons, shadows and layout containers have genuinely
different acceptable variation, and treating them alike is why naive pixel comparison gets
abandoned.

## Steps
- [ ] Capture element-level screenshots rather than whole pages, so a diff localises to a component
- [ ] Apply thresholds tiered by element class — layout container, design system instance, icon, text, decorative background — and treat shadow and blur regions as excluded zones
- [ ] Retain the diff image for every comparison, passing or failing, so a human can always look
- [ ] Fail a comparison loudly when rendered and reference dimensions differ, rather than scaling one to the other and reporting a misleading similarity
- [ ] Record which tier each element was scored under, so a lenient result cannot be mistaken for a strict one

## Acceptance criteria
- [ ] Each element is scored against its class tier, and the report states which tier applied
- [ ] Diff images are retained for every comparison and referenced from the result
- [ ] A dimension mismatch is reported as a distinct failure kind, never as a low similarity score

## Verification
Run against the corpus, inspect the diff images by eye, and confirm the tier applied to a text
element differs from the one applied to a layout container. Change one colour token in the generated
output and confirm the affected element fails.
- Use case: `UC-NOJIRA-figma-to-code-09` — `../../tests/NOJIRA-figma-to-code/UC-NOJIRA-figma-to-code-09-tiered-tolerance-holds.md`
