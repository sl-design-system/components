---
type: plan
schema_version: 1
id: P-NOJIRA-mapping-adapters
title: Two mapping sources behind one interface, so either can be measured against the other
description: 'Code Connect becomes one adapter among several; a second implementation is the only honest test of the first'
jira: null
resource: null
status: proposed
phase: conceptual
owner: marcin.ludwig
created: 2026-10-06T00:00:00Z
updated: 2026-10-06T00:00:00Z
tags: [figma, code-connect, mappings, adapters, measurement]
source_analysis: A-NOJIRA-mapping-coverage
slice: mapping-adapters
depends_on: [P-NOJIRA-figma-ingestion]
approved_by: null
approved_date: null
open_questions:
  - How many Figma assets does Components 2.0 publish, against the 70 node ids the inventory binds?
  - Is assetKey stable across library publishes?
  - How is a generated mapping labelled so a conformance report never presents it as the design system team's declaration?
---

# Two mapping sources behind one interface

> Derived from [A-NOJIRA-mapping-coverage](../../analyzes/NOJIRA-mapping-coverage/analysis.md).

## Goal

A node resolves to markup through a **named adapter**, and which adapter answered is recorded
next to the answer. Two adapters exist — Code Connect, and mappings declared in this repository —
and a comparator runs both over the corpus and reports where they disagree.

The outcome a stakeholder would recognise: **designs resolve to design-system components even
where Code Connect has no mapping, and when the two sources disagree somebody is told.**

## Approach

**Code Connect is not being replaced.** Where it resolves it is the only authoritative answer
available — the design system team's own declaration of how a component becomes code — and it
stays first in line. What changes is that it stops being the _only_ thing that can answer, and
stops being unfalsifiable.

Three positions carry the design.

**A second implementation is the only honest test of the first.** `A-NOJIRA-ds-conformance`
records that _a wrong mapping is worse than no mapping, because it arrives with authority and
nothing downstream questions it_ — measured: `<sl-avatar display-name="7 students already
joined">`, `placeholder="[object Object]"`, `<sl-icon name="far-arrow-left">` against a theme
that registers the bare name. Today nothing can disagree with a snippet. A second source can, and
a disagreement is a finding whichever side is wrong.

**Identity, not name.** `A-NOJIRA-mapping-coverage` F4 caught this analysis's own classifier
matching `sl-card Actionable` to `card.figma.ts` with tier `exact`, when a probe proves they are
two different Figma components and only one is mapped. Name matching produces confident wrong
answers. Every adapter keys on the Figma asset identity — `assetKey` from
`list_file_components_for_code_connect`, `componentKey` / `componentSetKey` from
`search_design_system` — and name matching survives only as a labelled, lower-confidence tier.

**Cheap by construction, because the properties come in one call.** Measured:
`get_code_connect_map` costs ~31 s per node; `get_code_connect_suggestions` returned **135
components with their property values in 32.5 s** for a whole subtree. The local adapter reads
that one response, so it is roughly one call per design rather than one per node — and the nine
corpus designs with no design-system component at all get property data for the first time.

## Scope

**In:** the resolver interface and its provenance record; the Code Connect adapter, extracted
from what exists and proved inert; a second adapter reading mappings declared in this repository,
keyed on asset identity; the comparator that runs both over the corpus; and the Figma-side asset
count that tells anyone how large the gap actually is.

**Out:** writing the missing mappings themselves — that is design system team work this plan only
measures and ranks. Publishing anything into Figma; `send_code_connect_mappings` is a write tool
and this plan does not call it. The similarity layer (F4 of `A-NOJIRA-ds-conformance`), rejected
in `T-NOJIRA-figma-ingestion-03` and still rejected. Rendering, geometry and fidelity, which are
`P-NOJIRA-html-contract`'s.

**Deliberately not decided here:** whether a general template — a mapping that emits the bare tag
and reads no properties — should replace the detailed ones. The analysis found only five
`hasTemplate: false` entries across nineteen runs, so the problem it solves is small, and the
trade against lost detail is unmeasured. The comparator is what would measure it, which is why
that question comes after this plan rather than inside it.

## Work breakdown

- `T-NOJIRA-mapping-adapters-01` — **Count the gap, keyed on identity.** Enumerate the Figma
  assets Components 2.0 publishes against the 70 node ids the inventory binds, by asset key. This
  replaces _40 mappings against 59 shipped components_, which counts code components where Code
  Connect binds Figma assets, and it produces the demand-ranked list of what is missing. Also
  repairs the name-matching false positive in `classify-unresolved.mjs`, which is the same defect
  in miniature.
- `T-NOJIRA-mapping-adapters-02` — **One resolver interface, Code Connect behind it.** Extract
  what `traverse.mjs` already does into a named adapter returning `{ markup, properties,
provenance, confidence }`. Proved inert the way the transport extraction was: the corpus
  output byte-identical, the behaviour change separate.
- `T-NOJIRA-mapping-adapters-03` — **The second adapter.** Mappings declared in this repository,
  keyed on asset identity, fed by one `get_code_connect_suggestions` call per design. Every
  property translation is a table in this repo, tested with fixtures — which is the actual
  argument for it, because the Figma property names (`'𝐓 - Label'`, `'↕️ - Size'`) drift either
  way and today they drift invisibly inside a template we cannot see.
- `T-NOJIRA-mapping-adapters-04` — **The comparator.** Run both adapters over the corpus and
  report agreement, disagreement and coverage per adapter. A disagreement is a finding with two
  candidate owners, and the report must not assume which.

Each task is measured on landing, against the corpus already on disk:

| After | Measure                                            | Against                                     |
| ----- | -------------------------------------------------- | ------------------------------------------- |
| 01    | how many Figma assets have no mapping, by identity | _40 of 59_, which measures the wrong thing  |
| 02    | the corpus output, byte-identical                  | the output before the extraction            |
| 03    | nodes resolving to a design-system component       | 113 of 135 `sl-*` instances, itself a floor |
| 04    | **where the two sources disagree**                 | nothing — no such figure exists today       |

## Risks & dependencies

**The worst outcome is a confident wrong mapping, and this plan creates a second way to make
one.** A mapping we infer carries none of the design system team's authority and all of its
appearance. The mitigation is in the data model rather than in care: `provenance` and
`confidence` travel with every answer, and the conformance report may never present an inferred
mapping as a declared one. If that cannot be held, the plan is worse than not doing it.

**It could become a fork of the design system's own mappings.** Two sources that drift apart cost
more than one that is incomplete. The comparator is the guard — a growing disagreement count is
the signal to stop — and the Code Connect adapter stays first in line so the local one is a
fallback, never a preference.

**Nine of nineteen designs contain no design-system component at all.** This plan does not help
them resolve to `sl-*`, because there is nothing to resolve to. What it gives them is property
data from one cheap call, which they have never had. Anyone reading the coverage figures should
keep the 19% in view.

**`assetKey` stability is assumed and untested.** The whole identity-keyed approach rests on it.
`T-01` tests it first, and if it fails the plan needs a different key before `T-03` is written.

**Depends on `P-NOJIRA-figma-ingestion` finishing.** In substance it consumes `-02`'s traversal
and `-03`'s classifier, both done; the remaining task is the fourteen-case probe, which this plan
does not use. The dependency is declared at plan level because that is the rule, not because the
probe is needed.

## Acceptance

- Every resolved node records **which adapter answered**, with what confidence, and no consumer
  can read an inferred mapping as a declared one.
- The Code Connect adapter produces **byte-identical** output to today's path over the corpus.
- The Figma-side gap is counted **by asset identity**, and the name-matching false positive that
  prompted this plan is gone — `sl-card Actionable` no longer reports as `card.figma.ts`.
- The comparator reports, over the nineteen runs, **how often the two sources agree, disagree,
  and each answer alone** — and at least one real disagreement is examined and attributed.
- Nothing is written into Figma.

## Approval

**This section must be filled before creating tasks in `work/` (phase gate).**

- Approved by: <!-- name -->
- Approved date: <!-- YYYY-MM-DD -->
- Open questions resolved: <!-- the three in frontmatter: the asset count and the assetKey
     stability test are both T-01's first steps and can be carried; the provenance labelling
     question should be answered here, because T-02's interface encodes the answer and changing
     it later touches every adapter. -->
- Outstanding concerns: <!-- none, or list -->

To approve: set `phase: approved`, `approved_by`, `approved_date` in frontmatter, and clear `open_questions: []` — in the **same commit** as this sign-off (CONVENTIONS § 4.1).
