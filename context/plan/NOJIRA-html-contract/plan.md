---
type: plan
schema_version: 1
id: P-NOJIRA-html-contract
title: The contract — what the common format must express, agreed before anything reads it
description: Draft the common format against the 36 requirements of the metadata-contract analysis, fold in the architecture package that specifies the same artifact under another name, and land it as a language-neutral schema — the one artifact every generator, metric and registry key is written against
jira: null
resource: null
status: approved
phase: approved
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T00:00:00Z
tags: [figma, design-to-code, html, schema, determinism, measurement]
source_analysis: A-NOJIRA-pipeline-staging
slice: contract
depends_on: [P-NOJIRA-corpus-census]
approved_by: marcin.ludwig
approved_date: 2026-10-05
open_questions: []
---

# The HTML contract and the common format it is generated from

> Derived from [A-NOJIRA-pipeline-staging](../../analyzes/NOJIRA-pipeline-staging/analysis.md),
> with the sequencing argument in
> [`sequencing.md`](../../analyzes/NOJIRA-figma-to-code/sequencing.md) and the deliverable
> described in [`html-first.md`](../../analyzes/NOJIRA-figma-to-code/html-first.md).

## Goal

Produce the artifact a developer receives, and the apparatus that measures it, from data already
on disk.

One artifact: **the agreed format**, as a document and then as a language-neutral schema. The
generators that read it, and the fidelity numbers computed from it, are
`P-NOJIRA-html-artifacts`.

The measurable outcome of _this_ plan is narrower and is the reason it exists separately: **every
one of the 36 requirements has a recorded disposition**, and the schema that results is the one
artifact every generator, metric and registry key will be written against. A field missing here
is a rewrite later rather than an addition.

## Approach

**Build the measuring apparatus over captures already on disk, before touching Figma again.**

The nineteen runs cost roughly 8M tokens to produce and their captures are committed. The adapter
and the generators read them and need no API calls at all, which makes every step here
repeatable, free to re-run, and independent of Figma's availability or its undocumented response
shapes.

Three consequences shape the work:

**The format is designed from requirements, not from the data.** The captures were made before
the capture protocol existed, with improvised depth — eleven of nineteen fail the reconstruction
probe. The adapter must _report_ what is missing rather than the schema shrinking to fit, or the
contract inherits their gaps permanently.

**A script has no judgement, so two runs produce identical bytes.** That is the design system
team's repeatability goal satisfied by construction rather than by discipline, and it is checkable
as a checksum comparison rather than argued.

**Raw captures stay raw.** The adapter reads them and never rewrites them, so it can itself be
rewritten when it turns out wrong — which, over an undocumented format, it will be.

## Scope

**In:** the contract as a document with a disposition against all 36 requirements, and its
schema — **JSON Schema normative, `zod` derived**.

**Out:** the adapter, the generators, the closure check and every fidelity figure — all
`P-NOJIRA-html-artifacts`, which starts when this plan finishes; framework code generation, which
is a script the developer runs; any change to how Figma is called; the discrepancy registry, which
[A-NOJIRA-figma-metadata-contract](../../analyzes/NOJIRA-figma-metadata-contract/analysis.md)
blocks on `data-figma-node` existing first.

## Work breakdown

- `T-NOJIRA-html-contract-00` — **The contract as a document, and a human gate on it.** Primary
  input is the 36 requirements; first deliverable is a disposition against every one.
- `T-NOJIRA-html-contract-01` — The format in code: **language-neutral JSON Schema normative**,
  `zod` derived from it, and a round-trip test proving the two accept and reject the same
  documents.

**Two tasks, because this plan ends where agreement ends.** Everything built on the contract is
`P-NOJIRA-html-artifacts`, which depends on this plan finishing rather than on either of its
tasks individually.

### Task 00 cannot be approved without a survivorship census first

**Three independent reviews agreed this plan should not start at 01, and the measured reason is
that its premise is thinner than it claims.** Before the contract is drafted, count what actually
survives across the nineteen runs:

| Measured            | Finding                                                                                                                                                                                                                                        |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| adaptable captures  | **6 runs hold under 10 KB of design context in total**; `a1` holds agent prose and elided class names under `"truncated": false`                                                                                                               |
| provenance          | every `captures/index.json` was built by `normalise-captures.mjs` **from the runs' own markdown**, and all nineteen `capturedAt` values fall within 64 ms of each other — the exact lie the capture protocol says that field exists to prevent |
| verified references | **7 are downscaled**, one is channel-halved. Under 07a's refuse-never-correct rule, roughly **8 of 19** reach 07b                                                                                                                              |
| assets              | 55 captures reference dead asset URLs and **no run has `captures/assets/`**                                                                                                                                                                    |

**That census is the denominator**, and it goes in the plan before anything is built against it.
Task 03's safety net — "the runs it cannot adapt are named" — **does not fire** on this, because a
summarised capture parses cleanly and yields a plausible wrong document. That is this project's
signature failure, found inside its own plan.

Two things the contract must carry, and the first is a **required field, not a consequence**:

- **`provenance` per capture — mandatory, no default.** One of `figma-bytes`, `reconstructed`,
  `summarised`. A document whose provenance is unset does not validate. And **`capturedAt` must
  refuse to populate on a reconstructed index**: that field exists precisely to stop a backfill
  passing as original evidence, and today all nineteen carry one normalisation timestamp inside
  64 ms.
- **`asset: unavailable` as a format state**, so a figure says whether it scored an image-less
  render.

### Task 00 is anchored to the 36 requirements, not re-derived from them

**A traceability audit found that this plan quietly replaced the contract it should have
implemented.** `A-NOJIRA-figma-metadata-contract` carries 24 findings, **36 numbered
requirements** each anchored to one, a three-artifact split with lifecycles, a six-case
acceptance test and a three-step sequence. Its `## Leads to` names a plan and an ADR; **neither
was ever created.** Four days later this plan was approved with "the contract itself" as task
00, and derived its checklist afresh from four consumers — **citing exactly one of the
thirty-six.**

That is the same failure this effort criticised v2 for, committed in the same repository, four
days after the analysis was written.

**So task 00's primary input is the R-list, and its first deliverable is a disposition against
every one of the thirty-six**: satisfied by the format, deferred with a named trigger, or
rejected with a reason. The four-consumer checklist below is a **lens for finding gaps in that
list**, not a substitute for it, and anything the lens surfaces that the R-list does not contain
is an amendment to the analysis rather than a quiet addition here.

**And one input I missed entirely:** `custom-elements.json` (CEM) declares every component's
attributes, slots, **cssParts** and **cssProperties**. It is the authority for the component
surface that runs have been inferring from pictures — one gave `sl-avatar` an `icon` slot it does
not have, and `sl-select` documents a part that cannot match. It is generated rather than
committed, so using it means running `scripts/build-metadata.js` first.

CEM's structure, the plugins that generate it, and the fact that it is absent from the repository
are surveyed in [`A-NOJIRA-design-system-architecture`](../../analyzes/NOJIRA-design-system-architecture/analysis.md)
F6 and F8 — read it before task 00 rather than re-deriving the shape from a manifest.

**A naming hazard to fix while doing it:** there are two colliding `R` namespaces — R1–R31 in
`A-NOJIRA-requirement-backlog` and R1–R36 in the contract analysis. Prefix them before anything
cites a bare number.

### The four-consumer lens

**Four** consumers, and the contract fails if it serves only the first.

**1. Generating the design (2.1).** Element identity and the Figma node it came from; geometry;
resolved style values; text content — including content that appears in no component mapping,
which is how three consent sentences nearly went missing; asset references resolved to local
files, never to an expiring Figma URL; and the component mapping where one resolved.

**2. Analysis.** Per run: the mode and its evidence; the call ledger's derived figures — count,
duration, bytes, retries, cache hits; tokens and wall clock per phase; the closure census;
coverage figures; the guards (pipeline tree, file version, variable mode). These make a run
comparable with another run, which is the thing the corpus cannot do today.

**3. The overlay (2.2) — the consumer most likely to be under-served**, because it needs things
only it needs:

- **per element, a state** — matched, approximated, inferred, invented, missing — not a boolean;
- **both values**: what the design said and what was emitted, so the overlay can show the
  difference rather than assert it;
- **the delta**, and whether it was **avoidable** — a colour between two ramp steps is unreachable
  by construction, and the overlay must distinguish that from a mistake;
- **the basis**: mapped, token, inferred, invented;
- **the cause**, for anything unresolved, with its owner — the five causes;
- **the anchor** — the node id, so hover and click attach to something;
- **a question, where one exists** — the decomposer answers twenty to thirty per screen silently,
  and the overlay is where they should surface.

**4. Framework code generation — the consumer I left out, and the omission is self-defeating.**
`html-first.md` makes the HTML the contract implementation is generated from, yet the checklist
above asks only for geometry, resolved styles, text, assets and mappings. That is **absolute
positioning**, which is the worst possible input to a component generator. Worse, 07b rewards
pixel fidelity, so the metric actively pushes the generator toward it.

The contract must therefore record **layout intent, not only layout result**: auto-layout
direction, gap and padding; **hug / fill / fixed**; bound variables; variant and state; breakpoint;
role. The data is already in the captures — flex appears in 60 of 87 capture files — and
`ARCH-handover-package` is explicit that the Figma extract is the **only** channel through which a
developer without a Dev seat receives it. The rule: **geometry derived, layout recorded.**

**The test of task 00 is a retrofit, not a review.** Take the **six** cases
`A-NOJIRA-figma-metadata-contract` names, not the four I copied: Kampus's unreachable palette,
A10's variable modes, the `::part()` specificity hazard, the `24 + 8 = 32` decomposition, **a
blocked run**, and **a measurement that examined nothing**. The two I dropped are the two that
analysis added, and the first of them is the **majority outcome** — 14 of 19 cases halt, and
`P-NOJIRA-figma-ingestion` task 04's probe produces exactly that result. A contract that cannot
record a halt leaves the other plan nowhere to write its answer. A contract that cannot
express what we have already found is wrong, and that is discoverable in an afternoon without
building anything.

Three orderings are load-bearing. **04 before 05**, because generating HTML from an incomplete
capture produces a plausible wrong picture, which is this project's signature failure. **06
before 07b**, because a fidelity number from a non-deterministic generator cannot be compared
with anything, including itself. And **07a before 07b** — caught in review and nearly missed:
`get_screenshot` has four behaviours including **halving every colour channel**, so a fidelity
number computed against an unverified reference is a number about a corrupted ground truth. The
context states the rule plainly — verify and refuse, never reconstruct — and this plan would have
violated it at its most important task.

## Risks & dependencies

**The schema gets fitted to the captures we happen to hold.** The most likely failure, because it
is the path of least resistance when the adapter fails. Mitigation: 01 lands before 02, derived
from the requirements the contract analysis enumerated, and 03's output is a list of gaps rather
than a reason to weaken 01.

**The design HTML cannot be made faithful from the captures.** `render-design.mjs` exists and
disowns fidelity in its own header — but that is a statement about the converter, not about the
data. 05 settles it. If the gap is large and structural, it changes what Phase 1 must capture,
which is much cheaper to learn here than after the registry is keyed.

**The overlay has no decisions to show on historical runs.** The nineteen hold open questions in
prose, not structured decisions, so 08 over them will be partial. That is a finding about what
the run record must carry, not a blocker — and it is why 08 sits after the measurement tasks
rather than before.

**One dependency, on a finished plan.** `P-NOJIRA-corpus-census` ends with an explicit
full-scope-or-narrow recommendation, which `P-NOJIRA-html-artifacts` honours. This plan needs the
census only so that the contract is written knowing what the corpus actually contains.

## Acceptance

- **Every one of the 36 requirements in `A-NOJIRA-figma-metadata-contract` has a recorded
  disposition** — satisfied by the format, deferred with a named trigger, or rejected with a
  reason. A requirement with no disposition fails this plan.
- `ARCH-handover-package` is folded in, and what it carries that the four-consumer lens did not —
  **layout intent and bound variables** — is in the format.
- The six acceptance cases the analysis names, **including a blocked run**, can each be recorded
  in the format. A contract that cannot record the majority outcome is wrong.
- `provenance` is a required field with no default, and `capturedAt` refuses to populate on a
  reconstructed index.
- The normative schema is language-neutral JSON Schema, `zod` is generated from it, and a
  round-trip test proves the two accept and reject the same documents.
- **Each step writes a versioned artifact and re-running a completed step is a no-op**
  (`A-NOJIRA-pipeline-staging` F11, requirement R21).

## Approval

**Approved 2026-10-05 by marcin.ludwig**, with task 00 added at approval as a human gate on the
contract itself.

Two questions were open when the plan was written and both are now settled, one by the owner and
one by being assigned somewhere:

- **Is the HTML the deliverable or only the probe?** The deliverable. _"html będzie kontraktem z
  którego później można wygenerować implementację"_ — so the framework code is generated from the
  HTML, and the probe is a by-product rather than the purpose.
- **Does the bench depend on marks?** Decided inside task 00, which is where marks are specified.
  The position to beat: marks are precision rather than precondition, so the bench degrades
  gracefully and the unmarked control stays comparable.

Approving the plan is not approving the contract. Task 00 is its own gate, and 01 does not start
until it passes.
