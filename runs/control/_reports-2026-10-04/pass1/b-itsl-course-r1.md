# Control run — B-Itsl-Course `course files` (r1)

Run directly by the session coordinator (not via a per-case agent), so this report is
reconstructed from the conversation and the run folder rather than written by a run agent.

- **Figma**: https://www.figma.com/design/mONnHPTYNNaBwV3cFUHIYv/Course-files?node-id=4007-3161
- **Stage 0 answers**: server `figma` (remote), framework `lit`, i18n `no`,
  output `examples/lit/src/_runs/control-b-itsl-course-r1/`
- **Run folder**: `.implement-design/course-files-1/`

## 1. Stage reached + halt

**Halted in Stage 1.** Token: `BLOCKED_ON_CODE_CONNECT`.

The whole-subtree `get_code_connect_map` on `4007:3161` returned literally `{}`, and per-node
calls on every top-level instance returned `{}` as well. No `sl-*` node names anywhere — the
layer names follow itslearning's own library (Navigation, PageHeader, Banner, Cell, Pagination,
Status Tag, Course Hat), so the name/sibling-snippet heuristics had nothing to fall back on.
The analyst stopped before `get_design_context` and `get_screenshot`.

**11 blocked nodes**: `4461:5869` Navigation · `4007:3166` PageHeader · `4007:3169` Banner ·
`4007:3170` Search (hidden) · `4008:8839` courses header row · `4008:9032`, `4008:9078`,
`4008:9126`, `4008:9174` courses data rows · `4008:9150` courses data row (hidden) ·
`4007:3183` Pagination.

## 2. Did Stage 0 ask anything extra?

**No.** The four supplied answers were honoured as given; no `AskUserQuestion` was issued.

## 3. Decisions the four answers did not cover

1. **"Project root" is ambiguous in this monorepo.** The skill places `.implement-design/` "at the
   project root"; the git root is `components/`, not the `sl-design-system/` parent. Used the git root.
2. **The run-folder slug derives from the Figma file name** (`Course-files` → `course-files-1`),
   which does not match the case-slug naming the existing `.implement-design/` folders use.

## 4. Wall clock

~4 minutes end to end; the analyst itself ~2 min, 25 tool calls, ~58k subagent tokens.

## 5. Artifacts

`.implement-design/course-files-1/` — `figma-metadata.json` (1,787 B), `figma-code-connect-map.json`
(2,882 B: the raw `{}` **plus a full per-node verification trail**), empty `testing/`.
No `screenshot.png`, no `figma-design-context.md`, no `figma-variable-defs.json`, no `manifest.md`.

## 6. Components etc.

None. 1 of 6 agents spawned. No validator verdicts, tests, decomposer questions or [MINOR] list.
`examples/lit/src/_runs/control-b-itsl-course-r1/` was never created.

## 7. What stood out

**Nested instances cannot be verified individually.** `get_code_connect_map` rejects compound ids
containing a semicolon (`I4461:5869;4461:5606`):

> `Node ID must be in the format "123:456" or "123-456"`

The analyst reasoned around it (the subtree call covers descendants), which is sound, but per-node
verification of nested instances is structurally impossible with the current tool signature.
