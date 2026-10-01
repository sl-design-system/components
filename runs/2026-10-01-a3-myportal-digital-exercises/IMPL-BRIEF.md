# Stage 3 implementation brief — a3-myportal-digital-exercises

Every implementer reads this file **plus** `token-map.md`, `slds-api.md` and the reference
`reference-normalised.png` in the same folder. **These override the decomposition and the manifest
wherever they differ** — the corrections below were measured against this repository and the design,
and several reverse a default chosen without that evidence.

## Fixed parameters

- Framework **lit** · i18n **OFF** (text verbatim, mixed Dutch/English — keep it as drawn)
- Theme **`bingel-int`** (derived; see `progress.json` → `theme` for the full evidence)
- Output root: `examples/lit/src/_runs/a3-myportal-digital-exercises/`
- Example path → **no** `package.json`, **no** `register.ts`, **no** website docs, **no** changeset,
  **no** `.spec.ts`
- Styles are plain `.css` imported `with { type: 'css' }`. No build step, no `.scss`.

## Read the NORMALISED reference, not `screenshot.png`

`screenshot.png` as Figma returned it is **uniformly 50% darkened** — the maximum channel value
anywhere in it is 128. Use **`reference-normalised.png`**. Every colour in this brief is from the
normalised image or from the design's own variable defs, never from the raw PNG.

## Registration — do it this way; the alternative has already emptied one run's page

**Do not use `ScopedElementsMixin` anywhere in this run.** A host that uses it owns a private
registry, and any tag missing from its `scopedElements` map renders as an inert unknown element with
no shadow root — the screenshot looks plausible and the page is empty.

In **every** component module:

```ts
import '@sl-design-system/button/register.js'; // side-effect register for each SLDS element used
// …class definition…
if (!customElements.get('sl-a3mp-thing')) {
  customElements.define('sl-a3mp-thing', A3mpThing);
}
```

The root imports each child module for its **side effect**: a bare `import './x.js';`.
`import { type X } from './x.js'` is erased and registers nothing — and so is a _value_ import
whose binding is only ever used in a type position. Write the bare import **in addition**.

## Every tag, class and event is prefixed `a3mp`

A sibling run (**A7**) is processing a different frame of this same Figma file right now. The
conventions require a _guarded_ `customElements.define`, so a name collision does not throw —
whichever module loads first wins and the other frame silently gets the wrong component wearing its
own attribute names.

| #   | Component          | Tag                              | Class                      | Folder                                |
| --- | ------------------ | -------------------------------- | -------------------------- | ------------------------------------- |
| 1   | root page          | `sl-a3mp-digital-exercises-page` | `A3mpDigitalExercisesPage` | (root)                                |
| 2   | app bar            | `sl-a3mp-app-bar`                | `A3mpAppBar`               | `app-bar/`                            |
| 3   | quick actions      | `sl-a3mp-quick-actions-bar`      | `A3mpQuickActionsBar`      | `quick-actions-bar/`                  |
| 4   | side nav           | `sl-a3mp-side-nav`               | `A3mpSideNav`              | `side-nav/`                           |
| 5   | chapter header     | `sl-a3mp-chapter-header`         | `A3mpChapterHeader`        | `chapter-header/`                     |
| 6   | avatar cluster     | `sl-a3mp-avatar-cluster`         | `A3mpAvatarCluster`        | `chapter-header/avatar-cluster/`      |
| 7   | chapter nav        | `sl-a3mp-chapter-nav`            | `A3mpChapterNav`           | `chapter-nav/`                        |
| 8   | chapter nav item   | `sl-a3mp-chapter-nav-item`       | `A3mpChapterNavItem`       | `chapter-nav/chapter-nav-item/`       |
| 9   | exercises panel    | `sl-a3mp-exercises-panel`        | `A3mpExercisesPanel`       | `exercises-panel/`                    |
| 10  | exercise list item | `sl-a3mp-exercise-list-item`     | `A3mpExerciseListItem`     | `exercises-panel/exercise-list-item/` |

Event names are prefixed too: `sl-a3mp-nav-select`, `sl-a3mp-quick-action`, `sl-a3mp-app-bar-action`,
`sl-a3mp-chapter-header-action`, `sl-a3mp-search-change`, `sl-a3mp-chapter-toggle`,
`sl-a3mp-tool-select`, `sl-a3mp-level-change`, `sl-a3mp-exercise-view`,
`sl-a3mp-exercise-add-toggle`. Emit with the `@event` decorator + `EventEmitter` from
`@sl-design-system/shared` — never a hand-rolled `new CustomEvent`.

Tags already registered by other runs — do **not** reuse any: `sl-kampus-app-header`,
`sl-kampus-toc-sidebar`, `sl-nsp-top-nav`, `sl-nsp-home-page`, `sl-itsl-*`, `sl-etsl-*`, `sl-a1-*`,
`sl-a2-*`, `sl-bknp-*`, `sl-login-*`, `sl-account-creation-*`, `sl-my-groups-page`,
`sl-group-list-page`, `sl-sesame-learning-materials-page`, `sl-course-files-page`,
`sl-add-element-page`, `sl-theory-card`, `sl-exercise-card`, `sl-feed-section-heading`,
`sl-subchapter-feed-*`.

## Corrections to the decomposition — measured; apply them

| OQ        | Decomposer's default                                                              | Correction                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| --------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1**     | app bar + quick-actions bar + side nav are "host-app shell chrome", out of scope  | **Overridden — build all three.** They occupy roughly a third of the 1440×1024 frame (a 56px app bar, a 40px quick-actions bar, a full-height 240px sidebar). Stage 4 compares against the whole frame, so omitting them would make the page's largest regions unmeasurable and the fidelity number meaningless. Component count goes 7 → **10**. Accessibility rule is unchanged: still **no `<main>`, no `role="main"`, no page-level `<header>`/`role="banner"`** — the app bar is a plain `<div>` with a `<nav aria-label="Account and context">` inside, the sidebar is `<nav aria-label="Primary">`, the quick-actions bar is `<nav aria-label="Quick actions">`. |
| **15**    | h2 is 20px/34; no token matches, override font-size locally                       | **A 20px token exists**: `--sl-text-md-fontSize` = 20px. Use it with `font-weight: var(--sl-fontWeight-700)`. Line-height 34 has no token; nearest `--sl-text-md-lineHeight` = 32. **Use 32 and record the 2px delta.** Do not write `font-size: 20px`.                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **16**    | hardcode `#ACD2F5` / `#004d94` / `#E0EAFF` / `#2351DB` as literal hex with a TODO | **Two of the four have exact tokens** — the manifest's `(unbound)` flag was wrong (it swept by name prefix, not by resolved value): `#ACD2F5` = `--sl-color-palette-blue-100`, `#004D94` = `--sl-color-palette-blue-600`. Use them. The MAX badge pair genuinely has none: use `--sl-color-palette-blue-050` (`#E6F1FB`, Δ 10.0) for the ground and `--sl-color-background-accent-blue-bold` (`#0074DF`, Δ 49.7) for the text, and **record both deltas**. **No raw hex anywhere.**                                                                                                                                                                                     |
| **16b**   | `bingel_dc_shadow` unbound → hardcode                                             | Use `box-shadow: 0 var(--sl-size-050) var(--sl-size-150) var(--sl-color-shadow-overlay2)` (0 4px 12px). The geometry matches the design's `offset (0,4) radius 12`; only the colour differs (`#1b1c1e1f` vs the design's `#0E4F9547`). Record the colour delta. Do not use `filter: drop-shadow()` on a host — it creates a containing block.                                                                                                                                                                                                                                                                                                                           |
| **9**     | force the `sl-select` open imperatively                                           | `sl-select` exposes **no public open API**; `listbox` is `@query('sl-listbox')` and marked `/** @internal */`. **The primary story renders the select CLOSED** — that is the API-honest state and what Stage 4 captures. Add a **second** story `LevelMenuOpen` that calls `listbox?.showPopover()` with an inline comment saying it reaches past an `@internal` member. The open dropdown is recorded as a **deliberate Stage 4 discrepancy**, not patched with an absolutely-positioned fake.                                                                                                                                                                         |
| **17**    | icon gaps                                                                         | See the icon table below — it is authoritative over the decomposer's per-component notes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **13**    | hand-roll the accordion rather than compose `sl-accordion`                        | **Confirmed, hand-roll.** The design's rows carry a selected state, a count badge, a left accent bar and a bespoke shadow that `sl-accordion-item` does not expose.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **10**    | added-toggle stays enabled, `aria-pressed`                                        | Confirmed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **11**    | search is presentational, emits only                                              | Confirmed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **6 / 7** | `typeKeys` is per-record data; `durationSeconds: number` formatted in-component   | Confirmed both.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

## Icons — only these 5 of the design's 18 glyphs exist in `bingel-int`

The theme registers 34 names (listed in `token-map.md`). The design calls for 18 distinct glyphs.

| Design glyph                        | Uses   | Verdict                                                                                                                                                                                                 |
| ----------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `chevron-down`                      | 15     | ✅ `chevron-down`. Rotate 180° with CSS for the expanded accordion row — do **not** look for a `chevron-up`.                                                                                            |
| `home-blank`                        | 1      | ✅ `home-blank` (breadcrumb home)                                                                                                                                                                       |
| `slash-forward`                     | 1      | ✅ `breadcrumb-separator` — the semantic equivalent; record the substitution                                                                                                                            |
| `check`                             | 1      | ✅ `check-solid` — only the solid weight is registered; record the weight substitution                                                                                                                  |
| `arrow-right`                       | 1      | ✅ `arrow-right` ("Lorem Ipsum" button)                                                                                                                                                                 |
| `Book`                              | 9      | ❌ omit                                                                                                                                                                                                 |
| `eye`                               | 4      | ❌ omit                                                                                                                                                                                                 |
| `list`                              | 4      | ❌ omit                                                                                                                                                                                                 |
| `plus`                              | 2      | ❌ omit                                                                                                                                                                                                 |
| `star`                              | 1      | ❌ omit (MAX badge renders text only)                                                                                                                                                                   |
| `comment`, `note`, `image`          | 1 each | ❌ omit (quick-actions bar)                                                                                                                                                                             |
| `presentation-screen`               | 1      | ❌ omit ("Digiboardware" button)                                                                                                                                                                        |
| `search`                            | 1      | ❌ omit — **and note**: `sl-search-field` renders `<sl-icon name="search">` internally, so its prefix icon is blank in this theme. That is an SLDS/theme defect, not yours. Record it; do not patch it. |
| `Books`, `files`, `book-open-cover` | 1 each | ❌ omit (accordion leading icons)                                                                                                                                                                       |

**Omit** means: render nothing where the glyph would be, but **keep its footprint** — an element of
the drawn box size (`inline-size`/`block-size` set, no content) so the row's layout and every
neighbouring offset are unchanged. Add a comment naming the missing glyph.

**Never `import … from '@fortawesome/*'`.** The package is absent from `node_modules`; Vite cannot
resolve it, the module throws at load and the page renders **nothing**. This is a render blocker.
**Never hand-draw a replacement glyph as inline SVG** — invented artwork inside a pixel-compared
region makes the fidelity score partly a measurement of the drawing. A sibling run did this and its
component became unmeasurable.

The seven sidebar icons and the bell are **exported SVG assets**, not Font Awesome glyphs. There is
no asset-export step, so they are omitted with their 24px footprint preserved, same rule.

## Images

No asset-export step exists. The book cover is
`<img src="/assets/a3mp/reken-maar-4-cover.png" width="156" height="208" alt="Cover of Reken Maar! 4">`
— it **will 404**, which is recorded as an `[ENV]` Stage 4 discrepancy. The explicit `width`/`height`
stop the layout reflowing. Do not substitute a remote image, a data URI or a placeholder service.
Avatars use `sl-avatar`'s own initials fallback (`display-initials`), which needs no asset.

## Measured geometry (from the normalised reference + verbatim design context)

**App bar** — `background: var(--sl-color-palette-blue-500)` (#0060B9), `padding: 12px 24px`,
flex row `justify-content: space-between`, full width, 56px tall.
Left group `gap: 40px`: wordmark 71.25×30 (asset, omit with footprint); class select 160px wide,
inner surface white, `padding: 5px 11px`, `border-radius: var(--sl-size-borderRadius-default)` (4px),
label 14/20 `--sl-color-background-interactive-bold` (#001223), 16px chevron.
Right group `gap: 24px`: school select (same spec, inner `gap: 8px`), bell 21×24 (omit, footprint),
then `gap: 12px` avatar block — 32px `sl-avatar`, name 14/16 weight 600 white, 24px chevron box
with a 16px glyph in white.

**Quick-actions bar** — white, `border-block: 1px solid var(--sl-color-palette-blue-500)`,
`padding-inline: 24px`, items `gap: 12px`. Label "Quick actions:" 14px regular
`--sl-color-palette-blue-500`. Each action `padding: 12px`, `border-radius: 12px`, inner `gap: 12px`,
16px icon box + 14px semibold label, all `--sl-color-palette-blue-500`.
Items, verbatim: **New task · Give Feedback · New care note · View island**.

**Side nav** — 240px wide, `background: var(--sl-color-background-neutral-bold)` (#F2F3F5),
`padding: 16px 24px`, items `gap: 24px`. Each item `padding: 12px`, inner `gap: 12px`, 24px icon
box, label 16px weight 600 `--sl-color-palette-blue-500`.
**Selected** item: `background: var(--sl-color-palette-blue-500)`, white label,
`border-radius: var(--sl-size-borderRadius-default)` (4px) — note the unselected rows are
`border-radius: 12px`; that asymmetry is what is drawn, reproduce it.
Items: **Home** (selected) · Planner · Class · Tasks · Evaluation · Analytics · Administration.
"Miniaturize" sits at the bottom of the column, 24px icon + 14px label.

**Breadcrumbs** — `gap: 16px`, `padding-inline: 24px`, 32px tall. `Home` (with `home-blank`, 14px,
`--sl-color-palette-blue-800`) / separator / `TaalTijd voor Taal accent - 4 (Chapter 3)`.
Use `<sl-breadcrumbs>`.

**Chapter header card** — content column 1200px, inner frame 1152px, inner padding `12px 16px`,
cover 156×208 at x=0, text block starts at x=172, action buttons right-aligned in a 334px box at
x=614 (`Digiboardware` 165px primary + 16px gap + `Lorem Ipsum` 153px outline, both 40px tall).
h1 "Reken Maar! 4" 24/34 bold `--sl-color-palette-blue-800`; "Uitgeverij VAN IN" and "LO-J4" each
20px tall, 24px apart, `--sl-color-foreground-subtle`. A 1px divider, then the three avatar clusters.

**Avatar clusters** — 40px circles overlapping by `-12px` (a negative overlap: write
`margin-inline-start: -12px` with a comment; there is no negative-space token, and inventing one is
worse than a commented literal). Cluster 1: one avatar, "Daniele King" / "Administrator".
Cluster 2: two avatars, "Jan Valeero, Daniele King" / "Co-authors (2)". Cluster 3: four avatars
ending in a "+2" overflow circle, "Jan Valeero, Karl Watson and 2 others" / "With own copy (5)".
Name 14/16 weight 600 `--sl-color-palette-blue-800`; role line 12/16 `--sl-color-foreground-subtlest`.

**Left chapter nav** — 390px column. Search field full width, placeholder "Search by name".
Rows: Materials · Tests · Chapter 1 · **Chapter 2 (expanded, selected)** · Chapter 3 · Chapter 4 · …
Row `padding: 12px`, `border-radius: var(--sl-size-borderRadius-default)`, 1px border
`--sl-color-border-plain`. The expanded chapter gets a 1px `--sl-color-palette-blue-500` border.
Leaf rows inside: **Lessons (10) · Digital Exercises (6, selected) · Print Exercises (5) · Tests (5)**.
The selected leaf has a left accent bar in `--sl-color-palette-blue-500`, ground
`--sl-color-palette-blue-100` and its badge text `--sl-color-palette-blue-600`; unselected badges are
`--sl-color-background-secondary-bold` on `--sl-color-foreground-subtle`.

**Exercises panel** — h2 "Digital Exercises" 20px/32 bold (see OQ15). Label "Exercises level" +
an infotip. Select 320px wide showing "Show all". Then four exercise rows, each:
`padding: 12px`, `border-radius: 8px` (`--sl-size-borderRadius-lg`), 1px
`--sl-color-background-secondary-bold` border. Row content: source line
"Reken Maar! 2 | Blok 2" 12/16 `--sl-color-foreground-subtle`, an optional **MAX** badge, the title
"Instructiefilmpje hoofdletter w long name would look like" 14/20 weight 600, a 1px divider, then a
meta strip — "Type:" + "Single choice | Multi choice | Drag and drop", "Time:" + "00:45",
"Exercises:" + "1" (captions 10px `--sl-typography-caption-md-fontSize`, values 12/16). Two circular
icon buttons at the right edge, 16px icon in a `padding: 4px` `--sl-size-borderRadius-full` surface:
**eye** (omitted glyph, footprint kept) and the **add toggle** (`check-solid` when added, omitted
glyph when not).
Row 1 carries the MAX badge; rows 2–4 do not. All four share the same title and meta text as drawn.

## House rules that are mechanically checked

- **No raw hex.** `check-tokens.mjs` is run over your output.
- **No `var()` fallbacks** — `var(--sl-x)`, never `var(--sl-x, #fff)`.
- **Never the `font:` shorthand.** `--sl-text-new-*` shorthands **do not exist in this theme** (zero
  are declared); a `font: var(--sl-text-new-body-md)` silently drops the whole declaration. Write
  `font-size` / `line-height` / `font-weight` / `font-family` as longhands.
- Logical properties only — `inline-size`, `block-size`, `padding-inline`, `margin-block`.
- All relative imports end in `.js`. JSDoc every exported declaration.
- Children take **one cohesive model object** (`@property({ attribute: false }) model`), not a pile
  of scalars. The **root owns all data** and holds the mock constant.
- Light-mode semantic tokens throughout.

## A fix must name its cause and show the arithmetic

If Stage 4 reports an element N px from where the reference has it, **find the cause**. A fix that
introduces a raw length without naming its cause and showing the arithmetic is rejected. The
cheapest way to improve a pixel score is always a constant, and a constant fitted to a measurement
is wrong at every other viewport. One run set `inline-size: 420px` because 420 + 24 = the measured
444; another decomposed a 32px offset into a 24px padding plus an 8px gap excess and removed both.
Be the second.

## Before you report done

```sh
node runs/harness/typecheck.mjs   --scope examples/lit/src/_runs/a3-myportal-digital-exercises
node runs/harness/check-tokens.mjs --scope examples/lit/src/_runs/a3-myportal-digital-exercises --theme bingel-int
```

`check-tokens` is the only thing that catches a `var(--sl-…)` naming a property the theme does not
define — which drops the declaration silently with no error anywhere. **No stub, no `.d.ts`, no
local re-declaration may be what makes either check pass.** If something cannot pass honestly,
report the failure.

Expect text in a **fallback face**: `bingel-int` ships no `@font-face` and names `'Open Sans'`.
That is an `[ENV]` discrepancy, not something to patch.
