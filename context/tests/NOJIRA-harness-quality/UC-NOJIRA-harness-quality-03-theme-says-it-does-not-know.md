---
type: use-case
schema_version: 1
id: UC-NOJIRA-harness-quality-03
title: Two NSP designs resolve to two themes, and an unmatched design says so
description: 'The theme decides what every colour measurement means; its failure mode has been a confident tie, not an error'
jira: null
resource: null
status: passing
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
`2026-10-01-a8-nsp-group-list` — two NSP designs that resolve to **different** themes. The themes
under `packages/themes/`, including `max`, which is what A8 actually resolves to rather than the
`sanoma-pro` the batch guessed from the product name.

> **Precondition corrected during the run.** This originally named `a2` and `b-nsp-home` as the
> differing pair, both from file `sSrpLCZm302ces3khoBGls`. Measured: those two resolve to the
> **same** theme, `sanoma-learning`, at 1.0 on token names. The run that resolves to `max` is
> `a8-nsp-group-list`, which is from a **different file**, `4TdMrcnIVOn3Hrfj2OpVZU`. The finding
> the criterion is about — that the theme does not follow the product name — holds either way;
> the pair naming it did not.

Also `fixtures/theme-wrapped-declaration.css` for the resolver regression, and
`fixtures/variable-defs-tie.json` and `fixtures/variable-defs-no-match.json` for the two
controls.

## Scenario

| Step | Action                                                       | Expected result                                      |
| ---- | ------------------------------------------------------------ | ---------------------------------------------------- |
| 1    | Run against `a2-nsp-class-overview`                          | a theme, with the matched variable names as evidence |
| 2    | Run against `a8-nsp-group-list`                              | a **different** theme, with its own evidence         |
| 3    | Resolve a theme fixture whose declaration wraps across lines | resolved correctly                                   |
| 4    | Feed variable defs matching no theme                         | **reported as no match**, not scored                 |
| 5    | Feed defs that match two themes equally                      | **reported as a tie**, not settled by file order     |

Steps 4 and 5 are the negative controls, and step 3 is a regression. An earlier version failed
to flatten declarations wrapping across lines, so the resolver silently missed exactly the
indirections that mattered and **reported a three-way tie where the right answer matches every
token**. It returned a result, not an error.

## Edge cases

- The theme does not follow the product name. Step 2 exists because of this. The stronger claim
  that it follows the **frame** rather than the file is **not demonstrated by this corpus**: the
  two runs sharing a file resolve identically, and the run that differs is from another file.
- A near-tie must not be broken by directory order; it must surface.

## Result

**Passing**, 2026-10-05.

| Step | Outcome                                                                                                                                                         |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | `a2-nsp-class-overview` → `sanoma-learning`, method `token-name`, agreement **1.0**, confident                                                                  |
| 2    | `a8-nsp-group-list` → `max`, method `token-name`, agreement **1.0**, confident — a different theme on the same product                                          |
| 3    | `fixtures/theme-wrapped-declaration.css`: a three-line wrap, a `var( --x )` with spaces, a two-hop chain, a forward reference and a cycle all resolve correctly |
| 4    | `fixtures/variable-defs-no-match.json` → `outcome: no-evidence`, `best: null`, **exit 5**                                                                       |
| 5    | `fixtures/variable-defs-tie.json` → `outcome: tied`, `tiedBetween: [bingel-dc, bingel-int]`, `best: null`, **exit 4**                                           |

The defect step 5 caught in the live corpus: **`a7-myportal-materials-overviews` was reporting
`bingel-dc`** on a hex-value tie where `bingel-dc` and `bingel-int` both agree on 100% of its
hexes. Nothing distinguished them but `readdirSync` order. It now reports the tie and exits 4,
and it is the only verdict in nineteen that changed.

The decomposition itself was proved inert first: **19/19 outputs byte-identical** with the tie
change pinned back.
