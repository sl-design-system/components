---
type: task
schema_version: 1
id: T-NOJIRA-harness-quality-04
title: Boundaries and scenarios for the two scripts that already have tests
description: 'normalise-captures and mode-decision have unit tests but no zod boundary, no negative control and no written scenario — and mode-decision shipped two boundary defects behind 23 green tests'
jira: null
resource: null
status: todo
independent: false
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T00:00:00Z
tags: [harness, zod, testing, use-cases]
source_plan: P-NOJIRA-harness-quality
depends_on: [T-NOJIRA-harness-quality-01]
---

# Boundaries and scenarios for the two scripts that already have tests

## Objective

These two are the reshaped ones, and they are the proof that reshaping is not enough.
`mode-decision.mjs` shipped **two defects behind twenty-three passing tests** — the
discriminator was `external: true` rather than a `name`/`assetKey` pair, and a response arrives
wrapped in the MCP envelope with the payload as an escaped string. The second returned **zero
externals on 60 KB of real data**, which reads as "this file has no dependencies".

A four-line zod schema rejects that same payload with `expected string, received undefined`.

## Steps

1. Write the use cases both scripts were built without, each naming a stored fixture:
   `fixtures/course-files-components.json` and `fixtures/nsp-group-list-components.mcp.json`
   for the mode decision, and named corpus runs for the normaliser.
2. Add a zod boundary to `mode-decision.mjs`. **It must not defeat the streaming** — the script
   streams because one response was 2.18 MB. Validate the **first window only**: enough to
   decide envelope versus bare JSON and to confirm the first component carries
   `dependencies[].external`, then stream the rest.
3. Add a zod boundary to `normalise-captures.mjs` on the index it writes, so a malformed index
   is caught where it is produced rather than where it is read.
4. Negative controls for both: for the mode decision, the envelope that previously yielded zero —
   it must now be **rejected or correctly read, never silently empty**; for the normaliser, a
   capture whose advisory sentinels are absent entirely.

## Acceptance criteria

- A response in either shape is read correctly; a response in **neither** shape is rejected with
  a message naming what was expected.
- The 2.18 MB streaming property is preserved — proved by a fixture large enough that a
  whole-object parse would be visible, and by the existing boundary-spanning test still passing.
- Both scripts have a use case naming a real stored fixture.
- Both negative controls are shown going red.

## Verification

Run both scripts over the corpus and the stored fixtures; the verdicts and the capture counts
must be unchanged from the figures recorded in their tasks — 9 of 19 rendering, 116 advisory
blocks, strict for the NSP file and as-is for Course-files.
