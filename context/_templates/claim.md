---
# Location: board/CL-<JIRA>-NN-<slug>.md — one claim per unit of work (CONVENTIONS § 19).
type: claim
schema_version: 1
id: CL-<JIRA>-NN        # mirrors the claimed unit's number, e.g. CL-ABC-123-01
title: <who claims what, e.g. "jane.doe implements T-ABC-123-01">
description: <one-line summary, used for search/recall>
jira: <JIRA>            # e.g. ABC-123, or null
resource: null
status: claimed         # claimed | in-progress | released | done
owner: <name>           # the claimant — human or agent
created: <YYYY-MM-DDThh:mm:ssZ>   # ISO 8601, set once
updated: <YYYY-MM-DDThh:mm:ssZ>   # ISO 8601, bump on every state change
tags: [board]
unit: T-<JIRA>-NN       # the task / use-case id this claim covers (must resolve)
---

# <Title>

> Claims [T-<JIRA>-NN](../work/<JIRA>-<slug>/T-<JIRA>-NN-<slug>.md).

## Notes

Optional running notes: progress, blockers, handoff context. A claim is coordination
state, not knowledge — keep the substance in the unit itself.
