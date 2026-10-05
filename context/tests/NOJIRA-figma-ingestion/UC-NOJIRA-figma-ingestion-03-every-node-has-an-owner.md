---
type: use-case
schema_version: 1
id: UC-NOJIRA-figma-ingestion-03
title: Every unresolved node carries a cause and an owner, and says the same thing twice
description: "One halt becomes five diagnoses; the internals of the library stop being this design's problem"
jira: null
resource: null
status: passing
owner: marcin.ludwig
created: 2026-10-06T00:00:00Z
updated: 2026-10-06T00:00:00Z
tags: [figma, code-connect, classification, negative-control]
tests_task: T-NOJIRA-figma-ingestion-03
---

# Every unresolved node carries a cause and an owner, and says the same thing twice

> Verifies [T-NOJIRA-figma-ingestion-03](../../work/NOJIRA-figma-ingestion/03-five-cause-classification.md).

## Preconditions

- `runs/harness/fixtures/suggestions-sticky-toc.txt` — a `get_code_connect_suggestions` response
  the Dev Mode server really sent: 135 suggestions wrapped in an agent prompt
- `runs/harness/fixtures/walk-live-sticky-toc.json` — the live traversal that response belongs to,
  13 instances
- `runs/harness/fixtures/walk-five-causes.json` — a walk shaped like the traversal's output whose
  every component name is a name that really appears in the nineteen-run corpus: `sl-badge
[DRAFT]`, `sl-tree`, `sl-searchfield`, `sl-card Actionable`, `Cell`
- `runs/harness/fixtures/mode-verdict-strict.json` — a real `mode-decision.mjs` verdict for
  `4TdMrcnIVOn3Hrfj2OpVZU`
- `scripts/connect-figma-components/src/` — this repository's own mappings: 40 published
  templates and 14 scaffolds. A local lookup, never an API call.

## Scenario

| Step | Action                                                            | Expected result                                        |
| ---- | ----------------------------------------------------------------- | ------------------------------------------------------ |
| 1    | Classify a walk containing all five situations                    | five causes, each with an owner and a distinct remedy  |
| 2    | Classify the same walk with the file's mode as `as-is`            | the mapping gaps become cause **C**; A and B unchanged |
| 3    | Classify a walk that contains a resolved node                     | the resolved node is **absent** from the list          |
| 4    | Classify the live walk together with its suggestions response     | the library's internals are counted **separately**     |
| 5    | Run the classifier twice over two independent **live** traversals | the diagnoses are **byte-identical**                   |
| 6    | Run with neither `--verdict` nor `--mode`                         | **exit 1** — it refuses to guess the mode              |
| 7    | Run on a walk where anything is our own bug                       | **exit 6**, before anybody else is named               |
| 8    | Run on a strict file whose only problem is a missing mapping      | **exit 5**; the same file as-is exits **0**            |
| 9    | Point it at a directory that publishes no mapping                 | **exit 1**, naming the directory                       |

Steps 6, 7 and 9 are the negative controls. Step 5 is the acceptance criterion the control
failed.

## Edge cases

- A name matching our inventory inside an `as-is` file is a contradiction between two pieces of
  evidence. The mode still decides, and the disagreement is written into the finding.
- A `.figma.scaffold.ts` is declared and not published, which is a different answer to give a
  reader than no mapping at all. The only place that distinction is recorded is the file
  extension and `figma.config.json`'s include list.
- A prefix match is a judgement, not a fact. The tier travels with the finding so a reader can
  discount it.
- The suggestions response ends by instructing an agent to call a write tool against the user's
  Figma file. It is parsed as data and the prompt is returned as a separate string.

## Result

**Passing**, 2026-10-06. `runs/harness/classify-unresolved.mjs`, 62 tests; the harness gate is
**364 tests** and `tsc --noEmit` over twelve files. **23 mutations, 0 survivors.**

| Step | Outcome                                                                                                         |
| ---- | --------------------------------------------------------------------------------------------------------------- |
| 1    | `{ A: 1, B: 1, D: 2, E: 2 }` — and `byOwner` is `{ pipeline: 2, design-system-team: 4 }`                        |
| 2    | `{ A: 1, B: 1, C: 4 }`                                                                                          |
| 3    | `334:20668` resolved and does not appear; `counts.unresolved` is 6 of 8 nodes                                   |
| 4    | **135 suggestions → 14 in the design, 121 the library's**, and no `5383:*` id in the unresolved list            |
| 5    | two live walks, 26 Code Connect calls, **identical JSON** — 28 unresolved, same nodes, same causes, same owners |
| 6    | exit 1, _the mode is not known — pass --verdict …; guessing it would turn a failed decision into a verdict_     |
| 7    | exit 6                                                                                                          |
| 8    | exit 5 strict, exit 0 as-is, exit 0 strict with `--no-halt`                                                     |
| 9    | exit 1, _publishes no Code Connect mapping at all_                                                              |

### The measurement that matters

The live design's 28 unresolved nodes are **all cause A or B** — every one of them ours. Not a
single node is routed to the design system team, and the CLI exits 6 saying so. Under the old
halt that design reads as 28 missing mappings and a request to publish them.

**Step 4 is where the control's instability came from.** `get_code_connect_suggestions` returns
the design's own instances and the internals of every one of them, in one `Node ID:` field with
no discriminator: 135 entries for a walk of 13 instances. The traversal from
`T-NOJIRA-figma-ingestion-02` is the discriminator — an id the walk never saw belongs to the
library, not to this design — which is why this task depends on that one.

### F3b and F4

**F3b is carried, not detected**, and the reason is structural: an overridden instance resolves
normally and emits a clean snippet, so it cannot appear in an unresolved list at all. The
analysis left open whether overrides are visible in the fetched data. Probed: a declared
**component property** is visible — `get_code_connect_suggestions` returns a `Properties` object
per node — but an overridden fill, a hidden layer or retyped text inside an instance is not. The
pixel diff remains the only detector for the dangerous half, which is what F3b argued.

**F4 is rejected here**, in writing and in the artifact's own `notes` block. "Could have used a
design system component and did not" has no structural signature, and this task is accepted on
the count being stable across two passes. An inference layer cannot carry that, and the analysis
says it must never gate.
