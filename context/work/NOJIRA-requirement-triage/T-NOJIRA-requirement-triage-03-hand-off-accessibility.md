---
type: task
schema_version: 1
id: T-NOJIRA-requirement-triage-03
title: Hand accessibility to its own initiative
description: Open the accessibility initiative with the three distinct pieces kept apart, a named owner, and its dependency on the HTML stage recorded
jira: null
resource: null
status: todo
independent: true
owner: marcin.ludwig
created: 2026-09-30T13:15:00Z
updated: 2026-09-30T13:15:00Z
tags: [accessibility, scope, handover]
source_plan: P-NOJIRA-requirement-triage
depends_on: []
---

# Hand accessibility to its own initiative

> From [P-NOJIRA-requirement-triage](../../plan/NOJIRA-requirement-triage/plan.md).

## Objective
Accessibility leaves this backlog for its own plan. The work is to open that initiative properly
rather than to drop two requirements and hope someone picks them up.

The one thing this task must get right is keeping three easily-conflated pieces apart: automated
validation of the produced HTML, the human review and approval that follows it, and accessibility in
the generated application code. The first is an artifact property and automatable, the third is
behaviour and mostly is not, and treating the first as discharging the third buys a false sense of
coverage.

## Steps
- [ ] Open an analysis for the accessibility initiative, stating the three pieces separately and what distinguishes them
- [ ] Record its dependency on the stage-one HTML artifact — the thing being validated has to exist — and state plainly that a dependency is not a reason to merge the plans
- [ ] Carry across what already exists rather than starting from nothing: the prior attempt met R30 and R31 with five dedicated agents and an 18% quality weight, and the organisation's toolkit already ships an audit skill for a running application
- [ ] Name the gap that is not covered by either: design-time guidance, as opposed to post-hoc auditing
- [ ] Name an owner, and leave the conformance level as an open question for them rather than deciding it here
- [ ] Remove R30 and R31 from this backlog with a link to where they went

## Acceptance criteria
- [ ] An accessibility analysis exists with the three pieces distinguished and an owner named
- [ ] The dependency on the HTML stage is recorded in both directions — the accessibility analysis names it, and the staging work knows something hangs off it
- [ ] R30 and R31 are gone from this backlog and reachable from it by a link
- [ ] The conformance level is left open, not decided by this task

## Verification
Check that the new analysis can be read by its owner without this backlog: if it only makes sense
as a continuation of the triage, the handoff has not happened.
