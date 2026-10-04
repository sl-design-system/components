# Control run — A1 Kampus Subchapter feed (r1)

- **Case**: A1 Kampus Subchapter feed — https://www.figma.com/design/73YHtIYl0UHXH8ST4J7VKI/New-content-view?node-id=5311-37116
- **Skill**: `implement-design:implement-design`, invoked via the Skill tool with the four Stage 0 answers supplied verbatim
- **Stage 0 answers used**: server `figma` (remote); framework `lit`; i18n `no`; output `examples/lit/src/_runs/control-a1-kampus-subchapter-r1/`
- **Start**: Sun Oct 4 18:59:36 CEST 2026
- **End**: Sun Oct 4 19:10:43 CEST 2026

---

## 1. Stage reached, and the halt

**Reached Stage 1 (design ingestion). Halted there.** No Stage 2–6 work happened.

`implement-design:design-analyst` returned the skill's own halt token:

> `BLOCKED_ON_CODE_CONNECT`
>
> "`get_code_connect_map` returned an empty mapping (`{}`) for the entire node tree under `5311:37116` — confirmed at the top node and spot-checked on two descendants (`5311:37131`, `5311:37151`), both also empty. None of the component-instance node names match the `sl-*` naming heuristic, and since there are zero non-null snippets anywhere in the map, no child or peer-instance snippet exists to identify any of them by. All of the following are genuinely unconnected component instances … Per protocol, `get_design_context` and `get_screenshot` were not called."

Per SKILL.md step 5 ("**Halt** and report the blocked-node list so the user can publish mappings and re-run") I stopped and did not attempt to work around it.

**Blocked node list returned (24 instances):**

| Node       | Name                                         |
| ---------- | -------------------------------------------- |
| 5311:37117 | Fullscreen toggle                            |
| 5311:37119 | Table of contents - proto/feed (hidden node) |
| 5311:37120 | Table of contents - Elements basics          |
| 5311:37122 | breadcrumb-2023                              |
| 5311:37123 | Feed headings (2023)                         |
| 5311:37124 | Feed filters                                 |
| 5311:37125 | Student view                                 |
| 5311:37126 | Feed headings (2023)                         |
| 5311:37127 | Theory-card-UPDATE                           |
| 5311:37128 | Feed headings (2023)                         |
| 5311:37131 | Exercise-card-UPDATE                         |
| 5311:37132 | Exercise-card-UPDATE                         |
| 5311:37135 | Exercise-card-UPDATE                         |
| 5311:37136 | Exercise-card-UPDATE                         |
| 5311:37137 | Feed headings (2023)                         |
| 5311:37138 | Theory-card-UPDATE                           |
| 5311:37139 | Theory-card-UPDATE                           |
| 5311:37140 | Feed headings (2023)                         |
| 5311:37143 | Exercise-card-UPDATE                         |
| 5311:37144 | Exercise-card-UPDATE                         |
| 5311:37147 | Exercise-card-UPDATE                         |
| 5311:37148 | Exercise-card-UPDATE                         |
| 5311:37150 | Left-toolbar                                 |
| 5311:37151 | Header-navigation                            |

---

## 2. Did Stage 0 ask anything beyond the four answers?

**No.** Stage 0 of the skill specifies exactly four questions (Figma MCP server, framework, i18n, output location) and all four were supplied. No `AskUserQuestion` call was needed and the skill asked for nothing else. Stage 0 also validated the URL is a `figma.com/design/...` link — it is.

---

## 3. Everything I had to decide that the four answers did not cover

Every one of these is a gap in the skill, listed however small. Items marked **(pre-halt)** I actually had to resolve; items marked **(would have hit)** were already unresolved in the text and would have bitten later.

**(pre-halt) — run folder identity**

1. **Which slug.** The skill derives `<file-slug>` from the **Figma file name** (`New-content-view` → `new-content-view`), so the run folder is `.implement-design/new-content-view-1/`. But the experiment case is "A1 Kampus Subchapter feed" and a folder `.implement-design/a1-kampus-subchapter-feed` already exists, with no `-N` suffix. I had to choose: follow the skill literally (file-name slug + `-N`) or match the existing corpus naming. I followed the skill. **The skill's naming rule and the folders already in that directory disagree.**
2. **The node-id is recorded nowhere.** Because the slug comes from the _file_, two different nodes in the same Figma file produce `new-content-view-1` / `-2` and nothing inside either folder says which node it was. I decided not to add a marker (that would be changing the pipeline).
3. **Who creates `testing/`.** The skill lists `testing/` as part of the run folder but assigns its contents to visual-validator. I created it up front with the run folder. Unspecified.
4. **`.gitignore`.** The skill says add `.implement-design` if absent. It was already present (line 21) — no action needed, but I had to go check.

**(pre-halt) — agent wiring**

5. **How the coordinator waits on a subagent.** The skill says "spawn" and nothing about waiting. My polling loop added ~9 minutes of dead wall clock after the analyst had already finished (see §4). Not a correctness gap but a real cost gap.
6. **Agent namespace.** Resolved by the coordination note (`implement-design:design-analyst`) — the note exists, so this was cheap, but it is still a decision the skill text offloads to the caller.

**(would have hit) — things the four answers don't determine**

7. **Exact placement under the output location.** `examples/lit/src/_runs/control-a1-kampus-subchapter-r1/` is neither of Stage 0's two documented shapes verbatim (`packages/components/` flat, or "an app/example path like `examples/`"). Step 9 says the pipeline "derives the root component name from the decomposition and places components accordingly" — so does the root component get _another_ nested folder inside the supplied path, or do its files land directly in it? Undetermined.
8. **Breakpoints for Stage 4.** Step 13 says to pass visual-validator "the breakpoints". **No stage of the skill ever defines what they are**, and Stage 0 does not ask. The coordinator would have to invent them.
9. **The Storybook URL/port for Stage 4.** Step 13 says pass "the URL". Step 12 says `yarn start`. The port is never stated and Stage 0 never asks.
10. **Storybook story `title` category for an example.** The conventions say `title` follows the existing taxonomy "pick the category from a neighbor" — for a throwaway `_runs/` example there is no obvious category, and nothing says whether these runs should share a namespace.
11. **Whether generated components get exported from `examples/lit/src/index.ts`.** That barrel exports the four hand-written examples and **none** of the 19 existing `_runs/*` folders. The skill and the conventions never mention the barrel.
12. **Whether to reuse / diff against the prior output for the same design.** `examples/lit/src/_runs/a1-kampus-subchapter-feed/` already contains a full implementation of this exact design. Nothing in the skill says what to do when the target design already has generated code elsewhere in the tree — reuse, ignore, or compare. I ignored it (and deliberately did not read it).
13. **What "no new components" means in step 8** for an example target, where nothing maps to an existing published package by definition.

---

## 4. Wall clock

- **Total, start to end: 11 min 07 s** (18:59:36 → 19:10:43).
- **Actual pipeline time to the halt: ≈ 1 min 30 s.** The analyst subagent ran 72,967 ms and returned at roughly 19:01. The remaining ~9.5 minutes were my own blocking wait-loop, which was watching for `screenshot.png` — a file the blocked path never writes (see §7). That overhead is an artifact of how I waited, not of the skill, but the skill gives no waiting guidance.

---

## 5. Artifacts

**Run folder used: `/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/new-content-view-1/`** (smallest free `-N` for slug `new-content-view`; `new-content-view-1` did not previously exist).

What landed in it:

```
figma-metadata.json          3,670 bytes   (get_metadata output)
figma-code-connect-map.json      3 bytes   (literally `{}`)
testing/                     empty         (created by me with the run folder)
```

**Missing, because the analyst halted before those calls:**

- `screenshot.png` — **the ground-truth reference was never cached**
- `figma-design-context.md`
- `figma-variable-defs.json`
- `manifest.md` (Stage 2 never ran)

`git status --porcelain` shows only the four untracked items that pre-existed this run (`agents.zip`, `agents/`, `analiza-agent-plugin.md`, `analiza-projektu.md`). Nothing from this run landed in the working tree — `.implement-design` is gitignored. No commits, no `git add`, no PR.

---

## 6. Components created, verdicts, tests, open questions, punch list

**None of it.** The run halted in Stage 1.

- Components created: **none**. `examples/lit/src/_runs/control-a1-kampus-subchapter-r1/` was never created.
- Validator verdicts: **n/a** — Stage 4 never ran; Storybook was never started.
- Test results: **n/a** — Stage 5 never ran (and would have been skipped anyway for an `examples/` target per step 15).
- Decomposer open questions + defaults: **n/a** — `component-decomposer` was never spawned.
- `[MINOR]` punch list: **n/a** — `component-reviewer` was never spawned.

Agents actually spawned this run: **`implement-design:design-analyst` only** (1 of 6).

---

## 7. What surprised me

1. **The skill's Stage 0 warns about exactly the failure that killed the run, and then Stage 1 refuses to act on its own warning.** Stage 0 describes the remote `figma` server as one where "`get_code_connect_map` is unreliable" and recommends `figma-desktop`. Stage 1 then treats a `{}` map from that admittedly-unreliable server as a definitive, human-action-required blocker. Compare the two blocked branches: `BLOCKED_ON_MCP` gets **two automatic re-spawns**, but `BLOCKED_ON_CODE_CONNECT` gets **zero** — not even a retry on the other server the skill itself calls more reliable. An empty map is indistinguishable from "this server can't read the map," and the skill never tries to distinguish them.

2. **The halt artifact is nearly useless for the human action it demands.** The skill's stated purpose for this halt is "so the user can publish mappings and re-run" — but because the analyst stops before `get_screenshot`, the run folder has **no `screenshot.png`**, no design context, and no variable defs. The person who has to go open Figma and publish 24 mappings gets a 3-byte `{}` and a name list. The skill's working-directory spec lists screenshot + four JSON/MD files unconditionally as the run folder's contents; nothing says the blocked path yields a near-empty folder. Caching the screenshot first would cost one call and make the halt actionable.

3. **The gate is structural for this corpus, not incidental.** Every one of the 24 instances is a product-file component (`Exercise-card-UPDATE`, `Feed headings (2023)`, `breadcrumb-2023`, `Left-toolbar`, `Header-navigation`) — i.e. a real product design, not an SLDS-library design. For designs of this shape the pipeline can **never** start. Yet Stage 0, the only user interaction, never asks "is this file Code-Connect-mapped?" and offers no documented way to proceed without mappings. A user supplying all four answers correctly still gets a dead run on their first call, after the pipeline has already made them answer four questions.

4. **The richest design in the corpus got 73 seconds of attention.** 83 component types, and the pipeline's measurable surface was one `get_metadata` + three `get_code_connect_map` calls. Nothing about the design's complexity was ever exercised.

5. **`get_code_connect_map` returned `{}` rather than per-node nulls.** The analyst noted it couldn't even use the peer-snippet heuristic because there were zero non-null entries anywhere. So the fallback identification path the analyst has is only usable on _partially_ connected files — on a fully unconnected file it degrades to nothing, which is the case most likely to need it.

6. **Run-slug collision risk.** Deriving the folder name from the Figma _file_ means a multi-screen file (this one is "New content view") produces `new-content-view-1`, `-2`, `-3` … for completely different screens, with no node-id recorded inside. The existing `.implement-design/` contents show the convention already broke down in practice — 19 of the 29 folders there don't use the `-N` form at all.

7. **The skill never tells the coordinator how to wait.** It says "spawn … in parallel within a dependency level" but nothing about blocking, polling, or timeouts. In my case that turned a 90-second halt into an 11-minute run.
