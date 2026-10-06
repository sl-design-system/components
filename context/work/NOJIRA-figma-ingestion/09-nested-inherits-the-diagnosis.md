---
type: task
schema_version: 1
id: T-NOJIRA-figma-ingestion-09
title: A nested node is never its own finding
description: 'Its enclosing instance is already diagnosed; the child carries a second story with a different owner and a halt attached'
jira: null
resource: null
status: done
independent: false
owner: marcin.ludwig
created: 2026-10-06T00:00:00Z
updated: 2026-10-06T14:00:00Z
tags: [figma, code-connect, classification, defect]
source_plan: P-NOJIRA-figma-ingestion
depends_on: [T-NOJIRA-figma-ingestion-08]
commit: 0c9ac7e25
---

# A nested node is never its own finding

## Objective

`T-NOJIRA-figma-ingestion-08` stopped a nested node being a finding when its enclosing instance
**answered**. `T-NOJIRA-figma-ingestion-04`'s Phase A then found the other half: when the
enclosing instance did **not** answer, the child is still cause B, owner pipeline, and still
halts — in a design where the parent is already diagnosed as something else.

Measured 2026-10-06, an as-is file whose instance came back `{}`:

```
as-is → {"B nested-id-rejected": 1, "C another-library": 1}
        byOwner {"nobody": 1, "pipeline": 1}   → exit 6
```

Two findings about one situation, with two owners and two remedies. The parent says _another
library, reproduce it as-is and count it_ — nobody's problem. The child says _ask the enclosing
instance_ — ours, and the CLI halts on it. **The enclosing instance was asked. `{}` is what the
parent's own diagnosis already explains.**

### The generalisation 08 only half made

A nested id is a **property of the tree**, not a finding about it. The server emits
`I334:20593;334:20605` and refuses it; that is worth knowing and it is worth counting, and it is
never a separate thing for a person to act on, because the node it sits inside has already been
diagnosed — resolved, mapped, unreadable, another library, or a missing mapping. Every one of
those five answers covers the child.

So the rule is simpler than inheriting a cause: **a nested node with an enclosing instance is
not listed at all, and the enclosing instance's finding carries how many sat beneath it.** 08
already did this for two of the five outcomes; this does it for the rest.

The one case that stays cause B is a nested id with **no enclosing instance recorded** — an
orphan, which means the walk met a `;` id it never found a parent for. That is a real gap in
the traversal and still ours.

### Why this blocks the count

`classify-unresolved.mjs` exits 6 on any pipeline-owned node. In an as-is design **A and B are
the only two causes that can halt**, and A is a genuine retrieval failure. So B is the last
thing standing between the **ten as-is designs** and a conversion count.

Four strict designs are a different question and not this one: there the mapping gaps are real
and belong to the design system team, and routing them there is correct behaviour.

### The fourth of one shape

| Task | The answer                                             | What it was read as         |
| ---- | ------------------------------------------------------ | --------------------------- |
| 05   | the map answered about descendants                     | cause E, design system team |
| 05   | `hasTemplate: true` with no snippet                    | cause A, the pipeline       |
| 08   | the enclosing instance resolved with a snippet         | cause B, the pipeline       |
| 09   | the enclosing instance was diagnosed as something else | cause B, the pipeline       |

## Steps

1. **A nested node with an enclosing instance is not in the unresolved list.** Whatever the
   enclosing instance's outcome, it has a finding of its own and that finding is the answer.
2. **The enclosing instance's finding says how many nested ids sat beneath it.** The count must
   not vanish — it is the measure of how much of the design the server will not let us ask
   about, and `T-NOJIRA-figma-ingestion-02` recorded 15 of 34 nodes on one symbol.
3. **Keep cause B for an orphan.** A `;` id the walk recorded with no enclosing instance is a
   hole in the traversal, owned by the pipeline, and still halts.
4. Report the total separately as well, so a reader does not have to add up findings to learn
   how many ids were unaskable.

## Acceptance criteria

- A nested node whose enclosing instance was diagnosed — **any** of the five outcomes — does not
  appear in the unresolved list.
- The enclosing instance's finding carries the number of nested ids beneath it, and the report
  carries the total.
- A nested node with **no** enclosing instance is still cause B, owner pipeline, and still
  exits 6. The negative control survives.
- An as-is walk whose findings are cause C and nested children of those **exits 0**.
- `T-NOJIRA-figma-ingestion-08`'s `coveredByEnclosing` keeps meaning what it meant, or the task
  that changes it says so in writing.

## Verification

The shape `T-NOJIRA-figma-ingestion-04`'s Phase A recorded: an as-is file, an instance whose map
returned `{}`, one nested child. **`byCause` is `{ C: 1 }`, `byOwner` is `{ nobody: 1 }`, and the
CLI exits 0** — against `{ B: 1, C: 1 }`, `{ nobody: 1, pipeline: 1 }` and exit 6 today.

Then re-run `walk-live-sticky-toc.json`, which carries **15 nested nodes against 13 descents**,
and report what its distribution becomes. That walk resolved nothing, so every one of its nested
nodes sits under an unreadable parent — it is the sharpest case this task has, and it is on disk.

## Result

`runs/harness/classify-unresolved.mjs`, modified in place. The harness gate is **499 tests** and
`tsc --noEmit` over seventeen files. **9 mutations, 0 survivors.**

On the shape `T-NOJIRA-figma-ingestion-04`'s Phase A recorded — an as-is file, an instance whose
map returned `{}`, one nested child:

|        | `byCause`        | `byOwner`                         |  Exit |
| ------ | ---------------- | --------------------------------- | ----: |
| before | `{ B: 1, C: 1 }` | `{ nobody: 1, pipeline: 1 }`      | **6** |
| after  | `{ C: 1 }`       | `{ nobody: 1 }`, `nestedBelow: 1` | **0** |

### The five criteria

| Criterion                                                                            | How it is shown                                                                                                           |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| A nested node under a diagnosed instance is absent, for **any** of the five outcomes | one test per outcome: another library, unreadable, a missing mapping, and 08's resolved and mapped                        |
| The finding says how many sat beneath it, and the report carries the total           | `nestedBelow` per finding, `nestedWithEnclosing` in `counts`; zero is written rather than omitted                         |
| An orphan is still cause B, owner pipeline, and still exits 6                        | the control, plus a second for a walk recorded before 08 that carries no field at all                                     |
| An as-is walk of another library and its nested ids **exits 0**                      | asserted through the CLI                                                                                                  |
| 08's `coveredByEnclosing` keeps its meaning                                          | asserted directly — 2 where the instance answered, **0** where it returned `{}`, while `nestedWithEnclosing` is 2 in both |

### The sharpest case on disk

`walk-live-sticky-toc.json` carries **15 nested nodes against 13 descents, and nothing in it
resolved** — all 13 map calls came back unreadable against the Dev Mode server.

**28 unresolved becomes 13.** The thirteen that remain are cause A, owner pipeline, and the walk
still exits 6 — correctly. That is the 31-second plateau `T-NOJIRA-figma-ingestion-02` measured:
the map was never read, so nothing about that design is known. Cause A is doing exactly its job,
and the remote server does not have that plateau.

### The prediction this task made about itself

Its Objective says this is **the last thing between the ten as-is designs and a conversion
count**, because in an as-is design only causes A and B can halt and A is a genuine retrieval
failure. B is now the orphan only.

**That is still a prediction.** It is not confirmed by this task and must not be read as such:
no as-is design of the fourteen has been walked yet. What the sticky-toc replay does show is the
shape of the thing that could still falsify it — a design whose maps cannot be read is cause A
all the way down, and it halts. Against the remote server, which answers in under a second,
that should be rare. `T-NOJIRA-figma-ingestion-04` is where it is settled either way.

### Two mutations survived before this was finished

- **A disposition guard with no behaviour behind it.** `node.disposition === 'nested' && …` —
  only nested nodes carry `enclosingOutcome`, so the first half never decided anything. The
  predicate is now the field alone, as `answeredByEnclosing` already was.
- **A per-finding count keyed by `probedAs` rather than `id`.** They are the same for every node
  the classifier reports **except an orphan**, whose `probedAs` is its own outermost segment and
  can collide with a real node's id. A walk holding both now proves the attribution.

Both were found by mutation and neither by a failing test, which is the argument for the driver.

### The fourth of one shape, and what bounds the chain

| Task | The answer                                             | What it was read as         |
| ---- | ------------------------------------------------------ | --------------------------- |
| 05   | the map answered about descendants                     | cause E, design system team |
| 05   | `hasTemplate: true` with no snippet                    | cause A, the pipeline       |
| 08   | the enclosing instance resolved with a snippet         | cause B, the pipeline       |
| 09   | the enclosing instance was diagnosed as something else | cause B, the pipeline       |

Four defects, one shape: **a successful or already-explained answer read as a failure.** All
four were invisible to the recorded corpus and all four needed a server that answers.

What bounds it is countable rather than hopeful: a finding is one of five causes, A and B are
the only two that halt in an as-is file, cause A is now the only one of the two that can fire
for a node the walk actually probed, and cause A firing means the map was genuinely unreadable.
There is no sixth cause to find.
