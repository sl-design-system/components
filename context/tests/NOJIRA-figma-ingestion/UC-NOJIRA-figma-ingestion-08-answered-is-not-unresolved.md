---
type: use-case
schema_version: 1
id: UC-NOJIRA-figma-ingestion-08
title: A node inside an instance that answered is not on anybody's list
description: 'Two nodes inside an sl-avatar whose snippet the walk was holding were reported as pipeline bugs, and the halt that followed was on them'
jira: null
resource: null
status: passing
owner: marcin.ludwig
created: 2026-10-06T00:00:00Z
updated: 2026-10-06T11:00:00Z
tags: [figma, code-connect, classification, negative-control]
tests_task: T-NOJIRA-figma-ingestion-08
---

# A node inside an instance that answered is not on anybody's list

> Verifies [T-NOJIRA-figma-ingestion-08](../../work/NOJIRA-figma-ingestion/08-nested-under-resolved.md).

## Preconditions

- `runs/probe-04/code-connect/a8-nsp-group-list__334-20578__child-468-nodes.json` — the response
  `mcp.figma.com` really sent for a8, **14 entries and 5 snippets**, including `334:20593`
  resolving as `sl-avatar`
- `runs/harness/fixtures/code-connect-remote-snippet.json` — the same instance asked directly
- `runs/harness/fixtures/code-connect-descendants.json` — the map form, `hasTemplate` with no
  snippet, which answered too
- `runs/harness/fixtures/walk-five-causes.json` — a walk whose one nested node sits inside
  `334:20668`, an instance that resolved with a snippet
- `scripts/connect-figma-components/src/` — this repository's own mappings

## Scenario

| Step | Action                                                              | Expected result                                                                      |
| ---- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 1    | Walk a design whose instance resolves and holds two nested children | both recorded `nested`, `enclosingOutcome: resolved`, `probedAs` naming the instance |
| 2    | Classify that walk, strict and as-is                                | **zero** unresolved, `coveredByEnclosing: 2`                                         |
| 3    | Run the same through the CLI                                        | **exit 0**                                                                           |
| 4    | Do it again with the map form instead of a snippet                  | `enclosingOutcome: mapped`, and the same answer                                      |
| 5    | Re-count `walk-five-causes.json`                                    | `B nested-id-rejected` is gone; unresolved is **5**, not 6                           |
| 6    | Replace the prose in `detail` with nonsense                         | the verdict does not move                                                            |
| 7    | Classify a nested node whose instance answered `{}`                 | still cause **B**, owner pipeline                                                    |
| 8    | Classify a nested node from a walk recorded before this task        | still cause B — no field, no exemption                                               |
| 9    | Run the CLI on a walk that still holds a real cause A               | **exit 6**, `pipeline: 1`                                                            |

Steps 6 through 9 are the negative controls. Step 9 is the one that matters most: the halt this
task narrows must still fire on the thing it was built for.

## Edge cases

- **`mapped` answered too.** `T-NOJIRA-figma-ingestion-05` added the remote map form —
  `hasTemplate: true` with no snippet. The enclosing instance answered there as well, so its
  children are covered the same way.
- **A walk with no `enclosingOutcome` is an older walk**, not a walk whose instances answered.
  The field is optional in the schema so the corpus stays readable, and absent is never taken
  as an answer.
- **The count does not vanish.** `coveredByEnclosing` is reported; a number that disappears is
  how a count stops meaning anything.
- **Cause B's remedy is _ask the enclosing instance_.** When the enclosing instance was asked
  and answered, the remedy is already done and the finding is noise with an owner attached.

## Result

**Passing**, 2026-10-06. `runs/harness/traverse.mjs` and `runs/harness/classify-unresolved.mjs`
modified in place; the harness gate is **490 tests** and `tsc --noEmit` over seventeen files.
**11 mutations, 0 survivors.**

On the shape `T-NOJIRA-figma-ingestion-04`'s Phase A recorded: **2 unresolved, both cause B,
owner pipeline, exit 6** becomes **0 unresolved, `coveredByEnclosing: 2`, exit 0.**

This is the third defect of one shape in three consecutive tasks — a successful answer read as
a failure — and all three were invisible to the corpus, because nothing in the corpus ever
succeeded. `walk-live-sticky-toc.json` carries fifteen nested nodes and not one of them sits
inside something that resolved.
