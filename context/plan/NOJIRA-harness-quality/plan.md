---
type: plan
schema_version: 1
id: P-NOJIRA-harness-quality
title: Calibrate the instruments before the next experiment is measured with them
description: 'Scenario, decomposition, unit tests, a zod boundary and a negative control for the four harness scripts that have a named consumer — render-design first, because it judges figma-ingestion'
jira: null
resource: null
status: approved
phase: approved
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T00:00:00Z
tags: [harness, testing, quality, zod, typescript]
source_analysis: A-NOJIRA-harness-testability
slice: harness-quality
depends_on: []
approved_by: marcin.ludwig
approved_date: 2026-10-05
open_questions: []
---

# Calibrate the instruments before the next experiment is measured with them

> Derived from [A-NOJIRA-harness-testability](../../analyzes/NOJIRA-harness-testability/analysis.md).

## Goal

The four harness scripts with a named future consumer become testable, tested and loud at their
boundaries — each with a use-case scenario anchored to a real captured fixture, exported
functions, unit tests, zod validation where bytes enter, and a **negative control** proving the
tool can fail.

`render-design.mjs` goes first. It produces the figure **9 of 19**, and
`P-NOJIRA-figma-ingestion` is about to be judged by it. Measuring that experiment with an
uncalibrated instrument repeats the fault that made four runs agree on a confident wrong
diagnosis.

## Approach

**Per script, in this order:** scenario → fixture → decomposition → unit tests → boundary
validation → negative control. The scenario comes first so the tests are written against stated
behaviour, and the fixture comes before the tests so the scenario is checked against bytes we
actually captured rather than against our description of them. That ordering is the whole lesson
of A-NOJIRA-harness-testability F6: both defects shipped on 2026-10-05 survived atomic, isolated,
passing tests because their fixtures were written from prose.

**Decomposition is a refactor with no behaviour change,** and it is proved so: for the scripts
that already produce corpus-wide output, the output before and after must be byte-identical
apart from `capturedAt`, which is the run directory's mtime and restamps on every write.

**zod validates what is depended on, not everything.** A schema that rejects an added or
reordered field turns a tolerable variation into an outage. Default non-strict objects, and the
distinction the analysis draws: a measurement tool **rejects** — a wrong number is worse than no
number — while everything else warns and continues.

**Typing is a separate, smaller move.** Node 24 runs `.ts` natively but does not check it, so the
deliverable is `runs/harness/tsconfig.json` plus `tsc --noEmit` wired to a command, not a file
rename. Probed: a local tsconfig checks the harness in isolation and the monorepo project is
untouched.

## Scope

**In:** `render-design.mjs`, `normalise-captures.mjs`, `mode-decision.mjs`, `theme-match.mjs` —
scenarios, fixtures, decomposition, unit tests, zod boundaries, negative controls, and the
type-check setup for the directory.

**Out:** `shoot.mjs`, `typecheck.mjs`, `check-tokens.mjs` and `link-workspaces.mjs`, which have
no named consumer in the current plans — `check-tokens.mjs` is a candidate for a later pass
because it is one of the six tools known to have failed silently, but a zod boundary buys it
nothing until something depends on its output. Also out: any behaviour change to the scripts,
and the HTML deliverable itself, which is `P-NOJIRA-html-artifacts`.

## Work breakdown

- `T-NOJIRA-harness-quality-01` — the type-check and test harness for the directory:
  `runs/harness/tsconfig.json`, `@types/node`, a command that runs `tsc --noEmit` and
  `node --test` together, and the convention documented in the harness README
- `T-NOJIRA-harness-quality-02` — `render-design.mjs`: scenario, fixtures, decomposition into
  exported functions, unit tests, a zod boundary on `index.json`, and a negative control
- `T-NOJIRA-harness-quality-03` — `theme-match.mjs`: same treatment, with the negative control
  being a design whose variables match no theme
- `T-NOJIRA-harness-quality-04` — retrofit the two already-reshaped scripts: zod boundaries and
  negative controls for `normalise-captures.mjs` and `mode-decision.mjs`, and the use cases
  their existing tests were written without

## Disposition against the analysis

A plan here has twice quietly re-derived a document that already existed, smaller. So every
numbered finding of [`A-NOJIRA-harness-testability`](../../analyzes/NOJIRA-harness-testability/analysis.md)
gets an explicit disposition, and the review that produced this table found one gap.

|     | finding                                                                                                   | where it lands                                                |
| --- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| F1  | six of eight scripts have no exports and no tests; `render-design.mjs` is the worst and most load-bearing | Scope, and task 02 takes it first                             |
| F2  | typing would have caught neither shipped defect                                                           | Approach — typing is a separate, smaller move, not the remedy |
| F3  | Node runs `.ts` but does not check it                                                                     | task 01 delivers `tsc --noEmit`, not a file rename            |
| F4  | zod rejects the payload the reader accepted                                                               | zod boundaries in tasks 02–04                                 |
| F5  | the use-case template is the BDD layer and is unused                                                      | every task opens with a scenario                              |
| F6  | a fixture built from a description tests the description                                                  | Acceptance refuses such a scenario                            |
| F7  | validation can be loud without reading the whole response                                                 | **was missing — now task 04**                                 |
| F8  | not every script deserves this                                                                            | Scope names the four in and the four out                      |

**F7 was the gap.** `mode-decision.mjs` streams precisely so a 2.18 MB response never lands in
memory, and a whole-object `zod.parse` would defeat that. Task 04 therefore validates the
**first window only** — enough to decide envelope versus bare JSON and to check that the first
component carries `dependencies[].external` — and streams the rest. Without this written down,
task 04 would have been handed a requirement that contradicts the script's reason for existing.

## Risks & dependencies

**The probe may not survive.** If `P-NOJIRA-html-artifacts` absorbs the completeness probe,
task 02 is wasted. The analysis argues it does not — `render-design.mjs` calls itself _"a
completeness probe, not a fidelity target"_ and the artifacts plan produces the deliverable, not
the gauge — but the plan is not yet written in a way that settles it. **Mitigation:** task 02
decomposes and tests; it does not redesign. A decomposed, tested probe is cheaper to absorb than
a monolith.

**Decomposing a 546-line script can change behaviour silently.** Mitigation is the byte-identical
output check above, run over all nineteen runs, before and after.

**Negative controls rot.** A bad-input case written once passes trivially forever. Keeping it in
the use case, where the scenario is maintained, is the defence; the analysis is honest that it is
a weak one.

**Delay.** This plan sits between `T-NOJIRA-figma-ingestion-01` and the rest of that plan.
Task 02 is the part that must precede ingestion's measurement; tasks 03 and 04 can follow it.

Depends on no other plan. `P-NOJIRA-figma-ingestion` does not depend on this one to _run_ — only
its measurement does.

## Acceptance

- Every script in scope exports the functions its tests exercise; no test reaches into a CLI.
- **Every scenario names a real captured artifact** in its preconditions — a run in the corpus or
  a file under `runs/harness/fixtures/`. A scenario whose fixture was written from a description
  is not accepted.
- **Every measurement tool has a negative control that fails when the tool is broken.** Proved by
  breaking it: the control must be shown going red against a deliberately damaged input, not
  merely shown green.
- Bytes entering a script are validated by zod and a malformed input is **reported, never scored**.
- `tsc --noEmit` and `node --test` both pass over `runs/harness/`, from one command.
- `render-design.mjs` produces **byte-identical output over all nineteen runs** before and after
  decomposition, `capturedAt` excepted.
- The rule is written down where the next author will meet it — tests with the script, fixtures
  from real bytes, a tool that can fail.

## Approval

Approved by marcin.ludwig on 2026-10-05, on the instruction to write the plan and finish the
tests in the same pass rather than deferring them.

One decision was taken inside the plan rather than asked: **four of the eight scripts are in
scope**, the ones with a named consumer. `check-tokens.mjs` is the arguable exclusion — it is
one of the six tools known to have failed silently — and it comes back the moment anything
depends on its output.
