---
type: task
schema_version: 1
id: T-NOJIRA-figma-to-code-13
title: Experiment comparison across configurations and over time
description: Retain results and compare two runs made under different conditions, reporting the difference against the measured spread so noise is not read as improvement
jira: null
resource: null
status: todo
independent: false
owner: marcin.ludwig
created: 2026-09-30T12:25:00Z
updated: 2026-09-30T13:45:00Z
tags: [measurement, experiments, regression, tooling]
source_plan: P-NOJIRA-figma-to-code
depends_on: [T-NOJIRA-figma-to-code-08, T-NOJIRA-figma-to-code-09]
---

# Experiment comparison across configurations and over time

> From [P-NOJIRA-figma-to-code](../../plan/NOJIRA-figma-to-code/plan.md), added by Amendment 2.

## Objective
Turn a single baseline into a bench. Keep results, and answer the question people will actually
bring to this tool: *did swapping the model, upgrading to a newly released one, or adding a pipeline
step make anything better?*

The answer must be stated against the measured spread. A comparison that does not quote it is not
evidence — and this is precisely the tool someone reaches for when they want to justify a change
they already like.

## Steps
- [ ] Retain every run's result keyed by what identifies it: pipeline commit, model tier and effort per stage, corpus freeze stamp, scoring mode, and the run timestamp
- [ ] Implement `compare <run-a> <run-b>`: per case and per dimension, report both means, both spreads, the delta, and an explicit verdict of better / worse / **indistinguishable**
- [ ] Make "indistinguishable" the default verdict when the delta falls inside the combined spread, and say so in words rather than leaving a reader to compare numbers
- [ ] Report the cost delta alongside the quality delta, so a change that trades one for the other is visible as a trade
- [ ] Refuse to compare runs taken against different corpus freeze stamps — fail with both stamps named rather than producing a number that looks valid
- [ ] Support comparing more than two runs as a series, so quality over time across model releases is readable at a glance
- [ ] Record what differed between the two configurations, derived from the stored identity rather than typed by whoever runs the comparison

## Acceptance criteria
- [ ] Two runs under different conditions produce one comparison naming both means, both spreads, the delta and a verdict
- [ ] A delta inside the combined spread is reported as indistinguishable, in words
- [ ] Comparing across different corpus freeze stamps fails, naming both
- [ ] The comparison states what actually differed between the configurations, taken from stored identity
- [ ] Cost delta appears next to quality delta

## Verification
Run one corpus case with repetition, change one stage's model tier, run again, and compare. Confirm
the verdict, the spreads and the cost delta. Then refresh a corpus case and confirm the comparison
against a pre-refresh run is refused rather than answered.
- Use case: `UC-NOJIRA-figma-to-code-13` — `../../tests/NOJIRA-figma-to-code/UC-NOJIRA-figma-to-code-13-noise-is-not-improvement.md`

## Notes / work log
Added by Amendment 2. The stored history is not authoritative on its own: results are comparable
only against the same frozen corpus, which is why the freeze stamp is part of the identity and why
mismatched comparisons fail rather than warn.
