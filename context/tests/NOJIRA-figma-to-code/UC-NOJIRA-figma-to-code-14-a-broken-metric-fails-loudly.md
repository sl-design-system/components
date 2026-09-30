---
type: use-case
schema_version: 1
id: UC-NOJIRA-figma-to-code-14
title: A deliberately broken metric fails the suite rather than changing a number quietly
description: Proves the instrument is guarded, which is the precondition for anyone trusting its output
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-09-30T14:20:00Z
updated: 2026-09-30T14:20:00Z
tags: [testing, quality, bench]
tests_task: T-NOJIRA-figma-to-code-14
---

# A deliberately broken metric fails the suite rather than changing a number quietly

> Verifies [T-NOJIRA-figma-to-code-14](../../work/NOJIRA-figma-to-code/T-NOJIRA-figma-to-code-14-bench-integration-test.md).

## Preconditions
Every metric is implemented, the integration test runs against stubs with no network, and the suite
is green.

## Scenario
Introduce one deliberate defect at a time and run the suite: invert a comparison in the position
check; drop a node from the coverage denominator; return the configured model tier instead of the
one a stage actually ran at; let a mismatched corpus freeze stamp through instead of refusing it.

## Result
Every one of the four fails the suite, and the failure names what changed — the golden file diff
shows the altered field rather than reporting only that a number moved. A defect that alters an
output without failing anything is the specific failure this task exists to prevent, and finding one
means the suite is incomplete rather than that the defect was harmless.

## Edge cases
The dropped-node defect must fail the coverage assertion specifically, not merely shift a composite
score by an amount someone could read as noise. A metric that can be broken without a named test
failing is not yet covered.

The suite runs with no network. If it passes only when Figma is reachable, it is not an integration
test of the bench but a live run wearing its name.
