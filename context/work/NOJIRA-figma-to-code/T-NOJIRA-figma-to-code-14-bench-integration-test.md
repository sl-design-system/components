---
type: task
schema_version: 1
id: T-NOJIRA-figma-to-code-14
title: Integration and behaviour tests for the bench itself
description: Prove the measuring instrument is correct before its numbers are published, with an end-to-end run against stubs and readable rules for every verdict
jira: null
resource: null
status: todo
independent: false
owner: marcin.ludwig
created: 2026-09-30T14:20:00Z
updated: 2026-09-30T14:20:00Z
tags: [testing, quality, tooling, bench]
source_plan: P-NOJIRA-figma-to-code
depends_on: [T-NOJIRA-figma-to-code-06, T-NOJIRA-figma-to-code-07, T-NOJIRA-figma-to-code-08, T-NOJIRA-figma-to-code-09, T-NOJIRA-figma-to-code-10, T-NOJIRA-figma-to-code-11, T-NOJIRA-figma-to-code-12, T-NOJIRA-figma-to-code-13]
---

# Integration and behaviour tests for the bench itself

> From [P-NOJIRA-figma-to-code](../../plan/NOJIRA-figma-to-code/plan.md), added by Amendment 3.

## Objective
Establish that the instrument is correct before anyone quotes it.

**A measurement tool that is wrong is worse than no measurement tool**, because its output is a
number and numbers are believed. Every metric has unit tests and a known-answer fixture by the time
it lands (Amendment 3's cross-cutting criterion); this task covers what those cannot: the whole
bench running end to end, and the verdict rules stated so a non-developer can challenge them.

## Steps
- [ ] Build an end-to-end integration test: a fixture corpus, a stubbed Figma layer returning recorded responses, and a static page served locally — no live Figma, no live pipeline, no network
- [ ] Assert the full result document against a golden file, so a change anywhere in the chain shows up as a diff rather than as a slightly different number nobody notices
- [ ] Cover the failure paths explicitly, because they are what a real run hits: a changed corpus freeze stamp, an unreachable node, a dimension mismatch between rendered and reference, a case that fails mid-run while others complete
- [ ] Write the **verdict rules as behaviour specifications in plain language** — "a delta inside the combined spread is reported as indistinguishable", "a comparison across different corpus freeze stamps is refused", "a requirement with no corpus case cannot be activated" — so the design system team and designers can read and dispute them without reading code
- [ ] Keep behaviour specifications to the verdict and gate rules only. Do not write them for the arithmetic: they add ceremony where the assertion is numeric and the reader is a script
- [ ] Ensure the integration test runs in CI on every change to the bench, and that a red test blocks publishing a baseline

## Acceptance criteria
- [ ] The whole bench runs end to end in a test, against stubs, with no network access
- [ ] The result document is asserted against a golden file, not spot-checked field by field
- [ ] Every failure path above has a test that asserts the failure, not merely that no crash occurred
- [ ] Every verdict and gate rule exists as a readable behaviour specification, and someone outside the team can be pointed at that file to dispute a rule
- [ ] No behaviour specifications were written for pure arithmetic
- [ ] CI runs the suite and a red suite blocks `T-NOJIRA-figma-to-code-15`

## Verification
Deliberately break one metric — invert a comparison, drop a node from the accounting — and confirm
the golden file diff catches it. A change that alters a number without failing a test is the exact
failure mode this task exists to prevent.
- Use case: `UC-NOJIRA-figma-to-code-14` — `../../tests/NOJIRA-figma-to-code/UC-NOJIRA-figma-to-code-14-a-broken-metric-fails-loudly.md`

## Notes / work log
Added by Amendment 3. Unit tests and calibration fixtures are not here — they ship with each metric
under the cross-cutting criterion, because a metric merged without its test is a metric nobody will
retrofit one for.
