# Control run A9 — SANNA "Login 1" — `/implement-design`, run 1

- **Figma**: https://www.figma.com/design/Mzc8BuOvMxOJGAQtv0h64M/SANNA-Ready-for-Development?node-id=71-13345 (node `71:13345`, 1512 × 982)
- **Stage 0 answers supplied**: Figma MCP = `figma` (remote) · framework = `lit` · i18n = no · output = `examples/lit/src/_runs/control-a9-sanna-login-r1/`
- **Start** Sun Oct 4 18:58:24 CEST 2026 → **End** Sun Oct 4 20:13:35 CEST 2026 — **≈ 75 min wall clock**

---

## 1. Stage reached

**Ran to completion — all six stages. No halt, no `BLOCKED_ON_*` token.**

| Stage               | Agent                                        | Outcome                                                                      |
| ------------------- | -------------------------------------------- | ---------------------------------------------------------------------------- |
| 0 Setup             | (orchestrator)                               | All four answers pre-supplied; nothing asked                                 |
| 1 Ingestion         | `design-analyst`                             | Manifest returned; **no** `BLOCKED_ON_CODE_CONNECT`, **no** `BLOCKED_ON_MCP` |
| 2 Decomposition     | `component-decomposer`                       | 2-component tree + 10 open questions                                         |
| 3 Implementation    | `component-implementer` ×2 (leaf, then root) | Both landed; consolidated `tsc` gate passed                                  |
| 4 Visual validation | `visual-validator` ×3                        | `NEEDS_WORK` → `NEEDS_WORK` → `NEEDS_WORK` (**3-iteration cap hit**)         |
| 5 Author            | `component-author`                           | Story enriched (example scope: no tests/docs/changeset)                      |
| 6 Review            | `component-reviewer` ×2                      | 3 + 3 `[CRITICAL]`, routed back, re-validated → **MATCH**                    |

Agent spawns: 12 (1 analyst, 1 decomposer, 5 implementer, 4 validator, 1 author, 2 reviewer = 13 actually).

**The one place it halted-by-rule** was Stage 4's iteration cap, not an error:

> _"Cap at 3 iterations per component; if still diverging, record a handoff note and move on."_

The third validator pass still returned `NEEDS_WORK`, so I recorded the handoff and moved to Stage 5 as instructed. Notably, the Stage 6 reviewers then found the _root causes_ of the remaining gaps, and after those `[CRITICAL]` fixes the confirmation pass returned **MATCH**. **The visual loop's own cap stopped it one round short of convergence; the review stage rescued it.**

---

## 2. Did Stage 0 ask anything beyond the four answers?

**No.** With all four supplied, the skill asked nothing further and ran standalone to the final report, exactly as designed. No `AskUserQuestion` was issued.

---

## 3. Everything I had to decide that the four answers did not cover

### 3a. Orchestrator-level gaps (not raised by any agent)

1. **Run-folder slug collides across nodes of the same file.** The skill derives `<run>` from the Figma **file** name, so this node got `.implement-design/sanna-ready-for-development-2/` (`-1` was taken by an earlier run of the _same file, different node_). The folder name therefore has no relationship to the case slug `control-a9-sanna-login-r1`. Correlating a run folder to a run requires opening `manifest.md`.
2. **Where the root component's files go.** Step 9 says "the root component's tag minus `sl-`, kebab-cased, as the folder" — but the supplied output location is _already_ a run-specific folder. Taken literally that yields `control-a9-sanna-login-r1/sanna-login-page/sanna-login-page.ts`. I matched the neighbours under `examples/lit/src/_runs/` instead: root files directly in the run folder, child nested.
3. **`tsc` exit code is non-zero for reasons the run didn't cause.** The Stage 3 gate is _"Type-check is clean (`tsc` exit 0)"_, but the repo has two pre-existing errors in `packages/components/grid/src/grid.ts` (`Type 'number' is not assignable to type 'Timeout'`). Taken literally the gate can never pass and Stage 4 is unreachable. I decided the gate means "no errors attributable to generated files" and verified `grid.ts` was unmodified.
4. **`yarn start` does not work in this environment — I had to deviate from the skill's literal instruction.** Three separate failures:
   - `yarn` itself aborts: `Environment variable not found (FONT_AWESOME_AUTH_TOKEN)` in `.yarnrc.yml`. Worked around with a dummy value (it's registry auth, irrelevant to running).
   - `yarn start` is a wireit script whose `build:themes` / `build:locales` dependencies then fail on **missing node_modules** (`@tokens-studio/sd-transforms`, `eslint-plugin-lit` are absent).
   - Ran `npx storybook dev -p 6006 --no-open` directly instead; themes were already built, so it came up in ~8s.
     **The skill has no fallback for "the dev server won't start".** Stage 4 would simply have been impossible.
5. **Stale `build:locales` output polluted the working tree.** The failed `yarn start` regenerated five `packages/locales/src/*.ts` files unformatted (595 insertions). Caught by step 19's stray-artifact check and reverted with `git checkout --`. **A run that skipped step 19 would have left ~600 lines of unrelated churn in the tree.**
6. **The child has no story, so Stage 5's "spawn for each component" is ambiguous.** I spawned the author once (root only) and said so.
7. **The two reviewers disagreed on severity for the same defect.** The ~11.5px content-axis offset is `[CRITICAL] #3` in the form review and `[MINOR] #4` in the page review. Step 18 auto-routes `[CRITICAL]` only. I treated it as critical (both agreed on cause and fix) — but the skill gives no tie-break rule.
8. **Where to route a defect the reviewer attributes to a _different_ component's file.** The form reviewer's `[CRITICAL]` was explicitly "not in this file — fix belongs in the parent". The skill says route back to "the responsible implementer", which required me to re-attribute.
9. **No re-validation budget after Stage 6.** Step 18 says "re-validate (loop, capped at a sensible number)" — "sensible" is undefined, and it's unclear whether this shares Stage 4's 3-iteration cap. I ran one confirmation pass.

### 3b. The decomposer's 10 open questions + the default I chose (step 6)

| #   | Question                                                                          | Default chosen                                                                                                                                                                                                                                         |
| --- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Wordmark + hero photo assets don't exist — export from Figma, or placeholder?     | **Placeholder + TODO.** No Stage-3 agent has Figma tools; stock-photo licensing unresolved. Wordmark → text "sanna" in brand purple; hero → token-coloured block with the design's 24px radius; both carry TODOs naming nodes `71:13361` / `71:13362`. |
| 2   | Footer links: `<sl-button fill="link">` (Code Connect) or `<a href>` (semantics)? | **Follow Code Connect.** The CC map is the pipeline's authority. Semantics concern carried to the report.                                                                                                                                              |
| 3   | Promote the footer to its own component?                                          | **No.** Four stateless links used once → a `<ul>` in the root.                                                                                                                                                                                         |
| 4   | Five unbound spacing values — snap, hardcode, or request tokens?                  | **Snap where a token matches exactly, else raw px + TODO.** _(This default was right and the implementers applied it wrongly — see §7.)_                                                                                                               |
| 5   | Headline purple: palette or semantic token?                                       | **Semantic** `--sl-color-foreground-primary-bold` (same `#32005a`, themes correctly).                                                                                                                                                                  |
| 6   | Frame radius bound to `size/icon/font/xs` (12px) — authoring slip?                | Moot under #7 — no outer radius is rendered.                                                                                                                                                                                                           |
| 7   | Is the whole screen a floating card, or Figma presentation?                       | **Figma presentation.** 1512 × 982 + drop shadow on a neutral backdrop = how Figma shows a full screen. Root renders edge-to-edge, `layout: 'fullscreen'`.                                                                                             |
| 8   | Locations fetched or hardcoded? "Select location" vs "country level"?             | **Fetched** (root-owned mock + fetch comment). Both strings rendered **verbatim**; the mismatch is a design question, reported not silently harmonized.                                                                                                |
| 9   | `required` select? Pending/loading state?                                         | **`required` yes; no loading state** — nothing in the design shows one, and inventing it adds unvalidatable API.                                                                                                                                       |
| 10  | Responsive behaviour below 1512px?                                                | **Desktop-only, single breakpoint.** One frame, no layout-grid annotation. Recorded as a conscious limitation.                                                                                                                                         |

---

## 4. Wall clock

**≈ 75 minutes** (18:58:24 → 20:13:35). Dominated by Stage 4: three validator passes at ~5½, ~9 and ~5½ min plus three fix rounds. Stage 6's two reviewers ran ~6 and ~8 min in parallel.

---

## 5. Artifacts

**Run folder: `.implement-design/sanna-ready-for-development-2/`** (not `control-a9-…` — see gap 1)

```
screenshot.png              457 KB  cached Figma reference, 1024×715
manifest.md                  12 KB  manifest + decomposition + the 10 Q&A defaults
figma-metadata.json         2.8 KB
figma-code-connect-map.json 2.3 KB
figma-design-context.md     9.8 KB  (analyst noted the tool truncated at its 25k-token
                                     limit inside an unrelated WGSL shader blob)
figma-variable-defs.json    1.7 KB
testing/                    15 PNGs across 4 validator passes
```

All four raw Figma call outputs were written as specified. Nothing landed outside the run folder and the generated component path.

---

## 6. Components created, verdicts, tests

### Paths

```
examples/lit/src/_runs/control-a9-sanna-login-r1/
├── sanna-login-page.ts / .css / .stories.ts      <sl-sanna-login-page>  (root, globally registered)
└── login-form/
    └── sanna-login-form.ts / .css                <sl-sanna-login-form>  (scoped child, no story)
```

Story id: **`examples-sanna-login-page--basic`** · 5 stories (Basic, CustomModel, NoPreselection, CustomBrandSlot, CustomHeroSlot).

### Validator verdicts

| Pass             | Verdict      | Findings                                                                                                                                                                                                                                                |
| ---------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| r1               | `NEEDS_WORK` | Brand font never loads (`--sl-text-new-*-fontFamily` → `'Open Sans'`, no `@font-face` → browser serif); headline doesn't wrap; select 135.6px vs ~375px; `content-box` + `100vh` + padding = 1030px tall, footer off-screen; story didn't pin its theme |
| r2               | `NEEDS_WORK` | All 5 resolved. New: wrong background token (`--sl-color-background-subtle` → translucent `#edebe8`, not `#fbfaf7`); content block 76px too low; hero inset/size; wordmark offset                                                                       |
| r3               | `NEEDS_WORK` | All resolved. New: content axis 11.5px left; footer 8.5px low; footer no inset. **Cap reached → handoff note**                                                                                                                                          |
| r4 (post-review) | **`MATCH`**  | All five re-checks confirmed; no regressions                                                                                                                                                                                                            |

The r2 pass settled a **measurement-scale dispute**: the reference PNG's _card_ is the 1512 × 982 frame (scale ≈1.541), not the whole 1024px image (≈1.477). The implementer was right; every earlier width measurement had been skewed.

### Tests

**None — correctly.** Output is an example path inside the private `examples/lit` package, so Stage 5 scoped to the story and skipped Vitest/docs/changeset/i18n-extraction, matching the neighbours. The only automated gate was `tsc` (clean for all five generated files; the two `grid.ts` errors are pre-existing).

### [CRITICAL] items found and auto-fixed (step 18)

1. Footer row left-flush — design **centres** it (`justify-content: center`)
2. Footer bottom inset measured to the wrong node edge: 35px → **43.5px**
3. **Four `/* TODO: no token */` markers were factually false** — exact tokens exist: `gap: 32px`→`--sl-size-400`, `inset-inline-start: 40px`→`--sl-size-500`, `gap: 40px`→`--sl-size-500`, `margin-block-start: 80px`→`--sl-size-1000`
4. Content axis at column midpoint (366) not the design's 377.5 — fixed in the **parent** (`box-sizing: border-box; padding-inline-start: 23px`)

Plus two metadata-sourced corrections taken opportunistically: `max-inline-size` 480→**464px**, `inline-size` 376→**375px**.

### [MINOR] punch list (suggest as PR comments)

**`sanna-login-page.*`**

- Footer `<sl-button>`s have no `href`/handler — in the tab order, do nothing. Semantically `<a>`. (Recorded Q2 trade-off.)
- `FooterLink.href` and `.id` are both dead fields — no `repeat()` key, no dispatch.
- `list-style: none` strips list semantics in Safari/VoiceOver, defeating the `aria-label`. Add `role="list"`.
- `#onSignIn` re-emits without `stopPropagation()`; `EventEmitter` is `bubbles/composed`, so hosts see _both_ `sl-sanna-sign-in` and `sl-sanna-login-submit`. The private child also registers its event in the global `GlobalEventHandlersEventMap`.
- Story has no `argTypes`/`args` for `model`; `StoryObj` drops its props generic.
- Title `Examples/Sanna login page` — siblings use `Runs/<run>/<component>`; an earlier run already sits at `Examples/Login page`.
- `.hero-placeholder` uses a **foreground** token as a background; `--sl-color-background-primary-bold` is the role-correct same-hex choice.
- Hero-radius TODO is over-broad — no _borderRadius_ token is 24px, but `--sl-size-300` is.
- `event` parameter shadows the imported `event` decorator.
- `@state() private _fetchedModel` — never mutated, `_` prefix unused elsewhere in SLDS; the decomposition named it `MOCK_LOGIN_MODEL`.
- `CustomHeroSlot` story uses `alt="Example hero photo"` while the manifest declares the hero decorative (`alt=""`).

**`login-form/sanna-login-form.*`**

- **Enter from the select cannot submit.** `sl-form` isn't a native `<form>`; `sl-select` consumes Enter for its own popup. The spec line should be retired or fixed upstream in `sl-select`/`sl-form`. Keyboard operability is fine via Tab → Sign in.
- `heading` / `subheading` slots are **unreachable API** — the page renders the child in its own shadow template and never forwards them, so `::slotted(h1)`/`::slotted(p)` are dead rules.
- `--sl-brand-text-new-heading-*-fontFamily` reaches past the semantic layer. Correct workaround, but **file a theme bug**: `--sl-text-new-heading-{2xl,md,lg}-fontFamily` resolve to `'Open Sans'`, which has no `@font-face` in any theme.
- `sl-button { inline-size: 100% }` is probably redundant given `sl-form`'s default `align-items: stretch`.
- Literal placeholder text `"Placeholder"` ships as visible copy in the `NoPreselection` story.
- No story exercises the `required`-empty validation path — a `play` clicking Sign in would cover the `reportValidity` → no-emit branch.

**Both** — property declarations aren't alphabetical (`order/properties-alphabetical-order`). Doesn't fail CI: `yarn lint` globs only `packages/components/**`, and `examples/lit/src/_runs/` is gitignored.

**Manifest** — `manifest.md` lines 98/122 carry the stale `<sl-select-option>` name (removed; it's `<sl-option>`). Worth correcting so the next run doesn't inherit it.

### Unresolved handoff note

Stage 4 hit its cap at r3 with three open gaps. **All three were then diagnosed and fixed via Stage 6**, and r4 confirmed `MATCH`. The only genuinely unresolved item is the **wordmark placeholder's aspect ratio** (77 × 32 built vs 107 × 19.45 design) — unfixable without the real logotype asset; it resolves when the asset is exported.

---

## 7. What surprised me

1. **The pipeline's own guidance produced four false "no token exists" claims — and the reviewers caught what three validator passes missed.** The manifest faithfully recorded "unbound in Figma" for 40px/80px/32px, and two implementers independently read that as "no SLDS token exists" and hardcoded. But `--sl-size-500`=40px, `--sl-size-1000`=80px and `--sl-size-400`=32px exist **in all 16 themes**. _Unbound in the design file_ ≠ _no token in the system_, and nothing in the skill draws that distinction. The visual validator can't catch it (the pixels are identical); only the source-reading reviewer can.

2. **Stage 4's 3-iteration cap fired one round early.** Each pass found _real, different_ defects — the loop was converging, not thrashing. The cap is a thrash-guard, but it triggered on honest progress, and Stage 6 then did the Stage-4 job. A convergence-based exit (are findings shrinking?) would have served better than a fixed count.

3. **Each validator pass got sharper by changing its measurement method, unprompted.** r1 eyeballed; r2 pixel-scanned the raster and overturned the scale; r3 switched to `figma-metadata.json` for exact node geometry and overturned r2's conclusions. **The ground truth the skill names — `screenshot.png` — is the _least_ precise source in the run folder**, yet the skill never points the validator at `figma-metadata.json`. I had to tell it in r3.

4. **The r1 validator validated the wrong thing and caught itself.** It first rendered under Storybook's default `sanoma-learning` theme — blue `#1727b6`, not the design's purple — then re-ran with the right global and reported the mis-run as finding #5. The skill never mentions theme globals; nothing would have flagged a whole pass judged against the wrong brand.

5. **The decomposition shipped an element that no longer exists.** It specified `<sl-select-option>`, removed from the repo (`CHANGELOG`: "use `<sl-option>`"). The implementer caught it by reading the changelog. The stale name is still in `manifest.md`.

6. **A spec line that is impossible to satisfy stayed in the spec.** "Enter from the select submits" can't be done with the current `sl-select`/`sl-form` API. The implementer correctly declined rather than hand-rolling keydown wiring — but nothing in the pipeline retires such a line, so it would propagate to the next run.

7. **The two reviewers contradicted each other on severity** for the same defect (critical vs minor), and one attributed its `[CRITICAL]` to a file outside its own review scope. Both judgements were right; the skill has no mechanism for either case.

8. **Step 19's stray-artifact check earned its place.** A failed `yarn start` had silently rewritten five `packages/locales/src/*.ts` (~600 lines). Nothing else in the pipeline would have noticed.

9. **The skill assumes `yarn start` works.** Three independent environment failures stood between me and a running Storybook. With no documented fallback, Stage 4 — the pipeline's whole validation value — would simply have been skipped.

10. **The child's quality is invisible to validation.** `<sl-sanna-login-form>` has no story by design, so it's only ever seen through the parent. Its unreachable slots and dead `::slotted` rules were found by _reading_ it, not rendering it.
