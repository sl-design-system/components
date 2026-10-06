---
type: task
schema_version: 1
id: T-NOJIRA-figma-ingestion-05
title: Two reader defects the remote server exposed, before anything is measured on them
description: 'The map answers about descendants and omits the snippet; the reader calls both of those an absence'
jira: null
resource: null
status: done
independent: false
owner: marcin.ludwig
created: 2026-10-06T00:00:00Z
updated: 2026-10-06T05:00:00Z
tags: [figma, code-connect, traversal, defect]
source_plan: P-NOJIRA-figma-ingestion
depends_on: [T-NOJIRA-figma-ingestion-03]
commit: 8ad685ae1
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

## Result

`runs/harness/traverse.mjs`, modified in place. The harness gate is **452 tests** and
`tsc --noEmit` over seventeen files. **19 mutations, 0 survivors.**

### Two defects, not one — and they blamed two different teams

The Objective describes the descendant case and the snippetless case as one failure. Measured on
a8's own `get_metadata` capture, with the reader at `dc100e98a` against the reader now:

| The response                            | Before                                                               | After                             |
| --------------------------------------- | -------------------------------------------------------------------- | --------------------------------- |
| the map answered about descendants only | `descended` / `genuinely-unmapped` → **cause E, design system team** | `mapped`, `resolvedBy: 334:20605` |
| `hasTemplate: true` with no `snippet`   | `descended` / `map-unreadable` → **cause A, the pipeline**           | `mapped`, `resolvedBy: 334:20593` |

Run end to end through `classify-unresolved.mjs` in strict mode, both nodes leave the unresolved
list entirely: **21 unresolved becomes 20**, and the node is not in it. One of the two was telling
the design system team to republish a mapping that had just resolved three times.

### The five criteria

| Criterion                                                                                    | How it is shown                                                                                           |
| -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| A node its descendants resolved is not unmapped, and the report names the id that answered   | `resolvedBy` on the record; the measurement above                                                         |
| `hasTemplate: true` with no snippet is mapped, and distinguishable from `hasTemplate: false` | `mapped` against `identified`, asserted unequal rather than each asserted alone                           |
| A shape that is genuinely neither is still refused                                           | three controls survive the fix — a malformed entry, a non-object, a body that is not JSON                 |
| No endpoint the operator did not choose, and the report says which answered                  | the CLI **exits 2** without `--endpoint`; `report.endpoint` is the session's, and `null` when nobody said |
| The fourteen-case prediction is recorded with a date, before the probe                       | below, 2026-10-06                                                                                         |

### What `334:20594` turned out to be

The Verification says that node must stop appearing as a descent. **It never appeared.** REST,
the Dev Mode metadata and the code-connect probe all agree it is a **`FRAME` named `sl-avatar`**,
not an instance, and the traversal does not probe frames. Its sibling `334:20593` is the real
`INSTANCE` named `sl-avatar`; the two sit side by side under `Group 1`, which is what a detached
copy next to the real thing looks like.

So the verification was done on `334:20593`, which the traversal does probe, with the responses
recorded on 2026-10-06. The defect is unchanged by this — a map that answers about a subtree is a
map that answered — but the specific node the task named was never the one it reached.

### Two things removed rather than added

- **A pre-pass that collected the subtree before probing.** It bought nothing: the frontier
  fetches that node anyway for every mapped or descended node, and the cache makes the two paths
  the same call. A mutation survived against it, which is how it was found.
- **`DEFAULT_ENDPOINT` as a default.** It stays as a documented constant the usage line prints,
  because an operator still needs to know what the local server is called. It is no longer what
  happens when nobody chooses.

### The prediction, recorded 2026-10-06, before `T-NOJIRA-figma-ingestion-04` runs

The fourteen are the Code Connect halts of pass 2 in
`runs/control/_reports-2026-10-04/FULL-SUMMARY.md`. The `sl-*` counts are instance names in the
**REST captures** `T-NOJIRA-figma-ingestion-06` took, which is a better denominator than the MCP
metadata the plan was written on — it descends through instances and the metadata does not.

| Design                        | `sl-*` instances | Predicted                     |
| ----------------------------- | ---------------: | ----------------------------- |
| a1-kampus-subchapter-feed     |                0 | **converts** — as-is, cause C |
| a11-sesame-learning-materials |                0 | **converts**                  |
| a6-itsl-collab-shared-folder  |                0 | **converts**                  |
| b-itsl-bookmk-course-files    |                0 | **converts**                  |
| b-itsl-bookmk-deleted-course  |                0 | **converts**                  |
| b-itsl-collab-add-element     |                0 | **converts**                  |
| b-itsl-course-course-files    |                0 | **converts**                  |
| b-kampus-notes-panel          |                0 | **converts**                  |
| a4-sesame-my-groups           |               24 | causes A and B, not D or E    |
| b-sesame-group-details        |               63 | causes A and B                |
| a8-nsp-group-list             |               72 | causes A and B                |
| a10-etsl-fam-users            |              122 | causes A and B                |
| a2-nsp-class-overview         |              801 | causes A and B                |
| a5-etsl-metadata-usage-widget |   **unmeasured** | unknown                       |

**Eight, not nine.** The task predicted nine designs with zero `sl-*` instances among the
fourteen; eight is what the captures show, and the ninth candidate — a5 — has no root node id
anywhere in the repository, so it was not captured and cannot be counted either way. Writing
nine down and finding eight is the prediction doing its job.

**What would falsify this.** Any of the eight halting again under as-is mode; or any of the five
resolving to cause D or E, which would mean the mapping gap is real and this plan's thesis is
wrong. A conversion rate below eight is the signal to stop, which is what `T-04` is for.
