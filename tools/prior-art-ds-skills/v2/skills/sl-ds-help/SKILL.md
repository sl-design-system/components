---
name: sl-ds-help
description: |
  USE WHEN: user says "sl-ds help", "jakie są skille", "co potrafisz", "lista skilli design system", "what can sl-ds do", or asks for overview/catalog of DS capabilities without wanting to actually run anything.
  DOES: Prints the catalog of all sl-ds-* skills with "when to use" hints, grouped by pipeline phase. Optionally narrows the catalog by a keyword from $ARGUMENTS.
  NEVER USE WHEN: user wants to actually start working — they should use /sl-ds (router) which will dispatch.
version: 1.1.0
model: haiku
tags: [sl-ds, help, catalog, discovery]
next:
  on_success: [sl-ds]
  on_failure: [sl-ds]
  related: [sl-ds]
requires:
  artifacts: []
  skills_completed: []
produces:
  artifacts: []
  decisions: []
token_budget: "1-3K"
sub_agents: []
fe_standards_consulted:
  primary: []
  rule_ids: []
---

# DS Help — Skill Catalog

## Purpose

Print the catalog from `references/skill-catalog.md`, optionally narrowed by a keyword. Pure read-and-format; no state, no decisions.

## When to use

- User asks "what skills are available?" / "co potrafisz?"
- New developer onboarding to the pipeline
- Anyone wanting the bigger picture before invoking a specific skill

## When NOT to use

- User wants to actually do something — use `/sl-ds` (auto-router) instead
- User typed a specific skill — that skill runs directly

## Preconditions

None. Works on any directory.

## Inputs

**`$ARGUMENTS`:** optional keyword to narrow the catalog. If absent, print the full catalog.

## Workflow

### Step 1: Load catalog

Read [`references/skill-catalog.md`](references/skill-catalog.md). It's hand-curated and is the canonical content this skill prints.

### Step 2: Filter (if keyword provided)

Compute a per-skill score: `(matches in name × 3) + (matches in tags × 2) + (matches in description.USE WHEN × 1)`. Sort descending; show top 3.

If 0 matches → print full catalog with one-line note: *"No exact match for '<keyword>' — here's everything."*

If >3 matches → show top 3 + *"(+ N more — use `/sl-ds-help` without args for full list)"*.

### Step 3: Present

Print the catalog (or filtered subset) verbatim from `skill-catalog.md`. End with:

```text
> Next: `/sl-ds` (auto-pick) or invoke a specific skill above.
```

## Outputs

None — pure stdout.

## Hard gates

- `references/skill-catalog.md` missing/unreadable → fall back to `ls .agents/skills/sl-ds*` with a one-line apology.

## Resume

_N/A — stateless catalog presentation._

## Next

After `/sl-ds-help`: user reads the catalog, typically picks `/sl-ds` (let-me-decide) or a specific skill. This skill drives nothing.

## References

| File | Load when |
|---|---|
| [skill-catalog.md](references/skill-catalog.md) | Step 1 — the canonical catalog content |
