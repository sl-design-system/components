# Control run — B-Itsl-Bookmk course files (pass 2, R2)

**Skill**: `implement-design:implement-design`
**Figma**: https://www.figma.com/design/ya00uFyX1rjxYWF0dlOsoT/Bookmarks?node-id=4886-12955
**Stage 0 answers supplied up front**: server `figma` (remote) · framework `lit` · i18n `no` · output `examples/lit/src/_runs/control-b-itsl-bookmk-course-r2/`
**Run folder**: `.implement-design/bookmarks-4/`

---

## 1. Stage reached + exact halt token/reason

**Halted at Stage 1 (design ingestion).** Halt token: **`BLOCKED_ON_CODE_CONNECT`**, returned by `design-analyst`.

Reason as reported by the analyst: `get_code_connect_map` was called on the top-level node `4886:12955` and re-verified on two component-instance children (`4886:12963` Banner, `4886:12956` Navigation). All three calls returned a completely empty map (`{}`) — not even null-keyed entries. No instance in the subtree is named `sl-*`, none resolves to a Code Connect snippet, and there is no connected peer instance to borrow a mapping from. The analyst concluded zero Code Connect coverage for the whole subtree.

SKILL.md step 5 makes this an unconditional halt: "the design has unconnected component instances that need Code Connect mappings published in Figma — a human action the pipeline can't do. **Halt** and report the blocked-node list." The retry affordance in step 4 (re-spawn up to 2 more times) is scoped to `BLOCKED_ON_MCP` only, so I did **not** re-spawn.

### Blocked-node list (as returned)

Grouped by distinct component, representative node id first:

- `4886:12956` — Navigation (top menu + secondary menu bar)
- `I4886:12956;4461:5603;9976:10622` — itslearning-logo-symbol (icon)
- `I4886:12956;4461:5603;9976:10624` — .Navigation item ("Courses"; repeats as `…13432:5117` Updates, `…15220:17430` Groups [hidden], `…9976:10626` Calendar, `…9976:10627` Library, `I4886:12956;4461:5609` Your files, `I4886:12956;4461:5610` Save course materials/active)
- `I4886:12956;4461:5603;11704:5609` — Search (nav search input; nested `…13157:8022` search button/icon)
- `I4886:12956;4461:5603;9976:10631` — .Navigation item wrapping bell/notification icon
- `I4886:12956;4461:5603;9976:10635` — IM (.Navigation item wrapping comment icon)
- `I4886:12956;4461:5603;9976:10636` — User menu (Avatar)
- `I4886:12956;4461:5606` — your-files (icon)
- `4886:12960` — PageHeader
- `I4886:12960;20314:6654` — Status Tag (hidden)
- `I4886:12960;5823:6544` — Button (hidden, "More buttons")
- `4886:12963` — Banner
- `I4886:12963;23112:4891` — circle-info (icon)
- `I4886:12963;17344:7058` — Button (dismiss; nested `…1902:2850` xmark icon)
- `4886:12964` — Search (hidden, unused table-filter state)
- `4886:12966` — courses (table header row)
- `I4886:12966;4008:8764` — Cell (plain text header)
- `I4886:12966;4008:8766` — Cell (sortable header; nested `…18129:7840` Button + arrow-up-arrow-down icon; repeats at `I4886:12966;4008:8767`)
- `4886:12968` / `4886:12969` / `4886:12971` / `4886:12972` (hidden) / `4886:12973` — courses (table body rows, 5 instances, identical internal structure)
- `I4886:12968;4008:8789` — Cell (course-name cell: Course-hat avatar + graduation-cap icon + link text; repeats under each row id)
- `I4886:12968;4008:8790` — Cell (status cell with Status component + circle-pen icon; repeats under each row id)
- `I4886:12968;4008:8791` — Cell (teacher text; repeats under each row id)
- `I4886:12968;4008:8792` — Cell (date text; repeats under each row id)

---

## 2. Did Stage 0 ask anything extra?

**No.** The four supplied answers (MCP server, framework, i18n, output location) are exactly the four questions Stage 0 defines. No `AskUserQuestion` was needed and nothing further was requested by the skill or by `design-analyst`. The run was fully unassisted from the argument block onward.

---

## 3. Everything I decided that the four answers did not cover

1. **Run-folder slug and suffix** — `<file-slug>` kebab-cased from the Figma file name `Bookmarks` → `bookmarks`; `.implement-design/bookmarks-1`, `-2`, `-3` already existed (other Bookmarks cases), so the smallest free integer gave **`.implement-design/bookmarks-4/`**. Note this numbering is per-Figma-file and global, so the folder name does not identify _this_ case or its output location.
2. **`.gitignore`** — the skill says to add `.implement-design/` if missing. It was already there (line 21). No file modified.
3. **Pre-creating `testing/`** — created `.implement-design/bookmarks-4/testing/` at the start; the skill describes it but assigns its creation to visual-validator. Harmless; it is still empty.
4. **No retry of the analyst** — read step 4 as MCP-only. Did not re-spawn on `BLOCKED_ON_CODE_CONNECT`.
5. **No server fallback** — the analyst's empty map is exactly the failure mode Stage 0 warns about for the remote server ("`get_code_connect_map` is unreliable"). I did **not** retry on `figma-desktop`: the four answers pin the server, and the skill defines no fallback for this token. (Flagged as a finding below rather than worked around.)
6. **Ran step 19's cleanliness check anyway** — the skill scopes it to the final report of a completed run; on an exceptional halt nothing requires it. I ran `git status` regardless.
7. **Read `component-conventions.md` up front** as the coordinator preamble instructs, even though no code stage was reached.

---

## 4. Wall clock

|           |                              |
| --------- | ---------------------------- |
| Start     | Sun Oct 4 23:00:29 CEST 2026 |
| End       | Sun Oct 4 23:05:56 CEST 2026 |
| **Total** | **5 min 27 s**               |

Of which `design-analyst` was ~4 min 58 s (19 tool calls, ~87.5k subagent tokens). No polling, no sleep loops — a single Agent spawn and the harness completion notification.

---

## 5. Artifacts

Everything created by this run, all inside the run folder:

```
.implement-design/bookmarks-4/
├── figma-metadata.json          1,706 B
├── figma-code-connect-map.json      3 B   ("{}" — the empty map that caused the halt)
├── figma-design-context.md     50,973 B   (raw React/Tailwind reference + component descriptions)
└── testing/                     (empty)
```

**Not created** (the blocking protocol short-circuits before them): `screenshot.png`, `figma-variable-defs.json`, `manifest.md`.

**Output location `examples/lit/src/_runs/control-b-itsl-bookmk-course-r2/` was never created** — no component code, no stories, no tests.

`git status` at the end is identical to the start: only the four pre-existing untracked entries (`agents/`, `agents.zip`, `analiza-agent-plugin.md`, `analiza-projektu.md`). **Zero stray artifacts from this run** — `.implement-design/` is gitignored, so the run folder does not even appear. Nothing committed, nothing staged, nothing modified or deleted outside the run folder.

---

## 6. Components / verdicts / tests / decomposer questions / [MINOR]

All **empty — none of these stages ran**:

| Item                                        | Result                                        |
| ------------------------------------------- | --------------------------------------------- |
| Components created                          | none (Stage 3 not reached)                    |
| Validator verdicts                          | none (Stage 4 not reached)                    |
| Test results                                | none (Stage 5 not reached)                    |
| Decomposer open questions + chosen defaults | none (Stage 2 not reached)                    |
| `[MINOR]` punch list                        | none (Stage 6 not reached)                    |
| Unresolved handoff notes                    | the `BLOCKED_ON_CODE_CONNECT` node list above |

Agents spawned: **1 of 6** (`design-analyst`). `component-decomposer`, `component-implementer`, `visual-validator`, `component-author`, `component-reviewer` were never invoked.

---

## 7. Environment notes (separate from skill findings)

None of the three known hazards were hit, because the run halted before any of them is reachable:

- **`tsc` pre-existing errors in `packages/components/grid/src/grid.ts` (1180, 1361)** — not encountered. The consolidated type-check gate is Stage 3 step 11; never reached. No resolution needed.
- **`yarn <script>` dies without `FONT_AWESOME_AUTH_TOKEN`** — not encountered. I confirmed out of band that the variable is **unset** in this shell, so Stage 4's `yarn start` would have failed, but Stage 4 was never reached. No workaround applied.
- **Shared Storybook index across the ~24 `examples/lit/src/_runs/` siblings (duplicate story id kills the server; stale siblings inject `TS2717`)** — not encountered. No story was generated and Storybook was never started. I listed the sibling folders read-only and confirmed `control-b-itsl-bookmk-course-r2` did not pre-exist.

No scratch or measurement scripts were written anywhere; the only writes outside the run folder were zero.

---

## 8. What surprised me about the skill

1. **The halt discards work the analyst already had in hand.** `figma-design-context.md` is 51 KB of full React/Tailwind reference code plus component descriptions for the entire subtree — arguably enough to implement from. The protocol nevertheless stops cold, and stops _before_ `get_screenshot` and `get_variable_defs`, so the two artifacts most useful on a re-run (the ground-truth PNG and the token list) are the ones missing. A human who publishes the mappings and re-runs pays the full Figma-fetch cost again, including the 51 KB call that already succeeded.

2. **Stage 0 predicts this failure and the halt path ignores the prediction.** Stage 0's own text says the remote `figma` server's `get_code_connect_map` is "unreliable" and recommends `figma-desktop`. When exactly that unreliability shows up, step 5 attributes the empty map to a missing _human_ action (publish mappings in Figma) with no way to distinguish "genuinely unconnected" from "remote server returned `{}`". Step 4 gives `BLOCKED_ON_MCP` up to two retries; `BLOCKED_ON_CODE_CONNECT` gets none, and no "retry on the other server" branch exists — even though the skill itself names the other server as the more reliable one for this specific call. A coordinator following the skill literally cannot tell which of the two causes it is looking at.

3. **An all-or-nothing gate on a design with zero coverage.** The gate is designed for _some_ unconnected instances in an otherwise-mapped design. Here coverage is zero across ~25 distinct components, which reads less like "a few nodes need publishing" and more like "this Figma file was never Code-Connected at all" — a different situation the skill has no separate response for.

4. **Step 19 (clean-tree verification) is only defined for the success path.** On an exceptional halt the skill jumps straight to "report"; nothing instructs the coordinator to check for stray artifacts. Harmless here because nothing was generated, but a halt at Stage 3 or 4 would skip the check at exactly the point it starts mattering.

5. **Run-folder naming is per Figma file, not per run case.** `bookmarks-4` conveys nothing about which Bookmarks screen or which output location it belongs to; the folder gives no way to correlate artifacts back to a case without opening them.
