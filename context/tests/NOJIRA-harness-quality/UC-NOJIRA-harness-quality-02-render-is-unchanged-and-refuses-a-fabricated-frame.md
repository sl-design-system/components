---
type: use-case
schema_version: 1
id: UC-NOJIRA-harness-quality-02
title: Decomposing the renderer changes no bytes, and it stops inventing a frame
description: 'The instrument that produces 9 of 19 must survive its own refactor unchanged, and must refuse the run whose frame it currently fabricates'
jira: null
resource: null
status: draft
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
- `2026-10-01-a9-sanna-login` — metadata begins with prose, so no frame is declared.

## Scenario

| Step | Action                                                                                              | Expected result                                                      |
| ---- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 1    | Before touching the script, run it over all nineteen with `--index captures-v2` and keep the output | the kept before-state                                                |
| 2    | Decompose into exported functions; run the same nineteen again                                      | **byte-identical** to step 1, `capturedAt` excepted                  |
| 3    | Unit-test each exported function in isolation                                                       | each fails when its function is broken                               |
| 4    | Feed geometry a fixture with known offsets                                                          | placement matches the offsets exactly                                |
| 5    | Feed a malformed `captures/index.json`                                                              | **reported, never scored**                                           |
| 6    | Run against `a9-sanna-login`, whose frame is undeclared                                             | the run is **named as undeclared**, not measured against `1440×1024` |

Step 6 is the negative control. Today the script silently substitutes a hardcoded `1440×1024`,
so three runs' geometry is scored against a **fabricated frame** and nothing in the output says
so.

## Edge cases

- `capturedAt` is the run directory's mtime and restamps on every write, so it is the one field
  excluded from the byte comparison. Excluding anything else invalidates step 2.
- `a1-kampus-subchapter-feed` transforms 7 of 10 regions while three are agent prose. A healthy
  region count is not evidence the run is sound, and step 2 must not be read as one.

## Result

Not yet run.
