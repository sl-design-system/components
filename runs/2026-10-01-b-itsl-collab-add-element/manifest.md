# Design Manifest — Add element [3rd implementation]

Run: `b-itsl-collab-add-element` · theme `itslearning` · framework `lit` · i18n **off**
Figma: file `Q3gzx1pCseyKnFNDUOOjCw`, node **`5006:43051`**, 1280 × 768.
**Frame identity verified:** `get_metadata` reports the ingested node's own name as
`Add element [3rd implementation]` at id `5006:43051` — the node the URL points at, not a
neighbouring variant. (Sibling variants of the category grid do exist, but as _hidden_ children
_inside_ this frame, not as separate frames.)

## Overview

A desktop screen in the itslearning app shell: an "Add element to [folder name]" page in a
course's Resources area. Top navigation shell, a page header with breadcrumbs + title, two
actions ("Upload file", "Create folder"), and a bordered "Resources" panel holding a wrapped grid
of category links (Excel / PowerPoint / Word / Page), each an illustrated icon + bold title +
description. Three further category-grid variants (Google Docs / Slides / Sheets) exist as hidden
siblings. `[folder name]` is a literal bracketed placeholder in the design copy.

## Existing SLDS Components Used

`get_code_connect_map` returned an **empty map `{}` for every node probed** on the remote `figma`
server — **0 resolved, 0 `hasTemplate: false`, 0 explicit-null**. Nested instance ids
(`I5006:43052;9976:10654`) are rejected outright by the remote server's input validation
(`Node ID must be in the format "123:456"`). Every row below is therefore _identified_, not
CC-verified, via `get_design_context`'s "Component descriptions" block cross-referenced against
this repo's `packages/components/*` registrations.

| Node ID                | Node Name                | Mapped Component                                 | Basis                                                                               |
| ---------------------- | ------------------------ | ------------------------------------------------ | ----------------------------------------------------------------------------------- |
| 5006:43058             | Button ("Upload file")   | `sl-button` variant primary                      | identified                                                                          |
| 5006:43059             | Button ("Create folder") | `sl-button` variant secondary                    | identified                                                                          |
| I5006:43056;19853:9045 | Breadcrumb trail         | `sl-breadcrumbs`                                 | identified; Figma note: "when used inside PageHeader do not show current location!" |
| I5006:43056;20314:6654 | Status Tag (hidden)      | `sl-tag`                                         | identified; not visible in this state                                               |
| 5006:43052             | Navigation               | app-shell top nav — **no `sl-*` package exists** | out of scope as a DS component; must be built as run-local markup                   |

## Composition Candidates

- **Page header** (`5006:43056`) — breadcrumbs + title + hidden actions slot. Not a single package;
  compose `sl-breadcrumbs` + heading.
- **Resources panel** (`5006:43061`, "Content-block") — bold "Resources" title + wrapped row of
  CategoryLink items. Bordered, rounded, padded → **`sl-panel`** (has `heading`, default slot,
  `::part(content)`); _not_ `sl-card`, whose media/title/actions layout does not fit.
- **CategoryLink** (`5006:43064/69/74/79`) — 48×48 illustrated icon + bold title + description.

## Net-New Primitive Candidates

- **File-type icon set** — `xlsx`, `pptx`, `docx`, `page` (+ hidden `file`, `google-doc`,
  `google-slides`, `google-sheets`). Each is a multi-colour illustration of 8–11 stacked `Vector`
  paths. **Structurally incompatible with `sl-icon`**, which renders monochrome via
  `fill="var(--sl-icon-fill-default)"`. Not in the theme's `icons.ts`. The pipeline has no
  asset-export step, so these cannot be obtained — see Icons below.

## Responsive Breakpoints

Single breakpoint, **1280px** (frame width; `screen-width: 1280`, `ca-max-width: 1280`).

## Designer Annotations

None.

## Token Reference

> **Corrected by the orchestrator against `packages/themes/itslearning/theme.css`.** The Stage 1
> analyst proposed the `--sl-text-*` / `--sl-title-*` / `--sl-heading-*` family; every one of those
> resolves to a _different size than it assumed_ and none has a `-fontFamily` longhand at all.
> The authoritative family for this theme is **`--sl-text-new-*`**. Use only the names below.

### Typography — `--sl-text-new-*` longhands ONLY

**The itslearning theme ships NO bare `--sl-text-new-*` shorthand.** `font: var(--sl-text-new-…)`
resolves to nothing and the browser **drops the whole declaration silently**. Always write the four
longhands separately.

| Design role                  | Figma                    | Token prefix (`--sl-text-new-`)        | Resolves to                 |
| ---------------------------- | ------------------------ | -------------------------------------- | --------------------------- |
| Page title "Add element to…" | Title XL, Bold 26px      | `heading-lg-*`                         | 24px / 32px lh — **Δ −2px** |
| Panel heading "Resources"    | Title L, Bold 22px       | supplied by `sl-panel`'s own `heading` | —                           |
| Category title "Excel"       | Base strong, Bold 16px   | `heading-md-*`                         | 16px / 20px lh — exact      |
| Category description         | Base small, Regular 14px | `body-md-*`                            | 14px / 20px lh — exact      |
| Breadcrumb link              | Base small, Regular 14px | `body-md-*`                            | 14px / 20px lh — exact      |

`heading-*` has **`-fontFamily`, `-fontSize`, `-lineHeight` but NO `-fontWeight`** — add an explicit
`font-weight: var(--sl-fontWeight-600)` (semibold) or `var(--sl-fontWeight-700)` (bold).
`body-*` does have `-fontWeight` (400).

**Font-family mismatch (record, do not fix):** Figma's `default-font` is **Lato**; every theme
typography token is **`'Open Sans'`**. Use the theme token.

### Colour — exact semantic tokens (resolved through the full `var()` chain)

| Design value             | Role                | Exact SLDS semantic token                          |
| ------------------------ | ------------------- | -------------------------------------------------- |
| `#008859` `$accent--600` | primary button fill | `--sl-color-background-primary-bold`               |
| `#e1e1e1` `$gray--300`   | borders / dividers  | `--sl-color-border-plain`                          |
| `#565656` `$gray--700`   | secondary text      | `--sl-color-foreground-subtle`                     |
| `#757575` `$gray--600`   | muted text          | `--sl-color-foreground-subtlest`                   |
| `#f2f2f2` `$gray--150`   | page background     | `--sl-color-background-neutral-bold`               |
| `#ececec` `$gray--200`   | —                   | `--sl-color-background-inverted-interactive-plain` |

**Two genuine gaps** (checked exhaustively, not approximations):

- `#333333` `$gray--900`/`$text` — body & heading text. **No `--sl-color-foreground-*` token
  resolves to `#333333`.** Nearest by role is `--sl-color-foreground-plain` = `#4a4a4a`. Use it.
- ~~**No white surface/card background token exists.**~~ **CORRECTED at Stage 6 — this claim was
  wrong.** `--sl-elevation-surface-raised-default` resolves to `#ffffff` and is exactly what
  `sl-panel` itself uses for the same white-card surface. It is a _role_ token, so it is the right
  answer for the two chrome bars, better than the literal primitive `--sl-color-white` that OQ1
  originally chose. The search that produced the wrong claim only swept
  `--sl-color-background-*`; the surface role lives under the `--sl-elevation-*` namespace.
  **Lesson: a token search scoped to one namespace prefix can manufacture a phantom gap.**

`$bronze--100` `#feebbb` / `$bronze--200` `#ae7c3f` — out-of-scope "Course Hat" only; no bronze
family and no exact hex in any palette family. Genuinely unbound.

### Size / Spacing — `Size/N` maps exactly onto `--sl-size-*`

`Size/10`→`--sl-size-025` (2) · `Size/25`→`--sl-size-050` (4) · `Size/50`→`--sl-size-100` (8) ·
`Size/100`→`--sl-size-150` (12) · `Size/200`→`--sl-size-175` (14) · `Size/300`→`--sl-size-200` (16) ·
`Size/500`→`--sl-size-250` (20) · `Size/700`→`--sl-size-300` (24) · `Size/900`→`--sl-size-400` (32) ·
`ca-horisontal-margin` 48→`--sl-size-600` · `Actions/actions-gap` 12→`--sl-size-150` ·
content-block padding 32/20→`--sl-size-400` / `--sl-size-250` ·
`border-radius` 4→**`--sl-size-borderRadius-md`** (verified = 4px).

Genuinely absent from the size scale (font sizes only, route via typography): 18px, 22px, 26px.

## Icons — only what `packages/themes/itslearning/icons.ts` registers (54 total)

| Icon needed                      | Used by                | Registered?                         | Action                             |
| -------------------------------- | ---------------------- | ----------------------------------- | ---------------------------------- |
| `chevron-right`                  | breadcrumb separators  | **Yes**                             | use (`sl-breadcrumbs` supplies it) |
| `search`                         | nav search             | **Yes**                             | use                                |
| `ellipsis` / `ellipsis-vertical` | course bar overflow    | **Yes**                             | use                                |
| `file-import` (upload)           | "Upload file" button   | **No**                              | **omit** → Stage 4 discrepancy     |
| `folder-plus`                    | "Create folder" button | **No**                              | **omit** → Stage 4 discrepancy     |
| `bell`                           | nav notifications      | **No**                              | **omit** → Stage 4 discrepancy     |
| `comment` / `message`            | nav messages           | **No**                              | **omit** → Stage 4 discrepancy     |
| `graduation-cap`                 | course avatar          | **No**                              | **omit** → Stage 4 discrepancy     |
| `xlsx` `pptx` `docx` `page`      | category tiles         | **No** (multi-colour illustrations) | **omit** → Stage 4 discrepancy     |

**Hard rule for this run:** do NOT import `@fortawesome/*` (not installed, no credential), do NOT
stub the module, do NOT hand-draw a replacement SVG. A missing icon is left out and recorded.

---

# Decomposition

Framework **lit** · i18n **off** · output `examples/lit/src/_runs/b-itsl-collab-add-element/`

## Component Tree

```
<sl-add-element-page>                    root — owns all data, sole global registration
  ├── <sl-its-top-nav>                   app-shell chrome   → sl-search-field, sl-avatar
  ├── <sl-its-course-bar>                app-shell chrome   → sl-avatar, sl-button, sl-icon
  ├── <sl-add-element-header>            feature            → sl-breadcrumbs, sl-button ×2
  └── <sl-resource-category-panel>       feature            → sl-panel + plain <ul>/<li>
```

Four new children + root. **No component per category tile** (icon + text with no interactive
state = an `<li>`), no component per nav link, no component per breadcrumb.

App-shell chrome is **in scope**: it occupies the top 108px of a 768px frame and sets the vertical
origin for everything below — omitting it would shift every remaining element up by 108px and
score an otherwise-correct page as a miss. It is isolated into its own components, marked as
shell stand-ins with no `sl-*` package behind them.

Course-bar tabs are **route links** (`<nav><ul><li><a>`), not `sl-tab-group` — there is no in-page
panel content.

## Open Questions — all 22, with the default chosen

| #   | Question                                                                                                              | Default chosen                                                                                                                                                                                                                  |
| --- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | What paints the white nav/course-bar surface, given no white surface token exists?                                    | **OVERRIDE → `var(--sl-color-white)`, then CORRECTED at Stage 6 → `var(--sl-elevation-surface-raised-default)`.** The premise was false: a white _surface role_ token does exist, under `--sl-elevation-*`. Final code uses it. |
| 2   | Placeholder square for the unobtainable file-type illustrations, or nothing?                                          | 48×48 CSS square, `--sl-color-background-inverted-interactive-plain`, `aria-hidden`. Preserves tile metrics so only the illustration diffs.                                                                                     |
| 3   | Nav search: `sl-search-field` or bespoke field + attached square button?                                              | `sl-search-field`. Shape difference recorded as minor discrepancy.                                                                                                                                                              |
| 4   | Course circle now that `graduation-cap` is unregistered?                                                              | `sl-avatar` with `displayName = courseName` → initials "NS". Peach fill + cap glyph recorded as losses.                                                                                                                         |
| 5   | User avatar photo we do not have — initials or blank?                                                                 | `sl-avatar` with invented mock name "Anna Nilsson", no `pictureUrl`.                                                                                                                                                            |
| 6   | `role="banner"` / `<header>` on the top nav?                                                                          | No. `<nav aria-label="Main navigation">` + neutral `<div>`; host app owns page landmarks.                                                                                                                                       |
| 7   | Category labels: data or component-side constant table?                                                               | Data on `ResourceCategory` — the enabled set is tenant-configurable.                                                                                                                                                            |
| 8   | Root accepts `courseId`/`folderId`, or fully static mock?                                                             | Fully static, no properties. Story renders `<sl-add-element-page>` bare.                                                                                                                                                        |
| 9   | Nav links / tabs / breadcrumbs fire navigation events?                                                                | No. Plain `<a href="#">`. Events only for search, overflow, upload, create-folder, category-select.                                                                                                                             |
| 10  | Action row in the header component or the root?                                                                       | In `sl-add-element-header`, despite Figma placing the buttons as siblings of the header node.                                                                                                                                   |
| 11  | Category tiles: links or buttons?                                                                                     | `<a href>` **and** emit `sl-resource-category-select`. Honours the "CategoryLink" node name, keeps middle-click.                                                                                                                |
| 12  | Is `sl-breadcrumbs` (manual slot assignment + MutationObserver + injected tooltips) safe to feed from a Lit template? | Render from Lit, **verify in Stage 4**; fall back to `<nav><ol>` of styled `<a>` if it misbehaves.                                                                                                                              |
| 13  | Show current location? Trailing chevron after `[folder name]`?                                                        | Render both crumbs; accept the missing trailing chevron as a recorded discrepancy. Figma's own note contradicts this frame.                                                                                                     |
| 14  | `no-home` on `sl-breadcrumbs`?                                                                                        | Yes — default is the opposite of the design.                                                                                                                                                                                    |
| 15  | `sl-panel` renders `heading` into a slot, not an `<h2>`. Accept?                                                      | **OVERRIDE → slot `<h2 slot="heading">Resources</h2>`.** One line, fixes the missing document `<h2>`.                                                                                                                           |
| 16  | Description colour: `foreground-subtle` (#565656) or `-subtlest` (#757575)?                                           | `--sl-color-foreground-subtle`.                                                                                                                                                                                                 |
| 17  | Include hidden Google Docs/Slides/Sheets in `ResourceCategoryId`?                                                     | Yes in the union type, **no** in the mock data. Four visible categories only.                                                                                                                                                   |
| 18  | Constrain content column to `ca-max-width: 1280`?                                                                     | Omit. Invisible at the only breakpoint; would be an untokenized magic number.                                                                                                                                                   |
| 19  | Add the six `@sl-design-system/*` packages to `examples/lit/package.json`?                                            | **OVERRIDE → no.** Verified all six are already linked in `node_modules/`, and the neighbouring `b-nsp-home` run imports them without any `package.json` change. Keeps the run from touching shared files.                      |
| 20  | Shared interfaces colocated or hoisted to `models.ts`?                                                                | Colocated; each child exports what it consumes, root imports.                                                                                                                                                                   |
| 21  | Register the root in `examples/lit/src/index.ts`?                                                                     | No. `_runs/` is deliberately outside the public example surface.                                                                                                                                                                |
| 22  | Approve the file-type illustration set as a net-new primitive?                                                        | **Not approved.** Multi-colour illustrations are not an `sl-icon` extension; they would need a new primitive + asset pipeline. Separate DS proposal, not a side effect of this run.                                             |

## Shared Types / Contracts

Colocated with the component that consumes them; the root imports all of them.

- `sl-its-top-nav` exports `NavLink { id, label, href, current? }`, `NavUser { id, displayName, pictureUrl? }`, `TopNavModel { brandHref, links, user }`, `SlTopNavSearchEvent = CustomEvent<{ query: string }>`
- `sl-its-course-bar` exports `CourseTab { id, label, href }`, `CourseBarModel { courseId, courseName, courseImageUrl?, tabs, activeTabId? }`, `SlCourseBarOverflowEvent = CustomEvent<void>`
- `sl-add-element-header` exports `BreadcrumbLink { id, label, href }`, `AddElementHeaderModel { breadcrumbs, folderName }`, `SlUploadFileActionEvent = CustomEvent<void>`, `SlCreateFolderActionEvent = CustomEvent<void>`
- `sl-resource-category-panel` exports `ResourceCategoryId` (union incl. hidden variants), `ResourceCategory { id, label, description, href? }`, `ResourcePanelModel { categories }`, `SlResourceCategorySelectEvent = CustomEvent<{ categoryId: ResourceCategoryId }>`

Five distinct event names, no collisions: `sl-top-nav-search`, `sl-course-bar-overflow`,
`sl-upload-file-action`, `sl-create-folder-action`, `sl-resource-category-select`.

## Dependency Order

Level 1 (parallel): `its-top-nav`, `its-course-bar`, `add-element-header`, `resource-category-panel`
Level 2: `add-element-page` (+ its story).
