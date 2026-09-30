---
type: plan
schema_version: 1
id: P-NOJIRA-requirement-triage
title: Triage the inherited requirement backlog into a true one
description: Confirm what is already satisfied, scope out what belongs elsewhere, convert measurements into registry entries, decide the autonomy question, and publish one ordered backlog
jira: null
resource: null
status: proposed
phase: conceptual
owner: marcin.ludwig
created: 2026-09-30T10:40:00Z
updated: 2026-09-30T10:40:00Z
tags: [requirements, backlog, triage, planning, handover]
source_analysis: A-NOJIRA-requirement-backlog
slice: requirement-triage
depends_on: []
approved_by: null
approved_date: null
open_questions:
  - Does the pipeline target consuming repositories or only this one — it moves R6, R14, R24 and part of R4
  - Is accessibility (R30, R31) part of this initiative or its own
  - Autonomy versus checkpoints — evidence on both sides, needs a decision record
  - Who owns R14 and R24 once they leave this backlog
---

# Triage the inherited requirement backlog into a true one

> Derived from [A-NOJIRA-requirement-backlog](../../analyzes/NOJIRA-requirement-backlog/analysis.md).

## Goal

One ordered backlog in which every one of the 31 inherited requirements has exactly one disposition,
each disposition is backed by evidence or by a named owner elsewhere, and the order is argued rather
than inherited.

The measure of success is what the next owner does on their first day: read the list and start, or
spend two weeks establishing what is already true.

## Approach

The analysis re-scored the 31 against what this repository actually has and found the list is
roughly a third shorter than it looks — nine already satisfied, two belonging to someone else's
backlog, five that are measurements rather than features, and four that contradict the pipeline's
design and need a decision instead of an implementation.

This plan turns that re-scoring into a verified, published list. It runs **in parallel with the
measurement work**, not after it: none of its actions needs the baseline, and its output is what
makes the slice that follows the baseline plannable at all.

Three principles carry the work:

**Confirm, do not assert.** Every "already satisfied" claim in the analysis is an argument from
reading the pipeline's skills. The prior attempt made the same class of error in the same way — it
scored requirements as met from specifications, and several of those components had never been run.
A claim that is wrong and unexamined is worse than an open item, because nobody returns to it. Each
of the nine is confirmed against the running pipeline and carries its evidence.

**Retire loudly.** An item leaving this backlog leaves with a destination and a named owner. Silent
removal is how a requirement reappears six months later with no record of why it went.

**A measured property is not a task.** The five that become measurements go into the requirement
registry the measurement slice builds, where an entry *is* a property with a check. Writing them as
tasks produces work with no completion condition, which is one of the mechanisms that kept the
original list at 31.

## Scope

**In scope.** Confirming the nine satisfied claims; answering the consuming-repository scope question
and re-scoping the four items it moves; retiring the out-of-scope items to named owners; converting
the five measurement requirements into registry entries; deciding autonomy versus checkpoints and
recording it; publishing the resulting ordered backlog.

**Out of scope.** Implementing any of the remaining eleven. Writing plans for them beyond the
ordering — two of the actions here and the baseline both change that ordering, and planning eleven
items now would repeat the original mistake at a different altitude. Re-deriving or rewriting the
requirements themselves; they are taken as given.

## Work breakdown

- `T-NOJIRA-requirement-triage-01` — Confirm the nine satisfied claims against the running pipeline
- `T-NOJIRA-requirement-triage-02` — Answer the consuming-repository question and re-scope the four items it moves
- `T-NOJIRA-requirement-triage-03` — Retire the out-of-scope items to named owners
- `T-NOJIRA-requirement-triage-04` — Convert the five measurement requirements into registry entries
- `T-NOJIRA-requirement-triage-05` — Decide autonomy versus checkpoints and record the decision
- `T-NOJIRA-requirement-triage-06` — Publish the triaged, ordered backlog

Unlike the measurement plan, these tasks carry **no use cases**. A use case verifies observable
behaviour, and these produce documents; their acceptance is the document being complete and
checkable against the criteria below. Adding use cases here would be ceremony, and ceremony is what
makes a process stop being used.

## Risks & dependencies

| Risk | Consequence | Mitigation |
|---|---|---|
| A confirmation is done by reading rather than running | The plan reproduces exactly the error it exists to correct, and does so under the label "verified" | Each confirmation names what was run or observed; "read the skill and it says so" is explicitly not evidence |
| The consuming-repository question stays unanswered | Four items sit in an undecided scope and the ordering cannot be finished | It gates `T-03` and `T-06`; the plan cannot complete without it, which is the intended pressure |
| The autonomy decision is deferred indefinitely | Four requirements stay in limbo and the slice after the baseline inherits the ambiguity | Recorded as a decision with what would invalidate it, so it can be made now and revisited on evidence rather than waiting for certainty |
| Triage is treated as the work | Time goes into curating a list instead of improving the pipeline | Six tasks, all document-sized, running in parallel with the measurement slice rather than blocking it |

**Dependencies.** `T-04` writes into the requirement registry created by
`T-NOJIRA-figma-to-code-11`. `T-05` needs [`A-NOJIRA-figma-to-code`](../../analyzes/NOJIRA-figma-to-code/analysis.md)
at `status: done`, because the ADR gate requires an approved analysis before a decision built on it
can be accepted.

## Acceptance

1. Every one of the 31 requirements has exactly one disposition — satisfied, measured, open,
   decided, or retired — and none appears under two.
2. Each of the nine satisfied claims carries evidence of what was run or observed, not a citation of
   what a skill says it does. Any claim that failed confirmation is back on the open list with the
   reason recorded.
3. Each retired item names the backlog and the owner it went to.
4. The five measurement requirements exist as registry entries, and none of them exists as a task.
5. The autonomy question is settled in a decision record that states what would invalidate it, and
   the four affected requirements are either adopted in a stated form or retired.
6. The remaining open items are published in one ordered list, each with a one-line rationale for its
   position, and the list states plainly which parts of the order are provisional on the baseline.
7. A reader who has not followed this work can take the published backlog and start, without
   reconstructing any of the reasoning behind it.

## Approval

**This section must be filled before creating tasks in `work/` (phase gate).**

- Approved by: <!-- name -->
- Approved date: <!-- YYYY-MM-DD -->
- Open questions resolved: <!-- Questions 1 and 2 are decisions only the owner can make and they
     shape the work: 1 moves four requirements between scopes, 2 changes whether accessibility is
     absorbed or separated. Question 3 is carried into `T-05` by design — it is a decision the work
     produces, not a precondition. Question 4 is carried into `T-03`. -->
- Outstanding concerns: <!-- none, or list -->

To approve: set `phase: approved`, `approved_by`, `approved_date` in frontmatter, and clear `open_questions: []` — in the **same commit** as this sign-off (CONVENTIONS § 4.1).
