---
type: task
schema_version: 1
id: T-NOJIRA-requirement-triage-01
title: Confirm the nine satisfied claims against the running pipeline
description: Turn nine arguments from reading into observations, and return any that fail to the open list
jira: null
resource: null
status: todo
independent: true
owner: marcin.ludwig
created: 2026-09-30T13:15:00Z
updated: 2026-09-30T13:15:00Z
tags: [requirements, verification, evidence]
source_plan: P-NOJIRA-requirement-triage
depends_on: []
---

# Confirm the nine satisfied claims against the running pipeline

> From [P-NOJIRA-requirement-triage](../../plan/NOJIRA-requirement-triage/plan.md).

## Objective
The backlog analysis scores nine requirements as already satisfied here: setup verification,
design-system-only generation, component help, any-scope runs, data and presentation encapsulation,
icon handling, early error detection, multi-agent support and multi-framework support.

Every one of those is an argument from reading the pipeline's skills and conventions. None has been
observed. The prior attempt made exactly this error in the same direction — it scored requirements
as met from specifications, and its own notes then record that several of those components had never
been run. **A satisfied claim that is wrong is worse than an open item, because nobody looks at it
again.**

## Steps
- [ ] For each of the nine, decide what observation would actually settle it, and write that down before running anything — otherwise the confirmation drifts into re-reading
- [ ] Run the pipeline against a corpus case and observe the claims that a run exercises: setup halting, design-system-only generation, scope handling, the type-check gate, icon registration
- [ ] Confirm multi-agent support by installing the plugin in a second host, not by reading the manifest — the claim is that three hosts read it, and only two have been seen to
- [ ] Confirm multi-framework support by generating in both Lit and Angular, not by observing that two framework skills exist
- [ ] Record per claim what was run or observed, with the output, not a citation of what a skill says it does
- [ ] Return any claim that fails to the open list with the reason, and say plainly that the analysis was wrong about it

## Acceptance criteria
- [ ] All nine carry an observation, naming what was run and what was seen
- [ ] No claim is supported by a quotation from a skill file
- [ ] Claims that failed are back on the open list with their reason recorded, and the count in the backlog analysis is corrected

## Verification
Read the nine records back as a stranger would: each should let someone reproduce the observation.
Any entry that could have been written without running the pipeline has not confirmed anything.

## Notes / work log
The count of eight remaining open items assumes all nine hold. A failure here changes that number, which is the point of doing this first.
