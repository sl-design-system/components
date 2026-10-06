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
