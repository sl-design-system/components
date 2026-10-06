---
type: task
schema_version: 1
id: T-NOJIRA-figma-ingestion-08
title: A node inside a resolved instance is not an unresolved node
description: 'The traversal records that the enclosing instance answered; the classifier files the children as pipeline bugs anyway, and the CLI halts on them'
jira: null
resource: null
status: todo
independent: false
owner: marcin.ludwig
created: 2026-10-06T00:00:00Z
updated: 2026-10-06T00:00:00Z
tags: [figma, code-connect, classification, defect]
source_plan: P-NOJIRA-figma-ingestion
depends_on: [T-NOJIRA-figma-ingestion-05]
---

# A node inside a resolved instance is not an unresolved node

## Objective

`T-NOJIRA-figma-ingestion-04`'s Phase A found a third reader defect of the same family as the
two `T-NOJIRA-figma-ingestion-05` fixed: **a successful answer read as a failure.** This one
decides whether any of the fourteen can convert at all.

Measured 2026-10-06 on a8's own shape, with the Code Connect response the remote server really
sent:

```
334:20593              resolved   —                        SL Design System
I334:20593;334:20605   nested     nested-id-not-probeable  answered by 334:20593: resolved
I334:20593;334:20609   nested     nested-id-not-probeable  answered by 334:20593: resolved

classified as-is → unresolved: 2
  I334:20593;334:20605   cause B nested-id-rejected | owner pipeline
  I334:20593;334:20609   cause B nested-id-rejected | owner pipeline
```

**The traversal gets it right and the classifier throws the answer away.** `record` carries
`detail: "answered by 334:20593: resolved"`; `diagnose` branches on `reason` alone and returns
cause B unconditionally.

Cause B's own remedy is _"ask the enclosing instance; the server does not accept this id"_. The
enclosing instance **was** asked and **did** answer, with a snippet that is this subtree's
content. The remedy is already done, and the finding is noise with an owner attached to it.

### Why this blocks the probe

`classify-unresolved.mjs` **exits 6 when any node is owned by the pipeline**. Every resolved
instance that contains nested ids therefore produces a non-zero exit — which is a halt, for
nodes whose content the snippet already delivered.

In the recorded corpus the case is almost absent: `walk-live-sticky-toc.json` has 15 nested nodes
and **none** under a resolved instance, because that walk resolved nothing — all 13 of its map
calls came back unreadable. The defect was invisible for exactly the reason
`T-NOJIRA-figma-ingestion-05`'s two were: nothing had ever succeeded against the server being
used.

Now things resolve. a8's `334:20578` alone returns **five snippets**, and `sl-avatar` has three
nested children. Fourteen designs of that shape is a non-zero exit everywhere, and
`T-NOJIRA-figma-ingestion-04` cannot report a conversion count through it.

### The one place this is already wrong on disk

`runs/harness/fixtures/walk-five-causes.json` holds one nested node under a resolved instance,
and `T-NOJIRA-figma-ingestion-03`'s test asserts `{ A: 1, B: 1, D: 2, E: 2 }` — that **B: 1** is
this defect, written into an expectation. The fixture is a real shape and stays; the expectation
is what changes, and the task that wrote it is `done`, so the correction is recorded here.

## Steps

1. **A nested node inherits its enclosing instance's verdict, including success.** The traversal
   already records which id answered and what it said. Carry it as a field rather than only
   inside a prose `detail` — `detail` is for a reader, and a classifier that parses prose is the
   next defect of this kind.
2. `classify` does not list a nested node whose enclosing instance **resolved** or was **mapped**.
   It is not unresolved; there is nothing for anyone to do about it.
3. **Keep cause B for the case it was written for**: a nested node whose enclosing instance did
   not answer. That is still a real pipeline limitation and still ours.
4. Re-count `walk-five-causes.json` against the fixture rather than against the old expectation,
   and say in the test which number moved and why.

## Acceptance criteria

- A nested node under a **resolved** instance does not appear in the unresolved list, and the
  walk still records that it was nested and which id answered for it.
- A nested node under a **mapped** instance — `T-NOJIRA-figma-ingestion-05`'s outcome, no
  snippet — is treated the same way, because the enclosing instance answered there too.
- A nested node under an instance that did **not** answer is still cause B, owner pipeline.
  The negative control survives the fix.
- The classifier reads a structured field, not the prose in `detail`. A test proves it by
  changing the prose and leaving the verdict unmoved.
- On a walk where everything that resolved contains nested children, the CLI **exits 0**.

## Verification

Re-run the Phase A shape recorded in `T-NOJIRA-figma-ingestion-04`: `334:20593` resolves with a
snippet, its two nested children are recorded as nested, and `classify` returns **zero**
unresolved nodes instead of two owned by the pipeline.

Then re-run `walk-five-causes.json` and report the new distribution against `{ A: 1, B: 1, D: 2,
E: 2 }`, naming the entry that left and why.
