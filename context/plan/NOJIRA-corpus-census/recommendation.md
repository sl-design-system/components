# Recommendation: narrowed — five runs, 672 nodes, and a baseline rather than a claim

_The decision `P-NOJIRA-corpus-census` exists to produce, for `P-NOJIRA-html-artifacts` to honour.
Written 2026-10-07 from `runs/census.json` (census v1) and `runs/census-geometry.json` (comparator
v2, index `captures-v2`). Every figure below states its N._

## The decision in one paragraph

**Narrow the scope.** Of the nineteen runs two plans were approved against, nine are Figma bytes
that render against a declared frame, and only **five** of those contain nodes whose position
Figma vouched for _and_ the browser rendered — 672 nodes in total, 80 % of them in two runs. The
other four admitted runs have an anchored overlap of **zero**. That is the "N near four" the plan
named as the trigger, and the plan's own words apply: the corpus can carry a _baseline_ and a
working instrument, but it **cannot carry a fidelity claim until it is re-captured under the
protocol**. Build and test the artifacts on five runs; publish five numbers; do not average them
into a headline.

## What was measured, and what was not

The comparator (`runs/harness/compare-geometry.mjs`) reads Figma's declared `x/y/w/h` from
`figma-metadata.txt`, sums them through the ancestor chain, and compares against
`getBoundingClientRect` of every `data-node-id` element in headless Chromium. No reference image
is involved; a channel-halved or downscaled screenshot does not gate this figure.

What stands in the browser today is the harness's **probe reconstruction** of Figma's own
`get_design_context` markup (`render-design.mjs`), not a build produced by the generation pipeline.
So the figures below are the **baseline the pipeline's output will later be compared against** —
how far Figma's own code output drifts from Figma's own geometry under a plain CSS renderer. A
pipeline build can only be measured once it carries `data-node-id` on its elements; today none
does. That emitter is the open question `P-NOJIRA-html-artifacts` lists under risks.

## Admission — who is in the population

A run is admitted when all three hold: its design context is **Figma bytes** (not agent prose, not
hand-backfilled, not a summary — a delta against those measures the agent, not the layout); it
**renders** against `captures-v2`; and its **frame is declared** (the comparator refuses a
fabricated frame). Nine of nineteen pass.

| Excluded (10)                                              | Why                                          |
| ---------------------------------------------------------- | -------------------------------------------- |
| `a1`, `a9`, `a11`, `b-itsl-bookmk-course-files`            | agent prose where code should be             |
| `a8`, `b-itsl-course-course-files`, `b-kampus-notes-panel` | captures backfilled by hand                  |
| `a5`                                                       | a summary, not the bytes                     |
| `a6`, `b-nsp-home`                                         | Figma bytes, but do not render after task 01 |

Inside an admitted run, a node is **compared** only when the region it sits in has a metadata box
of its own. Where a region's root node has no box, the probe drops the region into document flow
— it has nowhere else to put it — and every node inside inherits a position the probe chose, not
Figma. Those nodes are counted as **unplaced** and kept out of the join on both sides. Four runs
consist of exactly one such region, which is why their anchored overlap is zero.

## The figures — each with its N

Comparator **v2**, index `captures-v2`, census **v1**. Distances in CSS px, rendered minus declared.

| Run                               | Compared (N) | Declared only | Rendered only | Unplaced | Within 1 px | Within 4 px |   Mean |    Max |
| --------------------------------- | -----------: | ------------: | ------------: | -------: | ----------: | ----------: | -----: | -----: |
| `a7-myportal-materials-overviews` |      **331** |            19 |           237 |        0 |          46 |          93 |  21.65 | 157.28 |
| `a3-myportal-digital-exercises`   |      **205** |            15 |           226 |      170 |          47 |          66 |  11.66 |  34.96 |
| `a4-sesame-my-groups`             |       **88** |           309 |            68 |       64 |          32 |          64 |  12.30 | 102.02 |
| `b-sesame-group-details`          |       **38** |           235 |            10 |      223 |          20 |          20 | 224.32 | 961.00 |
| `a2-nsp-class-overview`           |       **10** |             6 |             0 |      156 |           6 |           6 |  40.90 | 163.00 |
| `a10-etsl-fam-users`              |        **0** |            13 |             0 |      205 |           — |           — |      — |      — |
| `b-itsl-bookmk-deleted-course`    |        **0** |            43 |             0 |      239 |           — |           — |      — |      — |
| `b-itsl-collab-add-element`       |        **0** |            75 |             0 |       99 |           — |           — |      — |      — |
| `b-sanna-account-creation`        |        **0** |             3 |             0 |       32 |           — |           — |      — |      — |

Across the five runs with overlap — **N = 672 nodes** — 151 land within 1 px of their declared
position (22 %), 249 within 4 px (37 %); the compared-weighted mean distance is 29.13 px and the
largest single disagreement 961 px (`b-sesame-group-details`, seven nodes at `dx −788`: a flex row
that collapsed). The weighted mean is a property of a7 and a3 — 536 of the 672 nodes — and should
be read as theirs, not the corpus's.

The 718 **declared-only** nodes are mostly `a4` and `b-sesame` (544 of them): `get_metadata` lists
nodes that the design context never emitted as elements. The 541 **rendered-only** ids are, on a7
and a3, instance-path ids (`I…;…`) that the metadata for those runs does not list — a join-key gap,
not a layout one. Both counts are published rather than dropped because each is itself a finding.

## Three instrument defects, found by the first figures and fixed before publishing

The first run of the comparator over the nine runs reported a maximum distance of **6 614 px on a
1280×768 frame** and zero nodes within 4 px on eight of nine runs. None of that was layout:

1. **A re-listed instance clobbered its own position.** `figma-metadata.txt` lists the frame tree,
   then re-lists each instance as a root at `(0, 0)` with its children expanded. `parseBoxes` let
   the second declaration win, putting `PageHeader` 3 732 px left of its frame. Fixed: the first
   declaration keeps its box and anchors the expanded children. 6 614 px became 139 px.
2. **A fallback margin collapsed through `body`.** An unboxed region's `margin: 8px 0` collapsed
   through `<body>`, moving every absolutely-placed region down 8 px — a constant `(0, +8)` on
   hundreds of nodes across seven runs. Fixed with `display: flow-root`. Within-1-px went from 47
   to 152.
3. **Unplaced regions were scored.** Nodes inside a region with no metadata box were compared
   against a position the probe had invented. Now counted apart as `unplaced`. Compared dropped
   from 1 122 to 672 — the number that remains is the one that means something.

Each fix is pinned by a test against the exact shape that produced it, and the comparator version
was bumped to 2 so no later figure is compared to the v1 ones silently. The lesson is the plan's
own: the first figures a new instrument produces are about the instrument.

## What `P-NOJIRA-html-artifacts` should do with this

- **Build and test against five runs**, `a7` and `a3` first: they hold 80 % of the comparable
  nodes and the fullest metadata. `a4`, `b-sesame-group-details` and `a2` are secondary.
- **Publish per-run figures with N; no corpus average as a headline.** The plan already says so
  for "near four"; five is near four.
- **Treat the baseline as a baseline.** A pipeline build is measured against the same declared
  geometry with the same comparator; its delta _relative to this baseline_ is the first number that
  says anything about generation quality.
- **The emitter question is now load-bearing.** Until builds carry `data-node-id`, the comparator
  has nothing of the pipeline's to measure. Whichever plan owns that attribute owns the first real
  fidelity claim.
- **Re-capture before claiming.** A fidelity claim about "the corpus" needs a corpus captured under
  the protocol — bytes, not prose; a box for every region root; `capturedAt` that means capture.
  That is `P-NOJIRA-figma-ingestion`'s territory, and this recommendation is its justification.

## Reproducing it

```
node runs/harness/census.mjs --runs runs --index captures-v2 --out runs/census.json
node runs/harness/census-geometry.mjs --census runs/census.json --runs runs --out runs/census-geometry.json
```

Both are deterministic; per-node deltas for each admitted run are in `runs/census-geometry/<run>.json`.
