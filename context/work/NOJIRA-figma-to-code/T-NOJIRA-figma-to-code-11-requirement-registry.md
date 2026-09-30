---
type: task
schema_version: 1
id: T-NOJIRA-figma-to-code-11
title: Requirement registry, seeded from the prior attempt
description: The record that makes one requirement, one test case, one measured delta enforceable rather than aspirational
jira: null
resource: null
status: todo
independent: true
owner: marcin.ludwig
created: 2026-09-30T08:20:00Z
updated: 2026-09-30T08:20:00Z
tags: [process, requirements, governance]
source_plan: P-NOJIRA-figma-to-code
depends_on: [T-NOJIRA-figma-to-code-01]
---

# Requirement registry, seeded from the prior attempt

> From [P-NOJIRA-figma-to-code](../../plan/NOJIRA-figma-to-code/plan.md).

## Objective
Encode the rule that prevents this effort from repeating the failure it was created to avoid. The
previous attempt implemented thirty-one requirements together and could not attribute any outcome to
any of them; the existing validation prompt does the same thing at the scale of a single prompt.

A requirement with no corpus case that exercises it is a hypothesis. The registry is where that
distinction is enforced by a check rather than remembered by a person.

## Steps
- [ ] Define the registry format: id, title, which stage enforces it, whether it is computed or model-judged, the check that implements it, the corpus cases that exercise it, status, date added, and the score delta measured when it landed
- [ ] Seed it with the thirty-one requirements from the prior attempt, all at proposed, none with cases
- [ ] Implement the gate: a requirement cannot be set active without at least one corpus case, and the harness refuses a registry that violates it
- [ ] Record the measured delta on every promotion to active, so a requirement can later be justified or retired on evidence
- [ ] Default new entries to computed rather than model-judged, and require a written reason when an entry is model-judged — every check moved out of a prompt permanently removes variance

## Acceptance criteria
- [ ] The registry contains the thirty-one seeded requirements, all proposed
- [ ] Attempting to activate a requirement with no corpus case fails with a clear message
- [ ] An active requirement carries the score delta it produced

## Verification
Seed the registry, attempt to activate an entry with no case and confirm the refusal, then activate
one with a case and confirm the delta is recorded.
- Use case: `UC-NOJIRA-figma-to-code-11` — `../../tests/NOJIRA-figma-to-code/UC-NOJIRA-figma-to-code-11-requirement-needs-a-case.md`
