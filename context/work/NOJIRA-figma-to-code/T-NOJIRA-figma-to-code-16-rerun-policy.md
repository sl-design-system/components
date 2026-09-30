---
type: task
schema_version: 1
id: T-NOJIRA-figma-to-code-16
title: Rerun policy and its automation
description: Make a rerun one command with a stated trigger list, so measuring after a change is structural rather than remembered
jira: null
resource: null
status: todo
independent: false
owner: marcin.ludwig
created: 2026-09-30T23:40:00Z
updated: 2026-09-30T23:40:00Z
tags: [measurement, process, ci, regression]
source_plan: P-NOJIRA-figma-to-code
depends_on: [T-NOJIRA-figma-to-code-13, T-NOJIRA-figma-to-code-15]
---

# Rerun policy and its automation

> From [P-NOJIRA-figma-to-code](../../plan/NOJIRA-figma-to-code/plan.md), added by Amendment 5.

## Objective
Decide **now**, while nothing is at stake, when the bench runs again — and make running it one
action so the decision survives contact with a deadline.

A measurement discipline that depends on somebody remembering to measure is not a discipline. The
point of fixing the triggers up front is that the awkward rerun — the one after a change you are
confident about, under time pressure — is the one that gets skipped, and it is also the one most
likely to find something.

## Steps
- [ ] Write the trigger list and put it where a change is made, not only in this task: **a requirement lands**; **a model, tier or effort setting changes anywhere in the pipeline**; **the pipeline changes for any other reason** — a prompt edit, a dependency bump; **a new model is released** and is a candidate; **the corpus is refreshed**, which invalidates comparison against the old baseline rather than producing a delta
- [ ] Add the **scheduled rerun with no change at all** — monthly is a reasonable starting cadence. This is the trigger nobody thinks of and the only one that catches drift the team did not cause: the model provider updates a model, Figma changes a renderer, a dependency shifts. Without it, an unexplained regression is discovered later and attributed to whatever was touched most recently
- [ ] Make a rerun one command: run the whole corpus with repetition, compare against the recorded baseline, print the verdict per case and in aggregate
- [ ] **Always run the whole corpus**, never only the case believed to be affected — a change that fixes one screen and breaks another is exactly what this exists to catch, and it is invisible to a targeted run
- [ ] Wire a check into CI on the pipeline's paths that flags a change with no rerun recorded against it. Flag, do not block, at least at first: a hard block on a slow expensive job teaches people to route around it
- [ ] Define what a regression does — who is told, whether the change reverts by default, and where the decision is recorded if it does not
- [ ] State the retention rule: every rerun's result is kept, and comparisons across a corpus refresh are refused rather than answered

## Acceptance criteria
- [ ] The trigger list exists where a change is made, not only in documentation
- [ ] One command runs the corpus, compares against the baseline, and prints a verdict
- [ ] A scheduled rerun exists and has run at least once with no change, establishing what "no change" looks like as a number
- [ ] CI flags a pipeline change with no rerun recorded
- [ ] A comparison across a corpus refresh is refused, naming both freeze stamps
- [ ] The regression path is written down, including who decides and where that is recorded

## Verification
Make a no-op change under the pipeline path and confirm CI flags the missing rerun. Run the
scheduled rerun twice with nothing changed and confirm the two agree within the measured spread —
if they do not, the spread is understated and that is a finding about the bench, not about the
pipeline.
- Use case: `UC-NOJIRA-figma-to-code-16` — `../../tests/NOJIRA-figma-to-code/UC-NOJIRA-figma-to-code-16-a-change-cannot-slip-through.md`

## Notes / work log
Added by Amendment 5. Deliberately after the baseline: there is nothing to compare against before
it, and automating a comparison that has never been run by hand is how the automation ends up
measuring the wrong thing.
