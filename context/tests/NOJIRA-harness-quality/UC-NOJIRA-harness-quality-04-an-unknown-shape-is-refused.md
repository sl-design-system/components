---
type: use-case
schema_version: 1
id: UC-NOJIRA-harness-quality-04
title: Both response shapes are read, a third is refused, and the stream survives
description: 'The envelope that silently yielded zero externals must never yield zero again — and the fix must not defeat the streaming the script exists for'
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T00:00:00Z
tags: [harness, zod, negative-control, mode-decision]
tests_task: T-NOJIRA-harness-quality-04
---

# Both response shapes are read, a third is refused, and the stream survives

> Verifies [T-NOJIRA-harness-quality-04](../../work/NOJIRA-harness-quality/04-retrofit-boundaries.md).

## Preconditions

Two captured responses, both live from Figma on 2026-10-05:

- `runs/harness/fixtures/course-files-components.json` — bare JSON, 13 components, externals
  `Cell` (9 of the 13), `.Main menu`, `.Navigation item`, `your-files`, zero `sl-*`;
- `runs/harness/fixtures/nsp-group-list-components.mcp.json` — the MCP envelope, payload as an
  escaped string, 7 distinct `sl-*`.

And the corpus for the normaliser: nineteen runs, 116 advisory blocks, 9 of 19 rendering.

## Scenario

| Step | Action                                                          | Expected result                                   |
| ---- | --------------------------------------------------------------- | ------------------------------------------------- |
| 1    | Classify the bare fixture                                       | `as-is`, the four externals named                 |
| 2    | Classify the envelope fixture                                   | `strict`, 7 `sl-*` named                          |
| 3    | Feed a response in **neither** shape                            | rejected, with a message naming what was expected |
| 4    | Feed a 2.18 MB-scale response                                   | still streamed; no whole-object parse             |
| 5    | Re-run the normaliser over all nineteen                         | 116 advisory blocks, 0 contaminated code captures |
| 6    | Feed the normaliser a capture with no advisory sentinels at all | handled as no advisories, not as a parse failure  |

Step 3 is the negative control and the whole reason for the task. Before the boundary existed,
the envelope in step 2 returned **zero externals on 60 KB of real data** and reported that as a
result — which reads as "this file has no dependencies".

Step 4 is the constraint the plan review surfaced: the script streams precisely so that 2.18 MB
never lands in memory, so validation covers the **first window only** — enough to tell envelope
from bare JSON and to confirm the first component carries `dependencies[].external`.

## Edge cases

- A dependency name landing across the 64 KiB window boundary must still be found; the existing
  70 KB-padded test covers it and must keep passing.
- An empty Code Connect result stays `undecided`, never `as-is`. It is five causes wearing one
  symptom and only one of them means another library.

## Result

Not yet run.
