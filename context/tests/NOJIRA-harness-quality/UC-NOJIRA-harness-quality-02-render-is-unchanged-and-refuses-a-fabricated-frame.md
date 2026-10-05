---
type: use-case
schema_version: 1
id: UC-NOJIRA-harness-quality-02
title: Decomposing the renderer changes no bytes, and it stops inventing a frame
description: 'The instrument that produces 9 of 19 must survive its own refactor unchanged, and must refuse the run whose frame it currently fabricates'
jira: null
resource: null
status: passing
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T00:00:00Z
tags: [harness, render, negative-control]
tests_task: T-NOJIRA-harness-quality-02
---

# Decomposing the renderer changes no bytes, and it stops inventing a frame

> Verifies [T-NOJIRA-harness-quality-02](../../work/NOJIRA-harness-quality/02-render-design.md).

## Preconditions

All nineteen runs under `runs/2026-10-01-*` with their `captures-v2/` indexes, as produced by
`normalise-captures.mjs --all --write --out-dir captures-v2`. Named anchors:

- `2026-10-01-a2-nsp-class-overview` — 8 of 8 regions transform;
- `2026-10-01-a6-itsl-collab-shared-folder` — 0 of 3, two on `Unterminated regular expression`
  and one on `Unexpected end of file before a closing "div" tag`;
- `2026-10-01-a9-sanna-login` — metadata begins with prose, so the frame is **declared on line 3
  and the reader never looked there**. Corrected during the run: the premise below said no frame
  was declared; it is.

## Scenario

| Step | Action                                                                                              | Expected result                                                      |
| ---- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 1    | Before touching the script, run it over all nineteen with `--index captures-v2` and keep the output | the kept before-state                                                |
| 2    | Decompose into exported functions; run the same nineteen again                                      | **byte-identical** to step 1, `capturedAt` excepted                  |
| 3    | Unit-test each exported function in isolation                                                       | each fails when its function is broken                               |
| 4    | Feed geometry a fixture with known offsets                                                          | placement matches the offsets exactly                                |
| 5    | Feed a malformed `captures/index.json`                                                              | **reported, never scored**                                           |
| 6    | Run against `a9-sanna-login`, whose frame is undeclared                                             | the run is **named as undeclared**, not measured against `1440×1024` |

Step 6 is the negative control. Before this run the script silently substituted a hardcoded
`1440×1024`, and the count was **six runs, not three** — `a4`, `a5`, `a9`,
`b-itsl-collab-add-element`, `b-nsp-home` and `b-sanna-account-creation`.

Because every one of those six turned out to declare a root box, the control had to be built from
a **fixture with the root deliberately removed** (`fixtures/metadata-no-root.txt`) rather than
from a corpus run. A control anchored to `a9` would now pass for the wrong reason.

## Edge cases

- `capturedAt` is the run directory's mtime and restamps on every write, so it is the one field
  excluded from the byte comparison. Excluding anything else invalidates step 2.
- `a1-kampus-subchapter-feed` transforms 7 of 10 regions while three are agent prose. A healthy
  region count is not evidence the run is sound, and step 2 must not be read as one.

## Result

**Passing**, 2026-10-05.

| Step | Outcome                                                                                                                                                                                                                                                               |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Before-state kept for all nineteen: sixteen HTML documents and reports, three runs exiting 1 with no design-context block                                                                                                                                             |
| 2    | **16/16 byte-identical**, 16/16 reports identical, three stderr identical — measured with the frame fix pinned back, so the comparison isolates the decomposition                                                                                                     |
| 3    | 83 unit tests over 24 exported functions. Every function was **mutation-checked**: a plausible wrong edit to each one fails at least one test. Three survived the first pass (`readRegions`, `CodeConnectSnippet`, `buildReport`) and gained tests until they did not |
| 4    | `fixtures/metadata-nested-offsets.txt`: `1:3` is two levels deep at a hand-derived absolute `(115, 255)`, frame origin `(100, 200)`, so `left:15px;top:55px` — asserted exactly                                                                                       |
| 5    | `fixtures/index-malformed.json` (an entry with no `file`) is **rejected by zod at the read boundary**; the old reader skipped it and reported a smaller number                                                                                                        |
| 6    | The probe **exits 3** on an undeclared frame, writes no file, and names the run. `--allow-fabricated-frame` overrides and the report still carries `frameDeclared: false`                                                                                             |

The fix the control provoked: all six fabricated-frame runs did declare a root, so six frames were
corrected (`a4` 1280×1796, `a5` 1440×2032, `a9` and `b-sanna-account-creation` 1512×982,
`b-itsl-collab-add-element` 1280×768, `b-nsp-home` 1280×877) and the other ten runs' output did not
move a byte. **Zero of nineteen are now scored against a fabricated frame.**
