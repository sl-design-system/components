# Control run — B-Itsl-Course `course files` (r2)

Run directly by the session coordinator (not via a per-case agent); reconstructed from the
conversation and the run folder.

- **Figma**: https://www.figma.com/design/mONnHPTYNNaBwV3cFUHIYv/Course-files?node-id=4007-3161
- **Stage 0 answers**: identical to r1, output `examples/lit/src/_runs/control-b-itsl-course-r1-1/`
- **Run folder**: `.implement-design/course-files-2/`

## 1. Stage reached + halt

**Halted in Stage 1.** Token: `BLOCKED_ON_CODE_CONNECT`. Same verdict as r1.

`get_code_connect_map` returned `{}` for the node and every descendant probed — this time also
across the `web-components` and `html` labels, not just the default. Analyst stopped before
`get_design_context` and `get_screenshot`.

**35 blocked nodes** — top-level instances plus nested ones (`I4461:5869;4461:5603` .Main menu,
`I4008:9032;4008:8789` Cell, `I4007:3183;4997:6325` Select, …).

## 2. Did Stage 0 ask anything extra?

**No.** Same as r1.

## 3. Decisions the four answers did not cover

Only the run-folder slug again (`course-files-2`). The supplied output location read like a typo
for `-r2/`, but the run halted before Stage 3 so no folder was created either way.

## 4. Wall clock

~1.5 minutes; analyst 85 s, 16 tool calls, ~36k subagent tokens — noticeably faster than r1's ~4 min.

## 5. Artifacts

`.implement-design/course-files-2/` — `figma-metadata.json` (1,787 B, **byte-identical to r1**),
`figma-code-connect-map.json` (**3 B — just `{}`**), empty `testing/`.

## 6. Components etc.

None. Same as r1.

## 7. Divergence from r1 — three differences worth recording

|                               | r1                                           | r2                          |
| ----------------------------- | -------------------------------------------- | --------------------------- |
| Nodes in the block list       | 11 (top-level only)                          | **35** (top-level + nested) |
| Tool calls                    | 25                                           | 16                          |
| Subagent tokens               | ~58k                                         | ~36k                        |
| Duration                      | 119 s                                        | 85 s                        |
| `figma-code-connect-map.json` | 2,882 B — `{}` **plus a verification trail** | 3 B — just `{}`             |

1. **Block-list size is not stable.** 11 vs 35 nodes for the same design. Both defensible — r2
   enumerated nested instances r1 folded into parents — but a consumer counting blocked nodes gets
   a 3x different answer. The skill never specifies the granularity.
2. **The two runs contradict each other on a tool limitation.** r1 recorded that
   `get_code_connect_map` _rejects_ compound nested ids; r2 lists those same compound ids as probed
   nodes. Either r2 found a way r1 didn't, or r2 is reporting ids enumerated from metadata rather
   than actually probed. r1's limitation claim is in the committed artifact, so this matters.
3. **Artifact fidelity differs sharply.** r1 wrote a structured verification trail; r2 wrote the
   literal `{}`. r2 is the more honest reading of "the raw output of the Figma call"; r1 is far more
   useful to anyone auditing later. The skill doesn't say which it wants.
