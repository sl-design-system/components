---
type: task
schema_version: 1
id: T-<JIRA>-NN         # e.g. T-ABC-88-01
title: <short title>
description: <one-line summary, used for search/recall>
jira: <JIRA>            # e.g. ABC-88, or null
resource: https://<your-instance>.atlassian.net/browse/<JIRA>   # authoritative source (Jira URL); null if NOJIRA
status: todo            # todo | in-progress | blocked | done | cancelled
independent: true       # true = can run in parallel with other tasks from this plan
                        # false = must be coordinated (explain in depends_on or Notes)
owner: <name>
# previous_owner: <name>   # set on handover — see CONVENTIONS.md "Handoff"
created: <YYYY-MM-DDThh:mm:ssZ>   # ISO 8601, set once
updated: <YYYY-MM-DDThh:mm:ssZ>   # ISO 8601, bump on every edit
tags: [<tag>, <tag>]
source_plan: P-<JIRA>   # the plan this task came from
# source: bugfix        # use instead of source_plan when there is no plan
depends_on: []          # other task ids that must be done first, e.g. [T-ABC-88-01]
---

# <Title>

> From [P-<JIRA>](../../plan/<JIRA>-<slug>/plan.md).

## Objective
The single, concrete change this task delivers.

## Steps
- [ ] step one
- [ ] step two

## Acceptance criteria
- [ ] observable condition that proves the task is done

## Verification
How to prove it works (commands, checks). Link any use case:
- Use case: `UC-<JIRA>-NN` — `../../tests/<JIRA>-<slug>/UC-<JIRA>-NN-<slug>.md`

## Notes / work log
Short running notes; bump `updated` when you touch this.
