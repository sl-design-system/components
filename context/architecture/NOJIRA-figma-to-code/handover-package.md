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
updated: 2026-09-30T15:40:00Z
tags: [architecture, package, schema, resumability, verification]
---

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

| | `custom-elements.json` | `*.figma.ts` |
|---|---|---|
| What it is | data — a declaration of what the code component accepts | a program that resolves one Figma instance into a snippet |
| Produced by | generated from source by `build-metadata.js` | hand-authored per component |
| Knows | attribute names, types, enum values, inheritance | Figma property names, Figma inner structure, the Figma↔code vocabulary, the defaults |
| Which side | the code only | the bridge |
| When it runs | never — it is read | at resolution, against a live instance |

### Verification chain — five checks, five places

The question "where do we check that properties match?" has five answers, because there are five
distinct things that can disagree. Putting a check in the wrong place is how an error surfaces to
the person least able to fix it.

| # | Check | Where it runs | What it catches | Status |
|---|---|---|---|---|
| 1 | Code Connect mapping ↔ `custom-elements.json` | CI, on every pull request | A mapping referencing an attribute the component does not have, inherited attributes included | **Exists** — Diana's snippet validator |
| 2 | Figma ↔ extraction | Stage one, at extraction | A misread or dropped node; non-determinism. Verified by extracting twice and diffing bytes | Planned (`T-02`) |
| 3 | Emitted snippet ↔ `custom-elements.json` | CI, on every pull request | An attribute the component does not have, a boolean carrying a value, an enum value outside the declared set | **Exists** — Diana's snippet validator |
| 3b | Figma property name ↔ code attribute name | CI, on every pull request | A mis-wiring: one Figma property feeding the wrong attribute, with an allowlist for deliberate exceptions | **Exists** — Diana's mapping-name validator |
| 3c | **Figma property surface ↔ what the mapping reads** | Nowhere | A Figma property the mapping never reads, so it is silently dropped from every snippet | **Missing — the real gap** |
| 4 | Extraction ↔ generated HTML | Mostly discharged by testing the generator; plus a cheap runtime assertion | A generator bug: an element whose attributes do not match its instance record | Planned |
| 5 | HTML ↔ Figma reference | Stage one verification | Wrong colour, spacing, typography, position, omitted region | Planned (`T-06`, `T-10`, `T-11`) |

Two things are worth drawing out.

**A correction.** An earlier draft of this document recorded check 3 as missing. It is not: the
emitted snippet is already validated against the element manifest in CI, including inherited
attributes, boolean misuse and enum values, and the Figma-to-attribute name correspondence is
validated separately. Both run on every pull request. Between them, a mapping cannot emit an
attribute the component does not have, and cannot quietly wire the wrong property to it.

**What is genuinely missing is completeness — check 3c.** Every existing check validates what a
mapping *emits*. Nothing enumerates the Figma component's property surface and asks what the
mapping *never read*. If a Figma component gains a property, or has one the template was never
written for, it is silently absent from every snippet and no check fires: the emitted attributes
are all valid, the names all correspond, and the result is quietly incomplete.

That is exactly the "looks right, wrong underneath" class, and it is the design system team's
identical-mapping goal stated as a check. The remedy is to require each mapping to account for
every property the component exposes — read it, or declare it deliberately ignored — which is the
same node-accounting discipline the coverage metric applies to a design, pointed at a component.

Two further things nothing checks, both worth naming because neither is mechanical:

- **Whether the vocabulary translation is right.** That `Positive` should mean `success` and not
  `info` is a judgement. It cannot be validated, but it can be *surfaced*: a generated table of
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
