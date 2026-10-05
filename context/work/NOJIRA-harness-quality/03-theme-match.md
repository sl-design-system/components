---
type: task
schema_version: 1
id: T-NOJIRA-harness-quality-03
title: Make theme-match testable, and make it able to say it does not know
description: 'It decides which theme every colour measurement is taken under; a wrong answer silently invalidates every colour figure downstream'
jira: null
resource: null
status: todo
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

## Verification

Run against the corpus's variable-defs files; the two NSP runs must disagree, and the
no-match fixture must refuse.
