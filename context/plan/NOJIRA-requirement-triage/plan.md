---
type: plan
schema_version: 1
id: P-NOJIRA-requirement-triage
title: Triage the inherited requirement backlog into a true one
description: Confirm what is already satisfied, scope out what belongs elsewhere, convert measurements into registry entries, decide the autonomy question, and publish one ordered backlog
jira: null
resource: null
status: approved
phase: approved
owner: marcin.ludwig
created: 2026-09-30T10:40:00Z
updated: 2026-09-30T13:15:00Z
tags: [requirements, backlog, triage, planning, handover]
source_analysis: A-NOJIRA-requirement-backlog
slice: requirement-triage
depends_on: []
approved_by: marcin.ludwig
approved_date: 2026-09-30
open_questions: []
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

The analysis re-scored the 31 against what this repository actually has and found the list is far
shorter than it looks — nine already satisfied, three deferred behind a named trigger, five that are
measurements rather than features, four that contradict the pipeline's design and need a decision
instead of an implementation, and two that leave for a separate accessibility initiative. **Eight
remain as buildable work now.**

Two scope questions were settled while this plan was being written, and both changed the shape of
the list. The pipeline **is** eventually aimed at consuming repositories — developed here, then
distributed as an installable plugin — so R6, R14 and R24 are deferred behind that trigger rather
than belonging to someone else. And accessibility (R30, R31) becomes its own initiative, because it
cannot be retrofitted onto generated code: absorbing it would change the pipeline's shape rather
than lengthen a list.

This plan turns that re-scoring into a verified, published list. It runs **in parallel with the
measurement work**, not after it: none of its actions needs the baseline, and its output is what
makes the slice that follows the baseline plannable at all.

Three principles carry the work:

**Confirm, do not assert.** Every "already satisfied" claim in the analysis is an argument from
reading the pipeline's skills. The prior attempt made the same class of error in the same way — it
scored requirements as met from specifications, and several of those components had never been run.
A claim that is wrong and unexamined is worse than an open item, because nobody returns to it. Each
of the nine is confirmed against the running pipeline and carries its evidence.

**Defer with a written trigger, never silently.** An item that is not work now carries the condition
that makes it work — "the first time the pipeline runs against a repository that is not this one" —
so it returns by itself when the condition is met. An item leaving for another initiative leaves
with a destination and an owner. Silent removal is how a requirement reappears six months later as a
defect, with no record of why it went.

**A measured property is not a task.** The five that become measurements go into the requirement
registry the measurement slice builds, where an entry *is* a property with a check. Writing them as
tasks produces work with no completion condition, which is one of the mechanisms that kept the
original list at 31.

## Scope

**In scope.** Confirming the nine satisfied claims against the running pipeline; recording the three
deferred items with their trigger and owner; handing accessibility to its own initiative; converting
the five measurement requirements into registry entries; deciding autonomy versus checkpoints and
recording it; publishing the resulting ordered backlog of eight.

**Out of scope.** Implementing any of the remaining eight. Writing plans for them beyond the
ordering — the baseline changes that ordering, and planning eight items now would repeat the
original mistake at a different altitude. Building anything for the three deferred items: a theme
generator with no foreign theme to generate against is untestable work. Re-deriving or rewriting the
requirements themselves; they are taken as given.

## Work breakdown

- `T-NOJIRA-requirement-triage-01` — Confirm the nine satisfied claims against the running pipeline
- `T-NOJIRA-requirement-triage-02` — Record the three deferred items with their trigger and owner
- `T-NOJIRA-requirement-triage-03` — Hand accessibility (R30, R31) to its own initiative
- `T-NOJIRA-requirement-triage-04` — Convert the five measurement requirements into registry entries
- `T-NOJIRA-requirement-triage-05` — Decide autonomy versus checkpoints and record the decision
- `T-NOJIRA-requirement-triage-06` — Publish the triaged, ordered backlog of eight

Unlike the measurement plan, these tasks carry **no use cases**. A use case verifies observable
behaviour, and these produce documents; their acceptance is the document being complete and
checkable against the criteria below. Adding use cases here would be ceremony, and ceremony is what
makes a process stop being used.

## Risks & dependencies

| Risk | Consequence | Mitigation |
|---|---|---|
| A confirmation is done by reading rather than running | The plan reproduces exactly the error it exists to correct, and does so under the label "verified" | Each confirmation names what was run or observed; "read the skill and it says so" is explicitly not evidence |
| A deferred item is recorded without a trigger anyone would notice firing | It behaves exactly like a silently dropped one and returns as a production defect | The trigger is a single observable event — the first run against a repository that is not this one — and `T-02` names who is watching for it |
| The autonomy decision is deferred indefinitely | Four requirements stay in limbo and the slice after the baseline inherits the ambiguity | Recorded as a decision with what would invalidate it, so it can be made now and revisited on evidence rather than waiting for certainty |
| Triage is treated as the work | Time goes into curating a list instead of improving the pipeline | Six tasks, all document-sized, running in parallel with the measurement slice rather than blocking it |

**Dependencies.** `T-04` writes into the requirement registry created by
`T-NOJIRA-figma-to-code-05`. `T-05` needs [`A-NOJIRA-figma-to-code`](../../analyzes/NOJIRA-figma-to-code/analysis.md)
at `status: done`, because the ADR gate requires an approved analysis before a decision built on it
can be accepted.

## Acceptance

1. Every one of the 31 requirements has exactly one disposition — satisfied, measured, open,
   decided, or retired — and none appears under two.
2. Each of the nine satisfied claims carries evidence of what was run or observed, not a citation of
   what a skill says it does. Any claim that failed confirmation is back on the open list with the
   reason recorded.
3. Each deferred item carries its trigger and the person watching for it; accessibility has a named
   destination and owner, not just a removal.
4. The five measurement requirements exist as registry entries, and none of them exists as a task.
5. The autonomy question is settled in a decision record that states what would invalidate it, and
   the four affected requirements are either adopted in a stated form or retired.
6. The eight remaining open items are published in one ordered list, each with a one-line rationale
   for its position, and the list states plainly which parts of the order are provisional on the
   baseline.
7. A reader who has not followed this work can take the published backlog and start, without
   reconstructing any of the reasoning behind it.

## Approval

- Approved by: marcin.ludwig
- Approved date: 2026-09-30
- Open questions resolved:
  - **Autonomy versus checkpoints** — *carried into `T-NOJIRA-requirement-triage-05`.* This is a
    decision the work produces, not a precondition for starting it. Four requirements hang on it and
    the evidence already runs both ways: the removed decomposition checkpoint is a known variance
    source, and the prior attempt scored the interactivity requirements as met while still producing
    output that was not repeatable.
  - **Who owns the three deferred items when the trigger fires** — *carried into
    `T-NOJIRA-requirement-triage-02`.* Naming the trigger is done; naming the person is part of
    recording the deferral, since a deferral nobody is watching is a silent removal.
  - **Which marketplace hosts the pipeline when it is distributed** — *carried out of this plan.* It
    is not this plan's question: it belongs to whoever owns distribution, and it stays recorded as an
    open question of
    [`A-NOJIRA-requirement-backlog`](../../analyzes/NOJIRA-requirement-backlog/analysis.md) so it is
    not lost by being out of scope here.
- Outstanding concerns: `T-05` cannot produce an accepted decision record until
  [`A-NOJIRA-figma-to-code`](../../analyzes/NOJIRA-figma-to-code/analysis.md) reaches
  `status: done` — the ADR gate requires an approved analysis. That is a sequencing constraint
  inside the task, not a reason to hold the plan.

To approve: set `phase: approved`, `approved_by`, `approved_date` in frontmatter, and clear `open_questions: []` — in the **same commit** as this sign-off (CONVENTIONS § 4.1).
