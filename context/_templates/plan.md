---
type: plan
schema_version: 1
id: P-<JIRA>            # e.g. P-ABC-88
title: <short title>
description: <one-line summary, used for search/recall>
jira: <JIRA>            # e.g. ABC-88, or null
resource: https://<your-instance>.atlassian.net/browse/<JIRA>   # authoritative source (Jira URL); null if NOJIRA
status: proposed        # proposed | approved | in-progress | done | on-hold
phase: conceptual       # conceptual | approved | execution | done  (required)
                        # The gate: tasks in work/ must not be created until phase is 'approved'.
owner: <name>
created: <YYYY-MM-DDThh:mm:ssZ>   # ISO 8601, set once
updated: <YYYY-MM-DDThh:mm:ssZ>   # ISO 8601, bump on every edit
tags: [<tag>, <tag>]
source_analysis: A-<JIRA>   # the analysis this plan acts on (required)
slice: <slice-name>         # roadmap slice / milestone, or null
depends_on: []              # plan ids that must land first, e.g. [P-ABC-90]
approved_by: null           # set when phase transitions to 'approved'
approved_date: null         # ISO 8601 date, set when approved
open_questions: []          # to approve, each one is answered OR carried into a named task
---

# <Title>

> Derived from [A-<JIRA>](../../analyzes/<JIRA>-<slug>/analysis.md).

## Goal
The concrete outcome this plan delivers.

## Approach
How we will get there. The decided "what and how" (the analysis already did the "why").

## Scope
In scope / out of scope.

## Work breakdown
The tasks this plan produces (kept in sync with `work/<JIRA>-<slug>/`):
- `T-<JIRA>-01` — <task title>
- `T-<JIRA>-02` — <task title>

## Risks & dependencies
What could block this; what it depends on.

## Acceptance
How we know the plan is done.

## Approval
**This section must be filled before creating tasks in `work/` (phase gate).**

- Approved by: <!-- name -->
- Approved date: <!-- YYYY-MM-DD -->
- Open questions resolved: <!-- Each one either answered here, or carried into a named task
     (`T-<JIRA>-NN`) — say which. Recording a question as "resolved" when it is still open is a
     contract violation; carrying it into the work is a legitimate exit, because some answers
     need the work. -->
- Outstanding concerns: <!-- none, or list -->

To approve: set `phase: approved`, `approved_by`, `approved_date` in frontmatter, and clear `open_questions: []` — in the **same commit** as this sign-off (CONVENTIONS § 4.1).

<!-- Copy the block below per amendment; leave it out if the plan never changed after approval.

### Amendment N — YYYY-MM-DD, after approval

Recorded because an approved plan that changes quietly is worse than one that was never approved.
Amend instead of demoting the phase: `phase` stays `approved` and execution keeps running.

**What changed.** …and what it means for specific tasks.

**What did not change.** Name the parts that survived, so this reads as the same plan.

**Judgement to be aware of.** The call a reader might want to revisit, and what reverting costs.

- Amended by: <name>
- Amendment approved: <YYYY-MM-DD>

-->

<!-- If the *goal* turns out to be wrong, do not amend: set `status: on-hold` with
     `phase: conceptual`, leave the open questions standing, and supersede this plan with a
     sibling one. Amend for details, reconcile tasks for decomposition errors, hold for goals. -->
