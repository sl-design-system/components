---
type: use-case
schema_version: 1
id: UC-NOJIRA-harness-quality-03
title: Two NSP designs resolve to two themes, and an unmatched design says so
description: 'The theme decides what every colour measurement means; its failure mode has been a confident tie, not an error'
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T00:00:00Z
tags: [harness, themes, negative-control]
tests_task: T-NOJIRA-harness-quality-03
---

# Two NSP designs resolve to two themes, and an unmatched design says so

> Verifies [T-NOJIRA-harness-quality-03](../../work/NOJIRA-harness-quality/03-theme-match.md).

## Preconditions

`figma-variable-defs.json` from `2026-10-01-a2-nsp-class-overview` and
`2026-10-01-b-nsp-home` — two designs from the same Figma file,
`sSrpLCZm302ces3khoBGls`, which resolve to **different** themes. The themes under
`packages/themes/`, including `max`, which is what NSP actually resolves to rather than the
`sanoma-pro` the batch guessed from the product name.

## Scenario

| Step | Action                                                       | Expected result                                      |
| ---- | ------------------------------------------------------------ | ---------------------------------------------------- |
| 1    | Run against `a2-nsp-class-overview`                          | a theme, with the matched variable names as evidence |
| 2    | Run against `b-nsp-home`                                     | a **different** theme, with its own evidence         |
| 3    | Resolve a theme fixture whose declaration wraps across lines | resolved correctly                                   |
| 4    | Feed variable defs matching no theme                         | **reported as no match**, not scored                 |
| 5    | Feed defs that match two themes equally                      | **reported as a tie**, not settled by file order     |

Steps 4 and 5 are the negative controls, and step 3 is a regression. An earlier version failed
to flatten declarations wrapping across lines, so the resolver silently missed exactly the
indirections that mattered and **reported a three-way tie where the right answer matches every
token**. It returned a result, not an error.

## Edge cases

- The theme belongs to the **frame**, not the file — Figma variable modes mean two frames of one
  file resolve differently. Step 2 exists because of this.
- A near-tie must not be broken by directory order; it must surface.

## Result

Not yet run.
