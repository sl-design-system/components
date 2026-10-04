# Control run — A6 Itsl-Collab Shared folder (r1)

- **Case**: A6 Itsl-Collab Shared folder (71 component types)
- **Figma**: https://www.figma.com/design/Q3gzx1pCseyKnFNDUOOjCw/Collaboration-folder?node-id=4200-13792
- **Start**: Sun Oct 4 18:59:26 CEST 2026
- **End**: Sun Oct 4 19:01:43 CEST 2026
- **Wall clock**: 2 min 17 s
- **Skill**: invoked via the Skill tool as `implement-design:implement-design`; I acted as its coordinator. Agents spawned via the Agent tool.

---

## 1. Stage reached, and the halt

**Reached Stage 1 (Design ingestion). Halted there.** Stages 2–6 never ran.

`implement-design:design-analyst` returned:

> `BLOCKED_ON_CODE_CONNECT`

with the reason:

> "Confirmed empty across every probed node, including the top-level frame and six distinct descendant instances. No `sl-*` node names, no resolved child snippets, and no peer instance with a non-null snippet anywhere in this subtree — so none of the instance nodes are identifiable per the heuristic. All are genuinely unconnected. Stopping here per protocol (not calling `get_design_context` or `get_screenshot`)."

Per SKILL.md Stage 1 step 5 — _"the design has unconnected component instances that need Code Connect mappings published in Figma — a human action the pipeline can't do. **Halt**"_ — I halted and did not retry, did not substitute mappings, and did not perform any downstream stage.

**Blocked node list returned** (25 nodes):

| Node id          | Name                |
| ---------------- | ------------------- |
| 4200:13793       | Navigation          |
| 4200:13797       | PageHeader          |
| 4200:13803       | Label               |
| 4200:13809       | Label               |
| 4200:13813       | File element        |
| 4210:18675       | FileUpload (hidden) |
| 4411:11843       | Search              |
| 4411:11845       | Standalone link     |
| 4573:9232        | Button              |
| 4495:50572       | Button (hidden)     |
| 4495:50574       | Checkbox            |
| 4411:11854–11862 | 🛠️ Row (×9)         |
| 4411:11863       | Pagination          |
| 4099:12638       | Dropdown            |
| 4994:15549       | settings summary    |
| 4571:8205        | Heading             |
| 4571:8212        | Heading             |

`get_code_connect_map` returned a genuine (non-error) empty object `{}` for the top-level node and every probed descendant — 5 node ids probed and persisted in the raw file.

---

## 2. Did Stage 0 ask anything beyond the four answers?

**No.** The four supplied answers (MCP server, framework, i18n, output location) covered every question Stage 0 is specified to ask. No `AskUserQuestion` was needed, and no agent asked anything back.

---

## 3. Everything I had to decide that the four answers did not cover

Each of these is a gap in the skill. Listed in the order I hit them; all are small because the run halted early — a full run would have surfaced far more.

1. **Which string is "the Figma file name" for the slug.** SKILL.md says kebab-case the Figma file name _from the URL_. The URL path segment is `Collaboration-folder`; the real file name in Figma could differ (only `get_metadata` would tell, and that runs inside the analyst, after the folder must already exist). I used the URL segment → `collaboration-folder`, so the run folder is `collaboration-folder-1`.
2. **The run slug bears no relation to the case.** The case is "A6 Itsl-Collab Shared folder" but the slug is URL-derived, so the run landed in `collaboration-folder-1` — while a **pre-existing `.implement-design/a6-itsl-collab-shared-folder/`** (and `b-itsl-collab-add-element/`) already exist for the same Figma file. The uniqueness rule ("smallest integer suffix for which the folder doesn't exist") can't see those, so the same design accumulates unrelated run folders. Nothing in the skill says how a run folder relates to a prior run of the same design.
3. **Whether to create `testing/` up front.** The skill lists `testing/` as part of the run folder's contents but assigns its creation to visual-validator. I created it at folder-creation time; it stayed empty.
4. **Mapping the server nickname to tool names.** The answer "figma (remote)" is a server label. I had to decide that it means the `mcp__figma__*` tool family (vs. `mcp__figma-desktop__*` and vs. the third candidate present in this environment, `mcp__MCP_DOCKER__get_code_connect_map` etc.). The skill never states the tool-prefix mapping, and this environment exposes **three** Figma MCP surfaces, only two of which the skill names.
5. **What the run folder should contain on a blocked halt.** The skill promises `screenshot.png` + four raw-output files in the run root. The analyst's own protocol stops before `get_design_context` and `get_screenshot`, so a `BLOCKED_ON_CODE_CONNECT` run has **no ground-truth screenshot and no design context**. I had to decide not to go fetch the screenshot myself (correct under "change nothing", but the skill is silent on whether a blocked run should still cache the reference — and caching it would make a re-run cheaper).
6. **Whether the supplied output location is one of the two offered shapes.** Stage 0 offers `packages/components/` (flat) or "an app/example path like `examples/`". `examples/lit/src/_runs/control-a6-itsl-collab-shared-r1/` is the latter, but Stage 3's path rule ("root component's tag minus `sl-`, kebab-cased, as the folder") leaves unresolved whether the supplied path is the _parent_ of that folder or _is_ the folder. Never reached, but it would have been a decision.
7. **Project root vs. cwd.** The skill says the run folder goes "at the project root". Here cwd == git root, so no conflict — but the skill never defines "project root" for a monorepo with nested packages.

---

## 4. Wall clock

**2 min 17 s** total (18:59:26 → 19:01:43 CEST). The analyst itself ran 104 s / 12 tool calls.

---

## 5. Artifacts

Run folder used: **`/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/collaboration-folder-1/`**

| File                          | Size      | Written by                |
| ----------------------------- | --------- | ------------------------- |
| `figma-metadata.json`         | 7 441 B   | design-analyst            |
| `figma-code-connect-map.json` | 502 B     | design-analyst            |
| `testing/`                    | empty dir | coordinator (pre-created) |

**Not written** (the halt preceded them): `screenshot.png`, `figma-design-context.md`, `figma-variable-defs.json`, `manifest.md`.

`.implement-design` is already in `.gitignore` (line 21) — nothing to add.

`git status --porcelain` is unchanged from the session start: only the four pre-existing untracked entries (`agents.zip`, `agents/`, `analiza-agent-plugin.md`, `analiza-projektu.md`). No stray artifacts, no commits, no PR.

---

## 6. Components created, validator verdicts, tests, decomposer questions, punch list

**None of these exist.** The run never left Stage 1:

- Components created: none.
- Validator verdicts: none (Stage 4 not reached).
- Test results: none (Stage 5 not reached).
- Decomposer open questions + defaults: none (Stage 2 not reached — `component-decomposer` was never spawned).
- `[MINOR]` punch list: empty (Stage 6 not reached — `component-reviewer` was never spawned).

Agents actually spawned: **1 of 6** — `implement-design:design-analyst`. Never spawned: `component-decomposer`, `component-implementer`, `visual-validator`, `component-author`, `component-reviewer`.

---

## 7. What surprised me

1. **The skill documents the exact failure mode it then treats as a human blocker.** Stage 0's server question says the remote `figma` server is "headless, but `get_code_connect_map` is **unreliable**". The run was configured with that server, `get_code_connect_map` came back empty, and Stage 1 step 5 interprets empty-map as "mappings are not published in Figma — a human action". The skill offers no way to distinguish _"the map is genuinely empty"_ from _"the server you warned me about returned nothing"_. This is a direct internal contradiction, and it is load-bearing: the same design on `figma-desktop` might not have halted at all. Stage 0 recommends `figma-desktop` precisely for this, but nothing in Stage 1 says "on empty map with the remote server, retry on desktop or report the ambiguity" — unlike `BLOCKED_ON_MCP`, which _does_ get a 3-attempt retry policy.
2. **`BLOCKED_ON_CODE_CONNECT` has no escape hatch and is not one of the Stage 0 questions.** Stage 0 is specified as "all user input gathered up front", yet the single most likely halt in this repo (unpublished Code Connect) is not among the four questions. There is no "proceed without Code Connect / best-effort from `get_design_context`" option, even though `get_design_context` alone would yield usable structure and tokens. A user who answers all four questions can still lose the entire run to a fifth question they were never asked.
3. **The analyst's identification heuristic assumes `sl-*` node naming.** It reported "no `sl-*` node names" as part of its evidence. But this Figma library names its components `Button`, `Checkbox`, `Search`, `Pagination`, `Dropdown`, `PageHeader`, `Navigation` — names that map 1:1 onto real `packages/components/*` packages in this very repo. The skill has no fallback that matches Figma component names against the monorepo's package list, so a design built entirely from recognisable SLDS components reads as "100% unconnected".
4. **Halting discards the cheap, reusable work.** `get_screenshot` and `get_variable_defs` do not depend on Code Connect at all, and the screenshot is described as "ground truth throughout". Stopping before them means a re-run after the human publishes mappings re-pays every Figma call — and lands in a _new_ folder (`collaboration-folder-2`), orphaning `-1`. The skill has no resume concept.
5. **"71 component types" vs. 25 blocked nodes.** The analyst listed 25 _instance nodes_ within this one frame's subtree, not 71 distinct types. Whatever enumerated 71 for the case description is counting something the analyst's probe does not. Worth reconciling before treating the blocked list as complete.
6. **Nine identically-named `🛠️ Row` instances are listed individually.** The blocked list is per-instance, not per-component-type, so the human-facing "publish these mappings" list is longer and noisier than the actual work (one `Row` mapping covers all nine). Emoji in node names also survive into the list unescaped.
7. **Stage 1 step 3 says the analyst "caches the screenshot there **and** writes the raw output of each Figma call"** — phrased as unconditional. The analyst's internal protocol contradicts it on the blocked path. Two documents in the same plugin disagree about what a blocked run leaves behind.
