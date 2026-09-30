---
type: analysis
schema_version: 1
id: A-NOJIRA-requirement-backlog
title: The 31-requirement backlog, re-scored against what this repository already has
description: Classification of every requirement from the prior attempt into already satisfied, made measurable, genuinely open, in conflict with the current design, or out of scope
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-09-30T10:40:00Z
updated: 2026-09-30T10:40:00Z
tags: [requirements, backlog, triage, design-to-code, planning]
references:
  - https://github.com/sl-design-system/components/pull/3423   # implement-design plugin, the pipeline re-scored against, read 2026-09-30
---

# The 31-requirement backlog, re-scored against what this repository already has

## Key questions

1. Of the 31 requirements carried over from the prior attempt, how many are still real work **in
   this repository**, given that the pipeline here is a different one?
2. Which of them stop being work items entirely once the measurement layer exists — because they
   become numbers to read rather than features to build?
3. Are any of them in conflict with how the current pipeline is deliberately designed, so that the
   right response is a decision rather than an implementation?
4. What order should the remainder be worked in, and how much of that order can be fixed now rather
   than after the baseline?

Out of scope: re-deriving the requirements themselves. They are taken as given from
`reference/prior-art-ds-skills/HANDOVER-2026-06-15.md` and re-scored, not rewritten.

## Hypotheses

- **H1.** Most of the 31 are still open, since the newer skill set scored only 10 as met. *F1
  contradicts this: the scoring was against a different system, and roughly a third are satisfied
  here by construction.*
- **H2.** A requirement is either done or not done. *F3 breaks this into a third category — several
  become continuously measured properties rather than binary features, and treating them as tasks
  would produce work with no completion condition.*
- **H3.** Requirements do not contradict each other. *F4 finds four that contradict the current
  pipeline's central design choice.*

## Context & background

The prior attempt's handover scores each requirement against its own two versions: 11 met in v1, 10
in v2, the rest partial or open. Those scores are accurate for those systems and misleading here,
because the pipeline in this repository is neither of them. It supports two frameworks, it resolves
component APIs through Code Connect, it ships as a plugin three different hosts read natively, and
it runs a compilation gate the newer skill set lacked.

Re-scoring is therefore not bookkeeping. A backlog that carries items already satisfied costs the
next owner the time to re-discover that, and it is the most expensive kind of error to hand over,
because it looks like work.

## Findings

### F1 — Roughly a third are already satisfied here, several by design choices made independently

| # | Requirement | Where it is satisfied |
|---|---|---|
| R4 | Setup verification before generation | Stage 0 gathers every input up front; the run halts on `BLOCKED_ON_MCP` or `BLOCKED_ON_CODE_CONNECT` rather than generating against an unprepared environment. *In-repo only — a consuming project still has nothing checking its setup.* |
| R5 | Design system only, no reimplementation | Enforced structurally: an unresolvable component instance halts the run. The conventions require composing existing components over building primitives, and net-new primitives are flagged as high-cost. |
| R10 | Component help — props, slots, types | Code Connect is the authoritative API source, and `custom-elements.json` is parsed by the mapping validator in CI. The data a help skill would serve is already machine-readable and verified. |
| R11 | Any scope, component to page | The pipeline takes a Figma node URL; scope is whatever that node contains. |
| R12 | Data and presentation encapsulation | A first-class convention: the root owns data, children are presentational and receive one typed model object rather than scattered scalar props. |
| R13 (icons) | Icon handling | Every `sl-icon` requires an explicit registration at module load; the convention names it. *Fonts remain unaddressed.* |
| R20 (partial) | Catch errors early | The orchestrator runs one package-wide `tsc --noEmit` as a hard gate before visual validation, routing errors back to the responsible implementer. This is precisely what the newer skill set was scored as missing. *Cross-session failure fingerprinting is still absent.* |
| R22 | Multi-agent support | The plugin uses the standard plugin layout, which Claude Code, GitHub Copilot CLI and Copilot in VS Code all read natively. Scored "not portable" before; satisfied here by packaging. |
| R23 | Multi-framework support | Lit and Angular, through framework skills loaded on demand, with framework-agnostic conventions factored out. Scored Angular-only in both prior versions. |

Nine items, two of which (R22, R23) were considered the hardest open problems in the prior attempt
and are satisfied here not by effort but by a packaging and factoring decision made for other
reasons.

### F2 — Two are out of scope for this initiative, and carrying them costs attention

**R14 (design system installation, Nexus token, package setup)** is a consumer-onboarding concern.
This repository *is* the design system; there is nothing here to install. It is real work for teams
adopting the design system and belongs to whoever owns adoption, not to design-to-code.

**R24 (multi-ecosystem — NX, plain CLI)** is likewise a property of the consuming project. This
repository is a yarn workspace and the pipeline targets it or an example within it. The requirement
becomes live only if and when the pipeline is pointed at consumer repositories — which is itself an
open question (see Open questions).

Neither is wrong. Both are someone else's backlog, and leaving them in this one makes a twelve-item
list look like a fourteen-item one.

### F3 — Five stop being features and become measurements

These cannot be "done". They are continuous properties, and the measurement layer converts each into
a number that is read every run:

| # | Requirement | What it becomes |
|---|---|---|
| R1 | Pixel-perfect output | Not a task at all — it is the *goal* the composite score expresses. Implementing "R1" is a category error; improving the score is the work. |
| R8 | Generation speed | Wall-clock per stage, recorded per run by Amendment 1. A target can then be set against observed numbers instead of guessed. |
| R9 | Model tier routing | Already claimed as delivered in the prior attempt — with no measurement of what it bought or cost. Amendment 1 makes a tier change an experiment with two readable deltas. |
| R15 | Standards compliance, and its context-overflow tension | The tension between loading complete standards and generation cost is exactly a score-against-cost trade, which is now readable rather than argued. |
| R28 | Context auto-split | Same trade. Whether a split is needed, and whether it helped, are cost and score questions. |

Treating any of these as a task produces work with no completion condition, which is one mechanism
by which a 31-item list stayed at 31.

### F4 — Four requirements directly contradict the current pipeline's central design choice

R18 (structured questions at every architectural decision), R19 (always suggest the next step), R26
(ask rather than assume) and R27 (concrete recommended options) all describe an interactive,
step-by-step assistant.

The pipeline here is deliberately the opposite. Its skill states that all user input is gathered in
Stage 0 and that after it *"the pipeline runs standalone to completion — no further questions"*. The
decomposition checkpoint that the pipeline's own vision document specified was removed, and the
shipped instruction is to pick a sensible default and proceed.

This is a genuine design disagreement, not an oversight, and it must be **decided rather than
implemented**. Two things bear on the decision:

- `A-NOJIRA-figma-to-code` found the removed decomposition checkpoint to be among the largest
  sources of run-to-run variance, because the highest-variance decision in the pipeline is made
  unreviewed and unrecorded. That is independent evidence for R18 on exactly one checkpoint.
- The prior attempt scored R18, R26 and R27 as met and still produced output that was not
  repeatable. Interactivity alone did not buy determinism.

The synthesis those two points suggest — one reviewable artifact at the decomposition boundary,
rather than either full autonomy or questions at every step — is a decision for the slice that
follows the baseline, not a conclusion to draw here.

### F5 — Eleven are genuinely open, and they are not equally urgent

| # | Requirement | Note on urgency |
|---|---|---|
| R6 | Theme override generation | The prior attempt's **number one** known issue: correct token *names* resolving to wrong *values*, so output was visibly the wrong colour. Its relevance here depends on whether the pipeline targets consuming applications with their own brand theme — inside this repository the design system's own theme applies. |
| R25 | Responsive by default | The pipeline captures breakpoints in the manifest and validates at each one, so it is measured. Nothing converts fixed design widths into fluid layout, so it is not generated. Better than the prior state, still open. |
| R2 | Architecture pattern, proposed and enforced | Proposed per run; nothing enforces consistency across runs. |
| R3 | App layout pattern | Same shape as R2 — created, not maintained. |
| R16 | Design system version migration | Open. Solved in v1, lost in v2, absent here. |
| R17 | Full update cycle | Composite of R7 and R16; not separately actionable until both exist. |
| R21 | Resumability | Open everywhere. A long run that is interrupted restarts. |
| R13 (fonts) | Font loading | The icon half is satisfied; fonts are not. |
| R29 | Versioned document formats between stages | The manifest has a stated contract and the measurement layer adds a versioned result schema; intermediate artifacts remain informal. Small and cheap. |
| R30 | Accessibility in generated code | Open. Large enough to be its own initiative — see Open questions. |
| R31 | Accessibility help | Partly available already: the toolkit ships an accessibility audit skill against a running application. Its gap is design-time guidance, not auditing. |

**R7 (caching)** is open but already assigned: deferred to slice 4 by an explicit decision, on the
grounds that efficiency before correctness hides variance.

### F6 — The re-score shrinks the backlog by roughly two thirds

Nine satisfied, two out of scope, five converted to measurements, four converted to a decision. What
remains as buildable work is **eleven items**, one of which is already scheduled and two of which
(R30, R31) probably belong to a separate initiative.

A new owner handed 31 items would spend their first weeks establishing what this analysis
establishes now. That is the cheapest saving available in the whole handover, and unlike the rest of
this initiative it requires building nothing.

### F7 — The satisfied claims are argued, not verified, and that distinction matters

Every entry in F1 is derived from reading the pipeline's skills and conventions. None has been
confirmed by running the pipeline and observing the behaviour. The prior attempt made exactly this
error in the opposite direction: it scored requirements as met from specifications, and its own
notes then record that several of those components had never been run.

A claim of "satisfied" that turns out to be wrong is worse than an open item, because nobody looks
at it again. The nine claims are cheap to confirm and should be confirmed before the backlog is
handed to anyone.

## What would change our mind

- **The pipeline is pointed at consumer repositories.** R6, R14, R24 and parts of R4 move from out
  of scope or conditional to central, because a consuming app has its own theme, its own ecosystem,
  and its own installation. This single question moves four items and is the most consequential
  unknown in this analysis.
- **Verification refutes an F1 claim.** Each is an argument from reading. A failed confirmation
  moves that item back to open, which is precisely why F7 recommends confirming them.
- **The autonomy design is reaffirmed after the baseline.** If measurement shows the decomposition
  checkpoint is not in fact a major variance source, F4's four requirements are simply retired
  rather than partially adopted.
- **Accessibility is ruled in.** If R30 and R31 belong to this initiative rather than a separate
  one, the shape of the work changes substantially — accessibility is not a property that can be
  added to generated code afterwards.

## Conclusion / recommendation

**Triage before planning.** The backlog is not 31 items; it is roughly eleven, and the difference is
recoverable now, on paper, without building anything. Do that first, because everything else is
sequenced against a list that is currently wrong.

Four actions, in this order:

**1. Confirm the nine satisfied claims against the running pipeline.** Cheap, and it converts an
argument into evidence. Anything that fails confirmation returns to the open list with a note
saying why — which is more valuable than having never claimed it.

**2. Retire the two out-of-scope items explicitly, with a named owner elsewhere.** Silent removal
is how a requirement comes back six months later.

**3. Record the five measurement conversions as registry entries, not as tasks.** They belong in the
requirement registry that slice 1 builds, where a measured property is what an entry *is*.

**4. Decide the autonomy question rather than building toward it.** Four requirements hang on it,
and the decision has evidence on both sides. It should be made once, written down as a decision
record, and the four either adopted in a specific form or retired.

**Sequence the remaining eleven by evidence, not by number.** R6 and R25 are the two the prior
attempt identified as producing visibly wrong output, and both should be near the front — but R6's
relevance is conditional on the consumer-repository question, which must be answered first because
it also moves three other items. R2, R3, R21, R29 and the font half of R13 are ordinary work,
sequenceable once the baseline shows what actually hurts. R16 and R17 are a pair and neither is
urgent while the design system and the pipeline live in the same repository. R30 and R31 should be
scoped as their own initiative rather than absorbed.

**Do not write plans for the eleven yet, beyond the triage.** Two of the four actions above produce
information that changes their ordering, and the baseline produces more. Writing eleven plans now
would be the same mistake at a different altitude.

## Open questions

1. **Does the pipeline target consuming repositories, or only this one?** The most consequential
   question here: it moves R6, R14, R24 and part of R4 between scopes, and it changes what "correct
   output" means, because a consuming application has its own brand theme.
2. **Is accessibility (R30, R31) part of this initiative or its own?** It cannot be retrofitted onto
   generated code, so the answer changes the pipeline's shape rather than just adding items.
3. **Autonomy versus checkpoints** — the F4 decision. Evidence exists on both sides; it needs a
   decision record, and the baseline sharpens but does not settle it.
4. **Who owns R14 and R24 once they leave this backlog?** Retiring them without a destination is how
   they return.

## Leads to

- Plan: `P-NOJIRA-requirement-triage` — `../../plan/NOJIRA-requirement-triage/plan.md`
- Related: [`A-NOJIRA-figma-to-code`](../NOJIRA-figma-to-code/analysis.md), whose requirement
  registry is where the measurement conversions land.
