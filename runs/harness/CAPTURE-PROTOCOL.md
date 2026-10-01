# Capture protocol

What a run must call, how deep, and how the result is stored — so that nothing downstream has to
guess.

It exists because the batch proved both halves are currently undefined. The skill says only
_"writes the raw output of each Figma call"_, which tells a run what to write and never how much to
call: one run made six `get_design_context` calls and captured 611 node ids, another made one and
captured none, with no relation to the designs' complexity. And four runs stored the same kind of
output four different ways — `jsx` fences, `tsx` fences, unfenced code pasted into markdown, and one
file of prose about having probed. **3,004 node ids were stored and a reader built for the job
could read 2,114 of them.**

---

## Layout

One directory, one index, raw files beside it. No prose inside a raw file, ever.

```
<run>/captures/
  index.json
  design-context/<nodeId>.txt
  metadata/<nodeId>.txt
  code-connect/<nodeId>.txt
  variables/<nodeId>.txt
  screenshot.png
```

`<nodeId>` with `:` replaced by `-`, because a colon is awkward in a filename on some systems.

**Every capture is `.txt`, whatever it holds**, and `index.json` says which call produced it. That
is not fussiness: named `.jsx`, these files were claimed by the repository's own formatter, which
then failed on them — they are Figma's output, not code anybody maintains, and one contains a prose
warning appended mid-file. It is the same fault as `figma-metadata.json` holding XML, inverted: an
extension that invites the wrong tool.

### `index.json`

The only file a consumer has to understand. Everything else is bytes it points at.

```jsonc
{
  "schemaVersion": 1,
  "run": "a3-myportal-digital-exercises",
  "figma": {
    "fileKey": "1yroCKkROktqhRCP2wwlzB",
    "fileName": "MyPortal-Designs-2025",
    "rootNodeId": "25124:56828"
  },
  "captures": [
    {
      "call": "get_design_context", // the MCP call, verbatim
      "nodeId": "25124:57173",
      "label": "left sidebar menu", // human note; never load-bearing
      "file": "design-context/25124-57173.jsx",
      "bytes": 12649,
      "capturedAt": "2026-10-01T22:14:03Z",
      "truncated": false // true only if the caller knowingly stored less
    }
  ]
}
```

Three fields earn their place from things that went wrong:

- **`call`** — a run probed Code Connect per node and the same file also held subtree probes; which
  was which could only be guessed from prose.
- **`truncated`** — one analyst wrote `[table subtree omitted]` into a file whose whole purpose is
  to be verbatim, and the implementer was left without per-cell geometry. If something is omitted
  the index says so; the file itself stays raw.
- **`capturedAt`** — backfilled captures are not what the run saw. A date keeps a later enrichment
  from passing as original evidence.

## Rules

**Raw means raw.** A capture file holds exactly what the call returned. No headings, no commentary,
no fences, no summary. Notes go in `index.json` or in a separate document.

**One call, one file.** Concatenating responses forces the reader to split them again, and the
split is ambiguous.

**Name by node, not by sequence.** `part2.md`, `part3.md` carry no information; a node id does, and
it is what every other artifact is keyed on.

**Say what was not captured.** A missing capture is fine and an unrecorded one is not.

## Depth — how far to walk

The question the skill never asks. A design is captured deeply enough when **every region a
developer would place has its own `get_design_context`**.

Operationally:

1. `get_metadata` on the root. It stops at instance boundaries, so the tree it returns is already
   the placement-level view — a 10,936-node design came back as 27 nodes.
2. For each child of the root that is a frame or an instance wider than roughly 100px, call
   `get_design_context` on it.
3. Recurse into any such child whose own response contains no `data-node-id` beyond its root — that
   means the region is a container and its contents are below.
4. Stop at a node whose response is a `CodeConnectSnippet` reference. **Going deeper there returns
   nothing**: where a mapping resolves, Figma substitutes the reference for the markup. Record the
   mapping and move on.

Rule 4 is the one worth knowing in advance. It is why a run can capture faithfully and still hold
no description of a mapped component, and why the reconstruction of a well-mapped design is emptier
than that of an unmapped one.

### A cheap check that the depth was enough

```sh
node runs/harness/render-design.mjs --run <run>
```

If the reconstruction shows the screen, the capture is sufficient. If it shows a handful of nodes,
it is not — and that was true of eleven of nineteen runs before anybody looked.

## Code Connect probing

Probe **per node**, not over a subtree. A subtree call returned `{}` while the same ids returned
real mappings individually, and another timed out outright. Reading subtree emptiness as
"unconnected" blocks fully-mapped designs.

Record all three outcomes distinctly, because they mean different things:

| Result                        | Meaning                                      |
| ----------------------------- | -------------------------------------------- |
| `hasTemplate: true` + snippet | mapped, with code                            |
| `hasTemplate: false`          | **identified, no snippet** — not unconnected |
| `{}`                          | no mapping for this node                     |

An entire design returning `{}` is not a blocker. It means the design belongs to another library,
which is the majority of this corpus.

## Reference image

Verify before storing: the raster must match the frame's dimensions and must reach 255 somewhere.
`get_screenshot` has four behaviours — exact, a few px of canvas bleed, downscaling to a 1600 or
1280 long edge, and halving every colour channel. Three are invisible to a reader and the fourth is
invisible to a measurement.

**Record the distortion; never correct it.** Undoing a transformation inferred from its output is
reconstruction, not measurement.
