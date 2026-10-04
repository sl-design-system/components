# Control run — B-Sesame Group details (pass 2, R2)

- **Case**: B-Sesame Group details
- **Figma node**: https://www.figma.com/design/UBr399hnydpNF9P5Jb2vfx/MySesame-Redesign?node-id=2142-48093
- **Skill**: `implement-design:implement-design` (invoked via the Skill tool, argument block verbatim)
- **Start**: Sun Oct 4 22:59:51 CEST 2026
- **End**: Sun Oct 4 23:03:38 CEST 2026
- **Wall clock**: **3 min 47 s**
- **Run folder**: `/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/mysesame-redesign-5/`
- **Output location (requested)**: `examples/lit/src/_runs/control-b-sesame-group-details-r2/` — **never created** (halt preceded Stage 3)

---

## 1) Stage reached + exact halt token/reason

**Stage 1 (Design ingestion). Halted on the first agent.**

`design-analyst` returned the halt token:

```
BLOCKED_ON_CODE_CONNECT
```

…with a 23-node blocked list. Per SKILL.md Stage 1 step 5, this is an unconditional halt — "the design has unconnected component instances that need Code Connect mappings published in Figma — a human action the pipeline can't do. **Halt** and report the blocked-node list". No retry is specified for this token (retry ×2 applies only to `BLOCKED_ON_MCP`). I halted rather than working around it.

Blocked nodes as returned by the analyst:

| Node id    | Figma component name    |
| ---------- | ----------------------- |
| 2142:48105 | button secondary        |
| 2142:48111 | button secondary        |
| 2142:48118 | button secondary        |
| 2142:48136 | DEMO - Tab-switches     |
| 2142:48137 | DEMO - Tab-switches     |
| 2142:48138 | DEMO - Tab-switches     |
| 2142:48151 | menu item SU            |
| 2142:48152 | menu item SU            |
| 2142:48153 | menu item SU            |
| 2142:48154 | menu item SU            |
| 2142:48156 | avatar_SU               |
| 2142:48168 | button                  |
| 2142:48199 | select-box-down         |
| 2142:48332 | Focus ring              |
| 2142:48345 | select-box-down         |
| 3659:36698 | Accordion-multiple-view |
| 2142:48465 | button primary          |
| 2142:48471 | Empty ison              |
| 2142:48491 | menu item footer        |
| 2142:48492 | menu item footer        |
| 2142:48493 | menu item footer        |
| 2142:48494 | menu item footer        |
| 2142:48495 | menu item footer        |

Corroborated by the artifact: `figma-code-connect-map.json` is literally `{}` — the remote `figma` server returned **zero** mappings for this file, so _every_ instance in the frame is unconnected, not just a long tail.

Stages 2–6 never ran. No decomposition, no implementation, no validation, no tests, no review.

## 2) Did Stage 0 ask anything extra?

**No.** The four supplied answers (MCP server = `figma` remote, framework = `lit`, i18n = no, output location) covered Stage 0 exactly. The URL passed the `figma.com/design/...` validation in step 1. No `AskUserQuestion` was needed and nothing further was asked of the user at any point — consistent with the skill's "all user input is gathered up front" contract. The run was fully unassisted from that point to the halt.

## 3) Everything I decided that the four answers didn't cover

1. **Run-folder slug and suffix.** SKILL.md says kebab-case the _Figma file name_ (`MySesame-Redesign`), not the case label. `mysesame-redesign-1..4` already existed, so by the rule "smallest integer suffix `-N` from 1 that doesn't exist" I used **`mysesame-redesign-5`**. Note the mismatch this creates: the run folder (`mysesame-redesign-5`) and the requested output folder (`control-b-sesame-group-details-r2`) carry unrelated names, so an artifact folder cannot be traced to its run by name alone.
2. **`.gitignore`.** Already contains `.implement-design` (line 21) — nothing to add.
3. **Model for the analyst.** The agent definition pins `model: opus`; I passed `opus` explicitly to match rather than inheriting.
4. **Which Figma tool namespace to name.** The skill says "chosen server" but the analyst has both `mcp__figma__*` and `mcp__figma-desktop__*` wired. I spelled out `mcp__figma__*` in the prompt so "figma (remote)" was unambiguous.
5. **Absolute paths.** The skill says pass plugin paths; I passed the absolute `design-manifest.schema.md` path, the absolute run folder, and the project root.
6. **Nothing else** — the halt arrived before any decomposition, naming, token, story-id or layout decision was needed.

## 4) Wall clock

**3 min 47 s** total (22:59:51 → 23:03:38). The analyst itself ran **191 s** / 6 tool calls / ~57 k tokens. The remaining ~37 s was my setup and the post-halt artifact/`git status` verification.

## 5) Artifacts

In `.implement-design/mysesame-redesign-5/`:

| File                          | Status                                                                                                                |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `figma-metadata.json`         | **written**, 44 KB — full node tree, root `<frame id="2142:48093" name="Group details" … width="1280" height="2392">` |
| `figma-code-connect-map.json` | **written**, 2 bytes — `{}`                                                                                           |
| `screenshot.png`              | **MISSING**                                                                                                           |
| `figma-design-context.md`     | **MISSING**                                                                                                           |
| `figma-variable-defs.json`    | **MISSING**                                                                                                           |
| `testing/`                    | created, empty                                                                                                        |
| `manifest.md`                 | not written (Stage 2 never ran — correct)                                                                             |

No files were created in `examples/lit/src/_runs/control-b-sesame-group-details-r2/` (the folder does not exist).

**Step 19 working-tree check**: `git status --porcelain` shows only the four pre-existing untracked entries (`agents.zip`, `agents/`, `analiza-agent-plugin.md`, `analiza-projektu.md`). No stray `*.png` at the repo root. **This run created nothing outside its run folder.**

## 6) Components / verdicts / tests / decomposer questions / [MINOR]

All empty — the halt was upstream of every one of these.

- **Components created**: none
- **Validator verdicts**: none (Stage 4 never started; Storybook was never launched)
- **Tests**: none
- **Decomposer open questions + defaults**: none — `component-decomposer` was never spawned
- **[MINOR] punch list**: none — `component-reviewer` was never spawned
- **Handoff notes**: none

## 7) What surprised me about the skill

1. **The blocking artifact is the cheapest call, but it runs late enough to cost 3 minutes.** `get_code_connect_map` returning `{}` is decisive on its own — the run cannot proceed. The analyst still spent 191 s and ~57 k tokens, fetching and writing a 44 KB metadata tree first. Nothing in SKILL.md tells the analyst to probe Code Connect before the expensive work, so a file with no published mappings always pays the full ingestion cost before failing.
2. **The halt path leaves the artifact contract half-honoured, and the skill doesn't acknowledge it.** SKILL.md step 3 states flatly that the analyst "caches the screenshot there **and** writes the raw output of each Figma call" and lists all four files. On `BLOCKED_ON_CODE_CONNECT` only two of five appear. Most consequentially **`screenshot.png` — described elsewhere in the skill as "ground truth" — is never cached**, so the re-run after a human publishes mappings has to re-fetch everything. The blocked path writes no record of _why_ it blocked either: the 23-node list exists only in the agent's return message, not on disk. A user who closes the terminal loses the actionable half of the halt and keeps the useless half.
3. **23 blocked nodes but far fewer distinct components.** The list is nine distinct Figma components (`button secondary` ×3, `DEMO - Tab-switches` ×3, `menu item SU` ×4, `menu item footer` ×5, `select-box-down` ×2, plus `avatar_SU`, `button`, `button primary`, `Focus ring`, `Empty ison`, `Accordion-multiple-view`). The skill asks for "the blocked-node list" per instance, so the human-actionable unit (publish ~11 component mappings) is buried in 23 rows. Worth noting that `Focus ring` and `Empty ison` (sic — the Figma layer is misspelled) are arguably not components a human would ever Code Connect, so a literal reading of the list overstates the required work.
4. **The skill's own Stage 0 copy predicts this failure and the pipeline still can't act on it.** The Figma-MCP question text says of the remote server: "headless, but `get_code_connect_map` is unreliable." I supplied `figma` (remote) as instructed, got an empty map, and halted. The skill knows the chosen server is the unreliable one for exactly this call, yet Stage 1 draws no distinction — it cannot tell "the design genuinely has no published mappings" from "the remote server didn't return them." Those need opposite human responses (publish mappings in Figma vs. re-run against `figma-desktop`), and the halt message the skill specifies points only at the first. A `figma-desktop` retry before declaring the block would separate them; the skill reserves its retry budget for `BLOCKED_ON_MCP` instead.
5. **Run folder and output folder are named independently, with no cross-reference.** Neither location records the other, so correlating `.implement-design/mysesame-redesign-5/` with this case requires out-of-band notes.

---

## Environment notes (NOT skill findings)

Recorded separately as requested. None of these affected the outcome — the halt occurred before any of them could bite.

| Known fact                                                                                                                                            | How it played out this run                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tsc` has 2 pre-existing errors in `packages/components/grid/src/grid.ts` (1180, 1361)                                                                | Confirmed. I ran `npx tsc -p examples/lit/tsconfig.json --noEmit` as a **baseline** while the analyst worked: output was exactly those two `TS2322: Type 'number' is not assignable to type 'Timeout'` errors and nothing else. **No stale-sibling `TS2717` was present at run start.** The Stage 3 gate never ran, so this was never load-bearing.                                                                                                                                                                                                                                                                                                                                                                                 |
| `yarn <script>` dies without `FONT_AWESOME_AUTH_TOKEN`                                                                                                | Confirmed unset in this environment (`FONT_AWESOME_AUTH_TOKEN` empty; `.npmrc` empty). **Not exercised** — Stage 4's `yarn start` never ran. Had it, I would have hit this: the skill's Stage 4 says "Lit: `yarn start` Storybook", which uses `.storybook/main.ts` (whole-repo glob). The repo carries a narrowed `.storybook-runs/main.ts` whose own header comment says the repo-wide config "loads 33 stories that import Font Awesome Pro from a private registry; without a token those fail to resolve and take the whole dev server with them." Resolving this would have meant deviating from the skill's literal `yarn start` — recorded here as a pre-existing environment/skill mismatch, not a decision I had to make. |
| ~24 sibling folders in `examples/lit/src/_runs/` share one Storybook index; a duplicate story id kills the server; stale siblings can inject `TS2717` | 23 siblings present. I grepped existing story titles up front and found **`title: 'Runs/B Sesame Group Details/Page'` already registered** by the pass-1 folder `b-sesame-group-details/` — a live collision risk for this r2 run, since nothing in the skill tells an implementer to namespace its story title by run folder. **Not exercised** (Stage 3/4 never ran). I did not read the contents of that pass-1 folder; the title came from a repo-wide grep done solely for collision safety.                                                                                                                                                                                                                                   |

**File safety**: nothing outside `.implement-design/mysesame-redesign-5/` was created, modified or deleted. No scratch scripts were written anywhere. No `git add`, no `git commit`, no PR. The `tsc` baseline was `--noEmit`.
