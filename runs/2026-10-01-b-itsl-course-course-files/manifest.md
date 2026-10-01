# Design Manifest — course files

> **Provenance note.** `design-analyst` returned `BLOCKED_ON_CODE_CONNECT` and stopped before
> `get_screenshot` / `get_variable_defs`. The coordinator overrode the halt (rationale in
> `progress.json → findings.stage1CodeConnectBlock`) and completed Stage 1: the screenshot and
> variable defs were fetched directly, geometry was pulled with four extra `get_metadata` calls,
> and this manifest was written from those plus the analyst's `figma-design-context.md`.

## Overview

Figma file **Course-files** (`mONnHPTYNNaBwV3cFUHIYv`), top-level node **`course files`**
(`4007:3161`), frame **1280 × 768**. It is an itslearning "Save course materials" page: a
two-tier global navigation bar, a page title, and a white elevated content block holding a
dismissible info banner, a four-column sortable table of courses (course name + status tag +
teacher + last-updated date), and a pagination bar with a page-size select.

## Existing SLDS Components Used

**None resolved.** `get_code_connect_map` returned literally `{}` for all 16 attempts (the
`4007:3161` subtree, 7 top-level instances, 8 main-component definition ids), and
`get_design_context`'s reference code emits zero `sl-*` tags — plain `div`/`p`/`img` only.

The cause is not a scoping artifact: **this design is drawn against itslearning's own component
library**, documented at `styleguide.itsbuild.net`, not against the SL Design System library.
Every component description carries an itslearning styleguide URL. No Code Connect publishing in
this file could map them, because they are not SLDS components.

The table below is therefore **inferred, advisory, and not authoritative** — a coordinator's
reading of which SLDS component each itslearning component corresponds to.

| Node ID                       | Node Name                | Inferred SLDS equivalent                                             | Confidence |
| ----------------------------- | ------------------------ | -------------------------------------------------------------------- | ---------- |
| `4461:5869`                   | Navigation               | no single equivalent — build bespoke; `sl-avatar` + `sl-icon` inside | n/a        |
| `4007:3166`                   | PageHeader               | bespoke heading block                                                | n/a        |
| `4007:3169`                   | Banner                   | **`sl-inline-message`** (info variant, dismissible)                  | medium     |
| `4008:8839` / `4008:9032`     | courses (rows) + Cell    | **`sl-grid`** or bespoke table — see open question                   | low        |
| `4007:3183`                   | Pagination               | **`sl-paginator`** + **`sl-paginator-size`** if present              | medium     |
| `I4007:3169;17344:7058`       | Button (icon-only close) | **`sl-button fill="ghost"`** + `sl-icon`                             | high       |
| `I4008:9032;…;15381:6900`     | Status Tag               | **`sl-badge`** or **`sl-tag`**                                       | medium     |
| `I4008:9032;…;19393:6514`     | Course Hat               | **`sl-avatar`** (icon-only)                                          | medium     |
| `I4461:5869;…;9976:10636`     | Avatar                   | **`sl-avatar`**                                                      | high       |
| `I4007:3183;4997:6325`        | Select                   | **`sl-select`** + `sl-option`                                        | high       |
| `I4007:3183;4997:6317`–`6321` | `.Page link`             | part of `sl-paginator`                                               | medium     |

## Composition Candidates

- **Global navigation** — `4461:5869`. Two stacked 56px bars (main menu + secondary menu); a
  page-level shell element, reused across every screen in this product.
- **Content block** — `4007:3168`. White elevated surface (radius 4, `layer-shadow`) wrapping
  banner + table + pagination; itslearning's standard page container with its own padding tokens.
- **Course table** — `4008:9031`. One header row + N data rows, all instances of the same
  `courses` component. Repeats per record — the obvious row component.
- **Course row cell group** — `I4008:9032;4008:8789` .. `8792`. Four fixed 280px cells; the first
  pairs a Course Hat badge with a link, the second a Status Tag, the rest plain text.
- **Pagination bar** — `4007:3183`. Pager (prev + 5 page links + next) and Control (visible-range
  text + page-size select) as one unit.

## Net-New Primitive Candidates

- `I4008:9032;4008:8789;19393:6514` **Course Hat** — an icon-in-circle course badge. Closest SLDS
  primitive is `sl-avatar`, but the design's glyph (`graduation-cap`) is **not registered in the
  itslearning theme**, so it cannot be reproduced faithfully. Indicator-shaped.
- `I4461:5869;4461:5606` **your-files** and `I4461:5869;…;9976:10622` **itslearning-logo-symbol** —
  brand marks, not components. No SLDS equivalent and no asset-export step. Image-shaped.

Everything else is composable from existing primitives or is plain layout.

## Responsive Breakpoints

_Single breakpoint: 1280px._ One frame only (1280 × 768). The design binds `ca-max-width: 1280`
and `ca-horisontal-margin: 48`, which implies a centred max-width container, but no narrower frame
exists to derive behaviour from.

## Designer Annotations

Two `data-annotations` attributes in the generated reference code:

- `I4008:8839;4008:8764;1606:2453` (table header cell "Course"): **"Change to 'courses'"**
- `I4008:8839;4008:8766;1606:2453` (table header cell "Teacher"): **"Change to 'Teachers'"**

These are designer to-dos, **not** the rendered state. The screenshot — which is the pixel ground
truth — shows "Course" and "Teacher". Implement what is drawn; see open question OQ-9.

Component-level guidance quoted from the itslearning library:

- Banner (`6077:6144`): "shown inside BannerArea; full width; dismissible unless critical".
- Cell (`6145:11793`): "sort cells swap icon + Brand/100 background".
- Status Tag (`6145:9591`): "not interactive; colors shouldn't be changed; don't truncate label".
- Pagination (`6145:12461`): "hide when only 1 page; item-count control optional".
- Row template (`4008:8813`): "detach before using… make a new local component" — i.e. the row is
  explicitly a blueprint, which supports generating a row component rather than reusing one.

## Geometry (measured, `get_metadata`)

| Element               | Node                             | x                 | y             | w    | h   |
| --------------------- | -------------------------------- | ----------------- | ------------- | ---- | --- |
| Frame                 | `4007:3161`                      | —                 | —             | 1280 | 768 |
| Navigation            | `4461:5869`                      | 0                 | 0             | 1280 | 112 |
| ├ .Main menu          | `I…;4461:5603`                   | 0                 | 0             | 1280 | 56  |
| └ .Secondary menu     | `I…;4461:5604`                   | 0                 | 56            | 1280 | 56  |
| ⌞ Course tab group    | `I…;4461:5605`                   | 4                 | 0             | 93   | 56  |
| ⌞ your-files icon     | `I…;4461:5606`                   | 8                 | 12            | 32   | 32  |
| content-area          | `4007:3165`                      | 48                | 112           | 1184 | 489 |
| PageHeader            | `4007:3166`                      | 0                 | 0             | 1184 | 80  |
| Content-block         | `4007:3168`                      | 0                 | 80            | 1184 | 389 |
| Banner                | `4007:3169`                      | 32                | 20            | 1120 | 45  |
| Search (**hidden**)   | `4007:3170`                      | 32                | 85            | 1120 | 40  |
| table                 | `4008:9031`                      | 32                | 85            | 1120 | 224 |
| ├ header row          | `4008:8839`                      | 0                 | 0             | 1120 | 32  |
| └ data rows ×4        | `4008:9032`/`9078`/`9126`/`9174` | 0                 | 32/80/128/176 | 1120 | 48  |
| ⌞ row cells ×4        | `…8789`–`8792`                   | 0/280/560/840     | 0             | 280  | 48  |
| (5th row, **hidden**) | `4008:9150`                      | 0                 | 232           | 1120 | 48  |
| Pagination            | `4007:3183`                      | 32                | 329           | 1120 | 40  |
| ├ Pager               | `I…;4997:6315`                   | 0                 | 0             | 927  | 40  |
| ⌞ prev Button         | `I…;4997:6316`                   | 0                 | 0             | 40   | 40  |
| ⌞ .Page link ×5       | `I…;6317`–`6321`                 | 48/97/146/195/244 | 0             | 41   | 40  |
| ⌞ next Button         | `I…;4997:6322`                   | 293               | 0             | 40   | 40  |
| └ Control             | `I…;4997:6323`                   | 943               | 0             | 177  | 40  |
| ⌞ Visible range text  | `I…;4997:6324`                   | 0                 | 9.5           | 81   | 21  |
| ⌞ Select              | `I…;4997:6325`                   | 97                | 0             | 80   | 40  |

Derived: Content-block padding = **32px inline / 20px block** (matches the bound
`Content block/content-block-horisontal-padding: 32` and `…-vertical-padding: 20`); vertical gap
between banner, table and pagination = **20px**; pagination item gap = **8px**; table columns are
four equal **280px** tracks.

## Content (verbatim — reproduce this, do not placeholder)

- Secondary nav tabs: **Files** (active section label, with `your-files` icon), **Your files**,
  **Save course materials** (selected, underlined).
- Main nav items: **Courses**, **Updates**, **Groups**, **Calendar**, **Library**; search input
  placeholder **Search**; bell, comment, avatar on the right.
- Page title: **Save course materials**
- Banner: **This section contains all the course files you've created or uploaded. Select a course
  to access its files**
- Table headers: **Course**, **Status**, **Teacher** (sortable), **Last updated** (sortable)
- Rows (all four): course **Math 2c**, teacher **Floyd Miles and 2 more**, updated **05/04/2024**;
  statuses in order **Archived**, **Deleted**, **Deleted**, **Archived**
- Pagination: pages **1**–**5** (1 selected), range text **1 to 10 of 47**, page size **10**

## Icons required, and their availability in the `itslearning` theme

Checked against `packages/themes/itslearning/icons.ts` (54 registered names), parsing quoted and
unquoted keys alike.

| Design glyph                             | In theme?                                                       | Decision                                                                  |
| ---------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `xmark` (banner close)                   | **yes**                                                         | use `xmark`                                                               |
| `chevron-left` / `chevron-right` (pager) | **yes**                                                         | use as-is                                                                 |
| `magnifying-glass` (search)              | no — theme registers **`search`**                               | use `search` (same glyph, different name)                                 |
| `arrow-up-arrow-down` (sort)             | no — theme registers **`sort`**                                 | use `sort` (same glyph, different name)                                   |
| `caret-down` (select)                    | no — theme has `caret-down-solid`, `chevron-down`, `angle-down` | use `chevron-down`                                                        |
| `circle-info` (banner)                   | no — theme registers **`info`**                                 | **near-miss**: plausible but not identical. Record as Stage 4 discrepancy |
| `graduation-cap` (Course Hat)            | **no**                                                          | **omit**, record as Stage 4 discrepancy. Do not hand-draw                 |
| `bell` (notifications)                   | **no**                                                          | **omit**, record as Stage 4 discrepancy                                   |
| `comment` (messages)                     | **no**                                                          | **omit**, record as Stage 4 discrepancy                                   |
| `your-files` (section mark)              | **no** (brand asset)                                            | **omit**, record as Stage 4 discrepancy                                   |
| `itslearning-logo-symbol`                | **no** (brand asset)                                            | **omit**, record as Stage 4 discrepancy                                   |

## Assets

The pipeline has no asset-export step. Image nodes present: `imgPhoto` (avatar photo, `.png`) and
six brand/glyph `.svg`s behind a Figma `assetPathPrefix`. **Expect `<img>` 404s; do not fabricate
replacements.** The avatar renders initials instead of the photo.

## Token Reference

**Theme derived by evidence: `itslearning`.** See `progress.json → themeEvidence`. `theme-match.mjs`
returns `colorTokensInDesign: 0` and cannot rank — this design binds itslearning's _own_ variables
(`$gray--900`, `$blue--600`, `Size/300`), not SLDS-shaped names. Matching by **value** instead:
`itslearning` contains 20 of the design's 22 exact hexes and 5 of 7 brand hexes; **every other
theme contains 1** (`#ffffff`). The design's `default-font: Lato` also matches only this theme.

Figma variable → resolved value → **exact** itslearning token. Every colour below is an exact
match; none is an approximation.

### Color

- `$gray--900` / `Gray/900` / `$text` `#333333` → **`--sl-color-foreground-bold`** (exact).
  Note `--sl-color-foreground-plain` is `#4a4a4a`, _not_ `#333333` — do not substitute it.
- `$gray--700` / `Gray/700` `#565656` → **`--sl-color-foreground-subtle`**
- `$gray--600` `#757575` → **`--sl-color-border-bold`**
- `$gray--500` `#9b9b9b` → **`--sl-color-palette-grey-500`**
- `$gray--400` `#cfcfcf` → **`--sl-color-border-disabled`** (also `--sl-color-palette-grey-400`)
- `$gray--300` / `Gray/300` `#e1e1e1` → **`--sl-color-border-plain`**
- `$gray--200` `#ececec` → **`--sl-color-palette-grey-200`**
- `$gray--150` `#f2f2f2` → **`--sl-color-background-neutral-bold`**
- `$gray--100` `#f4f4f4` → **`--sl-color-palette-grey-100`**
- `$gray--50` `#f9f9f9` → **`--sl-elevation-surface-raised-sunken`** (also `--sl-color-palette-grey-050`)
- `$gray--0` `#ffffff` → **`--sl-color-white`** or **`--sl-elevation-surface-raised-default`** (both exact). ⚠️ NOT `--sl-color-background-plain` — that token DOES NOT EXIST; the coordinator invented it and two implementers caught it independently.
- `$blue--600` `#0055b0` → **`--sl-color-background-info-bold`** (icon/accent fill)
- `$blue--700` `#00458f` → **`--sl-color-link-idle`** — exact; use for the "Math 2c" links
- `$blue--100` `#ecf8ff` → **`--sl-color-palette-blue-050`** — the banner background
- `$brand--800` `#42354a` → **`--sl-color-palette-purple-800`** (exact) — the selected page-link
  fill. ⚠️ **There is no semantic _background_ token for this value.** The obvious-looking
  `--sl-color-background-selected-bold` is **`#785f86`**, a visibly lighter purple — using it
  would be a valid-token-but-wrong-value defect. Exact matches are all `foreground-*` or
  `palette-*`; use the palette token for this fill.
- `$brand--700` `#5d4a68` → **`--sl-color-palette-purple-700`**
- `$pigeongrey--200` `#72838d` → _(no token in this theme; unused in the visible design)_
- `$pigeongrey--100` `#d9e3e8` → _(no token in this theme; unused in the visible design)_

### Size / Spacing

**Do not map by name.** The Figma `Size/N` scale is half the theme's `--sl-size-N` scale
(`Size/500` = 20 but `--sl-size-500` = 40px). Mapped by **value**:

- `Size/5` = 1 → `--sl-size-010`
- `Size/10` = 2 → `--sl-size-025`
- `Size/25` = 4 → `--sl-size-050`
- `Size/50` / `Size/size--50` = 8 → `--sl-size-100`
- `Size/100` / `Size/size--100` = 12 → `--sl-size-150`
- `Size/200` = 14 → `--sl-size-175`
- `Size/300` / `Size/size--300` = 16 → `--sl-size-200`
- `Size/400` = 18 → _(no exact token; 18px is off-scale)_
- `Size/500` = 20 → `--sl-size-250`
- `Size/700` = 24 → `--sl-size-300`
- `Size/800` = 26 → _(no exact token; 26px is off-scale)_
- `Size/900` = 32 → `--sl-size-400`
- `Content block/content-block-horisontal-padding` = 32 → `--sl-size-400`
- `Content block/content-block-vertical-padding` = 20 → `--sl-size-250`
- `ca-cards-gap` = 20 → `--sl-size-250`
- `ca-horisontal-margin` = 48 → `--sl-size-600`
- `ca-max-width` = 1280, `screen-width` = 1280, `screen-height` = 768 → layout constants
- `border-radius` = 4 → `--sl-size-borderRadius-default` (= 4px, exact)
- Row heights 48 → `--sl-size-600`; header row 32 → `--sl-size-400`; pager buttons 40 →
  `--sl-size-500`; nav bars 56 → `--sl-size-700`

**Border width trap:** `--sl-size-borderWidth-default` is **2px** in this theme. Every hairline in
this design (table row rules, input borders, the 1px `Size/5`) must use
**`--sl-size-borderWidth-subtle`** (1px).

### Typography

Design font is **Lato**, which this theme uses — but by the _legacy_ token only:

- **`--sl-text-fontFamily` = `Lato`** ✅ — use this for `font-family`
- **`--sl-text-new-*-fontFamily` = `'Open Sans'`** ❌ — a theme defect (`theme.css:3651` hardcodes
  Open Sans while `theme.css:4390` sets `--sl-brand-text-new-body-lg-fontFamily: Lato`; the
  consumer token never references the brand layer). **Do not use the `-fontFamily` longhand from
  the `-new-` namespace** — it renders the wrong family.

**No `font:` shorthand token exists in this theme at all** (zero `--sl-text-*-*` shorthand names).
`font: var(--sl-text-new-body-md)` would silently drop the whole declaration. **Use longhands.**

Size/line-height longhands that match the design:

- `Base` / `Body large` = Lato 400, 16px/1.5 (24px) → `--sl-text-new-body-lg-fontSize` (16px) +
  `--sl-text-new-body-lg-lineHeight` (24px) + `--sl-text-new-body-lg-fontWeight` (400)
- `Base small` = Lato 400, 14px/1.5 (21px) → `--sl-text-new-body-md-fontSize` (14px);
  **line-height differs** — token is 20px, design 21px. Prefer the token.
- `Base small strong` = Lato 700, 14px → `--sl-text-new-body-md-fontSize` + weight 700
- `Links/Base primary link` = Lato 700, 16px → body-lg size + weight 700, colour `--sl-color-link-idle`
- `Title M` = Lato 700, 18px/1.5 (27px) → **no exact token** (heading-md is 16px, heading-sm 14px)
- `Title XL` = Lato 700, 26px/1.5 (39px) → **no exact token** (heading-lg is 24px, heading-xl 32px).
  Page title "Save course materials". Use `--sl-text-new-heading-lg-*` (24px) and accept a 2px
  delta, or set 26px raw — see OQ-8.

### Other

- `layer-shadow` = `drop-shadow(0 4px 8px #0000000D)` → **no exact token.** The theme's
  `--sl-elevation-shadow-*` set (`-overflow`, `-overlay`, `-sm`) uses different offsets/alphas.
  Closest is `--sl-elevation-shadow-overlay`. Record the choice; do not claim an exact match.
- `regular` = `Regular` (400), `bold` = `Bold` (700) → `--sl-fontWeight-regular` / `--sl-fontWeight-bold`

---

## Measured colours (sampled from `screenshot.png`, dominant-colour per region)

The reference PNG is 1024 × 615 — a **0.8 scale** of the 1280 × 768 frame. These are measured
pixels, not inferences, and they **override three guesses made earlier in this manifest**.

| Region                                     | Measured            | Exact `itslearning` token                                             |
| ------------------------------------------ | ------------------- | --------------------------------------------------------------------- |
| Page background (behind title, below card) | `#f2f2f2`           | **`--sl-color-background-neutral-bold`**                              |
| Content-block surface                      | `#ffffff`           | **`--sl-color-white`** (`--sl-color-background-plain` does not exist) |
| Banner background                          | `#ecf8ff`           | **`--sl-color-palette-blue-050`**                                     |
| Banner info glyph                          | `#0055b0`           | **`--sl-color-background-info-bold`**                                 |
| Table **header** row background            | `#f9f9f9`           | **`--sl-elevation-surface-raised-sunken`**                            |
| Table **data** row background              | `#ffffff`           | **`--sl-elevation-surface-raised-default`**                           |
| Row rule between data rows                 | `#ececec`           | **`--sl-color-palette-grey-200`** ← _not_ `#e1e1e1`                   |
| Link "Math 2c"                             | `#00458f`           | **`--sl-color-link-idle`**                                            |
| Status Tag fill                            | `#f4f4f4`           | **`--sl-color-palette-grey-100`**                                     |
| Selected page-link fill                    | `#5d4a68`           | **`--sl-color-palette-purple-700`** ← _not_ `#42354a`                 |
| Unselected page-link background            | `#ffffff`           | **`--sl-color-white`**                                                |
| Page-size select border                    | `#cccccc`→`#cfcfcf` | **`--sl-color-border-disabled`** (palette-grey-400)                   |
| Active tab underline                       | `#565656`           | **`--sl-color-foreground-subtle`**                                    |
| Body / heading text                        | `#333333`           | **`--sl-color-foreground-bold`**                                      |
| Course Hat badge fill                      | `#d9e3e8`           | ⚠️ **no token** (`$pigeongrey--100`)                                  |
| Course Hat glyph                           | `#72838d`           | ⚠️ **no token** (`$pigeongrey--200`)                                  |
| itslearning logo tile                      | `#f47920`           | brand asset, not a token                                              |

**Three corrections to the Token Reference above — the measured value wins:**

1. The selected page-link is **`$brand--700` `#5d4a68`**, not `$brand--800` `#42354a`. Use
   `--sl-color-palette-purple-700`. (This also dissolves the "no background token for `#42354a`"
   problem: that colour is not actually used as a background anywhere in the rendered design.)
2. The row rule is **`#ececec`** (`--sl-color-palette-grey-200`), not `#e1e1e1`.
3. The page background is **`#f2f2f2`** (`--sl-color-background-neutral-bold`), not `#f4f4f4`.

**The Course Hat is the only element whose exact colours have no token in this theme.** Both
`$pigeongrey--100` and `$pigeongrey--200` are absent. Combined with the missing `graduation-cap`
glyph, the Course Hat cannot be reproduced faithfully by any token-clean route — record it as a
Stage 4 discrepancy rather than hardcoding two raw hexes.

---

# Decomposition

> **Provenance.** `component-decomposer` was spawned with the manifest, the screenshot and the
> conventions, and overran without returning. Rather than stall the run, the coordinator authored
> this section. Recorded as a Stage 2 finding in `progress.json`.

## Component tree

```
sl-itsl-course-files-page            ← root, owns ALL data          (level 2)
├── sl-itsl-top-nav                  ← two-tier product shell        (level 1)
├── sl-inline-message variant=info   ← composed, not generated
├── sl-itsl-course-table             ← header row + data rows        (level 1)
│   └── sl-badge  (status pill)      ← composed inside the row renderer
└── sl-paginator + -status + -page-size  ← composed, not generated
```

**Three generated components.** The screen has 519 nodes and 44 Figma component types; a developer
would place three. Everything else is either an SLDS component composed as-is or plain layout.

**Dependency levels for spawning:** level 1 = `sl-itsl-top-nav`, `sl-itsl-course-table` (parallel,
no dependency on each other); level 2 = `sl-itsl-course-files-page` (imports both children's
classes and their exported model types).

## Decisions on the five specific questions

- **Table → bespoke markup, not `sl-grid`.** `sl-grid` can express the columns, but matching the
  design needs three _private_ custom properties (`--_border-width` for the 1px rule, which
  defaults to 2px in this theme; `--_body-cell-padding-block` and `--_head-cell-padding-block` for
  the 48px/32px row heights). A generated component reaching into another component's private API
  in three places is worse than honest bespoke markup — and the design's own row component is
  documented as "detach before using… make a new local component", which says the same thing.
  Recorded as OQ-1; `sl-grid` remains the right answer for a real feature with sorting and
  virtualisation, and that trade-off is the finding.
- **Navigation → one component, `sl-itsl-top-nav`,** with both tiers inside it. They are one
  112px sticky unit and always appear together; splitting them creates a parent that does nothing
  but stack two children.
- **Pagination → compose `sl-paginator` + `sl-paginator-status` + `sl-paginator-page-size`.**
  `totalItems=47, pageSize=10` yields exactly the design's five pages. This is the one place the
  real design system fits the design almost perfectly, so bespoke would be indefensible.
- **Hidden nodes do NOT render and are NOT modelled.** The Search bar (`4007:3170`) and the fifth
  table row (`4008:9150`) are `hidden=true`. Modelling them would invent API surface the design
  does not ask for.
- **Course Hat renders as a plain circle with no glyph.** `graduation-cap` is not in the theme and
  must not be hand-drawn; the badge's own `#d9e3e8`/`#72838d` have no tokens either. It renders as
  an empty circle using the nearest tokens, and the missing glyph is a Stage 4 discrepancy. A
  deliberate hole, not an accident.

## Per-component API

### `sl-itsl-top-nav` (level 1, presentational)

```ts
export interface TopNavModel {
  items: Array<{ id: string; label: string }>;   // Courses, Updates, Groups, Calendar, Library
  activeItemId?: string;
  sectionLabel: string;                          // "Files"
  tabs: Array<{ id: string; label: string }>;    // Your files, Save course materials
  activeTabId?: string;
  searchPlaceholder: string;                     // "Search"
  user: { name: string; initials?: string };     // avatar; pictureUrl omitted (no asset export)
}
@property({ attribute: false }) model?: TopNavModel;
```

Exports `TopNavModel`. Emits `sl-itsl-nav-select` (CustomEvent<string>).

### `sl-itsl-course-table` (level 1, presentational)

```ts
export type CourseStatus = 'archived' | 'deleted';           // stable keys, not labels
export interface CourseRow {
  id: string; name: string; href?: string;
  status: CourseStatus; teacher: string; lastUpdated: string;
}
export interface CourseTableModel { rows: CourseRow[]; sort?: { column: 'teacher' | 'lastUpdated'; direction: 'asc' | 'desc' } }
@property({ attribute: false }) model?: CourseTableModel;
```

Column definitions (labels, widths, which are sortable) are **structure, not data** — constants
inside the component, per the conventions. Status labels are derived from the `status` key inside
`render`. Exports `CourseRow`, `CourseStatus`, `CourseTableModel`. Emits `sl-itsl-sort`.

### `sl-itsl-course-files-page` (level 2, root, data owner)

Holds the demo data (with a comment marking where a fetch would go), renders the page background,
title, content block, banner, table and paginator, and passes each child one model object.
No required properties — `<sl-itsl-course-files-page></sl-itsl-course-files-page>` renders the
whole design. Uses `ScopedElementsMixin`, so **both child tags plus every composed `sl-*` tag must
be listed in `scopedElements`**.

## Shared Types / Contracts

| Interface                                       | Exported by            | Consumed by |
| ----------------------------------------------- | ---------------------- | ----------- |
| `TopNavModel`                                   | `sl-itsl-top-nav`      | page root   |
| `CourseRow`, `CourseStatus`, `CourseTableModel` | `sl-itsl-course-table` | page root   |

## Independently meaningful for Stage 4

`sl-itsl-course-files-page` (the whole design — primary), plus `sl-itsl-top-nav` and
`sl-itsl-course-table`, which each stand alone. The composed SLDS components are not re-validated.

## Open questions, with the default chosen

| #     | Question                                                                 | Default chosen                                                                                                            |
| ----- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| OQ-1  | `sl-grid` or bespoke table markup?                                       | **Bespoke** — `sl-grid` needs 3 private `--_*` overrides to match                                                         |
| OQ-2  | Is the nav part of this design at all, or app shell?                     | **Include it** — it is in the frame and in the pixel comparison                                                           |
| OQ-3  | One nav component or two (main / secondary tier)?                        | **One**                                                                                                                   |
| OQ-4  | `sl-badge` or `sl-tag` for the Status Tag?                               | **`sl-badge`** — the design's pill is fully rounded (measured corner inset 7,5,3,2,1); `sl-tag` is a 4px-radius rectangle |
| OQ-5  | Do Archived and Deleted get different colours?                           | **No** — both render identically in the design (`#f4f4f4` fill); the itslearning doc says "colors shouldn't be changed"   |
| OQ-6  | Are the four identical "Math 2c" rows real data or filler?               | **Reproduce verbatim** — the screenshot is the pixel ground truth                                                         |
| OQ-7  | Apply the designer annotations ("Change to 'courses'/'Teachers'")?       | **No** — render what is drawn; annotations are to-dos                                                                     |
| OQ-8  | Page title is 26px; theme has 24px and 32px                              | **`--sl-text-new-heading-lg-*` (24px)**, accept a 2px delta rather than hardcode                                          |
| OQ-9  | `Title M` 18px has no token                                              | Use **16px `heading-md`**; 18px is off-scale                                                                              |
| OQ-10 | `Base small` line-height: design 21px, token 20px                        | **Prefer the token** (20px)                                                                                               |
| OQ-11 | Course Hat with no glyph — empty circle, or omit entirely?               | **Empty circle** — preserves layout and row rhythm; the hole is visible and recorded                                      |
| OQ-12 | Avatar photo (`imgPhoto`) with no asset export                           | **Initials fallback**, no `<img>`                                                                                         |
| OQ-13 | Logo tile `#f47920` is a brand asset, not a token                        | **Solid orange tile, no glyph**; recorded as a discrepancy                                                                |
| OQ-14 | `layer-shadow` has no exact token                                        | **`--sl-elevation-shadow-overlay`**, closest available                                                                    |
| OQ-15 | Should the table be a real `<table>` or divs?                            | **Real `<table>`** with `scope="col"` — it is tabular data; accessibility over convenience                                |
| OQ-16 | Sortable headers interactive, or static to match the still?              | **Interactive buttons** that emit `sl-itsl-sort`; visually identical at rest                                              |
| OQ-17 | Is the page background part of the component or the story?               | **The component** paints `#f2f2f2`, so the story needs no wrapper                                                         |
| OQ-18 | Pagination status text differs ("1 - 10 of 47 items" vs "1 to 10 of 47") | **Accept the component's text**; do not fork it. Recorded as a Stage 4 discrepancy                                        |

---

# Decomposition — AUTHORITATIVE (component-decomposer, returned 434s)

> **Coordinator error, recorded.** I concluded the decomposer had stalled and authored the section
> above myself, dispatching two implementers before it returned. It had not stalled — it was
> working, and its answer is better evidenced than mine (it read the actual sources of
> `paginator`, `inline-message`, `badge`, `tag`, `avatar`, `select`, `search-field`, `text-field`,
> `link` and `grid`). **This section supersedes the one above** except where noted. The section
> above is kept, not deleted, because the divergence is itself a finding.

## Tree — five components (vs my three)

```
sl-itsl-course-files-page              ← root, owns ALL data
  ├── sl-inline-message                ← composed, existing
  ├── sl-itsl-main-menu                ← tier 1 (sl-text-field, sl-button, sl-icon, sl-avatar)
  ├── sl-itsl-section-menu             ← tier 2 (plain markup)
  ├── sl-itsl-course-table             ← (sl-icon)
  └── sl-itsl-pagination-bar           ← (sl-button, sl-icon, sl-select, sl-option)
```

Level 0 (parallel): main-menu, section-menu, course-table, pagination-bar. Level 1: the page.

Deliberately **not** components: content block, page title, course row (`<tr>`), cell (`<td>`),
Course Hat (`<span>`), Status Tag (`<span>`), page link.

## Where the decomposer overruled the coordinator, with its evidence

| Topic                   | My call                | Decomposer                                                                                                                                              | Adopted?                                                                    |
| ----------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Pagination              | compose `sl-paginator` | **bespoke** — four source-verified mismatches                                                                                                           | **Decomposer.** See below                                                   |
| Status Tag              | `sl-badge`             | **bespoke `<span>`** — `sl-badge` is borderless; `sl-tag` is focusable + `ElementInternals`, and the itslearning spec says the tag is "not interactive" | **Decomposer**                                                              |
| Nav                     | one component          | **two** (`main-menu` + `section-menu`)                                                                                                                  | **Coordinator kept** — implementer already running; recorded as a deviation |
| `sl-link` for "Math 2c" | (unstated)             | **plain `<a>`** — `sl-link` is "styled as a button" and injects new-tab icons                                                                           | Decomposer                                                                  |
| `sl-search-field`       | (unstated)             | **reject** — renders the magnifier as a _prefix_; design has a trailing button                                                                          | Decomposer                                                                  |
| Table                   | bespoke                | bespoke (agreed, same reasoning)                                                                                                                        | —                                                                           |

**The four `sl-paginator` mismatches, none reachable through the public API:**

1. hardcodes `caret-left-solid` / `caret-right-solid`; the design uses `chevron-left`/`-right`
   (`paginator.ts:221,336`)
2. `sl-paginator-status` emits `"1 - 10 of 47 items"` from a baked `msg(str\`${start} - ${end} of …\`)`;
design says `"1 to 10 of 47"` (`status.ts:137-139`)
3. `sl-paginator-page-size` always renders a visible `<sl-label>Items per page:</sl-label>`
   (`page-size.ts:124-126`); the design has a bare 80px select
4. the selected page uses `fill=solid variant=primary`, whose theme colour is not the design's purple

## ⚠️ Correction the coordinator must apply to the decomposer's output

The decomposer specifies the selected page fill as `--sl-color-palette-purple-800` (`#42354a`),
taken from the _pre-measurement_ part of this manifest. **That is wrong.** The measured pixel is
**`#5d4a68` → `--sl-color-palette-purple-700`** (see "Measured colours"). The decomposer read a
stale section; the measurement wins. This is exactly the failure mode the batch warns about — a
plausible token that is the wrong value — and it very nearly shipped.

## Shared Types / Contracts (decomposer's, adopted verbatim)

`MainMenuItemId`, `MainMenuUser`, `MainMenuModel` ← main-menu ·
`SectionTabId`, `SectionMenuModel` ← section-menu ·
`CourseStatus`, `CourseTableColumnId`, `SortDirection`, `CourseTableSort`, `CourseRow`,
`CourseTableModel` ← course-table · `PaginationModel` ← pagination-bar ·
`CourseFilesPageData` ← page (aggregate).

`CourseRow` carries **stable keys and data only**: `status: 'archived'|'deleted'` (labels live in
the component), `teachers: string[]` rendered as "Floyd Miles and 2 more", `lastUpdatedAt` as ISO
`'2024-04-05'` formatted with `Intl.DateTimeFormat('en-GB')` → `05/04/2024`.

Event names are `sl-itsl-*` prefixed throughout, because `sl-page-change`, `sl-page-size-change`,
`sl-dismiss`, `sl-remove` and `sl-search` are already taken by SLDS components.

## Open questions — all 31, with the default chosen

| #   | Question                                                    | Default chosen                                                                                          |
| --- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 1   | `sl-grid` or bespoke `<table>`?                             | **Bespoke** — grid needs 3 private `--_*` overrides (2px rules, private cell padding)                   |
| 2   | Generate a `sl-itsl-course-row`?                            | **No** — a custom element cannot legally sit between `<tbody>` and `<td>`; it would break column tracks |
| 3   | Compose `sl-paginator` trio or bespoke?                     | **Bespoke** — four unreachable mismatches                                                               |
| 4   | `sl-select` for the 80px page size?                         | **Yes** — real listbox semantics beat pixels; glyph unverified                                          |
| 5   | Does `sl-inline-message` info bg match `#ecf8ff`?           | **Use as-is, measure at Stage 4**                                                                       |
| 6   | Persist banner dismissal?                                   | **No**                                                                                                  |
| 7   | Course Hat with no `graduation-cap`?                        | **20px empty circle**, `aria-hidden` — dropping it shifts every row ~28px                               |
| 8   | `bell`/`comment`/`your-files`/logo all missing              | **Omit the two brand images; reserve 32px empty boxes for bell/comment** to keep the avatar's x         |
| 9   | Tooltip explaining the empty circle?                        | **No** — inventing a label is worse than silence                                                        |
| 10  | Model the hidden Search bar?                                | **No** — no speculative API                                                                             |
| 11  | Model the hidden 5th row?                                   | **Nothing to do** — `rows` is already an array                                                          |
| 12  | Design shows 4 rows but says "1 to 10 of 47"                | **Reproduce exactly**; flag as a _design_ defect, do not "fix"                                          |
| 13  | `--sl-size-borderRadius-full` is outside the manifest       | **Use it** (verified present; badge.css uses it), flagged                                               |
| 14  | Cell inline padding unmeasured                              | **`--sl-size-150`** (12px)                                                                              |
| 15  | Main-menu gaps unmeasured                                   | **24px between links, 16px in the right cluster**                                                       |
| 16  | Title 26px; tokens are 24/32                                | **`heading-lg` 24px**, accept 2px                                                                       |
| 17  | "Files" label 18px; tokens 16/14                            | **`heading-md` 16px**, accept 2px                                                                       |
| 18  | `layer-shadow` has no exact token                           | **`--sl-elevation-shadow-overlay`**, inexact                                                            |
| 19  | `#f9f9f9` maps to two tokens                                | **`--sl-color-palette-grey-050`** — flat bg, not an elevation surface                                   |
| 20  | Headers 14px, cells 16px?                                   | **Yes** — easy to get backwards, check at Stage 4                                                       |
| 21  | body-md line-height 20px vs design 21px                     | **Use the token**                                                                                       |
| 22  | One nav component or two?                                   | **Two** — different lifetimes _(coordinator deviated: built as one)_                                    |
| 23  | Is the nav in scope at all?                                 | **Yes** — it is in the pixel ground truth                                                               |
| 24  | `role="navigation"` on both menus?                          | **Yes**, distinct labels ("Main", "Files")                                                              |
| 25  | Section tabs an ARIA tablist?                               | **No** — they navigate, they don't switch panels                                                        |
| 26  | Nav search control?                                         | **`sl-text-field` + suffix `sl-button`**; `sl-search-field` puts the icon on the wrong side             |
| 27  | `teachers: string[]` or `teacherSummary: string`?           | **`string[]`** — keeps "and N more" in the component; cost: 2 invented names                            |
| 28  | ISO date + `Intl` or pre-formatted?                         | **ISO + `Intl('en-GB')`** → exactly `05/04/2024`; decides the ambiguous date is DD/MM                   |
| 29  | Emit `sl-itsl-course-select` when rows are real `<a href>`? | **Yes**, with the href as the no-JS fallback                                                            |
| 30  | Root `data` required or defaulted?                          | **Defaulted to the mock** — zero-arg story renders the design                                           |
| 31  | Apply the "Change to 'courses'/'Teachers'" annotations?     | **No** — render what is drawn                                                                           |

**Net-new primitives: approve none.** Course Hat degrades to a `<span>`; `your-files` and the
logo are brand images with no asset-export step.
