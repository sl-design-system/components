# Control run — A3 Bingel Chapter / Digital Exercises (pass 2, R2)

- **Case**: A3 Bingel Chapter / Digital Exercises
- **Figma node**: `https://www.figma.com/design/1yroCKkROktqhRCP2wwlzB/MyPortal-Designs-2025?node-id=25124-56828`
- **Skill**: `implement-design:implement-design` (invoked via the Skill tool, argument block verbatim)
- **Start**: Sun Oct 4 23:00:03 CEST 2026
- **End**: Sun Oct 4 23:08:37 CEST 2026
- **Wall clock**: ~8 min 34 s
- **Run folder**: `/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/myportal-designs-2025-4/`
- **Output location (never written to)**: `examples/lit/src/_runs/control-a3-bingel-exercises-r2/`

---

## 1) Stage reached + exact halt token/reason

**Halted in Stage 1 (Design ingestion), at SKILL.md step 4.**

**Halt token: `BLOCKED_ON_MCP`** — returned by `implement-design:design-analyst` on **all three** permitted spawns (initial + the 2 re-spawns step 4 allows). Identical failure each time, always on the same call:

| Attempt | Duration | Returned                                                                                                                                                                                                                                                                                                                                  |
| ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1       | ~183 s   | `BLOCKED_ON_MCP` / `get_code_connect_map@figma — "the Code Connect lookup timed out, so this response may be missing Code Connect data" (returned on both the initial call and the one retry, both times as an empty {} map rather than resolved mappings)`                                                                               |
| 2       | ~183 s   | `BLOCKED_ON_MCP` / `get_code_connect_map@figma — "Note: the Code Connect lookup timed out, so this response may be missing Code Connect data."`                                                                                                                                                                                           |
| 3       | ~80 s    | `BLOCKED_ON_MCP` / `get_code_connect_map@figma` — same timeout note; `{}` on both the call and its retry. The analyst explicitly stated it treated this as a transient timeout rather than a legitimate "no mappings" result, so it did **not** proceed to `get_design_context` / `get_screenshot` and did **not** synthesize a manifest. |

Per step 4, after 3 failed analyst spawns the coordinator **halts and reports the server is unreachable**. Stages 2–6 never ran. No component was generated; nothing was written to the output location.

**Important nuance the skill's halt advice does not cover**: the remote `figma` MCP server is _not_ unreachable. `claude mcp list` run immediately after the halt reports `figma: https://mcp.figma.com/mcp (HTTP) - ✔ Connected`, and the analyst's own `get_metadata` call against that same server **succeeded** on attempt 1 (it wrote a real 46 KB `figma-metadata.json`). The failure is narrow and server-side: the Code Connect _lookup_ inside `get_code_connect_map` times out and the server degrades to returning `{}` plus an advisory note, with a 200-style success envelope. So the skill's prescribed remedy ("the server is unreachable … suggest `claude mcp list` / re-auth / open the desktop app") points the user at the wrong thing.

Note the Stage 0 answer `figma (remote)` is exactly the configuration the skill itself warns about: _"`figma` (remote; headless, but `get_code_connect_map` is unreliable)"_. The run died on precisely that documented unreliability — and the pipeline has **no fallback path** for it. `figma-desktop` is also `✔ Connected` on this machine, but nothing in the skill lets the coordinator switch servers after a `BLOCKED_ON_MCP`; step 4 only allows re-spawning on the same server, then halting. The analyst agent reinforces this: _"Do not try the other server for these — server selection is the orchestrator's job, not yours"_ — but the orchestrator's instructions give it no switch either.

## 2) Did Stage 0 ask anything extra?

**No.** The four supplied answers (MCP server, framework, i18n, output location) covered Stage 0 completely. No `AskUserQuestion` was needed, no clarification was requested, and no agent asked a follow-up question before the halt. URL validation (`figma.com/design/...`) passed without comment.

## 3) Everything I decided that the four answers didn't cover

1. **Run-folder slug and suffix.** The skill says kebab-case the _Figma file name_, which is `MyPortal-Designs-2025` → `myportal-designs-2025`. `-1`, `-2`, `-3` already existed, so I created `-4`. Worth flagging: the slug is derived from the **file**, not the **node**, so every run against any node in this multi-screen file collides into the same slug series. The run folder name carries no hint of which design it is, and the case label from the task (`control-a3-bingel-exercises-r2`) appears nowhere in the artifact tree.
2. **`.gitignore`.** Already covers `.implement-design` (line 21) — nothing to add.
3. **`testing/` subfolder.** Created up front with the run folder, since the skill lists it as part of the run layout but only the visual-validator is told to `mkdir` it.
4. **Which tsconfig the Stage 3 gate would use.** Step 11 says `npx tsc -p <package>/tsconfig.json --noEmit`, but the chosen output location is a path _inside_ an existing package, not a package. I resolved it to `examples/lit/tsconfig.json` and took a baseline before Stage 3 so I could separate new errors from pre-existing ones. (Never needed — the run halted first.)
5. **Interpretation of the three-spawn budget.** Step 4 reads "re-spawn the analyst up to 2 more times", which I read as 3 total attempts (1 initial + 2 re-spawns), not 4.
6. **Diagnostics after the halt.** I ran `claude mcp list` — the skill names it in the halt-report text — purely to characterise the failure. I did **not** retry with `figma-desktop`, did not hand the analyst a hint, and did not perform any analyst work myself.

## 4) Wall clock

**~8 min 34 s** (23:00:03 → 23:08:37 CEST). Breakdown: ~1 min coordinator setup/reading; ~7.5 min across the three analyst spawns (183 s + 183 s + 80 s). Roughly **90 % of the run was spent re-attempting the same deterministic failure.**

## 5) Artifacts

In `/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/myportal-designs-2025-4/`:

| File                          | Size  | State                                                                                        |
| ----------------------------- | ----- | -------------------------------------------------------------------------------------------- |
| `figma-code-connect-map.json` | 141 B | `{}` + the timeout advisory note appended as loose prose after the JSON — **not valid JSON** |
| `figma-metadata.json`         | 12 B  | the literal string `PLACEHOLDER`                                                             |
| `testing/`                    | —     | empty                                                                                        |

Not produced: `screenshot.png`, `figma-design-context.md`, `figma-variable-defs.json`, `manifest.md`. No component files, no stories. Storybook was never started (Stage 4 not reached).

**Artifact-corruption finding (noteworthy).** Attempt 1 wrote a genuine **46 876-byte** `figma-metadata.json` from a successful `get_metadata` call. Attempt 3 overwrote that same path with the 12-byte string `PLACEHOLDER`. Because every re-spawn is pointed at the same run folder and the analyst writes each call's output unconditionally, **a later failing attempt destroyed the only good artifact an earlier attempt had produced**. The whole stated point of the run folder is reproducibility ("so the run is fully reproducible and later stages can re-read the source data without re-calling Figma"), and the retry loop defeats it. A re-spawn should either write to a per-attempt subfolder or refuse to overwrite a larger/valid existing artifact.

Secondary: `figma-code-connect-map.json` is named `.json` but contains JSON followed by an English sentence. Anything that `JSON.parse`s it will throw. The analyst is told to persist the response "verbatim", and the response _is_ text+JSON — the schema and the filename disagree.

## 6) Components / verdicts / tests / decomposer questions / [MINOR] list

All **N/A — the run halted before Stage 2**.

- Components created: **none**
- Validator verdicts: **none** (Stage 4 not reached)
- Tests: **none** (Stage 5 not reached; for an `examples/` target the skill would have skipped Vitest anyway)
- Decomposer open questions + chosen defaults: **none** (component-decomposer never spawned)
- `[MINOR]` punch list: **none** (component-reviewer never spawned)

Agents actually spawned: `implement-design:design-analyst` ×3. Agents never spawned: decomposer, implementer, visual-validator, author, reviewer.

## 7) Environment notes (separate from skill findings)

The three pre-briefed environment hazards, and how each was handled:

1. **`tsc` has 2 pre-existing errors in `packages/components/grid/src/grid.ts` (1180, 1361).** Confirmed. I ran `npx tsc -p examples/lit/tsconfig.json --noEmit` as a _baseline before_ Stage 3 so the step-11 gate could distinguish new errors from these. Output was exactly those two `TS2322: Type 'number' is not assignable to type 'Timeout'` lines, **exit code 0**. Resolution: recorded as baseline; never needed, since Stage 3 never ran. (Side note: the command exits 0 despite printing errors, so a naive `tsc exit 0` gate as step 11 literally specifies would pass regardless — the orchestrator must diff the error list, not trust the exit code.)
2. **`yarn <script>` dies without `FONT_AWESOME_AUTH_TOKEN`.** Confirmed as a latent hazard: `.yarnrc.yml:21` sets `npmAuthToken: '${FONT_AWESOME_AUTH_TOKEN}'` for the `npm.fontawesome.com` registry, and the variable is unset in this shell. **Never hit** — `yarn start` belongs to Stage 4, which the run never reached. `node_modules/.bin/storybook` is already installed, so the planned resolution (run Storybook via the local bin, or pass a dummy token for the script) was never exercised.
3. **~24 sibling folders in `examples/lit/src/_runs/` share one Storybook index; a duplicate story id kills the server; stale siblings can inject `TS2717`.** Confirmed the shared index: `.storybook/main.ts` globs `'../examples/**/*.stories.ts'`. I pre-checked the existing titles and found a **live collision risk**: `examples/lit/src/_runs/a3-myportal-digital-exercises/` already registers `title: 'Runs/A3 MyPortal Digital Exercises/Digital exercises page'` — the same design this run targets, so an implementer picking the obvious title would have produced a duplicate story id and taken down the whole Storybook. My plan was to detect it after Stage 3 (implementers report their story ids) and rename the new one, logging it as an environment fix rather than a skill finding. **Never needed.** No `TS2717` appeared in the baseline type-check, so the stale-sibling hazard was not active today.

Nothing was deleted or modified outside the run folder. No scratch scripts were written anywhere. `git status` at the end shows only the four pre-existing untracked entries (`agents.zip`, `agents/`, `analiza-agent-plugin.md`, `analiza-projektu.md`) — this run added nothing to the working tree, and no stray `*.png` at the repo root. No `git add`, no commit, no PR.

## 8) What surprised me about the skill

1. **A degraded-but-successful MCP response is classified as a transport failure.** `get_code_connect_map` didn't error — it _answered_, with `{}` plus a prose note saying the lookup timed out. The analyst's retry policy lists transport signatures (`MCP error -32000`, "connection lost", `ECONNRESET`, 502/503/504…) and this matched none of them structurally, yet the analyst correctly read the advisory text as transient and refused to treat `{}` as "no mappings" — which the policy explicitly demands (_"don't read 'connection lost' as 'no Code Connect mappings'"_). The analyst's judgement was right; the taxonomy it had to express it in was wrong. The result is a halt whose user-facing message ("server unreachable, try `claude mcp list`") contradicts the observable state (`figma: ✔ Connected`, and `get_metadata` worked against that same server seconds earlier).
2. **Retrying an unretryable condition, at full cost, three times.** The failure was deterministic across ~7.5 minutes. Step 4's remedy ("re-spawn up to 2 more times (brief waits)") is built for a flaky connection, not for a server-side feature that is consistently timing out. Each re-spawn is a cold agent that re-does `get_metadata` from scratch before reaching the failing call — so the retries also burn ~58k, ~59k and ~41k subagent tokens re-fetching data attempt 1 had already persisted to disk. The analyst is told the run folder exists "so later stages can re-read the source data without re-calling Figma", but a _re-spawn of the same stage_ is not treated as a later stage and never reads it.
3. **No server fallback, by explicit design on both sides.** The skill warns in Stage 0 that remote `figma` makes `get_code_connect_map` unreliable, then provides no recovery when that exact prediction comes true. The analyst is forbidden from switching ("server selection is the orchestrator's job"), and the orchestrator is given no switch instruction. `figma-desktop` was connected and available the entire time. A single documented "on `BLOCKED_ON_MCP` from `get_code_connect_map` on the remote server, retry once on `figma-desktop`" would very likely have carried this run to Stage 2.
4. **Re-spawning into a shared run folder is destructive.** Covered in §5 — attempt 3's `PLACEHOLDER` clobbered attempt 1's real 46 KB metadata. The retry mechanism in step 4 and the persist-everything mandate in the analyst actively work against each other, and nothing in either document notices.
5. **The analyst wrote a `PLACEHOLDER` file at all.** Attempt 3 fabricated a stand-in artifact for a call it had _already successfully made_ on a previous spawn (but which, from its own fresh context, it apparently chose not to re-issue or chose to stub). Writing a placeholder is not in its instructions — the instruction is to write the raw response verbatim after each successful call. A halting agent leaving behind a file that _looks_ like a real artifact but says `PLACEHOLDER` is a quiet trap for anyone (or any later stage) that trusts the run folder.
6. **The run-folder slug ignores the node.** Four sibling folders now exist for `myportal-designs-2025`, distinguished only by an integer. For a multi-screen file like this one — and this whole experiment runs several cases out of it — nothing in the artifact tree says which screen a folder holds.
7. **Step 11's gate is written against the wrong unit for an `examples/` target.** It says `npx tsc -p <package>/tsconfig.json --noEmit` where `<package>` is the generated component's path. For `packages/components/*` that is coherent; for `examples/lit/src/_runs/<run>/` there is no tsconfig at that path and the coordinator has to infer the enclosing package's. Combined with `tsc` exiting 0 while printing pre-existing errors, the stated gate ("`tsc` exit 0") would not actually gate anything here.
8. **The halt is clean and correct.** Credit where due: the skill's blocker handling did the right thing. It did not fabricate a manifest from the empty Code Connect map, did not silently proceed with no components, did not write partial garbage into the output location, and left the working tree untouched. Compared with a pipeline that would have invented components off a `{}` map, halting at step 4 is the better failure.
