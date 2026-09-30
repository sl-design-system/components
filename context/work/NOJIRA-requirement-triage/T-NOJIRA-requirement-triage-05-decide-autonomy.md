---
type: task
schema_version: 1
id: T-NOJIRA-requirement-triage-05
title: Decide autonomy versus checkpoints and record the decision
description: Settle whether the pipeline asks or runs standalone, and record it with what would invalidate it
jira: null
resource: null
status: todo
independent: true
owner: marcin.ludwig
created: 2026-09-30T13:15:00Z
updated: 2026-09-30T13:15:00Z
tags: [architecture, decision, requirements]
source_plan: P-NOJIRA-requirement-triage
depends_on: []
---

# Decide autonomy versus checkpoints and record the decision

> From [P-NOJIRA-requirement-triage](../../plan/NOJIRA-requirement-triage/plan.md).

## Objective
Four requirements — structured questions at every architectural decision, always suggesting the next
step, asking rather than assuming, and concrete recommended options — describe an interactive
assistant. The pipeline here states the opposite: all input gathered up front, then standalone to
completion, with the decomposition checkpoint from its own vision document deliberately removed.

This is a design disagreement, not an oversight, and it must be decided rather than implemented.
Evidence runs both ways and both pieces are worth weighing: the removed checkpoint is among the
largest sources of run-to-run variance, and the prior attempt scored three of these four
requirements as met while still producing output that was not repeatable. **Interactivity alone did
not buy determinism.**

The stage split changes the shape of the answer and should be taken into account: stage one is
mechanical and can be autonomous, while stage two decides architecture, where a review gate is
natural rather than an interruption.

## Steps
- [ ] Move A-NOJIRA-figma-to-code to status done first — the ADR gate requires an approved analysis before a decision built on it can be accepted
- [ ] Write the decision as an ADR with the options actually considered: full autonomy, questions at every decision point, and one reviewable artifact at the decomposition boundary
- [ ] State what would invalidate it, so it can be revisited on evidence rather than relitigated on preference
- [ ] Resolve each of the four requirements explicitly against the decision — adopted in a named form, or retired with the reason
- [ ] Take the baseline into account if it has landed, and say so if it has not: the decision is makeable without it and sharper with it

## Acceptance criteria
- [ ] An ADR exists recording the decision, its options and what would invalidate it
- [ ] All four requirements are resolved against it, none left in limbo
- [ ] The ADR states whether the baseline informed it or whether it was made ahead of that evidence

## Verification
Check the ADR against the four requirements one at a time: each should be traceable to a sentence in
it. A requirement that the decision does not mention has not been decided, only outlived.

## Notes / work log
The ADR gate is a real sequencing constraint: the source analysis must reach status done first.
