---
type: architecture
schema_version: 1
id: ARCH-fidelity-scoring
title: How a run is scored
description: The five measurement dimensions, what each can and cannot see, how they combine, and what a difference means
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-10-01T02:10:00Z
updated: 2026-10-01T14:00:00Z
tags: [measurement, fidelity, scoring, bench]
---

# How a run is scored

## Purpose

The scoring method was decided across several documents and tasks, which is fine for deciding and
poor for implementing. This is the one place that states the method as a whole: what is measured,
why each dimension exists, what it is blind to, and how a number becomes a verdict.

The tasks say what to build and when it is done. This says how the measurement works, so that
someone implementing `T-06` through `T-13` can see why each piece is shaped the way it is rather
than inferring it from acceptance criteria.

## Overview

### The five dimensions

| #   | Dimension            | Answers                                              | Deterministic?                  |
| --- | -------------------- | ---------------------------------------------------- | ------------------------------- |
| 1   | **Coverage**         | was the whole design transferred                     | fully                           |
| 2   | **DOM position**     | is everything the right size, in the right place     | fully                           |
| 3   | **Pixel comparison** | does it look right                                   | fully, within tiered tolerances |
| 4   | **Cost**             | what did the run consume                             | fully                           |
| 5   | **Variance**         | how much does the answer move between identical runs | it _is_ the measure of movement |

The first three are quality, the fourth is price, and the fifth is what makes the other four
readable. A mean without a spread cannot distinguish an improvement from noise, which is the
question this whole effort exists to answer.

### The emission boundary — which decides what is generated _and_ what is measured

Everything below depends on one rule, and getting it wrong makes every number meaningless. A
screen with 318 instance nodes has six components on it; the other 312 are those six components'
own internals. The two are not a rounding difference — they answer different questions and only one
of them is written as markup.

**The rule.** Walk the Figma tree. At each `INSTANCE`:

- **It resolves to a code component** (Code Connect returns a snippet) → **emit the snippet and stop
  descending.** Everything beneath it is the component's own business; the code component renders
  its internals itself, and writing them out would duplicate them.
- **It does not resolve** — a local component, an unmapped one, a detached frame → **emit nothing
  for the node itself, keep descending**, and treat it as a layout container whose children are
  emitted normally.

That second branch is not an edge case. On the screen measured above, a local `footer` component
had no code equivalent, so it was passed through — and the four design-system link buttons _inside_
it did resolve and were emitted. Had the rule been "only instances not nested in another instance",
those four buttons would have been silently dropped.

**Three buckets, and every node lands in exactly one:**

| Bucket                       | What it is                                                   | Emitted?                      | Measured how                  |
| ---------------------------- | ------------------------------------------------------------ | ----------------------------- | ----------------------------- |
| **Emitted component**        | an instance where descent stopped because a snippet resolved | yes, as the snippet           | position + pixels, by node id |
| **Passed-through container** | an instance or frame with no code equivalent                 | as plain markup               | position + pixels, by node id |
| **Absorbed internal**        | anything beneath an emitted component                        | no — the component renders it | **coverage only**             |

This is also the coverage accounting: an absorbed internal is _accounted for_ — it is covered by its
parent — without ever appearing in the output. A node that is neither emitted, passed through, nor
absorbed is unaccounted, and that is the omission coverage exists to catch.

**Two consequences that would otherwise produce false failures.**

_Position is measured at the boundary, not below it._ An absorbed internal has no DOM counterpart of
its own to compare against: the code component's shadow DOM is structured however its author chose,
and there is no reason it should mirror the Figma component's layer tree. Comparing them would
generate noise proportional to how well-built the component is. So geometry is compared for emitted
components and passed-through content only — which is also why the correspondence problem is
smaller than it first appears: six comparisons, not 318.

_Token compliance is measured at the boundary too._ Most bound variables in a subtree sit inside
components, and those are the component's own styling — they must **not** appear in generated CSS.
Comparing every bound variable in the Figma subtree against the tokens in generated CSS would show
a enormous false mismatch. Only tokens on passed-through containers and on emitted components'
_own_ properties are the generator's responsibility.

### Coverage — the cheapest and the one nothing else replaces

Every node in the Figma tree is placed in exactly one bucket: **mapped** to a design system
component, **rendered** as markup, **explicitly skipped** under a documented rule, or
**unaccounted**. Coverage is the accounted share, and the report names every unaccounted node
ordered by area.

It exists because **pixel comparison is structurally blind to omission**: a section that was never
rendered has nothing to diff against, so a screen missing a whole panel can still score well on
everything else. No other dimension can see that.

The honesty of the denominator is the whole game. Every skip is attributed to a written rule, and
the report states how many nodes were skipped and under which rule, so the denominator cannot be
quietly shrunk until coverage looks good.

### DOM position — the sharp one

For each accounted element, the rendered rectangle is compared against the Figma bounding box on
all four measures, with a stated tolerance. The score is the passing share; the report names every
failure with its four deltas.

This is the sharpest signal available: fully deterministic, no image comparison, and it localises a
failure to a **named element** rather than to a region of pixels. It also subsumes most of what the
current pipeline asks a model to notice by eye — element width against its container, child inset
per side, shared edges across rows are all arithmetic on rectangles, and computing them removes the
variance that asking produces.

**Its weak link is correspondence.** Both this and coverage need to know which DOM element came
from which Figma node, and the current pipeline emits nothing that says so. Until output carries a
node reference, the bench infers the correspondence from geometry and content — which works, is
imperfect, and is the single largest source of uncertainty in the measurement itself. If the
baseline shows the inference is unreliable, making the pipeline emit a node reference is the first
increment to make, ahead of anything visual.

### Pixel comparison — and why near-identity is not the target

Element-level screenshots against the Figma reference, with thresholds **tiered by element class**:
a layout container at 0% because it is a solid rectangle and genuinely can be exact, a design
system instance under 0.5%, an icon under 1%, text under 5%, shadow and blur excluded outright.

Text at 5% is not slack. Figma has its own text layout engine and the browser has another, so line
breaking, letter fitting, hinting and subpixel placement differ; two engines do not agree to the
pixel on text. Anti-aliasing, effect compositing and image resampling differ for the same reason.
**A single "percent similar" figure invites an impossible expectation and hides which class
failed**, which is why the score is always reported per class.

A difference has three possible causes and only one is a pipeline defect. Triaging them is what
makes the number useful:

| Cause                                               | Meaning                                                           | Who acts                   |
| --------------------------------------------------- | ----------------------------------------------------------------- | -------------------------- |
| Pipeline error                                      | wrong token, wrong spacing, missing element                       | pipeline                   |
| Renderer difference                                 | within tolerance by design; outside it, the tier is miscalibrated | nobody, or the bench       |
| **Figma component drifted from the code component** | the library and the implementation disagree                       | **the design system team** |

The third is the mirror of the overridden-instance case: there the structure is wrong while the
appearance is right; here the appearance is wrong while the structure is right. A systematic
difference on every instance of one component across several cases is the design system telling
you its library and its code have diverged — and no structural check can see it, because the
snippet is correct and the properties are valid.

### Cost — the third axis

Tokens by model tier and by pipeline stage, plus wall-clock per stage, recorded at the tier each
stage **actually ran at** rather than the one configured. Cost carries its own spread, because a
cost comparison against a single run is as misleading as a quality one.

This is what turns "use the cheapest model that does the job" from an opinion into an experiment:
swap the tier, rerun, read the two deltas together. **A change that leaves quality inside its
measured spread while reducing cost is an improvement**, and nothing could express that before.

### Variance — the metric the effort exists for

Every figure above is produced three times on identical input, and reported as a mean with its
spread. A case whose spread exceeds a limit is labelled unstable **before** its mean is quoted,
because a mean from an unstable case invites a conclusion it cannot support.

The rule that follows, and the one most likely to be forgotten under pressure: **a delta smaller
than the combined spread is not a change.** A comparison that does not quote the spread is not
evidence — and this is exactly the tool people reach for when they want to justify a change they
already favour.

### How a verdict is formed

Per case and per dimension: both means, both spreads, the delta, and one of **better**, **worse**
or **indistinguishable** — stated in words, not left as two numbers for a reader to interpret
favourably. The cost delta sits beside the quality delta so a trade is visible as a trade.

Every result carries its identity: the pipeline commit, the corpus freeze stamp, the scoring mode,
and the tier and effort per stage. A comparison across different freeze stamps is **refused**, not
answered — the corpus changed, so there is no delta to report.

### What renders the case under test

The pipeline boots the repository's Storybook to render what it generated. For the bench that is
the wrong instrument, and the smoke run showed why concretely: the repo-wide Storybook loads every
component story, 33 of which import Font Awesome Pro packages from a private registry. The run was
blocked at Stage 4 by a credential that **nothing in the case under test needs** — the example app
depends on Font Awesome not at all, and neither does the generated code.

A measurement harness that can be blocked by an unrelated dependency of an unrelated story is not
a measurement harness. The bench should render the case under test in a **minimal harness** that
loads only that case: faster to boot, unaffected by the rest of the repository, and deterministic
in a way a shared Storybook with hundreds of stories cannot be. It also removes a whole class of
false failure, where a red run means somebody else's story broke.

## Key decisions

- **The emission boundary is where a Code Connect snippet resolves** — descend through anything
  that does not resolve, stop at anything that does.
- **Position and token compliance are measured at that boundary**, never on absorbed internals.
- **The bench renders in a minimal harness**, not the repository's Storybook — an unrelated story's dependency must never be able to fail a measurement.
- **Coverage before fidelity**, because omission is invisible to everything else.
- **Tolerances tiered by element class**, never one similarity figure.
- **A difference is triaged into three causes** before it is called a failure.
- **Variance is reported with every figure**, and an unstable case is labelled before it is quoted.
- **Cost sits beside quality**, so tier changes are decided on evidence.
- **Comparisons across a corpus refresh are refused** rather than answered.

## Open questions / risks

1. **Node correspondence is inferred.** Until the pipeline emits a node reference, coverage and
   position both rest on matching DOM elements to Figma nodes by geometry and content. This is the
   measurement's own weakest point and the baseline should report how confident the matching was,
   not only the scores derived from it.
2. **The tiers are calibrated from the prior attempt, not from this corpus.** The first baseline is
   also the first evidence about whether 0.5% and 5% are the right numbers here; expect to adjust
   them once, deliberately, and to record that the adjustment happened.
3. **Composite weighting is unset on purpose.** Weights chosen before any measurement exists are
   guesses; the per-dimension breakdown is what is read until there is reason to collapse it.
