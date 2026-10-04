# Control run (pass 2) — B-Itsl-Bookmk Deleted course - content

- **Figma URL**: https://www.figma.com/design/ya00uFyX1rjxYWF0dlOsoT/Bookmarks?node-id=4549-8339
- **Start**: Sun Oct 4 20:17:49 CEST 2026
- **End**: Sun Oct 4 20:20:55 CEST 2026
- **Wall clock**: 3 min 06 s
- **Coordinator**: ran SKILL.md literally; `implement-design:design-analyst` spawned via the Agent tool.

---

## 1. Stage reached / halt

**Halted in Stage 1 (design ingestion). Zero code produced.**

Halt token returned by `design-analyst`: **`BLOCKED_ON_CODE_CONNECT`**

Analyst's reason, verbatim:

> `get_code_connect_map` returned an empty mapping (`{}`) for the top-level node, and I independently re-verified against two specific instances (`4573:8406` "Button" and `4549:8340` "Navigation") — both also returned `{}`. This means **no node in this subtree has any Code Connect data at all**, so there are no sibling snippets to borrow from, and none of the instance names use an `sl-*` convention. Every component-instance node below is therefore genuinely unconnected per the heuristic.

SKILL.md step 5 makes this terminal with no retry allowance (unlike `BLOCKED_ON_MCP`, which gets 2 re-spawns): _"**Halt** and report the blocked-node list so the user can publish mappings and re-run."_ So I halted. Stages 2–6 never ran.

Blocked node list (unique component types + all repeated instances), as returned:

- `4549:8340` — Navigation
- `4549:8343` — PageHeader
- `4549:8349` — Banner
- `4549:8358` — Search
- `4573:8406` — Button
- `4571:16720` — Bulk actions panel
- `4549:8425` — Pagination
- `Cell` — 45 repeated instances across the header row + 8 data rows of the table at `4549:8360`:
  - Header: `4549:8363`, `4571:16848`, `4549:8364`, `4549:8365`, `4549:8366`
  - Row 2: `4549:8370`, `4571:16763`, `4549:8371`, `4549:8372`, `4549:8373`
  - Row 3: `4549:8377`, `4571:16773`, `4549:8378`, `4549:8379`, `4549:8380`
  - Row 4: `4549:8384`, `4571:16779`, `4549:8385`, `4549:8386`, `4549:8387`
  - Row 5: `4549:8391`, `4571:16787`, `4549:8392`, `4549:8393`, `4549:8394`
  - Row 6: `4549:8398`, `4571:16808`, `4549:8399`, `4549:8400`, `4549:8401`
  - Row 7: `4549:8405`, `4571:16814`, `4549:8406`, `4549:8407`, `4549:8408`
  - Row 8: `4549:8412`, `4571:16829`, `4549:8413`, `4549:8414`, `4549:8415`
  - Row 9: `4549:8419`, `4571:16841`, `4549:8420`, `4549:8421`, `4549:8422`

The analyst excluded hidden-ancestor nodes (an alternate "top panel" search-bar variant, a hidden second "cards" frame) as not part of the rendered design — its own judgement call, not something the skill specifies.

## 2. Did Stage 0 ask anything beyond the four supplied answers?

**No.** The four answers (server `figma` remote, framework `lit`, i18n `no`, output `examples/lit/src/_runs/control-b-itsl-bookmk-deleted-r2/`) are exactly the four Stage-0 questions in SKILL.md, so nothing else needed asking. The URL validated as a `figma.com/design/...` link on the first check.

Worth noting for the measurement: of the four answers, **only the server choice was ever used**. Framework, i18n and output location are consumed from Stage 2 onward and were dead weight in this run.

## 3. Decisions the four answers did not cover (skill gaps)

All of these I had to settle myself before or during Stage 1 — the run halted early, so this list is short, but every item is still a gap:

1. **Run-folder slug.** SKILL.md says kebab-case _the Figma file name from the URL_ → `Bookmarks` → `bookmarks`; smallest free `-N` → **`bookmarks-2`** (`bookmarks-1` already exists). But the case/run is called "B-Itsl-Bookmk Deleted course - content" and `.implement-design/b-itsl-bookmk-deleted-course/` already exists from other work. The skill's rule and the human-facing case name produce _different_ folder names, and the skill says nothing about reconciling them. I followed the skill literally. Consequence: a single Figma file that holds many distinct screens collides into one slug family — `bookmarks-N` tells you nothing about _which node_ was run, and two different nodes from the same file are indistinguishable by folder name.
2. **Output location isn't one of the two offered shapes.** Stage 0 offers `packages/components/` or "an app/example path like `examples/`". The supplied `examples/lit/src/_runs/control-b-itsl-bookmk-deleted-r2/` is a _deep_ path inside an existing private package, and the skill's Stage-3 rule ("the root component's tag minus `sl-`, kebab-cased, as the folder") would have _appended another folder_ under it. Whether the supplied path is the component folder itself or its parent is undefined. Not exercised (halt came first), but I would have had to guess.
3. **`.implement-design/` gitignore check.** Skill says add it if missing. Already present (`.gitignore:21`). No action — but the skill doesn't say whether to check `.gitignore` or `.git/info/exclude` or a global ignore.
4. **Whether to pre-create `<run>/testing/`.** The skill describes `testing/` as validator-written but lists it under "create it at the start". I created the empty dir; it stayed empty.
5. **How to phrase the analyst's spawn prompt.** The skill names _what_ to pass (URL, server, run path, schema path) but not the form. I also had to add the project root — the agent has no other way to resolve relative paths, and the skill doesn't list it among the things to pass.
6. **Which MCP tool namespace "figma (remote)" maps to.** Three figma-ish servers are on this machine (`mcp__figma__*`, `mcp__figma-desktop__*`, `mcp__MCP_DOCKER__*` which also exposes `get_design_context`/`get_code_connect_map`). The skill's two choices are the strings `figma-desktop` and `figma`; mapping those to tool prefixes is left to the coordinator, and the Docker-hosted third option is unaccounted for. I passed the `mcp__figma__*` prefix explicitly.
7. **Whether `BLOCKED_ON_CODE_CONNECT` deserves a sanity re-spawn.** It does not, per the skill — but the skill gives no guidance on the plainly-degenerate case the analyst actually hit (`{}` for _everything_, i.e. the file has no Code Connect at all), which is a different failure from "a few instances are unmapped". I did not re-spawn. See §7.

## 4. Wall clock

**3 minutes 06 seconds** (20:17:49 → 20:20:55 CEST). Analyst subagent: 153.9 s, 7 tool calls, ~45k tokens.

## 5. Artifacts

Run folder used: **`.implement-design/bookmarks-2/`** (not `b-itsl-bookmk-deleted-*`; see gap 1).

Landed in it:

| File                          | Size      | Note                               |
| ----------------------------- | --------- | ---------------------------------- |
| `figma-metadata.json`         | 10,187 B  | full node tree from `get_metadata` |
| `figma-code-connect-map.json` | 3 B       | literally `{}`                     |
| `testing/`                    | empty dir | pre-created by me, never used      |

**Not** written, because the analyst halts before those calls: `screenshot.png`, `figma-design-context.md`, `figma-variable-defs.json`, `manifest.md`.

`git status` is unchanged from the run's start (only the four pre-existing untracked entries: `agents.zip`, `agents/`, `analiza-agent-plugin.md`, `analiza-projektu.md`). Nothing committed. No stray artifacts outside the run folder.

## 6. Components, verdicts, tests, open questions, punch list

**None of it exists.** No components created, no validator verdicts, no tests, no decomposer open questions or defaults, no `[MINOR]` punch list — Stages 2–6 never ran.

## 7. What surprised me

1. **The halt is unconditional and un-nuanced, and the degenerate case is the common one.** The map came back `{}` for _every_ node — the file simply has no Code Connect published. The skill treats this identically to "three instances are missing mappings", and routes both to a human-action halt. But Stage 0 explicitly warns that the chosen server (`figma` remote) has **unreliable `get_code_connect_map`** — and then Stage 1 hard-halts on exactly the signal that server is documented as unreliable at producing. That is a direct internal contradiction: the skill offers a server it knows under-reports Code Connect, and then treats under-reporting as a terminal, human-only blocker. There is no "the server may be lying, degrade and continue" path, and no instruction to re-try on the other server. A `figma`-remote run against any file without published Code Connect can essentially never reach Stage 2.
2. **The analyst did more verification than it was asked to, and it didn't change the outcome.** It re-queried two individual instance nodes to confirm the empty map wasn't a top-level artifact. Good instinct — but the skill never asks for it, so whether a coordinator gets this double-check is luck of the draw.
3. **The cheapest, most reusable artifact is the one that's skipped.** `get_screenshot` is a single cheap call and the screenshot is ground truth for the rest of the pipeline — yet the analyst's protocol puts it _after_ the Code Connect gate, so a blocked run leaves no visual record at all. A halted run that at least cached `screenshot.png` would be re-runnable far more cheaply.
4. **Three of the four Stage-0 answers were collected and never used.** The skill front-loads all interaction "so the pipeline can run standalone", but the only gate that can halt within the first 3 minutes needs just one of the four. The ordering means a user answers four questions to find out 3 minutes later that the design was never eligible.
5. **The slug rule is per-_file_, but the pipeline's unit of work is per-_node_.** Two runs against two different screens of `Bookmarks` both land in `bookmarks-N`, and nothing in the folder records which node-id produced it. (`figma-metadata.json` does, but only if you open it.) Combined with the `-N` auto-increment, run folders are effectively un-attributable without reading their contents.
6. **No halt record is written to the run folder.** The skill tells the coordinator to report the blocked list to the user, but nothing instructs anyone to persist _why_ the run stopped. Reopening `.implement-design/bookmarks-2/` cold, you'd find two JSON files and an empty dir, with no way to tell whether the run halted or just crashed.
