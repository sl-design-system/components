---
type: task
schema_version: 1
id: T-NOJIRA-figma-ingestion-05
title: Two reader defects the remote server exposed, before anything is measured on them
description: 'The map answers about descendants and omits the snippet; the reader calls both of those an absence'
jira: null
resource: null
status: todo
independent: false
owner: marcin.ludwig
created: 2026-10-06T00:00:00Z
updated: 2026-10-06T00:00:00Z
tags: [figma, code-connect, traversal, defect]
source_plan: P-NOJIRA-figma-ingestion
depends_on: [T-NOJIRA-figma-ingestion-03]
---

# Two reader defects the remote server exposed

## Objective

`T-NOJIRA-figma-ingestion-04` is a measurement. Two of the instruments it would use are wrong in
a way measured on 2026-10-06, and both wrong in the same direction: **they turn a successful
answer into an absence**, which is the failure mode this whole plan exists to remove.

Both were invisible against the Dev Mode server and appear on the remote one, which is where the
probe must run.

**Probed, on `4TdMrcnIVOn3Hrfj2OpVZU`:**

```
get_code_connect_map(334:20594)   # sl-avatar
→ { "334:20605": {…}, "334:20610": {…}, "334:20609": {…} }
```

Three entries, for **Mask**, **Mask** and **Base/Icon** — nodes inside the instance. **Nothing
for `334:20594` itself.** And every entry carries `hasTemplate: true` with **no `snippet` key**,
which is the remote tool's documented map form; the snippet arrives only when the exact node is
asked for.

`classifyMap` looks up `entries[nodeId]` and refuses a template without a snippet. So it reads
that response as _empty_, files `genuinely-unmapped`, and in strict mode the classifier sends
cause E — _a mapping is published and did not resolve_ — to the design system team, about an
instance whose internals the map just resolved three of.

## Steps

1. **A map may answer about descendants.** `classifyMap` takes the set of ids below the node and
   resolves against it, not against one id. The record says which id answered — `resolvedBy` —
   and a node answered by a descendant is **not** a descent.
2. **`hasTemplate: true` without `snippet` is the map form, not a contradiction.** Keep the
   refusal for a shape that is genuinely neither; add the map form as a third outcome,
   `mapped-without-snippet`, distinct from `identified` (`hasTemplate: false`).
3. **Default to the server the work runs on.** `DEFAULT_ENDPOINT` is the Dev Mode server, which
   does not publish task 01's tool and answers every valid node in ~31 s. Make the endpoint an
   explicit choice with no silent default, and record which server answered in the report.
4. Fixtures from the 2026-10-06 responses — the descendant-answering map, the snippetless entry,
   the `{}` with `Note: the Code Connect lookup timed out` appended, which the local server never
   sends.
5. **Record the fourteen-case prediction, before 04 runs.** All nine corpus designs with zero
   `sl-*` instances are among the fourteen halts; the plan's thesis predicts as-is mode converts
   those nine, and the remaining five turn on causes A and B. Writing it down first is what lets
   the probe falsify the plan instead of confirming it.

## Acceptance criteria

- A node whose descendants the map resolved is **not** reported as unmapped, and the report names
  the id that answered.
- An entry with `hasTemplate: true` and no snippet is read as mapped, and is distinguishable in
  the output from `hasTemplate: false`.
- A shape that is genuinely neither is still refused — the negative control survives the fix.
- No endpoint is used that the operator did not choose, and the report says which one answered.
- The prediction for the fourteen is recorded with a date, before the probe runs.

## Verification

Re-run `classify-unresolved.mjs` over the live walk: `334:20594` must stop appearing as a descent.
The 2026-10-06 responses are in the fixtures, so the two defects stay caught by mutation after
the fix.
