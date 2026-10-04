# Control run — A10 ETSL FAM - Users (pass 2)

Figma: `https://www.figma.com/design/S5QgDy8X9eqhvECPANSZMM/Editorial-Suite-designs?node-id=17264-29098`
Skill: `implement-design:implement-design` (invoked via the Skill tool, argument block verbatim)
Start: `Sun Oct  4 20:17:04 CEST 2026` · End: `Sun Oct  4 20:28:07 CEST 2026`

---

## 1. Stage reached

**Stage 1 — Design ingestion. Halted there.**

The `implement-design:design-analyst` subagent returned the halt token:

> `BLOCKED_ON_CODE_CONNECT`

Reason, quoted from the analyst:

> "The Code Connect map returned empty (`{}`) for the target node and, on direct verification, for every individual descendant instance queried as well (`top nav bar`, `tabbar-horizontal`, `th-text-start`, `td-text-start`, `mat-data-footer` all returned `{}` when queried directly — not a recursion artifact). Only instances whose Figma layer name already carries the `sl-*` prefix could be identified by name heuristic; no sibling or child snippet data exists anywhere in this subtree to identify the rest."

Per the skill's Stage 1, step 5 — _"the design has unconnected component instances that need Code Connect mappings published in Figma — a human action the pipeline can't do. **Halt** and report the blocked-node list"_ — I halted. No retry is specified for this token (retries exist only for `BLOCKED_ON_MCP`), so none was attempted.

### Blocked-node list as returned

**`top nav bar`** (composite: logo + nav items + `sl-avatar`; wrapper has no CC entry, not a pass-through)

- `17264:29099`

**`tabbar-horizontal`** (composite containing repeated `tab horizontal-theme` sub-instances; no CC entry on wrapper or children)

- `17264:29105`

**`th-text-start`** — table header cell, 8 visible instances

- `17264:29115`, `17264:29122`, `17264:29129`, `17264:29136`, `17264:29141`, `17264:29146`, `17264:29151`, `17264:29156`

**`td-text-start`** — table data cell, 24 visible instances

- col 1: `17264:29116`, `17264:29117`, `17264:29118`
- col 2: `17264:29123`, `17264:29124`, `17264:29125`
- col 3: `17264:29130`, `17264:29131`, `17264:29132`
- col 4: `17264:29137`, `17264:29138`, `17264:29139`
- col 5: `17264:29142`, `17264:29143`, `17264:29144`
- col 6: `17264:29147`, `17264:29148`, `17264:29149`
- col 7: `17264:29152`, `17264:29153`, `17264:29154`
- col 8: `17264:29157`, `17264:29158`, `17264:29159`

**`mat-data-footer`** (pagination footer containing `mat-select__slot` + two `mat-btn`)

- `17264:29167`

**Identified by `sl-*` name heuristic, NOT blocking**: `17266:31414` (sl-searchfield), `17557:100187` (sl-select (simple-prototype)), `17266:31419` (sl-button-rectangular), nested `sl-avatar` inside `top nav bar`.

Total blocked: **35 node instances**, of which **32 are `th-text-start` / `td-text-start` table cells**.

---

## 2. Did Stage 0 ask anything beyond the four answers?

**No.** The four supplied answers (server, framework, i18n, output location) were accepted as-is. No `AskUserQuestion` was issued, and the skill asked nothing further before Stage 1. It also did not re-validate or object to the output location being deeper than either of the two shapes its own question describes (see gap 5).

---

## 3. Everything I had to decide that the four answers did not cover

Listed exhaustively, including small ones. Several are moot because the run halted at Stage 1 — flagged as such, but they are still gaps in the skill.

1. **Run-folder slug conflicts with the repo's actual convention.** The skill says: kebab-case the Figma _file name_ from the URL, then the smallest free `-N`. That yields `editorial-suite-designs-2`. But every one of the 34 existing folders in `.implement-design/` is named by _case_ (`a10-etsl-fam-users`, `b-nsp-home`, …), and the output location I was handed is `control-a10-etsl-fam-users-r2`. The rule as written and the convention on disk disagree, and nothing says which wins. I followed the skill literally, so **the run folder (`editorial-suite-designs-2`) does not correspond by name to the output location (`control-a10-etsl-fam-users-r2`)**. Anyone reconciling artifacts to outputs later has no link between them.

2. **No retry / fallback policy for `BLOCKED_ON_CODE_CONNECT`.** Mine to decide whether to re-spawn, or to retry on the other MCP server. The skill gives an explicit retry budget for `BLOCKED_ON_MCP` ("up to 2 more times") and _nothing_ for `BLOCKED_ON_CODE_CONNECT`. I chose not to retry and not to switch servers. See §7 — this interacts badly with the Stage 0 question text.

3. **How to express "figma (remote)" to the analyst.** The answer is a server _label_; the analyst has both `mcp__figma__*` and `mcp__figma-desktop__*` toolsets. The skill never states the mapping, so I wrote "use the `mcp__figma__*` tools" into the spawn prompt myself. A coordinator that just forwarded the string "figma (remote)" might get either toolset.

4. **`<skill-dir>` / `<skills>` absolute paths.** The skill defines these as "the absolute path of the folder containing this SKILL.md" but never states it. I inferred it from the harness's "Base directory" line. If that line were absent the agents could not have been given their paths.

5. **The output location is a third shape the skill doesn't model.** Stage 0's own question offers two: flat `packages/components/` or "an app/example path like `examples/`". The supplied path, `examples/lit/src/_runs/control-a10-etsl-fam-users-r2/`, is a _fourth-level_ folder inside an existing package's `src/`. How the root component folder nests relative to it — inside it, or _is_ it — would have been mine to decide. _(Moot — halted before Stage 3.)_

6. **Whether the generated example gets re-exported from `examples/lit/src/index.ts`.** `component-conventions.md` says an example reuses "the example package's existing `index.ts`/`tsconfig.json`", but the actual `index.ts` re-exports only the four hand-written examples and nothing under `_runs/`. Add or not? Undecided. _(Moot.)_

7. **Whether `.gitignore` line 21 `.implement-design` (no trailing slash) satisfies the skill's "make sure `.implement-design/` is ignored".** I accepted it and added nothing.

8. **What to do with a half-written run folder on a Stage 1 halt.** The skill's run-folder contract lists five artifacts; the halt left two. Nothing says whether to clean up, to write a stub `manifest.md` recording the halt, or to leave it. I left it exactly as the analyst wrote it and added no files of my own.

9. **Whether the "identified, not blocking" nodes change the halt decision.** The analyst resolved four nodes by name heuristic and explicitly called them non-blocking. The skill's halt is unconditional on the token, so I halted despite partial resolution being available. Judgement call with no guidance.

10. **Whether `get_screenshot` should still have been taken before halting.** This one the analyst decided, not me — but I had to decide whether to force it myself afterwards. I did not (that would be performing a stage the skill assigns to an agent). Result: the run has no reference screenshot at all.

---

## 4. Wall clock

- **Pipeline wall clock: ~3 minutes.** Start 20:17:04; the analyst was spawned at ~20:17:20 and ran **163.4 s** (16 tool calls, ~45.6k subagent tokens), returning ~20:20:05.
- **Session wall clock: 11 min 03 s** (20:17:04 → 20:28:07).
- _Environment note, not a skill finding:_ the 8-minute gap is entirely my own coordinator-side blocking poll waiting on the analyst's artifact files — files that never appeared, because the analyst halted before writing them. It is not time the pipeline spent working.

---

## 5. Artifacts

Run folder used: **`.implement-design/editorial-suite-designs-2/`** (newly created this run; `editorial-suite-designs-1` already existed, so `-2` was the smallest free suffix).

Landed in it:

| File                          | Size                 | Status                          |
| ----------------------------- | -------------------- | ------------------------------- |
| `figma-metadata.json`         | 7583 B               | written                         |
| `figma-code-connect-map.json` | 3 B — literally `{}` | written                         |
| `figma-design-context.md`     | —                    | **not written**                 |
| `figma-variable-defs.json`    | —                    | **not written**                 |
| `screenshot.png`              | —                    | **not written**                 |
| `manifest.md`                 | —                    | not written (Stage 2 never ran) |
| `testing/`                    | —                    | not created (Stage 4 never ran) |

So **3 of the 5 raw-artifact files the skill's run-folder contract promises are absent**, including the one the skill calls ground truth.

`git status` is clean of anything this run produced. The only untracked entries (`agents.zip`, `agents/`, `analiza-agent-plugin.md`, `analiza-projektu.md`) pre-date the run; `.implement-design/` is gitignored.

---

## 6. Components created, verdicts, tests, open questions, punch list

**None of it.** The pipeline halted at Stage 1, so:

- **Components created**: none. `examples/lit/src/_runs/control-a10-etsl-fam-users-r2/` was never created.
- **Decomposer**: never spawned — no component tree, no open questions, no defaults chosen.
- **Implementers**: never spawned. No type-check gate run.
- **Visual-validator**: never spawned — no `MATCH` / `NEEDS_WORK` verdicts, no captures, no Storybook started (so **no port conflict to report**; the Stage 4 dev server was never reached).
- **Component-author**: never spawned — no tests, no stories, no docs.
- **Component-reviewer**: never spawned — no `[CRITICAL]` items, **empty `[MINOR]` punch list**.

Of the six pipeline agents, **exactly one ran**: `implement-design:design-analyst`.

---

## 7. What surprised me

**a. Stage 0 offers an answer that is a near-guaranteed halt, and Stage 1 has no fallback for it.** Stage 0's own question text says the remote `figma` server is the one where "`get_code_connect_map` is unreliable", and recommends `figma-desktop` instead. Stage 1 then treats an empty Code Connect map as an unconditional, un-retryable halt requiring human action in Figma. The two halves contradict: the skill knowingly lets you choose the server most likely to return `{}`, then interprets `{}` as "a designer must publish mappings" rather than "this server can't read them". There is no "empty map on the remote server → retry on desktop, or warn that the map may be a false negative" branch anywhere. A user who picks the documented-as-available option is routed straight into a dead end with a 35-node to-do list that may be entirely spurious.

**b. The gate fires on nodes that could never be SLDS components.** 32 of the 35 blocked nodes are `th-text-start` / `td-text-start` — plain table header and data cells containing a single text span. These are `<th>` and `<td>`. No Code Connect mapping will ever exist for them and none should. The blocked-node test has no notion of "this is a primitive, not a component candidate", so it demands a human action that is impossible to satisfy for the overwhelming majority of the list. The halt is therefore not actionable as written.

**c. The screenshot — called "ground truth" throughout — is never captured before the halt.** The analyst's protocol short-circuits after `get_metadata` + `get_code_connect_map`. `get_screenshot` is a cheap, independent call that doesn't depend on the CC map at all. Skipping it means (i) the user gets no visual of the design they're being asked to fix mappings for, (ii) a re-run after publishing mappings re-pays every Figma call, and (iii) the run folder violates the contract the coordinator skill states for it. The skill's coordinator section and the analyst's internal ordering disagree about what a blocked run leaves behind.

**d. `BLOCKED_ON_CODE_CONNECT` is likely wrong for an example-path run specifically.** The conventions file says example-path output composes _existing_ SLDS components; the analyst already identified `sl-searchfield`, `sl-select`, `sl-button-rectangular` and `sl-avatar` by the `sl-*` name heuristic without any CC data. The remaining unresolved wrappers (`top nav bar`, `tabbar-horizontal`, `mat-data-footer`) are app chrome a page component would compose from primitives anyway. The gate makes no distinction between "I cannot know which published component this is" and "this doesn't need to be a published component", and the output-location answer — which the coordinator has — is never fed into that judgement.

**e. The run-slug rule is detached from how the repo is actually used.** Following the skill literally produces a run folder whose name shares nothing with the case or the output location. Every prior run on disk apparently didn't follow the rule. A coordinator doing exactly what it's told produces artifacts no one can match to the output.

**f. The halt itself was clean and fast.** Credit where due: 2m43s, 16 tool calls, the analyst verified the empty map per-node rather than trusting a single recursive call, and it clearly separated blocking from non-blocking nodes. The failure is in what the skill does with that result, not in how the result was produced.
