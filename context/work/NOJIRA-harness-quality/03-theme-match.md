---
type: task
schema_version: 1
id: T-NOJIRA-harness-quality-03
title: Make theme-match testable, and make it able to say it does not know
description: 'It decides which theme every colour measurement is taken under; a wrong answer silently invalidates every colour figure downstream'
jira: null
resource: null
status: done
independent: false
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T00:00:00Z
tags: [harness, themes, testing]
source_plan: P-NOJIRA-harness-quality
depends_on: [T-NOJIRA-harness-quality-01]
---

# Make theme-match testable, and make it able to say it does not know

## Objective

`theme-match.mjs` picks the theme a design was drawn against, by matching variable names against
each theme's custom properties. 266 lines, no exports, no tests.

It exists because the batch guessed from the product name and was wrong: NSP was mapped to
`sanoma-pro`, whose tokens resolve green, while the design's variables are teal — the values
`packages/themes/max` resolves them to. **Every colour pixel measured under the wrong theme
describes the wrong theme.**

Its own history carries the warning this task has to act on: an earlier version failed to flatten
declarations wrapping across lines, so the resolver silently missed exactly the indirections that
mattered and **reported a three-way tie where the right answer matches every token**. It returned
a result, not an error.

## Steps

1. Write the use case, with preconditions naming real runs — two NSP designs that resolve to
   **different** themes, which is the finding that overturned the original mapping.
2. Decompose: theme loading, `var()` chain resolution, name matching, scoring.
3. Unit-test the resolver against a theme fixture containing a declaration **wrapped across
   lines**, which is the shape that caused the silent miss.
4. Validate the variable-defs input with zod at the boundary.
5. Negative control: a design whose variables match **no** theme must report that, and a
   near-tie must be reported as a tie rather than resolved by ordering.

## Acceptance criteria

- The two NSP designs resolve to their two different themes, each naming the evidence.
- A wrapped declaration resolves correctly, proved by a fixture that fails against the old
  flattening.
- **A design matching no theme is reported, not scored**; a tie is reported as a tie.
- The negative control is shown going red against a damaged theme file.

## Outcome

Delivered 2026-10-05. 266 lines with no export became **19 exported functions and 58 tests**.

- **Byte-identity first.** The decomposition was measured with the tie change pinned back to the
  old behaviour: **19/19 outputs byte-identical**, stderr identical. Only then did the behaviour
  change go in.
- **One verdict in nineteen moved, and it was wrong before.**
  `a7-myportal-materials-overviews` reported `bingel-dc` on a hex-value tie where `bingel-dc` and
  `bingel-int` each agree on **100%** of its hexes. The winner was `readdirSync` order. It now
  reports `outcome: tied`, `best: null` and exits 4.
- **Two exits where there was silence.** A tie leaves by **4**, no evidence at all by **5** —
  `a11-sesame-learning-materials` is the corpus case. A theme name a later stage reads as settled
  is worse than a gap.
- **The wrapped-declaration regression is pinned by a fixture.**
  `fixtures/theme-wrapped-declaration.css` carries the shape that caused the silent miss, plus a
  `var( --x )` with spaces, a two-hop chain, a forward reference, a missing property with and
  without a fallback, and a cycle. Mutating the flattening fails it.
- **Mutation-checked, 26 mutations over 19 exports.** Four survived the first pass and gained
  tests. The fifth exposed something else: once an unbroken tie yields no winner, the old
  `!results.slice(1).some(other => other.score === 1)` clause in the confidence rule became
  **unreachable**. It was removed rather than left in — an unreachable condition in a decision
  rule reads as a guarantee and is not one.

### A precondition that was wrong, and what is true instead

Step 1 asked for "two NSP designs from the same Figma file that resolve to different themes".
Measured: `a2-nsp-class-overview` and `b-nsp-home` are the same file
(`sSrpLCZm302ces3khoBGls`) and resolve to the **same** theme, `sanoma-learning`, at 1.0.
`a8-nsp-group-list` resolves to `max` and is from a **different** file
(`4TdMrcnIVOn3Hrfj2OpVZU`).

So the criterion is met by `a2` against `a8`, and what this corpus demonstrates is that **the
theme does not follow the product name** — the finding that overturned the original mapping. The
stronger "two frames of one file resolve differently" is not supported by any of the nineteen
runs; `session-2026-10-05.md` has been annotated rather than rewritten.

## Verification

Run against the corpus's variable-defs files; the two NSP runs must disagree, and the
no-match fixture must refuse.
