# Control run A5 — ETSL Metadata usage widget (r1)

**Case**: A5 ETSL Metadata usage widget
**Figma**: https://www.figma.com/design/S5QgDy8X9eqhvECPANSZMM/Editorial-Suite-designs?node-id=17214-103584
**Skill**: `implement-design:implement-design` (invoked via Skill tool, argument block verbatim)
**Start**: Sun Oct 4 20:48:54 CEST 2026
**End**: Sun Oct 4 20:53:28 CEST 2026
**Wall clock**: 4 min 34 s

---

## 1. Stage reached / halt

**Halted in Stage 1 (Design ingestion).** Never reached Stage 2.

Halt token returned by `implement-design:design-analyst`:

> `BLOCKED_ON_CODE_CONNECT`

Reason, quoted from the analyst:

> "Code Connect is empty for this node (`get_code_connect_map` returned `{}` for the top-level frame and also for direct spot-checks on individual instances, e.g. `17214:103603` "sl-button" and `17214:103976` "asset card" — both still `{}`). Per the identification heuristic, only instances literally named `sl-*` (`sl-button` ×15, `sl-icon` ×6, `sl-button-theme` ×5) could be auto-identified; none of the remaining 132 component-instance nodes qualify (no CC snippet exists anywhere in this subtree to identify via a child or a peer, since the map is universally empty)."

Per SKILL.md Stage 1 step 5 this is a terminal halt for the coordinator:

> "**`BLOCKED_ON_CODE_CONNECT`**: the design has unconnected component instances that need Code Connect mappings published in Figma — a human action the pipeline can't do. **Halt** and report the blocked-node list so the user can publish mappings and re-run."

So I halted. No retry is specified for this token (retries are specified only for `BLOCKED_ON_MCP`).

**Blocked node count**: 132 instances. Distinct component types among them: `top nav bar`, `tabbar-horizontal`, `label + num`, `threeships`, `bar`, `button`, `th-text-start`, `td-text-start`, `mat-data-footer`, `asset card`. (Full node-id list is in the analyst's return, reproduced at the bottom of this file.)

Note: the halt is **not** an MCP failure. The remote `figma` server answered `get_metadata` fine (59 KB of metadata landed on disk) and answered `get_code_connect_map` successfully — it just returned an empty map. This is the documented weakness of the remote server that Stage 0's own question text warns about: _"`figma` (remote; headless, but `get_code_connect_map` is unreliable)"_. The run was configured with exactly the server the skill flags as unreliable for the one call that gates Stage 1.

## 2. Did Stage 0 ask anything beyond the four supplied answers?

**No.** All four Stage 0 questions (Figma MCP server, framework, i18n, output location) were covered by the supplied answer block, and the skill's Stage 0 is explicit that nothing further may be asked. I asked the user nothing.

## 3. Things I had to decide that the four answers did not cover

Each of these is a gap in the skill — I resolved them myself, by reading the skill literally, without asking.

1. **Run-folder slug collides with an existing, differently-named convention.** The skill's rule is: kebab-case the Figma _file_ name from the URL → `Editorial-Suite-designs` → `editorial-suite-designs`, then smallest free `-N`. `-1` and `-2` already existed, so I used `editorial-suite-designs-3`. But `.implement-design/` already contains a folder named `a5-etsl-metadata-usage-widget` — i.e. someone (an earlier run or a human) has been naming folders per _case_, not per _file_. The skill's rule cannot produce that name and gives no guidance on reusing or reconciling an existing folder for the same node. Two naming schemes now coexist in `.implement-design/`. Also worth noting: the slug keys on the **file**, not the **node**, so every case cut from the same Figma file (A5 here, and whatever produced `-1`/`-2`) silently shares a slug stem and is distinguished only by an incrementing integer. Nothing in the folder records which node-id it was for.
2. **Whether `.implement-design` was already gitignored.** The skill says "make sure `.implement-design/` is ignored — add it to the project's `.gitignore` if it isn't". I had to check; it was already there (`.gitignore:21`). No action. Minor, but it is an unconditional instruction with a conditional body.
3. **Which concrete MCP tool namespace "figma (remote)" maps to.** The Stage 0 answer is the word `figma`; the analyst's tool list exposes both `mcp__figma__*` and `mcp__figma-desktop__*`. The skill never states the mapping from the answer string to the tool prefix. I spelled it out for the analyst explicitly (`use the mcp__figma__* tools`) because leaving it implicit risked the analyst picking the desktop server. Arguably I supplied information the skill did not — but the skill's own Stage 0 text names the two options as `figma-desktop` and `figma`, so the mapping is the only consistent reading.
4. **Verbatim vs. paraphrased hand-off of the run path.** The skill tells me to pass `<run>` to agents but does not say whether paths must be absolute. Agent threads reset cwd between bash calls, so I passed absolute paths throughout. Not stated in the skill.
5. **Whether to pass the manifest-schema path when the analyst might find it itself.** Skill says pass it; I did. Fine — listing only because it is the kind of thing that is easy to drop.

Several further gaps were **not reached** because the run halted in Stage 1 (output-location-to-target-path resolution, dependency-level ordering, the Stage 4 dev-server port, the Stage 3 consolidated `tsc` gate's choice of `<package>/tsconfig.json` for an `examples/` run — that last one looks under-specified for the example path, since examples share a package tsconfig rather than owning one, but I did not get there to confirm).

## 4. Wall clock

**4 min 34 s** total (20:48:54 → 20:53:28). Of that, the analyst subagent accounted for ~4 min 2 s (242 s, 25 tool calls). Coordinator overhead was ~30 s.

## 5. Artifacts

Run folder used: `/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/editorial-suite-designs-3/`

Landed in it:

| File                          | Size     | Note                                                |
| ----------------------------- | -------- | --------------------------------------------------- |
| `figma-metadata.json`         | 59 075 B | full node metadata for the frame                    |
| `figma-code-connect-map.json` | 3 B      | literally `{}` — the empty map that caused the halt |

**Not** written, because the analyst stops at the block: `screenshot.png`, `figma-design-context.md`, `figma-variable-defs.json`, `manifest.md`, `testing/`. The analyst stated this was deliberate: _"`get_design_context`, `get_variable_defs`, and `get_screenshot` were intentionally not called per the blocking protocol."_

`git status` at end shows only the four pre-existing untracked items from the start-of-session snapshot (`agents.zip`, `agents/`, `analiza-agent-plugin.md`, `analiza-projektu.md`). **Nothing stray was produced by this run** — the run folder is gitignored. No commits, no `git add`, no PR.

## 6. Components created / validator verdicts / tests / decomposer questions / MINOR list

**None of these exist.** The run halted before Stage 2, so:

- Components created: **none**. `examples/lit/src/_runs/control-a5-etsl-metadata-r1/` was never created.
- Validator verdicts: **n/a** (Stage 4 not reached; no dev server started, so **no port conflict to report** — the environment note about a busy port does not apply to this run).
- Test results: **n/a** (Stage 5 not reached; and for an `examples/` output location Stage 5 would have skipped tests anyway).
- Decomposer open questions + defaults: **n/a** (`component-decomposer` never spawned).
- `[MINOR]` punch list: **n/a** (`component-reviewer` never spawned).

Agents actually spawned: **1** (`implement-design:design-analyst`). Agents the skill would have spawned had it run to completion: 6 types.

## 7. What surprised me about how the skill behaved

1. **The pipeline's hardest gate is its first one, and it is a coin-flip on a Stage 0 answer the user is invited to get wrong.** Stage 0 presents `figma` (remote) as a legitimate option while its own parenthetical admits `get_code_connect_map` is "unreliable" there. Stage 1 then makes that exact call load-bearing and terminal. The skill knows the failure mode, offers the user the path to it, and then halts on it. It never says "if you chose the remote server and the map comes back empty, retry on `figma-desktop`" — which is the obvious recovery and the one a human would do instinctively. A reasonable fix: make `BLOCKED_ON_CODE_CONNECT` conditional on server choice, i.e. if the run used the remote server and the map is _universally_ empty (as opposed to partially populated), treat it as a suspected server limitation and re-spawn against `figma-desktop` before halting.
2. **An empty map and a map with genuine gaps are indistinguishable to the halt logic.** `{}` for the whole subtree almost certainly means "this server can't read Code Connect", not "132 designers forgot to publish 132 mappings". The analyst itself spotted this and spot-checked two children to confirm the map was uniformly empty — good instinct — but the protocol gives it nowhere to put that distinction except the same single `BLOCKED_ON_CODE_CONNECT` token. The signal exists and is thrown away.
3. **The halt advice is addressed to the wrong failure.** Stage 1 step 5 tells the user to "publish mappings and re-run". If the real cause is the remote server, publishing mappings is wasted human effort and the re-run fails identically. Contrast Stage 1 step 4 (`BLOCKED_ON_MCP`), which _does_ give concrete recovery advice (`claude mcp list`, re-auth, open the desktop app) — the better-specified branch is attached to the less likely failure.
4. **No screenshot is cached before the block.** The skill calls the screenshot "ground truth throughout", and `get_screenshot` always uses the remote server regardless of the Stage 0 answer — so it would have succeeded here and cost nothing. Because the analyst halts first, a re-run on a different server has to re-fetch everything. Caching the screenshot before evaluating the Code Connect gate would make the halt cheap to recover from.
5. **The run-folder naming rule is file-scoped, not node-scoped** (see gap #1). For a measurement harness running many cases out of one Figma file, `editorial-suite-designs-N` is close to useless as an identifier, and the pre-existing per-case folder name in the same directory suggests the humans using this already worked around it.
6. **132 blocked nodes is not a list a human can act on, and the skill asks me to print it.** Of the 132, ~110 are `td-text-start` / `th-text-start` table cells — a table. The report the skill mandates is a node-id dump with no grouping by component type; the analyst volunteered the distinct-type rollup (10 types) on its own initiative, which is the only actionable form of this. The skill should ask for that rollup rather than the raw list.
7. **The skill never defines what the coordinator does with partial artifacts on a halt** — leave them, delete them, mark the folder as aborted? I left `editorial-suite-designs-3/` in place with its two files. A later run following the `-N` rule will skip past it and allocate `-4`, so the aborted folder permanently consumes a slug with no marker saying it failed.

---

## Appendix — blocked node list as returned by the analyst

Distinct component types: `top nav bar`, `tabbar-horizontal`, `label + num`, `threeships`, `bar`, `button`, `th-text-start`, `td-text-start`, `mat-data-footer`, `asset card`.

Auto-identified (literally `sl-*` named, not blocked): `sl-button` x15, `sl-icon` x6, `sl-button-theme` x5.

Blocked (132): 17214:103585 top nav bar; 17214:103592 tabbar-horizontal; 17214:103611/103618/103626/103633/103641/103648 label + num; 17214:103654 threeships; 17214:103656/103664/103690/103705/103713/103720 label + num; 17214:103728 bar; 17214:103886/103889 button; 17214:103938 th-text-start; 17214:103939-103944 td-text-start; 17214:103946 th-text-start; 17214:103947-103952 td-text-start; 17214:103954 th-text-start; 17214:103955-103960 td-text-start; 17214:103962 th-text-start; 17214:103963-103967 td-text-start; 17214:103968 mat-data-footer; 17214:103976/103977/103978 asset card; 17214:103981 th-text-start; 17214:103982-103987 td-text-start; 17214:103989 th-text-start; 17214:103990-103995 td-text-start; 17214:103997 th-text-start; 17214:103998-104003 td-text-start; 17214:104005 th-text-start; 17214:104006-104010 td-text-start; 17214:104011 mat-data-footer; 17214:104019 th-text-start; 17214:104020-104024 td-text-start; 17214:104026 th-text-start; 17214:104027-104029 td-text-start; 17214:104031 th-text-start; 17214:104032-104034 td-text-start; 17214:104036 th-text-start; 17214:104037 td-text-start; 23759:157574 td-text-start; 17214:104039 td-text-start; 17214:104041 th-text-start; 17214:104042-104046 td-text-start; 17214:104047 mat-data-footer; 17214:104052 tabbar-horizontal; 17214:104058 th-text-start; 17214:104059-104065 td-text-start; 17214:104067 th-text-start; 17214:104068-104074 td-text-start; 17214:104076 th-text-start; 17214:104077-104081 td-text-start; 17214:104083 th-text-start; 17214:104084-104088 td-text-start; 17214:104089 mat-data-footer.
