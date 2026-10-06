---
type: use-case
schema_version: 1
id: UC-NOJIRA-figma-ingestion-09
title: One situation, one finding, one owner
description: 'An instance and the ids inside it that the server refuses are one thing; they were being reported as two, with different owners and different remedies'
jira: null
resource: null
status: passing
owner: marcin.ludwig
created: 2026-10-06T00:00:00Z
updated: 2026-10-06T14:00:00Z
tags: [figma, code-connect, classification, negative-control]
tests_task: T-NOJIRA-figma-ingestion-09
---

# One situation, one finding, one owner

> Verifies [T-NOJIRA-figma-ingestion-09](../../work/NOJIRA-figma-ingestion/09-nested-inherits-the-diagnosis.md).

## Preconditions

- `runs/harness/fixtures/walk-live-sticky-toc.json` — a **live** traversal of one symbol:
  34 nodes, **15 nested against 13 descents**, and nothing in it resolved, because all 13 map
  calls came back unreadable against the Dev Mode server
- `runs/harness/fixtures/walk-five-causes.json` — a walk whose one nested node sits inside an
  instance that resolved with a snippet
- `runs/probe-04/README.md` — the shape this task exists for: an as-is design whose instance
  returned `{}` and whose child was being billed to the pipeline
- `scripts/connect-figma-components/src/` — this repository's own mappings

## Scenario

| Step | Action                                                                 | Expected result                                                        |
| ---- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 1    | Classify a nested node under an instance diagnosed **another library** | absent; `{ C: 1 }`, owner `nobody`                                     |
| 2    | …under one diagnosed **unreadable**                                    | absent; `{ A: 1 }`                                                     |
| 3    | …under one diagnosed **a missing mapping**, strict                     | absent; owner `design-system-team`                                     |
| 4    | …under one that **resolved** or was **mapped**                         | absent, as `T-NOJIRA-figma-ingestion-08` already had it                |
| 5    | Put three nested ids under one instance                                | the finding says `nestedBelow: 3`, the report `nestedWithEnclosing: 3` |
| 6    | Run the as-is case through the CLI                                     | **exit 0**, `byOwner { nobody: 1 }`                                    |
| 7    | Replay `walk-live-sticky-toc.json`                                     | **28 unresolved becomes 13**, `nestedWithEnclosing: 15`                |
| 8    | Classify a nested id with **no** enclosing instance                    | cause **B**, owner pipeline, exit 6                                    |
| 9    | Classify one from a walk recorded before 08, carrying no field         | cause **B** — absent is never an exemption                             |
| 10   | Check `coveredByEnclosing` where the instance answered `{}`            | **0**, while `nestedWithEnclosing` is 2                                |
| 11   | Put an orphan whose outermost segment collides with a real node's id   | the count goes to the real node, not the orphan                        |

Steps 8 through 11 are the negative controls. Steps 10 and 11 exist because mutation found them
and no test did.

## Edge cases

- **An orphan is a hole in the traversal, not a property of the design.** A `;` id the walk met
  and found no parent for means the walk lost track, which is ours and should halt.
- **`empty` is not an answer.** An instance that returned `{}` has a finding — cause C or D or E
  — and that finding covers its children, but `coveredByEnclosing` still counts zero, because
  nothing was delivered.
- **Zero is written, not omitted.** `nestedBelow: 0` on a finding means none sat below it; an
  absent field would leave a reader guessing which.
- **Cause A still halts, and should.** The sticky-toc walk exits 6 after this task because its
  thirteen maps were never read — the 31-second Dev Mode plateau. Nothing about that design is
  known, and a count taken from it would be a floor rather than a figure.

## Result

**Passing**, 2026-10-06. `runs/harness/classify-unresolved.mjs` modified in place; the harness
gate is **499 tests** and `tsc --noEmit` over seventeen files. **9 mutations, 0 survivors.**

|        | `byCause`        | `byOwner`                    |  Exit |
| ------ | ---------------- | ---------------------------- | ----: |
| before | `{ B: 1, C: 1 }` | `{ nobody: 1, pipeline: 1 }` | **6** |
| after  | `{ C: 1 }`       | `{ nobody: 1 }`              | **0** |

`walk-live-sticky-toc.json`: **28 unresolved becomes 13.** The thirteen are cause A and the walk
still exits 6, which is right — those maps were never read.

This is the fourth defect of one shape in five tasks, and what bounds the chain is countable
rather than hopeful: a finding is one of five causes, only A and B halt in an as-is file, B is
now the orphan alone, and A means the map was genuinely unreadable. There is no sixth cause.
