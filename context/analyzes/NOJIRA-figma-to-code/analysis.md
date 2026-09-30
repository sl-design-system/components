---
type: analysis
schema_version: 1
id: A-NOJIRA-figma-to-code
title: Figma-to-code pipeline — why it is not repeatable and how to make it measurable
description: Investigation of the three parallel Figma-to-code workstreams, the root cause of non-repeatable output, and a measurement-first way to improve it incrementally
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-09-30T08:02:22Z
updated: 2026-09-30T09:40:00Z
tags: [figma, design-to-code, design-system, code-connect, quality, determinism, tooling]
references:
  - https://github.com/sl-design-system/components/pull/3423   # implement-design plugin, read 2026-09-30
  - https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0   # SLDS Components 2.0, Code Connect source of truth, read 2026-09-30
---

# Figma-to-code pipeline — why it is not repeatable and how to make it measurable

## Key questions

1. What exists today across the three parallel Figma-to-code efforts, and how far has each one
   actually been proven — specified, run once, or run repeatedly?
2. Why is the output not repeatable? The reported symptom is that the same Figma node does not
   produce the same visual result twice. Where does that variance originate?
3. How do we state, as a number, whether a design was transferred correctly — and how badly it
   failed when it did not?
4. The design system team needs an *identical* Figma-to-code component mapping. Product
   developers need their *existing* designs ported as they are, including the parts that do not
   use the design system. Can one pipeline serve both, and what does "correct" mean for each?
5. How do we add capability incrementally without repeating the failure mode of the previous
   attempt — 31 requirements implemented at once, with no way to tell which of them worked?

Explicitly out of scope: which framework the generated code targets (Lit and Angular are both
already supported), the commercial case for design-to-code, and the content of the design system
itself.

## Hypotheses

Going in, we believed:

- **H1.** The repeatability problem lives in visual validation — the diff step is too weak, so
  wrong output is accepted. *Findings F3 contradict this: validation is the last place the
  variance appears, not where it is introduced.*
- **H2.** More explicit rules in the agent prompts produce more consistent output. *F4 and F5
  contradict this: rule count in a prompt and output consistency are not correlated, and both
  prior attempts degraded as rules accumulated.*
- **H3.** A single fidelity score can express "was this design transferred correctly". *F6
  contradicts this for the design system team's use case: a design that deliberately does not use
  the design system scores badly on mapping while being a perfectly correct port.*

## Context & background

Three efforts are running in parallel against the same problem, with no shared measurement:

| Workstream | Owner | Where | Proven to what degree |
|---|---|---|---|
| `implement-design` plugin (Figma → Lit/Angular, 6-stage agent pipeline) | Jeroen Zwartepoorte | `tools/implement-design-plugin/` | Landed 2026-06-26 in one commit; no substantive change since; no run artifacts retained |
| Figma Code Connect mappings + snippet validation + CI report | Diana Broeders | `scripts/connect-figma-components/`, `.github/workflows/figma-code-connect.yml` | Active, iterating weekly; runs on every PR |
| `ds-*`/`sdl-*` (v1) and `sl-ds-*` (v2) skill sets | marcin.ludwig | `reference/prior-art-ds-skills/` (vendored 2026-09-30; registered at `foundation/prior-art-ds-skills.md`) | v1 specification-only; v2 run on two real designs, 12% pixel difference on first run |

The prior attempt's own handover document lists **31 requirements** with a coverage matrix and a
table of **10 unresolved problems**. That document is the single most useful input to this
analysis, because it is an honest record of what was attempted and what it cost. It is now in this
repository as `reference/prior-art-ds-skills/HANDOVER-2026-06-15.md`, alongside both frozen skill sets,
so the evidence behind every finding below can be opened without a second checkout.

Eleven product teams have supplied Figma files. Design-system adoption across them is unknown and
almost certainly uneven:

| Team | Figma file | Node |
|---|---|---|
| NSP | New-Secondary (`4TdMrcnIVOn3Hrfj2OpVZU`) | `260-8709` |
| NSP | Hypothesis-1 (`FVU1yVCdjrnULq7omrlSRm`) | `3-3076` |
| NSP | NS-fundaments (`sSrpLCZm302ces3khoBGls`) | `3-3076` |
| ETSL | Editorial-Suite-designs (`S5QgDy8X9eqhvECPANSZMM`) | file-level |
| Kampus | New content view / blended (`73YHtIYl0UHXH8ST4J7VKI`) | `12035-132465` |
| MAX | team file (`1149032477855418739`) | team-level |
| SANNA | SANNA — Ready for Development (`Mzc8BuOvMxOJGAQtv0h64M`) | `1100-356642` |
| My Portal / NPM | MyPortal — Designs 2025 (`1yroCKkROktqhRCP2wwlzB`) | `14799-135216` |
| NPM UI Kit | UI Kit LMV 6.0 — Reflow (`q9bC7JSvMa5KbucoUVLZji`) | `7619-10736` |
| Sesame | MySesame Redesign (`UBr399hnydpNF9P5Jb2vfx`) | `4893-24653` |
| Folio (Bingel DC) | Folio Designs (`o7lKWrw5sG8SZDs5QMTRH4`) | `3736-52358`, `323-57440` |
| It's learning | Course-files, Bookmarks, AI-use-resources, Page-tool, Collaboration-folder | `1-2` each |
| TEAS / Curiosity | AI Speech Coach — Designs (`LA6R23eqMcJYxVE7zgdCw0`) | `0-1` |

## Findings

### F1 — Three workstreams, one missing shared artifact: a number

All three efforts target the same transformation and none of them produces a comparable
quality figure.

The `implement-design` plugin's validation stage returns `MATCH` or `NEEDS_WORK`, decided by a
model looking at two images. Its own vision document names the weakness: *"visual diffing is hard
to make precise without a dedicated image-comparison model"*. The Code Connect work does produce a
machine-checked pass/fail, but only over snippet validity, not over rendered output. The `sl-ds-*`
skill set does compute a composite fidelity score, but it lives in a different repository and has
been run against two designs.

Consequence: no one can say whether a change to any of the three made things better or worse.
Every improvement is an argument rather than an observation.

### F2 — Code Connect completeness is a hard upstream dependency

The plugin's ingestion stage blocks with `BLOCKED_ON_CODE_CONNECT` when it finds a component
instance it cannot resolve. Of 56 mapping files in `scripts/connect-figma-components/src/`,
**14 are empty scaffolds** (calendar, drawer, editor, emoji, form, listbox, message-dialog,
paginator, skeleton, tabs, tag, tool-bar, tooltip, tree). Any real product design touching one of
those halts the pipeline.

This is being actively closed and is not a design problem — but it does mean pipeline work and
mapping work must be sequenced against each other rather than planned independently.

### F3 — The variance is introduced upstream of validation, not in it

Tracing where a decision stops being reproducible:

1. **Ingestion produces prose.** The manifest schema's only structured output is a flat,
   deduplicated token list. Per-node geometry — padding, gap, widths, alignment, order — is
   returned by the Figma design-context call, written to disk as raw output, and then *not carried
   into the manifest*. No downstream agent is instructed to read it as a specification.
   The implementer therefore reconstructs layout from a screenshot and a prose description.
2. **The decomposition checkpoint was removed.** The vision document specifies *"presented to the
   user for a quick approval/redirect before any code is written"*. The shipped skill states
   *"standalone, no approval gate"* and *"for each open question, pick a sensible default and
   proceed"*. Component-tree shape determines shadow-DOM boundaries, which determine CSS, which
   determines appearance. This is the highest-variance decision in the pipeline and it is both
   unreviewed and unrecorded.
3. **The verdict is a judgement, not a measurement.** No pixel difference, no threshold, no
   per-run baseline.
4. **Nothing is cached or compared across runs.** Each run creates a fresh artifact folder and
   re-fetches everything. There is no notion of "the same input produced a different output".

Points 1 and 2 are where reproducibility is lost. Point 3 is why it is not noticed. Point 4 is why
it cannot be quantified.

### F4 — The same over-scoping failure appears in both prior attempts, at different altitudes

The `sl-ds-*` handover records 31 requirements delivered together, and its own coverage matrix
scores 10 of them as unmet and 11 as partial. Its known-issues table attributes several failures to
having built breadth before depth — router untested, setup and layout skills never run, standards
files too large to load.

The plugin shows the identical pattern one level down. Its validation agent's prompt carries **ten
distinct visual defect classes** to hunt for — doubled borders, full-width versus content-width,
flush versus inset children, asymmetric edge contact, cross-row alignment, wrong size variant,
inconsistent inner padding, resting-state chrome, corner clipping, mis-registered icons — plus a
mandatory measurement table. Those ten are the same "everything at once" problem expressed as
prompt text instead of as a requirements list. There is no way to tell which of the ten fire, which
are ignored, and which are diluting the others.

The pattern is not a discipline failure. It is what happens when there is no per-requirement
feedback signal, because without one there is no reason to add requirements one at a time.

### F5 — Most of the accumulated rules are computable, and computing them removes variance for free

Of the ten defect classes in the validation prompt, at least six are arithmetic over
`getBoundingClientRect()` and `getComputedStyle()`: element width against container content width,
child inset on four sides, doubled borders at a shared boundary, shared left edge or centreline
across rows, rendered size against the expected variant, and resting-state chrome. A script
computes these identically on every run at zero token cost.

This generalises into the governing principle for the whole effort: **every check moved from
"the model should notice" to "a script computes" permanently removes variance and frees prompt
budget for the checks that genuinely need judgement.** Rules in a prompt compete with each other;
rules in a script do not.

Diana's snippet validator is the same principle already working one layer down: because it parses
the custom-elements manifest, a Code Connect snippet *cannot* reference an attribute the component
does not have. A contract replaces trust.

### F6 — Two audiences, two definitions of "correct", one pipeline

The design system team's success condition is that a Figma component maps to exactly one code
component, identically, every time. Unmapped or detached instances are defects.

A product developer's success condition is that their current screen appears in code as it is
today — including the parts drawn with local styles, detached instances, or components the design
system does not have. For them, an unmapped node is not a defect; refusing to render it is.

A single score cannot express both: the same design scores badly on one definition and perfectly on
the other. This calls for two declared modes over one pipeline, with the same measurement
machinery reporting against different pass conditions — not two pipelines, and not one blended
number that satisfies neither.

### F7 — Corpus selection and design-system adoption measurement are the same problem

Thresholds cannot be set, and corpus cases cannot be chosen, without knowing how much of a given
design actually uses the design system. Across eleven teams that figure is currently unknown.

A read-only design intake report answers it: for a given Figma node, how many instances resolve to
a design system component, how many are detached, how many use local styles instead of bound
variables, and which unmapped components recur across teams. That last output is directly
actionable for the design system team — it ranks which mappings to build next by real demand rather
than by alphabet.

### F8 — Coverage and adoption are one traversal, and it is the cheapest useful measurement

"Was the whole design transferred" and "how much of the design uses the design system" are the same
walk over the structural node tree joined against the Code Connect map, differing only in what is
counted. Pixel comparison cannot answer either: if a section was never rendered, there is nothing
to diff against, and the score stays silent about the omission.

This is the cheapest check to build, it is fully deterministic, it catches the worst class of
failure, and it serves both audiences and the intake report. It should exist before any pixel
comparison does.

### F9 — Research tooling already exists; no new research capability is needed

The question of whether a research skill is needed is answered by the existing toolkit:
`sl-analysis` has an INVESTIGATION mode that spawns parallel research subagents and a mandatory
anti-bias cross-check, and `sl-system-map` covers exploring a running application. This analysis was
produced with that path. What is missing is not research capability but a *measurement* capability,
which is a different kind of tool and is the subject of the recommendation below.

## What would change our mind

- **Baseline variance turns out to be small.** If running the existing pipeline three times on the
  same node yields a spread under roughly two points, non-determinism is not the dominant problem
  and effort should go straight at fidelity features instead of at freezing intermediate artifacts.
  This is directly testable and is the first thing the first slice measures.
- **Pixel comparison against Figma renders proves structurally unusable.** If Figma's renderer and
  the browser differ systematically in ways tiered tolerances cannot absorb, the fidelity dimension
  must rest on DOM geometry and token compliance alone. The recommendation survives; only one of
  its five dimensions is replaced.
- **Code Connect coverage alone gets fidelity high enough.** If completing the remaining mappings
  lifts output quality to an acceptable level on real designs, the elaborate harness is
  over-engineering and the right answer is to invest in mappings and keep validation qualitative.
- **The two audiences turn out not to conflict in practice.** If product designs prove to be
  overwhelmingly design-system-based, the dual-mode recommendation is unnecessary complexity and a
  single strict mode suffices. The intake report from the first slice settles this with data.

## Conclusion / recommendation

**Measure before improving.** The single change that makes every other improvement decidable is a
harness that turns a Figma node plus a generated result into numbers. Until that exists, no change
to any of the three workstreams can be shown to help, and the failure mode of the previous attempt
repeats by default.

Four recommendations follow.

**1. Build the measurement layer first, changing nothing in the pipeline.** Two numbers, not one:
*coverage* (is every node accounted for — mapped, rendered, or explicitly skipped) and *fidelity*
(does what was rendered match). Coverage comes first because it is deterministic, cheap, and
catches omissions that pixel comparison cannot see. Report variance across repeated runs of the
same input as a first-class figure alongside the score — variance, not the mean, is the metric
the reported problem is actually about.

**2. Treat the design intake report as part of that same layer, not as a separate initiative.** It
reuses the coverage traversal, it produces the design-system adoption figure the design system team
needs, it ranks unmapped components by real cross-team demand, and it is what makes corpus
selection and threshold setting evidence-based rather than arbitrary.

**3. Serve the two audiences as two declared modes over one measured pipeline.** A strict mode
where an unmapped instance is a defect, and an as-is mode where unmapped content is reproduced from
its design properties and reported as a non-design-system fraction. Same machinery, two pass
conditions, and an explicit statement in the output of which mode produced the result.

**4. Make the increment the unit of work: one requirement, one test case, one measured delta.**
A requirement with no corpus case that exercises it is a hypothesis and does not enter a prompt or a
script. Each accepted requirement records the score change it produced when it landed, which makes
it possible both to justify keeping it and to retire it later. A change that does not move the
score by more than the measured variance is not an improvement. Thresholds ratchet upward only.

On reuse from the prior attempt: the fidelity method (five dimensions, tiered tolerances by element
class, per-component diff artifacts), the persistent reviewable plan artifact that freezes the
decomposition decision, exhaustive verified token extraction, and the lessons-to-standards ratchet
are all worth carrying over. The weighting scheme, the pass thresholds, the framework-specific code
quality metrics, and the automatic repair loop are not — they were calibrated before anything was
measured, and the repair loop in particular masks exactly the variance we need to see.

Sequencing, in dependency order:

1. Figma ingest and the coverage/adoption measurement, delivered together with the intake report.
2. Fidelity measurement over a frozen corpus, producing the baseline and its variance.
3. Pipeline increments, one requirement at a time, each gated on moving the measured score.
4. The remaining requirement backlog, drawn from the prior attempt's list, admitted only with a
   corpus case attached.

Slices 3 and 4 are deliberately not planned in detail here. Planning them now would repeat the
mistake this analysis is about: their content should be chosen from what the baseline actually
shows is broken.

## Open questions

1. **Ticket identity.** These documents use `NOJIRA-figma-to-code`. If a Jira ticket is created the
   items should be renamed to its key.
2. **Where the harness lives.** Inside `tools/implement-design-plugin/` (coupled to the pipeline it
   measures) or as a sibling tool (usable against any generator, including the prior skill set).
3. **Who owns the frozen corpus Figma file**, and how it is protected from edits — without that
   guarantee, results are not comparable across runs and the whole method degrades silently.
4. **Target of the increments.** Extending the existing plugin is the default, since it is
   committed, installed cross-host, and its conventions encode real lessons. Merging the prior
   skill set into it, or keeping both behind one measurement layer, is a decision the plan must
   make explicitly.
5. **Ownership split** between the design system team's mapping work and the pipeline work, given
   F2 makes them mutually blocking.

## Leads to

- Plan: `P-NOJIRA-figma-to-code` — `../../plan/NOJIRA-figma-to-code/plan.md`
