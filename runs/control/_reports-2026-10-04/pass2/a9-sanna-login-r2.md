# Control run — A9 SANNA Login 1, pass 2 (r2)

- **Skill**: `implement-design:implement-design` (invoked via the Skill tool; I acted as its coordinator)
- **Figma**: `https://www.figma.com/design/Mzc8BuOvMxOJGAQtv0h64M/SANNA-Ready-for-Development?node-id=71-13345`
- **Start**: Sun Oct 4 2026 20:16:20 CEST
- **End**: Sun Oct 4 2026 22:20 CEST
- **Wall clock**: ~2 h 04 min
- **Nothing committed.** No `git add`, no `git commit`, no PR.

---

## 1. Stage reached

**All six stages completed. The pipeline did not halt.**

| Stage                | Agent                                                 | Outcome                                                                 |
| -------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------- |
| 0 Setup              | —                                                     | Pre-answered; asked nothing extra                                       |
| 1 Ingestion          | `design-analyst`                                      | Manifest returned. No `BLOCKED_ON_CODE_CONNECT`, no `BLOCKED_ON_MCP`    |
| 2 Decomposition      | `component-decomposer`                                | 3-component tree + contracts + **10 open questions**                    |
| 3 Implementation     | `component-implementer` ×3 (2 leaves parallel → root) | All 3 written                                                           |
| Gate                 | orchestrator                                          | `tsc`: **0 in-scope errors**, 2 pre-existing baseline errors (see §7)   |
| 4 Validation         | `visual-validator` ×3                                 | iter1 `NEEDS_WORK` → iter2 `MATCH` → (post-Stage-6 fixes) iter3 `MATCH` |
| 5 Tests/stories/docs | `component-author` ×3                                 | Root: 3 new variant stories. Both leaves: deliberate no-op              |
| 6 Review             | `component-reviewer` ×3                               | 4 [CRITICAL] + 19 [MINOR]; all CRITICALs fixed and re-validated         |

**One hard stop occurred mid-Stage-4 and was resolved in-protocol** (routed back to the implementer, as step 11/14 prescribe) rather than ending the run:

```
Error: Duplicate stories with id: examples-sanna-login-page--basic
  at _StoryIndexGenerator.chooseDuplicate
■  Error: Unable to index
▲  Broken build, fix the error above.
└  Storybook exited with an error
```

`.storybook/main.ts` globs `../examples/**/*.stories.ts`, so **every** run folder under `examples/lit/src/_runs/` is indexed into one Storybook. Pass 1's leftover `control-a9-sanna-login-r1/sanna-login-page.stories.ts` uses `title: 'Examples/Sanna login page'`; this run's implementer picked `'Examples/SANNA Login Page'`. Both normalize to `examples-sanna-login-page`, and Storybook refuses to boot at all. Fixed by giving this run's story a run-unique title suffix; final id `examples-sanna-login-page-control-a9-sanna-login-r2--basic`.

---

## 2. Did Stage 0 ask anything beyond the four answers?

**No.** The four supplied answers (MCP server, framework, i18n, output location) covered every question the skill's Stage 0 enumerates, and the pipeline ran standalone from there. The skill's promise — all user input up front, then autonomous to the end — held _for the questions it knows to ask_. It is everything in §3 that it doesn't ask about.

---

## 3. Everything I had to decide that the four answers did not cover

### 3a. The decomposer's 10 open questions (skill step 6: "pick a sensible default, record both")

| #   | Question                                                                                  | Default I chose                                                                                                                                                               |
| --- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Logo + hero: components or assets? Where do the files live (Figma URLs expire in 7 days)? | Assets, not components. Implementer `curl`s both into `…/assets/`, references via `new URL(…, import.meta.url)`; tokenized placeholder + report if a download fails           |
| 2   | Is `<sl-login-footer-links>` worth being a component?                                     | Keep it — 3 components                                                                                                                                                        |
| 3   | Footer links: `sl-button fill="link"` + event, or real `<a>`?                             | Follow Code Connect (`sl-button`), event-based navigation                                                                                                                     |
| 4   | Real legal hrefs? Drop the placeholder "Other link"?                                      | Keep all four labels verbatim; stable ids, no `href`                                                                                                                          |
| 5   | Location source + value shape; preselected or placeholder?                                | Mock in the page with a fetch comment; `id` = ISO-3166 alpha-2; preselected on Belgium as drawn; placeholder text `Select location` (Figma's literal `Placeholder` is filler) |
| 6   | Token gaps (12px radius mis-binding, 24px hero radius, 80/40/32px gaps, shadow stack)     | Nearest semantic token + report the delta; card radius → `borderRadius-default`; the unbound shadow reproduced literally with a flagging comment                              |
| 7   | Keep `logo` / `hero` slots?                                                               | Drop them, inline both `<img>`s (conventions reserve slots for arbitrary consumer content)                                                                                    |
| 8   | Root tag `sl-sanna-login-page` vs `sl-login-page`?                                        | Keep `sl-sanna-login-page`                                                                                                                                                    |
| 9   | Behavior below 1512px?                                                                    | 1512 is the only contract; graceful stack below 1024px, un-validated                                                                                                          |
| 10  | Hidden node `71:13346` not rendered?                                                      | Confirmed, not rendered                                                                                                                                                       |

### 3b. Decisions the skill itself left to me — these are the real gaps

1. **Target-path resolution is ambiguous.** Step 9 says resolve from the output location + "root component's tag minus `sl-`, kebab-cased, as the folder". The user already supplied a run-named folder, so does the root land in `…/control-a9-sanna-login-r2/` or `…/control-a9-sanna-login-r2/sanna-login-page/`? I chose the former (matching the decomposer's `<parent-base>` reading). Nothing in the skill disambiguates when the supplied output location already names the unit.
2. **Leaf stories contradict the conventions.** Step 10 tells _every_ implementer to write "a basic Storybook story"; `component-conventions.md` says a scoped child "must NOT register itself", and step 13 says to validate only the page. A story renders a tag, which needs a global define. I instructed the leaves to write no story. The skill never reconciles these.
3. **No asset-acquisition stage exists.** The design's logo and hero are images with no Code Connect mapping. No stage downloads them, no agent is told to, and the Figma MCP asset URLs expire in ~7 days. I had to invent the step, pick the destination (`…/assets/`), pick the referencing idiom, and specify the failure fallback.
4. **The Stage 3 type-check gate is unsatisfiable as written.** It demands `tsc` exit 0. This repo has 2 pre-existing errors in an untouched file. The skill gives no baseline-tolerance rule, so I had to invent "0 errors in the run tree, baseline errors in unmodified files tolerated" and let the run proceed.
5. **Story titles are not namespaced per run, and that is fatal.** See §1. The skill tells the implementer to "pick the category from a neighbor", which guarantees a collision between two runs of the same design in a shared Storybook. I had to invent the run-unique title convention.
6. **Breakpoints are never defined.** Step 13 says to pass "the breakpoints" to the validator; nothing says where they come from. I derived 1512 from the manifest's Responsive Breakpoints section and told the validator explicitly not to score the un-designed narrow layout.
7. **Which components get a Stage 4 validator.** Step 13 says "the page/root (and any component that's independently meaningful)". I judged both leaves as not independently meaningful (and they have no story anyway) — a judgement call with no criterion given.
8. **Which components get a Stage 5 author, when the example scope reduces to "enrich the story" and two of them have no story.** I spawned all three and let the leaf authors decide; both correctly reported a no-op. The skill offers no guidance for the empty case.
9. **Stage 6's [CRITICAL] loop has no cap or re-validation rule.** Step 18 says "loop, capped at a sensible number" and "re-validate". I chose one fix round plus one confirmation validator pass (reusing the Stage 4 cap of 3).
10. **How to restart dependency-ordered work when an agent's transcript is gone.** Routing the root page's CRITICALs back failed with `No transcript found for agent ID` — I had to spawn a fresh `component-implementer` and re-supply all the settled context by hand. The skill assumes implementers stay resumable.
11. **How much settled context to re-inject on every route-back.** Nothing in the skill says reviewers must be told which deltas are already accepted. Without that, the Stage 6 reviewers would have re-litigated the token gaps, i18n-off, and the missing `package.json`/spec/docs as defects.
12. **Mock-data content.** The skill demands the story render the design with no args, but the design has one select showing "Belgium". I had to invent the other six countries, their id scheme, and the fetch-comment wording.
13. **The dev-server command and its failure mode.** Step 12 says "Lit: `yarn start` Storybook" and nothing about what to do when it fails, how to detect readiness, which port, or how to shut it down afterwards. Step 19's clean-tree check does not mention killing the server.
14. **Whether a reviewer's [CRITICAL] in file A caused by file B gets routed to one implementer or two.** The data-loss bug was raised independently by two reviewers against two files; I split it and fixed both halves in parallel, with explicit "don't touch the other folder" fencing the skill does not provide.

---

## 4. Wall clock

**~2 h 04 min** (20:16:20 → ~22:20 CEST, 2026-10-04). Agent time only, summed from the notifications: analyst 3.6 min; decomposer 3.0; implementers 3.8 + 8.3 + 5.7; validators 3.3 + 3.4 + 1.9; authors 2.7 + 1.2 + 0.8; reviewers 5.3 + 4.4 + 2.5; fix implementers 1.6 + 1.1. The rest is coordinator overhead and two Storybook boots (~4 min each).

---

## 5. Artifacts

**Run folder used: `.implement-design/sanna-ready-for-development-3/`** — derived by kebab-casing the Figma file name (`SANNA-Ready-for-Development` → `sanna-ready-for-development`) and taking the smallest free suffix; `-1` and `-2` already existed. `.implement-design` was already in `.gitignore`.

```
.implement-design/sanna-ready-for-development-3/
├── screenshot.png                 457 KB   cached Figma reference (1024×715)
├── manifest.md                     11 KB   design manifest + decomposition + the 10 OQs and my defaults
├── figma-metadata.json            2.7 KB
├── figma-code-connect-map.json    2.3 KB
├── figma-design-context.md         10 KB   (analyst noted an MCP 25k-token truncation of an
│                                            unrelated shader-runtime block; the component JSX
│                                            was captured intact before the cutoff)
├── figma-variable-defs.json       1.7 KB
└── testing/
    ├── sanna-login-page-1512.png            iter1 (the broken hero crop)
    ├── sanna-login-page-1512-iter2.png      iter2 MATCH
    ├── sanna-login-page-hero-edge-iter2.png
    ├── sanna-login-page-1512-iter3.png      iter3 MATCH (post-CRITICAL-fix)
    └── sanna-login-page-hero-iter3.png
```

Every agent respected the folder: no scratch screenshots at the repo root.

---

## 6. Results

### Components created

```
examples/lit/src/_runs/control-a9-sanna-login-r2/
├── sanna-login-page.ts          <sl-sanna-login-page>  root, data owner, globally defined (guarded)
├── sanna-login-page.css
├── sanna-login-page.stories.ts  4 stories
├── assets/logo-wordmark.svg     downloaded from Figma (107×19.45)
├── assets/hero.png              downloaded from Figma (1024×572)
├── login-form/login-form.ts     <sl-login-form>  scoped child, owns <sl-form> + submit
├── login-form/login-form.css
├── login-footer-links/login-footer-links.ts   <sl-login-footer-links>  scoped child
└── login-footer-links/login-footer-links.css
```

Story ids: `examples-sanna-login-page-control-a9-sanna-login-r2--{basic,signing-in,custom-model,no-preselection}`.

### Validator verdicts

| Iter | Verdict        | Finding                                                                                                                                                                                                                                                                                                      |
| ---- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1    | **NEEDS_WORK** | Hero crop: `object-fit: cover` with default centred `object-position` cropped the raised hand almost entirely out of the 745×924 box (source asset is 1024×572 landscape with the hand in its right ~38%). Figma's own image-fill transform applies a right-biased crop that centre-`cover` cannot reproduce |
| 2    | **MATCH**      | Implementer replaced `object-fit` with an `overflow: hidden` wrapper + scaled/positioned `<img>` (the needed zoom exceeds what `object-fit` can express). Full measured table, 24 rows, all ✓                                                                                                                |
| 3    | **MATCH**      | Post-CRITICAL-fix regression check: `signing-in` now actually disables the submit button; selecting "FR" then forcing a re-render no longer resets to "BE"; form column still exactly 375px after the child stopped setting its own width                                                                    |

### Test results

**No tests were written — correctly.** The output location is an example inside the private `examples/lit` package, so the conventions scope Stage 5 to story enrichment and skip the Vitest spec, website docs, changeset and i18n extraction. The substitute gate was the type-check: `npx tsc -p examples/lit/tsconfig.json --noEmit` → **0 errors in the run tree**, 2 pre-existing baseline errors in `packages/components/grid/src/grid.ts:1180,1361` (`Type 'number' is not assignable to type 'Timeout'`) in a file `git status` confirms untouched.

Three reviewers independently reported that **lint could not run at all** in this checkout: `npx eslint` → `Cannot find package 'eslint-plugin-lit'`; `npx stylelint` → `Could not find "stylelint-config-standard"`; `npx prettier` cannot parse the `with { type: 'css' }` import attribute at the root version. The lint gate on all three components is therefore unverified.

### [CRITICAL] punch list — all four fixed, then re-validated

1. **`signingIn` observed `signingin`, not `signing-in`** (`sanna-login-page.ts:98`). Lit's `__attributeNameForProperty` lowercases, it does not dasherize, so the story's `?signing-in=` binding hit an unobserved attribute and the `SigningIn` story rendered byte-identical to `Basic`. Fixed with `attribute: 'signing-in'`.
2. **Fresh object literals reset the user's selection on any re-render** (`sanna-login-page.ts:121-122`). `.model=${{…}}` / `.value=${{…}}` allocate per `render()`; Lit's default `hasChanged` is `!==`, so the child re-seeded its `FormController` every time. Latent only because #1 kept `signingIn` inert — fixing #1 turned it into data loss mid-submit. Fixed by deriving both objects once per `model` change in `willUpdate` and binding stable refs.
3. **Same bug, child half** (`login-form.ts:103-105`): `changes.has('value')` fires on reference change. Fixed with a content comparison on `.location`.
4. **Child hard-coded its own 375px width** (`login-form.css:13`), duplicating the page's and defeating the page's deliberate `max-inline-size` relaxation below 1024px. Fixed by deleting the declaration; the page is now the single owner.

### [MINOR] punch list — 19 items, suggested as PR comments

**`<sl-sanna-login-page>`**

1. `reflect: true` on `signingIn` has no consumer — no `:host([signing-in])` rule exists; either add it or drop the claim from the story docstring.
2. `:host { overflow: hidden }` (`css:19`) clips with no escape on short viewports — at 1440×900 the hero's bottom edge (953px) is cut off and nothing scrolls. Redundant anyway: `.hero` has its own `overflow: hidden` and the host `border-radius` already clips.
3. Mixed brand/non-brand token namespaces in one rule (`css:135-139`, `145-149`): `font-family` from `--sl-brand-text-new-heading-*`, `font-size`/`line-height` from non-brand `--sl-text-new-*`. Pick one. Root cause is a **theme bug** — `teacher-assistant`'s `--sl-text-new-heading-2xl-fontFamily` resolves to `'Open Sans'`, which has no `@font-face` in that theme's `fonts.css`. Worth a ticket against the theme, not a per-component workaround.
4. `@default` on `model` (`ts:93`) is prose, not a value; conventions ask for `@default <value>`.
5. `Let´s` uses U+00B4 ACUTE ACCENT — faithful to Figma, but someone should decide whether to carry the design's typo forward or file it back.
6. No assistive feedback for the pending state — consider `aria-busy` or a polite live region.
7. CSS declaration order isn't alphabetical in several blocks (`css:30`, `:141`, `:151`, `:205`) — unverifiable while stylelint can't boot.
8. `assets/hero.png` is 500 KB, and simultaneously oversized in bytes and undersized in pixels (1024×572 upscaled ~1.9× into a 745×924 box).
9. Story meta has no `args` defaults, so the `model` object control opens empty — add `description` text to both `argTypes` entries.

**`<sl-login-form>`** 10. `?disabled` on the submit button drops focus and announces nothing while pending. `Button` supports the softer form (`#onClick` bails on `ariaDisabled === 'true'`, and `ForwardAriaMixin` forwards host `aria-*`), so `aria-disabled` keeps it focusable. Also: the `<sl-select>` stays interactive mid-submit. 11. `model!` (`ts:89`) is contradicted by `this.model?.locations ?? []` (`ts:109`) — pick one. 12. `value`'s JSDoc says "initial value" but `updated()` re-applies it — it is a controlled seed. 13. `sl-button { inline-size: 100% }` is redundant; the file's own comment explains why (`<sl-form>` is a stretch column). 14. Label and placeholder are the same string, so the empty state announces "Select location, Select location". 15. `<sl-select>` sets its label via `ariaLabelledByElements`, which axe can't follow — `select.stories.ts:71-86` disables `aria-input-field-name` for exactly this. `sanna-login-page.stories.ts` has no equivalent exclusion, so the a11y addon will likely fire that known false positive.

**`<sl-login-footer-links>`** 16. `href?: string` is dead API — nothing reads it and `sl-button` has no `href`. Delete it or document it as reserved. 17. `<ul>` with `list-style: none` loses list semantics in Safari/VoiceOver — add `role="list"` (in-repo precedent: `a8-nsp-group-list/group-list-page.ts:232`, `calendar/src/select-day.ts:352`). 18. Redundant flex layer: `nav { display: flex; justify-content: center }` wrapping `ul { display: flex }` — move `justify-content` onto the `ul` and delete the `nav` rule. Also no `flex-wrap`, so the row overflows below ~665px. 19. `@default DEFAULT_LEGAL_LINKS` points at a non-exported constant, and the default is a **shared mutable array** — `el.links.push(…)` on one instance mutates it for every instance. Export it and/or type the property `readonly`.

Plus the settled-by-decision a11y trade-off, recorded so it survives into the PR: the footer links are buttons, not anchors, so screen readers announce "button" and there is no middle-click / open-in-new-tab / copy-link-address.

### Unresolved handoff notes

None from the validator — Stage 4 converged inside the cap both times. The standing items are the [MINOR] list, the un-runnable lint gate, and the token gaps recorded in §7.

### Token gaps reported by the agents

- The `"Large"` 5-stop `#3E5598` elevation has no `--sl-elevation-*` token (the scale only has `overflow`/`overlay`/`sm`); reproduced literally in CSS with a flagging comment.
- Card radius 8px vs. the design's 12px — Figma binds the radius to `size/icon/font/xs`, an icon-font-size token, which looks like a mis-binding.
- Hero radius 12px vs. 24px — the `borderRadius` scale tops out at `xl`.
- Footer link gap 24px vs. 32px — no token at 32.
- **No `background/canvas` token exists** in any theme; `--sl-elevation-surface-base-default` resolves to the identical `#fbfaf7`.
- `--sl-brand-text-new-heading-*-fontFamily` used because the non-brand family resolves to an unloaded font (see MINOR #3).
- Page-level offsets with no backing token: wordmark top 41, hero top 29 / right 35, content column left 147 / width 461 / `calc(50% - 8px)`, form column 375, footer width 732 / bottom 35.
- One implementer flagged that the **bare `--sl-text-new-*` `font:` shorthand custom properties are not declared in any `theme.css`** — only the `-fontFamily`/`-fontSize`/`-fontWeight`/`-lineHeight` longhands exist — and that `tag.css`, `emoji-browser.css` and `progress-bar.css` reference the bare shorthand with no fallback, which is dead CSS. Not touched; flagged.

---

## 7. What surprised me

1. **A leftover sibling run can take the entire Storybook down.** Not "a duplicate story is shadowed" — the index generator throws and `storybook dev` exits. Two runs of the same design under `examples/` are mutually exclusive until someone renames one. This is the single most consequential gap: the skill's own output location makes the shared Storybook glob a global namespace, but it namespaces nothing and warns about nothing.

2. **The hard gate is literally unsatisfiable in this repo.** "Type-check is clean (`tsc` exit 0)" cannot be met while two pre-existing errors sit in `packages/components/grid`. Taken literally the pipeline can never enter Stage 4 here. Every implementer independently discovered the same two errors and independently decided to call them baseline — the skill made three agents each invent the same tolerance rule.

3. **Stage 4's `yarn start` dirtied five tracked files that have nothing to do with this run.** The first `yarn start` failed, but not before its `build:locales` dependency ran `lit-localize build` and left `packages/locales/src/{es-ES,it,locale-codes,nl,pl}.ts` reformatted — because the `eslint --fix && oxfmt` half of that script crashed on a missing dependency. i18n was **off** for this run. Step 19's clean-tree check caught it (595 insertions / 565 deletions) and I reverted, but the skill presents `yarn start` as inert setup when it is actually a write-side build step.

4. **Two agents independently found the same bug from opposite ends and proposed complementary fixes.** The root reviewer blamed the parent's object literals; the form reviewer blamed the child's reference-equality guard. Both were right; neither fix alone is sufficient for every binding style. The skill has no notion of a cross-component defect, and had I routed only one of them the bug would have survived.

5. **The latent-bug chain is something I did not expect a reviewer to catch.** CRITICAL 1 (`signingin` vs `signing-in`) was _masking_ CRITICAL 2 (data loss on re-render): the attribute bug kept `signingIn` inert, so the re-render that destroys the user's selection never fired. Fixing only #1 would have introduced a data-loss bug that was invisible before. The reviewer spelled out the dependency; nothing in the skill asks for that kind of analysis.

6. **Both leaf authors refused to do Stage 5 and were right to.** Each independently reasoned that a scoped, non-globally-registered child cannot have a story without violating the conventions, surveyed five structurally identical neighbours under `_runs/` to confirm none has one, and reported a no-op. Step 15 says to spawn an author per component; for two of three the correct output was nothing. A skill that says "typically just enrich the story" has no answer for "there is no story and there must not be one".

7. **The step 6 ↔ step 10 contradiction about stories is real and unflagged.** Step 10 tells every implementer to write a basic story; the conventions forbid the children from registering; step 13 only validates the page. Three documents, three incompatible positions, no reconciliation.

8. **`get_design_context` hit the MCP server's 25k-token response limit** — on an auto-attached WGSL shader-runtime boilerplate file unrelated to this node. The analyst recognized it and confirmed the component JSX was complete before the cutoff. A less careful analyst would have reported a truncated design.

9. **The asset problem is invisible until it bites.** Two of the design's most visually dominant elements are images with no Code Connect mapping, the manifest correctly classifies them as "not components", and then the pipeline simply has nowhere to put them. I had to invent the entire acquisition step — and the Figma MCP asset URLs expire in ~7 days, so the run folder's cached context is _not_ sufficient to re-run this design next week.

10. **An agent transcript vanished mid-run.** Routing Stage 6's CRITICALs back to the root implementer failed with `No transcript found for agent ID`. The skill's routing model assumes implementers remain resumable across the whole pipeline; I had to spawn a fresh one and manually re-supply every settled decision to stop it re-opening them.

11. **Reviewers will re-litigate everything unless told not to.** The settled-decisions block I had to write for each reviewer (i18n off, example-not-package, accepted token deltas, scoped children, the run-unique title) was roughly a third of each prompt. Without it, the Stage 6 output would have been dominated by re-raised non-issues — and step 18 would have auto-routed them back to implementers.

12. **One reviewer surfaced a genuine theme-layer defect** that is nobody's component bug: `teacher-assistant`'s `--sl-text-new-heading-2xl-fontFamily` points at `'Open Sans'`, which that theme never `@font-face`s. Every future component built on this theme will rediscover it and work around it locally. Worth a ticket.

---

## Environment notes (separated from skill findings)

- **No port conflict.** Port 6006 was free at run start and the run held it alone. Shut down at the end.
- **`yarn start` cannot run in this shell without `FONT_AWESOME_AUTH_TOKEN`** — `.yarnrc.yml:21` interpolates it for the `@fortawesome` registry and yarn aborts with `Environment variable not found` before any script runs. It is not in the user's profile. Setting a dummy value got yarn past the check (node_modules is already installed).
- **`yarn start` then failed on an incomplete install**: its `build:locales:code` dependency runs `lit-localize build && eslint --fix …`, and `eslint-plugin-lit` is genuinely absent from `node_modules`. I ran the underlying `storybook dev -p 6006 --no-open` directly instead (prebuilt locale and theme artifacts were already present). This is also what dirtied the locale files — see §7 item 3.
- **Lint is unrunnable in this checkout** (`eslint-plugin-lit`, `stylelint-config-standard` both missing; root `prettier` can't parse `with { type: 'css' }`). Reported independently by three reviewers.
- **Pre-existing conflicts from earlier runs under `examples/lit/src/_runs/`**: `sanna-login-1/login-form/login-form.ts` globally registers `sl-login-form` against a structurally different class and declares the tag in `HTMLElementTagNameMap`; `control-a9-sanna-login-r1/sanna-login-page.ts` declares `sl-sanna-login-page`. Both of this run's components had to omit their `HTMLElementTagNameMap` augmentations to compile. Harmless for scoped children; a blocker if either component is ever promoted to a published package.
- **Working tree verified clean at the end.** The only untracked entries (`agents.zip`, `agents/`, `analiza-agent-plugin.md`, `analiza-projektu.md`) were present before the run started. `debug-storybook.log` (written at the repo root by the failed Storybook boot) was removed; the locale-file edits were reverted. Note that `examples/lit/src/_runs/` is itself gitignored, so step 19's `git status` check would **not** have caught a stray file inside the generated tree.
