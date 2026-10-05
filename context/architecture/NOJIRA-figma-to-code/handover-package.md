---
type: architecture
schema_version: 1
id: ARCH-handover-package
title: The handover package — layout, write protocol and verification chain
description: How the stage-one artifact is split across files, how it is written so a crash is recoverable, and where each correctness check belongs
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-09-30T15:00:00Z
updated: 2026-10-01T12:00:00Z
tags: [architecture, package, schema, resumability, verification]
---

> **Reviewed 2026-10-05 — this document and `P-NOJIRA-html-contract` specify the same artifact
> under two names.** The `package/` described here — tree, geometry, style, instances, text,
> dictionaries, manifest, and an `index.html` generated from them by a pure function — is the
> plan's "common format" plus its first generator, written twice by two documents that do not
> reference each other. **The plan is authoritative**: it is gated, its schema is normative, and
> it can record a halt, which this document has no place for. What survives here and is _not_ in
> the plan: layout intent and bound variables, and the argument that the Figma extract is the only
> channel carrying them to a developer without a Dev seat. Fold that in; treat the rest as
> superseded.

# The handover package — layout, write protocol and verification chain

## Purpose

[`A-NOJIRA-pipeline-staging`](../../analyzes/NOJIRA-pipeline-staging/analysis.md) concluded that the
structured data is the source of truth and the HTML is generated from it, that packages are
immutable and versioned, and that checkpointing per artifact is what makes a run resumable. This
document turns those conclusions into a shape: what files exist, how they reference each other, how
they are written safely, and where each check runs.

It exists because the next decisions are about object shapes, and shapes described in prose drift
and cannot be validated. **This document states the structure and the reasoning; the schemas
themselves belong in schema files** in the repository, versioned and with fixtures, once the
baseline shows what stage one actually preserves.

## Overview

### Size is a context problem, not a parsing problem

The concern that structured data will be larger than the HTML is well founded: for a screen of a few
hundred nodes, an unnormalised extraction carrying a record per node plausibly runs to a few hundred
kilobytes, comfortably more than the rendered markup. Two clarifications matter.

**Machine parsing cost is irrelevant.** Parsing a few hundred kilobytes of JSON is milliseconds, and
less than building a DOM from the equivalent HTML. This is not the constraint.

**Context cost is the real constraint**, and it is not solved by making the data smaller — it is
solved by making it so that nothing has to read all of it. Three measures, in order of effect:

1. **Normalise into dictionaries.** A design has on the order of tens of distinct token values and
   hundreds of references to them. Recording the value once and referencing it by key removes most
   of the bulk, and has the far more important side effect of making token compliance checkable —
   a node either references a token or it does not.
2. **Split by question, not by convenience** (below). A consumer loads the one or two files that
   answer its question.
3. **Never inline what is derivable.** A Code Connect snippet is a property of the component, not of
   each instance; instances carry the component reference and their resolved property values.

Comparing the size of the source against the size of a derived artifact is not a choice anyway —
both ship. The only real question is whether the structured form can be worked with, and the answer
is yes, provided nothing needs to read it whole.

### Package layout

Many files with one index, joined by node id.

```
package/
  manifest.json          index: identity, file list, checksums, schema versions. Written LAST.
  design/
    tree.json            hierarchy only — id, parent, order, type, name. Small; almost always read.
    geometry.json        per node: bounding box, layout mode (hug/fill/fixed), constraints
    style.json           per node: references into the dictionaries
    instances.json       per component instance: component ref + resolved property values
    text.json            per text node: content and ranges
  dictionaries/
    tokens.json          each distinct token value once
    components.json      each component used once: its definition and the mapping applied
  index.html             generated from the above by a pure function
  reference.png          the Figma render, so the visual check needs no Figma access
  metadata.json          attestation, accessibility result, provenance, link back to the design
```

Each file answers one question, which is what keeps reads small: structure alone comes from
`tree.json`; coverage needs tree plus instances; position fidelity needs tree plus geometry; token
compliance needs style plus the token dictionary. **The node id is the join key throughout**, and it
is the same id carried into the HTML as `data-figma-node`, which is what lets a rendered element be
traced back without reopening Figma.

The alternative — one document — is simpler to write and worse in every other respect: it forces
whole-file reads, and a partial write loses everything rather than one slice.

### Write protocol — how a crash is survivable

The failure to design for is an agent stopping part-way through writing. Four rules, and together
they remove the whole class rather than mitigating it.

**Write atomically.** Every file is written to `<name>.tmp`, flushed, then renamed onto its final
path. Rename is atomic, so **a half-written file never appears under its real name**. A stray `.tmp`
found on resume is evidence of a crash, not state: delete it.

**Presence is never the completion signal.** A file existing proves nothing about whether it is
finished or current. Completion is an entry in `manifest.json` carrying the file's checksum and
schema version. Resume validates each entry: file present and checksum matching means done;
anything else means redo.

**The manifest is written last, and it is the commit point.** Artifacts are written first, then the
manifest is updated atomically. If a step is not listed in the manifest, that step did not happen,
regardless of what is on disk. This is the same discipline a journaling filesystem uses, for the
same reason.

**Steps are idempotent, and re-running a completed step is a no-op.** This is what makes resume and
normal execution **one code path**. A separate resume path is exercised only after something has
already gone wrong, which is the worst possible moment to discover it has rotted.

One addition beyond crash recovery: each manifest entry records the **checksum of the step's
inputs**. A step whose output exists but whose input has changed is stale, not done — which is what
makes a re-run after a design change regenerate only the affected slices.

### What the Code Connect mappings actually are

`scripts/connect-figma-components/` is easy to mistake for a second copy of `custom-elements.json`.
It is not data at all — **each `*.figma.ts` is an executable program**, one per component, and it is
the only place in the system where the Figma vocabulary and the code vocabulary are connected.

A mapping runs against a real selected instance: it navigates that instance's internal structure
(`findInstance('Button-Variants')`, then `'Button-Base'`), reads each property it cares about, and
emits the snippet. Two things in it exist nowhere else:

- **The vocabulary translation.** Figma's `Variant` value `Positive` becomes the code's `success`;
  `Caution` becomes `warning`; `Negative` becomes `danger`. The element manifest can confirm that
  `success` is a legal value of `variant`; nothing but this file knows that `Positive` is the Figma
  word for it. That correspondence is irreducibly human knowledge.
- **The defaults.** "The default fill is solid", "the default variant is secondary" — encoded as
  the fallback when a Figma property is absent, which is what keeps the emitted snippet minimal.

And the mappings **assert rather than assume**. The shared helpers — `checkInstance`, `checkEnum`,
`checkStringProperty`, `checkBooleanProperty` — throw when a property is missing or an expected
inner instance cannot be found. That means **a designer renaming a layer or a property in Figma
makes the mapping fail loudly instead of silently emitting a wrong snippet.** It is drift detection
at the source, and it was already built.

Three forms exist: 28 single mappings, 12 batch templates driven by
`components.figma.batch.json` (one template serving several Figma nodes, with per-node overrides
such as `"shape": "pill"`), and 14 empty scaffolds awaiting mappings.

|              | `custom-elements.json`                                  | `*.figma.ts`                                                                         |
| ------------ | ------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| What it is   | data — a declaration of what the code component accepts | a program that resolves one Figma instance into a snippet                            |
| Produced by  | generated from source by `build-metadata.js`            | hand-authored per component                                                          |
| Knows        | attribute names, types, enum values, inheritance        | Figma property names, Figma inner structure, the Figma↔code vocabulary, the defaults |
| Which side   | the code only                                           | the bridge                                                                           |
| When it runs | never — it is read                                      | at resolution, against a live instance                                               |

### How Code Connect is used, per node

It is the **first** question asked of every node in stage one, because a resolved node costs a
lookup and an unresolved one costs inference. Three outcomes:

1. **Resolved** — take the snippet as it comes back. The mapping program has already run in Figma.
2. **`null` but identifiable** — the node is named `sl-*`, a child carries a snippet, or a peer
   instance of the same component resolves. The plugin already treats these as connected and the
   heuristic should stay.
3. **Genuinely unresolved** — inference begins, and so does the question of what that means.

**What happens on the third outcome is governed by the scoring mode, not by a fixed policy.** In
strict mode an unresolved component instance is a defect and the run halts with the node list — the
current behaviour, and right when the fix is to publish a mapping. In as-is mode the node is
reproduced from its design properties, counted, and reported as part of the non-design-system
fraction — right when the design legitimately contains things the library does not cover.

The mode governs **what stops the run, never what gets measured**: the same design scored strictly
and as-is produces the same diagnosis and differs only in its verdict. Why a node is unresolved —
missing mapping, detached instance, avoidable non-use, or a genuine library gap — is classified in
both, and is the subject of
[`A-NOJIRA-ds-conformance`](../../analyzes/NOJIRA-ds-conformance/analysis.md).

### Code Connect and the metadata answer disjoint questions

Whether the mappings replace the structured artifact is settled by what each one can say.

**Code Connect answers "what component is this, with which properties".** A single
`get_code_connect_map` call over the subtree returns, per node, the _already-resolved_ snippet —
`<sl-button variant="success" size="lg">Label</sl-button>`. The mapping program has run, the
vocabulary translation has been applied, and the defaults have been folded in. For those nodes
there is nothing left to infer.

**It says nothing about anything else.** Where a node sits, how large it is, what its gaps and
padding are, whether it hugs or fills, what colour a plain frame has, how the instances are
arranged relative to one another — none of that is in the map, and for every node that is not a
component instance the map returns nothing at all. On a real screen those are the majority: frames,
groups, text and layout containers, which is precisely where the layout lives.

So the metadata is not replaced. What changes is **what it has to carry for the nodes Code Connect
covers**: not raw Figma property values plus a translation table to apply later, but the resolved
snippet and the node id. That is smaller, and it is authoritative in a way a re-derivation could
never be — the team that owns the mapping already decided.

| Question                                  | Answered by                              | Covers                                  |
| ----------------------------------------- | ---------------------------------------- | --------------------------------------- |
| Which component, which properties         | Code Connect map                         | component instances that have a mapping |
| Where, how big, what spacing, hug or fill | the structured extraction                | every node                              |
| Which token produced a value              | the extraction plus the token dictionary | every node                              |
| What it should look like                  | the reference image                      | the whole frame                         |

### Cost — Code Connect is the cheapest answer available, and unmapped nodes are the expensive ones

The Figma call count barely moves: a stage-one run makes roughly five calls — structure, Code
Connect map, design context, variable definitions, screenshot — and the map is one of them whether
or not we lean on it. Calls are not where the cost is.

**Tokens are**, and that is where the difference is stark. There are two ways to answer "what
component is this and with what properties":

|                   | Model infers it from node data             | Code Connect lookup                         |
| ----------------- | ------------------------------------------ | ------------------------------------------- |
| Model involvement | reads the node, reasons, decides           | none — the answer is a string               |
| Token cost        | proportional to the node data it must read | effectively zero                            |
| Determinism       | varies per run                             | identical every run                         |
| Authority         | a guess that looks confident               | the mapping the team wrote and CI validates |

This is the same principle as moving a check out of a prompt and into a script, applied to the
single most frequent decision the pipeline makes. **Every node that gains a mapping moves from
inference to lookup** — cheaper, deterministic, and correct by someone's deliberate decision rather
than by a model's reading.

That reframes the fourteen unmapped scaffolds. They are not only a coverage problem that halts
runs; they are **the main cost and variance driver in stage one**. Extending the mappings is the
highest-leverage work available, and it is already owned.

It also gives the intake report a second purpose beyond design-system adoption: the proportion of a
design's instances that Code Connect resolves **predicts what a run of that design will cost and
how much it will vary**. Measuring adoption and forecasting cost turn out to be the same
measurement.

### Verification chain — five checks, five places

The question "where do we check that properties match?" has five answers, because there are five
distinct things that can disagree. Putting a check in the wrong place is how an error surfaces to
the person least able to fix it.

| #   | Check                                               | Where it runs                                                              | What it catches                                                                                                                                                               | Status                                      |
| --- | --------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| 1   | Code Connect mapping ↔ `custom-elements.json`       | CI, on every pull request                                                  | A mapping referencing an attribute the component does not have, inherited attributes included                                                                                 | **Exists** — Diana's snippet validator      |
| 2   | Figma ↔ extraction                                  | Stage one, at extraction                                                   | A misread or dropped node; non-determinism. Verified by extracting twice and diffing bytes                                                                                    | Planned (`T-02`)                            |
| 3   | Emitted snippet ↔ `custom-elements.json`            | CI, on every pull request                                                  | An attribute the component does not have, a boolean carrying a value, an enum value outside the declared set                                                                  | **Exists** — Diana's snippet validator      |
| 3b  | Figma property name ↔ code attribute name           | CI, on every pull request                                                  | A mis-wiring: one Figma property feeding the wrong attribute, with an allowlist for deliberate exceptions                                                                     | **Exists** — Diana's mapping-name validator |
| 3c  | **Figma property surface ↔ what the mapping reads** | Nowhere                                                                    | A Figma property the mapping never reads, so it is silently dropped from every snippet                                                                                        | **Missing**                                 |
| 3d  | **Is the mapped component the right one at all**    | Nowhere                                                                    | A mapping that is attribute-valid and semantically wrong — the first real run found footer _links_ mapped to `sl-button`, which renders a native `<button>` and has no `href` | **Missing — found by a human building it**  |
| 4   | Extraction ↔ generated HTML                         | Mostly discharged by testing the generator; plus a cheap runtime assertion | A generator bug: an element whose attributes do not match its instance record                                                                                                 | Planned                                     |
| 5   | HTML ↔ Figma reference                              | Stage one verification                                                     | Wrong colour, spacing, typography, position, omitted region                                                                                                                   | Planned (`T-06`, `T-10`, `T-11`)            |

Two things are worth drawing out.

**A correction.** An earlier draft of this document recorded check 3 as missing. It is not: the
emitted snippet is already validated against the element manifest in CI, including inherited
attributes, boolean misuse and enum values, and the Figma-to-attribute name correspondence is
validated separately. Both run on every pull request. Between them, a mapping cannot emit an
attribute the component does not have, and cannot quietly wire the wrong property to it.

**What is genuinely missing is completeness — check 3c.** Every existing check validates what a
mapping _emits_. Nothing enumerates the Figma component's property surface and asks what the
mapping _never read_. If a Figma component gains a property, or has one the template was never
written for, it is silently absent from every snippet and no check fires: the emitted attributes
are all valid, the names all correspond, and the result is quietly incomplete.

That is exactly the "looks right, wrong underneath" class, and it is the design system team's
identical-mapping goal stated as a check. The remedy is to require each mapping to account for
every property the component exposes — read it, or declare it deliberately ignored — which is the
same node-accounting discipline the coverage metric applies to a design, pointed at a component.

**Check 3d is the one a human found.** Every automated check passed on that mapping: `fill`,
`shape`, `size` and `variant` are legal `sl-button` attributes, and each Figma property fed the
attribute its name implies. Nothing asks whether `sl-button` is the right component for something
that navigates. It is a third sibling to the two failure modes already recorded — the overridden
instance has the structure wrong and the appearance right, the drifted component has the appearance
wrong and the structure right, and here **both are right and the semantics are wrong**.

How to catch it, in increasing cost:

- **A generated review table, read once by a person.** Every mapping listed with its Figma
  component, its code component, the element that component actually renders, and the property
  translation. The whole set is 56 rows; reading it once is an afternoon, and it catches
  wrong-component and wrong-vocabulary together. Re-read only the rows that change. This is the
  primary control and it should exist before any automation is attempted.
- **A capability assertion in the mapping.** The mapping declares what it renders as — a button, an
  anchor, an input — and a check compares that against what the Figma component's own interaction
  data implies. Cheap once the declaration exists; the cost is adding the declaration to 56 files.
- **Figma prototype links as a signal.** A node wired to navigate in a prototype is a link. Where
  that data exists it is strong evidence, and where it does not its absence proves nothing — so it
  can only ever flag, never gate.

Two further things nothing checks mechanically:

- **Whether the vocabulary translation is right.** That `Positive` should mean `success` and not
  `info` is a judgement. It cannot be validated, but it can be _surfaced_: a generated table of
  every Figma value to code value across all mappings is cheap to produce and reviewable by the
  design system team in one sitting, which is how a wrong translation gets caught.
- **The fourteen scaffolds.** No mapping means no snippet, and the pipeline halts rather than
  guessing — the right behaviour, and a coverage problem rather than a correctness one.

**Checks 3 and 5 catch disjoint classes, which is why neither replaces the other.** A rendering
check cannot see that a `div` should have been an `sl-card` when the two render identically, nor
that a hardcoded value should have been a token. Those are exactly the "looks right, wrong
underneath" errors — the class the developer will not catch by eye, and the class the design system
cares most about. Conversely, check 3 is blind to a correct component placed fifty pixels off.

**Check 4 is nearly free, and that is an argument for the whole design.** Because the HTML is
generated from the data by a pure function, correctness is established by testing the function
against fixtures rather than by inspecting each output. Every package produced afterwards is
correct by construction. This is the concrete payoff of making the data the source rather than the
HTML.

### Why near-pixel-identity is not the target, and what is

A reasonable expectation is that generating from Figma's own data should reproduce the design
almost exactly — 99.9% and upwards. It will not, and setting that as the bar would make a working
pipeline look broken.

**Structured data determines intent. It does not determine rasterisation.** Five differences are
irreducible, none of them a defect:

- **Text.** Figma has its own text layout engine and the browser has another. Same font, same size,
  same weight — different line breaking, different letter fitting, different hinting, different
  subpixel placement. Two engines do not agree to the pixel on text, ever.
- **Anti-aliasing** of curves, corner radii and borders differs between renderers.
- **Effects.** Shadows, blurs and blend modes composite differently.
- **Images** are resampled by different algorithms.
- **The design system component itself.** When Code Connect resolves a node to `<sl-button>`, the
  browser renders the _real component_, which can legitimately differ from what the designer drew.

So the target is not one number. It is the **tiered tolerance already specified**: a layout
container at 0% because it is a solid rectangle and genuinely can be exact; a design system
instance under 0.5%; an icon under 1%; **text under 5%, which is not slack but the honest floor two
text engines impose**; shadow and blur excluded outright. A single "percent similar" figure invites
exactly the impossible expectation and hides which class failed.

**And a pixel difference has three possible causes, only one of which is a pipeline bug.**
Distinguishing them is what makes the measurement useful rather than merely alarming:

| Cause                                                       | What it means                                                          | Who acts                   |
| ----------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------- |
| The pipeline got it wrong                                   | a real defect — wrong token, wrong spacing, missing element            | pipeline                   |
| Renderer difference                                         | within tolerance by design; outside it means the tier is miscalibrated | nobody, or the bench       |
| **The Figma component has drifted from the code component** | the library and the implementation disagree                            | **the design system team** |

The third is not a pipeline failure at all, and it may be the most valuable thing the comparison
produces: a systematic difference appearing on _every_ instance of one component, across several
corpus cases, is the design system telling you its Figma library and its code have diverged. No
structural check can see that — the snippet is correct, the properties are valid, and the rendering
is still wrong. It is the exact mirror of the overridden-instance case, and it is why the screenshot
comparison cannot be dropped in favour of checking the data alone.

## Key decisions

- **Many files, one index, node id as the join key** — so a consumer reads what answers its
  question rather than the whole package.
- **Dictionaries for tokens and components** — the main size reduction, and it makes token
  compliance checkable rather than merely visible.
- **Atomic write, manifest written last, manifest is the commit point** — presence is never
  completion.
- **Input checksums per step** — distinguishes stale from done, which is what makes a partial
  regeneration after a design change possible at all.
- **Idempotent steps, one code path for resume and normal execution** — a resume path used only
  after a failure is a path that will not work when needed.
- **Property conformance stays where it already runs** — in CI against the element manifest, on
  every pull request, rather than being rebuilt at extraction time.
- **Pixel comparison is scored per element class, never as one similarity figure** — and a
  difference is triaged into pipeline defect, renderer difference, or design-system drift before it
  is called a failure.
- **Mapping completeness becomes a check** — every Figma property is read or declared ignored,
  which is node accounting applied to a component.

## Open questions / risks

1. **How fine is the split?** The layout above separates five concerns. Fewer files are simpler to
   write; more files keep reads smaller. The right granularity should follow from what the bench and
   the generator actually read, which is known once both exist.
2. **Can a mapping's Figma property surface be enumerated at all?** Check 3c depends on being able
   to ask Figma what properties a component exposes and compare that against what the mapping's
   source reads. The reading half is already solved — the mapping-name validator walks the
   TypeScript AST to find which property feeds which attribute, so the same pass can list what is
   read. The asking half needs the Figma API to expose a component's property definitions; confirm
   before planning the check.
3. **What happens when check 3c fails?** An unread property is sometimes deliberate — a Figma
   property with no code equivalent. So the check should demand a declaration, not absence: read it
   or list it as ignored, with the ignore list reviewed rather than growing quietly.
4. **Where does the package physically live**, and how is a revision addressed? Named as an open
   question in the staging analysis; it constrains nothing here, since the layout is the same
   wherever it is served from.
5. **Schema versioning across stages.** Each file carries a schema version; what a stage-two tool
   does when it meets a version it does not know — refuse, or read a subset — is unsettled. Refusing
   is safer and is the default until there is a reason otherwise.
