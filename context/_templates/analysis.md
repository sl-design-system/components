---
type: analysis
schema_version: 1
id: A-<JIRA>            # e.g. A-ABC-88
title: <short title>
description: <one-line summary, used for search/recall>
jira: <JIRA>            # e.g. ABC-88, or null
resource: https://<your-instance>.atlassian.net/browse/<JIRA>   # authoritative source (Jira URL); null if NOJIRA
status: draft           # draft | in-review | done | superseded
owner: <name>
created: <YYYY-MM-DDThh:mm:ssZ>   # ISO 8601, set once
updated: <YYYY-MM-DDThh:mm:ssZ>   # ISO 8601, bump on every edit
tags: [<tag>, <tag>]
# --- external sources (§ 16) ---
# references:            # external sources this document was built from (URLs only; title/date as comment)
#   - https://…          # <what it is>, read <YYYY-MM-DD>
---

# <Title>

## Key questions
What specific questions must this analysis answer? State them as questions, not topics.
What is explicitly out of scope?

## Hypotheses
What do we currently believe, and why? What assumptions are we making going in?
Being explicit here makes it easier to notice when findings contradict them.

## Context & background
Links to Jira, prior analyses, reference material. Use relative links, e.g.
`see [A-XXXX-00](../OTHER-slug/analysis.md)`.

## Findings
The research itself — options, evidence, data, trade-offs.

## What would change our mind
What evidence, result, or fact would lead us to a different conclusion?
If nothing could change our mind, the analysis is a foregone conclusion — reconsider the question.

## Conclusion / recommendation
What the analysis points to. This is what a plan will act on.

## Open questions
Things still unresolved that the plan must decide.

## Leads to
- Plan: `P-<JIRA>` (once created) — `../../plan/<JIRA>-<slug>/plan.md`
