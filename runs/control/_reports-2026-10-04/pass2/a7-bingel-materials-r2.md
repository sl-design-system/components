# Control run — A7 Bingel Materials / Overviews (pass 2)

Unassisted execution of `/implement-design` on
`https://www.figma.com/design/1yroCKkROktqhRCP2wwlzB/MyPortal-Designs-2025?node-id=15878-180439`

**Start** `Sun Oct  4 20:16:36 CEST 2026` · **End** `Sun Oct  4 22:47:31 CEST 2026` · **Wall clock ≈ 2 h 31 min**

---

## 1. Stage reached

**All six stages ran to completion. The pipeline never halted** — no `BLOCKED_ON_MCP`, no `BLOCKED_ON_CODE_CONNECT`, no exceptional halt.

| Stage               | Outcome                                                                 |
| ------------------- | ----------------------------------------------------------------------- |
| 0 Setup             | Skipped (four answers supplied up front)                                |
| 1 Ingestion         | design-analyst returned a manifest                                      |
| 2 Decomposition     | 8 new components, 11 open questions                                     |
| 3 Implementation    | 9 components in 3 dependency waves; type-check gate passed              |
| 4 Visual validation | **Hit the 3-iteration cap still at `NEEDS_WORK`** → 6 handoff notes     |
| 5 Author            | 7 variant stories added                                                 |
| 6 Review            | 4 reviewers; 4 [CRITICAL] routed back and resolved; 40+ [MINOR] carried |

### The one place it _should_ arguably have halted, and didn't

`get_code_connect_map` returned `{}` **file-wide** — zero Code Connect coverage. The analyst re-probed a single node to confirm it wasn't a subtree aggregation artifact, then **chose not to emit `BLOCKED_ON_CODE_CONNECT`**, writing in its own manifest:

> "It is recorded as data rather than raised as `BLOCKED_ON_CODE_CONNECT`, because it is application-shell chrome outside the content frame… **Flag this to the user if that judgement should be reversed — a strict reading of the blocking rule would stop here.**"

SKILL.md step 5 is unconditional: _"**`BLOCKED_ON_CODE_CONNECT`**: … **Halt** and report the blocked-node list."_ But the halt is keyed on the **agent emitting the token**, and the agent declined to. Every one of the 9 components was therefore built with zero CC snippets, identifying SLDS components by heuristic (`sl-*` node names, descriptions) and by reading package source. **This is the single biggest divergence of the run, and the skill has no coordinator-side check for it** — I only learned CC was empty because the analyst volunteered it in prose.

---

## 2. Did Stage 0 ask anything beyond the four answers?

**No.** The four answers (server `figma` remote, framework `lit`, i18n `no`, output `examples/lit/src/_runs/control-a7-bingel-materials-r2/`) were sufficient to enter Stage 1, and no agent asked a follow-up. The run was genuinely standalone after setup.

---

## 3. Everything I had to decide that the four answers did not cover

### A. Coordinator decisions the skill left open

1. **Run-folder slug.** The rule derives it from the _Figma file name_ → `myportal-designs-2025-2`. That has no relationship to the case label (A7) or to the output folder (`control-a7-bingel-materials-r2`). Three different names for one run; nothing in the skill lets you name the run after the case.
2. **Whether to accept the analyst's refusal to halt** (above). The skill gives the coordinator no criteria.
3. **Nesting inside the output path.** Stage 0 Q4 offers "`packages/components/`" or "an app/example path"; a deep path like `_runs/control-a7-…/` is neither. I put the root at the folder root and children in subfolders, matching the neighbouring `control-a9-sanna-login-r1`. The skill says only "the pipeline derives the root component name from the decomposition and places components accordingly."
4. **Stories per component.** Step 10 says _each_ implementer writes "a basic Storybook story… and reports **the exact Storybook story id**". Step 13 says validate only the root. Conventions say scoped children must not self-register — and an unregistered child cannot have a standalone story. **I resolved the contradiction by having only the root author a story.** Other `_runs/*` folders (e.g. `a1-kampus-subchapter-feed`) _do_ ship per-child stories, so this is a real fork in the road the skill does not adjudicate.
5. **Dependency-wave shape.** "Leaves-first" is ambiguous when 6 of 8 components are leaves depended on only by the root. I ran 6 ‖ 2 ‖ 1 rather than a strict depth walk.
6. **Who runs the type-check gate, and what "clean" means.** Step 11 demands `tsc` **exit 0**. This repo has 2 pre-existing errors in `packages/components/grid/src/grid.ts`. **The gate as written can never pass here.** I interpreted it as "no new errors in this run's files". Needs a baseline-diff, not an exit code.
7. **Stage 5 scope for an example.** I verified empirically (1 unrelated `.spec.ts`, no website docs, no changeset anywhere under `examples/lit/src`) and scoped the author to stories only.
8. **Reviewer batching.** Step 17 says "for each component". I ran 4 reviewers over 9 components grouped by subtree, rather than 9.
9. **What counts as a [CRITICAL] worth looping on**, and how many times. Step 18 says "capped at a sensible number" — no number given. I ran exactly one critical-fix round.
10. **Whether to re-validate visually after the Stage 6 critical fixes.** The fixes were a11y/behavioural (one CSS _comment_), so I did not re-spend a validation cycle. The skill doesn't say.
11. **How to treat the manifest's own errors.** The manifest asserted things the screenshot contradicted (below). I let implementers override it on measured evidence.
12. **Breadcrumb package name.** Manifest said `sl-breadcrumb`; the real package is **`breadcrumbs`** (plural). I corrected it in the decomposition before Stage 3.

### B. The 11 decomposer open questions, and the default I chose

| #   | Question                                                              | Default chosen                                                          |
| --- | --------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 1   | Is `main nav icon` a net-new primitive?                               | **No** — `<li>` + `sl-icon` + label                                     |
| 2   | `sl-badge` is `[DRAFT]` in Figma — usable?                            | **Yes** — in-repo `status: "stable"`; the tag is Figma-side only        |
| 3   | Does the page include app bar / quick actions / nav rail?             | **Yes, all three** — conventions require the story to render the design |
| 4   | Filter row: `<li>` or component?                                      | **`<li>`** — accept the decomposer's override of the manifest           |
| 5   | Missing glyph names (Materials/Chapter, 4 quick actions, 7 nav, bell) | **Substitute** nearest FA glyph by role; report each                    |
| 6   | Chevron-vs-count-badge inconsistency                                  | **Reproduce literally** — badge when `count` defined, else chevron      |
| 7   | Expand state controlled or local; single or multi?                    | **Root-controlled, multi-expand**; mock matches the design              |
| 8   | Is the contributor group interactive?                                 | **No** — design shows no affordance                                     |
| 9   | `role="banner"` on the app bar?                                       | **No** — conventions reserve page-level landmarks for the host          |
| 10  | Compose `sl-accordion`?                                               | **No** — hand-roll; design shows separate bordered cards                |
| 11  | `File-pdf` casing, `1.054px` border                                   | **Normalise both**                                                      |

---

## 4. Wall clock

**2 h 31 min** (20:16:36 → 22:47:31 CEST). Rough split: Stage 1 ≈ 12 min · Stage 2 ≈ 5 min · Stage 3 ≈ 65 min (longest single implementer 16 min) · Stage 4 ≈ 55 min across 3 iterations (validator runs alone: 15 + 16 + 16 min) · Stage 5 ≈ 19 min · Stage 6 ≈ 8 min review + 5 min critical fixes.

---

## 5. Artifacts

Run folder: **`.implement-design/myportal-designs-2025-2/`** (slug from the Figma file name; `-2` because `myportal-designs-2025-1` already existed).

| File                                            | Note                                                                                                                              |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `screenshot.png`                                | 1440×1890 RGBA, 230 KB — cached ground truth                                                                                      |
| `manifest.md`                                   | 16 KB from the analyst + the decomposition I appended (259 lines total)                                                           |
| `figma-metadata.json`                           | 45 KB                                                                                                                             |
| `figma-code-connect-map.json`                   | **`{}`** — empty                                                                                                                  |
| `figma-code-connect-probe.json`                 | **Not in the schema** — the analyst invented it to evidence the empty CC result                                                   |
| `figma-design-context.md` + `-part2` + `-part3` | **3 files, not 1** — the root call returned "design too large", so context was fetched per region over 7 calls                    |
| `figma-variable-defs.json`                      | 2.7 KB, 39 entries                                                                                                                |
| `testing/`                                      | **50 files** — captures and raw `getBoundingClientRect`/`getComputedStyle` dumps across 3 validation rounds, suffixed `-r2`/`-r3` |

`.implement-design/` was already gitignored. **Nothing landed at the repo root**; stray scratch files that briefly appeared (`.measure-tmp.mjs`, `.t.cjs`, …) were cleaned up by the agents that made them.

---

## 6. Components created, verdicts, tests, defaults, punch list

### Components — all under `examples/lit/src/_runs/control-a7-bingel-materials-r2/`

| Component                                               | Files                                                                             |
| ------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `<sl-bingel-materials-page>` (root, registers globally) | `bingel-materials-page.{ts,css,stories.ts}`                                       |
| `<sl-bingel-app-bar>`                                   | `app-bar/bingel-app-bar.{ts,css}`                                                 |
| `<sl-bingel-quick-actions>`                             | `quick-actions/bingel-quick-actions.{ts,css}`                                     |
| `<sl-bingel-nav-rail>`                                  | `nav-rail/bingel-nav-rail.{ts,css}`                                               |
| `<sl-material-header-card>`                             | `material-header-card/material-header-card.{ts,css}`                              |
| `<sl-contributor-avatar-group>`                         | `material-header-card/contributor-avatar-group/contributor-avatar-group.{ts,css}` |
| `<sl-material-filter-panel>`                            | `material-filter-panel/material-filter-panel.{ts,css}`                            |
| `<sl-material-filter-group>`                            | `material-filter-panel/filter-group/material-filter-group.{ts,css}`               |
| `<sl-material-file-list-panel>`                         | `material-file-list-panel/material-file-list-panel.{ts,css}`                      |

Plus `assets/reken-maar-4-cover.png` and `assets/anna-nowak.png` — **two files beyond the three the root implementer was asked for**, cropped from the cached Figma reference because the contract requires `coverImageUrl` and the run shipped no assets.

21 files total. 8 of 9 components are non-registering scoped children.

### Validator verdicts

| Round   | Verdict      | Detail                                                                                        |
| ------- | ------------ | --------------------------------------------------------------------------------------------- |
| 1       | `NEEDS_WORK` | 14 discrepancies; **page-wide serif fallback** was the blocker                                |
| 2       | `NEEDS_WORK` | 11 of 14 closed; 8 remaining, 1 an over-correction                                            |
| 3 (cap) | `NEEDS_WORK` | **The page-wide +3px vertical offset closed exactly** (body row y=424 = design); 6 items open |

The validator corrected itself twice under challenge — it withdrew its round-1 "app bar is 1px short" claim after the implementer pushed back, and in round 3 it established that **the Figma PNG is not a reliable 1:1 source for box edges** (outside strokes, one extra row on filled frames), re-reading `figma-metadata.json` instead.

### Tests

**None — correctly.** Output location is an example path; the conventions scope Stage 5 to what the location uses, and `examples/lit/src` ships exactly one unrelated `.spec.ts`, no website docs, no changeset. Stage 5 produced 7 variant stories instead.

**Type-check** (the real gate): 3 errors, **none from this run** — 2 pre-existing in `packages/components/grid/src/grid.ts` (1180, 1361), and 1 `TS2717` from a _different, concurrent_ control run (`control-b-sanna-account-r1`) colliding with `b-sanna-account-creation` on `HTMLElementTagNameMap['sl-account-creation-form']`.

**Story ids** (8): `examples-bingel-materials-overviews--` + `basic`, `different-section-selected`, `tests-and-chapter-expanded`, `search-filtered`, `empty-file-list`, `single-file`, `contributor-overflow`, `long-material-title`.

### Handoff notes — 6 open at the Stage 4 cap

1. Header-card host **inline** padding doesn't absorb its border (painted inset 17 vs 16) — the block axis was fixed, so the asymmetry is now conspicuous.
2. Header-card `<hr>` lands on a half pixel (y=307.5, two rows at ~50%) — `space-between` over an odd remainder created by the _accepted_ h1 line-height gap.
3. File rows' `padding: 12px` doesn't absorb their 1px border (inset 13 vs 12) — the panel was fixed, the rows weren't.
4. Cover thumbnail paints a doubled border bottom/right — the asset is 155×207 with a 1px frame baked in, resampled by ×0.9952 into a 154×206 content box.
5. Contributor **owner** role line renders `#71777D`; design is `#002F62` (`--sl-color-palette-blue-700`).
6. File rows are the only interactive element on the page using the **UA focus ring**; all three siblings use the house treatment.

### [CRITICAL] — 4 raised in Stage 6, all routed and resolved

| #   | Component       | Finding                                                                                   | Resolution                                                                                                                                                                                                                                                                                                                                              |
| --- | --------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | quick-actions   | `role="toolbar"` with no roving tabindex — 4 tab stops, arrows dead                       | **Role removed** (option 2). Verified by real key presses: 4 stops, no trap, Enter+Space emit; also kills a double "Quick actions" announcement                                                                                                                                                                                                         |
| 2   | nav-rail        | Idle labels **4.14:1**, below WCAG AA 4.5:1 for 16px/600                                  | **No code change — written up as a theme gap.** Implementer swept every candidate token live: all blue-400 roles fail at 4.14, including `--sl-color-link-idle`, the theme's own rest-link token. Rejected `link-hover` (5.61, pixel-perfect) as semantically inverted and fragile; rejected `foreground-primary-bold` (11.95) as abandoning the design |
| 3   | file-list-panel | All 8 rows are hrefless `<a>` → role `generic`, where `aria-labelledby` is **prohibited** | Conditional `role="button"` + `?download` bound to the same condition. **axe `aria-prohibited-attr` went from 8 nodes to 0**; AX tree now exposes name + description                                                                                                                                                                                    |
| 4   | root page       | Changing class/school **silently wiped all filter UI state**                              | `@state()` + `#appBarModel()` projection. Repro'd before, verified gone after; the wanted reset on a genuine record swap still fires                                                                                                                                                                                                                    |

### [MINOR] punch list — suggest as PR comments

**Cross-cutting**

- Three spellings of one font weight (`--sl-fontWeight-600` / `--sl-text-new-typeset-fontWeight-semiBold` / `--sl-fontWeight-bold`) and two of 1px (`--sl-size-010` / `--sl-size-borderWidth-default`).
- `HTMLElementTagNameMap` declared inconsistently — present on 4 components, absent on 4, and **wrong on the scoped-only ones** (the tag never exists globally).
- `EventEmitter` imported as a value, not a type, in 2 of 7 files.
- Three names and two strategies for the same icon workaround (`LOCAL_GLYPHS` guarded, `RUN_ICONS` unguarded, `FILE_TYPE_ICON_LIBRARY` unguarded).
- Comment-to-code ratio: ~half of the shell trio's 812 lines is prose, with the same three adjudicated gaps re-explained 3–4× each. Suggest one `NOTES.md` + pointers.
- British spellings in comments ("colours", "centres", "normalised") against the conventions' American-English rule.
- Three navigation landmarks on one page (`sl-breadcrumbs`, the rail's `<nav aria-label="Main">`, the filter panel's `<nav>`) — needs a human call about the host app.

**Per component**

- _quick-actions_: focus-ring offset uses `--sl-size-025` (2px) where siblings use the semantic `--sl-size-outlineOffset-default` (3px); dead `font-weight` declaration; the icon-recovery comment would leave 3 broken glyph names if followed literally; speculative default slot with partial `::slotted` styling.
- _app-bar_: hardcoded `aria-expanded="false"` on a control that never expands; bell announced as "0 unread notifications".
- _nav-rail_: active row passes at only **4.60:1** — folds into the same theme fix.
- _header-card_: `role="region"` set but never cleared; `ariaLabel` overwrites a consumer's; two speculative slots with no consumer; `ContributorGroup` re-export is dead while `ContributorPerson` isn't re-exported; `<ul>` needs `role="list"` (Safari strips it under `list-style: none`); 3 factual slips in doc comments (says 40 theme glyphs, actually 54).
- _contributor-avatar-group_: "and 1 others"; the "+N" chip's font-size won't track the avatar's under an alternate user-group scale; `coverImageAlt` is a UI string in the model; owner group's accessible name never says "owner".
- _filter-group_: the icon-registry comment **states the opposite of what `Icon.register` does** (incoming library is spread last, so it overrides); `selectedItemId` reflects but no selector reads it; dead `text-transform: uppercase` on a digit-only badge; "1 items".
- _filter-panel_: the "events stop at the boundary" comment overstates it — `sl-form-control` and 6 others still cross, which would silently register the search field with a consumer's `<sl-form>`; `<nav>` arguably should be `role="group"`.
- _file-list-panel_: one-frame 48px header flash before `no-header` lands; `@internal` on the component's only public event; `h2`'s 20px could use `var(--sl-size-250)`.
- _root_: fluid content column — reviewer recommends `max-inline-size: 1200px` (reproduces the manifest exactly ≥1440, keeps narrow degradation); stale "seven scoped children" comment; selection keyed on `itemId` without `groupId`; `materialId` inert; `@internal` on `lastAction`; non-matching groups still render headers under a query; story title `Examples/…` where every other `_runs/*` uses `Runs/…`; `document.createElement` at story module scope; `MOCK_PAGE_DATA` not exported (the story reads it back off a throwaway instance).

---

## 7. What surprised me

### The skill's own instructions were wrong or unfollowable in five places

1. **`component-conventions.md` is factually wrong about `--sl-text-new-*`.** It documents them as `font:` **shorthands** and warns at length about the weight reset. In this repo they are **longhands only** — bare `--sl-text-new-body-md` is not declared in `bingel-dc`. Three implementers found this independently. The doc even cites `tag.css:66` as an example, which therefore resolves to nothing.
2. **`'Open Sans'` vs `open-sans`** — the near-fatal one. `--sl-text-new-*-fontFamily` carries Figma's _display name_, which matches no loaded face, so **everything styled with it rendered in Times**. 20 declarations across all 8 components. The conventions' instruction to use these tokens caused it; only the root implementer, who declined to declare a family at all, got it right.
3. **Deleting `font-family` is not sufficient for form controls.** The UA sheet gives `<button>` its own font, so three components silently rendered **Arial** after the prescribed fix — a quieter failure than Times. The implementers found the stock `font: inherit` idiom themselves.
4. **The `tsc` exit-0 gate cannot pass** in a repo with pre-existing errors.
5. **Stage 4 step 12 says "Lit: `yarn start`".** `yarn start` is **unusable in this checkout** — every `yarn <script>` dies on `Environment variable not found (FONT_AWESOME_AUTH_TOKEN)`. The Stage 5 author worked around it with `node_modules/.bin/storybook dev` directly.

### Who actually started the dev server

Step 12 assigns that to the coordinator. In practice the **root implementer** started Storybook during Stage 3 to verify its story, so by Stage 4 it was already up and I never ran step 12. Later it **died mid-run** and the Stage 5 author silently restarted it. The skill has no notion of the server's lifecycle being shared across agents.

### The environment blocker the skill cannot see

**Font Awesome Pro is not installable** (private registry, unset token; no `node_modules/@fortawesome`). Every icon-bearing component hit this independently and **resolved it three different ways** — empty footprints (nav-rail, bell), hand-drawn SVG stand-ins (4 components), real theme glyphs where the 54-glyph registry happened to have one. Nothing in the skill coordinates a shared decision like this across parallel siblings; one implementer explicitly asked me to normalise it, and the skill gave me no mechanism to.

### Parallel agents collide on a shared scratchpad

**Three** implementers reported their measurement scripts being overwritten by siblings writing the same unprefixed filename, and at least two got back _another agent's_ results. One noted the real hazard precisely: a silently swapped script produces a confidently wrong measurement rather than an obvious failure. The skill tells you to spawn agents in parallel and says nothing about namespacing their scratch files.

### Cross-run contamination, in both directions

- Implementers **read the previous pass of this same case** (`_runs/a7-myportal-materials-overviews/`) and cited it as precedent — including the root reviewer, which compared my mock against the r1 mock item-for-item. Nothing isolates a run from prior runs in the same output tree.
- **Other control runs were executing concurrently in this working tree.** `control-a9-sanna-login-r2` and `control-b-sanna-account-r1` did not exist at 20:16 and did at 22:47; one of them introduced a `TS2717` into the shared type-check. Shared Storybook, shared tsc project, shared scratchpad.

### The manifest was wrong three times, and only pixels caught it

The `get_variable_defs` output is _Figma variable names, not `--sl-*` tokens_ — correctly flagged — but the manifest also asserted things the screenshot contradicted: the quick-actions rule is **blue, not grey**; only the **selected** badge is `#ACD2F5` (the manifest claimed all 20); and `letterSpacing: 1` is really **0.16px** (1%, not 1px). Implementers caught all three by sampling the PNG. **The pipeline has no step that reconciles the manifest against the reference** — it survived only because individual agents distrusted their own spec.

### Everything else

- **No new primitive was needed** — the only net-new candidate decomposed into existing parts, and nothing else in a full application screen required one.
- The validator's "measured table, not a gestalt impression" rule did real work: it caught its own 1280-vs-1440 viewport error, withdrew a wrong claim under challenge, and proved the header-card button overshoot was **100% label text width and 0% padding** (both deltas identical to two decimals) — preventing a "fix" that would have corrupted a correct 24px token to mask a font substitution.
- **`sl-badge` and `sl-panel` both needed outer-tree overrides** for shape the design asked for and the component doesn't expose (`min-inline-size: 1lh`; a fixed 64px header row with no part or custom property). Three components ended up using `--sl-color-palette-*` primitives because `bingel-dc` binds no semantic role to the design's values — a pattern with **zero precedent** in `packages/components/*/src/*.css`.
- The output tree is **gitignored** (`.gitignore:66`), so `git status`/`git diff` show nothing for 21 generated files. Several agents flagged that the harness can't review this work through git.
- Five `packages/locales/src/*.ts` files appeared modified mid-run (dev-server lit-localize regeneration) and had reverted by the end. Final tree is back to the session-start baseline.
