---
type: task
schema_version: 1
id: T-NOJIRA-corpus-census-01
title: Repair the advisory-block split
description: Six of the ten non-rendering runs fail on one concatenation bug; fixing it decides whether the downstream plan runs at full scope
jira: null
resource: null
status: done
independent: true
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T17:05:00Z
tags: [captures, parsing, corpus]
source_plan: P-NOJIRA-corpus-census
depends_on: []
commit: cbe4455efe90a779b7610d0ccf1c8b6ec774aada
---

# Repair the advisory-block split

## Objective

`get_design_context` returns the code **and five advisory blocks** — a stack-conversion notice,
a node-id notice, a style list, component descriptions, an asset-expiry notice — and they arrive
**with no separator**. `extractBlocks` in `runs/harness/normalise-captures.mjs` does not split
them, so prose ends up concatenated with code and a TSX loader rejects the file.

**Six of the ten runs that do not render fail for this reason alone.** Their captures are
otherwise sound.

## Steps

1. Identify the sentinels that begin each advisory block, from the captures themselves rather
   than from documentation that does not exist.
2. Split on them in `extractBlocks`, emitting the code block and each advisory as separate
   entries distinguished by the `part` field the capture protocol already defines.
3. Re-normalise **to a new versioned output**, never over the existing index. The nineteen
   indexes were already rebuilt once from the runs' own markdown, with every `capturedAt` inside
   64 ms; overwriting would add a second undisclosed layer.
4. Count how many runs render before and after.

## Acceptance criteria

- Each advisory block is its own entry with `part` set; the code block is unchanged bytes.
- The re-normalisation is a new versioned artifact and the original is untouched.
- **The count of rendering runs is reported before and after** — a number, not an impression.

## Verification

`node runs/harness/render-design.mjs --run <run>` over all nineteen, counted both ways.

## Result

### The split

The five sentinels, read off the captures: `SUPER CRITICAL: The generated React+Tailwind code
MUST be converted` · `Node ids have been added to the code as data attributes` · `These styles
are contained in the design:` · `Component descriptions: The following components have usage
descriptions` · `Images and SVGs will be stored as constants`.

Measured first, before any split was written: **no sentinel anywhere in the corpus falls inside
a fence.** A fenced response therefore already kept its code clean and merely discarded the
advisories; an unfenced one concatenated them onto the code. Both now produce a `part: 'code'`
entry and one `part: 'advisory'` entry per block, named by an `advisory` field.

Three paths needed it, not one. Repairing `extractBlocks` alone left two runs exactly as broken,
because their advisories ride on a **continuation** — the mid-syntax second and third parts of a
split response, which never reach `extractBlocks`. A third run carried two of its five blocks
**ahead** of the code, in the region discarded as commentary.

**116 advisory blocks recovered, 0 code captures still contaminated** — against an inventory of
the raw markdown taken independently, which counts 116.

### The counts

Two framings, because re-normalising is not a pure function of the repair: three runs
(`a8-nsp-group-list`, `b-itsl-course-course-files`, `b-kampus-notes-panel`) hold design-context
captures that **no version of the script produces** — their markdown is agent prose, and their
`captures/` entries were backfilled by hand. Regeneration drops them either way.

|                                                                                    | before     | after      |
| ---------------------------------------------------------------------------------- | ---------- | ---------- |
| **Old code vs new, both regenerated from the same markdown** — isolates the repair | **6 / 19** | **9 / 19** |
| `captures/` as it stands on disk vs `captures-v2/`                                 | 9 / 19     | 9 / 19     |
| regions (isolated framing)                                                         | 49 / 71    | 59 / 71    |

"Renders" is every region transforming. The looser reading — at least one region — moves 9 → 11
in the isolated framing.

**Three runs flip**: `a2-nsp-class-overview` (0 of 8 regions → 8 of 8), `a10-etsl-fam-users`,
`b-itsl-bookmk-deleted-course`.

### Where this task's premise was wrong

It says _six of the ten non-rendering runs fail for this reason alone_. Measured: **four** runs
hold a contaminated code capture, and **three** of them flip. The fourth, `a6-itsl-collab-shared-
folder`, is also truncated mid-element and fails on an unterminated regular expression after the
advisory is removed. The other six non-rendering runs fail for unrelated reasons — HTML comments
standing in for markup (`a9`, `b-itsl-bookmk-course-files`), prose where code should be (`a11`),
a stray `↕` glyph (`a5`), truncation (`b-nsp-home`), and three separate defects in `a1`.

So the survivorship estimate of "9 to roughly 15" in
[`what-to-do-next.md`](../../analyzes/NOJIRA-figma-to-code/what-to-do-next.md) does not hold:
the repair is worth **+3**, and `P-NOJIRA-corpus-census` 02 should plan against 9, not 15.

### Reproducing it

```
node --test "runs/harness/*.test.mjs"
node runs/harness/normalise-captures.mjs --all --write --out-dir captures-v2
node runs/harness/render-design.mjs --run runs/2026-10-01-<slug> --index captures-v2
```

`--out-dir` and `--index` are new, and exist so the repair can be counted without replacing the
original index. `captures/` is untouched.
