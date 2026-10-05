---
type: plan
schema_version: 1
id: P-NOJIRA-figma-to-code
title: Measurement layer for the Figma-to-code pipeline
description: Build coverage, fidelity and design-intake measurement over the existing pipeline without changing it, producing a baseline and its run-to-run variance
jira: null
resource: null
status: approved
phase: approved
owner: marcin.ludwig
created: 2026-09-30T08:02:22Z
updated: 2026-10-01T01:00:00Z
tags: [figma, design-to-code, measurement, determinism, tooling]
source_analysis: A-NOJIRA-figma-to-code
slice: measurement-layer
depends_on: []
approved_by: marcin.ludwig
approved_date: 2026-09-30
open_questions: []
---

# Measurement layer for the Figma-to-code pipeline

> Derived from [A-NOJIRA-figma-to-code](../../analyzes/NOJIRA-figma-to-code/analysis.md).

## Goal

A single command that takes a frozen set of Figma designs, runs the existing generation pipeline
against them, and reports — per design — how much of the design was transferred, how closely the
result matches, and how much the answer moves when the same input is run again.

Plus the read-only counterpart: a report that answers, for any Figma node, how much of it uses the
design system, what is detached, and which unmapped components recur across teams.

At the end of this plan the generation pipeline is **unchanged**. What changes is that every future
change to it becomes decidable.

## Approach

Four principles, taken from the analysis:

1. **Measure before improving.** Nothing in `tools/implement-design-plugin/` is modified by this
   plan. The harness observes from outside, so its own correctness can be established against a
   pipeline that is not moving underneath it.
2. **Coverage before fidelity.** Node accounting is deterministic, cheap, and catches omissions
   that pixel comparison is structurally blind to — a section that was never rendered has nothing
   to diff against. It also doubles as the design-system adoption traversal, so one walk over the
   node tree serves the harness and the intake report both.
3. **Variance is a first-class result.** Every score is reported with the spread observed over
   repeated runs of the same input. A mean without a spread cannot answer the question this work
   exists to answer.
4. **Two dimensions of fidelity, not five.** DOM position accuracy and per-component pixel
   comparison only. Token compliance, Code Connect compliance and responsive checks are deferred —
   admitting all five now would repeat the mistake the analysis documents.

The deliberate consequence of principle 4: this plan is itself the first demonstration of the
incremental method it establishes. Its acceptance criteria are narrow on purpose.

**Two decisions taken at approval.** The bench is a **sibling tool under `tools/`** (named `sl-bench` by Amendment 2), not part of
the `implement-design` plugin: it must be able to measure any generator — the plugin today, the
prior `sl-ds-*` skill set, whatever replaces either — and keeping it outside the plugin is what
keeps "measure from outside" true rather than aspirational. The corpus lives in a **new Figma file
owned by the design system team**, holding copies of nodes lifted from the product files, so the
product teams cannot edit it out from under a baseline.

Measuring without modifying is possible because the pipeline already persists what the bench
needs: the structural node tree, the Code Connect map, the design context and the reference
screenshot are written to the run folder on every run. The harness reads that folder and the
rendered page; it does not instrument the agents.

The requirement registry is seeded but not populated with active entries. The 31 requirements from
the prior attempt are recorded as proposals; an entry becomes active only when a corpus case
exercises it. That rule is what prevents the backlog from being re-adopted wholesale.

## Scope

**In scope.** The bench as a sibling tool under `tools/`; the corpus registry and its freezing
procedure; deterministic Figma node-tree extraction;
node-accounting coverage metric; design-system adoption and intake report as a skill; the runner and
its result schema; repeated-run variance; DOM position accuracy; per-component pixel comparison with
tiered tolerances; strict versus as-is mode declaration; a published baseline for the current
pipeline; the requirement registry format and its seeding.

**Out of scope.** Any change to the generation agents, their prompts, or the manifest schema.
Automatic repair. Token compliance, Code Connect compliance and responsive fidelity dimensions.
Completing the 14 unmapped Code Connect scaffolds — that work is Diana's and runs in parallel.
Choosing which pipeline improvements to make, which is what the baseline is for.

## Work breakdown

Tasks to be created in `work/NOJIRA-figma-to-code/` once this plan is approved:

- `T-NOJIRA-figma-to-code-01` — Bench location and skeleton (`tools/sl-bench/`); corpus registry format
- `T-NOJIRA-figma-to-code-02` — Deterministic Figma node-tree extraction shared by coverage and intake
- `T-NOJIRA-figma-to-code-03` — Design intake report as a skill: adoption, detached instances, unmapped-component demand ranking
- `T-NOJIRA-figma-to-code-04` — Frozen corpus: select and freeze the initial cases, document the freeze
- `T-NOJIRA-figma-to-code-05` — Requirement registry format, seeded from the prior attempt's list
- `T-NOJIRA-figma-to-code-06` — Coverage metric: node accounting and its report
- `T-NOJIRA-figma-to-code-07` — Runner command and result schema
- `T-NOJIRA-figma-to-code-08` — Repeated-run mode and variance reporting
- `T-NOJIRA-figma-to-code-09` — Cost and model-tier accounting (added by Amendment 1)
- `T-NOJIRA-figma-to-code-10` — Fidelity: DOM position accuracy
- `T-NOJIRA-figma-to-code-11` — Fidelity: per-component pixel comparison with tiered tolerances
- `T-NOJIRA-figma-to-code-12` — Strict and as-is modes over one measurement
- `T-NOJIRA-figma-to-code-13` — Experiment comparison across configurations and over time (added by Amendment 2)
- `T-NOJIRA-figma-to-code-14` — Integration and behaviour tests for the bench itself (added by Amendment 3)
- `T-NOJIRA-figma-to-code-15` — Baseline run and published result
- `T-NOJIRA-figma-to-code-16` — Rerun policy and its automation (added by Amendment 5)

**The numbers are the execution order.** Every task depends only on lower-numbered ones, so they can
be worked straight through. Two orderings are load-bearing rather than incidental and were corrected
when this list was sequenced:

- **The intake report (03) comes before the corpus freeze (04).** The analysis states that corpus
  cases cannot be chosen without knowing how much of a given design uses the design system; an
  earlier draft of this breakdown had them the other way round, which would have meant hand-picking
  the corpus and then measuring adoption afterwards.
- **The registry (05) sits early** even though nothing in this plan needs it until late, because
  `T-NOJIRA-requirement-triage-04` in the parallel track is blocked on it. Left at its natural
  position it would have stalled the other track almost to the end.

Each task carries a use case in `tests/NOJIRA-figma-to-code/` naming the corpus case that proves it.
That link is the document-level expression of the plan's core rule: one requirement, one test case,
one measured delta.

## Risks & dependencies

| Risk                                                           | Consequence                                                                   | Mitigation                                                                                                                                              |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The corpus Figma file is edited mid-effort                     | Results stop being comparable and degrade silently rather than failing loudly | Freeze by copying into a file the design teams do not own; record the last-modified stamp with every result and fail the run when it changes            |
| Figma and browser renderers differ systematically              | The pixel dimension produces noise rather than signal                         | Tiered tolerances by element class; if it still fails, the analysis already names the fallback — DOM geometry only, one dimension replaced, plan intact |
| Code Connect scaffolds block ingestion on real product designs | Some corpus cases cannot run at all                                           | Select initial cases that avoid the 14 unmapped components; exercise the others in as-is mode, which does not require a mapping                         |
| The bench itself accretes requirements                         | The plan reproduces the failure it was written to prevent                     | Acceptance is fixed at two fidelity dimensions; anything further is a separate plan against a measured gap                                              |
| Measurement is built but never used to gate changes            | The numbers become decoration                                                 | The next plan's acceptance is expressed as a score delta against this baseline, which makes the gate structural rather than cultural                    |

**Three blockers found on the first attempt at the smoke run**, before it could start. None is
hard, all three are prerequisites nobody had written down:

1. **The plugin is not installed.** It ships from this repository as a marketplace plugin but is
   not in the local plugin set, so `/implement-design` does not exist yet. Install it, or point at
   the working copy with `--plugin-dir ./tools/implement-design-plugin`.
2. **The MCP server names do not match.** Every agent's `tools:` frontmatter names
   `mcp__figma__*`, `mcp__figma-desktop__*` and `mcp__playwright__*`. This environment provides
   `mcp__MCP_DOCKER__*` for Figma and a differently-named Playwright. The agents' tool allowlists
   will not resolve, so either the servers are registered under the expected names or the plugin is
   adjusted. **This is exactly the class of thing the smoke run exists to surface**, and it would
   have been discovered halfway through `T-15` otherwise.
3. **The Figma desktop MCP server is not answering.** Registered under the expected name it reports
   _connected, tools fetch failed — request timed out_, and the Docker-gateway Figma server this
   session had been using has since failed to connect at all. That is why a single
   `get_code_connect_map` call hung for over five minutes. The blocker is the server's
   responsiveness, not the naming — and since Code Connect resolution is the pipeline's cheapest and
   most authoritative step, an unresponsive desktop server blocks the smoke run outright.

**Blocker 3 is now cleared too, and clearing it produced a finding.** The remote Figma server,
once authenticated, answered `get_code_connect_map` on the same node **in seconds** — the call that
had hung for over twenty-five minutes against the desktop and Docker-gateway servers. It also takes
a `fileKey`, so it addresses any file without the desktop application having that file open.

That **contradicts the pipeline's own documented choice**. Its analyst agent instructs: use
`figma-desktop` for `get_code_connect_map` because the remote one is "unreliable", and use the
remote server only for the screenshot. On this evidence the opposite holds — and the consequence is
not small, because Code Connect resolution is the step every node passes through.

Two things follow. The smoke run is unblocked. And **switching the pipeline's data calls from
desktop to remote is a strong candidate for the first measured increment of slice 2**: it is a
small change, it plausibly moves generation speed (R8) by a large factor, it removes the
desktop-application dependency that stops anything running unattended, and it is exactly the shape
of change the bench exists to adjudicate — plausible, cheap, and currently unproven.

**Figma's documentation settles the server choice.** It states that the remote server is _strongly
recommended_, connects without the desktop application, and provides the broadest feature set; the
desktop server is positioned for specific organization and government needs. And the rate limits
are **identical for both** — 600 tool calls per day and 20 per minute on an Organization plan with
a Dev or Full seat — so there is no quota argument for preferring the desktop server. That removes
the main reason one might have kept it.

One caveat on the evidence: this is one environment at one moment. The desktop server may be
misconfigured here rather than slow in general, which the smoke run should establish rather than
assume.

**And the mappings are published and resolving.** The same call returned
`<sl-button fill="outline" variant="primary">` with a nested `<sl-icon name="far-universal-access">`
— resolved property values, nested instances, labelled `SL Design System`. The question of whether
`scripts/connect-figma-components` had reached Figma is answered: it has.

**Blockers 1 and 2 are now cleared.** The plugin is installed from the local directory
(`claude plugin marketplace add ./` then `claude plugin install implement-design@sl-design-system`),
and `figma`, `figma-desktop` and `playwright` are registered under the names the agents expect —
so the pipeline is tested as it is, rather than adjusted to fit the environment. `playwright`
connects; `figma` (remote) needs an interactive OAuth sign-in; `figma-desktop` is the open blocker
above. **Newly registered servers load at session start, so a restart is needed before they are
usable.**

**On the coupling question:** the pipeline does **not** read `scripts/connect-figma-components`
directly — there is no import path between them. The link is indirect: mappings are authored there,
published to Figma, and the pipeline reads them back through `get_code_connect_map`. So the
mappings only reach the pipeline **once published**, and whether the current set is published is a
separate fact to establish.

**Dependencies.** Figma MCP access, with the desktop server for Code Connect resolution.
A runnable Storybook in this repository for rendering. Diana's mapping work is a parallel
dependency for strict-mode cases, not a blocker for this plan.

## Acceptance

1. One command runs the existing pipeline over every registered corpus case and writes, per case,
   a machine-readable result containing: coverage percentage with a named list of unaccounted
   nodes, a fidelity figure broken down by its two dimensions, and the mode the run was scored in.
2. The same command run with repetition reports the spread across runs alongside the mean, for both
   coverage and fidelity.
3. The intake report runs against at least five of the eleven team Figma files and produces, for
   each, a design-system adoption figure, a detached-instance count, and a cross-file ranking of
   unmapped components by how often they appear.
4. A baseline for the current pipeline is published: mean and spread per corpus case, with diff
   artifacts retained for inspection.
5. `git diff` over `tools/implement-design-plugin/` is empty for the whole plan — the pipeline was
   measured, not modified.
6. The requirement registry exists and is seeded, with every entry either active and carrying a
   corpus case, or proposed and carrying none.
7. Every task has a use case in `tests/` that states which corpus case proves it, and the context
   validates clean.
8. Every metric ships with unit tests and a **known-answer calibration fixture** — a fixture whose
   correct output is known by construction — and no metric is accepted on the strength of looking
   plausible on a real design.
9. Every result records what the run cost — tokens by model tier and by pipeline stage — so a tier
   or effort change can be evaluated as a cost delta against a score delta rather than on intuition.
10. Two runs made under different conditions — a different model, a newer model, an added pipeline
    step — can be compared directly, with the difference reported against the measured spread so that
    noise is not read as improvement.
11. Nothing in the result schema or the runner assumes the thing being measured is the Figma-to-HTML
    stage. A second stage plugs in as another target, not as a fork of the tool.

## Approval

- Approved by: marcin.ludwig
- Approved date: 2026-09-30
- Open questions resolved:
  - **Where the harness lives** — _answered._ A sibling tool under `tools/`, so it can measure any
    generator and not only the `implement-design` plugin. Recorded in `## Approach` and `## Scope`;
    executed by `T-NOJIRA-figma-to-code-01`.
  - **Who owns the frozen corpus and how it is protected** — _answered._ A new Figma file owned by
    the design system team, holding copies of nodes taken from the product files. Executed by
    `T-NOJIRA-figma-to-code-04`, which also records the freeze procedure and the last-modified
    guard.
  - **Whether increments target the plugin, the prior skill set, or both** — _carried._ This is
    settled by what the baseline shows, which is the output of `T-NOJIRA-figma-to-code-14`. Deciding
    it now would be guessing; it belongs to the slice 2 plan.
  - **How mapping work and pipeline work are sequenced** — _carried._ A standing coordination matter
    with the Code Connect work, not a precondition for this slice: strict-mode cases need the
    mappings, as-is mode does not, and `T-NOJIRA-figma-to-code-04` selects initial cases that avoid
    the fourteen unmapped components, informed by the intake report that now precedes it.
  - **Whether a Jira ticket is created** — _carried._ Administrative. If a ticket appears, every id
    in this initiative is renamed from `NOJIRA-figma-to-code` to its key and the cross-links updated.
- Outstanding concerns: the fidelity dimension rests on Figma and browser renderers agreeing within
  the tiered tolerances. If they do not, `T-NOJIRA-figma-to-code-11` is the task that will surface
  it, and the analysis already names the fallback — DOM geometry alone, one dimension replaced
  rather than the plan invalidated.

### Amendment 1 — 2026-09-30, after approval

Recorded because an approved plan that changes quietly is worse than one that was never approved.

**What changed.** The plan now measures a third axis: **what a run cost**. Every result records
tokens by model tier and by pipeline stage alongside the score and its spread — added as
`T-NOJIRA-figma-to-code-09` and as an eighth acceptance criterion.
`T-NOJIRA-figma-to-code-14` extends to publish cost per case in the baseline, and
`T-NOJIRA-figma-to-code-05` extends so a model-judged requirement records the tier and effort it was
validated at.

The reason is a standing requirement that had not been written down: use the cheapest model and the
lowest effort setting that does the job, and reserve the expensive tiers for work that genuinely
needs reasoning. Today that cannot be acted on, because downgrading a stage and asking "did anything
get worse" has no answer — the pipeline reports neither quality nor cost. With both recorded, a tier
change becomes an experiment: swap the tier, re-run with repetition, read the score delta against the
cost delta. **A change that leaves the score inside the measured spread while halving the cost is an
improvement**, and there is currently no way to state that, let alone prove it.

The prior attempt already tried this and left no evidence: its handover scores model-tier routing as
delivered in the newer version and absent in the older one, with no measurement of what the routing
bought or what it cost. That is the gap this amendment closes.

**What did not change.** The goal, the approach and the scope boundary all stand. Fidelity is still
two dimensions and not five. The pipeline is still not modified — cost is read from what a run
already reports, exactly as coverage and fidelity are. Sequencing is unchanged: the new task hangs
off the result schema and blocks nothing.

**Judgement to be aware of.** Cost is recorded per run and per stage, not attributed to individual
decisions within a stage. That will show _that_ a stage is expensive, never _which_ of its choices
made it so. Finer attribution was deliberately left out as the kind of instrumentation this slice
exists to avoid, and reverting that call costs nothing — the per-stage figure is a strict subset of
anything finer we might add later.

- Amended by: marcin.ludwig
- Amendment approved: 2026-09-30

### Amendment 2 — 2026-09-30, after approval

**What changed.** Two things, both about what the measurement tool _is_.

**It is a bench, not a baseline run.** The purpose stated when this plan was written was to measure
the current pipeline once and publish the number. The standing need is larger: compare quality
across conditions — a different model, a model newly released, a pipeline step added — and see
whether each moved anything. That needs results **retained and comparable over time**, not a single
snapshot. Added as `T-NOJIRA-figma-to-code-13` and as a ninth acceptance criterion. It is a small
addition given what already exists: the result schema records the pipeline commit and the cost, and
repeated runs already produce a spread. What is missing is keeping them and diffing two.

The spread is what makes the comparison honest. Without it, swapping a model and seeing 91.2 become
92.4 reads as an improvement; with it, if the spread is ±3 that difference is nothing. **A
comparison that does not quote the spread is not evidence**, and this is the tool people will reach
for exactly when they want to justify a change.

**It serves both halves of the pipeline, not one.** The work is being split into a designer-facing
stage that produces HTML from a design and a developer-facing stage that fits that HTML to an
application. One measurement tool covers both — the same coverage, geometry and cost machinery
pointed at a different target. Added as a tenth acceptance criterion rather than as a task, because
the second stage does not exist yet and building an adapter for an absent consumer is speculative.
What is required now is only that nothing in the runner or the schema hard-codes the first stage.

**A rename follows.** `tools/design-fidelity-harness/`, named when the tool measured one stage
against a design, no longer describes it. It becomes **`tools/sl-bench/`** — stage-neutral, and
"bench" carries both meanings that apply: a benchmark, and a workbench for running experiments. The
rename lands in `T-01`, before anything is created under the old name.

**What did not change.** Fidelity is still two dimensions. The pipeline is still not modified. The
corpus, the coverage metric, the intake report and the baseline are all untouched. Accessibility
validation of the produced HTML is a dimension this bench will eventually carry — it is named in
[`A-NOJIRA-pipeline-staging`](../../analyzes/NOJIRA-pipeline-staging/analysis.md) — and it is
deliberately **not** added here: it belongs to the slice that builds the HTML stage, and adding a
dimension before there is a thing to measure it on is the pattern this plan exists to break.

**Judgement to be aware of.** Retaining results over time invites treating the stored history as
authoritative. It is not: a result is only comparable to another taken against the same frozen
corpus, and a corpus refresh invalidates comparisons across it. `T-14` records the corpus freeze
stamp with every result so an invalid comparison fails rather than quietly misleads — but that guard
is only as good as the discipline of reading it.

- Amended by: marcin.ludwig
- Amendment approved: 2026-09-30

### Amendment 3 — 2026-09-30, after approval

**What changed.** The bench gets tested like the instrument it is.

Nothing in the original breakdown covered testing the measurement code itself — fourteen tasks
building metrics, none establishing that the metrics are right. That is the worst place to have
the gap: **a measurement tool that is wrong is worse than no measurement tool, because its output
is a number and numbers get quoted.** A pipeline defect makes an ugly screen somebody notices; a
bench defect makes a confident figure nobody questions, and every decision taken against it
inherits the error.

Three additions:

- **A cross-cutting acceptance criterion** (the new eighth): every metric ships with unit tests and
  a **known-answer calibration fixture** — a synthetic node tree and DOM whose correct coverage,
  deltas and diff are known by construction. This is how an instrument is checked: against a
  standard, not against a real design where nobody knows the right answer either. It is cross-
  cutting rather than a task because a metric merged without its test is one nobody retrofits.
- **`T-NOJIRA-figma-to-code-01` extends** to stand up the test infrastructure and the fixture
  convention alongside the skeleton. Test setup is part of standing up a tool, not a later phase.
- **`T-NOJIRA-figma-to-code-14`** adds the end-to-end integration test — the whole bench against a
  stubbed Figma and a static page, no network, asserted against a golden file — plus the failure
  paths, which are what a real run actually hits. The baseline moves to `15` and is blocked on this
  suite being green.

**On behaviour specifications.** Written for the **verdict and gate rules only** — "a delta inside
the spread is reported as indistinguishable", "a comparison across corpus freeze stamps is refused",
"a requirement with no case cannot be activated". Those are rules the design system team and
designers should be able to read and dispute without reading code, and that is the whole reason the
format earns its cost. They are **not** written for the arithmetic: there the assertion is numeric
and the reader is a script, so the format adds ceremony and nothing else. Answering "should we do
BDD?" with a blanket yes is how a test suite becomes something people stop reading.

**What did not change.** Fidelity is still two dimensions, the pipeline is still not modified, and
the corpus, coverage, intake report and baseline are untouched in substance. The execution order
still holds: every task depends only on lower-numbered ones.

**Judgement to be aware of.** Golden-file assertions catch every change, including intended ones,
so they will need updating whenever a metric legitimately changes — and a golden file updated
without being read is a test that has stopped testing. The alternative, asserting field by field,
lets a changed number through unnoticed, which is the failure this amendment exists to prevent. The
trade is deliberate; the discipline it requires is reading the diff.

- Amended by: marcin.ludwig
- Amendment approved: 2026-09-30

### Amendment 4 — 2026-09-30, after approval

**What changed.** Two things about how the work proceeds, neither touching the tasks.

**A smoke run comes before `T-01`.** Take two or three corpus screens, run the existing pipeline by
hand, and keep the run folders. It is reconnaissance, not measurement: does a run complete at all,
does it halt on an unmapped component, how long does it take, and what does the output look like.
Nobody knows — there is not one retained run folder on disk. If the pipeline cannot complete on a
real product screen today, the sequencing below is built on sand and should change before any of it
is written. Half a day, no code, and it is the cheapest risk to retire.

**Two testing cadences, deliberately not merged.** Conflating them makes the fast one slow and the
slow one useless:

|                                             | What it answers           | When                                |
| ------------------------------------------- | ------------------------- | ----------------------------------- |
| Unit, integration and calibration tests     | is the code correct       | every commit, in CI, fast           |
| A bench run over the corpus with repetition | did quality actually move | once per increment, slow and costly |

Running the corpus on every commit would make the feedback loop unusable and teach nothing a unit
test does not; running only unit tests per increment would leave the question the whole plan exists
to answer unasked.

**What did not change.** No task is added, removed or reordered. The numbers are still the execution
order.

**Judgement to be aware of.** The smoke run is a spike, so it is recorded here rather than as a task
— the same treatment the corpus survey got. The risk is that a spike's findings evaporate because
nothing owns them; the mitigation is that its output feeds `T-04`'s case selection and the plan's
own risk table, both of which are written down.

- Amended by: marcin.ludwig
- Amendment approved: 2026-09-30

### Amendment 5 — 2026-09-30, after approval

**What changed.** Adds `T-NOJIRA-figma-to-code-16`, which fixes **when the bench runs again** and
makes running it one action.

The rerun was implied everywhere and stated nowhere, which is the same shape of gap as the
untested bench that Amendment 3 closed. A measurement discipline that depends on somebody
remembering to measure is not a discipline: the rerun that gets skipped is the one after a change
you are confident about under time pressure, and that is also the one most likely to find
something.

Six triggers, one of which is easy to miss: **a scheduled rerun with nothing changed at all.** It
is the only trigger that catches drift the team did not cause — the model provider updates a model,
Figma changes a renderer, a dependency shifts. Without it an unexplained regression surfaces later
and gets attributed to whatever was touched most recently, which is both wrong and expensive.

The task lands after the baseline deliberately: there is nothing to compare against before it, and
automating a comparison never run by hand is how automation ends up measuring the wrong thing.

**What did not change.** No existing task is touched and the execution order still holds — 16
depends on 13 and 15, both lower.

**Judgement to be aware of.** The CI check **flags rather than blocks**. A hard block on a slow,
expensive job teaches people to route around it, and a routed-around gate is worse than an honest
flag. If flagging proves too weak, tightening it is one line; recovering from a gate people have
learned to bypass is not.

- Amended by: marcin.ludwig
- Amendment approved: 2026-09-30

### Amendment 6 — 2026-10-05, after the three-review pass

**The bench does change the pipeline, and acceptance criterion 5 says it must not.**

Principle 1 and AC-5 are binary: _"`git diff` over `tools/implement-design-plugin/` is empty for
the whole plan."_ `data-figma-node` — the attribute
[A-NOJIRA-figma-metadata-contract](../../analyzes/NOJIRA-figma-metadata-contract/analysis.md)
identifies as the prerequisite for the discrepancy registry, and which
[P-NOJIRA-html-contract](../NOJIRA-html-contract/plan.md) depends on — is emitted by the
component-implementer agent, which lives inside that directory. **Emitting it fails AC-5
outright**, and no approved plan currently owns emitting it.

Three documents acknowledge the question and none of them binds: `sequencing.md` lists it as
needing a decision, the html-contract approval assigns it to task 00 as "the position to beat",
and the metadata-contract analysis assigns the attribute to a plan that **does not exist**. Left
alone, `T-NOJIRA-html-contract-00` settles a criterion belonging to this plan, in one task,
without this plan being consulted.

**Amended:**

- **Principle 1 becomes "the bench does not change pipeline _behaviour_."** The distinction is
  the point: a run must produce the same components, with the same content, whether or not it is
  being measured.
- **AC-5 becomes two parts.** First, no change to generation logic — what gets built, from what,
  with what values. Second, any marking change is listed, justified, and **proven
  non-behavioural** by the unmarked 38-run control remaining comparable to a marked run on
  completions and conformance.
- **The unmarked control becomes a kept artifact**, not a historical curiosity, because it is the
  only thing that keeps the second part checkable.

**Also amended, from the same review pass:**

- **T-06's method is falsified.** It requires "the denominator is honest and not quietly
  shrinkable". `get_metadata` stops at instance boundaries — 10,936 nodes returned as 27 — so
  every descent enlarges the universe and **there is no denominator**. Replaced by the closure
  census (visited, resolved, captured, descended, hidden, excluded, frontier empty), now owned by
  `T-NOJIRA-html-contract-04`. T-06 is superseded rather than reworded.
- **T-07 acceptance 1 is unreachable** — "runs the existing pipeline over every registered corpus
  case" cannot hold while 14 of 19 halt. A halt with a recorded cause is a **first-class result**,
  not a run failure.
- **T-09's method is measured false.** "Cost is read from what a run already reports" produced
  self-reports disagreeing by two orders of magnitude, one of them fabricated. The source becomes
  the ledger in `T-NOJIRA-figma-ingestion-01` plus orchestration-reported subagent usage, with the
  supervising session's own consumption marked **unmeasured** rather than estimated.
- **Amendment 4 is discharged** — its smoke run was superseded by 19 supervised and 38 control
  runs.
- **Amendment 2's accessibility deferral has fired without anyone noticing.** It parked
  accessibility in "the slice that builds the HTML stage". That slice now exists as
  `P-NOJIRA-html-contract` and does not carry it, while the control shipped two WCAG 2.1 AA
  failures invisible to every gate any plan builds. Remediation may still defer; **detection must
  not.**

**Not amended, deliberately:** the goal, the two-dimension discipline, and T-05, T-13, T-14, T-16,
which the review found intact or strengthened.

- Amendment proposed: 2026-10-05
- Amendment approved: pending
