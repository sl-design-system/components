# Design Manifest — A6 `Shared folder - teacher view`

Run: `a6-itsl-collab-shared-folder` · theme `itslearning` · framework `lit` · i18n **off**
Figma: file `Q3gzx1pCseyKnFNDUOOjCw`, node **`4200:13792`**, 1280 × 1335.
Mode: **as-is** (the frame is drawn against itslearning's own Figma library, not SLDS).

> The authoritative, independently re-resolved colour/type/size table is
> [`token-reference.md`](token-reference.md) — built by resolving every `--sl-*` declaration in
> the theme through its full `var()` chain and looking tokens up **by resolved value**. Where this
> manifest and that file differ, that file wins.

## Overview

An itslearning course page for a shared-files folder in teacher view: a two-row global/course
navigation bar, a page header with breadcrumb trail and overflow action, a description card, and a
main content block holding a search field, an Add/Actions action row (with the Actions dropdown
shown **open**), a select-all control, a 9-row file table (1 header + 8 data rows) and a paginator
— beside a 400 px "Settings summary" sidebar card. Two purple **`Heading`** nodes (`4571:8205`,
`4571:8212`) are a11y annotation overlays from the A11y Annotation Kit, **not product UI**.

## Existing SLDS Components Used

Code Connect probe: the root and all 25 top-level instances returned a literal empty map `{}` —
**0 resolved, 0 `hasTemplate:false`, 0 `null`, 0 rejected**. Every mapping below is _identified_
by analysis (node name + Figma component description + rendered structure), never CC-verified.

| Node ID                                           | Node Name                                                         | Mapped Component                                                               | Basis                                                                         |
| ------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `4200:13797` → `I4200:13797;19853:9719`           | PageHeader → Breadcrumb wrapper (`Breadcrumb trail` `5483:11343`) | `<sl-breadcrumbs>`                                                             | identified; 5 crumbs, chevron-right separators                                |
| `I4200:13797;5823:6544`                           | PageHeader → Actions slot → Button (ellipsis)                     | `<sl-button fill="outline">` + `<sl-icon name="ellipsis">`                     | identified                                                                    |
| `4411:11843`                                      | Search                                                            | `<sl-search-field>`                                                            | identified; Figma description names Prometheus `SearchInput`                  |
| `4411:11845`                                      | Standalone link ("Add")                                           | `<sl-button variant="primary">` (semantically a link)                          | identified                                                                    |
| `4573:9232`                                       | Button ("Actions")                                                | `<sl-menu-button>`                                                             | identified; drives dropdown `4099:12638`                                      |
| `4099:12638`                                      | Dropdown (Move to / Download / Delete)                            | `<sl-menu>` + `<sl-menu-item>` ×3                                              | identified                                                                    |
| `4495:50574`                                      | Checkbox ("Select all visible")                                   | `<sl-checkbox>`                                                                | identified                                                                    |
| `4411:11853`                                      | table                                                             | `<sl-grid>`                                                                    | identified                                                                    |
| `4411:11854`                                      | 🛠️ Row (header)                                                   | `<sl-grid-selection-column>` + `<sl-grid-sort-column>` ×3 + `<sl-grid-column>` | identified                                                                    |
| `4411:11855`–`4411:11862`                         | 🛠️ Row (data) ×8                                                  | `<sl-grid>` rows                                                               | identified                                                                    |
| `I4411:1185x;4088:16276;18131:6496`               | Cell → Button (ellipsis)                                          | `<sl-button fill="ghost">` + `<sl-icon name="ellipsis">`                       | identified                                                                    |
| `4411:11863` → `5512:7935`                        | Pagination                                                        | `<sl-paginator>` + `<sl-paginator-status>` + `<sl-paginator-page-size>`        | identified                                                                    |
| `I5512:7947;29:7275`                              | Pagination → Select (page size "10")                              | `<sl-select>`                                                                  | identified                                                                    |
| `4200:13814`                                      | Card (Description)                                                | `<sl-card>`                                                                    | identified                                                                    |
| `4411:11840`                                      | Content-block                                                     | `<sl-card>`                                                                    | identified                                                                    |
| `4994:15549`                                      | settings summary                                                  | `<sl-card>`                                                                    | identified                                                                    |
| `I4994:15549;4994:12281`                          | settings summary → Button ("Edit")                                | `<sl-button fill="outline">`                                                   | identified                                                                    |
| inline links in `4200:13815`                      | "Read all about author", "You can use page about Donna Tartt"     | `<sl-link>`                                                                    | identified; Figma says inline links are **not** the Standalone link component |
| `I4200:13793;9976:10654;11704:5609`               | Navigation → Search (global, 264 px)                              | `<sl-search-field>`                                                            | identified; `Global=true` → Prometheus `GlobalSearch`                         |
| `I4200:13793;9976:10654;9976:10636` → `2275:4904` | Navigation → User menu → Avatar                                   | `<sl-avatar>`                                                                  | identified; Figma pins 32 px to size 200                                      |
| all `Icon placeholder` / glyph nodes              | icons                                                             | `<sl-icon>`                                                                    | identified — but see Icons: most glyphs are unregistered                      |

## Composition Candidates

- **App navigation shell** — `4200:13793` (`.Main menu` 56 px + `.Secondary menu` 56 px). Figma
  links it to the Prometheus `MainMenu` pattern. **One Figma component containing both rows.**
- **Page header** — `4200:13797` (breadcrumb wrapper + icon + title + Actions slot). Figma's own
  description states this is one Prometheus `PageHeader`.
- **File table toolbar** — `4411:11843` Search, `4411:11844` Actions row, `4099:12638` Dropdown,
  `4495:50569` count + select-all + "(10)". One stacked unit above the table owning its
  selection/filter state.
- **Select-all summary bar** — `4495:50569` → `4495:50570` / `4495:50574` / `4495:50575`; a single
  248 × 38 cluster whose parts are meaningless apart. Hidden `4495:50572` is a bulk-action slot.
- **File row** — `4411:11855` and 7 identical peers.
- **File-type indicator** — `I4411:1185x;4088:16272;19393:6514` ("Course Hat" reused as a file
  badge): a 24 × 24 round tinted disc with an 18.75 %-inset glyph (32 × 32 in the nav).
- **Settings summary card** — `4994:15549` with its visibility / date / assign / Tools rows and a
  trailing Edit action.

## Net-New Primitive Candidates

- **"Course Hat" / file-type badge** — a fully-round (`rounded-[120px]`) tinted container with an
  18.75 %-inset glyph. `sl-avatar` is image/initials-oriented and `sl-badge` is a status pill;
  neither gives a round tinted glyph chip. Shape: **indicator**.
- **`4571:8205` / `4571:8212` "Heading" a11y annotation markers** — `#3f2f9b` label chip + arrow,
  from the A11y Annotation Kit. **Not product UI — excluded from implementation**, listed only so
  the decomposer does not mistake them for components.
- **itslearning logo symbol** — a brand asset, not an icon; ships as SVG, not through `sl-icon`.

The navigation bar and page header are **compositions, not primitives**.

## Responsive Breakpoints

**Single breakpoint, 1280 px.** `screen-width` = 1280 and `screen-height` = 768 are bound
variables; the frame is 1280 × **1335** because the page scrolls. `ca-horisontal-margin` = 48 px
gutter; `content-area` is capped at `max-width: 1148px`. A `Mobile=False` variant (`5566:11566`)
exists in the library but is **not placed in this frame**, and Figma's own Navigation description
says breakpoints are undefined: _"Ask developers about specific breakpoints…"_.

## Designer Annotations

Verbatim from the component-description payload (`figma-design-context-part3.md`). **This frame
has real annotations — unlike its sibling, which had none.**

- `5566:11565` **Navigation**: "1. Ask developers about specific breakpoints when menus change for
  smaller screens / 2. **Note** that there is no variant for a mid-size screen in Figma, but the
  behaviour in code might have more variations depending on the available space on the screen."
- `5483:11897` **Search**: "This Figma component represents 2 components in Prometheus:
  SearchInput and GlobalSearch. … **Global=false (searchinput)** … search as you type, and it
  doesn't require from user confirmation. … **Global=true (Globalesearch)** can be used in
  navigation … Used when we require confirmation form user to start the searching mechanism".
- `5368:8591` **Button**: "3. The button **can't lead to another page** — use the link instead. 4. **Truncate** button's label if it doesn't fit. Button label should never wrap." …
  "1. The distance between actions is defined in the variable **actions-gap**."
- `5483:11186` **Standalone link**: "1. A link is used for **navigation only**. It can't trigger
  any actions in a page. / 2. There are 2 types of links: inline and standalone. This component
  represents **only the standalone version**." … "A standalone link should not be confused with a
  button." … "**Don't change or hide the arrow icon** in the Primary link."
- `5483:11383` / `5483:11384` **PageHeader** / **Editable=False**: "2. The Subtitle concatenates
  several text lines divided by the bullet symbol. … Please don't use line break and complex
  structure in the subtitle."
- `5483:11343` **Breadcrumb trail**: "3. **when used inside PageHeader do not show current
  location!**" — which **this frame contradicts**: it renders 5 crumbs _and_ a trailing chevron.
- `4088:16314` **🛠️ Row**: "1. This is a **template component** — please detach it before using …
  actual styles are at the level of **Cells** … / 5. To create a table header row, select all
  cells inside the 1st row instance in a list and toggle the "Header" parameter."
- `5512:7768` **Cell**: "2. icon call need to have a visible label next to it / 3. action cell
  always show 1 button, if more then 1 action use icon only with ellipsis icon, show actions in
  drop down" … "**Sort:** to show sorting changes, change icon to increase/decrease sorting and
  background of a cell to Brand/100".
- `5512:7934` **Pagination**: "1. When there is only 1 page, the pages are not visible. / 2. The
  control of the number of element in the list is **optional**. / 3. **The component is in
  implementation now.** / 4. When there is only 1 page, **hide** the component."
- `5483:9780` **Select**: "Use when there're 5+ options. … Label on the left … can be helpful in
  toolbars above lists or tables."
- `2275:4903` **Avatar**: "predefined set of sizes: 100: 24×24 / **200: 32×32** / 300: 48×48 /
  400: 64×64 / 500: 80×80 / 600: 96×96. Please use **only** these options."
- `5512:6800` **Dropdown** / `5512:6781` **.Dropdown option**: "Start with a verb. … use the
  {verb}+{noun} format unless the action is clear with a single verb."
- `5512:7653` **Course Hat**: "Course avatar, label".
- `4224:9736` **Heading** (the a11y annotation overlay): "1. `<h1>` describes the page as a whole
  and is typically only one per page. / 2. Avoid skipping heading ranks … / 3. Do not select
  heading levels based on their appearance."
  **Applied in this frame:** `4571:8205` marks "Settings summary" as **H2**; `4571:8212` (empty
  label, x 28 y 626) marks a second **H2** on the table/content-block region. By implication the
  page title "Donna Tartt elaboration" is the **H1**.
- Icon keyword annotations, notably `5483:3871` comment — "**Not in Semiotic**, comment, messages".

## Token Reference

See [`token-reference.md`](token-reference.md) for the full independently-verified table. Summary:

**Typography — `--sl-text-new-*` LONGHANDS ONLY.** This theme ships **zero** bare
`--sl-text-new-<role>` shorthands; a `font:` shorthand against one drops the whole declaration.
`heading-*` has no `-fontWeight` longhand — add `var(--sl-fontWeight-bold)` (700) explicitly.
`--sl-text-new-typeset-fontWeight-semiBold` is **600** and is _not_ Figma's Bold.

| Figma style                | design  | token                        | resolved    | verdict                                   |
| -------------------------- | ------- | ---------------------------- | ----------- | ----------------------------------------- |
| Base / Base strong         | 16 / 24 | `--sl-text-new-body-lg-*`    | 16 / 24     | exact (weight via `--sl-fontWeight-bold`) |
| Base small / small strong  | 14 / 21 | `--sl-text-new-body-md-*`    | 14 / **20** | 1px line-height gap                       |
| Title M (course name)      | 18 Bold | —                            | —           | **gap**; nearest 16 (−2) or 24 (+6)       |
| Title L (Settings summary) | 22 Bold | `--sl-text-new-heading-lg-*` | 24 / 32     | **gap**, +2px                             |
| Title XL (page title)      | 26 Bold | `--sl-text-new-heading-lg-*` | 24 / 32     | **gap**, −2px                             |

**Font family.** Figma's `default-font` is **Lato**. Correction to prior-run lore: Lato _is_ in
this theme — `--sl-text-fontFamily` / `--sl-heading-fontFamily` are both `Lato` (theme.css:4433).
That legacy namespace is nonetheless unusable here because its desktop scale is a K-12 ramp
(text-sm 18px, heading-sm 40px), nowhere near this design's 14/16px body. So: use
`--sl-text-new-*`, accept `'Open Sans'`, and record the fallback face. The reason is **wrong
scale**, not "no Lato token".

**Colour — 14 of the 16 bound hexes have an exact token.** Role-correct choices:
`#333333`→`--sl-color-foreground-bold` · `#565656`→`--sl-color-foreground-subtle` ·
`#757575`→`--sl-color-border-input` (border) / `--sl-color-foreground-subtlest` (text) ·
`#e1e1e1`→`--sl-color-border-plain` · `#ececec`→`--sl-color-background-inverted-interactive-plain` ·
`#f2f2f2`→`--sl-color-background-neutral-bold` · `#f9f9f9`→`--sl-elevation-surface-raised-sunken` ·
`#ffffff`→`--sl-elevation-surface-raised-default` · `#008859`→`--sl-color-background-primary-bold` ·
`#00458f`→`--sl-color-link-idle` · `#a997b5`→`--sl-color-border-secondary-bold`.

Exact but **palette-primitive only** (no semantic role resolves to the value):
`#9b9b9b`→`--sl-color-palette-grey-500` · `#5d4a68`→`--sl-color-palette-purple-700` (active
pagination pill) · `#42354a`→`--sl-color-palette-purple-800` **as a background**. `#42354a` _does_
have semantic tokens, but only `foreground-*` ones (`--sl-color-foreground-brand`), correct for
the "Edit" label and wrong for the "Actions" button fill. The semantic background counterparts
`--sl-color-background-secondary-bold` and `--sl-color-background-selected-bold` both resolve to
purple-600 `#785f86`, visibly lighter.

**No exact token (the only genuine colour gaps):**

| hex                          | role                              | nearest token                                                    | delta                                                           |
| ---------------------------- | --------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------- |
| `#feebbb` `$bronze--100`     | Course Hat disc                   | `--sl-color-background-highlight` `#ffedcd`                      | ΔRGB 18.1 (B −18)                                               |
| `#ae7c3f` `$bronze--200`     | bronze ramp (bound, not rendered) | `--sl-color-background-accent-yellow-interactive-bold` `#b67d1b` | **ΔRGB 36.9 (B −36) — largest**                                 |
| `#d9e3e8` `$pigeongrey--100` | file-type badge disc              | none at any layer                                                | not a Figma variable, so absent from `figma-variable-defs.json` |

**Shadows are a genuine gap.** `--sl-elevation-surface-shadow` is a _colour_ (`#333333`), not a
`box-shadow`; no composite shadow token exists. `layer-shadow` (`0 4 8 #0000000D`) and
`dropdown-shadow` (`0 3 9 #00000033`) have no token.

**Size / spacing.** `Size/10`→`--sl-size-025` (2) · `/25`→`050` (4) · `/50`→`100` (8) ·
`/100`→`150` (12) · `/200`→`175` (14) · `/300`→`200` (16) · `/500`→`250` (20) · `/700`→`300` (24) ·
`/900`→`400` (32) · `/1000`→`500` (40) · `ca-horisontal-margin` 48→`600` ·
content-block padding 32/20→`400`/`250` · `actions-gap` 12→`150` ·
`dropdown-vertical-padding` 4→`050` · `border-radius` 4→`--sl-size-borderRadius-md`.
No rung for 18 / 22 / 26 (font sizes only — route via typography).

**Border widths — `--sl-size-borderWidth-default` is 2px in this theme.**
Card / Content-block / settings-summary / table-row hairlines are Figma `border` = **1px** →
`--sl-size-borderWidth-subtle`. Search field, Select, Checkbox and the outline buttons are
Figma `border-2` = **2px** → `--sl-size-borderWidth-default`.

**Unbound literal widths** (no token at this magnitude; derive or accept): content max 1148,
sidebar card 400, main column 728 / inner 664 (= 728 − 2×32), dropdown 250, nav search 264,
page-size select 80, select-cell 60.

## Geometry the implementer must not lose

**`4200:13793` Navigation** — 1280 × 112, **two 56 px rows inside ONE Figma component**,
`drop-shadow 0 4px 4px rgba(0,0,0,.05)`.

- `.Main menu` (`I…;9976:10654`, 56 px): white, 1 px `#e1e1e1` bottom border, `px 4`. Logo area
  32 px glyph, `px 8 / py 12`. Items (Courses, Updates, Groups, Calendar, Library) `px 16 / py 12`,
  16 px regular `#333`. Right: global Search 264 px (2 px `#757575`, radius 4, `pl 12`, trailing
  24 px search button, right-only radius); bell `p 12` 24 px; comment `p 12` 24 px; Avatar 32 px.
- `.Secondary menu` (`I…;9976:10655`, 56 px): `#f9f9f9`, 1 px `#e1e1e1` bottom border, inset
  shadow `0 4px 8px rgba(0,0,0,.05)`, `px 4`. Course block `px 8`, gap 12 — 32 px round Course Hat
  (`#feebbb`, glyph inset 18.75 %) + "Natural Science 7A" 18 px bold. Items (Overview, Plans,
  Resources, Reports, Participants) `px 16 / py 12`. Trailing ellipsis `p 12` 24 px.

**`4200:13797` PageHeader** — 1148 × 117. Breadcrumb wrapper `pt 8`; 5 crumbs gap 8, each `py 4`,
14 px regular `#333` **underlined**, separator = 16 px chevron-right in a 16 px wrapper `pt 2`,
**plus a trailing chevron after the last crumb**. Title block `py 20` gap 4: icon wrapper `pt 4`

- 32 px file glyph, gap 12, title 26 px bold `#333` `max-w 800` `pr 20` `min-w 200`; Actions slot
  = 2 px `#a997b5` outline button `p 8` radius 4 with a 24 px ellipsis.

**`4200:13814` Card (Description)** — 728 × 192, white, 1 px `#e1e1e1`, radius 4, `px 32 / py 20`,
gap 12 then 8. "Description" 16 px bold; body 16 px regular lh 1.5; a `<ul class=list-disc>` with
two inline `#00458f` underlined links. Hidden child `4210:18675` FileUpload — not rendered.

**`4411:11840` Content-block** — 728 × 870 at y 212, white, 1 px `#e1e1e1`, radius 4,
`px 32 / py 20`; inner column 664 wide, gap 20.

- Search `4411:11843`: full width, 2 px `#757575`, radius 4, `pl 8`; 24 px magnifier in a `py 8`
  wrapper; text wrapper `pl 4 / pr 12 / py 8`, placeholder "Search in folder" 16 px `#757575`.
- Actions `4411:11844` (y +60, h 40), gap 12: **Add** `#008859`, `px 24 / py 8`, `min-h 40`,
  radius 4, gap 4, label 16 px bold white + 24 px chevron-right. **Actions** `#42354a`,
  `px 24 / py 8`, radius 4, gap 4, label 16 px bold white + 24 px caret-down.
- `4495:50569` (248 × 38) gap 12: "1 to 10 of 47" 14 px regular `#333` in a `pt 8` wrapper; then
  gap 2 — Checkbox (`py 8`, gap 8; 22 × 22 box, 2 px `#757575`, radius 4; label "Select all
  visible" 14 px **bold**) + "(10)" 14 px bold. Hidden sibling `4495:50572` Button (80 × 32).

**`4411:11853` table** — 664 × 608, 9 rows, no outer border; every row has a 1 px `#e1e1e1`
bottom border and `overflow: clip`. Header row h 32 at y 0; data rows h **72** at y 32, 104, 176,
248, 320, 392, 464, 536.

Header row (`4411:11854`) — cells `#f9f9f9`, `min-h 32`, `px 8`, label wrapper `py 5`, labels
14 px bold `#333`:

| Column    | Cell node      | Width rule              | Extra                                                                        |
| --------- | -------------- | ----------------------- | ---------------------------------------------------------------------------- |
| Select    | `…;4088:16271` | `shrink-0`, `min-w 60`  | label only                                                                   |
| Title     | `…;4088:16272` | `flex:1 0 0`, `min-w 0` | + sort button `min-h/min-w 32`, `p 4`, radius 4, 20 px `arrow-up-arrow-down` |
| Published | `…;4088:16274` | `flex:1 0 0`, `min-w 0` | + identical sort button                                                      |
| Type      | `…;4088:16275` | `flex:1 0 0`, `min-w 0` | + identical sort button                                                      |
| Actions   | `…;4088:16276` | `shrink-0`              | label only                                                                   |

Data rows (pattern identical for all 8; ids from `4411:11855`):

| Column    | Cell node       | Box                                                                      | Content                                                                                                                      |
| --------- | --------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Select    | `I…;4088:16271` | `w/min-w 60`, `h 100%`, `px 8`, `pt 12`, `pb 14`, gap 8, column, centred | 22 × 22 checkbox, white, 2 px `#757575`, radius 4                                                                            |
| Title     | `I…;4088:16272` | `flex:1 0 0`, `min-w 0`, `h 100%`, `px 8`, `py 12`, gap 8                | 24 px round badge `#d9e3e8`, glyph at 18.75 % inset, + `[File title].docx` 16 px **bold** `#00458f` underlined, `flex:1 0 0` |
| Published | `I…;4088:16274` | `flex:1 0 0`, `min-w 0`, `h 100%`, `px 8`, `py 12`, gap 8                | "12/05/2025, Anna Smith" 16 px regular `#333`, wraps to 2 lines                                                              |
| Type      | `I…;4088:16275` | `flex:1 0 0`, `min-w 0`, `px 8`, `py 12`, gap 8                          | "Document" 16 px regular `#333`                                                                                              |
| Actions   | `I…;4088:16276` | `shrink-0`, `h 100%`, `px 8`, `py 4`, wrap, gap 4                        | one icon button `p 8`, radius 4, 24 px ellipsis                                                                              |

Rows 1-5 and 7 `.docx` → "Document"; row 6 `.xlsx` → "Spreadsheet"; row 8 `.pptx` → "Presentation".

**`4099:12638` Dropdown** — absolutely positioned at `left 124 / top 102` relative to
`4411:11841`, 250 × 152, white, radius 4, `py 4`, `drop-shadow 0 3px 4.5px rgba(0,0,0,.2)`. Three
options (Move to / Download / Delete), full width, `pl 20 / pr 12 / py 12`, gap 8, 24 px leading
icon, label 14 px **bold** `#333`, `min-h 24`. **It overlaps the table** — rendered open.

**`4411:11863` Pagination** — 664 × 40 at y 810, `justify-content: flex-end`, gap 16. Pager
(`flex:1 0 0`, gap 8): prev chevron-left `p 8` radius 4 24 px; page links 1-5 each `h 40`,
`px 16 / py 8`, radius 4, 14 px regular — page **1** active, `#5d4a68` fill, white label; 2-5
`#333` transparent; next chevron-right. Control (gap 16): "1 to 10 of 47" 14 px regular `#333`;
Select 80 px, `h 40`, 2 px `#757575`, radius 4, `pl 12 / pr 40 / py 4`, value "10" 16 px, caret
24 px absolutely at `right 6 / top 6`.

**`4994:15549` settings summary** — 400 × 358 at x 748, white, 1 px `#e1e1e1`, radius 4,
`px 20 / py 20`, gap 20. Title "Settings summary" 22 px bold. Three icon+label rows (gap 8, 24 px
icon): eye + "Visible to students" 16 px bold; timer + "Closing date: May 30, 2025 23:00" 16 px
bold; users + "Assigned to 5 participants + [Group name]" 16 px bold (text `w 328`). Tools block
(`w 360`, gap 8): pen-ruler + "Tools" 16 px bold, then a `list-disc` detail `pl 12`, item 14 px
regular, marker `ms 21px`, text "Microsoft Word, Excel and PowerPoint, Page". Actions `pt 20`
gap 12: "Edit" — white, 2 px `#a997b5`, `px 24 / py 8`, radius 4, label 16 px bold `#42354a`.

**Hidden / not rendered — do not implement:** `4200:13800` Content-block (text field + file
element), `4200:13804` / `4200:13810` Counter wrappers, `4210:18675` FileUpload, `4411:11842`
Description text, `4495:50572` Button. Plus the two a11y `Heading` overlays.

## Icons — only what `packages/themes/itslearning/icons.ts` registers (54 total)

Of the 19 distinct glyphs this frame needs, **9 are registered and 10 are not**.

| Figma glyph               | Used by                                              | Registered?                              | Action                                              |
| ------------------------- | ---------------------------------------------------- | ---------------------------------------- | --------------------------------------------------- |
| `magnifying-glass`        | global search, folder search                         | **Yes**, as `search`                     | use `name="search"`                                 |
| `ellipsis`                | nav overflow, page-header overflow, 8 row buttons    | **Yes**                                  | use                                                 |
| `chevron-right`           | 4 breadcrumb separators + trailing, "Add" affordance | **Yes**                                  | use                                                 |
| `chevron-left`            | paginator previous                                   | **Yes**                                  | use                                                 |
| `caret-down`              | "Actions" button, page-size Select                   | **Yes**, as `caret-down-solid`           | use                                                 |
| `arrow-up-arrow-down`     | 3 sortable headers                                   | **Yes**, as `sort`                       | use (`sort-up`/`sort-down` for active)              |
| `eye`                     | settings summary → visibility                        | **Yes**                                  | use                                                 |
| `timer`                   | settings summary → closing date                      | **Yes**, as `clock`                      | use                                                 |
| `bell`                    | nav notifications                                    | **No**                                   | **omit**, footprint preserved → Stage 4 discrepancy |
| `comment`                 | nav messages                                         | **No** (Figma itself: "Not in Semiotic") | **omit** → discrepancy                              |
| `graduation-cap`          | Course Hat                                           | **No**                                   | **omit** → discrepancy                              |
| `shared-folders`          | page-header 32 px file icon                          | **No** (no folder glyph at all)          | **omit** → discrepancy                              |
| `docx` / `xlsx` / `pptx`  | every table title cell                               | **No** (multi-colour brand marks)        | **omit** → discrepancy                              |
| `arrow-turn-down-right`   | dropdown "Move to"                                   | **No**                                   | **omit** → discrepancy                              |
| `download`                | dropdown "Download"                                  | **No**                                   | **omit** → discrepancy                              |
| `trash`                   | dropdown "Delete"                                    | **No**                                   | **omit** → discrepancy                              |
| `users`                   | settings summary → assignment                        | **No**                                   | **omit** → discrepancy                              |
| `pen-ruler`               | settings summary → Tools                             | **No**                                   | **omit** → discrepancy                              |
| `itslearning-logo-symbol` | nav logo 32 px                                       | n/a (brand asset)                        | **omit** → discrepancy                              |

**Hard rule:** never import `@fortawesome/*` (absent — a _render_ blocker, not just a type
error), never stub the module, never hand-draw a replacement SVG. A missing icon is **left out
with its footprint preserved** and recorded.

## Stage 1 caveats, stated plainly

1. `get_design_context` on the root **exceeded the tool's token limit** (121,213 chars) and
   returned an error rather than content. The payload was recovered from the saved tool result, so
   nothing was lost — but the call did not succeed in-band, and the 3-part split exists because of
   it. Re-joining the parts reproduces the output **byte-identically**, zero omission markers.
2. The brief's **859 nodes is not reproducible** from the remote server. `get_metadata` exposes 58
   nodes (25 top-level instances, no instance internals); the design context carries **315**
   distinct node ids and **70** distinct `data-name`s (close to the briefed 71 component types).
3. `$pigeongrey--100` `#d9e3e8` appears in the design context but is **missing from
   `get_variable_defs`** — so `figma-variable-defs.json` is not a complete inventory of bindings.

---

# Decomposition

Framework **lit** · i18n **off** · output `examples/lit/src/_runs/a6-itsl-collab-shared-folder/`

## Component count — 9

315 node ids / 70 distinct `data-name`s collapse to **9 placeable components**: 8 table rows are
one `<tr>` template over an array; 5 nav links + 5 course tabs + 3 menu items + 3 settings rows +
5 page links are `<li>`/`<option>` maps; ~25 distinct names are Figma wrapper frames with no DOM
counterpart.

## Component tree

```
<sl-a6-shared-folder-page>                 root — owns ALL data, sole global registration
  ├── <sl-a6-top-nav>              → sl-search-field, sl-avatar
  ├── <sl-a6-course-bar>           → sl-button, sl-icon
  ├── <sl-a6-page-header>          → sl-icon, sl-button
  ├── <sl-a6-description-card>     → (plain <a>)
  ├── <sl-a6-file-browser>         → sl-search-field, sl-link, sl-button, sl-icon,
  │   │                              sl-menu, sl-menu-item, sl-checkbox
  │   ├── <sl-a6-file-table>       → sl-checkbox, sl-button, sl-icon
  │   └── <sl-a6-paginator>        → sl-button, sl-icon, sl-select, sl-option
  └── <sl-a6-settings-summary>     → sl-icon, sl-button
```

Only `sl-a6-shared-folder-page` calls `customElements.get(…) ?? customElements.define(…)`. The
other 8 are reached through `ScopedElementsMixin`'s `scopedElements` map, with `sl-a6-*` scoped
tags so a future global promotion cannot collide.

## Nested default locations

```
examples/lit/src/_runs/a6-itsl-collab-shared-folder/
├── shared-folder-page.ts / .css / .stories.ts   <sl-a6-shared-folder-page>  (registers globally)
├── top-nav/          top-nav.ts / .css          <sl-a6-top-nav>
├── course-bar/       course-bar.ts / .css       <sl-a6-course-bar>
├── page-header/      page-header.ts / .css      <sl-a6-page-header>
├── description-card/ description-card.ts / .css <sl-a6-description-card>
├── file-browser/     file-browser.ts / .css     <sl-a6-file-browser>
│   ├── file-table/   file-table.ts / .css       <sl-a6-file-table>
│   └── paginator/    paginator.ts / .css        <sl-a6-paginator>
└── settings-summary/ settings-summary.ts / .css <sl-a6-settings-summary>
```

## SLDS components accepted and rejected, with the source read

| component                                 | verdict                                                         | basis                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sl-grid`                                 | **rejected**                                                    | **four** private custom properties needed: `--_border-width` (2px vs design 1px), `--_body-cell-padding-block`, `--_head-cell-padding-block`, `--_head-cell-background`. `thead`/`tbody` also take a full box border + radius where the design has only per-row hairlines; `no-border` gets partway. Two prior itslearning runs found three; the head-cell background is the fourth. A semantic `<table>` instead.                                         |
| `sl-paginator` + `-status` + `-page-size` | **rejected**                                                    | 6 public-API-unreachable mismatches: `caret-left-solid`/`caret-right-solid` vs `chevron-left`/`chevron-right`; baked `` `${start} - ${end} of ${totalItems} items` `` vs **"1 to 10 of 47"**; unconditional `<sl-label>Items per page:</sl-label>`; active fill green `#008859` vs `#5d4a68`; `.page` is a square chip (`inline-size: calc(1lh + …)`, `padding-inline: 0`) vs `h 40 / px 16`; private `--_bg-color` / `--_bg-mix-color` / `--_bg-opacity`. |
| `sl-breadcrumbs`                          | **rejected**                                                    | `COLLAPSE_THRESHOLD = 3` (module-private) pushes 2 of this design's 5 crumbs into an ellipsis popover — a **structural** break. Plus hardcoded `breadcrumb-separator` (a slash, design uses chevron-right), `a[aria-current='page']` de-styled with `!important`, no trailing separator after the last crumb, and `color: var(--sl-color-link-muted-idle) !important` (resolves to `#757575`; design is `#333333`).                                        |
| `sl-menu-button`                          | **rejected**                                                    | bakes `<sl-icon name="angle-down">` (design: `caret-down-solid`), and its inner `sl-menu` is `@query` + `@internal`, so the design's **open** dropdown is unreachable.                                                                                                                                                                                                                                                                                     |
| `sl-card`                                 | **rejected** (all 3 cards)                                      | it is a _media_ card — `<figure>`/media slot, resize observer, `#setLineClamp`, `#setGridSpan`, and `#onClick` hijacks clicks to a title-slot `<a>`. All three here are plain bordered containers.                                                                                                                                                                                                                                                         |
| `sl-panel`                                | **rejected** (all 3)                                            | it is a _collapsible_ container — toggle button, `role="region"`, `inert` body, `sl-tool-bar` header, `sl-toggle` event. None of the three is collapsible.                                                                                                                                                                                                                                                                                                 |
| `sl-link`                                 | **accept for "Add", reject for the 2 inline Description links** | `link.ts`: "a standalone link **visually styled as a button**" = Figma's Standalone link `5483:11186`. Figma states the Description links are _inline_ and explicitly "not the Standalone link component" → plain `<a>`. **This corrects a row in the manifest's component table.**                                                                                                                                                                        |
| `sl-search-field`                         | accept (both)                                                   | `renderPrefix()` slots `<sl-icon name="search">`; `sl-search` event; `slot="prefix"` overridable.                                                                                                                                                                                                                                                                                                                                                          |
| `sl-checkbox`                             | accept (9)                                                      | parts `outer`/`inner`/`label` exported.                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `sl-select` + `sl-option`                 | accept                                                          | caret is `chevron-down`, design wants `caret-down` — no `icon` property, accepted delta.                                                                                                                                                                                                                                                                                                                                                                   |
| `sl-menu` + `sl-menu-item`                | accept, composed directly                                       | `sl-menu` sets `popover` and exposes `showPopover()`; `sl-menu-item` documents `@csspart wrapper`.                                                                                                                                                                                                                                                                                                                                                         |
| `sl-avatar`                               | accept, **no `size` attribute**                                 | default `--_picture-size: var(--sl-size-400)` = 32px, which is what Figma's Avatar annotation mandates. **The sibling run passes `size="sm"` = 24px — 8px too small. Divergence is deliberate; the sibling is wrong.**                                                                                                                                                                                                                                     |
| `sl-button`                               | accept, widely                                                  | `@csspart button` is documented, so the purple-800 fill and `#a997b5` outline are publicly reachable.                                                                                                                                                                                                                                                                                                                                                      |

## The two cross-run questions — answered

**`Navigation` (`5566:11565`): split into two, same as the sibling.** One Figma source component,
two Lit components, because `.Main menu` is session data (`GET /api/navigation`) and
`.Secondary menu` is course-scoped (`GET /api/courses/{courseId}`); they have different reuse
scope (top nav exists on non-course pages too), and fusing them forces a `hasCourse?` flag. The
outer `drop-shadow` that sits on neither row moves to an `.app-shell` wrapper div in the root.

**Overlap verdict: `TopNavModel` / `CourseBarModel` agree field-for-field.** `NavLink`, `NavUser`,
`TopNavModel`, `CourseTab`, `CourseBarModel` are adopted from the sibling **verbatim** — same
names, same fields, same optionality. Only the tag names differ, and only because of this run's
mandated namespace. **These two components could share one implementation today**; extracting
them would be mechanical. Differences are data values, not contract: my frame highlights no course
tab (`activeTabId: undefined`) where the sibling's sets `'resources'`.

**`PageHeader` (`5483:11383`): partial agreement, reconcilable.** Same shape
(`{breadcrumbs, heading}` + an actions region), but the sibling baked two named buttons and two
named events into its header while this frame has a single icon-only overflow. Figma's own
PageHeader has an **"Actions slot"**, which settles it: this run exposes `slot="actions"` with the
overflow button as default content. The sibling would need the same change to converge — so the
disagreement is in interface shape, not vocabulary, and it is fixable.

## Shared Types / Contracts

Data and stable keys only — no translated strings, no structural config.

```ts
// exported by sl-a6-top-nav — IDENTICAL to the sibling run's its-top-nav exports
export interface NavLink {
  id: string;
  label: string;
  href: string;
  current?: boolean;
}
export interface NavUser {
  id: string;
  displayName: string;
  pictureUrl?: string;
}
export interface TopNavModel {
  brandHref: string;
  links: NavLink[];
  user: NavUser;
}
export type SlA6TopNavSearchEvent = CustomEvent<{ query: string }>;

// exported by sl-a6-course-bar — IDENTICAL to the sibling run's its-course-bar exports
export interface CourseTab {
  id: string;
  label: string;
  href: string;
}
export interface CourseBarModel {
  courseId: string;
  courseName: string;
  courseImageUrl?: string;
  tabs: CourseTab[];
  activeTabId?: string;
}
export type SlA6CourseBarOverflowEvent = CustomEvent<void>;

// exported by sl-a6-page-header
export interface BreadcrumbLink {
  id: string;
  label: string;
  href: string;
}
export type ResourceKind =
  'shared-folder' | 'folder' | 'document' | 'spreadsheet' | 'presentation' | 'page';
export interface PageHeaderModel {
  breadcrumbs: BreadcrumbLink[];
  heading: string;
  resourceKind: ResourceKind;
}
export type SlA6PageHeaderOverflowEvent = CustomEvent<void>;

// exported by sl-a6-description-card
export type DescriptionLinkKind = 'web-content' | 'resource';
export interface DescriptionLink {
  id: string;
  label: string;
  href: string;
  kind: DescriptionLinkKind;
}
export interface DescriptionModel {
  body: string;
  links: DescriptionLink[];
}

// exported by sl-a6-file-table
export type FileKind = 'document' | 'spreadsheet' | 'presentation';
export type FileSortField = 'title' | 'published' | 'type';
export type SortDirection = 'asc' | 'desc';
export interface FileSort {
  field: FileSortField;
  direction: SortDirection;
}
export interface FileRow {
  id: string;
  title: string;
  kind: FileKind;
  publishedAt: string;
  publishedBy: string;
  href: string;
}
export interface FileTableModel {
  files: FileRow[];
  selectedIds: string[];
  sort?: FileSort;
}
export type SlA6FileSelectionChangeEvent = CustomEvent<{ selectedIds: string[] }>;
export type SlA6FileSortChangeEvent = CustomEvent<FileSort>;
export type SlA6FileRowActionEvent = CustomEvent<{ fileId: string }>;

// exported by sl-a6-paginator
export interface PaginatorModel {
  page: number;
  pageSize: number;
  totalItems: number;
}
export type SlA6PageChangeEvent = CustomEvent<number>;
export type SlA6PageSizeChangeEvent = CustomEvent<number>;
export function formatItemRange(page: number, pageSize: number, totalItems: number): string;

// exported by sl-a6-file-browser
export type BulkAction = 'move' | 'download' | 'delete';
export interface FileBrowserModel {
  addHref: string;
  files: FileRow[];
  page: number;
  pageSize: number;
  sort?: FileSort;
  totalItems: number;
}
export type SlA6FileSearchEvent = CustomEvent<{ query: string }>;
export type SlA6BulkActionEvent = CustomEvent<{ action: BulkAction; fileIds: string[] }>;

// exported by sl-a6-settings-summary
export type SettingsVisibility = 'visible' | 'hidden';
export interface SettingsSummaryModel {
  visibility: SettingsVisibility;
  closingDate?: string;
  assignedParticipantCount: number;
  assignedGroupNames: string[];
  toolNames: string[];
}
export type SlA6SettingsEditEvent = CustomEvent<void>;
```

**Event-name uniqueness audit.** Eleven names, each declared in exactly one module's
`GlobalEventHandlersEventMap`, each `sl-a6-`-prefixed: `sl-a6-top-nav-search`,
`sl-a6-course-bar-overflow`, `sl-a6-page-header-overflow`, `sl-a6-file-search`,
`sl-a6-bulk-action`, `sl-a6-file-selection-change`, `sl-a6-file-sort-change`,
`sl-a6-file-row-action`, `sl-a6-page-change`, `sl-a6-page-size-change`, `sl-a6-settings-edit`.
No collision with the installed `@sl-design-system/*` declarations — note that SLDS itself
declares `sl-page-change` (`paginator.ts:34`) and `sl-page-size-change` (`page-size.ts:22`), so
**without the prefix two of these would be duplicate-identifier build breaks** — and none with the
sibling run's five.

## Open Questions — all 31, with the default chosen

| #   | Question                                                                                                                                    | Default chosen                                                                                                                                                                                                                         |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Split `Navigation` into two components, against the single Figma source?                                                                    | **Yes, split** — different endpoints, different reuse scope; one fused model is two models stapled together.                                                                                                                           |
| 2   | The itslearning logo is a 32px brand SVG, not an `sl-icon`.                                                                                 | Preserve the 32px box with a CSS-rendered "its" mark. Shipping the real brand SVG is an asset decision outside this pipeline.                                                                                                          |
| 3   | The global search field's trailing 24px search button has no `sl-search-field` counterpart.                                                 | **Omit**, keep the field's full width. Reproducing it needs `slot="suffix"` + a border-radius override. Recorded as a discrepancy.                                                                                                     |
| 4   | `PageHeader` actions: slot or baked buttons?                                                                                                | **Slot**, overflow button as default content — what Figma's own "Actions slot" says, and the one change that converges with the sibling's header.                                                                                      |
| 5   | Does that slot accept any element or only `sl-button`?                                                                                      | **Any element.** Constraining it blocks a consumer wanting an `sl-menu-button`.                                                                                                                                                        |
| 6   | Last breadcrumb: `aria-current="page"` (semantics) vs underlined like its peers (pixels)?                                                   | **Both.** The design demonstrably contradicts Figma's own Breadcrumb annotation, so follow the pixels and keep the a11y.                                                                                                               |
| 7   | Description inline links: `sl-link` or plain `<a>`?                                                                                         | **Plain `<a>`.** `link.ts` is the button-styled _standalone_ link; Figma says these are inline. **Corrects a manifest row.**                                                                                                           |
| 8   | "Add": `sl-button` (manifest) or `sl-link`?                                                                                                 | **`sl-link variant="primary" fill="solid"`** wrapping an `<a>` — Figma's Standalone-link annotation fits exactly. Its indicator renders `arrow-right` where the design shows `chevron-right`; recorded.                                |
| 9   | Promote the round tinted disc (Course Hat + 8 file badges = 9 instances) to a component?                                                    | **No — a CSS class in each of two shadow roots.** Every glyph it would hold is unregistered, so it is an empty circle with no slot, no state, and two different diameters/fills.                                                       |
| 10  | Promote the 8 table rows to `sl-a6-file-row`?                                                                                               | **No.** No internal state, no reuse; a `<tr>` mapped from an array. **Overrides the manifest's "File row" composition candidate.**                                                                                                     |
| 11  | Render the Actions dropdown open, matching the screenshot?                                                                                  | **Yes**, via `actions-menu-open` on `sl-a6-file-browser`, set in the root's mock. Otherwise the story differs from the reference by a 250×152 overlay. Defaults to `false`.                                                            |
| 12  | Is `sl-menu.anchorElement` public?                                                                                                          | **Treated as public and used** — set as a plain property by both `menu-button.ts:144` and `menu-item.ts:318`, no `@internal` tag. **If the reviewer judges it private this is a reportable reach**; fallback is default placement.     |
| 13  | Split the file-browser toolbar into its own component?                                                                                      | **No.** Search, Actions-enabled-ness, select-all state and the `(10)` count are all functions of one `selectedIds` set.                                                                                                                |
| 14  | Checkbox is 22×22 in the design; `sl-checkbox` offers sm/md/lg.                                                                             | **`md` (default)**, accept the delta. Forcing 22px means overriding `::part(inner)` geometry.                                                                                                                                          |
| 15  | `sl-menu-item` padding: design is `pl 20 / pr 12 / py 12`.                                                                                  | Override via the documented `::part(wrapper)` — public, no reach.                                                                                                                                                                      |
| 16  | `sl-select`'s caret is `chevron-down`; design shows filled `caret-down`.                                                                    | **Accept `chevron-down`.** No `icon` property exists; `caret-down-solid` is registered but unreachable here.                                                                                                                           |
| 17  | The Actions button fill `#42354a`.                                                                                                          | `--sl-color-palette-purple-800` through `sl-button::part(button)`. The semantic `--sl-color-background-secondary-bold` resolves to purple-600 `#785f86`, visibly lighter.                                                              |
| 18  | Date format.                                                                                                                                | ISO in the model, explicit **`en-GB`** formatter in `sl-a6-file-table` → `12/05/2025`. The ambient locale would give `5/12/2025` under `en-US`.                                                                                        |
| 19  | `FileRow.kind` drives both the type label and the badge glyph — one key enough?                                                             | **Yes**, 1:1 across all 8 rows. Add `mimeType` if they ever decouple.                                                                                                                                                                  |
| 20  | The page-size select's option list.                                                                                                         | `[10, 25, 50, 100]` as a component constant. The design reveals only `10`; the list is structure, not data.                                                                                                                            |
| 21  | Paginator `page` 0-based (SLDS convention) or 1-based (visible labels)?                                                                     | **0-based** in model and event, matching `paginator.ts`; the component adds 1 for display.                                                                                                                                             |
| 22  | Tools: one `<li>` with a joined string, or three `<li>`s?                                                                                   | **One `<li>`**, joined with `", "` — the design shows exactly one bullet marker.                                                                                                                                                       |
| 23  | `toolNames: string[]` vs stable tool ids.                                                                                                   | **Names** — per-record free text from the folder's configuration, not a fixed enum.                                                                                                                                                    |
| 24  | Annotation `4571:8212` marks a second H2 on the content-block, but nothing visible is there.                                                | **Visually-hidden `<h2>`** inside `sl-a6-file-browser`. Honours the annotation without inventing visible UI.                                                                                                                           |
| 25  | `NavLink.label` / `CourseTab.label` / `BreadcrumbLink.label` are user-visible strings inside models, which the model rule normally forbids. | **Keep them** — i18n is off and these are server-supplied menu configuration. If i18n is ever turned on, localise off `id` and drop `label`.                                                                                           |
| 26  | `DescriptionLink.kind` enum vs a literal `note: string`.                                                                                    | **`kind` enum** — rule-compliant, though it invents a two-value taxonomy from what are plainly Figma placeholder strings.                                                                                                              |
| 27  | Selection: root-owned data or browser-internal state?                                                                                       | **Browser-internal `@state`** — transient UI state, not fetched data.                                                                                                                                                                  |
| 28  | Should `sl-a6-file-browser` re-emit the table's and paginator's events?                                                                     | **No.** `@event` defaults to `{bubbles: true, composed: true}`, so they reach the root unaided; re-declaring would be a duplicate-identifier break.                                                                                    |
| 29  | Shadows: `--sl-elevation-surface-shadow` is a _colour_, not a `box-shadow`; `layer-shadow` and `dropdown-shadow` have no token at all.      | **Hardcode the literal `rgba()` shadows with a comment naming the gap.** No alternative exists.                                                                                                                                        |
| 30  | Font family: Figma is Lato, every `--sl-text-new-*` token is `'Open Sans'`, which no Typekit serves.                                        | **Use the token, record the fallback face.** The legacy `--sl-text-*` namespace does carry Lato but on a K-12 ramp nowhere near this design's 14/16px body.                                                                            |
| 31  | The three Net-New Primitive Candidates.                                                                                                     | **None approved.** Course Hat / file badge → CSS class (OQ-9). A11y `Heading` markers → not product UI, not rendered; intent carried by heading ranks. itslearning logo → a brand asset, not an `sl-icon`; footprint preserved (OQ-2). |

**Two manifest claims the decomposer checked and overrode:** the inline-links → `sl-link` mapping
(OQ-7) and the "File row" composition candidate (OQ-10).
