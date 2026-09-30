---
type: task
schema_version: 1
id: T-NOJIRA-requirement-triage-04
title: Convert the five measurement requirements into registry entries
description: Move R1, R8, R9, R15 and R28 into the requirement registry as measured properties, and out of the backlog as tasks
jira: null
resource: null
status: todo
independent: false
owner: marcin.ludwig
created: 2026-09-30T13:15:00Z
updated: 2026-09-30T13:15:00Z
tags: [requirements, measurement, registry]
source_plan: P-NOJIRA-requirement-triage
depends_on: [T-NOJIRA-figma-to-code-05]
---

# Convert the five measurement requirements into registry entries

> From [P-NOJIRA-requirement-triage](../../plan/NOJIRA-requirement-triage/plan.md).

## Objective
Five requirements are continuous properties rather than features: pixel fidelity, generation speed,
model tier routing, standards compliance with its context-overflow tension, and context auto-split.
None of them can be "done".

They belong in the requirement registry the bench builds, where an entry *is* a property with a
check attached. Leaving them as backlog tasks produces work with no completion condition — one of
the mechanisms by which the original list stayed at thirty-one.

## Steps
- [ ] Write each of the five as a registry entry naming the metric that expresses it and the check that produces it
- [ ] Give R1 particular care: it is not a requirement to implement but the goal the composite score expresses, so its entry should say so rather than implying something could be built to satisfy it
- [ ] Bind R8, R9, R15 and R28 to the cost and wall-clock figures recorded per run, so each has a real check rather than an aspiration
- [ ] Set each entry to active only if a corpus case exercises it, and to proposed otherwise — the registry gate applies to these like any other
- [ ] Remove all five from the backlog as tasks, leaving a pointer to the registry

## Acceptance criteria
- [ ] All five exist as registry entries naming a metric and a check
- [ ] None of the five remains in the backlog as a task
- [ ] R1's entry states that it is the goal the score expresses, not a buildable item
- [ ] Any of the five without a corpus case is proposed, not active

## Verification
Attempt to mark one of the five done. The registry should have no way to express that, because a
measured property has no done state — if it does, the conversion was cosmetic.

## Notes / work log
Depends on the registry existing (T-NOJIRA-figma-to-code-05). Everything else in this plan can run before it.
