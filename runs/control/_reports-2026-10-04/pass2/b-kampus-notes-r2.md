# Control run — B-Kampus Notes panel (pass 2, R2)

**Case**: B-Kampus Notes panel
**Figma**: https://www.figma.com/design/73YHtIYl0UHXH8ST4J7VKI/New-content-view?node-id=5308-32158
**Pipeline**: `implement-design:implement-design` (invoked via Skill tool, argument block verbatim)
**Run folder**: `/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/new-content-view-4/`
**Intended output location**: `examples/lit/src/_runs/control-b-kampus-notes-r2/` — never created (halt came first)
**Start**: Sun Oct 4 23:00:54 CEST 2026
**End**: Sun Oct 4 23:02:37 CEST 2026
**Wall clock**: ~1 min 43 s (the analyst subagent itself took 49.7 s / 6 tool calls / ~29.8k tokens)

---

## 1) Stage reached + exact halt token/reason

**Stage 1 (Design ingestion). Halt token: `BLOCKED_ON_CODE_CONNECT`.**

`implement-design:design-analyst` ran to spec and returned `BLOCKED_ON_CODE_CONNECT` plus the node list. SKILL.md step 5 makes this a hard, non-recoverable halt:

> **`BLOCKED_ON_CODE_CONNECT`**: the design has unconnected component instances that need Code Connect mappings published in Figma — a human action the pipeline can't do. **Halt** and report the blocked-node list so the user can publish mappings and re-run.

So the run stopped at step 5 of 19. Stages 2–6 never started; no component-decomposer, component-implementer, visual-validator, component-author or component-reviewer was ever spawned.

**Root cause as reported by the analyst**: `get_code_connect_map` returned a literal empty object `{}` for the entire subtree — not a map with some `null` entries, but _no entries at all_. The analyst's escape hatches in its step 3 (treat a `null`-mapped instance as connected if its node name is an `sl-*` element, or its sub-nodes carry a snippet, or a peer instance of the same component has a non-`null` snippet) all require _some_ map content to work against. With `{}` every one of the 18 component instances in the frame is "genuinely unconnected" by definition, and the agent blocked.

Per its own protocol it then skipped `get_design_context`, `get_variable_defs` and `get_screenshot`.

**18 blocked nodes** (verbatim from the agent):

| Node ID    | Name                                |
| ---------- | ----------------------------------- |
| 5308:32159 | Fullscreen toggle                   |
| 5308:32161 | Table of contents - Elements basics |
| 5308:32162 | notes-sidepanel                     |
| 5308:32164 | breadcrumb-2023                     |
| 5308:32165 | Chapter page title                  |
| 5308:32167 | Student view                        |
| 5308:32170 | subchapter-card                     |
| 5308:32171 | subchapter-card                     |
| 5308:32172 | subchapter-card                     |
| 5308:32174 | subchapter-card                     |
| 5308:32175 | subchapter-card                     |
| 5308:32176 | subchapter-card                     |
| 5308:32178 | subchapter-card                     |
| 5308:32179 | subchapter-card                     |
| 5308:32181 | Student view                        |
| 5308:32182 | Left-toolbar                        |
| 5308:32183 | Header-navigation                   |
| 5308:34107 | Number annotation                   |

(8 of the 18 are the same `subchapter-card` component instanced 8 times; `Student view` appears twice. So the list is 18 _instances_ of roughly 10 distinct components — the list is not de-duplicated by component.)

## 2) Did Stage 0 ask anything extra?

**No.** The four supplied answers (server `figma` remote, framework `lit`, i18n `no`, output location `examples/lit/src/_runs/control-b-kampus-notes-r2/`) map exactly 1:1 onto the four questions SKILL.md Stage 0 specifies. The URL passed the `figma.com/design/...` validation. No `AskUserQuestion` was needed and none was issued. Stage 0 was a no-op beyond validation.

## 3) Everything I decided that the four answers didn't cover

The halt came early, so the decision surface was small. Three real decisions, all before Stage 1 returned:

1. **Run-folder slug and suffix.** SKILL.md says kebab-case the _Figma file name_ (`New-content-view` → `new-content-view`), not the case name. `-1`, `-2`, `-3` already existed, so I created `.implement-design/new-content-view-4/` plus its `testing/` subfolder. Worth flagging: the run folder is named after the Figma **file**, while the output location is named after the **case** — so run folders for different cases in the same Figma file collide into one numbered series and are not self-describing. Nothing in `new-content-view-4`'s name says "B-Kampus Notes panel".
2. **`.gitignore`.** SKILL.md tells the coordinator to ensure `.implement-design/` is ignored. It already is (line 21). No edit made.
3. **Storybook story-title namespace (pre-emptive, never used).** I grepped `examples/lit/src/_runs/**/*.stories.ts` and found an existing `title: 'Runs/B Kampus Notes Panel/Chapter page'` from an earlier run of this same case. Had Stage 3 been reached I would have instructed implementers to namespace under `Runs/Control B Kampus Notes R2/...` to avoid the duplicate-story-id crash. The pipeline never got there, so this was not applied. **Note this is a gap the skill does not cover**: SKILL.md gives implementers no story-title uniqueness rule, and nothing in the pipeline would have prevented the collision on its own.

Nothing else required a judgement call. No agent asked me anything.

## 4) Wall clock

~**1 min 43 s** end to end (23:00:54 → 23:02:37). Of that, ~50 s was the analyst; the rest was reading SKILL.md + `component-conventions.md`, folder setup, and the baseline typecheck I ran for environment calibration.

## 5) Artifacts

Inside the run folder `/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/new-content-view-4/`:

| File                          | Size   | Note                                                                                                                                                                                                                  |
| ----------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `figma-metadata.json`         | 2763 B | Full structural tree of frame `5308:32158`. Despite the `.json` extension the content is **XML-ish markup** (`<frame …><instance …/></frame>`), i.e. the raw MCP response pasted into a `.json` file. Not valid JSON. |
| `figma-code-connect-map.json` | 3 B    | Literally `{}`.                                                                                                                                                                                                       |
| `testing/`                    | empty  | Created by me per SKILL.md; never written to.                                                                                                                                                                         |

**Not produced** (the analyst's protocol skips them on a Code Connect block):

- `screenshot.png` — the ground-truth reference. **Absent.**
- `figma-design-context.md` — absent.
- `figma-variable-defs.json` — absent.
- `manifest.md` — absent (Stage 2 never ran).

**Nothing was generated under `examples/lit/src/_runs/control-b-kampus-notes-r2/`** — the directory does not exist.

**Working tree (step 19 check)**: `git status --porcelain` shows only the four pre-existing untracked entries (`agents.zip`, `agents/`, `analiza-agent-plugin.md`, `analiza-projektu.md`). This run created nothing outside its gitignored run folder. No stray screenshots, no scratch files at the repo root. No commits, no `git add`, no PR.

## 6) Components / verdicts / tests / decomposer questions / [MINOR] list

All **N/A — not reached**:

- **Components created**: none. Decomposition never ran, so there is not even a proposed component tree.
- **Validator verdicts**: none. Stage 4 never started; Storybook was never launched.
- **Tests**: none. Stage 5 never started. (Had it run, the `examples/` output location would have scoped Stage 5 to story enrichment only — no Vitest spec, no website docs, no changeset.)
- **Decomposer open questions + chosen defaults**: none — `component-decomposer` was never spawned.
- **[MINOR] punch list**: none — `component-reviewer` was never spawned.
- **Unresolved handoff notes**: the 18-node Code Connect list above is the only outstanding item, and it is a human action in Figma.

## 7) Environment notes (separated from skill findings)

All three known environment hazards were checked; **none of them affected this run**, because the halt preceded every stage that would have touched them.

| Hazard                                                                                                                                              | How it resolved                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tsc` has 2 pre-existing errors in `packages/components/grid/src/grid.ts` (1180, 1361)                                                              | **Confirmed as the only errors.** I ran `npx tsc -p examples/lit/tsconfig.json --noEmit` as a _baseline before_ the pipeline, and got exactly those two `TS2322: Type 'number' is not assignable to type 'Timeout'` lines and nothing else. Stage 3's consolidated `tsc` gate was never reached, so this never had to be worked around. Useful datum: the baseline is dirty, so the skill's "**Type-check is clean** (`tsc` exit 0)" hard gate in step 11 is **unsatisfiable as literally written** in this repo — any run that reaches Stage 3 must deviate from the skill to proceed. |
| `yarn <script>` dies without `FONT_AWESOME_AUTH_TOKEN`                                                                                              | **Confirmed unset** (`.yarnrc.yml:21` references `${FONT_AWESOME_AUTH_TOKEN}`). Would have bitten Stage 4's `yarn start`. Never reached, so no workaround was applied.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ~24 sibling folders in `examples/lit/src/_runs/` share one Storybook index; duplicate story id kills the server; stale siblings can inject `TS2717` | **No `TS2717` present** in the baseline typecheck — the sibling tree is currently clean. **A duplicate story title DOES already exist for this case**: `Runs/B Kampus Notes Panel/Chapter page`. This would have been a live collision risk in Stage 3/4; I had a namespace planned (see §3.3) but never needed it.                                                                                                                                                                                                                                                                     |

## 8) What surprised me about the skill

**a) The skill offers a Stage 0 option it already knows breaks Stage 1, and then treats the breakage as a human-action halt.** SKILL.md's own Stage 0 text says of the remote server: _"`figma` (remote; headless, but `get_code_connect_map` is unreliable)"_. The run was configured with exactly that server, `get_code_connect_map` was exactly that unreliable (`{}`), and the pipeline then reported the failure as _"the design has unconnected component instances that need Code Connect mappings published in Figma"_ — a confident diagnosis of a **designer-side data problem** when the documented likelier cause is the **transport the skill itself let the user pick**. The two cases are indistinguishable from `{}`, and the skill never considers the second. Step 4 re-spawns up to 2× for `BLOCKED_ON_MCP` but step 5 has **no retry and no server-fallback** for `BLOCKED_ON_CODE_CONNECT`, even though it is the failure mode the skill explicitly predicted. A single "empty map on the remote server → retry once on `figma-desktop` before declaring a block" rule would have changed this run's outcome, or at minimum made the halt message honest.

**b) An all-or-nothing map makes the analyst's three identification heuristics dead code.** The analyst has a genuinely good step 3 — name-is-`sl-*`, child-carries-a-snippet, peer-instance-has-a-snippet — specifically so a `null` entry doesn't over-block. But every one of those needs map _entries_ to inspect. `{}` isn't a map with nulls, it's no map, so all three silently no-op and the heuristics that exist to prevent over-blocking contribute nothing in the one case where over-blocking is most likely to be wrong. The agent can't distinguish "18 unconnected components" from "the map call returned nothing".

**c) The block is declared before the cheapest, most reusable artifact is fetched.** `get_screenshot` is the ground truth the whole pipeline diffs against, and `get_variable_defs` is the Token Reference. Both are independent of Code Connect. The analyst's step 4 explicitly says _"Do not call `get_design_context` or `get_screenshot`"_, so a blocked run leaves 3 B of `{}` and an unparseable metadata dump — and a re-run after the human publishes mappings must re-fetch everything from scratch. The skill elsewhere cares a lot about caching artifacts "for reproducibility"; here it discards that for no stated benefit. The screenshot is also the artifact a human would most want _while_ deciding whether the block is even real.

**d) The halt list is instance-level, not component-level.** 18 rows, of which 8 are the same `subchapter-card` and 2 are the same `Student view`. The actionable work is ~10 Code Connect mappings, but the report hands the user 18 node IDs with no grouping. For a larger frame this scales badly.

**e) `figma-metadata.json` is not JSON.** The analyst is told to "write the raw response" to a `.json` path, and the raw response is XML-ish markup. The file is therefore mis-extensioned and would break any downstream consumer that `JSON.parse`s it. Harmless here, but it's a schema/plumbing flaw baked into the agent's instructions rather than an agent mistake.

**f) The two-level naming is incoherent.** Run folders are numbered off the Figma _file_ (`new-content-view-4`) while output goes to a _case_-named folder (`control-b-kampus-notes-r2`). Nothing links them, and nothing in the run folder's name identifies which case it holds. Four runs of four different frames in one Figma file produce `new-content-view-{1..4}` with no way to tell them apart without opening them.

**g) The Stage 3 `tsc` gate is unsatisfiable in this repo** (see environment table) — "exit 0" can never happen while `grid.ts` has its two pre-existing errors. The skill gives the coordinator no notion of a baseline to diff against, so a faithful execution would deadlock at step 11. Not triggered this run, but it is a latent hard stop.

**h) On the positive side, the halt itself was fast, clean and faithful.** ~50 s to a correct, well-formed refusal; the agent persisted both artifacts it had before stopping, obeyed its "output exactly one of three things" contract, and did not try to improvise past the block. The coordinator-level instruction (halt, don't fix) was unambiguous. Whatever is wrong here is in _what the pipeline decides to do with an empty map_, not in its discipline about doing it.
