---
type: task
schema_version: 1
id: T-NOJIRA-figma-ingestion-02
title: Traversal with Code Connect as the stopping rule
description: 'A resolved mapping prunes its subtree; an unreadable map must descend and say that it did'
jira: null
resource: null
status: done
independent: false
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T23:55:00Z
tags: [figma, traversal, code-connect]
source_plan: P-NOJIRA-figma-ingestion
depends_on: [T-NOJIRA-figma-ingestion-01]
commit: 4330e5f5cea8722a3bb537e767d00dc771e399e0
---

# Traversal with Code Connect as the stopping rule

## Objective

Code Connect is not a verification step after capture — it decides **how deep to go**.
`get_design_context` on a mapped node returned `<sl-grid></sl-grid>` for ten thousand nodes,
against ~233k tokens to expand the same node.

So a failed call does not lose a snippet. **It loses the stopping rule.**

**The dependency on task 01 is soft, and worth naming as such.** The stopping rule is identical in
both modes — nothing halts during traversal — so the traversal is not blocked on the mode being
known. What the mode buys is a cost expectation: on a file known to be drawn in another library,
per-node probing will resolve nothing, and knowing that in advance is the difference between a
deliberate cost and a surprised one. Start 01 first if doing them in sequence; do not wait on it
if someone else is already on 02.

## Steps

1. `get_metadata` at the root — shallow. It stops at instance boundaries by itself: a
   10,936-node design returned 27.
2. `get_code_connect_map` **per node**, never over the subtree. Probed: per-node returns a full
   snippet where the subtree form times out and returns `{{}}`.
3. Branch — `hasTemplate: true` take the snippet and **do not descend**; `hasTemplate: false`
   identified without a snippet, descend for content only; `{{}}` descend fully.
4. **Fail open**: unknown means descend. Failing closed silently drops content.
5. **Record why it descended** — genuinely unmapped, or map unreadable. Probed: per-node on the
   itslearning Banner still returns `{{}}`, so the two are distinguishable by exactly this
   retry.

## Acceptance criteria

- A mapped node's subtree is not fetched.
- Every descent records its reason, and the two reasons are distinguishable in the output.
- A nested instance id containing `;` is handled rather than reported as unmapped — the server
  rejects that format, which has been misread as absence.

## Verification

On a known-mapped design, the token cost of a mapped region is the snippet rather than its expansion; on the itslearning design, every descent is labelled `genuinely-unmapped`.

## Result

`runs/harness/traverse.mjs` over `runs/harness/mcp.mjs`, with 65 tests in `traverse.test.mjs`.
The harness gate is **302 tests** and `tsc --noEmit` over ten files. Verified live against the
Dev Mode server and replayed against a recorded corpus run.

### The three criteria

| Criterion                                                         | How it is shown                                                                                                                                                                  |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A mapped node's subtree is not fetched                            | `metadataCalls` is exactly `['1:1']` and `pruned: ['1:2']`; the same run with `--expand-mapped` calls `['1:1', '1:2']`, which is what makes it a measurement rather than a claim |
| Every descent records its reason, and the two are distinguishable | `descents` is `{ genuinely-unmapped, map-unreadable, identified-without-snippet }`, each also on its own node, and the unreadable one quotes what the server said                |
| A nested id is handled rather than reported as unmapped           | the two `;` nodes are `nested`, `probedAs: 4195:33202`, and **no id containing `;` reaches either tool**                                                                         |

### Four behaviours of the server, measured rather than assumed

| Probed 2026-10-05                                                                                                                                                        | Consequence                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| **`get_metadata` is depth-limited.** A canvas listed six sections self-closed; asking one of those sections directly returned its children                               | a childless container is enqueued, not believed. Believing the first response would call a design six empty boxes |
| **It stops at instance boundaries.** An instance arrives self-closed and yields its contents only when asked for by name                                                 | this is what makes pruning a mapped node a real saving                                                            |
| **It emits node ids it will not accept.** Inside an instance the children are `I4195:33202;1514:155951`, and both tools answer `Node ID must be in the format "123:456"` | unaskable is not unmapped, and the two have been read as the same thing                                           |
| **Only the outermost segment is askable.** The last segment `1514:155394` answers `No node could be found`                                                               | a nested node inherits its enclosing instance's verdict rather than being probed and filed as absent              |

### The thing the task did not anticipate

`get_code_connect_map` answers a rejected id in **0.09 s**, a node that does not exist in
**0.4 s**, and **every valid node in 30.6–31.1 s, with `{}`** — five samples, the same plateau
for a 36×36 button instance and for a 240×720 symbol holding twenty nodes. A lookup whose cost
does not vary with what it looks through has not looked.

The traversal does **not** claim that is a timeout. It claims it cannot tell, which is the honest
output and exactly this task's distinction arriving in the wild: `--slow-map-ms` (default
10 000) is the line past which an empty map stops counting as evidence of absence. The budget is
recorded in the report rather than compiled in, so a reader can see what it was judged by.

This also prices step 2 of this task. **Per-node probing costs ~31 s per instance** against this
server. A twenty-instance design is ten minutes of Code Connect before anything is captured —
a number `T-NOJIRA-figma-ingestion-04` needs before it plans fourteen re-runs.

### Measured live

One symbol, 34 nodes:

|                                                      |                                                 |
| ---------------------------------------------------- | ----------------------------------------------- |
| Code Connect calls                                   | 13, every one 30.79–31.01 s, every one `{}`     |
| Descents                                             | **13 `map-unreadable`, 0 `genuinely-unmapped`** |
| Nested ids the server emitted and would have refused | **15**                                          |
| Hidden, excluded and recorded                        | 2                                               |

Under the old reading that design has **28 unmapped nodes** and the halt prints _publish mappings
and re-run_. What happened is that the map could not be read thirteen times and fifteen ids were
never askable. Neither is a missing mapping, and neither is fixed by publishing one.

**Replayed over `a8-nsp-group-list`:** 98 nodes, 27 instances, 7 hidden. Of the 20 probed, 5
resolved from the recorded snippets and **15 came back `map-unreadable`, because that run never
probed them** — the same distinction arriving from the archive instead of the wire.

### What this corpus cannot show, and should not be read as showing

The Verification line asks that a mapped region cost the snippet rather than its expansion. That
is **not demonstrable from the recordings**: the recorded metadata already stops at instance
boundaries, so the subtrees behind the five resolved snippets were never captured. In the replay
the five snippets are 767 bytes against 333 bytes of pruned metadata, and pruning saves 5 calls
of 28 rather than an expansion. The saving is real only live, where fetching a mapped instance
costs a further 31-second call and its payload, and that is where it must be measured when a
mapped file is open. `--expand-mapped` exists to take that measurement.

The second half of the Verification line is met: on a design with no resolvable mappings, every
descent is labelled — and the label is **`map-unreadable`, not `genuinely-unmapped`**, which is
not what the line predicted and is the more useful answer. The design was not unmapped. The
question was never answered.

### Also decided here

The plan assigned the REST-versus-MCP fork to this task. **MCP, on the local server.** Both tools
this traversal needs are published on `127.0.0.1:3845`; only `T-NOJIRA-figma-ingestion-01`'s
per-file call lives on the remote behind the editor's OAuth. No REST path was needed and none was
built.

### One thing left where it is

Five of nineteen recorded Code Connect captures are prose or hand-annotated JSON rather than tool
responses. `readMap` keeps non-id keys as `annotations` rather than dropping them, so a replay
says what it could not read; it does not try to parse the prose. Normalising those captures
belongs to `T-NOJIRA-corpus-census-02`, not here.

### Out of scope, and surfaced

`mode-decision.mjs` was edited: its handshake moved to the new `runs/harness/mcp.mjs` so the two
scripts share one transport instead of forking it. Committed separately as `83486d23d` and proved
inert — the 237 tests green before it are green after it.
