# Phase A of the fourteen-case probe

Every Code Connect response taken on 2026-10-06 for
[`T-NOJIRA-figma-ingestion-04`](../../context/work/NOJIRA-figma-ingestion/04-fourteen-case-probe.md),
byte for byte, with its call record and sha256 in `records.json`.

The transport is **this session's `mcp__figma__*` connection to `mcp.figma.com`**, which is the
only one that reaches Code Connect: a personal access token is refused with a 401, and the Dev
Mode server answers only for the file the editor has as its active tab.

## What the roots say

**All fourteen halting cases return an empty map when asked at the design's root node.** Thirteen
return a bare `{}`; one — `a2-nsp-class-overview` — returns `{}` followed by the server's own
`Note: the Code Connect lookup timed out`.

## What is actually underneath them

| Design                          | Root        | Asked below it                                                                         | The root's `{}` was     |
| ------------------------------- | ----------- | -------------------------------------------------------------------------------------- | ----------------------- |
| `a8-nsp-group-list`             | `{}` ×2     | `334:20578` (468 nodes) → **14 entries, 5 snippets**                                   | **false**               |
| `a10-etsl-fam-users`            | `{}`        | `17264:29100` (361) → `{}`; `17264:29106` (1086) → **6 entries, 5 snippets**           | **false**               |
| `a5-etsl-metadata-usage-widget` | `{}`        | `17214:103593` (1429) → **10 entries, 5 snippets**                                     | **false**               |
| `a4-sesame-my-groups`           | `{}`        | `2847:15708` (462) → `{}`; the instance `sl-button` `2847:14998` asked directly → `{}` | **true**                |
| `b-sesame-group-details`        | `{}`        | `2142:48170` (780) → `{}`                                                              | **true** so far         |
| `a2-nsp-class-overview`         | `{}` + note | `2422:87041` (10 765) → `{}` + note                                                    | **a timeout**, declared |

Three designs' empty roots are hiding thirty mapped nodes and fifteen snippets between them. Two
are empty for a real reason — Sesame's `sl-button` carries `componentId: 2:48281`, a component
outside the mapped library. One is a timeout that says so.

**The halt the control recorded is one message for at least three situations.**

## The scope of a map response, measured

`get_code_connect_map` answers about a node's subtree, but not without limit:

| Asked                  | Subtree | Entries |
| ---------------------- | ------: | ------: |
| `334:20573` (the root) |     620 |   **0** |
| `334:20578`            |     468 |      14 |
| `334:20585`            |     220 |      13 |
| `334:20592`            |   small |      10 |

It is not a node-count cap — 468 works and 620 does not. The root answers `{}` twice, in both id
spellings, and its own child answers fourteen mappings. Whatever the rule is, **asking at the
node in the design's URL is the one way to get nothing.**

## The mode of all fourteen, decided 2026-10-06

Eight files, every verdict from `runs/harness/mode-decision.mjs` rather than from reading the
listing. Each one is stored in `modes/` with the byte count and sha256 of the component listing
it was decided from, and whether that listing is the tool's own output (`verbatim`) or reduced
to the two fields the decision reads (`reduced`, for the four that arrived small enough to come
through a conversation rather than be persisted to a file).

| Design | File | Mode | `sl-*` externals | `sl-*` instances | Predicted | Agrees |
| ------ | ---- | ---- | ---------------: | ---------------: | --------- | ------ |
| `a1-kampus-subchapter-feed` | `73YHtIYl…` | **as-is** | 0 | 0 | converts | yes |
| `a11-sesame-learning-materials` | `UBr399hn…` | **as-is** | 0 | 0 | converts | yes |
| `a4-sesame-my-groups` | `UBr399hn…` | **as-is** | 0 | 24 | causes A and B | **no** |
| `a6-itsl-collab-shared-folder` | `Q3gzx1pC…` | **as-is** | 0 | 0 | converts | yes |
| `b-itsl-bookmk-course-files` | `ya00uFyX…` | **as-is** | 0 | 0 | converts | yes |
| `b-itsl-bookmk-deleted-course` | `ya00uFyX…` | **as-is** | 0 | 0 | converts | yes |
| `b-itsl-collab-add-element` | `Q3gzx1pC…` | **as-is** | 0 | 0 | converts | yes |
| `b-itsl-course-course-files` | `mONnHPTY…` | **as-is** | 0 | 0 | converts | yes |
| `b-kampus-notes-panel` | `73YHtIYl…` | **as-is** | 0 | 0 | converts | yes |
| `b-sesame-group-details` | `UBr399hn…` | **as-is** | 0 | 63 | causes A and B | **no** |
| `a10-etsl-fam-users` | `S5QgDy8X…` | **strict** | 21 | 122 | causes A and B | yes |
| `a2-nsp-class-overview` | `sSrpLCZm…` | **strict** | 4 | 801 | causes A and B | yes |
| `a5-etsl-metadata-usage-widget` | `S5QgDy8X…` | **strict** | 21 | 109 | causes A and B | yes |
| `a8-nsp-group-list` | `4TdMrcnI…` | **strict** | 7 | 72 | causes A and B | yes |

**Ten as-is, four strict.** The four strict files carry 4, 7 and 21 distinct `sl-*` externals.

### The prediction agrees on twelve of fourteen, and the two it misses are the same mistake

`T-NOJIRA-figma-ingestion-05` predicted from the count of **instances named `sl-*`** in each
design. The mode is decided from the file's **component dependency graph**. They disagree about
`a4-sesame-my-groups` and `b-sesame-group-details`, which hold 24 and 63 instances named `sl-*`
in a file with **zero `sl-*` externals**.

MySesame names its own local components `sl-*`. **Naming is not dependency**, and the prediction
used the weaker of the two signals.

Phase A had already shown this from the other direction and nobody connected it at the time:
`2847:14998`, an instance named `sl-button`, asked directly, returns `{}` — because its
`componentId` is `2:48281`, a component outside the mapped library. The empty map was true, and
the reason it was true is the reason the mode is as-is.

Both halves were measured before either was read against the other, which is the only reason
this reads as a finding rather than as a rationalisation.

## Phase A walked, three designs of fourteen

The tree comes from the REST captures through `runs/harness/rest-metadata.mjs` — validated
against the live tool: **every one of the 98 ids `get_metadata` returned for a8 is present** in
the 116 it produces. The map comes from `mcp.figma.com` through this session's connection, one
call per outermost instance, every response in `code-connect/` with its hash.

| Design | Mode | Map calls | Resolved | Unresolved | Nested covered | Causes | Exit |
| ------ | ---- | --------: | -------: | ---------: | -------------: | ------ | ---: |
| `b-itsl-bookmk-course-files` | as-is | 8 | 0 | 8 | 40 | C ×8 | **0** |
| `b-itsl-course-course-files` | as-is | 9 | 0 | 9 | 51 | C ×9 | **0** |
| `a2-nsp-class-overview` | strict | 6 | 4 | 2 | 34 | A ×1, D ×1 | **6** |

**Two of the three converted**, and both are designs the control halted on with
_publish mappings and re-run_. What they say now is that eight and nine components come from
another library, owner nobody, reproduce them as-is.

**The third did not, and should not.** `a2-nsp-class-overview` is strict and halts for two
reasons that are both real: one map **timed out and said so**, and one component genuinely has
no mapping. Under the control that design produced one message; it now produces two, with two
owners and two remedies.

### The number that was hiding the diagnosis

**125 nested nodes across the three** — 40, 51 and 34 — every one of them an id the server
emits and refuses. Before `T-NOJIRA-figma-ingestion-09` each was a separate finding owned by
the pipeline, and **any one of them exits 6**. Both conversions above are conversions because
those 91 stopped being findings about nothing.

### What the remaining eleven need

**683 more map calls**, one per outermost instance, and that is the whole of what is left:

| | |
| - | - |
| `runs/harness/capture.mjs` with a personal access token | **cannot** — `mcp.figma.com` answers a `figd_` token 401 |
| the Dev Mode server | ~31 s per call and one file at a time: **six hours** of calls plus switching the active tab across eight files |
| an agent, as here | 683 calls one at a time |
| **a script with an OAuth `mcp:connect` credential** | minutes, unattended |

The measurement is not blocked on anything but that credential. Everything else — the tree, the
mode, the classifier, the five causes — is on disk and tested.

## The token, re-tested 2026-10-06 because the question was asked again

`FIGMA_READ_TOKEN` in `.env` **is** in use and does work: all **108 responses in
`runs/captures/`** were fetched with it, and `--verify` re-hashes them on demand. What it does
not reach is the MCP endpoint, and that was re-measured rather than recalled:

| Header | Endpoint | |
| ------ | -------- | - |
| `X-Figma-Token` | `mcp.figma.com/mcp` | **401 Unauthorized** |
| `X-Figma-Token` | `api.figma.com/mcp` | **401 Unauthorized** |
| `Authorization: Bearer` | either | **401** — _"figd_ tokens must be passed via X-Figma-Token header, not Authorization"_ |

The server names the correct header when given the wrong one, so it recognises the token type
and refuses it anyway. The scopes are not the problem; the credential class is.

**And REST has no Code Connect endpoint**, probed the same day:

| | |
| - | - |
| `/v1/files/:key/code_connect` | **404** |
| `/v1/code_connect/:key` | **404** |
| `/v1/files/:key/dev_resources` | 403, and dev resources are links rather than mappings |
| `/v1/files/:key/components` | 200, and **empty** — this file publishes no library |

So the line is **REST against MCP**, not token against no token. The same token that captured
twenty-eight thousand nodes cannot ask one Code Connect question.
