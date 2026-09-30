---
type: task
schema_version: 1
id: T-NOJIRA-figma-to-code-09
title: Cost and model-tier accounting
description: Record what every run cost, by model tier and pipeline stage, so a tier or effort downgrade can be evaluated as a cost delta against a score delta
jira: null
resource: null
status: todo
independent: false
owner: marcin.ludwig
created: 2026-09-30T10:10:00Z
updated: 2026-09-30T13:45:00Z
tags: [cost, model-routing, measurement]
source_plan: P-NOJIRA-figma-to-code
depends_on: [T-NOJIRA-figma-to-code-07]
---

# Cost and model-tier accounting

> From [P-NOJIRA-figma-to-code](../../plan/NOJIRA-figma-to-code/plan.md), added by Amendment 1.

## Objective
Make "use the cheapest model and the lowest effort setting that does the job" an experiment instead
of an opinion. Every result records what the run cost — tokens by model tier and by pipeline stage —
next to the score and its spread, so downgrading a stage produces two numbers that can be read
against each other.

The rule this enables: **a change that leaves the score inside the measured spread while reducing
cost is an improvement.** Nothing today can express that.

## Steps
- [ ] Extend the result schema with a cost block: tokens in and out per model tier, per pipeline stage, plus wall-clock per stage
- [ ] Record the tier and effort setting each stage actually ran at — the configured value is not evidence, since an override or a fallback can change it silently
- [ ] Aggregate cost across repeated runs the same way scores are aggregated, with its own spread — cost varies per run too, and a cost comparison against a single run is as misleading as a score comparison against one
- [ ] Report cost alongside score in the human-readable summary, not in a separate place a reader has to go looking for
- [ ] Extend `T-NOJIRA-figma-to-code-05`'s registry so a model-judged requirement records the tier and effort it was validated at, making a later downgrade a visible change to that entry rather than an invisible one
- [ ] Document the downgrade experiment as a procedure: swap one stage's tier, re-run with repetition, compare both deltas, keep or revert

## Acceptance criteria
- [ ] Every result carries per-tier and per-stage cost next to the score
- [ ] The recorded tier is what the stage actually ran at, not what configuration requested
- [ ] Repeated runs report a spread for cost as well as for score
- [ ] A model-judged registry entry names the tier and effort it was validated at
- [ ] Downgrading one stage and re-running produces both deltas in a single comparable report

## Verification
Run a corpus case with repetition and confirm cost appears per tier and per stage with its spread.
Then downgrade one stage to a cheaper tier, re-run, and confirm the report shows the score delta and
the cost delta together and states whether the score moved beyond its spread.
- Use case: `UC-NOJIRA-figma-to-code-09` — `../../tests/NOJIRA-figma-to-code/UC-NOJIRA-figma-to-code-09-downgrade-is-decidable.md`

## Notes / work log
Added by Amendment 1 to the plan. Cost is recorded per run and per stage, deliberately not attributed
to individual decisions inside a stage — see the amendment's "Judgement to be aware of".
