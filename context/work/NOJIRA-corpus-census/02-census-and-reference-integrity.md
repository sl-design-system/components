---
type: task
schema_version: 1
id: T-NOJIRA-corpus-census-02
title: The census, and reference integrity enforced rather than recorded
description: 'Per run: provenance class, whether it renders, and a reference state that is refused when it is corrupt'
jira: null
resource: null
status: todo
independent: false
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T00:00:00Z
tags: [corpus, provenance, reference]
source_plan: P-NOJIRA-corpus-census
depends_on: [T-NOJIRA-corpus-census-01]
---

# The census, and reference integrity enforced rather than recorded

## Objective

Two plans were approved assuming nineteen usable runs. Establish what the corpus actually is.

This task also **owns reference integrity**, which a review found orphaned — one document had cut
it, another still required it, no task held it.

## Steps

> Task 01 produced [`render-failure-taxonomy.md`](../../analyzes/NOJIRA-figma-to-code/render-failure-taxonomy.md),
> which already classifies every run by why it renders or does not, with the parser error quoted.
> **Start from it rather than re-deriving step 2**, and treat its two named provenance surprises
> as inputs: `a1` renders seven of its ten regions and three of them are fiction, and three runs
> (`a8-nsp-group-list`, `b-itsl-course-course-files`, `b-kampus-notes-panel`) hold captures that
> no version of `normalise-captures.mjs` produces, because a backfill agent wrote them by hand.
> That last group is a fourth provenance class the task's step 1 does not list.

1. For each run record the **provenance class**: Figma's bytes, reconstructed, summarised, or
   agent prose. `a1` holds `function IconButton({…})` and `{lorem-ipsum description}` — that is
   not Figma output and must not be classified as though it were.
2. Record whether it renders, after task 01.
3. Record the **reference state**: exact, downscaled with its factor, channel-halved, or
   undeclared frame.
4. **Refuse** a channel-halved reference — it is lossy and not invertible. **Name** an undeclared
   frame: three runs' metadata begins with prose, and `render-design.mjs` silently falls back to
   a hardcoded `1440×1024`, so their geometry would otherwise be scored against a fabricated
   frame.
5. Write `census.json`.

## Acceptance criteria

- All nineteen runs present, **no `unknown` provenance** — a run whose class cannot be determined
  is named as such, not defaulted. This includes the hand-backfilled class, which is not one of
  the four step 1 names.
- Plan against **9 of 19 rendering**, the figure measured after task 01, not the 15 the roadmap
  estimated.
- A channel-halved reference is refused; an undeclared frame is named.
- **No run is scored against a fabricated frame.**

## Verification

Read `census.json` against the measurements in `sequencing.md`; the known-bad cases — `a1` prose, `a3` channel-halved, `a9`/`b-nsp-home` prose-headed metadata — must each appear with the right class.
