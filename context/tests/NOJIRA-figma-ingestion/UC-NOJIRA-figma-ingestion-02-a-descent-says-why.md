---
type: use-case
schema_version: 1
id: UC-NOJIRA-figma-ingestion-02
title: A mapped node stops the walk, and every descent says why it went deeper
description: 'Genuinely unmapped and map unreadable produce identical markup and mean opposite things; a nested id means neither'
jira: null
resource: null
status: passing
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T00:00:00Z
tags: [figma, traversal, code-connect, negative-control]
tests_task: T-NOJIRA-figma-ingestion-02
---

# A mapped node stops the walk, and every descent says why it went deeper

> Verifies [T-NOJIRA-figma-ingestion-02](../../work/NOJIRA-figma-ingestion/02-traversal-stopping-rule.md).

## Preconditions

Five responses that really arrived, kept under `runs/harness/fixtures/`:

- `metadata-depth-limited.txt` — the canvas that listed six sections self-closed although
  asking one of those sections directly returns its children
- `metadata-instance-boundary.txt` — the symbol whose instances arrive self-closed
- `metadata-nested-instance-ids.txt` — the instance whose children come back as
  `I4195:33202;1514:155951`, ids the server emits and then refuses
- `metadata-not-found.txt` — the prose the server answers a missing node with
- `code-connect-resolved.json` and `code-connect-identified.json` — the two Code Connect entry
  shapes recorded across the nineteen corpus runs, the second being the five `hasTemplate: false`
  entries that carry no snippet and no label

Plus the recorded corpus run `2026-10-01-a8-nsp-group-list`, whose metadata capture holds 98
nodes and 27 instances and whose Code Connect capture holds nine per-node probes, five of them
resolved; and the live Dev Mode server on `127.0.0.1:3845`.

## Scenario

| Step | Action                                                                           | Expected result                                       |
| ---- | -------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 1    | Traverse a design whose instance Code Connect resolves                           | the instance's subtree is **never fetched**           |
| 2    | Re-run the same design with `--expand-mapped`                                    | it **is** fetched — so step 1 measured a real saving  |
| 3    | Traverse a design with one empty map, one refused call, one `hasTemplate: false` | **three different reasons**, one per node             |
| 4    | Traverse the instance whose children carry `;` ids                               | recorded as nested, **never sent to the server**      |
| 5    | Feed the prose the server answers a missing node with                            | **refused**, not read as a childless element          |
| 6    | Feed an entry whose `hasTemplate` is not a boolean                               | **refused**, naming the key                           |
| 7    | Answer `{}` past the latency budget                                              | **`map-unreadable`**, not `genuinely-unmapped`        |
| 8    | Run the CLI against a design where a map could not be read                       | **exit 4**, and exit 0 only with `--allow-unreadable` |

Steps 5, 6 and 7 are the negative controls. Step 2 is what makes step 1 a measurement rather
than an assertion about the implementation.

## Edge cases

- A refusal whose body happens to parse — a refused `{}` — is still a refusal. The flag is the
  evidence, not the shape of the text beside it.
- A `hasTemplate: true` entry carrying no snippet is a contradiction and is refused, because
  reading it as either a snippet or an absence invents an answer.
- A childless container is enqueued rather than believed: the server is depth-limited, and
  trusting the first response would report a design as empty boxes.
- A hidden node is excluded **and recorded**. Dropping it quietly is how a count of what was
  captured stops meaning anything.

## Result

**Passing**, 2026-10-05. `runs/harness/traverse.mjs` and `runs/harness/mcp.mjs`, 65 tests in
`traverse.test.mjs`; the harness gate is 302 tests and `tsc --noEmit` over ten files.

| Step | Outcome                                                                                                                    |
| ---- | -------------------------------------------------------------------------------------------------------------------------- |
| 1    | `metadataCalls` is exactly `['1:1']`; `pruned: ['1:2']`                                                                    |
| 2    | `metadataCalls` becomes `['1:1', '1:2']`; `pruned: []`                                                                     |
| 3    | `descents` is `{ genuinely-unmapped: 1, map-unreadable: 1, identified-without-snippet: 1 }`, and each node carries its own |
| 4    | two nodes `nested`, `probedAs: 4195:33202`, and **no id containing `;` reached either tool**                               |
| 5    | `parseMetadata` throws `carries no element`                                                                                |
| 6    | `readMap` throws `334:20668: the map entry is malformed`                                                                   |
| 7    | `applyBudget` returns `unreadable`, quoting the elapsed milliseconds and the budget                                        |
| 8    | **exit 4**; `--allow-unreadable` → exit 0. Also **exit 3** on the node budget and **exit 2** on a `;` root                 |

**21 mutations, 21 caught.** Four survived the first pass and each exposed a real gap: a refused
`{}` was being read as an absence by a path the tests could not see; the between-fetches budget
check was never reached; the server's own sentence was indistinguishable from the parser's
complaint about it; and `isError` itself was asserted nowhere, only the label beside it.

### The measurement the task asked for

**Live, on one symbol of 34 nodes.** Thirteen Code Connect calls, **every one 30.79–31.01 s and
every one `{}`**. The traversal recorded **13 `map-unreadable` and 0 `genuinely-unmapped`**, plus
**15 nested ids** the server had emitted and would have refused, plus 2 hidden nodes excluded.

Under the old reading that design has **28 unmapped nodes** and the halt prints _publish mappings
and re-run_. What happened is that the map could not be read thirteen times and fifteen ids were
never askable. Neither is a missing mapping, and neither is fixed by publishing one.

**Replayed over `a8-nsp-group-list`**, a recorded run: 98 nodes, 27 instances, 7 hidden. Of the
20 it probed, 5 resolved from the recorded snippets and **15 came back `map-unreadable` — because
that run never probed them**. The traversal says it could not read the map rather than counting
them as unmapped, which is the same distinction arriving from the archive instead of the wire.

### What this corpus cannot show

The token-cost claim — _a mapped region costs the snippet, not its expansion_ — is **not
demonstrable from the recordings**. The recorded metadata already stops at instance boundaries,
so the subtrees behind the five resolved snippets were never captured: in the replay the five
snippets are 767 bytes against 333 bytes of pruned metadata, and pruning saves 5 of 28 calls
rather than an expansion. The saving is real only live, where fetching a mapped instance costs a
further 31-second call and its payload, and that is where it should be measured when a mapped
file is open.
