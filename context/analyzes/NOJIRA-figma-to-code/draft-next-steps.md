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

## 2b. The control changed the order — read this before picking anything up

[`control-runs.md`](control-runs.md): 38 unassisted runs of the unmodified skill, **5 produced
code**. Three consequences for this list.

**Our nineteen measure the assisted condition.** All nineteen completed because a supervisor
removed the blockers, including instructing runs not to halt on an empty Code Connect map. Any
number computed over them must say so. The control is the baseline; the gap between 5/38 and
19/19 is the value of the supervision, and every item in `pipeline-defects.md` is a candidate for
turning some of it into something the skill does alone.

**Item 7 is partly answered.** There is now σ at the outcome level: three of nineteen cases
flipped outcome between identical passes, and blocked-node counts moved by up to 3× where the
verdict was stable. The mechanism is agent judgement — one analyst declined to emit the halt
token the other emitted, on identical input. **Fidelity-level σ is still missing**, which is the
part item 7 should now mean.

**There is a first A/B available, and it is cheap.** Fourteen of nineteen cases halt on one
branch. Fix that branch, re-run the 38, and the 5/38 either moves or it does not — one change,
one predicted effect, one measured delta. Nothing else in this list has that shape yet.

## 2c. The two goals, and why marking serves both

[`two-goals.md`](two-goals.md). The design system team wants provenance and determinism; the
competence owner wants appearance. The batch measured the conflict three times — fonts, Kampus's
palette, the hardcoding incentive — and one output cannot top both scores.

It does not have to. **Record the basis of every decision** (`mapped` / `token` / `inferred` /
`invented`) alongside the Figma source value, and one artifact answers both questions: provenance
for one reader, delta for the other. The disagreement between them is a design system gap found
by a real design, which is the feedback loop the DS team actually wants.

The hard cases resolve by rule rather than judgement: **if the node binds a design system
variable, emit the token** and treat a visible difference as a Figma-code sync defect; if it binds
another library's variable or nothing, **emit the raw value marked `as-is`** and record a token
gap. We already read the bindings on every run.

This also supplies the node-to-element link item 1 says the registry cannot proceed without, so
it should be built before the schema, not after.

## 2d. The flow end to end, and the four experiments that test it

[`end-to-end-flow.md`](end-to-end-flow.md) walks the whole thing in order — what is called, when,
what it decides — and names four experiments, cheapest first:

|     | Experiment                                                                   | Cost    | Falsified if                                                                  |
| --- | ---------------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------- |
| T1  | does the diagnosis classify? Phase 0 + 1b over 19 designs, no code generated | hours   | a meaningful share cannot be classified, or two runs classify differently     |
| T2  | the A/B against the control's 5/38                                           | 38 runs | completions rise but conformance figures are empty or disagree between passes |
| T3  | does marking earn its cost? correspondence from marks vs from geometry       | small   | the two agree — then geometry is enough and the bench stays independent       |
| T4  | does variance drop at the located point?                                     | 38 runs | outcomes still flip, meaning the variance was never in that branch            |

**T1 first and alone.** It is hours, it generates nothing, and it answers the question every
halted run failed to record. T2 should not start until T1 shows the classification is stable,
because an unstable classification makes T2 unreadable.

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
