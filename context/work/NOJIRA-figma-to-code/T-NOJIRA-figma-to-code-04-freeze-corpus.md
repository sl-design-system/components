---
type: task
schema_version: 1
id: T-NOJIRA-figma-to-code-04
title: Freeze the initial corpus in a design-system-owned Figma file
description: Create the protected Figma file, copy in the initial cases, and record the freeze procedure and its guard
jira: null
resource: null
status: blocked
independent: false
owner: marcin.ludwig
created: 2026-09-30T08:20:00Z
updated: 2026-10-05T00:00:00Z
tags: [corpus, figma, foundation]
source_plan: P-NOJIRA-figma-to-code
depends_on: [T-NOJIRA-figma-to-code-01, T-NOJIRA-figma-to-code-03]
---

> **Reviewed 2026-10-05 — blocked.** Says "select three initial cases"; nineteen are registered and were run. Also mis-ordered — `sequencing.md` builds over captures already on disk, so a fresh freeze is needed only when Figma is touched again.

# Freeze the initial corpus in a design-system-owned Figma file

> From [P-NOJIRA-figma-to-code](../../plan/NOJIRA-figma-to-code/plan.md).

## Objective

Create the Figma file the measurements are taken against, and make it impossible for a product
team to change a baseline out from under us without the harness noticing. This is the task the whole
method rests on: without a guaranteed-stable input, every later number is incomparable, and it fails
silently rather than loudly.

## Two lists, not one — settled by a survey run before this was planned

A survey of 545 screens across 11 teams established that **type coverage and team coverage are
different jobs**, and that forcing both into one list makes both worse. The corpus is therefore two
lists with different rules and different cadences:

|             | **Fidelity corpus**                                         | **Representativeness sample**                               |
| ----------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| Purpose     | exercise every failure mode the pipeline can hit            | check the corpus still resembles what teams actually draw   |
| Selected by | type — clean, override-heavy, detached, partial, local-only | team — at least two per team, closest to that team's median |
| Size        | 10–13 cases                                                 | ~2 per team, currently 21                                   |
| Frozen?     | yes, copied into the design-system-owned file               | no — refreshed from live files                              |
| Run         | every bench run                                             | occasionally, or when a question arises                     |

Balancing the frozen corpus by team would bloat it — 11 teams at two each is 22 cases on every run —
and would spend slots on teams whose designs exercise nothing new. Selecting it purely by type, on
the other hand, silently assumes the teams not represented behave like the ones that are. The sample
is what tests that assumption, and it is also the feeder: a team pattern the sample finds that no
corpus case covers is a candidate for promotion.

## Steps

- [ ] Create a new Figma file owned by the design system team, with product teams having view access only
- [ ] Build **both** lists: the frozen fidelity corpus selected by type, and the representativeness sample at two per team. Candidates from the survey are in the run artifacts; they need a human pass before freezing (see the caveats below)
- [ ] Run the intake report first and select from its output rather than by eye: the corpus should span the observed range of design-system adoption, not only the well-behaved end of it
- [ ] Select three initial cases of increasing complexity: a single design system component instance; a composition of several instances inside one container; a panel containing a list or accordion — the shape where the existing pipeline reported seam and inset defects
- [ ] Choose cases that avoid the fourteen unmapped Code Connect components, so strict mode is exercisable from day one — the intake report names which components each candidate design actually uses, so this is a lookup rather than a guess
- [ ] Copy the chosen nodes into the corpus file and register each one with its file key, node id and current `lastModified`
- [ ] Freeze the **reference capture parameters** with the case — the bounds and scale the reference image was rendered at — because the first run showed the cached image does not match the frame it came from
- [ ] Implement the freeze guard: every run compares the live `lastModified` against the registered stamp and fails the case when they differ, naming what changed
- [ ] Document the freeze procedure — how a case is added, how a deliberate refresh is done, and why an accidental edit must fail rather than warn

## Acceptance criteria

- [ ] Both lists exist, with the corpus frozen and the sample recorded as live references
- [ ] Every corpus case has been opened and eyeballed before freezing — the survey classifier is a
      heuristic and produced at least three candidates that look wrong on inspection: an annotation
      frame scored as heavily detached, near-duplicate variants of one screen, and one node id that
      addresses an instance-internal node rather than a frame
- [ ] Every case is registered and resolves to a real node in the design-system-owned file
- [ ] Case selection cites the intake report — which adoption level each case represents and why that spread was chosen
- [ ] A run against an edited corpus case fails with a message naming the case and both stamps, and does not produce a score
- [ ] The freeze procedure is written down where the next person will find it, not only in this task

## Verification

Register the three cases, run the harness, then edit a copied node in Figma and re-run. The second
run must fail on the changed case and still process the unchanged ones.

- Use case: `UC-NOJIRA-figma-to-code-04` — `../../tests/NOJIRA-figma-to-code/UC-NOJIRA-figma-to-code-04-edited-corpus-fails-loudly.md`
