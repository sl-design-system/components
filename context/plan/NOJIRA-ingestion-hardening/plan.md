---
type: plan
schema_version: 1
id: P-NOJIRA-ingestion-hardening
title: Make the fetch countable, verifiable and complete
description: A ledger of every Figma call, validation at the schema boundary, assets captured before their URLs expire, and the closure census emitted during ingestion — the instrumentation that turns a working traversal into a measurable one
jira: null
resource: null
status: approved
phase: approved
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T00:00:00Z
tags: [figma, design-to-code, instrumentation, determinism]
source_analysis: A-NOJIRA-figma-to-code
slice: ingestion-hardening
depends_on: [P-NOJIRA-figma-ingestion, P-NOJIRA-html-artifacts]
approved_by: marcin.ludwig
approved_date: 2026-10-05
open_questions: []
---

# Make the fetch countable, verifiable and complete

> Derived from [A-NOJIRA-figma-to-code](../../analyzes/NOJIRA-figma-to-code/analysis.md), with
> the mechanics in
> [`instrumentation.md`](../../analyzes/NOJIRA-figma-to-code/instrumentation.md).

## Goal

Instrument a traversal that already works, and make its completeness provable.

It is separate from `P-NOJIRA-figma-ingestion` because the two answer different questions and have
different sizes. That plan asks _does the run stop?_ and is days. This one asks _what did it cost,
is what came back well-formed, and did we get everything?_ and is weeks — one of its tasks
contains the REST-versus-MCP fork, which re-bases the capture protocol.

## Approach

**One quantity, counted one way, emitted by the harness.** Nineteen runs self-reported cost,
disagreed by two orders of magnitude, and one fabricated a figure. The fix is where the number
comes from, not asking more carefully.

**Validate at the boundary, without transforming the stored bytes.** A schema over an
undocumented format breaks loudly when the format moves — which is the feature. Six undocumented
MCP behaviours have cost four runs so far, each discovered by being surprised.

**Every field names a question it answers.** The decomposer already emits thirty open questions
per screen that nothing consumes; that is how they became invisible variance.

## Scope

**In:** the call wrapper and ledger, the eight boundary checks, asset capture, invoking the
closure check, per-run metrics and cross-run analysis.

**Out:** the traversal and the classification — `P-NOJIRA-figma-ingestion`; the closure check's
implementation, which is `T-NOJIRA-html-artifacts-03` and runs over the format rather than over
Figma.

## Work breakdown

- `T-NOJIRA-ingestion-hardening-01` — The call wrapper and the append-only ledger: call, node,
  duration, bytes, status, attempt, whether a retry rescued it, cache hit. **Decides here:**
  whether the implementation agents keep the Figma tools at all. Leaving them makes the ledger
  complete by compliance, which is the failure shape self-reported cost already demonstrated
- `T-NOJIRA-ingestion-hardening-02` — The eight boundary checks, at capture time, without
  transforming the stored bytes. **Decides here:** structure from the documented, versioned REST
  API and semantics from MCP, or everything from MCP
- `T-NOJIRA-ingestion-hardening-03` — Asset capture during the fetch, after mapping resolution,
  treating a cap of exactly 20 as "probably more". Before it, an icon that maps to `sl-icon`
  would be downloaded as a raster — a mapped component converted into a picture
- `T-NOJIRA-ingestion-hardening-04` — Invoke the closure check and emit its census
- `T-NOJIRA-ingestion-hardening-05` — Per-run metrics from the ledger, and cross-run analysis
- `T-NOJIRA-ingestion-hardening-06` — The full 19 × 2 re-run, compared against 5 of 38 on
  completions **and** recorded conformance

## Risks & dependencies

**It depends on two finished plans, and on neither's internals.** The traversal must exist before
it can be instrumented; the closure check must exist before it can be invoked.

**The REST-versus-MCP fork in task 02 is larger than it looks** — a new auth surface and a second
schema. It is isolated in one task deliberately, so a decision to stay on MCP costs nothing
elsewhere.

**A file-level call returned 2.18 MB.** Anything reading it into context loses its window; it is a
fetch-and-grep call.

**The success test is not "more runs produce code."** Fourteen low-fidelity ports with invented
content would satisfy that and be worse than halting, because halting at least tells the truth.
The test is _more runs produce code whose conformance is recorded_.

## Acceptance

- Every Figma call in a run appears in the ledger. A run's call count is derivable without reading
  a transcript.
- A failing capture is recorded as failing rather than passed downstream.
- Assets resolve locally; no generated artifact references a Figma URL.
- The closure census reports an empty frontier, or names what is still in it.
- The 19 × 2 re-run states which of completions and conformance moved, and by how much.

## Approval

**Approved 2026-10-05 by marcin.ludwig**, as the half of the ingestion work that is weeks rather
than days and therefore should not gate the half that is days.
