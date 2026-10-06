# Code Connect, as the remote server really answers

Three responses from `mcp.figma.com`, captured 2026-10-06 through this session's authenticated
MCP connection. **They are the bytes the server sent, with nothing added** — not even a
provenance key, which is why this file exists instead.

A personal access token cannot produce them: `mcp.figma.com` answers `figd_` tokens with a 401
whatever their scopes, so `runs/harness/capture.mjs` cannot reach this tool and
`T-NOJIRA-figma-ingestion-04` is the only work that runs where these shapes live.

| File | Call | Bytes | sha256 |
| ---- | ---- | ----: | ------ |
| `code-connect-descendants.json` | `get_code_connect_map(fileKey: 4TdMrcnIVOn3Hrfj2OpVZU, nodeId: 334:20594)` | 480 | `29365596b4c6567d…` |
| `code-connect-snippetless.json` | `get_code_connect_map(fileKey: 4TdMrcnIVOn3Hrfj2OpVZU, nodeId: 334:20605)` | 141 | `16cad9e85666efb8…` |
| `code-connect-remote-snippet.json` | `get_code_connect_map(fileKey: 4TdMrcnIVOn3Hrfj2OpVZU, nodeId: 334:20593)` | 377 | `e293e4e09e80fa1c…` |

## What each one is for

| File | The shape |
| ---- | --------- |
| `code-connect-descendants.json` | **asked about `334:20594`, answered about three nodes inside it** and nothing about the node itself. This is the response the reader used to file as `genuinely-unmapped`, sending cause E to the design system team |
| `code-connect-snippetless.json` | the same node asked for **directly**, and still `hasTemplate: true` with no `snippet` |
| `code-connect-remote-snippet.json` | a node that **does** carry a snippet, so the two can be told apart on real bytes rather than on an argument |

## One claim these falsify

`T-NOJIRA-figma-ingestion-05` says _"the snippet arrives only when the exact node is asked
for."_ **It does not.** `334:20605` was asked for exactly and came back without one, while
`334:20593` asked the same way came back with one. Whether an entry carries a snippet is a
property of the entry, not of how it was requested — which makes `mapped` the right reading of a
snippetless entry more clearly than the task argued.

Note also that `source` is frequently **empty**, and `componentName` is present on only one of
the five entries here. An earlier reconstruction of these responses filled both fields with
plausible values — full GitHub URLs and the Figma layer names — and was wrong in both. That is
the reason these are captures.

## Before you read the snippet

`code-connect-remote-snippet.json` contains a real string from a real design. It is here because
a fixture of a snippet with no snippet in it would prove nothing, and the same content is already
in `runs/captures/`. The gate on pushing this branch covers it.
