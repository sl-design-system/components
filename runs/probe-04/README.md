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

## Can a script hold the credential? No — and the reason is not scopes

Asked and answered 2026-10-06, by probe and then by Figma's own documentation.

**What the server demands**, from its own `WWW-Authenticate` header and the two metadata
documents it points at:

| | |
| - | - |
| scope | `mcp:connect` — and it is **not in the personal access token scope list** |
| authorization_endpoint | `https://www.figma.com/oauth/mcp` |
| token_endpoint | `https://api.figma.com/v1/oauth/token` |
| registration_endpoint | `https://api.figma.com/v1/oauth/mcp/register` |
| grant types | `authorization_code`, `refresh_token`, `jwt-bearer` |

Dynamic client registration is advertised, so it was tried with a well-formed RFC 7591 body:

```
403 Forbidden        POST /v1/oauth/mcp/register      (plain text, no JSON)
404 {"status":404}   GET  /v1/oauth/mcp/register      (the API's own 404 shape)
400 {"error":"Client ID is required"}  POST /v1/oauth/token
```

The token endpoint shapes its errors as JSON and the register endpoint does not, so the 403 is a
gate in front of the handler rather than the handler's own refusal. Four header variants, same
answer.

**Figma's documentation says why.** From the MCP server docs: _"Only clients listed in the Figma
MCP Catalog can connect to the Figma MCP Server."_ The catalog page adds: _"you can apply to
register your client for remote access, please reach out to your account team."_ There is no
self-service path.

**Claude and Claude Code are both in that catalog**, which is why this session's calls work and
a script's do not. The gate is **client allow-listing**, not credentials and not scopes — so an
OAuth app registered in Figma's developer settings would be refused for the same reason, and so
would the enterprise `jwt-bearer` profile.

### A correction to what this task said earlier

`T-NOJIRA-figma-ingestion-04` recorded that the measurement is _"blocked on that credential and
on nothing else"_, which reads as though minting one were an errand. **It is not obtainable by
us.** Either the remaining calls run through a catalogued client — which is what an agent
session is — or somebody asks Sanoma's Figma account team to register one.

That also means the agent-driven path is the **supported** one rather than a workaround, and the
683 calls are a cost rather than a symptom.

## Seven of fourteen walked — six convert

89 live Code Connect calls, every response in `code-connect/` with its hash. Four of the seven
were probed by subagents working from an explicit node list; **their reports were not taken as
evidence** — each set was checked here against the ids asked for, for extra or missing files,
for parseability and for byte size, before any walk was run. Delegating this to agents is the
move that failed the first time, so the verification is on this side.

| Design | Mode | Nodes | Map calls | Resolved | Unresolved | Nested covered | Causes | Exit |
| ------ | ---- | ----: | --------: | -------: | ---------: | -------------: | ------ | ---: |
| `a1-kampus-subchapter-feed` | as-is | 274 | 23 | 0 | 23 | **213** | C ×23 | **0** |
| `a11-sesame-learning-materials` | as-is | 365 | 19 | 0 | 19 | 58 | C ×19 | **0** |
| `b-kampus-notes-panel` | as-is | 95 | 16 | 0 | 16 | 58 | C ×16 | **0** |
| `b-itsl-course-course-files` | as-is | 89 | 9 | 0 | 9 | 51 | C ×9 | **0** |
| `b-itsl-collab-add-element` | as-is | 88 | 8 | 0 | 8 | 43 | C ×8 | **0** |
| `b-itsl-bookmk-course-files` | as-is | 77 | 8 | 0 | 8 | 40 | C ×8 | **0** |
| `a2-nsp-class-overview` | strict | 64 | 6 | 4 | 2 | 34 | A ×1, D ×1 | 6 |

**Every as-is design measured so far converts: six of six.** All six are designs the control
halted on with _publish mappings and re-run_; what they say now is that eight to twenty-three
components come from another library, owner nobody, reproduce them as-is.

**The one that halts, halts correctly.** a2 is strict, and its two findings are a map that
**timed out and said so** and a component that genuinely has no mapping — ours and the design
system team's, with different remedies.

### 497 nested nodes

Across the seven, **497 ids the server emits and refuses**, including **213 in a1-kampus
alone**. Before `T-NOJIRA-figma-ingestion-09` each was a separate finding owned by the pipeline,
and one is enough to exit 6. Every conversion above is a conversion because those stopped being
findings about nothing.

### Against the prediction

`T-NOJIRA-figma-ingestion-05` predicted on 2026-10-06, before any of this ran, that **eight
designs convert** — the eight with zero `sl-*` instances. Four of those eight are now measured
and all four converted. Two more conversions, a11 and a4's file-mates, came from the mode
measurement rather than the instance count, which is the correction Amendment 5 recorded.

**Nothing here contradicts the prediction yet, and nothing here confirms it.** Six of fourteen
remain unwalked, and the two that would most test it — `b-sesame-group-details` and
`a4-sesame-my-groups`, as-is by mode but holding 63 and 24 instances **named** `sl-*` — are
among them.

### What is left

Seven designs, roughly 600 calls at the outermost-instance estimate: a6 (25),
b-itsl-bookmk-deleted-course (81), b-sesame-group-details (107), a4-sesame-my-groups (152),
a5-etsl-metadata-usage-widget (158), a8-nsp-group-list (27), a10-etsl-fam-users (50). The walk
prunes, so the real number is lower — the seven above were estimated at 113 and cost 89.
