# Control run, pass 2 — B-SANNA Account creation

Unassisted execution of `/implement-design` (`implement-design:implement-design`), invoked via the Skill tool with the four Stage 0 answers supplied up front.

- **Start**: Sun Oct 4 23:22:51 CEST 2026
- **End**: Mon Oct 5 00:59:11 CEST 2026
- **Wall clock**: **96 min 20 s**
- Figma node: `174:232051` ("Account creation"), file `SANNA-Ready-for-Development`, 1512×982
- Run folder: `.implement-design/sanna-ready-for-development-5/`
- Output location: `examples/lit/src/_runs/control-b-sanna-account-r2/`

---

## 1. Stage reached + halt token/reason

**Ran to completion. No halt, no blocker.** All seven stages (0→6 + final report) executed.

- Stage 1 returned a manifest; **neither `BLOCKED_ON_CODE_CONNECT` nor `BLOCKED_ON_MCP`** fired. All Figma calls succeeded first attempt on the remote `figma` server.
- Stage 2 returned 3 new components → step 8 ("no new components, stop") did not apply.
- Stage 3 gate passed (see §3 for how the impossible literal gate was resolved).
- Stage 4 reached `MATCH` for both validated components, inside the 3-iteration cap.
- Stage 6 produced 2 `[CRITICAL]`, both auto-routed, fixed and re-validated to `MATCH`.

Exit state: `tsc` at the pre-existing 2-error baseline, Storybook index healthy (831 entries, 15 from this run), `git status` identical to the baseline.

---

## 2. Did Stage 0 ask anything extra?

**No.** The URL validated as a `figma.com/design/...` link and all four answers were supplied, so the single `AskUserQuestion` batch was correctly skipped. **Zero user interaction for the whole run** — exactly as the skill promises.

Worth noting: the skill's Stage 0 warns that `get_code_connect_map` is "unreliable" on the remote `figma` server. That warning was **accurate and consequential** — see §7.

---

## 3. Everything I decided that the four answers didn't cover

### 3a. Gate / environment resolutions (coordinator-owned)

| Decision                                                                  | Resolution                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`tsc` exit 0 is unachievable** (2 pre-existing `grid.ts` errors)        | Captured a **baseline before any agent ran** (exactly those 2 errors, nothing else), then read the Stage 3 gate as _"no new errors beyond baseline"_. This caught a genuine regression (§6) rather than rubber-stamping. Note the plugin is **self-contradictory** here: SKILL.md step 11 demands literal "tsc exit 0", while `implement-design-lit/SKILL.md` says "only fix the errors in **your** files — pre-existing ones elsewhere aren't yours." |
| **`yarn start` dies without `FONT_AWESOME_AUTH_TOKEN`** (confirmed unset) | A healthy SLDS Storybook was **already running on :6006**. Reused it instead of starting one. Step 12's "start the app once" became "verify the running app". Vite/Storybook picked up all 15 new stories with no restart.                                                                                                                                                                                                                             |
| **Duplicate story ids kill the shared index** (~23 sibling folders)       | Pre-emptively namespaced every story title to `Runs/Control B SANNA Account R2/…`. **This is the one hint I supplied that no agent asked for** — I judged story-id uniqueness to be coordinator-owned (step 19's "no stray artifacts" + the shared-index hazard). Result: 15 stories indexed, no collision, server stayed up all run.                                                                                                                  |
| **Stale-sibling `TS2717`**                                                | See §6 — a real occurrence, resolved by a coordinator ruling.                                                                                                                                                                                                                                                                                                                                                                                          |
| **Parallel validators fight over one Playwright browser**                 | Both Stage 4 validators (spawned in parallel per step 13) reported **mid-session URL hijacks** from each other. I switched all subsequent validation to **sequential**. Zero contention afterwards.                                                                                                                                                                                                                                                    |
| **Hung agents**                                                           | The two iteration-1 fix-up implementers finished their edits at 00:17 but never returned (~17 min silent, likely blocked on concurrent `tsc`). I **verified their four fixes on disk and ran the gate myself** rather than waiting indefinitely. Later `SendMessage` calls to the same agents worked fine.                                                                                                                                             |

### 3b. The decomposer's 16 open questions — the default I chose for each

| #   | Question                                                                                                                                  | Default chosen                                                                                                                                                                            |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `logo-wordmark` — make an `<sl-logo>`?                                                                                                    | **No new component.** Default content of the page's `logo` slot.                                                                                                                          |
| 2   | `Image login` — host-supplied? decorative?                                                                                                | **Host-supplied** via `asideImageSrc`, `aside` slot overrides; purely decorative (`alt=""`), no credit.                                                                                   |
| 3   | Heading colour: raw `#29076e` vs bound `color/palette/purple/900` (`#32005a`)                                                             | **Bound token wins.** No raw hex.                                                                                                                                                         |
| 4   | Sign-in row: raw `#222` vs `color/foreground/secondary/bold`                                                                              | **Bound token wins.**                                                                                                                                                                     |
| 5   | Unbound/suspicious values (`56/64/32/10px`, 24px radius, page radius bound to an _icon-size_ token, product-scoped `teacher-assistant/*`) | Nearest existing `--sl-*` by role; never raw hex, never a `var()` fallback. Treat the icon-size page radius as a Figma binding mistake. Avoid the product-scoped token. Report every gap. |
| 6   | Legal links: `<sl-button fill="link">` + event, or real `<a>`?                                                                            | **Follow the Code Connect map** — buttons + event. CC is the pipeline's ground truth.                                                                                                     |
| 7   | Consent boxes are all `checked` in the design                                                                                             | **Unchecked by default** (pre-ticked consent isn't valid consent); checked state covered by a story.                                                                                      |
| 8   | Are all three consents required? Continue disabled until valid?                                                                           | All three required; Continue **always enabled**, validation on submit.                                                                                                                    |
| 9   | Email placeholder reads "Enter your password"                                                                                             | **Reproduce verbatim.** The screenshot is ground truth and the pipeline must not invent content. Handoff note to the designer.                                                            |
| 10  | Footer link reads "Terms of User"                                                                                                         | **Reproduce verbatim**, same reasoning.                                                                                                                                                   |
| 11  | Does the root fetch, or is it `data`-driven?                                                                                              | Example scope: inline realistic mock + a comment marking where the fetch would go; submit bubbles to the host.                                                                            |
| 12  | Where does "Already have an account? Sign in" live?                                                                                       | **Inside the form**, so the root stays layout-only.                                                                                                                                       |
| 13  | Footer landmark semantics                                                                                                                 | Labelled `role="navigation"`; **not** `contentinfo` (host owns that).                                                                                                                     |
| 14  | Add a `role="alert"` region for server errors?                                                                                            | **No.** The design shows no error state; don't invent one.                                                                                                                                |
| 15  | Single 1512px breakpoint — what below ~1024px?                                                                                            | Aside hides, form column goes full-width. Validate at 1512px.                                                                                                                             |
| 16  | Hidden node `174:231461`                                                                                                                  | **Ignore it.** Hidden in the design = not rendered.                                                                                                                                       |

### 3c. Mid-run rulings the decomposer never raised

- **Event-name deconfliction** (§6): this run yields the generic `sl-legal-link-select` key and ships `sl-legal-links-bar-select`, because the file-safety constraint forbids touching the stale sibling that already owns it. Type alias and the `LegalLinkId`/`LegalLinkItem` contract deliberately unchanged.
- **Manifest reconciliation**: when the Stage 5 author spotted that `manifest.md` still documented the pre-rename event, I corrected `manifest.md` (my own artifact) rather than letting the drift stand.
- **Which components get validated**: page + form (independently meaningful); links bar covered via the page, per step 13.

---

## 4. Wall clock

**96 min 20 s** (23:22:51 → 00:59:11). Rough shape: Stage 1 ≈ 3 min; Stage 2 ≈ 3 min; Stage 3 ≈ 27 min (3 sequential dependency levels + 1 retry); Stage 4 ≈ 35 min (2 parallel validations, 2 fix rounds, 2 sequential re-validations); Stage 5 ≈ 4 min (3 authors, 2 parallel); Stage 6 ≈ 7 min (3 parallel reviewers) + 5 min critical-fix round-trip.

---

## 5. Artifacts

**Run folder** `.implement-design/sanna-ready-for-development-5/` — all six required artifacts present:
`screenshot.png` (856 KB, 1576×1100), `figma-metadata.json`, `figma-code-connect-map.json`, `figma-design-context.md`, `figma-variable-defs.json`, `manifest.md` (23 KB — design manifest + decomposition + the 16-question table).
`testing/` holds **14 captures**, all written by validators, none at the repo root.

**Generated code** `examples/lit/src/_runs/control-b-sanna-account-r2/` (11 files):

```
account-creation-page.ts / .css / .stories.ts
assets/hero.png, assets/logo-wordmark.svg
account-creation-form/account-creation-form.ts / .css / .stories.ts
legal-links-bar/legal-links-bar.ts / .css / .stories.ts
```

**Working tree (step 19)**: `git status` returns exactly the four pre-existing untracked items (`agents.zip`, `agents/`, `analiza-agent-plugin.md`, `analiza-projektu.md`) — byte-identical to the baseline. No stray screenshots or scratch files anywhere. Both `.implement-design/` and `examples/lit/src/_runs/` are gitignored by design. **Nothing committed; no PR.**

---

## 6. Components, verdicts, tests, decomposer questions, `[MINOR]` list

### Components (3 new; framework **lit**; i18n **off**)

| Component                                     | Path                         | Story id (Basic)                                               | Stage 4                                              | Stage 6                              |
| --------------------------------------------- | ---------------------------- | -------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------ |
| `sl-account-creation-page` (root, data owner) | `…/account-creation-page.ts` | `runs-control-b-sanna-account-r2-account-creation-page--basic` | **MATCH** (iter. 3) → **MATCH** after critical fixes | 2 `[CRITICAL]` (fixed), 13 `[MINOR]` |
| `sl-account-creation-form`                    | `…/account-creation-form/`   | `runs-control-b-sanna-account-r2-account-creation-form--basic` | **MATCH** (iter. 2)                                  | 0 `[CRITICAL]`, 12 `[MINOR]`         |
| `sl-legal-links-bar`                          | `…/legal-links-bar/`         | `runs-control-b-sanna-account-r2-legal-links-bar--basic`       | covered via page                                     | 0 `[CRITICAL]`, 7 `[MINOR]`          |

The decomposer deliberately did **not** promote three of the manifest's four composition candidates (name row, consent group, action stack) — all are `name`d controls or the submit bar, so the one-form rule requires them in the same shadow tree as the `<sl-form>`.

### Tests

**None, correctly.** The output location is an example inside the private `@sl-design-system/lit-examples` package, so Stage 5 scoped to story enrichment and all three authors independently skipped Vitest specs, website docs, changesets, `package.json`/`register.ts` and i18n extraction. 15 stories total (5 page, 5 form, 4 bar + 1).

### Validation history

1. Page + form validated **in parallel** → both `NEEDS_WORK`, 4 convergent root-caused defects, plus both reporting browser contention.
2. Fixes: theme pinned to `teacher-assistant`; consent fields seeded explicitly; `mark="required"` to suppress a spurious "(optional)"; sans-serif font stacks.
3. Re-validated **sequentially**: form `MATCH`; page `NEEDS_WORK` with one new finding (footer links left-aligned).
4. Footer centering fixed → page `MATCH` (margins symmetric to 0.01 px, 32 px gaps uniform).
5. Stage 6 `[CRITICAL]` ×2 fixed → page re-validated `MATCH`.

### Gate regression caught (the `TS2717` the brief predicted)

The leaf's first implementation produced **one new error** on top of baseline:

```
…/control-b-sanna-account-r2/legal-links-bar/legal-links-bar.ts(17,5): error TS2717:
Subsequent property declarations must have the same type.
Property ''sl-legal-link-select'' must be of type 'SlLegalLinkSelectEvent', but here has type 'SlLegalLinkSelectEvent'.
```

Cause: the stale sibling `_runs/control-a9-sanna-login-r2/login-footer-links/` already declares that global key with a different payload. The implementer correctly refused to rename itself or touch the other run and escalated for "orchestrator-level deconfliction". I ruled that this run yields the generic name. Fixed on the first retry (the skill's one-retry cap).

### `[CRITICAL]` found and fixed in Stage 6

1. **Page clipped its own actions on short viewports.** `block-size: 100vh` + `overflow: hidden` meant that on any viewport ≲800 px tall the Continue/Go back buttons and footer links were clipped **with no scrollbar** — unreachable by mouse _and_ keyboard. Fixed to `overflow: auto`; re-validation confirmed 1512×982 unchanged and 1440×780 now scrolls, with focus auto-scrolling the footer link into view.
2. **`autocomplete` suppressed on all three text fields.** `sl-text-field` writes `autocomplete="off"` when the property is unset, so leaving it off _actively_ disabled autofill on a name/email form — a WCAG 2.1 AA 1.3.5 failure. Fixed to `given-name` / `family-name` / `email`; re-validation read the real attribute off each slotted native input.

### `[MINOR]` punch list (32 items — suggest as PR comments)

**`sl-account-creation-page` (13)** — `.consent-text`/size-token naming could use the typography longhands; aside radius 12 px vs the design's 24 px is a role-vs-value trade-off (`--sl-size-300` is an exact value match); `role="navigation"` redundant on `<nav>`; `aria-hidden="true"` wraps a consumer slot (document "decorative only" or move it to the default `<img>`); no `type="email"` on the email field; story points `aside-image-src` at a remote `images.unsplash.com` URL (network-dependent); page story has no `argTypes` (matches house style for page roots); `@default false` on a false-defaulting boolean; only 1 of 3 form events declared in `GlobalEventHandlersEventMap`, so a host listening on the page silently gets the **stale sibling's** `event.detail` type; `@internal` tagging inconsistent across emitters; `token` prop declared but never read; `.footer-row` declared twice in one media query; **the "token gap" comment for `--sl-color-background-neutral-subtlest` is itself wrong** — under the pinned `teacher-assistant` theme it is `#fbfaf7`, byte-identical to the design.

**`sl-account-creation-form` (12)** — two 64 px gaps use `--sl-size-800` where role-correct `--sl-space-800` exists; the second 64 px gap has no manifest binding (worth one re-measure); `#onSubmit` normalizes only the booleans, so an unregistered control can drop a required `string` key; two `@default false` on booleans; `@default {}` on `value` misleading; `#hrefFor` falls back to `'#'`, rendering dead `target="_blank"` links when `legalLinks` is empty; three `aria-label`s duplicate visible sentences verbatim (prefer `aria-labelledby`); consent links stay operable when `disabled`; no controls for `legalLinks`/`value`; no validation-state story; `.name-row` stays two-up at every width; `<sl-icon>` size inherited rather than asserted.

**`sl-legal-links-bar` (7)** — `:host { display: block }` is missing and the **page compensates from outside**, so any other consumer (including its own story) loses the centering; `role="navigation"` redundant on `<nav>`; `list-style: none` drops list semantics in Safari/VoiceOver (add `role="list"`); the `Empty` story renders a labelled landmark containing nothing; no `flex-wrap` (overflows below ~600 px); no `links` control; manifest says the role sits on the host, implementation puts it on an inner `<nav>`.

### Unresolved handoff notes (not fixable inside this run)

- **Upstream `sl-checkbox` bug** — `checkbox.ts:210` `this.checked = value === this.value || (this.value === undefined && value === true)`. With no `value` attribute and an absent key, `undefined === undefined` **force-checks the box**. Both components now defend by seeding defaults explicitly. _Two independent agents root-caused this from source._
- **Upstream `sl-form` mark balancer** — `#updateMarkedFields()` stamps `mark` on the minority group, putting "(optional)" on the name fields; `form-field.ts`'s `this.#label.mark ??= this.mark` only ever assigns once. Worked around with `mark="required"` pinning.
- **Theme font gap** — `--sl-text-new-*-fontFamily` resolves to `'Open Sans'`, which **no theme ships an `@font-face` for**, while `teacher-assistant` _does_ ship `'New Message'` — the family the design actually uses. Every string on the page renders in a fallback face. Mitigated with sans-serif stacks; the real fix is upstream.
- **Designer copy bugs** — email placeholder "Enter your password"; footer link "Terms of User".
- **Stale sibling runs** — deleting `b-sanna-account-creation/` and `control-b-sanna-account-r1/` would let this run declare its tag and all three event keys properly.

---

## 7. What surprised me about the skill

1. **The remote `figma` server returned `componentName: null` for all 16 Code Connect entries** — yet the run was never blocked, because the inline CC _snippets_ were present in `get_design_context` and the Figma node names are literally `sl-text-field` / `sl-checkbox` / `sl-button-pill`. The analyst's name-and-peer heuristic carried it. Stage 0's warning is real, but the `BLOCKED_ON_CODE_CONNECT` path is much harder to trigger than the wording implies.

2. **The design manifest's Token Reference is in Figma variable-path form** (`color/palette/purple/900`), not `--sl-*` custom-property form. Every implementer had to re-resolve each name against `theme.css` independently, and they didn't all land on the same answers. The schema hands downstream agents a translation job it could do once.

3. **The manifest silently dropped the design's longest content.** The three consent sentences — the bulk of the visible copy — appear in **neither** `get_design_context` (the CC snippets are bare `<sl-checkbox checked></sl-checkbox>`) **nor** the manifest. They survived only because the implementer read them off `screenshot.png`. A schema that captures component mappings but not their labels is one OCR failure away from inventing legal copy.

4. **Parallelism the skill mandates actively hurts.** Step 13 says spawn validators in parallel; they share a single Playwright MCP browser and hijacked each other's navigation mid-measurement. One validator had to re-verify every number after re-navigating. Sequential was strictly faster in practice.

5. **The skill has no tag/event namespacing rule for example runs**, so parallel runs of the same design collide in two global registries at once: `HTMLElementTagNameMap` (a `TS2717` build break) and `customElements.define` (a _silent_ wrong-class win, since the guarded define just no-ops). Three separate agents independently hit this and each worked around it by **omitting their own type declarations** — which fixes the build but leaves hosts getting a stale sibling's `event.detail` type. The skill's own `.gitignore` comment ("a run worth keeping is promoted to `runs/`") shows accumulation was anticipated; the collision consequences weren't.

6. **Nothing in the pipeline pins the brand theme, and the default is wrong for the design.** Storybook defaults to `sanoma-learning` (blue); this design is `teacher-assistant` (purple). Stage 4 therefore opened on a page where _every_ colour token looked wrong. Both validators burned significant time proving the tokens were right and the theme was wrong. Neither the manifest schema nor the story conventions have a slot for "which theme is this design drawn in" — arguably a missing Stage 0 question.

7. **The two hard gates are unevenly specified.** The i18n-id gate is described in forensic detail (both directions, literal-vs-variable `msg()`); the type-check gate is one clause — "tsc exit 0" — that is literally unsatisfiable in this repo and is contradicted by the framework skill two files away.

8. **Agent quality was genuinely high where it counted.** Reviewers didn't just pattern-match conventions — they read `checkbox.ts`, `form.ts` and `form-field.ts` to root-cause behaviour, verified a first-paint registration race through `requestAnimationFrame` replay, confirmed `<sl-error>` self-assigns its slot so the restyled `::part(controls)` flex row can't break the error state, and **corrected a false "token gap" the implementer had recorded** by noticing the value had been grepped from the wrong theme. The two `[CRITICAL]`s were both real, both invisible to `tsc` and to a 1512×982 screenshot diff, and one was a genuine WCAG failure. Stage 6 earned its place.

9. **A pass-isolation leak worth flagging for the experiment.** My instructions said to run fresh and not reuse the previous pass. I passed that constraint to agents only as "don't _modify_ other `_runs/` folders" — so two of them legitimately _read_ `control-b-sanna-account-r1`: the page implementer **copied its cached Figma assets** (`hero.png`, `logo-wordmark.svg`) into this run rather than re-downloading, and a validator cited it as precedent for the `teacher-assistant` theme pin. Both are reasonable agent behaviour under the constraint they were given; neither is clean under the experiment's. **If pass isolation matters to the measurement, the prohibition has to be propagated into the agent prompts, not just held by the coordinator.**
