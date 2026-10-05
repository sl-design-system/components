---
type: task
schema_version: 1
id: T-NOJIRA-figma-to-code-06
title: Coverage metric — node accounting
description: Classify every node as mapped, rendered, explicitly skipped or unaccounted, and report the unaccounted ones by name
jira: null
resource: null
status: cancelled
independent: false
owner: marcin.ludwig
created: 2026-09-30T08:20:00Z
updated: 2026-10-05T00:00:00Z
tags: [coverage, measurement]
source_plan: P-NOJIRA-figma-to-code
depends_on: [T-NOJIRA-figma-to-code-02]
---

> **Reviewed 2026-10-05 — superseded.** Superseded by Amendment 6 and by `T-NOJIRA-html-artifacts-03`. Its method is falsified: this task requires "the denominator is honest and not quietly shrinkable", and `get_metadata` stops at instance boundaries — 10,936 nodes returned as 27 — so every descent enlarges the universe and **there is no denominator**. Replaced by the closure census. **Do not start this task.** Three tasks still list it in `depends_on`; that link now points at the html-contract task.

# Coverage metric — node accounting

> From [P-NOJIRA-figma-to-code](../../plan/NOJIRA-figma-to-code/plan.md).

## Objective

Answer the question pixel comparison structurally cannot: was the whole design transferred. A
section that was never rendered has nothing to diff against, so a fidelity score stays silent about
it. This metric is deterministic, cheap, and catches the worst failure class.

## Steps

- [ ] Classify each node in the tree as mapped to a design system component, rendered as markup, explicitly skipped, or unaccounted
- [ ] Determine "rendered" from the live DOM of the generated page, matched back to Figma nodes by geometry and content rather than by a naming convention the generator is free to change
- [ ] Define and document what legitimately counts as explicitly skipped — decorative layers, annotation frames, hidden nodes — so the denominator is honest and not quietly shrinkable
- [ ] Emit the coverage percentage together with a named list of unaccounted nodes, ordered by area so the biggest omissions read first
- [ ] Make the skip list auditable: the report states how many nodes were skipped and under which rule

## Acceptance criteria

- [ ] Coverage is reported as a percentage plus a named list, never as a bare number
- [ ] Removing a rendered section from the generated page lowers coverage and names exactly that section
- [ ] No node can be silently dropped from the denominator — every excluded node is attributed to a documented rule

## Verification

Run against a corpus case, then delete one rendered section from the generated output and re-run.
Coverage must fall and the report must name the deleted section.

- Use case: `UC-NOJIRA-figma-to-code-06` — `../../tests/NOJIRA-figma-to-code/UC-NOJIRA-figma-to-code-06-omission-is-detected.md`
