# Control run — A5 ETSL Metadata usage widget (pass 2, R2)

**Case**: A5 — ETSL "Metadata usage widget"
**Figma**: `https://www.figma.com/design/S5QgDy8X9eqhvECPANSZMM/Editorial-Suite-designs?node-id=17214-103584`
**Pipeline**: `implement-design:implement-design`, invoked via the Skill tool, unassisted.
**Start**: Sun Oct 4 23:00:41 CEST 2026
**End**: Sun Oct 4 23:04:51 CEST 2026
**Wall clock**: ~4 min 10 s (of which the single subagent accounted for 183 s)

---

## 1. Stage reached + exact halt token/reason

**Halted in Stage 1 (Design ingestion), at SKILL.md step 5.**

Halt token, returned verbatim by `implement-design:design-analyst`:

```
BLOCKED_ON_CODE_CONNECT
```

…followed by a list of **132** `<nodeId> — <nodeName>` entries.

Reason: `get_code_connect_map` for node `17214:103584` returned a **completely empty object — `{}`** — i.e. the Editorial-Suite-designs file has **zero published Code Connect mappings**. The analyst re-queried two nodes individually in a scoped fashion (`17214:103603` → `sl-button`, `17214:103592` → `tabbar-horizontal`); both still returned `{}`, so it ruled out a partial/transient response before blocking.

The analyst then applied the agent's step-3 identification heuristic (own node name is `sl-*` / a child sub-node carries a snippet / a peer instance of the same component has a non-null snippet). Because the map was empty there were **no non-null snippets anywhere to borrow from**, so only the first clause could ever fire. Result:

|                                           | count                                                        |
| ----------------------------------------- | ------------------------------------------------------------ |
| Total component instances under the frame | **158**                                                      |
| Identified (name is literally `sl-*`)     | **26** — `sl-button` ×15, `sl-icon` ×6, `sl-button-theme` ×5 |
| Genuinely unconnected → blocked           | **132**                                                      |

The frame itself is `Metadata usage widget`, 1440 × 2032, 430 nodes total.

Blocked-node breakdown by name (132 total):

| count | name                                             |
| ----- | ------------------------------------------------ |
| 89    | `td-text-start`                                  |
| 17    | `th-text-start`                                  |
| 12    | `label + num`                                    |
| 4     | `mat-data-footer`                                |
| 3     | `asset card`                                     |
| 2     | `tabbar-horizontal`                              |
| 2     | `button`                                         |
| 1     | `top nav bar`                                    |
| 1     | `threeships ` (trailing space in the Figma name) |
| 1     | `bar`                                            |

Per SKILL.md step 5, `BLOCKED_ON_CODE_CONNECT` is a **hard halt with no retries** (unlike `BLOCKED_ON_MCP`, which step 4 retries twice). The correct coordinator action is to stop and report the node list so a human can publish mappings in Figma and re-run. I did exactly that and changed nothing.

The design is table-heavy (89 `td-text-start` + 17 `th-text-start` across what the metadata shows as four `mat-data-footer`-terminated tables) — the single largest source of blocked nodes by far.

## 2. Did Stage 0 ask anything extra?

**No.** All four Stage 0 questions were supplied up front and the coordinator skill accepted them without issue:

- Figma MCP server → `figma` (remote)
- Framework → `lit`
- Internationalization → no
- Output location → `examples/lit/src/_runs/control-a5-etsl-metadata-r2/`

No `AskUserQuestion` call was needed, and no agent asked a follow-up. The run was genuinely unassisted from invocation to halt.

Note: the four answers were never actually _consumed_ beyond the server choice — the run died before framework, i18n or output location mattered. The output folder `examples/lit/src/_runs/control-a5-etsl-metadata-r2/` was **never created**, because the skill only resolves target paths in Stage 3 (step 9).

## 3. Everything I decided that the four answers didn't cover

1. **Run folder name.** SKILL.md says kebab-case the Figma file name and take the smallest free integer suffix. `Editorial-Suite-designs` → `editorial-suite-designs`; `-1`, `-2`, `-3` already existed, so I created `.implement-design/editorial-suite-designs-4/`. Deterministic, but worth recording — the run folder name does **not** encode the case id, so from the folder alone you cannot tell this is A5-R2 (three prior Editorial-Suite runs share the prefix and could be any node in that file).
2. **`.gitignore`** — the skill tells the coordinator to add `.implement-design/` if missing. It was already there (line 21), so nothing to do.
3. **Pre-created `testing/`** — I made `.implement-design/editorial-suite-designs-4/testing/` up front per the skill's working-directory spec. It stayed empty (Stage 4 never ran).
4. **Not retrying the analyst.** Step 4's retry budget is explicitly scoped to `BLOCKED_ON_MCP`; step 5 gives `BLOCKED_ON_CODE_CONNECT` no retries. I did not re-spawn.
5. **Not second-guessing the block.** I could have argued `td-text-start`/`th-text-start` are plainly table cells mappable to `sl-grid`, and `tabbar-horizontal` to `sl-tab-group` — but supplying that would have been exactly the hint the experiment forbids. I left the halt standing.
6. **Storybook port.** Port 6006 was already held by a Storybook dev server from a concurrent run (pid 10762, `storybook dev -p 6006 --no-open --quiet`). I decided I would **reuse** it rather than kill it (killing would break a concurrent run, and Vite HMR + the shared `_runs` index means new story files are picked up automatically). Never exercised — Stage 4 didn't run.

## 4. Wall clock

|                         |                                                                             |
| ----------------------- | --------------------------------------------------------------------------- |
| Start                   | Sun Oct 4 23:00:41 CEST 2026                                                |
| End                     | Sun Oct 4 23:04:51 CEST 2026                                                |
| **Total**               | **~4 min 10 s**                                                             |
| design-analyst subagent | 183.6 s, 14 tool calls, 66 222 tokens                                       |
| Coordinator overhead    | ~66 s (conventions read, run-folder setup, env probes, post-halt forensics) |

Note the shape: ~73 % of the run was the one subagent, and it spent that time fetching a 59 KB metadata tree and then re-verifying an empty Code Connect map twice before blocking. No code was generated, no browser opened, no build run.

## 5. Artifacts

All under `/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/editorial-suite-designs-4/`:

| file                          | size      | notes                                                                                                                                                 |
| ----------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `figma-metadata.json`         | 59 075 B  | Raw `get_metadata` response — a 2-element JSON array of `{type:"text", text:"<frame …>"}` chunks containing an **XML-ish** tree, not JSON. 430 nodes. |
| `figma-code-connect-map.json` | 3 B       | Literally `{}`.                                                                                                                                       |
| `testing/`                    | empty dir | Created by me; never written to.                                                                                                                      |

**Absent** (the analyst's protocol halts before producing them, per `design-analyst.md` step 4: "Do not call `get_design_context` or `get_screenshot`"):

- `screenshot.png` — **no visual ground truth was captured for this run**
- `figma-design-context.md`
- `figma-variable-defs.json`
- `manifest.md` (Stage 2, step 7 — never reached)

Nothing was written to `examples/lit/src/_runs/control-a5-etsl-metadata-r2/` (folder not created). No files touched outside the run folder.

**Working tree (step 19 check)** — `git status --porcelain`:

```
?? agents.zip
?? agents/
?? analiza-agent-plugin.md
?? analiza-projektu.md
```

All four pre-date this run. `.implement-design/` is gitignored, so this run's own artifacts correctly do not appear. **No stray artifacts, no scratch files at the repo root, nothing to clean up.** No `git add`, no commit, no PR.

## 6. Components / verdicts / tests / decomposer questions / [MINOR] list

**All empty — none of these stages ran.**

|                                      |                                                                     |
| ------------------------------------ | ------------------------------------------------------------------- |
| Components created                   | **none** (Stage 3 never reached)                                    |
| Validator verdicts                   | **none** (Stage 4 never reached)                                    |
| Tests written / run                  | **none** (Stage 5 never reached)                                    |
| Decomposer open questions + defaults | **none** (Stage 2 never reached — the decomposer was never spawned) |
| `[CRITICAL]` items                   | **none** (Stage 6 never reached)                                    |
| `[MINOR]` punch list                 | **none**                                                            |
| Handoff notes                        | none from agents; the halt itself is the handoff                    |

Agents spawned: **1 of 6** (`design-analyst`). `component-decomposer`, `component-implementer`, `visual-validator`, `component-author`, `component-reviewer` were never invoked.

**Human action required to unblock**: publish Code Connect mappings in the Editorial-Suite-designs Figma file for the 132 nodes listed in §1 (realistically: for the ~10 distinct components behind them), then re-run.

## 7. Environment notes (separated from skill findings)

How each known hazard actually played out:

| hazard                                                                                                                                          | what happened                                                                                                                                                                                                                                                                                                                                                                    | resolution                                                                                                                                                                |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tsc` 2 pre-existing errors in `packages/components/grid/src/grid.ts` (1180, 1361)                                                              | **Not encountered.** Stage 3's consolidated `tsc` gate never ran.                                                                                                                                                                                                                                                                                                                | n/a this run                                                                                                                                                              |
| `yarn <script>` dies without `FONT_AWESOME_AUTH_TOKEN`                                                                                          | **Confirmed present but not hit.** `FONT_AWESOME_AUTH_TOKEN` is unset in this shell; `.yarnrc.yml:21` is `npmAuthToken: '${FONT_AWESOME_AUTH_TOKEN}'` under the `fortawesome` npm scope, so any `yarn` script would have failed at config resolution. `node_modules` is already installed, so the planned workaround was a dummy value (`FONT_AWESOME_AUTH_TOKEN=x yarn start`). | Never needed — Stage 4 never ran                                                                                                                                          |
| ~24 sibling folders in `examples/lit/src/_runs/` share one Storybook index; duplicate story id kills the server; stale siblings inject `TS2717` | **Not encountered** — no story file was generated. 23 sibling folders are present, including a **pre-existing `a5-etsl-metadata-usage-widget/`** from an earlier batch (distinct from my `control-a5-etsl-metadata-r2/` slug, so no id collision would have occurred).                                                                                                           | n/a this run                                                                                                                                                              |
| **New, not on the list**: port 6006 already occupied                                                                                            | A Storybook dev server from a **concurrent run** (pid 10762) holds 6006. Step 12's `yarn start` would have collided.                                                                                                                                                                                                                                                             | Decided to reuse the running server rather than kill it (forbidden to touch other runs' state; HMR + shared index would have picked up my files anyway). Never exercised. |

None of these contributed to the halt. **The halt is purely a skill/design-data finding, uncontaminated by environment.**

## 8. What surprised me about the skill

1. **The Code Connect gate is all-or-nothing and fires before anything useful is cached.** The map came back `{}` — not "some nodes unmapped", but _the file has no Code Connect at all_. Yet the agent still walks the whole identification heuristic and emits a 132-line node list, as though the problem were per-node. The far more actionable report is one line: "this Figma file has zero published Code Connect mappings." The protocol has no way to say that; it can only enumerate. A coordinator-level check for an empty map would turn a 132-item punch list into a single sentence.

2. **A blocked run captures no screenshot, so the halt destroys the cheapest artifact.** `design-analyst.md` step 4 explicitly forbids `get_screenshot` on the blocked path. The screenshot is the run's declared ground truth, costs one call, and is the one thing a human needs in order to _judge_ whether the 132 blocked nodes matter. Blocking before capturing it means a human who re-runs after publishing mappings pays for the whole ingestion again, and in the meantime has a run folder containing an XML blob and `{}`.

3. **The heuristic's three clauses collapse to one when the map is empty.** Clauses 2 and 3 ("a child sub-node carries a snippet", "a peer instance has a non-null snippet") both need _some_ non-null snippet to exist somewhere. With `{}` they are dead code, so identification degenerates to pure `sl-*` name-matching. That is a silent, systematic weakening of the gate exactly in the case where the gate fires hardest — and it's why `sl-button`/`sl-icon`/`sl-button-theme` passed while `tabbar-horizontal` (plainly an `sl-tab-group`) did not. The heuristic rewards designers who named a layer `sl-icon` and punishes everyone else.

4. **The blocked list is dominated by nodes that are not components in any meaningful sense.** 106 of 132 blocked nodes are `td-text-start` / `th-text-start` — individual table cells. Treating each cell as "a component instance needing a Code Connect mapping" is a category error: nobody will ever publish 89 mappings for table cells. The gate's unit (the Figma _instance_) is far finer than the unit a human would act on (the ~10 distinct components). The list should have been deduplicated by component name before being handed to a human.

5. **Stage 0's answers are collected before anything can possibly use them.** Framework, i18n and output location were all gathered and then discarded unused, because the only question that mattered in Stage 1 was the server choice. The skill's "gather everything up front so the run is standalone" design is sound for a _successful_ run, but it front-loads three decisions behind a gate that rejects a large fraction of real designs.

6. **The halt is correct and fast, and that is genuinely good.** 4 minutes, one subagent, zero files written outside a gitignored folder, zero repo mutation, clean `git status`. The pipeline failed in precisely the way a pipeline should fail — early, cheaply, and reversibly. My criticisms above are all about the _quality of the halt report_, not about the decision to halt.
