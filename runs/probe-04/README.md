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

## Ten of fourteen walked — the mode decides, cleanly

167 live Code Connect calls, 1 468 nodes, every response in `code-connect/` with its hash.

| Design | Mode | Nodes | Calls | Resolved | Mapped | Unresolved | Nested | Causes | Exit |
| ------ | ---- | ----: | ----: | -------: | -----: | ---------: | -----: | ------ | ---: |
| `a11-sesame-learning-materials` | as-is | 365 | 19 | 0 | 0 | 19 | 58 | C ×19 | **0** |
| `a1-kampus-subchapter-feed` | as-is | 274 | 23 | 0 | 0 | 23 | **213** | C ×23 | **0** |
| `a6-itsl-collab-shared-folder` | as-is | 159 | 20 | 0 | 0 | 20 | 98 | C ×20 | **0** |
| `b-kampus-notes-panel` | as-is | 95 | 16 | 0 | 0 | 16 | 58 | C ×16 | **0** |
| `b-itsl-course-course-files` | as-is | 89 | 9 | 0 | 0 | 9 | 51 | C ×9 | **0** |
| `b-itsl-collab-add-element` | as-is | 88 | 8 | 0 | 0 | 8 | 43 | C ×8 | **0** |
| `b-itsl-bookmk-course-files` | as-is | 77 | 8 | 0 | 0 | 8 | 40 | C ×8 | **0** |
| `a10-etsl-fam-users` | strict | 134 | 38 | 2 | 0 | 36 | 52 | D ×35, E ×1 | 5 |
| `a8-nsp-group-list` | strict | 123 | 20 | 5 | **9** | 6 | 18 | D ×1, E ×5 | 5 |
| `a2-nsp-class-overview` | strict | 64 | 6 | 4 | 0 | 2 | 34 | A ×1, D ×1 | 6 |

**Seven as-is, seven conversions. Three strict, none.** The split is exactly the mode, with no
exceptions in either direction — and the mode was decided from the dependency graph before any
of these walks ran.

### a8 is the inversion this plan was written for

`T-NOJIRA-figma-ingestion-03` measured this same design and reported **28 unresolved nodes,
every one cause A or B, every one ours, exit 6** — _"not a single node routed to the design
system team"_.

It now reports **5 resolved with snippets, 9 mapped, 18 nested covered, and 6 findings — all
six the design system team's**, exit 5. The same design, the same tool, the opposite answer:
from twenty-eight complaints about our own pipeline to six things somebody can actually fix.

a10 says the same in a louder voice: **35 components with no mapping written**, one stale, and
nothing owned by the pipeline.

### 665 nested nodes

Across the ten, **665 ids the server emits and refuses** — 213 in a1-kampus alone. Before
`T-NOJIRA-figma-ingestion-09` each was a separate pipeline-owned finding, and one is enough to
exit 6. Every conversion here, and both exit-5 results, depend on those having stopped being
findings about nothing.

### The delegation, and how it was checked

Seven of the ten were probed by subagents working from an explicit node list. **Their reports
were not taken as evidence.** Each set was checked here for: the ids actually asked for, no
extra and no missing files, parseability, and byte size. Three snippet-bearing responses were
then checked against bytes captured independently hours earlier:

| | |
| - | - |
| `334:20593`, 377 B | **byte-identical** to `fixtures/code-connect-remote-snippet.json` |
| `334:20605`, 141 B | **byte-identical** to `fixtures/code-connect-snippetless.json` |
| `17557:100187` | entry **identical**, snippet included, to the Phase A subtree response |

Delegating capture to agents is the move that failed the first time and produced this whole
slice of work. It held here, and it held because it was checked, not because it was trusted.

### Rate limiting, which the remaining work will meet

One call came back `Rate limit exceeded. Please try again later.` The agent wrote no file and
retried, which is the correct behaviour — but at 167 calls we have already met the limit once.
The remaining four designs are estimated at ~500 calls, so they need backoff rather than
throughput.

### What is left

Four designs: `b-itsl-bookmk-deleted-course` (81), `b-sesame-group-details` (107),
`a4-sesame-my-groups` (152), `a5-etsl-metadata-usage-widget` (158), at the outermost-instance
estimate. **Two of them are the ones that most test the prediction**: b-sesame and a4 are as-is
by mode while holding 63 and 24 instances *named* `sl-*`.

## Twelve of fourteen walked — nine convert, and the prediction scores 11 of 12

255 live Code Connect calls, 1 983 nodes, 837 nested ids covered.

| Design | Mode | Nodes | Calls | Unresolved | Nested | Causes | Exit | Predicted |
| ------ | ---- | ----: | ----: | ---------: | -----: | ------ | ---: | --------- |
| `a11-sesame-learning-materials` | as-is | 365 | 19 | 19 | 58 | C ×19 | **0** | converts ✓ |
| `b-sesame-group-details` | as-is | 277 | 36 | 36 | 63 | C ×36 | **0** | does not — **MISS** |
| `a1-kampus-subchapter-feed` | as-is | 274 | 23 | 23 | **213** | C ×23 | **0** | converts ✓ |
| `b-itsl-bookmk-deleted-course` | as-is | 238 | 52 | 52 | 109 | C ×52 | **0** | converts ✓ |
| `a6-itsl-collab-shared-folder` | as-is | 159 | 20 | 20 | 98 | C ×20 | **0** | converts ✓ |
| `b-kampus-notes-panel` | as-is | 95 | 16 | 16 | 58 | C ×16 | **0** | converts ✓ |
| `b-itsl-course-course-files` | as-is | 89 | 9 | 9 | 51 | C ×9 | **0** | converts ✓ |
| `b-itsl-collab-add-element` | as-is | 88 | 8 | 8 | 43 | C ×8 | **0** | converts ✓ |
| `b-itsl-bookmk-course-files` | as-is | 77 | 8 | 8 | 40 | C ×8 | **0** | converts ✓ |
| `a10-etsl-fam-users` | strict | 134 | 38 | 36 | 52 | D ×35, E ×1 | 5 | does not ✓ |
| `a8-nsp-group-list` | strict | 123 | 20 | 6 | 18 | D ×1, E ×5 | 5 | does not ✓ |
| `a2-nsp-class-overview` | strict | 64 | 6 | 2 | 34 | A ×1, D ×1 | 6 | does not ✓ |

### The prediction, scored

`T-NOJIRA-figma-ingestion-05` recorded on 2026-10-06, dated, before `T-08` and `T-09` existed
and therefore before any design could convert at all: **eight designs convert, named one by
one.** All eight are now walked and **all eight converted.**

**Eleven of twelve correct, and the one miss is the one it was warned about.**
`b-sesame-group-details` was predicted not to convert because it holds **63 instances named
`sl-*`**. It converted, with 36 findings all cause C.

The mechanism is in this run's own evidence: `2142:48182`, an instance **named `sl-text_input`**
with `componentId: 7:35563`, asked directly, answers `{}`. MySesame names its local components
`sl-*` and depends on no SLDS component at all. **Naming is not dependency**, and the prediction
used the weaker of the two signals — which is what a prediction is for.

### The split is the mode, exactly

Nine as-is designs, nine conversions. Three strict, none. No exception in either direction, and
the mode for all fourteen was decided from the dependency graph before a single walk ran.

### What a converted design now says

Not _publish mappings and re-run_. Eight to fifty-two components come from another library,
owner nobody, reproduce them as-is — and between 40 and 213 nested ids per design are accounted
for rather than reported.

### What a strict design now says

`a8-nsp-group-list` was measured by `T-NOJIRA-figma-ingestion-03` at **28 unresolved, every one
ours, exit 6**. It is now **6 findings, every one the design system team's, exit 5**, with 5
snippets taken and 9 more components recognised as mapped. `a10-etsl-fam-users` reports **35
components with no mapping written** and nothing owned by the pipeline.

### What is left

Two designs: `a4-sesame-my-groups` and `a5-etsl-metadata-usage-widget`. a4 is the second and
last test of the naming-against-dependency divergence — as-is by mode, 24 instances named
`sl-*`.

## Interrupted at twelve, and the client that resumed cannot see Code Connect — 2026-10-07

The walk stopped at twelve of fourteen on 2026-10-06 when the Claude Code session hit its weekly
limit; the next morning the organisation disabled Claude Code. The resume was attempted from
GitHub Copilot CLI with the same Figma user and the same remote MCP server.

Replaying a recorded call that had returned a mapping the day before —
`a10-etsl-fam-users`, node `17264:29106`, 1907 bytes with `sl-select` resolved — now returns `{}`,
while `get_metadata` and `get_design_context` on the same nodes answer in full. Code Connect is
not served to this client. Details, the exact calls and the two documented constraints (client
catalogue; 200 calls per day on a Dev seat) are in
[`client-reachability-2026-10-07.md`](client-reachability-2026-10-07.md).

Consequence: `a4-sesame-my-groups` and `a5-etsl-metadata-usage-widget` cannot be walked from
Copilot CLI with the same instrument as the first twelve. They remain open until a client that
receives Code Connect data is available, and even then the ~500 calls span at least three days of
the daily budget.

## The instrument moved overnight — 2026-10-07

The walk stopped at twelve on 2026-10-06. Before resuming with `a4` and `a5`, the same twenty
calls that produced the `a8` result were re-taken from the same client, 24 hours later, into
`code-connect-2026-10-07/` so the originals stay untouched.

**Twelve of the twenty responses changed.**

| `a8-nsp-group-list` | 2026-10-06 | 2026-10-07 |
| ------------------- | ---------: | ---------: |
| nodes walked | 123 | 145 |
| resolved (snippet taken) | 5 | **1** |
| mapped (no snippet) | 9 | **3** |
| unresolved | 6 | **16** |
| nested covered | 18 | 37 |
| causes | D ×1, E ×5 | **D ×10, E ×6** |
| **exit** | **5** | **5** |

The walk saw *more* nodes because fewer resolved, so fewer subtrees were pruned — the stopping
rule behaving as designed on worse input.

### Which entries moved, and which did not

| 2026-10-06 `source` | After 24 hours |
| ------------------- | -------------- |
| `packages/components/icon/src/icon.ts` (3 entries) | **byte-identical** |
| `""` (9 entries, and **every one that carried a snippet**) | **all changed** |
| no entry at all (5 responses) | 4 unchanged; `334:20685` went from `{}` to 1 151 bytes with 5 entries |

**Every entry pointing at a real path in this repository survived. Every entry with an empty
`source` moved, and those are exactly the ones that carried snippets.**

So Code Connect's answers come from two populations:

1. **the mappings this repository publishes** from `scripts/connect-figma-components` — they
   carry a `source`, carry no snippet, and are stable;
2. **snippet-bearing entries with no source** — which is what made designs resolve, and which
   are not stable day to day and do not come from here.

### What this costs the measurement

**The qualitative answer held.** a8 is strict, every finding belongs to the design system team,
exit 5 — the same conclusion as yesterday, which is what the five causes are for.

**Every number moved.** Resolved fell from 5 to 1, unresolved rose from 6 to 16. So the twelve
walks are a snapshot of **2026-10-06**, not a standing measurement, and `a4` and `a5` walked
today would not belong to the same measurement as the other twelve.

A human check in Dev Mode on 2026-10-07 13:21 had already confirmed `334:20593` as
**"Connected"** with the `sl-avatar` snippet — while the MCP tool for that same node now returns
an `Icon` entry for `0:18` and no avatar at all. The mapping exists; the tool stopped reporting
it.

### What this does not explain

Why the snippet-bearing population is volatile, and where it comes from if not from this
repository's published templates. Nothing here distinguishes a Figma-side cache, a per-session
scope, or a change made in the file between the two days. That is one question, it is now
precisely posed, and it is bigger than `T-NOJIRA-figma-ingestion-04`.
