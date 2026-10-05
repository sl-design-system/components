---
type: task
schema_version: 1
id: T-NOJIRA-harness-quality-04
title: Boundaries and scenarios for the two scripts that already have tests
description: 'normalise-captures and mode-decision have unit tests but no zod boundary, no negative control and no written scenario — and mode-decision shipped two boundary defects behind 23 green tests'
jira: null
resource: null
status: done
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

## Outcome

Delivered 2026-10-05. Both scripts keep their behaviour on every stored input; what changed is
that a response in a shape neither of them understands no longer scans quietly to zero.

**`mode-decision.mjs` — the first window, and nothing more.** `readFirstWindow` reads exactly
65536 bytes however large the file is, `inspectFirstWindow` decides envelope versus bare and
zod-validates the first component in either, and the scan proceeds unchanged. Proved on a 408 KB
fixture whose only external sits 200 KB past the validated window: the window declares none, and
the scanner still finds `sl-button-pill`.

**The defect that shipped is now a check, not only a schema.** When the window declares
`"external": true` and the scan finds none in the whole file, `decide` throws _"the reader is
wrong, not the file"_. A schema alone would not have caught the first of the two 2026-10-05
defects — the response was well-formed and the pattern was wrong — and `undecided` is what that
looks like from outside.

**`normalise-captures.mjs` — validated where it is produced.** `validateIndex` runs before the
index is written and before it is returned, naming the run and the field. It is a separate
exported function because a correct producer cannot be made to emit a malformed index, so the
check could not otherwise be tested on one.

**The schema rejected real data on its first run, and was right.** Nineteen reference entries
carry **no `part`** — `get_screenshot` is neither code nor advisory — and three continuations
carry `continuationOf`. Both are now in the schema. The missing `part` is why
`render-design.mjs` must default it; the producer could remove that defaulting rule, but doing so
rewrites nineteen committed indexes, so it is recorded rather than done.

**Two schemas, deliberately.** The producer's is `.strict()` and describes the artifact; the
reader's in `render-design.mjs` validates only what it dereferences, so an older or hand-written
index still reads. A test asserts all nineteen committed indexes satisfy both — that assertion is
the only thing stopping them drifting apart.

**Mutation-checked: 21 mutations across the new code.** Four survived and gained tests. One of
them exposed a test passing for the wrong reason — the strictness control removed a required
field as well as adding an unknown one, so it would have passed against a permissive schema.

Figures re-measured after the change, all unchanged: **9 of 19** runs transform every region,
**59 of 71** regions, **116** advisory blocks, **267** captures, Course-files `as-is`, NSP
`strict`. One field was added to the verdict: `shape`.

## Verification

Run both scripts over the corpus and the stored fixtures; the verdicts and the capture counts
must be unchanged from the figures recorded in their tasks — 9 of 19 rendering, 116 advisory
blocks, strict for the NSP file and as-is for Course-files.
