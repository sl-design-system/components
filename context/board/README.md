# Claim board

The lightweight coordination substrate for parallel execution (CONVENTIONS § 19). Humans
and agents are peers here: before working a unit (a task or use case), **claim it** — one
claim file per unit, so "who owns this right now" is always answerable from Git alone.

- Create a claim from [`_templates/claim.md`](../_templates/claim.md) as
  `CL-<JIRA>-NN-<slug>.md` in this directory.
- The claim's `unit:` field points at the task / use-case id — the validator checks it
  resolves to a real document.
- Statuses: `claimed` → `in-progress` → `released` (gave it back) or `done` (delivered).
- Release your claims when you stop working; on handoff, update `owner` (CONVENTIONS § 11).

Example claim frontmatter:

```yaml
---
type: claim
schema_version: 1
id: CL-ABC-123-01
title: jane.doe implements T-ABC-123-01
description: Claim on the API task of ABC-123
jira: ABC-123
resource: null
status: claimed
owner: jane.doe
created: 2026-01-01T09:00:00Z
updated: 2026-01-01T09:00:00Z
tags: [board]
unit: T-ABC-123-01
---
```
