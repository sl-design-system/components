# Control run — A11 Sesame Learning materials (r1)

- **Case**: A11 Sesame Learning materials — the only mobile design in the corpus (360px)
- **Figma**: `https://www.figma.com/design/UBr399hnydpNF9P5Jb2vfx/MySesame-Redesign?node-id=116-19049`
- **Skill**: `implement-design:implement-design` (invoked via the Skill tool, argument block verbatim)
- **Start**: Sun Oct 4 18:59:14 CEST 2026
- **End**: Sun Oct 4 19:09:46 CEST 2026

---

## 1. Stage reached + halt

**Halted in Stage 1 (Design ingestion).** The pipeline never reached Stage 2.

`implement-design:design-analyst` returned the halt token:

```
BLOCKED_ON_CODE_CONNECT
```

followed by 19 genuinely-unconnected component-instance nodes:

| node id   | node name        |
| --------- | ---------------- |
| 116:19051 | top bar          |
| 116:19053 | Button           |
| 116:19054 | Frame 26851      |
| 116:19060 | external-link    |
| 116:19078 | external-link    |
| 116:19096 | external-link    |
| 116:19101 | Platform tag     |
| 116:19106 | external-link    |
| 116:19111 | Platform tag     |
| 116:19116 | external-link    |
| 116:19121 | Platform tag     |
| 116:19126 | external-link    |
| 116:19151 | external-link    |
| 116:19322 | menu item footer |
| 116:19323 | menu item footer |
| 116:19324 | menu item footer |
| 116:19325 | menu item footer |
| 116:19326 | menu item footer |
| 116:19327 | Component 2      |

**Reason** (analyst's own words): `get_code_connect_map` returned an **empty object `{}`** for node `116:19049` — no mappings exist anywhere under this node, so none of the three rescue heuristics in the analyst's step 3 (node named `sl-*`, child sub-node carrying a snippet, peer instance of the same component with a non-null snippet) could be applied to **any** of the 19 component-instance descendants.

Per the analyst's protocol step 4 and the coordinator's step 5, `get_design_context`, `get_variable_defs` and `get_screenshot` were **not** called, and the coordinator **halted without retrying** (retries are specified only for `BLOCKED_ON_MCP`, not for `BLOCKED_ON_CODE_CONNECT`).

I did not attempt to work around this, supply mappings, or run later stages by hand.

## 2. Did Stage 0 ask anything beyond the four supplied answers?

**No.** The four answers (MCP server, framework, i18n, output location) exactly cover Stage 0's four questions. The URL validated as a `figma.com/design/...` link on sight, so no corrected-URL prompt fired. Zero user interaction occurred.

## 3. Things I had to decide that the four answers did not cover

Each of these is a gap in the skill — a decision the coordinator must make with no instruction, or with ambiguous instruction. Listing all of them, including trivial ones, since the run halted early and these are the only decisions that got exercised.

1. **The run-folder slug does not match the case name, and the skill gives no escape hatch.** The skill says: kebab-case _the Figma file name from the URL_. The file name is `MySesame-Redesign`, so the run folder is `.implement-design/mysesame-redesign-1/`. But the case is "A11 Sesame Learning materials" and `.implement-design/` already contains 24 folders named after _cases_ (`a11-sesame-learning-materials`, `a1-kampus-subchapter-feed`, …), none of which follow the documented convention. So the documented rule and the observed convention in the repo disagree, and the skill offers no way to pass a run name. I followed the skill literally.
2. **Multiple frames in one Figma file collide on the slug.** Because the slug is derived from the _file_, not the _node_, every design in `MySesame-Redesign` shares one slug and is only distinguished by the `-N` counter. Two different screens from the same file produce `mysesame-redesign-1` and `mysesame-redesign-2`, with nothing in the folder name saying which node each is. The skill never acknowledges this.
3. **"the smallest integer suffix -N for which the folder doesn't exist" — no instruction on resuming.** If a prior partial run left `-1` behind, the rule silently allocates `-2` and abandons the prior artifacts. There is no resume/reuse path.
4. **`.gitignore` check.** The skill says "make sure `.implement-design/` is ignored — add it to the project's `.gitignore` if it isn't". It was already there (line 21), so nothing to do — but the skill does not say whether to also ignore the _output location_. `examples/lit/src/_runs/` is tracked-ish territory and the generated code is meant to be real; I decided to leave `.gitignore` untouched. Unexercised here but would have mattered by Stage 3.
5. **Output location given as a path with a trailing slash and a non-existent directory.** `examples/lit/src/_runs/control-a11-sesame-learning-r1/` did not exist. The skill's Stage 3 step 9 says to resolve each component's path from "the chosen output location + the decomposition's nested defaults", but never says who creates the directory, nor whether the supplied path is the _root component's_ folder or the _parent_ of the root component's folder. With `examples/lit/src/_runs/<case>/` as a parent and the root component's tag minus `sl-` as its own folder, you'd get `…/control-a11-sesame-learning-r1/<root-name>/<root-name>.ts` — one level deeper than the sibling examples (`examples/lit/src/composite-form/composite-form.ts`). Unresolved; would have needed a judgement call at Stage 3.
6. **`examples/lit/src/index.ts` re-exports every example** (`export * from './composite-form/composite-form.js'` etc.) but neither the skill nor `component-conventions.md` says whether a generated example must be added to it. Conventions only says "reusing the example package's existing `index.ts`/`tsconfig.json`". Unexercised.
7. **The Stage 3 consolidated type-check gate has no defined command for an example.** Step 11 hard-codes `npx tsc -p <package>/tsconfig.json --noEmit`, which is written for `packages/components/`. For `examples/lit/` the tsconfig is `examples/lit/tsconfig.json`; the skill never maps "output location" → "which tsconfig the gate runs against". Unexercised.
8. **Stage 4's "start the app once (Lit: `yarn start` Storybook)"** — the repo has both `.storybook/main.ts` and a second `.storybook-runs/main.ts`, and root scripts `start` and `storybook` (both wireit). The skill names `yarn start` but doesn't say which Storybook config a `_runs/` example is expected to appear in. `.storybook/main.ts` globs `../examples/**/*.stories.ts`, so `yarn start` would have worked — but the existence of a parallel runs-specific config is unexplained. Unexercised.
9. **Where to put my own scratch/waiting artifacts.** Not addressed; I kept everything out of the repo.

## 4. Wall clock

- **Total, my invocation to halt**: 10 min 32 s (18:59:14 → 19:09:46).
- **Pipeline-productive time**: ~2 min. The analyst ran 86.8 s (6 tool calls, ~38.8k subagent tokens) and its artifacts landed at 19:01. The remaining ~8 min was my own polling loop waiting for the completion notification — not pipeline cost.

## 5. Artifacts

**Run folder used**: `/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/mysesame-redesign-1/`

(Derived per the skill: Figma file name `MySesame-Redesign` → `mysesame-redesign`, smallest free suffix `-1`. See gap #1 — this does _not_ match the `a11-sesame-learning-materials` folder already in `.implement-design/` from a prior non-pipeline run; I did not touch that one.)

What landed in it:

| file                          | size     | note                                                |
| ----------------------------- | -------- | --------------------------------------------------- |
| `figma-metadata.json`         | 12,333 B | raw `get_metadata` response                         |
| `figma-code-connect-map.json` | 3 B      | literally `{}` — the empty map that caused the halt |

Not written, because the protocol stops before them: `figma-design-context.md`, `figma-variable-defs.json`, `screenshot.png`, `manifest.md`, `testing/`.

`git status --short` shows only the four pre-existing untracked items from before the run (`agents.zip`, `agents/`, `analiza-agent-plugin.md`, `analiza-projektu.md`). **Nothing stray was created**; `.implement-design` is gitignored (line 21). No commits, no `git add`.

## 6. Components created, verdicts, tests, open questions, punch list

**None of it.** Stages 2–6 never ran:

- Components created: **none**. `examples/lit/src/_runs/control-a11-sesame-learning-r1/` was never created.
- Validator verdicts: **n/a** — `visual-validator` never spawned.
- Test results: **n/a** — `component-author` never spawned.
- Decomposer open questions + defaults: **n/a** — `component-decomposer` never spawned, so there is nothing to report under the skill's step 6 ("record both the question and the default you chose").
- `[MINOR]` punch list: **n/a** — `component-reviewer` never spawned.

Agents actually spawned: **1 of 6** — `implement-design:design-analyst` only.

## 7. What surprised me

1. **An empty Code Connect map is a 100%-fatal stop, and the skill treats it the same as a partial one.** The analyst's rescue heuristics in step 3 are all _relative_ — they need at least one non-null snippet somewhere in the map to borrow from. When the map is `{}`, every heuristic is structurally inapplicable, so the failure mode is all-or-nothing. The skill does not distinguish "this file has CC published but 3 instances are missing" (actionable: publish 3 mappings) from "this file has no CC at all" (probably: this Figma file was never Code-Connected, and no amount of per-node work fixes it). The halt message reads identically in both cases.
2. **`BLOCKED_ON_CODE_CONNECT` gets zero retries while `BLOCKED_ON_MCP` gets two** — and an empty `{}` from the remote server is exactly the symptom the skill itself warns about in Stage 0: "`figma` (remote; headless, but **`get_code_connect_map` is unreliable**)". So the skill knows the remote server returns bad CC data, routes that into a non-retryable halt, and never suggests the obvious remedy (re-run on `figma-desktop`) in its halt path. The Stage 0 text calls `figma-desktop` "recommended; most reliable for `get_code_connect_map`", yet step 5's halt advice is purely "publish mappings in Figma and re-run" — it never says "or try the other server". Those two parts of the same skill contradict each other about what an empty map means.
3. **The halt costs the whole run but yields almost no diagnostic value.** Two files on disk, one of them 3 bytes, no screenshot. Because step 4 forbids `get_screenshot`, a human triaging the halt cannot even look at what was being built without going to Figma manually. A cached screenshot would be free (it's a different tool, on a different server, and cannot fail for CC reasons) and would make the halt report actionable.
4. **"Frame 26851" and "Component 2" in the blocked list are default Figma auto-names.** Those are almost certainly not design-system components at all — they're untitled frames the metadata classified as instances. The analyst has no heuristic for "this instance has a junk auto-generated name, it's probably not a DS component", so generic layout frames get counted as blockers that a human is asked to publish Code Connect mappings for. That inflates the blocked list and makes the remediation ask partly nonsensical.
5. **The 360px mobile angle never got tested.** This case's distinguishing property — the only mobile design in the corpus — is invisible to the run, because the halt happens before `get_design_context`, `get_variable_defs`, the screenshot, and Stage 4's breakpoint work. Nothing about this run tells you anything about how the pipeline handles mobile. The halt is upstream of the variable under test.
6. **The run folder naming rule is contradicted by the repo's own history.** Twenty-four folders in `.implement-design/` are case-named; the skill mandates file-named. Whatever produced those folders was not following this skill's step as written.
7. **Stage 0's instruction to use a single `AskUserQuestion` call is dead code when answers are pre-supplied**, and the skill has no text acknowledging that path — it says "Ask **all** setup questions in one batch" unconditionally. Harmless here, but it means a pre-answered invocation is technically off-script from the first numbered step.
