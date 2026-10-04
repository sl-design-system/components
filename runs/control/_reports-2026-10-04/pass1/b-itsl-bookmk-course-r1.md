# Control run — B-Itsl-Bookmk course files (R1)

- **Figma**: https://www.figma.com/design/ya00uFyX1rjxYWF0dlOsoT/Bookmarks?node-id=4886-12955
- **Start**: Sun Oct 4 20:48:39 CEST 2026
- **End**: Sun Oct 4 20:50:53 CEST 2026
- **Wall clock**: ~2 min 14 s
- **Stage 0 answers used**: server `figma` (remote), framework `lit`, i18n `no`, output `examples/lit/src/_runs/control-b-itsl-bookmk-course-r1/`

## 1. Stage reached / halt

**Halted in Stage 1 (design ingestion).** Never entered Stage 2.

Halt token returned by `design-analyst`: **`BLOCKED_ON_CODE_CONNECT`**

Reason, quoted from the analyst:

> `get_code_connect_map` returned a completely empty map (`{}` — zero entries, not even `null`-keyed ones) for the whole subtree at node `4886:12955`, and I re-verified this individually on several top-level instances (`4886:12956`, `4886:12960`, `4886:12963`, `4886:12966`) with the same empty result each time. None of these instance node names are `sl-*`, and since there are no Code Connect snippets anywhere in the tree (parent, child, or peer), none can be identified via the fallback heuristics. These are genuinely unconnected component instances.

Blocked node list:

| Node       | Name                                          |
| ---------- | --------------------------------------------- |
| 4886:12956 | Navigation                                    |
| 4886:12960 | PageHeader                                    |
| 4886:12963 | Banner                                        |
| 4886:12964 | Search (hidden / alternate-state)             |
| 4886:12966 | courses (table header row)                    |
| 4886:12968 | courses (table row)                           |
| 4886:12969 | courses (table row)                           |
| 4886:12971 | courses (table row)                           |
| 4886:12972 | courses (table row, hidden / alternate-state) |
| 4886:12973 | courses (table row)                           |

Coordinator action per SKILL.md Stage 1 step 5: halt and report. No retry — the skill grants retries (up to 2) only to `BLOCKED_ON_MCP`, not to `BLOCKED_ON_CODE_CONNECT`.

## 2. Did Stage 0 ask anything beyond the four answers?

**No.** Stage 0 lists exactly four questions (MCP server, framework, i18n, output location) and all four were supplied up front. The URL passed the `figma.com/design/...` validation. No further user interaction was needed or attempted.

## 3. Everything I had to decide that the four answers did not cover

All of these are gaps — the skill either under-specifies them or leaves them to coordinator judgement.

1. **Run-folder slug is ambiguous and lossy.** The skill derives `<file-slug>` from _the Figma file name_ (`Bookmarks` → `bookmarks`) plus the smallest free integer. `bookmarks-1` and `bookmarks-2` already existed, so this run got **`bookmarks-3`**. But the _case_ is a specific node (`4886-12955`, "course files") in a multi-design file — three different designs from the Bookmarks file all collapse onto `bookmarks-N`, and nothing in the folder name records which node it was. Meanwhile `.implement-design/` already holds hand-named folders (`b-itsl-bookmk-course-files/`, `b-itsl-bookmk-deleted-course/`) that follow a _different_, node-aware convention. I followed the skill literally rather than the surrounding convention; the skill does not say which wins.
2. **Whether an empty Code Connect map on the remote server is a real block or a server limitation** — see §7; the skill forced a judgement call it gives no criteria for. I chose to halt (literal reading).
3. **`<skill-dir>` / `<skills>` absolute paths.** The skill states agents can't guess the plugin location but never says how _I_ establish it. I took it from the base directory the Skill tool reported (`tools/implement-design-plugin/skills/implement-design`). Fine here, but unspecified.
4. **The output location given is a path that does not exist yet** (`examples/lit/src/_runs/control-...`). The skill's Stage 0 describes output location as a choice between two _shapes_ (`packages/components/` vs `examples/`); it never says who creates the directory, or how a nested `_runs/<slug>/` path interacts with the "root component's tag minus `sl-` as the folder" rule in Stage 3 step 9 — i.e. whether the root component nests one level deeper inside the supplied path or _is_ the supplied path. Not exercised (halted first), but it was already an open question going into Stage 3.
5. **`.gitignore`**: skill says ensure `.implement-design/` is ignored. It already was (line 21). No action — but the skill doesn't say to check whether it's ignored _and_ already present, only to add it.
6. **What to do with the partial run folder after a halt.** The skill is silent. I left `bookmarks-3/` in place (gitignored, harmless), but repeated halted re-runs will accumulate `bookmarks-N` folders and keep consuming the integer suffix, so a later successful run lands at a high N with no indication which siblings are abandoned shells.
7. **Whether to read `vision.md`** (SKILL.md line 7 points at it parenthetically but never says it is required reading). I did not.

## 4. Wall clock

**~2 min 14 s** total (20:48:39 → 20:50:53). Analyst subagent: 103 s, 21 tool calls.

## 5. Artifacts

Run folder used: **`/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/bookmarks-3/`**

What landed in it:

| File                          | Size   | Note                                         |
| ----------------------------- | ------ | -------------------------------------------- |
| `figma-metadata.json`         | 1706 B | full node tree of frame 4886:12955           |
| `figma-code-connect-map.json` | 320 B  | `{}` plus an appended free-text `note:` line |

**Not written** (analyst stopped before these calls): `screenshot.png`, `figma-design-context.md`, `figma-variable-defs.json`, `manifest.md`, `testing/`.

Note on `figma-code-connect-map.json`: it is **not valid JSON** — the analyst appended a plain-text `note: ...` line after the `{}`. The skill describes these files as "the raw output of the analyst's Figma calls (written by design-analyst, for reproducibility)" but specifies no format contract, so nothing caught this.

Working tree: clean of stray artifacts. `git status` shows only the four untracked items that pre-existed this session (`agents.zip`, `agents/`, `analiza-agent-plugin.md`, `analiza-projektu.md`). Nothing was committed.

## 6. Components created

**None.** Stages 2–6 never ran. No decomposition, no open questions, no validator verdicts, no tests, no reviewer punch list.

## 7. What surprised me

1. **Stage 0 and Stage 1 contradict each other about the remote server.** Stage 0's own question text describes the `figma` remote server as "headless, but `get_code_connect_map` is unreliable". Stage 1 step 5 then treats an empty Code Connect map as _proof_ of "unconnected component instances that need Code Connect mappings published in Figma — a human action the pipeline can't do". Those cannot both hold: on the server the skill itself labels unreliable for exactly this call, an empty map is at least as plausibly a server limitation as a genuine absence of mappings. The skill offers the coordinator **no way to disambiguate and no fallback** — no "retry the same call on `figma-desktop` before declaring the block", no "if the chosen server is `figma`, downgrade this to a warning". The one failure mode the Stage 0 question warns about is the one failure mode Stage 1 has no branch for. This is the single biggest gap the run exposed.
2. **The halt discards the cheapest and most reusable artifact.** `get_screenshot` is independent of Code Connect (the skill even says it _always_ uses the remote server regardless of the Stage 0 choice), yet the analyst's stop-on-block protocol fires before it. So a Code Connect halt leaves the run with **no cached ground-truth screenshot** — the user publishes mappings, re-runs, and pays for the whole ingestion again, including the one call that could never have been blocked. Nothing in the skill tells the analyst to capture the screenshot before evaluating the block.
3. **Asymmetric retry policy with no stated rationale.** `BLOCKED_ON_MCP` gets 2 re-spawns "with brief waits"; `BLOCKED_ON_CODE_CONNECT` gets zero. Defensible if the map call were deterministic — but per point 1 the skill has already declared it isn't on this server.
4. **The analyst did more verification than the skill asked for** (re-querying four individual instance nodes after the subtree call came back empty) and reported "genuinely unconnected" with more confidence than the empty map alone supports. Good instinct, but it's agent initiative, not skill instruction — the skill never defines what evidence justifies emitting the token, so the strength of a halt varies by agent.
5. **Two hidden nodes are in the blocked list** (`4886:12964` Search, `4886:12972` courses row, both `hidden="true"`). The skill never says whether hidden / alternate-state nodes should count toward a Code Connect block at all. Blocking a run on a node that isn't visible in the design is arguably wrong, and the user now has to publish mappings for them to get unstuck.

## Environment notes (separate from skill findings)

- **No port conflict**: Stage 4 was never reached, so no dev server was started. The port question did not arise.
- Figma MCP (remote) itself was reachable throughout — `get_metadata` and `get_code_connect_map` both returned successfully. There was no `BLOCKED_ON_MCP` condition.
