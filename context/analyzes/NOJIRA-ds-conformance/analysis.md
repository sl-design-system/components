---
type: analysis
schema_version: 1
id: A-NOJIRA-ds-conformance
title: What to do with a node the design system does not resolve
description: The five reasons a node fails to resolve to a design system component, which are detectable and how, and who each one belongs to
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-09-30T16:40:00Z
updated: 2026-09-30T16:40:00Z
tags: [design-system, conformance, code-connect, detached, adoption]
references:
  - https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0   # the library the mappings target, read 2026-09-30
---

# What to do with a node the design system does not resolve

## Key questions

1. Where in the flow are the Code Connect mappings used, and what happens to a node they do not
   resolve?
2. Halting on an unresolved component is right for building design system components. Is it right
   for a product design, where unresolved is the normal state?
3. "Unresolved" hides several different situations. What are they, which are mechanically
   detectable, and who does each belong to?
4. Is this part of the measurement work or its own?

Out of scope: how a detected problem is fixed. This analysis classifies and routes.

## Hypotheses

- **H1.** Unresolved nodes are one category needing one policy. *F2 finds five, landing on four
  different people.*
- **H2.** A detached instance is undetectable once detached, since it is structurally a plain frame.
  *F3 finds a signature already sitting in the repository.*
- **H3.** This is part of the intake report. *F5 finds it shares the traversal and diverges
  immediately after: the report produces numbers, this produces a diagnosis and a routing.*

## Context & background

The pipeline asks Code Connect about every node before anything else, because a resolved node costs
a lookup and an unresolved one costs inference. Today the policy on failure is a halt:
`BLOCKED_ON_CODE_CONNECT`, with the node list, so mappings can be published and the run repeated.

That policy was designed in and for this repository, where an unmapped component genuinely means a
mapping is missing and the person who can publish it is nearby. Pointed at a product design from
another team it becomes wrong — not slightly, but categorically, because there unresolved nodes are
the normal case rather than the exception.

## Findings

### F1 — Code Connect is the first question asked of every node, and the last one that is free

Per node, in order:

1. **Resolved by the map** → take the snippet. The mapping program has run in Figma, the vocabulary
   translation is applied, the defaults are folded in. No inference, no variance, effectively no
   tokens.
2. **`null` but identifiable** → the plugin already treats three cases as connected: the node is
   named `sl-*`, a child carries a snippet, or a peer instance of the same component resolves. This
   heuristic exists and works; it should stay.
3. **Genuinely unresolved** → everything expensive begins here. This is where the policy question
   lives, and where F2's five categories apply.

The asymmetry is the whole reason this matters: step 1 is a lookup, step 3 is inference against
design data, and the proportion between them sets both the cost and the variance of a run.

### F2 — Five situations wear the same label, and they belong to four different people

| | Situation | Who it belongs to | What they should do |
|---|---|---|---|
| 1 | Instance of a design system component, mapping exists | nobody | it works |
| 2 | Instance of a design system component, **mapping missing** | design system team | publish the mapping — the fourteen scaffolds |
| 3 | **Detached** instance — was a design system component, no longer is | designer, or the design system team | re-attach if unchanged; if changed, decide whether the change is a needed variant |
| 4 | Not a design system component, **but an equivalent exists** | designer | use the component |
| 5 | Not a design system component, **no equivalent exists** | design system team | a gap in the library — roadmap input |

Treating these as one bucket is what makes an unresolved-node list unusable: it mixes a five-minute
mapping job, a designer's accident, a deliberate deviation and a genuine product gap, and offers
them to whoever happens to read it.

Categories 3 and 5 are the two the design system team most wants and currently cannot see. Category
4 is the adoption problem stated precisely.

### F3 — Detached instances are detectable, and the signature is already in the repository

A detached instance loses its component identity and becomes an ordinary frame, which is why it
looks undetectable. But detaching does not rename anything: **the internal layer structure
survives**, and that structure is exactly what the mappings navigate — `Button-Variants`,
`Button-Base`, `badge-base-${size}`, `Base/Icon`.

So the mapping programs are, incidentally, **a signature library for the components they map**. The
same file that tells the pipeline how to read an attached button describes the shape a detached one
still has. Recognising category 3 is matching a node's inner structure against those signatures —
no new knowledge required, only a second use of knowledge already written down and already
maintained, since a mapping that drifts from the Figma structure fails loudly in CI.

Once a candidate is recognised, the follow-up question splits it in two:

- **Detached and visually identical** to the component it came from → almost certainly an accident.
  High-value, cheap to fix, and the kind of thing nobody finds by looking.
- **Detached and modified** → a deliberate deviation. The useful output is not "this is wrong" but
  *what changed*, which is a geometry and pixel comparison against the component — the same
  machinery the bench already builds, pointed at a different reference.

### F4 — Category 4 is a different and much weaker problem, and should be scoped as such

"Could have used a design system component and did not" has no structural signature. A button drawn
from scratch shares nothing with `sl-button` except looking like a button. Detecting it means
matching on appearance and role rather than on structure, which is inference — the expensive,
variable kind this work otherwise tries to remove.

That does not make it worthless; it makes it a different confidence class. A report that says
"these nine frames resemble components you already have" is useful as a prompt for human review and
harmful as a gate. **It should never block anything, and it should carry its uncertainty in the
output** rather than being listed beside the detached instances as though both were equally certain.

Sequencing follows: categories 2, 3 and 5 are mechanical or near-mechanical and worth doing first;
category 4 is a later, softer layer built on the same traversal.

### F5 — This shares a traversal with the intake report and diverges immediately after

The intake report (`T-NOJIRA-figma-to-code-03`) walks the node tree against the Code Connect map and
produces figures: the resolution rate, the detached count, the bound-variable ratio, the unmapped
components ranked by cross-team demand. That is the measurement.

What this analysis describes is the layer above: **classifying why each unresolved node is
unresolved, and routing it to whoever can act.** Same walk, different output — a diagnosis rather
than a number, and a list addressed to four different people rather than one aggregate.

Keeping them separate is deliberate. The report is a dependency of the measurement slice and has to
land with it; the classification is larger, involves a heuristic layer of varying confidence, and
has its own audience. Folding it in would widen a slice whose acceptance is deliberately narrow —
and the reason for that narrowness is on record.

### F6 — The halt policy becomes a mode, and the mode already exists

Halting on an unresolved component is correct when the fix is to publish a mapping. It is wrong
when the design legitimately contains things the design system does not cover.

That distinction is already modelled: strict and as-is scoring modes over one measurement
(`T-NOJIRA-figma-to-code-12`). The same lever governs the halt:

- **Strict** — an unresolved component instance is a defect; the run stops with the node list. The
  design system team's mode, and the current behaviour.
- **As-is** — an unresolved node is reproduced from its design properties, counted, and reported as
  part of the non-design-system fraction. The product developer's mode, and the reason the split
  exists.

In both modes the classification runs and is reported. Mode governs **what stops the run**, never
what gets measured — a strict run and an as-is run over the same design should produce the same
diagnosis and differ only in their verdict.

## What would change our mind

- **Figma exposes detachment directly.** If a detached instance retains any marker of its origin,
  F3's structural matching is unnecessary and category 3 becomes trivial. Worth checking before
  building the signature matcher.
- **Layer structure does not survive detachment in practice.** The signature approach rests on
  designers not renaming layers after detaching. If they routinely do, recall drops and category 3
  degrades towards the same weak confidence as category 4.
- **Category 4 turns out to be rare.** If product designs mostly either use the design system or
  deviate visibly, the expensive similarity layer buys little and should be dropped rather than
  postponed. The intake report's first run across the eleven team files answers this.
- **The design system team does not want category 5.** It is offered here as roadmap input; if gap
  collection already happens another way, the pipeline should not duplicate it.

## Conclusion / recommendation

**Code Connect is asked first, for every node, in stage one.** It is the cheapest answer available
and the only authoritative one. Everything else in this analysis concerns what happens when it says
nothing.

**Replace one halt policy with a mode plus a classification.** Strict mode keeps today's behaviour;
as-is mode reproduces and reports. In both, every unresolved node is classified into one of the five
categories and routed to the person who can act on it. An unresolved-node list that does not say
*why* is the least useful artifact the pipeline could produce, because it costs its reader the
diagnosis every single time.

**Do this as its own plan, and sequence it by confidence.** Categories 2 and 5 fall out of the
traversal almost for free. Category 3 needs the signature matcher, which is a second use of the
mappings and should be built next. Category 4 is a softer similarity layer, built last, reported
with its uncertainty, and never used as a gate.

**Do not fold it into the measurement slice.** It shares that slice's traversal and depends on it,
but it is larger, carries a heuristic layer, and has a different audience. The reason for keeping
the measurement slice narrow is on record and applies here.

**One thing to check before planning any of it:** whether Figma exposes component-set property
definitions and any residue of detachment. Both F3 and the mapping-completeness check depend on
questions only the API can answer, and both are cheap to confirm and expensive to assume.

## Open questions

1. **Does Figma retain any marker on a detached instance?** Decides whether F3 needs structural
   matching at all.
2. **Do layer names survive detachment in practice**, in these teams' files? Determines the recall
   of the signature approach, and is answerable by looking at two or three real designs.
3. **What should as-is mode emit for an unresolved node** — plain markup reproducing the design, or
   a placeholder the developer must complete? Reproducing is more useful and risks looking finished
   when it is not.
4. **Who receives the routed findings, and how?** Four audiences implies four destinations, and a
   report that lands nowhere is the same as no report.
5. **Does the design system team want category 5 as roadmap input**, or does gap collection already
   happen elsewhere?

## Leads to

- Its own plan, not yet written — sequenced after the measurement slice, whose intake report
  (`T-NOJIRA-figma-to-code-03`) it builds on.
- Related: [`ARCH-handover-package`](../../architecture/NOJIRA-figma-to-code/handover-package.md)
  for how Code Connect is used per node, and
  [`A-NOJIRA-figma-to-code`](../NOJIRA-figma-to-code/analysis.md) for the two scoring modes.
