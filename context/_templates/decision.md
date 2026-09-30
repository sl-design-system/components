---
# Location: architecture/decisions/<JIRA>/AD-<id>-<slug>.md (ticket-tied) or architecture/decisions/AD-<slug>.md (repo-wide, jira: null) — CONVENTIONS § 18.
# Gate: create only once the driving analysis has status: done (CI enforces it).
type: decision
schema_version: 1
id: AD-<JIRA>            # ticket-tied: AD-ABC-88 ; cross-cutting: AD-<slug> (e.g. AD-token-storage)
title: <the decision, stated as a choice>
description: <one-line summary, used for search/recall>
jira: <JIRA>            # the ticket that prompted it, or null
resource: https://<your-instance>.atlassian.net/browse/<JIRA>   # authoritative source (Jira URL); null if NOJIRA
status: proposed        # proposed | accepted | superseded | deprecated | rejected
owner: <name>
created: <YYYY-MM-DDThh:mm:ssZ>   # ISO 8601, set once
updated: <YYYY-MM-DDThh:mm:ssZ>   # ISO 8601, bump on every edit
tags: [<tag>, <tag>]
# optional upward links:
# source_analysis: A-<JIRA>
# source_plan: P-<JIRA>
# supersedes: AD-<old>      # set on the new decision; mark the old one status: superseded
---

# <Decision title>

> MADR-style architecture decision record.

## Context
The problem / forces that make a decision necessary. Link the driving analysis or plan.

## Options considered
For each option: state it clearly, then list pros and cons. Don't omit the status quo.

1. **<option A>** — pros / cons
2. **<option B>** — pros / cons
3. **Status quo / do nothing** — why this is or isn't acceptable

**What would make us choose differently?**
What assumption, constraint, or piece of missing data is the deciding factor?
If that assumption turns out to be wrong, which option wins instead?

## Decision
The option chosen and the one-sentence reason why.

## Consequences
- Positive: …
- Negative / trade-offs: …
- Follow-up work (tasks): `T-<JIRA>-NN` …

## What would invalidate this decision
Conditions under which this decision should be revisited (e.g. scale threshold,
regulatory change, new capability becoming available).
