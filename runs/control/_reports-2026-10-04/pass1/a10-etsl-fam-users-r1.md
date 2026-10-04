# Control run — A10 ETSL FAM - Users (r1)

- **Pipeline**: `implement-design:implement-design` (invoked via Skill tool, argument block verbatim)
- **Figma node**: `https://www.figma.com/design/S5QgDy8X9eqhvECPANSZMM/Editorial-Suite-designs?node-id=17264-29098`
- **Start**: Sun Oct 4 18:59:04 CEST 2026
- **End**: Sun Oct 4 19:02:10 CEST 2026
- **Wall clock**: **3 min 06 s**
- **Nothing committed.** `git status` at end shows only the four pre-existing untracked entries from the session's opening snapshot (`agents.zip`, `agents/`, `analiza-agent-plugin.md`, `analiza-projektu.md`). No stray artifacts.

---

## 1. Stage reached / halt

**Halted in Stage 1 (Design ingestion), at step 5.** The pipeline never reached Stage 2.

`implement-design:design-analyst` returned the halt token verbatim:

```
BLOCKED_ON_CODE_CONNECT

- `17264:29099` — top nav bar
- `17264:29105` — tabbar-horizontal
- `17264:29115` — th-text-start (repeats: 17264:29122, 17264:29129, 17264:29136, 17264:29141, 17264:29146, 17264:29151, 17264:29156, 17264:29161)
- `17264:29116` — td-text-start (repeats: 17264:29117–29120, 17264:29123–29127, 17264:29130–29134, 17264:29137–29139, 17264:29142–29144, 17264:29147–29149, 17264:29152–29154, 17264:29157–29159, 17264:29162–29166)
- `17264:29167` — mat-data-footer
```

SKILL.md step 5 is unconditional: _"the design has unconnected component instances that need Code Connect mappings published in Figma — a human action the pipeline can't do. **Halt** and report the blocked-node list so the user can publish mappings and re-run."_ There is no retry budget for this token (the 3-attempt retry in step 4 applies only to `BLOCKED_ON_MCP`), so I halted as instructed, spawned no further agents, and wrote no code.

**The likely real cause is not what the halt says.** `figma-code-connect-map.json` landed as literally `{}` — the remote `figma` server returned an _empty_ Code Connect map, not a map with gaps. SKILL.md's own Stage 0 text says of the remote server: _"headless, but `get_code_connect_map` is unreliable."_ So the pipeline let Stage 0 select a server it already describes as unreliable for exactly this call, then used that call's empty result to fire a terminal blocker whose remedy text ("publish mappings in Figma") is probably the wrong remedy. The skill contains both halves of this contradiction and reconciles neither.

## 2. Did Stage 0 ask anything beyond the four supplied answers?

**No.** All four Stage 0 questions (MCP server, framework, i18n, output location) were covered by the supplied block, the URL validated as a `figma.com/design/...` link, and no `AskUserQuestion` was needed. Stage 0 cost nothing.

## 3. Everything I had to decide that the four answers did not cover

Every one of these is a gap in the skill. Listed smallest-to-largest is impossible — they're listed in the order they bit.

1. **Run-folder slug conflicts with the repo's actual convention.** SKILL.md: _"Derive `<file-slug>` by kebab-casing the Figma file name from the URL."_ That gives `editorial-suite-designs` → `editorial-suite-designs-1`. But all 23 existing folders in `.implement-design/` are named by _case_ (`a10-etsl-fam-users`, `b-nsp-home`, …), not by Figma file name. I followed the skill literally. Consequence: one Figma file containing many cases collapses every case into one `<file-slug>-N` series, so run folders carry no hint of _which_ design they hold — and this repo's own history shows humans silently overriding the rule.
2. **`<run>` folder creation timing vs. who creates it.** Step 3 says _"Create the unique `<run>` folder"_ then spawn the analyst, but the analyst also writes into it. I created it myself before spawning. Harmless here, but unspecified whether the analyst should create-if-missing (it would race on a re-spawn under step 4's retry).
3. **Output location shape was not one of Stage 0's two offered options.** Stage 0 offers "`packages/components/`" or "an app/example path like `examples/`". The supplied `examples/lit/src/_runs/control-a10-etsl-fam-users-r1/` is already a _run-specific leaf_ folder. Step 9 then says to resolve the target as _"the chosen output location + … root component's tag minus `sl-`, kebab-cased, as the folder."_ Read literally that yields `…/control-a10-etsl-fam-users-r1/<root-name>/<root-name>.ts`, but the neighbouring prior run (`examples/lit/src/_runs/a10-etsl-fam-users/`) puts the **root component's files directly in the run folder** with only children nested. I had resolved to follow the skill literally (extra root folder). Never exercised — halted first — but it is a real fork with no rule.
4. **Whether to register the new component in `examples/lit/src/index.ts`.** `component-conventions.md` says an example reuses _"the example package's existing `index.ts`/`tsconfig.json`"_ — reuse, not necessarily extend. `index.ts` currently exports the four hand-written examples and **none** of the 19 existing `_runs/*` folders, so the de-facto answer is "don't", but nothing in the skill says so. Unresolved; never reached.
5. **Which tsconfig the Stage 3 consolidated gate uses.** Step 11 prescribes `npx tsc -p <package>/tsconfig.json --noEmit`, but `<package>` is undefined for an example path. I determined it would be `examples/lit/tsconfig.json` (the only tsconfig on that path; `examples/` has none). Note its `include` is `["../../vite-env.d.ts", "index.ts", "src/**/*.ts"]` — it _would_ have picked up the new files, but only by luck of the glob, and it also type-checks all 19 prior runs, so unrelated pre-existing errors would be attributed to this run's implementers.
6. **Contamination risk the skill is silent on.** `component-conventions.md` tells implementers to _"Mirror a neighbour under `examples/`."_ The nearest neighbour to the control output path is `examples/lit/src/_runs/a10-etsl-fam-users/` — a **prior run of this exact design**. The skill has no rule preventing an implementer from mirroring (or copying) a previous attempt at the same case. For a measurement control that is a serious confound. I deliberately passed no pointer to it, but the skill would not have stopped an implementer from finding it.
7. **Nothing in the skill says what to do with a partially-populated `<run>` folder after a halt.** Left as-is (see §5).

## 4. Wall clock

**3 min 06 s** total (18:59:04 → 19:02:10). The analyst itself ran ~152 s / 16 tool calls; the rest was folder setup and conventions reading.

## 5. Artifacts

Run folder used: **`.implement-design/editorial-suite-designs-1/`** (newly created; `.implement-design` is already in `.gitignore` at line 21, so no gitignore edit was needed).

What landed:

| File                          | Size    | Notes                                                          |
| ----------------------------- | ------- | -------------------------------------------------------------- |
| `figma-metadata.json`         | 7,583 B | Full node tree of frame `17264:29098` "FAM - Users" (1440×837) |
| `figma-code-connect-map.json` | 3 B     | Literally `{}` — empty map                                     |

**Did NOT land** (the analyst halted before making those calls):

- `screenshot.png` — **the reference screenshot the skill calls "ground truth" was never cached.**
- `figma-design-context.md`
- `figma-variable-defs.json`
- `manifest.md` (Stage 2 artifact — never reached)
- `testing/` (Stage 4 — never reached)

## 6. Components created / validator verdicts / tests / decomposer questions / [MINOR] punch list

**None of these exist.** The run halted in Stage 1.

- Components created: **none**. `examples/lit/src/_runs/control-a10-etsl-fam-users-r1/` was never created.
- Agents spawned: **`implement-design:design-analyst` only** (1 spawn). No decomposer, implementer, validator, author, or reviewer ran.
- Validator verdicts: n/a. Test results: n/a. Decomposer open questions + defaults: n/a. `[MINOR]` punch list: n/a.
- Storybook was never started.

## 7. What surprised me about how the skill behaved

1. **The skill knowingly arms its own terminal blocker.** Stage 0 presents `figma` (remote) as a legitimate choice while stating in the same sentence that its `get_code_connect_map` is unreliable. Stage 1 then treats that same call's output as authoritative enough to kill the run. There is no "the map came back empty — that's the server, not the design" branch, no fallback to `figma-desktop`, and no instruction to degrade gracefully (e.g. proceed without Code Connect snippets and flag it). A run can therefore be terminated by the tool configuration rather than by the design.
2. **The halt message points the human at the wrong fix.** Step 5's remedy is "publish mappings in Figma and re-run". With an empty map from an unreliable server, that is likely unactionable busywork; the actionable fix (switch to `figma-desktop`) is documented 40 lines earlier in Stage 0 and never surfaced at the halt.
3. **A terminal halt costs the screenshot.** `get_screenshot` always uses the remote server and is independent of Code Connect, yet the analyst blocked before caching it. The one artifact a human most needs when triaging "which nodes are unconnected?" — the picture — isn't there. The skill never says "cache the screenshot before evaluating blockers," and it should.
4. **No retry asymmetry rationale.** `BLOCKED_ON_MCP` gets 3 attempts; `BLOCKED_ON_CODE_CONNECT` gets zero — even though the empirically flaky call is the Code Connect one, on the server the skill itself flags as flaky.
5. **Step 8's "no new components" exit and step 5's halt are the only two non-completion paths**, and neither is distinguished in the final-report instructions (step 19 describes a success report only). The skill does not say what a halt report should contain; I inferred it.
6. **The 19 sibling folders under `examples/lit/src/_runs/` are invisible to the skill's mental model.** Both the run-folder naming rule (§3.1) and the "mirror a neighbour" instruction (§3.6) were clearly written for a repo where each output path is unique and hand-placed, not for a batch-measurement tree. Neither rule degrades safely in this repo.
7. **Fast failure is the one genuinely good behaviour here.** 3 minutes to a clear, node-level blocker list with no code written and no dirty tree is exactly what a halt should cost. The problem is the halt's _correctness_, not its mechanics.
