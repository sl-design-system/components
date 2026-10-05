# Counting what cannot be counted, and the order to build in

Four things: why the node-count accounting I proposed does not work, what replaces it, the order
to build in, and what that does to the approved plans.

---

## 1. The count will not match, and the accounting has to stop depending on one

**The objection is correct and it breaks what I wrote.** I proposed `declared − covered`, as
though the universe were known up front. It is not.

`get_metadata` **also** stops at instance boundaries — A2's 10,936-node design returned 27. So
the tree is a placement-level view of _one level_. When Code Connect fails to resolve a node and
we descend, the call on that child returns **its** children, and the universe grows. Every
descent enlarges the denominator. There is no fixed `declared` to subtract from.

And comparing against the true total is worse than useless: the 10,936 figure includes the
interiors of mapped components, which we **deliberately** do not fetch. Measured against it, a
perfectly captured well-mapped design scores terribly — the same trap as reading the
reconstruction probe naively.

### What replaces it: a closure check, not a ratio

Treat it as a worklist. Every node that enters the frontier must leave it in a terminal state:

| Terminal state | Meaning                                                    |
| -------------- | ---------------------------------------------------------- |
| **resolved**   | Code Connect mapped it — complete, do not descend          |
| **captured**   | its own `get_design_context` was stored                    |
| **descended**  | not captured itself, but its children entered the frontier |
| **hidden**     | `hidden="true"`                                            |
| **excluded**   | a recorded decision, with its reason                       |

**The run is complete when the frontier is empty and every visited node holds one of those five.**
A node still in the frontier, or in none of the states, is the gap — named, with its id.

That needs no denominator, terminates by construction, and is a script. The reported figure is
not a percentage of some total but a census: _visited N, resolved R, captured C, descended D,
hidden H, excluded E, frontier empty_. A percentage can be derived if someone wants one, but the
**verdict is the closure**, not the ratio.

This is a better design than the one it replaces, and it only appeared because the count was
questioned.

## 2. The fifth thing, and it is really the first

To the four differences from v2 — a measured baseline, a frozen corpus, Code Connect as the
stopping rule, an explicit script/agent line — add:

> **5. Incremental measurement as the working method: one change, then measure, before the next.**

The other four are preconditions for this one. A baseline and a corpus are worth nothing if three
changes land between measurements, which is precisely how v2's good ideas became
indistinguishable from its bad ones. It belongs on the list as the method rather than as a
consequence, because it is the thing that will be skipped under time pressure.

## 3. The order — and the proposed one is better than mine

My ordering put T0 (render one run, measure the gap) first. The better argument is the one that
notices **we cannot compare the nineteen runs we already have**, and that the apparatus for
comparing them is the same apparatus we need anyway.

So: **build the measuring apparatus over data already on disk, before touching Figma again.**

### Step 1 — adapter and schema, over existing captures. No Figma calls.

Write the common format and its `zod` schema from the **requirements** the contract analysis
enumerated, then an adapter that reads the nineteen runs' captures into it.

What it answers immediately, for free:

- **which runs' captures are sufficient** — a run that cannot be adapted is an incomplete capture,
  and that is the completeness question answered empirically rather than argued;
- whether the schema designed from requirements survives contact with real data.

**One discipline, or this step corrupts everything after it:** design the schema from what is
needed, and let the adapter _report_ what is missing. **Do not shrink the schema to fit the data
we happen to hold** — the captures were made before the protocol existed, with improvised depth,
and eleven of nineteen failed the reconstruction probe. Fitting the schema to them would bake
their gaps into the contract.

### Step 2 — the HTML generator, from the format. Still no Figma.

Produces 2.1 for every adaptable run. Three things fall out at once:

- the **first comparable numbers** across runs, comparable precisely because one generator made
  them all;
- the **determinism proof** — generate twice, compare checksums;
- **T0 answered as a by-product**: rendering an existing run and measuring the gap to its
  reference is now just running step 2 and comparing.

### Step 3 — the overlay.

Needs per-decision data. The nineteen runs have manifests and open questions in prose, not
structured decisions, so the overlay over historical runs will be **partial** — and knowing how
partial is itself a finding about what the run record must carry.

### Step 4 — only now touch Figma.

The improved ingestion: Code Connect as the stopping rule, the five-cause classification, asset
download at capture time, the boundary checks, the ledger. Measured against step 2's numbers and
the control's 5 of 38.

**Why this order is right:** steps 1 to 3 cost no API calls, extract value from data already paid
for, and produce the apparatus. Step 4 is then the first change whose effect **can** be measured —
which is the whole method, applied to itself.

## 4. What this does to the plans

**No rewrites. One new plan, one amendment, and the drafts should stop being drafts.**

### `P-NOJIRA-figma-to-code` — amend, do not replace

Its sixteen tasks survive; what changed is their order and two assumptions.

| Change                                                                   | Why                                                                                                                                                                                           |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **T-12 strict/as-is moves to the front**                                 | the control shows it is 14 of 19 halts, not a late refinement                                                                                                                                 |
| **T-03 intake report gets cheaper**                                      | `list_file_components_for_code_connect` answers library membership in one call per file; the demand ranking falls out of `instanceCount`                                                      |
| **T-06 coverage gets an algorithm**                                      | the closure check above, replacing an unspecified "node accounting"                                                                                                                           |
| **the "bench does not change the pipeline" assumption needs a decision** | marking and the adapter touch the pipeline. Proposed resolution: marks are precision, not precondition — the bench degrades gracefully without them, so the unmarked control stays comparable |

### New plan — the HTML deliverable and the common format

Not in any existing plan, and now the first thing to build: adapter, schema, the three
generators, and the closure check. Steps 1 to 3 above are its work breakdown.

### Analyses that stand

`A-NOJIRA-ds-conformance` F6 — the halt becomes a mode plus a five-category classification —
is confirmed by the control and needs no change. `A-NOJIRA-figma-metadata-contract`'s sequence
(run record and capture index, then `data-figma-node`, then the registry) still holds, with the
adapter now sitting between the captures and everything downstream.

### The drafts

`draft-next-steps`, `draft-discrepancy-registry` and `draft-measurement-method` have been carrying
decisions that are now made. They should be folded into the new plan and deleted, or they will
keep being read as current thinking after they stop being it.

---

# What three independent reviews found, 2026-10-05

Three agents reviewed the plans against the evidence: one on the two new plans, one tracing the
whole flow for unowned work, one re-checking the older approved plans. Findings rated
Severity × Impact + Confidence, per the sl-plan review contract.

**All three said the same thing in different words: do not start at task 01.**

## The structural finding — nothing below the HTML has an owner

The flow was mapped step by step against the plans. Every approved plan stops at the artifact.
**Three steps that make the artifact worth producing are unowned:**

| Unowned                          | Consequence                                                                                                   |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| the emitter of `decisions.jsonl` | the overlay is permanently partial, not partial-for-now                                                       |
| `data-figma-node`                | the registry and caching have **no join key**; the metadata analysis assigns it to a plan that does not exist |
| **HTML → Angular / Lit / React** | the step the whole split exists for is an assumption in two documents and a roadmap sentence                  |

And nobody owns **retiring the pipeline that currently generates Lit straight from Figma**, so two
generators will coexist with no decision recorded.

The verdict, quoted because the phrasing is the useful part: _we are building a very
well-instrumented left-hand side of a handover whose right-hand side exists only as a roadmap
sentence._

## The corpus is thinner than both plans assumed — measured, not argued

The third review counted instead of trusting:

- **six runs hold under 10 KB** of design context in total;
- every `captures/index.json` was built by `normalise-captures.mjs` **from the runs' own
  markdown**, and all nineteen `capturedAt` values fall within 64 ms — the precise lie that field
  exists to prevent;
- `a1` holds agent prose and elided class names under `"truncated": false`;
- **seven references are downscaled**, one is channel-halved;
- **no run has `captures/assets/`**, while 55 captures point at dead asset URLs.

So roughly **8 of 19** runs reach the fidelity task, not nineteen. And the plan's escape route was
circular: it sent the work to the ingestion plan, which `depends_on` it.

## Three contract-breaks, all now recorded

1. **AC-5 of the measurement plan forbids touching the pipeline**, and `data-figma-node` is
   emitted by an agent inside it. Amendment 6 written.
2. **`zod` as the normative schema breaks R31**, which requires a language-neutral artifact
   readable by `.mjs` and a Python toolkit. Fixed: JSON Schema normative, zod derived.
3. **The closure census was owned three times** — ingestion T-07, html-contract T-04 and
   figma-to-code T-06. T-06 is superseded by Amendment 6.

## The omission that was mine, and self-defeating

Task 00's checklist asked for geometry, resolved styles, text, assets and mappings — **absolute
positioning** — while `html-first.md` makes the HTML the thing framework code is generated from.
That is the worst possible codegen input, and 07b's pixel metric would have actively rewarded it.
The data is already in the captures: flex in 60 of 87 files.

Fixed by a rule rather than a field list: **geometry derived, layout recorded.**

## Also corrected

Task 00's retrofit test cited four acceptance cases where the analysis names six; the two dropped
were **a blocked run** — the majority outcome at 14 of 19 — and a measurement that examined
nothing. Four acceptance criteria could not fail and now carry thresholds.

## Still open, and needing a decision rather than an edit

- **Who owns framework generation, and when?** Until this is answered the HTML is a deliverable
  without a consumer.
- **Does the pixel metric get demoted**, given it pushes the generator toward absolute
  positioning? A genuine tradeoff: demote it and `html-first.md`'s central claim changes.
- **Downscaled references** — refuse, or compare at the reference's resolution and record the
  scale? The second recovers seven runs and is not "correcting the reference".
- **Accessibility detection** — Amendment 2 parked it in "the slice that builds the HTML stage";
  that slice exists and does not carry it, while the control shipped two WCAG failures no gate
  sees.
- **All six source analyses are `status: draft`**, which blocks the ADRs that depend on them.

---

# The two decisions that needed data, not a question

## Should the pixel metric be demoted?

> **Revised the same day, after a contradiction audit disagreed and was right.** My first answer
> — keep it as the headline, never let it drive a loop — overrode reasoning already recorded in
> two places without acknowledging it: `draft-measurement-method.md` makes geometry primary and
> the raster _"the only subjective one"_, and `render-design.mjs`'s own header says it _"must
> never be scored against the PNG."_ The revised answer is below; the original reasoning is kept
> because the loop-target argument survives and is the half that was right.

**Revised recommendation: score geometry, colour, typography and tokens numerically from the
format; keep the raster for human review and for build-against-build regression.**

Three reasons, and the third is the one I missed:

1. **Pixels as a headline reward the wrong output.** Measured three times, and 07b would have
   pushed the generator toward absolute positioning — the worst input for the script that
   generates framework code.
2. **The loop-target argument still holds** and is now a property of a diagnostic rather than of
   a score: a fix must state its cause and arithmetic either way.
3. **It dissolves the reference problem instead of managing it.** If fidelity is computed from
   the format — the build's measured geometry against Figma's declared geometry, colours against
   resolved variables, typography against token values — then **no comparison needs the PNG**.
   The seven downscaled references stop blocking anything, because a downscale is harmless to
   human review. The corpus goes from roughly 8 scoreable runs back to 19.

That last point reverses a conclusion I reached an hour earlier under the opposite assumption. A
raster is also a _better_ regression instrument than a fidelity instrument: comparing two builds
we produced is comparing two things we control, with no undocumented transformation in between.

**Original reasoning, kept because its core survives:** The problem measured
three times in this batch is not the metric — it is using the metric as a _target_.

| Option                                                         | For                                                                                                                | Against                                                                                                                                           |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Keep as a primary score**                                    | it is literally what "looks like the design" means, mechanically measurable, catches whole classes of layout error | measured three times to reward the wrong behaviour: a constant fitted to a delta, a raw hex over a token, absolute positioning over layout intent |
| **Demote to a diagnostic**, score structure and tokens instead | aligns the metric with what the HTML is _for_ — codegen input — and removes the perverse incentive                 | "looks like Figma" stops being measured, which is the thing a human judges anyway; structural matching is harder to define than a pixel diff      |
| **Both, reported separately, pixels never a loop target**      | keeps the information, removes the behaviour                                                                       | needs discipline in the loop design; a human reading the number may still push on it                                                              |

**The evidence points at the third, and it is specific.** One run set `inline-size: 420px` because
420 + 24 equalled the measured 444 — a constant fitted to a number, in a fix loop asked to close
a delta. **The same run, in the same turn**, refused to pad a pill that was 18px short because it
had traced that gap to a missing webfont, and decomposed a 32px offset into 24 + 8 and removed
both causes.

Same agent, same hour, three behaviours. The variable was **whether naming the cause was
required** — not whether pixels were being measured. So the fix is in the loop, not the metric:
a fix must state its cause and its arithmetic, and a raw length arriving without one is rejected.

**What would change this recommendation:** if the loop discipline turns out unenforceable in
practice, demotion becomes the only remaining lever and `html-first.md`'s central claim has to be
restated.

## Downscaled references — refuse, or compare at their resolution?

> **Largely dissolved by the revision above.** If the raster is not scored, a downscaled
> reference is no longer a measurement input and does not need a verdict — it needs a label. What
> follows applies to the narrower remaining case: using the raster for build-against-build
> regression, and for human review.

**Recommendation: refuse corruption, record transformation.** They are not the same thing, and
the current rule collapses them.

|                                                                   | Nature                                                              | Decision                                                                    |
| ----------------------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **seven downscaled** references (1512→1024, 1280→1141, 1280→934…) | a **uniform, describable transformation**                           | compare at the reference's own resolution, record the scale with the number |
| **one channel-halved** reference (`a3`, max 128)                  | **corrupted data** — the transformation is lossy and not invertible | refuse. No resolution fixes it                                              |

Rendering the comparison at 1024 and diffing against a 1024 reference **reconstructs nothing** —
nothing is inferred or undone, both sides simply live at the same scale. That is categorically
different from inferring the original from a halved channel, which is reconstruction and is what
the refuse-never-correct rule exists to forbid.

**The cost of each option:**

- **Refuse everything distorted:** the corpus drops to roughly **8 of 19**, which is below the
  point where a variance figure means anything. A rule that protects purity by destroying the
  sample is not protecting the measurement.
- **Compare at reference resolution:** recovers about seven runs. The price is **precision** — a
  1px error at 1512 is sub-pixel at 1024 — so numbers from different scales are **not poolable**.
  Mitigation: record the scale alongside the figure and never average across scales.
- **Re-fetch the references:** correct data, but it costs Figma calls, breaks the corpus freeze,
  and `get_screenshot` may distort again — it has four behaviours and nothing selects between
  them.

**What would change this recommendation:** if recorded scales turn out to cluster (say five runs
at 1024 and two at 1141), pooling within a scale may give enough samples that the third option is
unnecessary. That is checkable from the census in task 00, before any of it is built.

---

# Ownership, settled by the owner 2026-10-05

The biggest finding of the review pass was that nothing below the HTML had an owner. It does now,
and the answer changes the shape of the work rather than just filling a blank.

| Step                                     | Owner                                                        | Form                                               |
| ---------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
| Figma → HTML / code — skills and toolkit | **the aipdlc team**, the one developing the other skills     | most likely lands in the **aipdlc repo**, not here |
| HTML → application code                  | **the developer**, running a script in their own application | a script, not an agent, not a skill                |
| the existing `sl-ds-*` skills            | **the design system team**                                   | stays where it is                                  |

Three consequences worth stating, because each contradicts something assumed earlier.

**The last leg is a script the developer runs, not an agent.** That removes the open question
about who generates framework code and replaces it with a sharper constraint: the HTML must be
**machine-consumable by a script with no model in the loop**. Absolute positioning plus resolved
styles cannot satisfy that — which is the same conclusion the fourth-consumer finding reached
from the other direction, now confirmed by the ownership answer rather than argued from taste.

**The toolkit leaves this repository.** Plans written here are specifying something that will
live in the aipdlc repo, under a different team. That makes the **contract** the deliverable
rather than the implementation, and it raises a question none of the plans considers: what
crosses the repository boundary, and in what form. Worth deciding before task 00 is drafted,
since the contract is precisely the thing that crosses.

**Two teams, two repos, one artifact.** The design system team owns the current skills; the
aipdlc team will own the new ones. The HTML contract is the interface between them, and an
interface between two teams is held to a different standard than an internal format — versioning
and a deprecation path stop being optional.

## Accessibility — its own plan, preceded by research

Settled by the owner: a separate plan, and research first, because what to test and how is not
yet known. The probable surface is the **generated HTML**, which is convenient — it is
script-produced, deterministic, and inspectable without a running application.

Two pieces of evidence the research starts from rather than discovers: the control shipped a
WCAG 2.1 AA 1.3.5 failure (`autocomplete` suppressed on a name and email form) and a `100vh`
with `overflow: hidden` that put the action buttons out of reach of **both** mouse and keyboard.
Neither is visible to a type check or a screenshot diff, and one run hit its iteration cap with
nine unfixed critical items, all accessibility.

So the research question is not "should we check accessibility" but **"which defects does a
static artifact let us catch, and which need the running component"** — the two above fall on
opposite sides of that line.

---

# The traceability audit, and the thing it found that I did

Counted rather than asserted: **67 numbered requirements** across two colliding `R` namespaces,
**68 findings**, **50 open questions**, **105 document-id references of which 23 do not resolve**.

## What I did

**I quietly replaced the metadata contract with a smaller one I derived myself.**

`A-NOJIRA-figma-metadata-contract` is the most carefully argued document in this context: 24
findings, 36 requirements each anchored to one, a three-artifact split, a six-case acceptance
test, a three-step sequence. Its `## Leads to` names a plan and an ADR. **Neither was ever
created.** Four days later I wrote `P-NOJIRA-html-contract` with "the contract itself" as task
00 and built its checklist from four consumers — **citing one of the thirty-six.**

It was not rejected and not deferred. It was re-derived, smaller, by a plan that did not know it
was replacing it. That is the failure this effort criticised v2 for, in the same repository, four
days after the analysis was written.

Fixed: task 00's primary input is the R-list, its first deliverable is a disposition against all
thirty-six, and the four-consumer checklist is demoted to a lens for finding gaps in that list.

## Other threads that were agreed and then lost

| Thread                                                          | Where it was agreed           | Why it matters                                                                                                                               |
| --------------------------------------------------------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **`data-figma-node` has no owner**                              | contract F15, sequence step 2 | Amendment 6 says so verbatim — and Amendment 6 is itself `pending`. The registry is blocked on it                                            |
| **F11 — artifact per step, re-run is a no-op**                  | `A-NOJIRA-pipeline-staging`   | its own argument: free at the start, a rewrite to retrofit. Neither plan required it. **Now an acceptance criterion**                        |
| **F5 — six computable checks**                                  | `A-NOJIRA-figma-to-code`      | billed as "the governing principle for the whole effort", pure geometry arithmetic, named in no plan. **Now task 11**                        |
| **F3b and F4** — overridden instances, and the similarity layer | `A-NOJIRA-ds-conformance`     | the five causes cover retrieval and mapping only; F3b argues overridden-but-attached is the _worse_ case. **Now named in ingestion task 05** |
| **F8 — the designer rehearsal**                                 | `A-NOJIRA-designer-workflow`  | its one immediately actionable recommendation. The word appears in the analysis and the roadmap, and nowhere else                            |
| **Accessibility detection**                                     | Amendment 6                   | "detection must not defer" — and nothing detects                                                                                             |

## Broken references

Twenty-three unresolved ids. Twenty of them are one gap: **both approved plans have zero task
files**, because `sl-tasks` has not run — correctly, since task 00 is a gate. The other three are
real: `P-NOJIRA-figma-metadata-contract` and `AD-NOJIRA-figma-metadata-contract` are referenced
and do not exist, and `batch-findings.md` cites a `T-NOJIRA-ds-conformance` with no number.

## Eight questions still open and unowned

Reference normalisation (now dissolved by scoring from the format); per-dimension tolerances and
who accepts them; **what a developer does when the HTML is wrong** — the roadmap says "nothing
describes that route yet"; who receives routed findings; which marketplace hosts the pipeline;
Figma seat inventory and API limits; whether a mapping's property surface can be enumerated; and
whether the mode partitions the score, the schema, or both.

## What this changes about the method

The three plan reviews checked the plans against each other. **This audit checked them against
what we had already decided**, and found a different and worse class of error: not contradiction
but **quiet replacement**. A contradiction announces itself when two documents are read together;
a re-derivation reads as perfectly coherent, because it is — it is simply smaller than what it
replaced, and nothing points at the gap.

The cheap defence is mechanical: **a plan's `source_analysis` requires a disposition against that
analysis's numbered requirements before approval.** Had that rule existed, this plan could not
have been approved citing one of thirty-six.
