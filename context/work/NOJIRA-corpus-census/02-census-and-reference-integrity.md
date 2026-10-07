---
type: task
schema_version: 1
id: T-NOJIRA-corpus-census-02
title: The census, and reference integrity enforced rather than recorded
description: 'Per run: provenance class, whether it renders, and a reference state that is refused when it is corrupt'
jira: null
resource: null
status: in-progress
independent: false
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-07T12:15:00Z
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
4. **Refuse** a channel-halved reference — it is lossy and not invertible. The undeclared-frame
   half of this step is **already done**: `T-NOJIRA-harness-quality-02` measured six runs on the
   fabricated `1440×1024`, not three, found that all six declare a root the reader never searched
   for, and made the probe refuse rather than substitute. Record the frame each run declares from
   `render-design.mjs --run <run>`; do not re-derive it.
5. Write `census.json`.

## Acceptance criteria

- All nineteen runs present, **no `unknown` provenance** — a run whose class cannot be determined
  is named as such, not defaulted. This includes the hand-backfilled class, which is not one of
  the four step 1 names.
- Plan against **9 of 19 rendering**, the figure measured after task 01, not the 15 the roadmap
  estimated.
- A channel-halved reference is refused; an undeclared frame is named.
- **No run is scored against a fabricated frame** — met for all nineteen as of
  `T-NOJIRA-harness-quality-02`; this task records the result rather than re-establishing it.

## Verification

Read `census.json` against the measurements in `sequencing.md`; the known-bad cases — `a1` prose, `a3` channel-halved, `a9`/`b-nsp-home` prose-headed metadata — must each appear with the right class.

## Result

`runs/census.json`, produced by `runs/harness/census.mjs` (36 unit tests in `census.test.mjs`,
every detector pinned against the runs `render-failure-taxonomy.md` names). Deterministic: two
consecutive runs are byte-identical; there is no generation timestamp.

```
node runs/harness/census.mjs --runs runs --index captures-v2 --out runs/census.json
```

### The counts

Nineteen runs, **no `unknown` provenance**. Provenance classifies the committed `captures/` source,
so the class describes the artifact as it was captured, not the repaired copy.

| Provenance        | Runs | Which                                                                     |
| ----------------- | ---- | ------------------------------------------------------------------------- |
| `figma-bytes`     | 11   | real `get_design_context` output, `data-node-id` on its elements          |
| `agent-prose`     | 4    | `a1` (`{ ... }`), `a9` (`<!--`), `a11`, `b-itsl-bookmk-course-files`      |
| `hand-backfilled` | 3    | `a8`, `b-itsl-course-course-files`, `b-kampus-notes-panel`                |
| `summarised`      | 1    | `a5-etsl-metadata-usage-widget` — under 10 KB and under ¼ of its metadata |

**9 of 19 render** against `captures-v2`, reproducing the figure task 01 measured — the probe is
`render-design.mjs`'s own, not a reimplementation. `a1` is recorded as the taxonomy warned: seven of
ten regions render, so `renders: false` with `regionsRendered: 7` is the honest shape of it.

| Reference        | Runs | Note                                                                                               |
| ---------------- | ---- | -------------------------------------------------------------------------------------------------- |
| `exact`          | 10   | within one pixel of the declared frame on both axes                                                |
| `downscaled`     | 6    | strictly smaller on both axes; factor recorded (0.891, 0.8, 0.8, 0.788, 0.677, 0.677)              |
| `mismatched`     | 2    | `b-itsl-bookmk-deleted-course` 1280×1073 vs 1280×1082; `b-kampus-notes-panel` 1280×727 vs 1280×720 |
| `channel-halved` | 1    | `a3-myportal-digital-exercises`, brightest channel 128 — **refused**                               |

Frame declared **19 of 19**, undeclared 0 — recorded from `render-design.mjs`'s own resolution, as
the step says, not re-derived. `capturedAt` across the sixteen non-backfilled runs spans **70 ms**,
so `capturedAtIsNormalisationTime: true`: the field records when the index was built, not when
Figma was read.

### What changed against `sequencing.md`

`sequencing.md` counted **seven** downscaled references. The census finds six, plus two it names
`mismatched`: width equal to the frame, height short by nine and seven rows. The first draft of
the classifier called both of those _exact_ under a 1 % ratio tolerance — a percentage quietly
absorbs a reference cropped by a few rows, which is the kind of thing this census exists to name.
The tolerance is now one pixel, absolute, and a test pins the `1280×1073` case so it cannot
regress to exact. Which of the two `sequencing.md` had counted as the seventh downscale is not
recoverable from its text and does not matter: both are now named with both sizes, and
`T-NOJIRA-corpus-census-04` decides what a mismatch admits.

### Reading it against the verification list

`a1` — `agent-prose`, evidence `{ ... }`. `a3` — `channel-halved`, refused. `a9` — `agent-prose`,
evidence `<!--`. `b-nsp-home` — its design context is `figma-bytes` and fails on an unclosed
element, exactly as `render-failure-taxonomy.md` line 63 has it; the prose that heads its
_metadata_ capture is on the metadata axis, which this census does not classify.

### Out-of-scope edits, surfaced

`runs/harness/pngjs.d.ts` (new) and the include register in `runs/harness/tsconfig.json`: `pngjs`
ships no types and the harness typechecks with `--noEmit -p runs/harness`, so the module needed a
declaration to keep `tsc` clean. Nothing under `runs/2026-10-01-*` was modified.
