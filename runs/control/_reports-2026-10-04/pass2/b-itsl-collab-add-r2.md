# Control run — B-Itsl-Collab Add element (pass 2, R2)

- **Case**: B-Itsl-Collab Add element
- **Figma**: https://www.figma.com/design/Q3gzx1pCseyKnFNDUOOjCw/Collaboration-folder?node-id=5006-43051
- **Skill**: `implement-design:implement-design` (invoked via Skill tool, argument block verbatim)
- **Start**: Sun Oct 4 23:00:18 CEST 2026
- **End**: Sun Oct 4 23:03:01 CEST 2026
- **Wall clock**: 2 min 43 s (163 s)
- **Run folder**: `/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/collaboration-folder-4/`
- **Output location (requested)**: `examples/lit/src/_runs/control-b-itsl-collab-add-r2/` — **never created**

---

## 1) Stage reached + exact halt token/reason

**Halted at the end of Stage 1 (Design ingestion), via SKILL.md step 5.**

Halt token returned by `implement-design:design-analyst`:

```
BLOCKED_ON_CODE_CONNECT

- 5006:43052 — Navigation
- 5006:43056 — PageHeader
- 5006:43058 — Button
- 5006:43059 — Button
- 5006:43065 — xlsx
- 5006:43070 — pptx
- 5006:43075 — docx
- 5006:43080 — page
```

SKILL.md step 5 makes this a hard, non-retryable halt: "the design has unconnected component instances that need Code Connect mappings published in Figma — a human action the pipeline can't do. **Halt** and report the blocked-node list so the user can publish mappings and re-run." I therefore stopped. Stages 2–6 never ran; no decomposer, implementer, validator, author or reviewer was ever spawned.

The analyst's own evidence (written to `figma-code-connect-map.json`):

```json
{
  "note": "get_code_connect_map returned {} for the top-level node 5006:43051 AND for individually queried instance nodes (5006:43058 Button, 5006:43056 PageHeader) and leaf icon instance 5006:43065 (xlsx). No Code Connect mappings exist anywhere in scope for this subtree.",
  "5006:43051": {},
  "5006:43058": {},
  "5006:43056": {},
  "5006:43065": {}
}
```

So: the remote `figma` server returned an **empty map** (not an error) for every node queried — the top-level frame and three individually probed instances — and the analyst escalated the empty map to `BLOCKED_ON_CODE_CONNECT`. Note the known-unreliability caveat the skill itself states in Stage 0 ("`figma` (remote; headless, but `get_code_connect_map` is unreliable)") is exactly the condition that fired here; the pipeline has no way to tell "genuinely unmapped" from "remote server didn't return mappings", and treats both as the human-action halt.

## 2) Did Stage 0 ask anything extra?

**No.** All four answers were supplied in the argument block (MCP server, framework, i18n, output location) and the skill consumed them as given. No `AskUserQuestion` was raised, and no agent asked a follow-up. Stage 0 was effectively a no-op interaction-wise.

## 3) Everything I decided that the four answers didn't cover

Only three things, all mechanical, all before the halt:

1. **Run-folder slug + suffix.** SKILL.md says kebab-case the Figma file name and take the smallest free integer suffix. File name is `Collaboration-folder` → `collaboration-folder`; `-1`, `-2`, `-3` already existed from earlier work, so I created `.implement-design/collaboration-folder-4/`. (The suffix rule is file-scoped, not case-scoped, so a _second pass of the same case_ does not get the same folder as the first — the folder name carries no trace of which case or pass it is. Minor reproducibility wart.)
2. **`.gitignore`.** Checked rather than decided — `.implement-design` is already on line 21, so nothing to add.
3. **Pre-creating `testing/`.** I created `<run>/testing/` up front since SKILL.md describes it as part of the run folder's structure. It stayed empty.

Nothing else: the halt came before any naming, token, API, decomposition or layout decision would have been needed. I supplied no hints to the analyst beyond the literal arguments the skill prescribes (URL, server, run path, schema path, project root).

## 4) Wall clock

| Segment                                                                  | Duration       |
| ------------------------------------------------------------------------ | -------------- |
| Coordinator setup (read conventions, create run folder, check gitignore) | ~45 s          |
| Stage 1 — `design-analyst` (15 tool calls, 43.5k subagent tokens)        | 128.7 s        |
| Halt handling + artifact/git verification                                | ~15 s          |
| **Total**                                                                | **2 min 43 s** |

No time was spent polling or sleeping. Fastest possible outcome shape — the run cost under three minutes because it died at the first gate.

## 5) Artifacts

Everything created by this run lives in `.implement-design/collaboration-folder-4/` (gitignored):

| File                          | Size     | Status                                                                                      |
| ----------------------------- | -------- | ------------------------------------------------------------------------------------------- |
| `figma-metadata.json`         | 10,951 B | written — full node tree of frame 5006:43051 (`Add element [3rd implementation]`, 1280x768) |
| `figma-code-connect-map.json` | 359 B    | written — four empty maps + the analyst's note                                              |
| `testing/`                    | —        | created by me, empty                                                                        |
| `screenshot.png`              | —        | **NOT written**                                                                             |
| `figma-design-context.md`     | —        | **NOT written**                                                                             |
| `figma-variable-defs.json`    | —        | **NOT written**                                                                             |
| `manifest.md`                 | —        | **NOT written** (Stage 2 never ran)                                                         |

No files were created anywhere else. `examples/lit/src/_runs/control-b-itsl-collab-add-r2/` does not exist. `git status --porcelain` at the end shows only the four pre-existing untracked entries (`agents/`, `agents.zip`, `analiza-agent-plugin.md`, `analiza-projektu.md`) — step 19's "nothing landed outside the intended trees" is satisfied; nothing to clean up.

## 6) Components / verdicts / tests / decomposer questions / [MINOR]

All empty — the pipeline halted before Stage 2.

- **Components created**: none
- **Validator verdicts**: none (Stage 4 never ran)
- **Tests**: none (Stage 5 never ran)
- **Decomposer open questions + chosen defaults**: none (decomposer never spawned)
- **[MINOR] punch list**: none (reviewer never spawned)
- **Unresolved handoff notes**: the one blocker above — eight Figma instances need Code Connect mappings published before this case can run.

## 7) Known environment facts — how each was resolved

None of the three were reached. Recording them as not-hit rather than as resolved:

- **`tsc` pre-existing errors in `packages/components/grid/src/grid.ts` (1180, 1361)** — not hit. The Stage 3 consolidated `tsc` gate never ran, so the pre-existing errors never had to be distinguished from run-caused ones.
- **`yarn <script>` dying without `FONT_AWESOME_AUTH_TOKEN`** — not hit. No `yarn` invocation occurred; Stage 4 (`yarn start` Storybook) never started.
- **Shared Storybook index across ~24 `_runs/` siblings (duplicate story id kills the server; stale siblings inject `TS2717`)** — not hit. No story file and no output folder were created, so no id could collide and no sibling could interfere. Worth noting the shared-index hazard is latent, not removed: a run that _does_ reach Stage 3 still adds a 25th sibling.

## 8) What surprised me about the skill

1. **The halt is correct per the letter of the skill but is probably the wrong diagnosis.** The analyst got `{}` — an empty success, not an error — from `get_code_connect_map` on the remote `figma` server. The skill's own Stage 0 copy warns that `get_code_connect_map` is "unreliable" on precisely this server. Yet there is no branch anywhere that reconciles those two facts: an empty map from a server the skill _already distrusts_ is escalated straight to a human-action halt. There is no `BLOCKED_ON_CODE_CONNECT` retry path (contrast step 4, which gives `BLOCKED_ON_MCP` three attempts), no "retry on the other server", and no advice in the halt to try `figma-desktop`. A run can thus be killed by a known-flaky call with no recovery ramp. The one escape hatch — answering `figma-desktop` at Stage 0 — must be chosen before anyone knows it's needed.

2. **The analyst halted mid-sequence and left the run folder inconsistent.** It wrote `figma-metadata.json` and `figma-code-connect-map.json`, then stopped — so `screenshot.png`, `figma-design-context.md` and `figma-variable-defs.json` are missing. The skill describes those four raw files as the analyst's reproducibility output and calls `screenshot.png` "ground truth"; it never says what the folder should look like on a halt. A re-run after publishing the mappings therefore starts from a half-populated `-4` folder _and_ creates a fresh `-5`, since the suffix rule only counts directories. Cheap fix: have the analyst take the screenshot first (it's the cacheable artifact and costs one call) so a halted run still leaves a usable reference.

3. **Code Connect is a gate on the whole subtree, including leaf icons.** Four of the eight blocked nodes (`xlsx`, `pptx`, `docx`, `page`) are file-type icon instances. Those are the kind of node a human would map to `<sl-icon name="...">` without hesitation, and they are not what Code Connect exists to disambiguate. The gate makes no severity distinction between "this is a composite SLDS component I must not re-invent" (PageHeader, Navigation, Button) and "this is an icon" — so a design is blocked just as hard by four unmapped icons as by an unmapped page header.

4. **Stage 0 collapses to zero friction when pre-answered, which is good — and silent, which is less good.** Supplying the four answers in the prompt produced no confirmation, no echo of what was parsed. Nothing in the run ever restated "framework = lit, output = …". Because the run died at Stage 1, I have no evidence that the output-location answer was even read; the first consumer of it is Stage 3.

5. **Robustness note in the skill's favour**: the analyst did not simply trust a single top-level `{}`. It re-probed three individual instance nodes (a Button, the PageHeader, and a leaf icon) before concluding, and wrote that reasoning into the artifact as a `note` field. That's a genuinely good failure report — the halt is well-evidenced even if the conclusion it licenses is arguably wrong.
