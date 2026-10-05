---
type: use-case
schema_version: 1
id: UC-NOJIRA-harness-quality-04
title: Both response shapes are read, a third is refused, and the stream survives
description: 'The envelope that silently yielded zero externals must never yield zero again — and the fix must not defeat the streaming the script exists for'
jira: null
resource: null
status: passing
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

Four more fixtures were added by this task, each for a case the corpus does not hold:
`components-wrong-shape.json` (a third shape), `components-envelope-unreadable.json` (an envelope
whose payload is prose), `components-large-streaming.json` (408 KB, 6.4 windows, its only external
past the first window) and `capture-no-advisories.txt` (a clean capture with none of the five
sentinels).

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

**Passing**, 2026-10-05.

| Step | Outcome                                                                                                                                                                                            |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | `as-is`, `shape: bare`, externals `.Main menu`, `.Navigation item`, `Cell`, `your-files` — unchanged                                                                                               |
| 2    | `strict`, `shape: envelope`, 7 `sl-*` — unchanged                                                                                                                                                  |
| 3    | `components-wrong-shape.json` is refused, the message naming **both** shapes expected; an envelope whose payload is prose, and one whose payload is not a component list, are refused separately   |
| 4    | `components-large-streaming.json`: 408 KB read, `readFirstWindow` returns exactly 65536 bytes, the window declares **no** external, and the scanner still finds `sl-button-pill` 200 KB further in |
| 5    | 19 runs, **267 captures, 116 advisory blocks**, summary byte-identical to the before-state                                                                                                         |
| 6    | `capture-no-advisories.txt` yields one `code` block and no advisories, code byte-identical                                                                                                         |

**The historical defect is now a check, not only a schema.** When the first window declares
`"external": true` and the scanner finds none in the whole file, `decide` throws
_"the reader is wrong, not the file"_ rather than returning `undecided`. The two are
indistinguishable in the output, and that is exactly how the original defect read as a result.

Corpus figures re-measured after the change and all unchanged: **9 of 19** runs transform every
region, **59 of 71** regions, **116** advisory blocks, **267** captures.

### What the producer schema found on its first run

It rejected real data immediately, and was right to: the index holds two shapes the schema as
first written did not allow. **Nineteen reference entries carry no `part` at all** —
`get_screenshot` is neither code nor advisory, and carries a `note` instead — and **three
continuation entries carry `continuationOf`**. Both are now in the schema, and the missing `part`
is recorded as the reason `render-design.mjs` has to default it.
