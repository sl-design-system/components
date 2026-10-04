# Control run — A4 Sesame My Groups (r1)

- **Figma**: https://www.figma.com/design/UBr399hnydpNF9P5Jb2vfx/MySesame-Redesign?node-id=2847-14994
- **Start**: Sun Oct 4 20:53:53 CEST 2026
- **End**: Sun Oct 4 20:58:12 CEST 2026
- **Wall clock**: ~4 min 19 s (analyst itself: 218.7 s, 6 tool calls, 69k subagent tokens)
- **Outcome**: HALTED in Stage 1.

---

## 1. Stage reached + halt

**Stage 1 (Design ingestion). Halted there.** Never reached Stage 2.

The `design-analyst` returned the halt token:

> `BLOCKED_ON_CODE_CONNECT`

Reason, verbatim from the analyst:

> The `get_code_connect_map` response for node `2847:14994` ("My Groups") was an empty object (`{}`) — no Code Connect mappings exist for any node in this subtree, not even a `null` placeholder. Per the heuristic, instances named `sl-*` (e.g. `sl-button`, `sl-searchfield`, `sl-helper-theme`) are identified as existing SLDS components despite the empty map and would proceed normally. However, the following component-instance nodes have generic/legacy names that are **not** identifiable as any existing SLDS component (no `sl-*` name, no resolvable child snippet, no mapped sibling instance to borrow from).

Confirmed on disk: `figma-code-connect-map.json` is 3 bytes — literally `{}`.

SKILL.md step 5 makes this terminal and un-retryable:

> **`BLOCKED_ON_CODE_CONNECT`**: the design has unconnected component instances that need Code Connect mappings published in Figma — a human action the pipeline can't do. **Halt** and report the blocked-node list so the user can publish mappings and re-run.

So I halted without retry. (Step 4's "re-spawn up to 2 more times" applies only to `BLOCKED_ON_MCP`.)

### Blocked-node list (as returned)

Singletons:

- `2847:15002` — Button (generic "Button" instance beside `sl-button` siblings in the header action row)
- `2847:15076` — Button (hidden alt state, School selection dropdown)
- `2847:15060`, `2847:15061`, `2847:15062`, `2847:15063` — menu item SU
- `2847:15065` — avatar_SU
- `2847:15075` — button (School selection dropdown trigger)
- `2847:15381`, `2847:15746` — xmark (bulk panel close icon)
- `2847:15426` — Footer
- `2847:15346` — th-text-start (hidden alt column header)
- `2847:15244` — table sorting icon (hidden)
- `2847:15361` — check (hidden, dropdown panel checkmark)
- `2847:15368` — Icon-left (hidden, dropdown panel icon slot)

Repeated (20 instances each, one per table row):

- `v-input--selection-controls` (row checkbox): `2847:15090…15147` (every 3rd id)
- `td-text-start` col 2: `2847:15152…15171`
- `td-text-start` col 3: `2847:15175…15194`
- `td-text-start` col 4: `2847:15198…15217`
- `td-text-start` col 5: `2847:15221…15240`
- `Icon-button` (last-column action): `2847:15248…15343` (every 5th id)
- `Icon-button` (hidden alt column variant): `2847:15348`, `15350`, `15353`, `15356`

Roughly **125 unconnected instance nodes**, dominated by a 20-row × 5-column table built from legacy Vuetify-era components (`v-input--selection-controls`, `td-text-start`, `th-text-start`) rather than SLDS components.

---

## 2. Did Stage 0 ask anything beyond the four answers?

**No.** All four supplied answers (MCP server, framework, i18n, output location) were sufficient for Stage 0; the skill's `AskUserQuestion` batch covers exactly those four and nothing else was needed to start Stage 1. Zero additional user interaction occurred — correct per "After Stage 0, you talk to the user only in the final report (and on an exceptional halt)."

---

## 3. Things I had to decide that the four answers did not cover

Each of these is a gap the skill leaves to coordinator judgement. The run halted early, so this list is short — a full run would surface far more (all of Stage 3–6 is untested here).

1. **Run-folder slug is ambiguous and collides with the experiment's own naming.** The skill says kebab-case _the Figma file name_ and append the smallest free `-N`: `MySesame-Redesign` → `mysesame-redesign`, and `-1/-2/-3` already exist, so I created **`.implement-design/mysesame-redesign-4/`**. But the repo already has a `.implement-design/a4-sesame-my-groups/` folder (the capture protocol's naming). The skill's rule gives no way to produce a case-named folder, and nothing tells the coordinator the run folder should match the output-location slug. I followed the skill literally. Consequence: the run's artifacts are in `mysesame-redesign-4`, not in a folder whose name identifies the case.
2. **The `-N` rule silently buries related runs.** Three prior MySesame runs sit in `-1/-2/-3`; nothing in the skill says to check whether an earlier run of the _same node_ already cached a screenshot and Figma output that could be reused. The skill mandates a fresh unique folder, so Figma was re-fetched from scratch. For a measurement harness that's correct, but the skill never states the intent either way.
3. **`testing/` subfolder creation is unassigned.** The skill says "`testing/` — … (written by visual-validator)" but also lists it as part of the run folder structure created "at the start". I created it up front. Nothing says whose job it is.
4. **The output location is a third shape the skill does not model.** Stage 0 offers exactly two: `packages/components/` (flat packages) or "an app/example path like `examples/`". The supplied answer is `examples/lit/src/_runs/control-a4-sesame-my-groups-r1/` — a _pre-named leaf_ inside an example package. The skill's step 9 says to derive the root component's folder from its tag ("root component's tag minus `sl-`, kebab-cased, as the folder"), which would have produced `examples/lit/src/_runs/control-a4-sesame-my-groups-r1/<root-tag>/…` — i.e. the supplied path is a _container_, not the component folder. I would have had to decide whether the supplied path is the component folder itself or its parent. (Looking at the neighbouring `control-a9-sanna-login-r2/`, components nest one level below — so parent — but that is inference from a sibling, not from the skill.) Never exercised; the run halted first.
5. **Whether to register the component in `examples/lit/src/index.ts`.** The example package has a barrel `index.ts` re-exporting its four examples; the `_runs/` ones are _not_ in it. The skill and conventions doc say nothing about the barrel for example output. Would have been a coin-flip.
6. **Which `yarn start` to use for Stage 4.** Root `package.json` has both `start` and `storybook` wireit scripts; the skill says "Lit: `yarn start` Storybook". I confirmed `.storybook/main.ts` globs `../examples/**/*.stories.ts`, so the example would be indexed — but the skill never tells the coordinator to verify the story glob covers the chosen output location. For a _new_ example path that isn't globbed, Stage 4 would fail opaquely.
7. **Whether the analyst's `sl-*`-name heuristic is legitimate.** The analyst applied an unwritten rule — treat an instance _named_ `sl-button` as a known SLDS component even with an empty Code Connect map — then blocked only on the non-`sl-*` remainder. That heuristic is doing a lot of load-bearing work and nothing in SKILL.md sanctions or bounds it. I did not second-guess it (per the no-interference rule), but it's the difference between "block on 125 nodes" and "block on everything".

---

## 4. Wall clock

**~4 min 19 s** total (20:53:53 → 20:58:12 CEST). Essentially all of it was the single analyst spawn (3 min 39 s).

---

## 5. Artifacts

Run folder used: **`/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/mysesame-redesign-4/`**

What landed in it:

| File                          | Size      | Note                                   |
| ----------------------------- | --------- | -------------------------------------- |
| `figma-metadata.json`         | 44,380 B  | full node tree for `2847:14994`        |
| `figma-code-connect-map.json` | 3 B       | literally `{}` — the cause of the halt |
| `testing/`                    | empty dir | created up front, never used           |

**Not written** (analyst blocked before those protocol steps): `screenshot.png`, `figma-design-context.md`, `figma-variable-defs.json`, `manifest.md`.

Note for the capture protocol: **there is no ground-truth screenshot for this run**, because the skill's analyst ordering puts `get_code_connect_map` before `get_screenshot`. A halted run therefore yields no reference image at all.

Output location `examples/lit/src/_runs/control-a4-sesame-my-groups-r1/` was **never created** — nothing to put in it.

`git status` is identical to the pre-run baseline (only the four pre-existing untracked paths: `agents.zip`, `agents/`, `analiza-agent-plugin.md`, `analiza-projektu.md`). `.implement-design` is already in `.gitignore` (line 21), so the run folder is invisible to git. No stray artifacts; nothing removed; nothing committed.

---

## 6. Components created / validator verdicts / tests / decomposer questions / punch list

**All empty — the run never reached these stages.**

- Components created: none.
- Validator verdicts: none (Stage 4 never ran).
- Test results: none (Stage 5 never ran).
- Decomposer open questions + defaults: none (Stage 2 never ran — the decomposer was never spawned).
- `[MINOR]` punch list: none (Stage 6 never ran).

---

## 7. What surprised me

1. **`get_code_connect_map` returned `{}` on the remote server — exactly the failure mode Stage 0's own help text predicts, and the skill still routes it to a terminal halt.** The Stage 0 question says in so many words: `figma` (remote) is "headless, but `get_code_connect_map` is unreliable". The skill therefore _knows_ the remote server has a flaky Code Connect call, yet treats an empty map as proof that _the design lacks published mappings_ — a human-action-required halt — with no distinction between "the map is genuinely empty" and "this server can't read maps". A `{}` from a server the skill itself labels unreliable is ambiguous evidence being reported as a definitive diagnosis. The obvious missing branch — retry on `figma-desktop`, or at minimum caveat the verdict — doesn't exist. This is the single biggest finding of the run.
2. **The halt is un-retryable by construction, unlike `BLOCKED_ON_MCP`.** Step 4 gives the MCP failure three attempts; step 5 gives Code Connect zero. Given #1, the retry budget is arguably on the wrong branch.
3. **The blocked-node list is unusable as a human work order.** It names ~125 nodes, but ~120 of them are 20× repetitions of 6 distinct _components_ (`td-text-start`, `v-input--selection-controls`, `Icon-button`, …). The user has to publish ~6 mappings, not 125. The skill asks the analyst for a "node list" and gets exactly that; nobody is asked to collapse instances back to their master components, so the report hugely overstates the work and buries the actual six-item ask.
4. **Ordering wastes the cheapest and most valuable artifact.** `get_screenshot` is cheap, independent of Code Connect, and is the pipeline's declared "ground truth throughout". Putting it after the Code Connect gate means a halted run produces no visual record of what it was trying to build — so a human cannot even eyeball the design to judge whether the halt was worth acting on.
5. **The `sl-*` naming heuristic is invented, not specified.** The analyst resolved an empty-map situation by falling back on node _names_, which is sensible, but SKILL.md and the schema never authorize or bound it. Two runs of the same case could legitimately block on different node sets depending on how aggressively the analyst applies it. That's a reproducibility hole in a measurement harness.
6. **Step 19's "remove stray artifacts" has no definition of stray.** It says to confirm nothing landed outside "the `<run>` folder and the generated component path" — in a repo with pre-existing untracked files, a literal reading tells the coordinator to delete the user's unrelated work. I was externally warned not to; the skill itself would not have stopped me. That's a genuine hazard, not a nitpick.
7. **The skill never says what to do with a run folder from a halted run.** `mysesame-redesign-4/` now holds two files and an empty dir, and has permanently consumed the `-4` suffix. Re-running this case will create `-5`. Over an experiment like this one, the numbering drifts away from anything meaningful.
