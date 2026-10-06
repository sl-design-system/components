# Verbatim Figma captures

What `api.figma.com` returned, byte for byte. Produced by
[`runs/harness/capture.mjs`](../harness/capture.mjs) for
[`T-NOJIRA-figma-ingestion-06`](../../context/work/NOJIRA-figma-ingestion/06-verbatim-capture.md).

Nothing here was read by anything that could summarise it. Each response was streamed to disk and
hashed as it was written; `<design>/manifest.json` carries the URL, status, elapsed time, byte
count and sha256 of every call, so **verbatim is checkable rather than asserted**. The measurement
that made this task necessary needed a heuristic, and the first heuristic was wrong by four runs.

## Layout

| Path                               | What it is                                                                    |
| ---------------------------------- | ----------------------------------------------------------------------------- |
| `index.json`                       | every design, its file key, its identity, and the one run nobody can identify |
| `<design>/manifest.json`           | call records, the five closure checks, and what the token reached             |
| `<design>/rest/nodes-<root>.json`  | the design frame and its complete subtree                                     |
| `<design>/rest/nodes-extra.json`   | roots the corpus's own MCP captures used that the frame does not contain      |
| `<design>/rest/nodes-named.json`   | nodes an MCP tool named that the first two calls did not hold                 |
| `<design>/rest/versions.json`      | the file's version history                                                    |
| `<design>/rest/images-<root>.json` | the render URL Figma issued, which expires                                    |
| `<design>/assets/<root>.png`       | the render itself, downloaded because the URL does not keep                   |

## What is not here

- **The whole-file `GET /v1/files/:key`.** 287 MB and 200 248 nodes for one file; twelve of them
  is ~3.4 GB and GitHub refuses any single file over 100 MB. The per-node captures **are** the
  designs.
- **The MCP half** — `get_design_context`, `get_code_connect_map`, `get_variable_defs`. A personal
  access token is refused by `mcp.figma.com` with a 401 whatever its scopes, so that half stays
  with the editor. The corpus's existing captures of it live under `runs/2026-10-01-*/captures/`,
  and this capture reconciles against them.

## The number worth knowing

`get_metadata` reported **98 nodes** for a8's frame. REST reports **620**, and 504 of those carry
the `;` ids the MCP tools emit and then refuse. Every plan in this slice was written on the
smaller number.
