---
type: analysis
schema_version: 1
id: A-NOJIRA-designer-workflow
title: The designer handover contract — which direction, at what cost, and how the flow itself gets tested
description: What designers hand over to the generation pipeline, what each direction costs in tokens and Figma seats, and how to test the working model rather than only the generated code
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-09-30T09:40:00Z
updated: 2026-09-30T09:40:00Z
tags: [design-to-code, designers, figma, prototypes, cost, workflow, testing]
references:
  - git+ssh://git@bitbucket.org/sl-technology/sl-aipdlc-toolkit.git   # sl-prototype, sl-plan-design, sl-ds-html-to-figma skills, read 2026-09-30
  - https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0   # the token variables the reverse direction binds against, read 2026-09-30
---

# The designer handover contract — which direction, at what cost, and how the flow itself gets tested

## Key questions

1. What does a designer actually hand over — a Figma file, an HTML prototype, or something else —
   and is one of those *the* contract, or is the right answer different per kind of work?
2. What does each direction cost: in tokens, in Figma licensing, and in API limits? Where does cost
   make a direction impractical rather than merely expensive?
3. What does a designer's working session look like in each direction, and where does it break?
4. How do we test **the flow** — the working model between designer and pipeline — as distinct from
   testing the code the pipeline generates?

Out of scope: the fidelity of generated code, which is
[`A-NOJIRA-figma-to-code`](../NOJIRA-figma-to-code/analysis.md); and the content of the design
system itself.

## Hypotheses

- **H1.** One handover format has to be chosen, and the choice is between Figma and HTML. *F1 and F2
  contradict this: three contracts already exist, they are directions rather than alternatives, and
  the cheapest of them is neither Figma nor HTML.*
- **H2.** If a design system is attached to a design canvas, the designer's output will use it.
  *F6 refutes this with a measurement from a live project.*
- **H3.** Testing the flow means measuring the generated output. *F5 and F7 split this into two
  different activities with different methods; conflating them is why the working model currently
  goes untested.*

## Context & background

This analysis was commissioned alongside the measurement work, on the observation that generating
designs is expensive, that Figma imposes limits, and that a Figma Dev seat costs money — so the
handover contract cannot be chosen on ergonomics alone.

**A source gap worth recording.** A meeting transcript was supplied as input, on the understanding
that it contained a presentation by Daniel Dykszak covering this subject. It does not. The transcript
covers 0:00–1:19 and 54:05–55:22; the intervening fifty-three minutes, which held both scheduled
sessions, are absent. The only substantive content present is Zenobia Gawlikowska's report on the
sandbox: agent mode in VS Code connects to it successfully, but authentication has to be re-accepted
per session, which she named as the first real friction. Nothing in the available portion addresses
designers, handover formats, Figma limits or seat costs. Every finding below is therefore drawn from
the toolkit's own skills and from what was stated directly; nothing is attributed to that
presentation, and recovering its content remains an open question.

## Findings

### F1 — Three handover contracts already exist, and they are directions rather than alternatives

| Direction | Mechanism | What it is for |
|---|---|---|
| Figma → code | the `implement-design` plugin, and the prior `sl-ds-*` skills | A design that already exists in Figma, drawn against the design system, becomes components |
| HTML → Figma | `sl-ds-html-to-figma` | A prototype built fast outside Figma becomes real design work — component instances and bound token variables — so it can be maintained by designers afterwards |
| Prototype folder ↔ canvas | `sl-prototype` and `sl-plan-design` | Exploration, before anyone knows what the screen should be. Neither Figma nor HTML is the contract here |

Framing this as "Figma or HTML" is the wrong question. Each direction answers a different one: the
first assumes the design is settled, the second assumes it was explored elsewhere and must be brought
back, the third assumes it is not settled at all.

### F2 — In the existing designer flow, the contract is a folder, not a file format

`sl-prototype` opens `prototypes/<JIRA>-<slug>/`, seeds a plain-markdown `context.md` with no
frontmatter — deliberately, so a designer never meets a schema error — and the design canvas is
pointed at that folder. The toolkit is explicit that this is the whole integration: *"no export step,
no mirrored working directory, and nothing to keep in sync: one folder, named after the ticket,
readable from both sides."*

The built prototype does not live in the repository at all; it is runnable code, and the canvas
project's URL is the only pointer kept.

This matters for the cost question in F3: in this direction, the repository side stores text and the
canvas does the generative work, so the cost we would pay is close to zero.

### F3 — Cost is asymmetric across the three directions, and one of the figures is already recorded

`sl-ds-html-to-figma` declares a token budget of **40–90K per screen** and runs on the most expensive
model tier, because building into Figma is mechanically involved: render the page headlessly, extract
a DOM tree with inline text flows merged into editable paragraphs, decide which containers can become
real auto-layout, map elements onto design system components, create local components for confirmed
gaps, build unit by unit, then verify. That is the most expensive of the three directions by a wide
margin, and it is expensive per screen, so cost scales with the size of the handover.

Figma → code cost is not yet known per run; it becomes measurable as a by-product of
`P-NOJIRA-figma-to-code`, which records the pipeline commit and the run for every corpus case.

The prototype-folder direction costs almost nothing on our side, because the generative work happens
in the canvas rather than in our agent session.

The conclusion is not that one direction is too expensive. It is that **cost is per screen and
differs by an order of magnitude between directions**, so the handover contract should be chosen per
piece of work, and an organisation-wide "we use X" decision would be paying the highest price on the
work that least needs it.

### F4 — A Figma Dev seat cannot write to Figma, which removes a direction rather than slowing it

`sl-ds-html-to-figma` names this as a hard stop: it must not be used when *"the runner lacks edit
permission on the target Figma file (Dev seat = read-only → skill stops with a clear message)"*.

So the seat question is not only a budget line. A Dev seat is sufficient for Figma → code, which
reads, and insufficient for HTML → Figma, which writes. Anyone expected to run the reverse direction
needs a full design seat. Any plan that assumes developers can push prototypes back into Figma on
their existing seats is wrong by construction, and it fails at the point of use rather than at
procurement.

The actual seat inventory and its cost are not established here — see Open questions.

### F5 — An independent artifact already ranks completeness above pixel comparison

The reverse direction verifies in a stated order: **content completeness as the primary gate**,
overflow as a gate, and **pixel diff as a secondary signal only**.

That ordering was arrived at independently, on the opposite direction of the same pipeline, and it
matches what `A-NOJIRA-figma-to-code` concluded for the forward direction: coverage first, because a
thing that was never rendered has nothing to diff against. Two independent derivations of the same
ordering is the strongest evidence available that it is right, and it means one principle governs
both directions rather than each needing its own.

### F6 — Attaching the design system to a canvas does not mean the design system gets used

The toolkit records a measurement from a live project: the token stylesheets were linked, **not one
token was referenced**, and half the screen's colours came from outside the palette. Its conclusion —
*"`Components used: none` is a real answer, and often the right one. Record what is there, not what
was intended"* — is a warning written from experience.

The consequence for the design system team is direct. Adoption cannot be inferred from setup. It has
to be measured on the artifact, which is exactly the intake report already planned as
`T-NOJIRA-figma-to-code-05`; this finding extends its remit from Figma files to canvas-built
prototypes, which are a second population where adoption is assumed rather than known.

### F7 — Rules for testing a design flow already exist, and they are about human validation, not code

`sl-plan-design` encodes rules whose purpose is making a prototype *testable with people*:

- **The fourth state must not exist.** Every element that looks clickable is either wired or visibly a
  stub. One that looks like a feature and silently does nothing is read by a validation session as a
  defect in the concept, and the session is spent on it instead of on the question.
- **Seed anything random.** Measured on one real screen: four call sites drawing content with
  `Math.random()`, so two viewers saw different screens — which silently invalidates comparing what
  they saw.
- **Stubs must look like stubs**, or they get validated as if they were real.
- **Phases end in answers, not artifacts**, so work can stop early without wasting what came before.
- **Absences are stated as decisions**, because silence reads as oversight to a human and as licence
  to a canvas.

These are not code quality rules and no test suite enforces them. They protect the validity of a
session with a person, which is a different failure mode from a wrong pixel — and it is the failure
mode that testing "the flow" is actually about.

### F8 — What the flow has never been subjected to is one real ticket, end to end, with a real designer

Every artifact examined describes a step. Nothing records a complete pass: a real ticket, a designer
opening the canvas against a prototype folder, a handover in one of the three directions, generation,
and a developer receiving the result. The prior attempt's handover document shows the same shape of
gap on its own side — its router and its setup and layout skills were written and never run.

Until that pass exists, every claim about how the working model *feels* to a designer is a
prediction. This is the cheapest missing evidence in the whole initiative and the only one that
cannot be obtained by building anything.

## What would change our mind

- **Designers reject the folder-as-contract model.** If a designer finds pointing a canvas at a
  markdown folder alien compared with working in Figma, the third direction loses its cost advantage
  because it will not be used. Only a real session answers this.
- **The reverse direction's cost turns out acceptable at scale.** If 40–90K per screen is affordable
  for the volume actually involved, the argument for choosing a direction per piece of work weakens
  and a single Figma-centred contract becomes viable and simpler.
- **Full design seats turn out to be cheap or already held.** F4's constraint then stops shaping the
  decision, and the reverse direction becomes available to everyone rather than to a few.
- **Daniel's session already settled some of this.** The material was unavailable; if it contains a
  decision or a measurement, it supersedes the corresponding finding here rather than being merged
  into it.

## Conclusion / recommendation

**Do not choose a single handover contract.** The three directions answer different questions and
differ in cost by an order of magnitude. Publish them as three named flows with an explicit
when-to-use, so a team picks by what the work is: settled design in Figma, prototype needing to
become maintainable design work, or exploration where nothing is settled yet. A single
organisation-wide format would pay the highest price on the work that needs it least, and F4 means it
might not even be executable by the people expected to run it.

**Treat the seat constraint as an architectural fact, not a budget item.** A Dev seat reads and
cannot write. Any flow requiring a write to Figma is available only to full seats, and that has to be
stated where the flow is chosen rather than discovered when a skill halts.

**Measure design system adoption on the artifact, in both populations.** F6 shows setup does not imply
use, and the intake report planned as `T-NOJIRA-figma-to-code-05` is the instrument. Extend its remit
to canvas-built prototypes, which is a second population where adoption is currently assumed.

**Split "testing the flow" into two activities that are currently conflated.**

*Testing the pipeline* is measurement, and it is already planned: coverage, fidelity and run-to-run
variance over a frozen corpus. F5 confirms the ordering — completeness before pixels — holds in both
directions, so it is one principle rather than two.

*Testing the working model* is a rehearsal, not a metric. Take one real ticket through the whole
path — designer opens the canvas against a prototype folder, hands over in one of the three
directions, the pipeline generates, a developer receives it — and record where it stalled, what had
to be explained twice, and what someone did by hand. The output is a list of friction points, not a
score. F8 says this has never been done, and it is the cheapest evidence available in the whole
initiative because it requires building nothing.

Run the rehearsal on the **prototype-folder direction first**: it is the cheapest to run, it is the
one no one has experience with, and its viability is the largest unknown that money cannot resolve.

**Do not write a plan for this yet.** Three of the four questions depend on figures that are not in
hand — seat inventory, Figma rate limits, and the cost of the forward direction, which slice 1 will
produce as a by-product. Planning now would repeat the pattern
[`A-NOJIRA-figma-to-code`](../NOJIRA-figma-to-code/analysis.md) documents. The rehearsal is the one
action that can start immediately, and its findings are what a plan should be written from.

## Open questions

1. **Daniel Dykszak's session content.** Unavailable from the supplied transcript. Recovering it — a
   recording, slides, or a short conversation — may settle several questions here and supersede
   findings rather than confirming them.
2. **Figma seat inventory and cost.** Who holds a full design seat versus a Dev seat, and what a
   full seat costs. F4 makes this determine who can run which flow.
3. **Figma API limits in practice.** Which limits bind first — rate, file size, or plugin execution —
   and at what volume. The forward pipeline already depends on the desktop server for reliable Code
   Connect resolution, which is itself a constraint on automation.
4. **Whether designers accept the folder-as-contract model.** Unanswerable without a session.
   The first rehearsal answers it.
5. **Who runs the rehearsal, and on which ticket.** It needs a real designer and a real ticket;
   simulating either invalidates the result.

## Leads to

- No plan yet, by recommendation. The rehearsal described in the conclusion produces the evidence a
  plan should be written from.
- Related: [`A-NOJIRA-figma-to-code`](../NOJIRA-figma-to-code/analysis.md) and its measurement plan,
  whose intake report this analysis extends the remit of.
