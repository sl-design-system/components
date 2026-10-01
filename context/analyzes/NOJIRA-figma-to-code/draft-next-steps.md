# Draft — what the batch says should happen next

**Status: draft.** A holding place for work the nineteen runs identified, so that it survives
until each piece gets a real plan. Ordered by what blocks what, not by size.

Nothing here is a commitment. Several items are cheap, and the cheap ones are mostly measurement
rather than building — which is the batch's own lesson about doing things in order.

---

## 1. The registry schema — the analysis everything else waits on

Drafts: [`draft-discrepancy-registry.md`](draft-discrepancy-registry.md),
[`draft-measurement-method.md`](draft-measurement-method.md).

**Why first:** every other piece reads or writes it, so getting it wrong is rework everywhere.

**Now analysed:** [A-NOJIRA-figma-metadata-contract](../NOJIRA-figma-metadata-contract/analysis.md)
enumerates the requirements, and reaches one conclusion this draft did not anticipate — the registry
should **not** be written first, because without a node-to-element link every key in it is a
heuristic.

**How it is kept honest:** the schema has to express what the nineteen runs already found, and those
runs are on disk. A retrofit is the test — if it cannot record Kampus's unreachable palette, A10's
variable modes, the `::part()` specificity hazard and the `24 + 8 = 32` decomposition, it is wrong,
and that is discoverable the same day without building anything.

## 2. Reference integrity — before any number is computed

`get_screenshot` distorts four ways: exact, canvas bleed, downscaling to a 1600 or 1280 long edge,
and **halving every colour channel**. Three are invisible to a reader; the fourth is invisible to a
measurement.

**Do not normalise.** Establish whether a faithful raster is obtainable; if it is not, verify and
refuse rather than reconstruct. Reasoning in the measurement draft.

## 3. One measurement, run over all nineteen

There is still **no comparable number** for any run. Each measured itself, in prose, by its own
method, some against a distorted reference. Nothing in the corpus supports "this run was better
than that one".

Cheap, because it generates nothing — it measures what exists. And it is the empirical input the
schema analysis needs, so it comes before the analysis rather than after.

## 4. Pipeline changes the runs earned

From [`pipeline-defects.md`](pipeline-defects.md), with the newest first:

- **as-is mode** — Stage 1 halts permanently on a design not built from the design system, and six
  of ten measured designs are in that state
- **the coordinator contract** — a turn ends on a result or a recorded blocker, never on a status
  line; eight runs did otherwise
- **adopt the scoped type gate** and keep the parse guard
- **token existence and inventory checks** — `check-tokens` exists; nothing checks an asserted
  _inventory_, which cost one run five components built on a wrong icon count
- **an interaction pass** — two runs shipped a page where every leaf worked and the root subscribed
  to nothing
- **component identity across runs** — two frames of one file minted the same tag with different
  APIs, and three frames of another produced three incompatible headers with no symptom at all

## 5. Design system defects — a separate conversation, already written

[`design-system-defects.md`](design-system-defects.md) is sixteen items with verification commands
and needs no further analysis from us. Six components with dead typography and the font namespace
fault are the two with the widest blast radius.

## 6. Cost — its own plan, deliberately later

[`cost-and-duration.md`](cost-and-duration.md). One prerequisite before any optimisation: **one
quantity, counted one way, emitted by the harness.** The runs disagreed on what they counted by two
orders of magnitude and one fabricated a figure, so there is nothing to optimise against yet.

## 7. Variance — the measurement the bench exists for and has never taken

Every one of the nineteen runs is a sample of one. **We have no σ.** Two runs of the same design
would say more about repeatability than another five designs would, and the whole effort is
premised on repeatability being the problem.

Worth doing as soon as there is one comparable number, because without it a change to the pipeline
cannot be told from noise.
