---
type: use-case
schema_version: 1
id: UC-NOJIRA-figma-ingestion-05
title: A map that answered is not an absence, and the report names the id that answered
description: 'Two successful Code Connect responses were read as two different failures, and blamed two different teams'
jira: null
resource: null
status: passing
owner: marcin.ludwig
created: 2026-10-06T00:00:00Z
updated: 2026-10-06T05:00:00Z
tags: [figma, code-connect, traversal, negative-control]
tests_task: T-NOJIRA-figma-ingestion-05
---

# A map that answered is not an absence, and the report names the id that answered

> Verifies [T-NOJIRA-figma-ingestion-05](../../work/NOJIRA-figma-ingestion/05-reader-defects-remote.md).

## Preconditions

- `runs/harness/fixtures/code-connect-descendants.json` — `get_code_connect_map(334:20594)` on
  the remote server, 2026-10-06: three entries for **Mask, Mask and Base/Icon**, all inside the
  node, and **nothing for the node itself**
- `runs/harness/fixtures/code-connect-snippetless.json` — the remote map form: `hasTemplate:
true` with **no `snippet` key**. The Dev Mode server never sends this shape
- `runs/harness/fixtures/code-connect-timed-out.txt` — `{}` with the remote server's own
  `Note: the Code Connect lookup timed out` appended
- `runs/2026-10-01-a8-nsp-group-list/captures/metadata/334-20573.txt` — a8's real metadata, which
  holds `<instance id="334:20593" name="sl-avatar">` and `<frame id="334:20594" name="sl-avatar">`
- `runs/captures/a8-nsp-group-list/rest/nodes-334-20573.json` — the document model that settles
  which of those two is an instance
- `scripts/connect-figma-components/src/` — the inventory the classifier matches against

Both JSON fixtures carry a `_provenance` key. Non-id keys are read as annotations, which is why
a reconstruction can say in the file that it is one.

## Scenario

| Step | Action                                                                     | Expected result                                                   |
| ---- | -------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 1    | Classify the descendants response against the node it was asked about      | `mapped`, `resolvedBy` naming the descendant                      |
| 2    | Give that response a descendant in the nested `I…;…` form the server emits | still matched, by segment                                         |
| 3    | Classify the snippetless response                                          | `mapped`, **not** refused                                         |
| 4    | Compare it against an `hasTemplate: false` entry                           | the two outcomes differ                                           |
| 5    | Walk a design whose instance gets the descendants response                 | disposition `mapped`, no descent recorded, children still visited |
| 6    | Run `classify-unresolved.mjs` over that walk, strict mode                  | the node is **not in the unresolved list**                        |
| 7    | Run `traverse.mjs` with no `--endpoint`                                    | **exit 2**                                                        |
| 8    | Read `report.endpoint` after a run                                         | the server that answered, or `null`                               |
| 9    | Give a node's own entry **and** a mapped descendant                        | the node's own entry wins                                         |
| 10   | Give a descendant whose entry is `hasTemplate: false`                      | still `empty` — it says nothing about the node                    |
| 11   | Give an empty map and no descendants                                       | `empty`, and **no second metadata call**                          |
| 12   | Give a malformed entry, a JSON array, and prose                            | each still `unreadable`                                           |

Steps 7 and 9 through 12 are the negative controls. Step 12 is the refusal the fix had to leave
standing: the old reader refused the _map form_, which was wrong, and it must still refuse a
shape that is genuinely neither.

## Edge cases

- **The map answers about a subtree the walk has not seen.** `get_metadata` stops at instance
  boundaries, so at the moment the question is asked the children do not exist yet. They are
  fetched then — through a cache, so it stays the one call the frontier was going to make.
- **An empty map is not worth a second call.** Nothing can be settled by descendants of a
  response that holds no entries, and under `--max-nodes` the walk may never reach that node.
- **`mapped` does not stop the walk.** There is no snippet to stop with, so the content still has
  to come from the children. It differs from `descended` only in not being unresolved — which is
  the entire point.
- **The node the task named is a frame.** `334:20594` is a `FRAME` named `sl-avatar` sitting next
  to the `INSTANCE` named `sl-avatar`; frames are not probed, so it never reached the unresolved
  list. The verification ran on `334:20593`, which does.

## Result

**Passing**, 2026-10-06. `runs/harness/traverse.mjs` modified in place; the harness gate is
**452 tests** and `tsc --noEmit` over seventeen files. **19 mutations, 0 survivors.**

Measured against the reader at `dc100e98a`, on a8's own metadata:

| The response                    | Before                                                 | After                             |
| ------------------------------- | ------------------------------------------------------ | --------------------------------- |
| answered about descendants only | `genuinely-unmapped` → **cause E, design system team** | `mapped`, `resolvedBy: 334:20605` |
| `hasTemplate: true`, no snippet | `map-unreadable` → **cause A, the pipeline**           | `mapped`, `resolvedBy: 334:20593` |

Through the classifier, **21 unresolved becomes 20** and the node is in neither list. The task
described these as one failure; they are two, and they sent the same successful answer to two
different teams.
