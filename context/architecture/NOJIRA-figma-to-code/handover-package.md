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
updated: 2026-09-30T15:00:00Z
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

### Verification chain — five checks, five places

The question "where do we check that properties match?" has five answers, because there are five
distinct things that can disagree. Putting a check in the wrong place is how an error surfaces to
the person least able to fix it.

| # | Check | Where it runs | What it catches | Status |
|---|---|---|---|---|
| 1 | Code Connect mapping ↔ `custom-elements.json` | CI, on every pull request | A mapping referencing an attribute the component does not have, inherited attributes included | **Exists** — Diana's snippet validator |
| 2 | Figma ↔ extraction | Stage one, at extraction | A misread or dropped node; non-determinism. Verified by extracting twice and diffing bytes | Planned (`T-02`) |
| 3 | Extraction ↔ `custom-elements.json` | Stage one, immediately after extraction | A resolved instance property that does not exist on the code component, or holds a value outside its type | **Missing — the gap** |
| 4 | Extraction ↔ generated HTML | Mostly discharged by testing the generator; plus a cheap runtime assertion | A generator bug: an element whose attributes do not match its instance record | Planned |
| 5 | HTML ↔ Figma reference | Stage one verification | Wrong colour, spacing, typography, position, omitted region | Planned (`T-06`, `T-10`, `T-11`) |

Two things are worth drawing out.

**Check 3 is the one that is missing, and it is the design system team's goal stated as a check.**
"The Figma component maps identically to the code component" means precisely: the properties the
Figma instance carries resolve to attributes the code component actually has, with values it
actually accepts. It belongs at extraction, not later — failing there costs a designer a message,
while the same failure discovered in stage two costs a developer a debugging session against a
design they cannot inspect programmatically.

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
- **Property conformance checked at extraction, against the element manifest** — as early as the
  information exists, and on the side that can fix it.

## Open questions / risks

1. **How fine is the split?** The layout above separates five concerns. Fewer files are simpler to
   write; more files keep reads smaller. The right granularity should follow from what the bench and
   the generator actually read, which is known once both exist.
2. **Does the extraction reach component instance property values at all?** The whole of check 3
   depends on the Figma MCP exposing resolved instance properties, not merely the component
   identity. This needs confirming before the check is planned; if it does not, the design system
   team's identical-mapping goal needs a different instrument.
3. **What happens when check 3 fails?** Halting is right for a component the pipeline cannot
   represent, and probably wrong for a single unexpected property value. The threshold is a policy
   decision and should be explicit rather than emergent.
4. **Where does the package physically live**, and how is a revision addressed? Named as an open
   question in the staging analysis; it constrains nothing here, since the layout is the same
   wherever it is served from.
5. **Schema versioning across stages.** Each file carries a schema version; what a stage-two tool
   does when it meets a version it does not know — refuse, or read a subset — is unsettled. Refusing
   is safer and is the default until there is a reason otherwise.
