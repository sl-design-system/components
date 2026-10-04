# Control run — A4 Sesame My Groups (pass 2, R2)

**Pipeline**: `implement-design:implement-design`
**Figma**: https://www.figma.com/design/UBr399hnydpNF9P5Jb2vfx/MySesame-Redesign?node-id=2847-14994
**Run folder**: `/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/mysesame-redesign-6/`
**Start**: Sun Oct 4 23:05:32 CEST 2026 — **End**: Sun Oct 4 23:14:09 CEST 2026 — **Wall clock: 8 min 37 s**

---

## 1) Stage reached + exact halt token/reason

**Halted in Stage 1 (Design ingestion), at SKILL.md step 5.**

Halt token returned by `design-analyst`: **`BLOCKED_ON_CODE_CONNECT`**

Reason, verbatim from the analyst: `get_code_connect_map` for node `2847:14994` ("My Groups") on the remote `figma` server returned a **literal empty object `{}`** — zero mappings for any descendant. The raw response is persisted at
`.implement-design/mysesame-redesign-6/figma-code-connect-map.json` (3 bytes: `{}`).

SKILL.md step 5 is unconditional for this token: _"the design has unconnected component instances that need Code Connect mappings published in Figma — a human action the pipeline can't do. **Halt** and report the blocked-node list so the user can publish mappings and re-run."_ Unlike `BLOCKED_ON_MCP` (step 4, which grants up to 2 re-spawns), there is **no retry allowance** for this token, so I did not re-spawn the analyst. Stages 2–6 never ran.

The analyst stopped before `get_design_context` and `get_screenshot`, so there is **no `screenshot.png`**, no `figma-design-context.md`, no `figma-variable-defs.json`, and no `manifest.md`.

### Blocked-node list (as reported)

Identifiable by `sl-*` node name and therefore treated as connected by the analyst's heuristic:

- `sl-button` → 2847:14998, 14999, 15000, 15389, 15390, 15391, 15754, 15755, 15756
- `sl-searchfield` → 2847:15397
- `sl-helper-theme` → 2847:15709

Genuinely unconnected (no `sl-*` name, no child snippet, no non-null peer to borrow from — the whole map is empty):

| Nodes                     | Name                                                      | Count |
| ------------------------- | --------------------------------------------------------- | ----- |
| 2847:15002                | Button (header toolbar)                                   | 1     |
| 2847:15075, 15076         | button / Button (school-selector trigger, hidden variant) | 2     |
| 2847:15060–15063          | menu item SU (top nav)                                    | 4     |
| 2847:15065                | avatar_SU                                                 | 1     |
| 2847:15381, 15746         | xmark (bulk-panel close)                                  | 2     |
| 2847:15392, 15757         | Cell (hidden, bulk panel)                                 | 2     |
| 2847:15090…15147 (step 3) | v-input--selection-controls (row checkbox)                | 20    |
| 2847:15152…15240          | td-text-start (data-table body cell)                      | 80    |
| 2847:15346                | th-text-start ("Close" variant)                           | 1     |
| 2847:15244                | table sorting icon (hidden)                               | 1     |
| 2847:15248…15356          | Icon-button (row action trigger)                          | 24    |
| 2847:15361                | check (hidden, dropdown panel)                            | 1     |
| 2847:15368                | Icon-left (hidden, dropdown delete action)                | 1     |
| 2847:15426                | Footer                                                    | 1     |

**~141 unconnected instances.** Note the shape of it: this is a Vuetify-flavoured table design (`v-input--selection-controls`, `td-text-start`, `th-text-start`), i.e. a _foreign_ component library, not SLDS. These will never have SLDS Code Connect mappings, so the "publish mappings in Figma and re-run" remedy the skill prescribes is not actually actionable for this design.

## 2) Did Stage 0 ask anything extra?

**No.** All four answers were supplied up front in the argument block and the skill consumed them without a single follow-up. The URL passed the `figma.com/design/...` validation at step 1. No `AskUserQuestion` was needed or issued. Stage 0 cost effectively zero wall clock.

## 3) Everything I decided that the four answers didn't cover

The halt came early, so the decision surface was small — but not empty:

1. **Run-folder slug and suffix.** The skill says kebab-case the _Figma file name_ (`MySesame-Redesign` → `mysesame-redesign`) and take the smallest free integer suffix. `-1` … `-5` already existed, so I created **`mysesame-redesign-6`**. Worth flagging: the run folder is keyed to the **file**, not the **node**, so an 11-case experiment on one Figma file produces indistinguishable `mysesame-redesign-N` folders. Nothing in the folder name says "A4 My Groups". The skill offers no hook to name a run after the case.
2. **`.gitignore`** — already contains `.implement-design` (line 21). No edit needed.
3. **Not re-spawning the analyst.** Judgement call on reading step 4 vs. step 5: retries are granted only for `BLOCKED_ON_MCP`. I treated `BLOCKED_ON_CODE_CONNECT` as a one-shot halt.
4. **Which agent gets which absolute path.** The skill's "Plugin paths" section tells you _that_ paths must be passed but leaves `<skill-dir>` discovery to the coordinator; I resolved it to `tools/implement-design-plugin/skills/implement-design/`.
5. **Prepared but never used**: a `FONT_AWESOME_AUTH_TOKEN=dummy` prefix for Stage 4's `yarn start`, and the decision to reuse the already-running Storybook on :6006 rather than start a second one.

## 4) Wall clock

**8 min 37 s** total (23:05:32 → 23:14:09).
Of that, the `design-analyst` subagent accounted for **3 min 42 s** (221,763 ms, 6 tool calls, ~68k subagent tokens). The remaining ~5 min was coordinator setup, reading the skill + conventions + agent definitions, and environment baselining (much of which overlapped the analyst).

## 5) Artifacts

Inside `.implement-design/mysesame-redesign-6/`:

| File                          | Size     | Note                       |
| ----------------------------- | -------- | -------------------------- |
| `figma-metadata.json`         | 44,380 B | full node tree, written    |
| `figma-code-connect-map.json` | 3 B      | the raw `{}`               |
| `testing/`                    | empty    | created by me at run start |

**Not produced** (analyst halted first): `screenshot.png`, `figma-design-context.md`, `figma-variable-defs.json`, `manifest.md`.

**No code was generated.** `examples/lit/src/_runs/control-a4-sesame-my-groups-r2/` was never created — the output location answer was never consumed by any stage.

**Working tree (step 19 check)**: `git status --porcelain` shows only the four pre-existing untracked entries (`agents.zip`, `agents/`, `analiza-agent-plugin.md`, `analiza-projektu.md`). No stray `*.png` at the repo root. This run created nothing outside its run folder.

## 6) Components / verdicts / tests / decomposer questions / [MINOR]

All **N/A — not reached**:

- Components created: **none**
- Validator verdicts: **none** (Stage 4 not reached)
- Test results: **none** (Stage 5 not reached)
- Decomposer open questions + defaults chosen: **none** (Stage 2 not reached)
- `[MINOR]` punch list: **empty** (Stage 6 not reached)

## 7) What surprised me about the skill

- **The halt is unconditional and un-negotiated, and the remedy it names doesn't fit the failure it caught.** Step 5 assumes "unconnected" means _an SLDS component whose mapping nobody published yet_ — fixable by a designer. What actually tripped it is a design drawn in a **different component library** (`v-input--selection-controls`, `td-text-start`, Vuetify naming). No amount of publishing SLDS Code Connect mappings makes those nodes map. The skill's advertised recovery ("publish mappings and re-run") is a dead end for this input, and the pipeline has no second door — no "proceed without Code Connect", no degraded mode.
- **An empty `{}` and a partially-populated map are collapsed into the same signal.** The skill's own Stage 0 copy warns that the remote `figma` server's `get_code_connect_map` is _"unreliable"_ — and then offers no branch for the case where it returns nothing at all. The analyst cannot distinguish "this design genuinely has no mappings" from "the remote server didn't return them", yet both produce the same terminal halt. A tool-reliability caveat in Stage 0 and a hard halt in Stage 1 with no bridge between them is a real gap.
- **The analyst stops before the screenshot.** Because it halts before `get_screenshot` / `get_design_context` / `get_variable_defs`, the run leaves behind no visual reference and no token list — so a human picking this up has nothing to look at and the next attempt re-pays the full Figma cost. Caching the screenshot _before_ the Code Connect gate would cost one call and make the halt far more useful.
- **The identification heuristic has a bootstrap problem the skill doesn't acknowledge.** The manifest schema tells the analyst to rescue `null`-mapped nodes by borrowing "a peer instance's snippet". When the map is `{}`, there are no peers to borrow from, so the heuristic degrades to bare node-name matching — which is why only 11 of ~150 instances survived, purely on the accident of being literally named `sl-button`.
- **Run folders are keyed to the Figma file, not the node.** Six runs of six different screens in one file all land in `mysesame-redesign-N`. For a measurement experiment that's actively hostile to traceability, and the skill gives no way to influence it.
- Positively: **Stage 0 fully honoured pre-supplied answers.** Zero prompts, zero drift, and the coordinator went straight to work — the "all input up front, then standalone" contract held exactly as written.

## Environment notes (separate from skill findings)

| Known issue                                                                                                         | How it resolved in this run                                                                                                                                                                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tsc` has 2 pre-existing errors in `packages/components/grid/src/grid.ts` (1180, 1361)                              | Baselined before Stage 1: `npx tsc -p examples/lit/tsconfig.json --noEmit` emits **exactly** those two and nothing else. No `TS2717` from stale siblings. Never needed — Stage 3's gate wasn't reached.                                                                                                                                                   |
| `yarn <script>` dies without `FONT_AWESOME_AUTH_TOKEN` (`.yarnrc.yml` interpolates it for the `@fortawesome` scope) | Confirmed: bare `yarn --version` fails, `FONT_AWESOME_AUTH_TOKEN=dummy yarn --version` → `4.17.0`. A dummy value suffices because `node_modules` is already installed. Prepared for Stage 4, **never used**.                                                                                                                                              |
| ~24 sibling folders in `examples/lit/src/_runs/` share one Storybook index; duplicate story id kills the server     | Surveyed titles up front. **`'Examples/My groups page'` is already taken** by the existing `a4-sesame-my-groups` folder — a live collision risk for this case had Stage 3 run. Not triggered; no code was generated. Also found Storybook **already serving on :6006** (PIDs 10762, 72585) from a concurrent run; I left it alone rather than restarting. |
| Concurrent-run interference                                                                                         | Observed a `verify-tmp.mjs` appear and disappear at the repo root within ~90 s — another run's scratch file, not mine. I did not touch it. All my own work stayed inside the run folder; I wrote no scratch scripts.                                                                                                                                      |
