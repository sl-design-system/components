---
type: analysis
schema_version: 1
id: A-NOJIRA-pipeline-staging
title: Splitting the pipeline in two, and what the intermediate representation should be
description: Whether to stage Figma-to-HTML and HTML-to-application separately, and whether rendered HTML alone can serve as the source of truth between them
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-09-30T11:30:00Z
updated: 2026-09-30T11:30:00Z
tags: [architecture, pipeline, intermediate-representation, traceability, design-to-code]
references:
  - git+ssh://git@bitbucket.org/sl-technology/sl-aipdlc-toolkit.git   # sl-ds-html-to-figma, evidence on what survives a DOM round trip, read 2026-09-30
---

# Splitting the pipeline in two, and what the intermediate representation should be

## Key questions

1. Should the pipeline be split into **Figma → HTML** and **HTML → application**, with a durable
   artifact between them, rather than going from a design to finished components in one pass?
2. If it is split, what is the artifact between the stages? Rendered HTML, the cached Figma
   extraction, or something else?
3. The stated worry: once an artifact becomes the source of truth, any deviation in it degrades
   everything downstream. Is that avoided by making the first stage accurate enough, or does it need
   something structural?
4. What does the split change about work already planned?

Out of scope: how the second stage maps onto an application architecture. That becomes answerable
once this analysis settles what it receives.

## Hypotheses

- **H1.** The choice is HTML *or* cached Figma data. *F3 and F4 reject the framing: they are
  different kinds of artifact — one is a result, the other is intent — and the failure modes of
  dropping either are different and both severe.*
- **H2.** A sufficiently accurate first stage removes the cascade risk. *F4 contradicts this. Accuracy
  reduces how often the cascade starts; it does nothing about it being irreversible once it does.*
- **H3.** Splitting adds a stage and therefore adds cost. *F1 finds the opposite for the thing that
  actually costs — each half becomes separately testable, and an untestable pipeline is what has
  been expensive so far.*

## Context & background

The pipeline as it stands goes from a Figma node to finished framework components in one run,
deciding along the way both what the design *is* and how it should be *structured as code*.
[`A-NOJIRA-figma-to-code`](../NOJIRA-figma-to-code/analysis.md) found that the second of those
decisions — the component decomposition — is the largest single source of run-to-run variance, and
that it is made unreviewed because the approval checkpoint the pipeline's own vision specified was
removed.

The proposal examined here is to split the run: first produce HTML that reproduces the design as
closely as possible, with all the caching, validation and comparison against Figma already planned;
then treat that HTML as the input to a separate stage that fits it to an application — mapping it
onto the architecture, checking whether a similar design already exists in code, diffing against it
where it does and building fresh where it does not.

## Findings

### F1 — The split separates two problems the current pipeline conflates, and that is why it is testable

"Does this match the design?" and "does this fit our application?" are different questions with
different evidence, different failure modes and different people who can judge them. Running them in
one pass means a bad result cannot be attributed: a wrong-looking screen might be a misread design
or a bad component split, and nothing distinguishes them.

Split, each half gets its own pass condition:

| Stage | Question | How it is judged |
|---|---|---|
| Figma → HTML | Is this the design? | Coverage and fidelity against Figma — geometry, pixels, tokens. Mechanical, already planned. |
| HTML → application | Does this fit our application? | Architecture conformance, reuse of what already exists, framework idiom. A different kind of judgement. |

This is what makes the whole thing repeatable rather than merely accurate: repeatability requires
that a difference be attributable, and attribution requires stages with separate verdicts.

It also resolves a conflict recorded separately. The backlog analysis found four requirements
demanding interactivity in direct contradiction with the pipeline's deliberate autonomy. The split
dissolves the contradiction rather than compromising on it: stage one is mechanical and should be
fully autonomous; stage two is where architecture is decided, and a review gate belongs there
naturally. The removed decomposition checkpoint returns in the stage that actually needs it.

### F2 — HTML is the right pivot, for reasons that are specific and not interchangeable

Four properties make it a good intermediate artifact, and no other candidate has all four:

- **It renders.** It can be pixel-compared against the Figma reference directly, so the first
  stage's verification loop is natural rather than indirect. Any non-rendering artifact has to be
  verified by proxy.
- **It is inspectable by a person** in a browser, without tooling and without reading JSON.
- **It is the same medium as the output.** The design system is web components, so stage two is a
  transformation within one medium rather than a translation across two.
- **It is diffable against what already exists.** Stage two's "is a similar design already in the
  code?" compares rendered markup against rendered markup — and that is the machinery the
  measurement layer is already building.

There is also precedent in-house: `sl-ds-html-to-figma` runs this pivot in reverse, rendering a page
headlessly and mapping the resulting DOM onto design system components and token variables. The
mapping-from-HTML step is not speculative; it has been built once already, in the other direction.

### F3 — HTML discards intent, and we have in-house evidence of exactly which intent

This is the finding that decides the question, and it comes from our own reverse-direction skill.

`sl-ds-html-to-figma` has to **infer which containers can become real auto-layout**. It must infer
this because HTML does not carry it: Figma's layout intent — whether a frame hugs its contents,
fills its parent, or is fixed — is compiled away into concrete computed values by the time anything
renders. That inference step exists precisely because the information was destroyed.

What is lost in a Figma → HTML pass, concretely:

| Lost | Consequence downstream |
|---|---|
| Hug / fill / fixed layout intent | A design frame that hugs its content becomes a fixed width. This is **R25** — responsive output — and if HTML is the only truth, it is not merely unimplemented but **unrecoverable**: nothing downstream can know the 429px was "as wide as its content" rather than "429px". |
| Which bound variable produced a value | `16px` and `var(--sl-size-200)` render identically. Without the binding, token compliance cannot be checked and a token rename cannot be propagated. |
| Component instance properties | A rendered button shows its result, not that the instance was `variant=primary, size=lg`. This is exactly the design system team's "identical mapping" goal. |
| Node identity | Nothing connects a rendered element to the Figma node it came from. |

Every one of these is recoverable **if the HTML is written to carry it** — `sl-*` custom elements
rather than `div`s where Code Connect resolves, `var()` references rather than literals, a
`data-figma-node` attribute on each element. But hug-versus-fixed has no natural place in HTML at
all, and that is not a gap that careful authoring closes.

### F4 — The cascade worry is correct, and accuracy is not the defence against it

The concern raised — that once HTML is the source of truth, every deviation degrades everything
after it — is right, and it is worth being precise about why, because the obvious response is the
wrong one.

Making stage one more accurate reduces how *often* a deviation occurs. It does nothing about what
happens *when* one occurs. If the HTML is the only truth, then a stage-one error is indistinguishable
from a design decision the moment stage one finishes. Nothing downstream can tell them apart, nobody
re-checks, and the error is permanent — it has been promoted to fact.

The structural defence is not perfection, it is **retained provenance**: the intermediate artifact
keeps a verified link back to Figma, so any part of it can be re-derived and re-checked at any later
point. With provenance, a stage-one error is a correctable defect with a measurable size. Without it,
the same error is a silent permanent one.

This is also why the question "HTML or cached Figma data?" has no answer as posed. Dropping the
Figma data is what creates the irreversibility the question is worried about.

### F5 — Stage two's most valuable capability reuses machinery already being built

"Check whether a similar design already exists in the code, and if so find the differences" is the
part of the proposal with the highest practical value — it is the difference between a pipeline that
grows a codebase and one that duplicates it.

It is also, mechanically, a diff between a rendered candidate and rendered existing components, over
DOM geometry and computed style. That is the same comparison the measurement layer performs against
a Figma reference, pointed at a different target. The reverse-direction skill already resolves
elements partly by searching existing screens, so the pattern has precedent.

This is worth knowing before stage two is planned: much of it is a second consumer of slice 1's
output rather than new machinery.

### F6 — The split strengthens the planned measurement work rather than displacing it

The measurement layer measures whatever generator runs. If the first stage becomes Figma → HTML, the
layer measures that — coverage and fidelity of HTML against the Figma reference — and it becomes
*more* central, not less, because the stated precondition for the whole architecture is that stage
one is close enough to Figma to be trusted as truth.

That precondition is not an aspiration; it is a measurement with a threshold, and slice 1 is what
produces it. **The baseline is the evidence that decides whether HTML-as-truth is viable at all.**
If stage-one fidelity turns out to sit far below what the composite can reach, then promoting its
output to a source of truth is premature regardless of how attractive the architecture is.

No existing plan is invalidated. The measurement plan's goal, approach and scope all stand
unchanged. What changes is the roadmap: slice 2 now has a shape, and the intermediate artifact's
definition becomes its first task.

## What would change our mind

- **Stage-one fidelity turns out to be low.** If the baseline shows the first stage cannot reliably
  reproduce a design, promoting its output to a source of truth converts a fidelity problem into an
  architectural one. The split still helps — it makes the weakness visible and attributable — but
  HTML would be a checkpoint rather than a truth, with Figma remaining authoritative.
- **Annotated HTML proves unwieldy in practice.** If carrying `sl-*` elements, token references and
  node attributes makes the artifact hard to read or hard to generate reliably, the pair splits
  differently: plain HTML for rendering, and everything else in the companion artifact keyed by
  node id.
- **Stage two turns out not to need the HTML at all.** If architecture mapping proves to work better
  from the structured data than from markup, HTML becomes a verification artifact rather than the
  pivot, and the source of truth is the Figma extraction with HTML as its rendering.
- **The auto-layout loss turns out not to matter.** If designs in practice are fixed-width and
  responsiveness is decided in stage two from the application's own breakpoints, F3's central
  objection weakens considerably.

## Conclusion / recommendation

**Adopt the split.** Two stages with a durable artifact between them, each separately testable, is a
better architecture than the single pass, and it fixes by construction the attribution problem that
makes the current pipeline unrepeatable. It also puts the architecture decision — the highest-variance
step — into a stage where a human review gate is natural rather than an interruption.

**The artifact is a pair, not a choice.** The question as posed — HTML or cached Figma data — should
be answered "both, joined by node id":

- **Annotated HTML** is the *presentational* truth: what renders, what is pixel-compared against
  Figma, what a person opens in a browser, what stage two diffs against existing components. It
  should be written to carry what it can — `sl-*` custom elements where Code Connect resolves,
  `var()` token references rather than literal values, and a `data-figma-node` attribute on every
  element.
- **The retained Figma extraction** is the *intent* companion: bound variables, instance properties,
  bounding boxes, and the hug/fill/fixed layout modes that HTML cannot express at all. It is not a
  cache to be discarded after stage one; it is half the source of truth.

The node id is the join key, and it is what makes provenance real rather than nominal. That single
attribute is also, separately, the missing prerequisite for change detection and the update cycle —
neither can regenerate only what changed without knowing which output came from which node.

**Answering the cascade worry directly:** the defence is that pairing, not stage-one accuracy. With
provenance retained, any part of the intermediate artifact can be re-derived and re-checked forever,
so a stage-one error stays a correctable defect with a measurable size. Accuracy still matters and
should still be maximised — but it is the thing that reduces frequency, not the thing that prevents
irreversibility. Build the second and you can afford to iterate on the first.

**Sequence.** Slice 1 stays exactly as planned and gains a second purpose: its baseline is the
evidence that decides whether stage-one output is good enough to be trusted as truth. Defining the
intermediate artifact — the annotation scheme and the companion's schema — becomes the first task of
slice 2, written against what the baseline shows. Stage two's architecture mapping follows, and much
of its "does this already exist?" capability is a second consumer of slice 1's comparison machinery
rather than new work.

**Do not define the artifact's schema yet.** It should be written against measured knowledge of what
stage one actually preserves and loses, which is two tasks away. Guessing it now would fix the most
load-bearing contract in the architecture on the least evidence.

## Open questions

1. **Where does responsiveness get decided** — stage one from Figma's layout modes, or stage two from
   the application's own breakpoints? F3 makes this the sharpest consequence of the split, and the
   answer determines whether hug/fill intent must survive into the artifact at all.
2. **Is the HTML one document per screen, or per component?** A screen renders and compares as a
   unit; components are what stage two places. Both may be needed, which has a cost.
3. **Does stage two consume HTML, the companion, or both?** The recommendation assumes both. If it
   turns out to work from the structured data alone, HTML demotes to a verification artifact and the
   architecture simplifies.
4. **What is "close enough to Figma" as a number?** The precondition for HTML-as-truth needs a
   threshold, and it cannot be chosen before the baseline exists.

## Leads to

- No plan yet. Slice 2 is written against the baseline, and its first task defines the intermediate
  artifact. See [`plan/roadmap.md`](../../plan/roadmap.md).
- Related: [`A-NOJIRA-figma-to-code`](../NOJIRA-figma-to-code/analysis.md), whose baseline is the
  precondition this architecture rests on, and
  [`A-NOJIRA-requirement-backlog`](../NOJIRA-requirement-backlog/analysis.md), whose R7, R17 and R25
  are all affected by the node-id join key.
