---
type: task
schema_version: 1
id: T-NOJIRA-figma-ingestion-04
title: The fourteen-case probe
description: 'Re-run only the cases that halt today — a third of the cost of the control, and it can falsify the plan on its own'
jira: null
resource: null
status: todo
independent: false
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T00:00:00Z
tags: [measurement, baseline, control]
source_plan: P-NOJIRA-figma-ingestion
depends_on: [T-NOJIRA-figma-ingestion-03]
---

# The fourteen-case probe

## Objective

The measured baseline is **5 of 38**, with 14 of 19 cases halting on one branch in both passes.
Re-run only those fourteen.

**If none converts, stop.** The diagnosis is wrong and the remaining twenty-four runs are saved.

## Steps

1. Re-run the fourteen halting cases with tasks 01–03 in place.
2. Record, per case: did it halt, and if not, what did it produce.
3. Record the conformance figures — mapped, inferred, invented — for anything that produced
   output.

## Acceptance criteria

- The number of the fourteen that converted is reported.
- **Conformance is recorded for every converted case.** More runs producing code is _not_ the
  success test: fourteen low-fidelity ports with invented content would satisfy it and be worse
  than halting, because halting at least tells the truth.
- A case that still halts carries a cause and an owner.

## Verification

Compare against the control report in `runs/control/_reports-2026-10-04/`; the same fourteen cases, the same two passes.
