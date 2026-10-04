# Control run — A8 NSP Group list (pass 2, R2)

- **Case**: A8 NSP Group list
- **Figma**: https://www.figma.com/design/4TdMrcnIVOn3Hrfj2OpVZU/New-Secondary?node-id=334-20573
- **Stage 0 answers supplied**: figma (remote) / lit / i18n no / `examples/lit/src/_runs/control-a8-nsp-group-list-r2/`
- **Start**: Sun Oct 4 20:16:43 CEST 2026
- **End**: Sun Oct 4 20:20:18 CEST 2026
- **Wall clock**: 3 min 35 s (of which the design-analyst subagent was 181 s / 24 tool calls)

---

## 1. Stage reached — and the halt

**Halted in Stage 1 (Design ingestion). Nothing after Stage 1 ran.**

Halt token returned by `implement-design:design-analyst`:

```
BLOCKED_ON_CODE_CONNECT

- `I334:20685;111:12383` — Logo
```

Reason as the analyst gave it: one component instance in the subtree has no Code Connect mapping and cannot be identified as an existing SLDS component by any of the analyst's three heuristics —

> Its own code-connect lookup (`get_code_connect_map(nodeId="111:12383")`) returns `{}`, its only child is another "Logo" instance that also resolves to `{}`, its name is not `sl-*`, and no peer instance elsewhere in this tree has a non-null snippet for it.

The node is the **brand-mark logo inside the top nav bar** (`334:20685` "Frame 26", itself inside `334:20684` "Frame 27").

The skill's Stage 1 step 5 makes this a hard stop:

> **`BLOCKED_ON_CODE_CONNECT`**: … a human action the pipeline can't do. **Halt** and report the blocked-node list so the user can publish mappings and re-run.

So I halted, as instructed. I did not retry, substitute a server, or hand the analyst a hint.

Everything the analyst _did_ resolve (not blocking): `sl-card Actionable` ×5 (by `sl-*` name), `Action 1/2/3` → `sl-button` snippets, `sl-badge` ×2, `sl-avatar`, `sl-button-pill` → `sl-button` + `sl-icon`, and two unnamed wrappers ("Frame 26", "Frame 24") treated as composable because their children resolve.

Notably: the **top-level** `get_code_connect_map(nodeId="334:20573")` returned `{}` — the empty map for the whole tree. Every resolved snippet above came from the analyst issuing ~12 per-node follow-up calls on its own initiative.

## 2. Did Stage 0 ask anything beyond the four answers?

**No.** All four answers were supplied in the invocation and all four matched the skill's own option sets verbatim, so no `AskUserQuestion` was needed and none was issued. Stage 0 was satisfied entirely from the argument block.

## 3. Things I had to decide that the four answers did not cover

Listed exhaustively, smallest included.

1. **Run-folder slug and number.** The skill specifies the rule (kebab-case the Figma _file_ name, smallest free `-N`), giving `new-secondary-2` (because `new-secondary-1` already existed from an unrelated run). The rule is unambiguous, but see the gap in §7: the slug keys on the **file**, not the node, so it carries no trace of which case this is.
2. **Whether `.implement-design/testing/` is pre-created or created on demand.** The skill says the validator writes into `<run>/testing/`, but never says who creates the directory. I created it up front with the run folder. On a Stage-1 halt it is left behind empty.
3. **Whether to pass the project root to the analyst.** The skill's spawn list for `design-analyst` names the URL, the server, the `<run>` path, and the schema path — not the repo root. The analyst needs a root to resolve anything in the repo, so I added it. Unspecified.
4. **How literally to pass "the chosen server".** Stage 0's answer is the label `figma (remote)`; the agent needs to know that means the `mcp__figma__*` tool family and that `get_screenshot` is on that same server either way. I spelled that out. The skill states the rule to the _orchestrator_ but doesn't say it must be restated to the agent.
5. **What to do with the half-written run folder on a halt.** The skill's final-report step tells me to check for stray artifacts _outside_ the intended trees, but says nothing about a run folder left with 2 of 5 expected artifacts and no `screenshot.png`. I left it as-is (it is gitignored).
6. **Whether a `BLOCKED_ON_CODE_CONNECT` halt still gets the "final report" treatment** (git-status check, etc.) or just the halt message. Step 19's checklist is written for a completed run. I ran `git status` anyway.

## 4. Wall clock

**3 min 35 s** end to end (20:16:43 → 20:20:18). The analyst accounted for 3 min 1 s of it.

## 5. Artifacts

Run folder used: `/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/new-secondary-2/`

What landed in it:

| File                          | Size    | Notes                                                                                     |
| ----------------------------- | ------- | ----------------------------------------------------------------------------------------- |
| `figma-metadata.json`         | 14.3 KB | full node tree of `334:20573` "Group list", 1280×1024                                     |
| `figma-code-connect-map.json` | 4.0 KB  | the top-level empty map **plus** ~12 per-node follow-up lookups, annotated by the analyst |
| `testing/`                    | empty   | created by me up front; never written to                                                  |

**Not produced** (blocked before those steps): `screenshot.png`, `figma-design-context.md`, `figma-variable-defs.json`, `manifest.md`. The analyst explicitly noted "Per protocol, `get_design_context` and `get_screenshot` were **not** called."

`.implement-design` was already in `.gitignore` (line 21) — no change needed.

`git status` at end is identical to the start of the run: only the four pre-existing untracked entries (`agents.zip`, `agents/`, `analiza-agent-plugin.md`, `analiza-projektu.md`). **Nothing was committed. No stray artifacts.**

## 6. Components created / validator / tests / decomposer / punch list

**None of the above exist.** The run never reached Stage 2.

- Components created: **none** — no `examples/lit/src/_runs/control-a8-nsp-group-list-r2/` was created.
- Validator verdicts: **n/a** (Stage 4 never ran; no dev server was started).
- Test results: **n/a** (Stage 5 never ran).
- Decomposer open questions + defaults: **n/a** (`component-decomposer` was never spawned).
- `[MINOR]` punch list: **n/a** (`component-reviewer` was never spawned).

Agents actually spawned: **1 of 6** — `implement-design:design-analyst`. The other five were never reached.

## 7. What surprised me about the skill's behavior

**a. The skill tells you to pick a server it then treats as authoritative, having just warned you it isn't.** Stage 0's own option text for the Figma MCP server says `figma` (remote) is "headless, but `get_code_connect_map` is unreliable", and recommends `figma-desktop` as "most reliable for `get_code_connect_map`". The run then used the remote server, got `{}` from `get_code_connect_map`, and the pipeline converted that into a hard halt demanding a **human publish mappings in Figma**. The skill has no step that says "an empty code-connect result on the server you were told is unreliable for exactly this call may be a tooling artifact, not a missing mapping" — and no fallback to re-run the analyst against `figma-desktop` before declaring a human-action blocker. Stage 1 step 4 provides a retry ladder for `BLOCKED_ON_MCP` (up to 2 re-spawns) but step 5 gives `BLOCKED_ON_CODE_CONNECT` **zero** retries and no server fallback. A user who answers Stage 0 with the non-recommended option gets told the design is broken.

**b. A decorative logo halts the entire pipeline.** The one blocking node is a brand mark in a top nav bar — chrome around the component under implementation, not part of the group-list content. The skill has no concept of node severity, of a node being out of implementation scope, or of "render this as a placeholder and flag it". One unmappable glyph in a nav bar blocks five `sl-card`s, three `sl-button`s, two `sl-badge`s and an `sl-avatar` that all resolved cleanly.

**c. The halt discards work that didn't depend on the blocker.** `get_screenshot` is, by the skill's own Stage 0 text, always served by the remote `figma` server and has nothing to do with Code Connect. `get_variable_defs` likewise. Both are cheap and both are listed as run artifacts; `screenshot.png` is called "the cached Figma reference (ground truth)" and is read by the validator in Stage 4. The analyst's protocol nonetheless returns before calling either, so a re-run after a human publishes the mapping must redo the whole ingestion from zero. Nothing in the skill says the analyst should bank the server-independent artifacts before blocking.

**d. The run-folder slug can't identify the run.** `<file-slug>-N` derives from the Figma _file_ name, so every case in `New-Secondary` — regardless of node-id — competes for `new-secondary-1`, `-2`, `-3`. The folder that holds this case's artifacts is named `new-secondary-2` and contains nothing that says "A8 group list", while the output location the user chose (`control-a8-nsp-group-list-r2`) is a different, unrelated string. There is no file in the run folder recording the URL, the node-id, the Stage 0 answers, or the timestamp. Reconstructing which run folder belongs to which invocation is guesswork.

**e. The top-level Code Connect call is useless and the skill doesn't say so.** `get_code_connect_map(nodeId="334:20573")` returned `{}` for the entire tree. Every usable snippet came from the analyst independently fanning out to ~12 individual node lookups — including discovering on its own that the tool **rejects compound instance ids** (`I334:20678;4:7272`) and must be re-queried with the bare id (`4:7272`). That id-format rule is load-bearing for the whole stage and appears nowhere in `SKILL.md`; the run depended on the agent rediscovering it.

**f. The orchestrator is told to sanity-check output it may never see.** The skill instructs the coordinator to read `component-conventions.md` (31 KB) up front "so you can sanity-check agent output". On a Stage-1 halt that read is pure cost — and nothing in the skill sequences it after the first stage that can actually halt.
