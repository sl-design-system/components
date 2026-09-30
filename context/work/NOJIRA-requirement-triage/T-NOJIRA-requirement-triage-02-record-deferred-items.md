---
type: task
schema_version: 1
id: T-NOJIRA-requirement-triage-02
title: Record the three deferred items with their trigger and owner
description: Give R6, R14 and R24 a written trigger condition and a person watching for it, so they return by themselves
jira: null
resource: null
status: todo
independent: true
owner: marcin.ludwig
created: 2026-09-30T13:15:00Z
updated: 2026-09-30T13:15:00Z
tags: [requirements, deferral, scope]
source_plan: P-NOJIRA-requirement-triage
depends_on: []
---

# Record the three deferred items with their trigger and owner

> From [P-NOJIRA-requirement-triage](../../plan/NOJIRA-requirement-triage/plan.md).

## Objective
R6 (theme override generation), R14 (design system installation) and R24 (multi-ecosystem support)
are real work that is not work yet. They become live the first time the pipeline runs against a
repository that is not this one.

A deferral is only different from a silent removal if someone is watching for the condition. Write
the condition, name the person, and put it where the trigger will actually be noticed — which is not
inside a backlog nobody rereads.

## Steps
- [ ] Write each of the three with its trigger stated as one observable event, not as a vague future condition
- [ ] Name a person per item who is watching for the trigger, and confirm with them rather than assigning in absentia
- [ ] Record R4's split explicitly: satisfied for runs inside this repository, open for the consumer case — it is the one item that is half deferred
- [ ] Note against R6 that it was the prior attempt's number one defect, so the deferral is of urgent work rather than of unimportant work
- [ ] Place the trigger somewhere it will be seen when it fires — the plan for whichever slice first targets a consumer repository, not only the backlog

## Acceptance criteria
- [ ] Each of the three names one observable trigger event and one person
- [ ] R4 appears as split, with both halves stated
- [ ] The trigger is recorded somewhere other than the backlog alone
- [ ] Nobody was assigned without being asked

## Verification
Ask someone not involved to read the three entries and say what would have to happen for each to
become work, and who would notice. If they cannot answer either, the entry is a silent removal
wearing a label.
