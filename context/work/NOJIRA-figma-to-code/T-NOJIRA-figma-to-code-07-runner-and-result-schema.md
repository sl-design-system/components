---
type: task
schema_version: 1
id: T-NOJIRA-figma-to-code-07
title: Runner command and result schema
description: One command that runs a case end to end and writes a versioned, machine-readable result
jira: null
resource: null
status: todo
independent: false
owner: marcin.ludwig
created: 2026-09-30T08:20:00Z
updated: 2026-10-01T01:00:00Z
tags: [harness, tooling]
source_plan: P-NOJIRA-figma-to-code
depends_on: [T-NOJIRA-figma-to-code-04, T-NOJIRA-figma-to-code-06]
---

# Runner command and result schema

> From [P-NOJIRA-figma-to-code](../../plan/NOJIRA-figma-to-code/plan.md).

## Objective
Turn the metrics into something a person and a pipeline can both consume. The result schema is the
contract every later slice writes its acceptance against, so it is versioned from the first commit.

## The Figma rate limit makes caching a requirement, not an optimisation

Figma's documented limits apply **identically to the remote and the desktop servers** — the
deployment method makes no difference. On an Organization plan with a Dev or Full seat the ceiling
is **600 tool calls per day and 20 per minute** (Professional: 200/day, 10/min; View and
Collaborator seats: 6 per month, which cannot run this at all).

A naive bench run does not fit. Eleven corpus cases × three repeats × roughly five Figma calls each
is **165 calls — more than a quarter of a day's budget for one run**, before any comparison rerun.

The frozen corpus is what makes this a non-problem, and it is worth stating as a design rule rather
than leaving to be rediscovered: **a frozen case's Figma data is fetched once and cached forever.**
Nothing about it can change without the freeze stamp changing, so a rerun re-renders and re-measures
but makes **zero** Figma data calls. The only live call is one cheap metadata check per case to
verify the stamp — eleven calls per run rather than 165.

This also means repetition is free on the Figma side: `--repeat 3` triples the rendering work and
adds nothing to the quota, which is what makes variance affordable to measure at all.

## Steps
- [ ] Implement `run <case>` and `run all`: resolve the case, verify the freeze stamp, drive the generation pipeline, collect the metrics, write the result
- [ ] Define a versioned result schema carrying the score, the per-dimension breakdown, the scoring mode, the corpus freeze stamp, the pipeline commit measured, and the artifact paths
- [ ] Write a human-readable summary next to the machine-readable result — the report is read by people who will not open JSON
- [ ] Make a failed case a first-class result rather than a crash: record why it failed and carry on with the remaining cases
- [ ] Start and stop the dev server once per run, and clean it up even when a case fails
- [ ] Fetch a frozen case's Figma data **once** and cache it permanently; a rerun makes no Figma data calls at all, only one metadata call per case to verify the freeze stamp
- [ ] Fail loudly rather than silently degrading when the rate limit is hit — a partially-fetched run that still produces a score is worse than no score
- [ ] Keep the schema and the runner free of any assumption that the thing measured is the Figma-to-HTML stage — a second stage must plug in as another target rather than requiring a fork (Amendment 2)

## Acceptance criteria
- [ ] `yarn harness run all` produces one result file per case plus an aggregate, and leaves no orphaned server process
- [ ] A rerun over the whole corpus makes at most one Figma call per case
- [ ] The result records which pipeline commit it measured, so an old result can never be mistaken for a current one
- [ ] No field, path or assumption in the schema names the first stage specifically
- [ ] A case that fails mid-run appears in the output as a failure with a reason, and the other cases still complete

## Verification
Run the full corpus, then run it again with one case deliberately broken. Confirm the broken case
is reported and the others still produce results. Check no process survives the run.
- Use case: `UC-NOJIRA-figma-to-code-07` — `../../tests/NOJIRA-figma-to-code/UC-NOJIRA-figma-to-code-07-run-all-is-resilient.md`
