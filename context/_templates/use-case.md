---
type: use-case
schema_version: 1
id: UC-<JIRA>-NN        # e.g. UC-ABC-88-01
title: <short title>
description: <one-line summary, used for search/recall>
jira: <JIRA>            # e.g. ABC-88, or null
resource: https://<your-instance>.atlassian.net/browse/<JIRA>   # authoritative source (Jira URL); null if NOJIRA
status: draft           # draft | ready | passing | failing
owner: <name>
created: <YYYY-MM-DDThh:mm:ssZ>   # ISO 8601, set once
updated: <YYYY-MM-DDThh:mm:ssZ>   # ISO 8601, bump on every edit
tags: [<tag>, <tag>]
tests_task: T-<JIRA>-NN     # the task this use case verifies
---

# <Title>

> Verifies [T-<JIRA>-NN](../../work/<JIRA>-<slug>/T-<JIRA>-NN-<slug>.md).

## Preconditions
State the system must be in before the scenario.

## Scenario
| Step | Action | Expected result |
|------|--------|-----------------|
| 1    |        |                 |
| 2    |        |                 |

## Edge cases
- <edge case and expected behavior>

## Result
Last run outcome (set `status` accordingly): pass / fail + notes.
