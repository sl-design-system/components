# Design Manifest — a4-sesame-my-groups

> Stage 1 output of `/implement-design`. Produced by `design-analyst` from the remote Figma
> MCP server (`mcp__figma__*`). Framework: **lit**. i18n: **off**. Theme: **itslearning**.
> Target output location: `examples/lit/src/_runs/a4-sesame-my-groups/`.

## Overview

Figma file **MySesame-Redesign** (`UBr399hnydpNF9P5Jb2vfx`, team Sesame), top-level node
**"My Groups"** (`2847:14994`), frame **1280 × 1796 px**. It is a full desktop
administration screen: a branded app shell (top nav bar, school-selector bar, footer)
wrapping a _group-management list view_ — a page title with four bulk/page actions, a
filter card (search field plus three dropdowns, clear-filters and search actions), a
result count, an inline validation error, a 20-row / 6-column selectable data table with a
per-row overflow menu, and a floating bulk-selection action bar shown because three rows
are selected.

**Nodes for which `get_design_context` was fetched** (14 targeted calls; no root-level call
was made because the root is 822 nodes):

| Node ID      | Region                                                    |
| ------------ | --------------------------------------------------------- |
| `2847:14995` | Page title row + page-level action buttons                |
| `2847:15395` | Filter / search card                                      |
| `2847:15379` | Bulk-selection action bar                                 |
| `2847:15003` | App header (top nav bar + secondary school bar)           |
| `2847:15426` | Footer                                                    |
| `2847:15358` | Row overflow menu (`group-card-dropdown`)                 |
| `2847:15083` | Table header cell — Name column, with select-all checkbox |
| `2847:15089` | Table body cell — Name column, selected row               |
| `2847:15245` | Table body cell — Action column (overflow icon button)    |
| `2847:15427` | "40 Groups" result count                                  |
| `2847:15709` | `sl-helper-theme` inline error message                    |
| `2847:15077` | "ALL SCHOOL GROUPS" section heading                       |
| `2847:15152` | Table body cell — Type column (plain-text `td` instance)  |
| `2847:15242` | Table header cell — Action column                         |

Raw responses for all of the above are in
`/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/a4-sesame-my-groups/figma-design-context.md`.

---

## Existing SLDS Components Used

> ⚠️ **`get_code_connect_map` returned a literal empty object `{}`.** Probed three times —
> on the root `2847:14994`, on an `sl-button` instance `2847:14998`, and on the table
> container `2847:15708`. Not one `null` entry, not one `hasTemplate: false` entry: the
> response is empty. That is a **file-level** condition (Code Connect is not published or
> not visible for MySesame-Redesign through the remote server), **not** a set of
> individually-unmapped component instances. Every row below is therefore resolved by the
> analyst heuristic — `sl-*` node name, resolved child snippet, or peer instance — and is
> marked **(identified)**. See `figma-code-connect-map.NOTES.txt`.

| Node ID                             | Node Name                                                                                                                                                                                                | Mapped Component                                                                                                      | CC Snippet (excerpt)                                                                                                                              |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `2847:14998`                        | `sl-button`                                                                                                                                                                                              | `sl-button` (`fill="outline"`, icon `archive`)                                                                        | _(identified — `sl-*` node name; internal `sl-button-theme` → `button`)_                                                                          |
| `2847:14999`                        | `sl-button`                                                                                                                                                                                              | `sl-button` (`fill="outline"`, icon `download`)                                                                       | _(identified — `sl-*` node name)_                                                                                                                 |
| `2847:15000`                        | `sl-button`                                                                                                                                                                                              | `sl-button` (`fill="outline"`, icon `upload`)                                                                         | _(identified — `sl-*` node name)_                                                                                                                 |
| `2847:15389`                        | `sl-button`                                                                                                                                                                                              | `sl-button` (`size="sm"`, ghost on brand, icon `trash`)                                                               | _(identified — `sl-*` node name)_                                                                                                                 |
| `2847:15390`                        | `sl-button`                                                                                                                                                                                              | `sl-button` (`size="sm"`, ghost, **disabled**, icon `boxes-packing`)                                                  | _(identified — `sl-*` node name)_                                                                                                                 |
| `2847:15391`                        | `sl-button`                                                                                                                                                                                              | `sl-button` (`size="sm"`, ghost on brand, icon `box-archive`)                                                         | _(identified — `sl-*` node name)_                                                                                                                 |
| `2847:15754`                        | `sl-button`                                                                                                                                                                                              | `sl-button` — duplicate of `2847:15389` in the second bulk panel                                                      | _(identified — `sl-*` node name)_                                                                                                                 |
| `2847:15755`                        | `sl-button`                                                                                                                                                                                              | `sl-button` — duplicate of `2847:15390`                                                                               | _(identified — `sl-*` node name)_                                                                                                                 |
| `2847:15756`                        | `sl-button`                                                                                                                                                                                              | `sl-button` — duplicate of `2847:15391`                                                                               | _(identified — `sl-*` node name)_                                                                                                                 |
| `2847:15397`                        | `sl-searchfield`                                                                                                                                                                                         | `sl-search-field`                                                                                                     | _(identified — `sl-*` node name; **note the code element is hyphenated `sl-search-field`, the Figma layer is not**)_                              |
| `2847:15709`                        | `sl-helper-theme`                                                                                                                                                                                        | `sl-form-field` hint/error slot — no standalone `sl-helper` element exists; closest standalone is `sl-inline-message` | _(identified — `sl-*` node name; internal `sl-base-helper` → `core-icon` + text)_                                                                 |
| `2847:15065`                        | `avatar_SU`                                                                                                                                                                                              | `sl-avatar` (`size="md"`, horizontal, with subheader and `gear` badge)                                                | _(identified — internal sub-nodes named `sl-avatar-circle-text` / `sl-avatar-circle`; Figma component description links to the SLDS Avatar docs)_ |
| `2847:15075`                        | `button`                                                                                                                                                                                                 | `sl-button` (`fill="link"` / ghost, "Switch school")                                                                  | _(identified — peer: geometry and typography are identical to the `sl-button` ghost variant used at `2847:15389`)_                                |
| _all Font Awesome glyph text nodes_ | `search`, `xmark`, `trash`, `eye`, `box-archive`, `boxes-packing`, `archive`, `download`, `upload`, `magnifying-glass`, `chevron-up`, `gear`, `school-flag`, `triangle-exclamation`, `minus`, `ellipsis` | `sl-icon`                                                                                                             | _(identified — every icon in the design is a Font Awesome 6 Pro text glyph inside an SLDS `core-icon` / `icon-container` wrapper)_                |

Nodes that are component instances but are **not** SLDS components (they are legacy /
app-local Figma components). They are listed in _Net-New Primitive Candidates_ below rather
than here, because each has a clear existing SLDS equivalent that the implementation should
use instead:

`2847:15090` and 19 siblings (`v-input--selection-controls`), `2847:15248` and 19 siblings
(`Icon-button`), `2847:15152` and 79 siblings (`td-text-start`), `2847:15002` (`Button`),
`2847:15423` (`button primary`), `2847:15060`–`2847:15063` (`menu item SU`),
`2847:15426` (`Footer`), `2847:15402` / `2847:15408` / `2847:15414` (`dropdown`).

---

## Composition Candidates

- **App shell header** — `2847:15003` (containing `2847:15005` top nav bar and
  `2847:15066` secondary school bar). Appears as one fixed 1280 × 120 unit at the top of
  every screen in this product; the brand logo, primary nav, avatar menu and school
  selector always travel together.
- **Page action bar** — `2847:14995` (`2847:14996` title + `2847:14997` holding
  `2847:14998`, `2847:14999`, `2847:15000`, `2847:15002`). A title on the left and a
  right-aligned run of three outline buttons plus one filled primary; the identical shape
  recurs on sibling admin screens.
- **Filter card** — `2847:15395` (`2847:15397` search field; `2847:15400`, `2847:15406`,
  `2847:15412` labelled dropdowns; `2847:15419` clear-filters link; `2847:15423` search
  button). A single white elevated card that behaves as one form — the clear/search pair
  acts on all four inputs at once.
- **Filter dropdown (label + control)** — `2847:15400`, `2847:15406`, `2847:15412`. The
  same label-above-control pair repeats three times with only the label and value changing.
- **Groups table** — `2847:15080` (`2847:15082` Name, `2847:15149` Type, `2847:15172`
  School year, `2847:15195` # Students, `2847:15218` End date, `2847:15241` Action). Six
  column frames that are really one row-major selectable data table with a select-all
  header, per-row selection, a link cell and a trailing overflow-action cell.
- **Table row** — one index across `2847:15089`, `2847:15152`, `2847:15175`, `2847:15198`,
  `2847:15221`, `2847:15245`. Repeats 20 times; the design is laid out column-major but
  selection state (`#f9ecf5` fill) is applied across the whole row, so the row is the real
  unit.
- **Row overflow menu** — `2847:15358` with items `2847:15362`, `2847:15366`,
  `2847:15371`, `2847:15375`. A popover of four icon+label actions, anchored to the
  `2847:15245` trigger; appears once but is clearly per-row.
- **Bulk-selection action bar** — `2847:15379` (`2847:15381` dismiss, `2847:15383` count,
  `2847:15389`/`2847:15390`/`2847:15391` actions). A floating pill that appears as a unit
  when the table selection is non-empty.
- **Result count + validation strip** — `2847:15427` ("40 Groups") and `2847:15709`
  (inline error). Stacked directly above the table inside `2847:15708`; both describe the
  table's current state.
- **App shell footer** — `2847:15426`. Logo, five legal links and a language selector as
  one reusable unit.

---

## Net-New Primitive Candidates

_None that are genuinely net-new._ Every visual element in this design has an existing SLDS
match. The list below records the non-SLDS Figma components present, together with the
existing component that should be used, precisely so that the decomposer does **not** treat
them as net-new:

- `2847:15090` + 19 siblings — **`v-input--selection-controls`**. A legacy Vuetify checkbox
  drawn as a Material Icons `check_box` glyph (`2847:15085` header variant is a hand-built
  18 × 18 box with a Font Awesome `minus`). Existing match: **`sl-checkbox`** (the
  indeterminate header state is `sl-checkbox[indeterminate]`), and inside a grid,
  **`sl-grid-selection-column`**. Shape: input-like.
- `2847:15248` + 19 siblings and `2847:15348`–`2847:15356` — **`Icon-button`** (Figma
  component `1:107`, described "✅ implemented ✨Variants" — that description is stale, this
  is not an SLDS component). A 40 × 40 circular button holding an `ellipsis` SVG. Existing
  match: **`sl-button fill="ghost"` with an `sl-icon`**, or **`sl-menu-button`** since it
  opens `2847:15358`. Shape: button-like.
- `2847:15152` + 79 siblings and `2847:15083` / `2847:15242` — **`td-text-start`** /
  **`th-text-start`**. Hand-built table cells. Existing match: **`sl-grid`** with
  `sl-grid-column`, `sl-grid-selection-column`, `sl-grid-sort-column`. Shape: layout, not
  a primitive.
- `2847:15402`, `2847:15408`, `2847:15414` — **`dropdown`**. Raw frames (white fill,
  `#bfbfbf` 1 px border, 6 px radius, a 12 px chevron SVG), _not_ an SLDS component.
  Existing match: **`sl-select` + `sl-option`**, wrapped in **`sl-form-field`** to carry the
  label. Shape: input-like.
- `2847:15002` (`Button`, "Add group") and `2847:15423` (`button primary`, "Search") —
  two _different_ ad-hoc filled buttons living alongside genuine `sl-button` instances in
  the same screen. Existing match: **`sl-button fill="solid" variant="primary"`**. Shape:
  button-like. (See "Inconsistencies" below.)
- `2847:15060`–`2847:15063` — **`menu item SU`**. Top-nav items; the active one carries a
  2 px underline. Existing match: **`sl-tabs` / `sl-tab`** or **`sl-link`** inside a `nav`.
  Shape: navigation.
- `2847:15362`, `2847:15366`, `2847:15371`, `2847:15375` — **`Dropdown Panels`**. Menu rows
  of `sl-icon` + label. Existing match: **`sl-menu` + `sl-menu-item`**. Shape: menu item.
- `2847:15091` and 19 siblings — underlined magenta group names. Existing match:
  **`sl-link`** (or `sl-grid`'s link renderer). Shape: link.
- `2847:15426` — **`Footer`**. App-specific chrome; no DS component and none expected.
  Build as plain markup for the example page. Shape: layout.

---

## Responsive Breakpoints

_Single breakpoint: 1280px._

Evidence: `2847:14994` is the only frame for this design and is 1280 px wide; no sibling
frames at other widths, no constraint annotations, and no layout-grid node were returned by
`get_metadata`. Two internal widths are worth recording for the implementer because they
are hard-coded rather than fluid:

- **1280 px** — outer frame / app-shell width (header `2847:15003`, footer `2847:15426`).
- **1024 px content column** — the page gutter is a fixed `128px` left/right padding on the
  header (`2847:15003`), the secondary bar (`2847:15066`), the footer (`2:70476`) and the
  content stack (`2847:15708` at x=128, width 1024). The filter card `2847:15395` is
  1023 px and the title row `2847:14995` is 1013 px — a 1 px and an 11 px drift from the
  1024 px column, almost certainly unintentional.

---

## Designer Annotations

_None._ No annotation, comment, or sticky-note layer exists anywhere in `2847:14994`.
Everything that reads like guidance came from **Figma component descriptions** returned by
`get_design_context`, not from annotations on this screen; they are quoted verbatim here
because they carry usage constraints:

- `sl-button` (Figma node `2:48280`) — "A button initiates an action when clicked, like
  redirecting to a new page or submitting a form. It's a key element for interaction and
  action." Docs: https://sanomalearning.design/categories/components/button/
- `sl-searchfield` (Figma node `2:70500`) — "A search field is used for searching and
  filtering items." Docs:
  https://sanomalearning.design/categories/components/search-field/usage/
- `sl-searchfield-theme` (Figma node `2:70502`) — "✏️ Only edit the properties below The
  colors of this component are fixed and you wouldn't have to edit them. You can adjust the
  width of the field to fit your design."
- `sl_base-search_field-lg` (Figma node `2:70650`) — "🚫 Do not edit this component. This
  component is used to build the text input component and not intended for independent use.
  ↖️ Instead, edit the top-level component."
- Avatar, `Property 1=Default` (Figma node `777:12400`) — "An avatar is a visual
  representation of an entity, such as a user or an organization. **Notes** — A subheader on
  a small horizontal avatar is not allowed and is turned off by default." Docs:
  https://sanomalearning.design/categories/components/avatar/
- `xmark` (Figma node `7:5952`) — "close, remove"
- `Icon-button` (Figma node `1:107`) — "✅ implemented ✨Variants"

---

## Token Reference

Built primarily from `get_variable_defs` on `2847:14994`. Variable names are quoted
verbatim from that response. **Important context for every entry:** the design was drawn
against the **VanIn / MySesame** brand, while this run's theme is **`itslearning`**. The
bound variables therefore carry VanIn hex values, which do _not_ appear in
`packages/themes/itslearning/`. The correct implementation target is the _semantic_ SLDS
token named in each row — its name exists in the itslearning theme and its role matches;
only its resolved value differs. Nothing here needs hardcoding.

### Color

| Bound variable (verbatim from `get_variable_defs`) | Raw value | SLDS token to use                                                                  |
| -------------------------------------------------- | --------- | ---------------------------------------------------------------------------------- |
| `button/primary/outline/idle/foreground`           | `#AF1685` | `--sl-color-foreground-primary-bold`                                               |
| `button/primary/outline/idle/border`               | `#AF1685` | `--sl-color-border-primary-bold` / `--sl-color-background-primary-bold`            |
| `button/primary/outline/idle/background`           | `#000000` | _(transparent in render; outline buttons use `--sl-color-background-transparent`)_ |
| `button/primary/ghost/idle/background`             | `#000000` | _(transparent in render)_                                                          |
| `button/primary/ghost/idle/border`                 | `#000000` | _(transparent in render)_                                                          |
| `button/primary/ghost/disabled/background`         | `#000000` | _(transparent in render)_                                                          |
| `button/primary/ghost/disabled/border`             | `#000000` | _(transparent in render)_                                                          |
| `Gray/gray 500`                                    | `#8D8D8D` | `--sl-color-foreground-subtle`                                                     |
| `input/textField/default/default/icon`             | `#8D8D8D` | `--sl-color-foreground-subtle`                                                     |
| `input/textField/default/default/inputText`        | `#323232` | `--sl-color-foreground-plain`                                                      |
| `input/textField/default/default/background`       | `#FFFFFF` | `--sl-color-background-input-plain` (`--sl-color-white`)                           |
| `input/textField/default/default/border`           | `#9D9F9F` | `--sl-color-border-input`                                                          |
| `color/input/helper/icon/invalid`                  | `#ED1111` | `--sl-color-foreground-negative-bold`                                              |
| `color/input/helper/text/invalid`                  | `#ED1111` | `--sl-color-foreground-negative-bold`                                              |
| `black/0.6`                                        | `#000000` | `--sl-color-black`                                                                 |

Colours present in `get_design_context` but **not** backed by a bound variable. Each was
searched for in `packages/themes/` before being listed (see "unbound audit" below):

- `#dedede` — table header fill (`2847:15083`, `2847:15242`) and row bottom border
  (`2847:15089`, `2847:15152`, `2847:15245`). → `--sl-color-border-plain`
  (itslearning resolves this to `#e1e1e1`).
- `#f9ecf5` — selected-row fill, 20 `td-text-start` cells. →
  `--sl-color-background-selected-subtle`.
- `#af1685` — used as a _fill_ at `2847:15002`, `2847:15423`, `2847:15379`, `2847:15085`
  (not only via the button variables above). → `--sl-color-background-primary-bold`.
- `#bfbfbf` — filter-dropdown border (`2847:15402`/`15408`/`15414`) and the disabled
  "Reactivate" button (`2847:15390`). → `--sl-color-border-plain` for the border,
  `--sl-color-foreground-disabled` for the disabled label/icon.
- `#f6f8f8` — footer background (`2:70476`). → `--sl-color-background-subtle`.
- `#e1e1e1` — bulk-bar divider (`2847:15386` left border). → `--sl-color-palette-grey-300`
  (**exact value match** in the itslearning theme) — semantically
  `--sl-color-border-subtle`.
- `#ffffff` — surfaces: filter card, menus, nav bars, button-on-brand text. →
  `--sl-color-white` / `--sl-elevation-surface-raised-default` /
  `--sl-color-foreground-inverted-plain`.
- `#323232` — all body/heading text and most icons. → `--sl-color-foreground-plain`.
- `rgba(0,0,0,0.12)` — inset bottom rule on table header cells. →
  `--sl-color-border-plain`.

### Size / Spacing

| Bound variable (verbatim) | Raw value | SLDS token      |
| ------------------------- | --------- | --------------- |
| `Size/10`                 | `2`       | `--sl-size-025` |
| `Size/200`                | `14`      | `--sl-size-175` |

Spacing values present in `get_design_context` but not variable-bound. All are on the SLDS
4 px scale and every one has an exact token:

- `2px` → `--sl-size-025` · `4px` → `--sl-size-050` · `6px` → `--sl-size-075` ·
  `8px` → `--sl-size-100` · `10px` → `--sl-size-125` · `12px` → `--sl-size-150` ·
  `16px` → `--sl-size-200` · `20px` → `--sl-size-250` · `24px` → `--sl-size-300` ·
  `32px` → `--sl-size-400` · `40px` → `--sl-size-500` · `48px` → `--sl-size-600` ·
  `56px` → `--sl-size-700` · `80px` → `--sl-size-1000`
- `1px` (hairline borders, `border-b`, inset rule) → `--sl-size-010` / `--sl-size-border`
- `128px` page gutter → **no exact token**; `--sl-size-1000` is 80px and the scale tops out
  there. Compose as `calc(var(--sl-size-1000) + var(--sl-size-600))` or treat as a
  layout-level page constant.
- `18px` (checkbox box, `2847:15085`) → **no exact token**; nearest are `--sl-size-200`
  (16px) and `--sl-size-250` (20px). Use `sl-checkbox`'s own sizing rather than reproducing
  18px.

Border radii:

- `2px` → `--sl-size-borderRadius-sm` · `4px` → `--sl-size-borderRadius-md`
  (= `--sl-size-borderRadius-default`) · `8px` → `--sl-size-borderRadius-lg` ·
  `12px` → `--sl-size-borderRadius-xl`
- `24px`, `32px`, `56px`, `800px`, `999px` (pill buttons, bulk bar, icon buttons, avatar
  badge) → all are "fully rounded" intents → `--sl-size-borderRadius-full`
- `6px` (filter dropdowns, `2847:15402`/`15408`/`15414`) → **no exact token**; between
  `--sl-size-borderRadius-md` (4px) and `--sl-size-borderRadius-lg` (8px). `sl-select`
  supplies its own radius — use the component, don't reproduce 6px.

### Typography

| Bound variable (verbatim)          | Raw value                                                                                                   |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `default-font`                     | `Lato`                                                                                                      |
| `H4`                               | `Font(family: "Open Sans", style: SemiBold, size: 18, weight: 600, lineHeight: 100, letterSpacing: 0)`      |
| `Display small`                    | `Font(family: "default-font", style: Bold, size: Size/200, weight: 700, lineHeight: 1.5, letterSpacing: 0)` |
| `button/text/sm`                   | `Font(family: "Open Sans", style: Bold, size: 14, weight: 700, lineHeight: 16, letterSpacing: 0)`           |
| `text button`                      | `Font(family: "Open Sans", style: Bold, size: 14, weight: 700, lineHeight: 24, letterSpacing: 0)`           |
| `standalone link`                  | `Font(family: "Open Sans", style: SemiBold, size: 14, weight: 600, lineHeight: 24, letterSpacing: 0)`       |
| `input/textField/text/lg`          | `Font(family: "Open Sans", style: Regular, size: 16, weight: 400, lineHeight: 24, letterSpacing: 0)`        |
| `text/input/helper/text/sm`        | `Font(family: "Open Sans", style: Regular, size: 12, weight: 400, lineHeight: 16, letterSpacing: 0)`        |
| `text/input/textField/fontIcon/md` | `Font(family: "Font Awesome 6 Pro", style: Solid, size: 15, weight: 900, lineHeight: 16, letterSpacing: 0)` |
| `v-icon/medium`                    | `Font(family: "Material Icons", style: Regular, size: 24, weight: 400, lineHeight: 1, letterSpacing: 0)`    |

SLDS typography tokens to use. The `--sl-text-new-*` namespace exists in the itslearning
theme alongside the older `--sl-text-{sm,md,lg}-*` — prefer `--sl-text-new-*`:

- Page title "Groups", 28/40 bold (`2847:14996`) → `--sl-text-new-heading-xl-font` /
  `--sl-text-new-heading-xl-line`
- Section heading "ALL SCHOOL GROUPS", 18/normal semibold (`2847:15078`) →
  `--sl-text-new-heading-md-font` / `--sl-text-new-heading-md-line`
- Body / cell text and labels, 14/20 and 14/24 → `--sl-text-new-body-md-font` /
  `--sl-text-new-body-md-line`
- Helper / error text and avatar subheader, 12/16 → `--sl-text-new-body-sm-font` /
  `--sl-text-new-body-sm-line`
- Search-field and dropdown value text, 16/24 → `--sl-text-new-input-lg-font` /
  `--sl-text-new-input-lg-line`
- Font-size scale: 12px → `--sl-size-font-150`, 14px → `--sl-size-font-175`,
  16px → `--sl-size-font-200`, 18px → `--sl-size-font-250`, 28px → `--sl-size-font-400`
- Icon glyph sizes: `--sl-size-icon-font-sm` (12px), `--sl-size-icon-font-md` (16px),
  `--sl-size-icon-font-lg` (20px), `--sl-size-icon-font-xl` (24px)
- 9px avatar badge glyph → **no exact token**; the smallest is `--sl-size-icon-font-2xs`.
  Use `sl-avatar`'s own badge sizing.

Font families in the design are **Open Sans** (all UI text), **Lato** (bound to
`default-font`, applied only to the bulk-bar count at `2847:15384`), **Font Awesome 6 Pro**
(all icons except one) and **Material Icons** (only the row checkbox glyph
`I2847:15090;58:540`). SLDS supplies `--sl-text-font` / typography via the theme and
`sl-icon` for glyphs; do not load Font Awesome or Material Icons.

### Other

| Bound variable (verbatim) | Raw value                                                                           | SLDS token                                                        |
| ------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `none`                    | `Effect(type: DROP_SHADOW, color: #00000000, offset: (0, 0), radius: 0, spread: 0)` | _no shadow_ — `--sl-size-borderRadius-none` context; emit nothing |
| `boxShadow/none`          | `Effect(type: DROP_SHADOW, color: #00000000, offset: (0, 0), radius: 0, spread: 0)` | _no shadow_ — emit nothing                                        |

Shadows present in `get_design_context` but not variable-bound:

- `drop-shadow(0px 2px 2px rgba(0,0,0,0.25))` — filter card `2847:15395`. →
  `--sl-elevation-shadow-sm`
- `0px 2px 8px 0px rgba(109,110,115,0.35)` — row overflow menu `2847:15358`. →
  `--sl-elevation-shadow-overlay`
- `inset 0px -1px 0px 0px rgba(0,0,0,0.12)` — table header bottom rule
  (`2847:15083`, `2847:15242`). Not a shadow intent: implement as a
  `--sl-size-border` bottom border in `--sl-color-border-plain`.

Surfaces:

- White card / menu / nav backgrounds → `--sl-elevation-surface-raised-default`
- Footer `#f6f8f8` → `--sl-elevation-surface-raised-sunken` or
  `--sl-color-background-subtle`

---

## Appendix A — Unbound-value audit

Every raw value that `get_variable_defs` left unbound was searched for in
`packages/themes/` (all 22 themes) and in the run theme `itslearning` specifically, before
being reported. Results:

| Raw value | Exact-hex token in `itslearning`?                                                                                 | Exact-hex token elsewhere?                                           | Correct token to use                                                        |
| --------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `#323232` | no (itsl. `grey-800` = `#4a4a4a`)                                                                                 | yes — `--sl-brand-light-color-palette-grey-800` in `my-digital-book` | `--sl-color-foreground-plain`                                               |
| `#8d8d8d` | no (itsl. `grey-500` = `#9b9b9b`)                                                                                 | yes — `…palette-grey-400` in `my-digital-book`                       | `--sl-color-foreground-subtle`                                              |
| `#9d9f9f` | no                                                                                                                | yes — `…palette-grey-300` in `my-digital-book`                       | `--sl-color-border-input`                                                   |
| `#bfbfbf` | no (itsl. `grey-200` = `#ececec`)                                                                                 | yes — `…palette-grey-200` in `my-digital-book`                       | `--sl-color-border-plain` / `--sl-color-foreground-disabled`                |
| `#ed1111` | no (itsl. `red-500` = `#cf4444`)                                                                                  | yes — `…palette-red-500` in `my-digital-book`                        | `--sl-color-foreground-negative-bold`                                       |
| `#f6f8f8` | no (itsl. `grey-050` = `#f9f9f9`)                                                                                 | yes — `…palette-grey-050` in `my-digital-book`                       | `--sl-color-background-subtle`                                              |
| `#e1e1e1` | **yes** — `--sl-color-palette-grey-300`                                                                           | —                                                                    | `--sl-color-border-subtle`                                                  |
| `#ffffff` | **yes** — `--sl-color-white` / `--sl-color-palette-grey-000`                                                      | —                                                                    | `--sl-color-white`                                                          |
| `#af1685` | no — this is the VanIn brand magenta; absent from every theme incl. `myvanin_onhold` (which ships no `theme.css`) | no                                                                   | `--sl-color-background-primary-bold` / `--sl-color-foreground-primary-bold` |
| `#dedede` | no                                                                                                                | no — not present in any of the 22 themes                             | `--sl-color-border-plain`                                                   |
| `#f9ecf5` | no                                                                                                                | no — not present in any of the 22 themes                             | `--sl-color-background-selected-subtle`                                     |

So: two values (`#ffffff`, `#e1e1e1`) have exact-value tokens in the run theme; six more
have exact-value tokens in `my-digital-book`, confirming the design's grey ramp is the
Sanoma ramp and every one of them has a real semantic home; three (`#af1685`, `#dedede`,
`#f9ecf5`) exist in no theme file. **Zero values need hardcoding** — all eleven resolve to
a semantic `--sl-color-*` token that exists in `itslearning`.

## Appendix B — Inconsistencies found in the design

Recorded for the decomposer so it does not faithfully reproduce them:

1. **The bulk action bar is duplicated.** `2847:15379` (y = 1466) and `2847:15744`
   (y = 1483) are two near-identical `bulk panel` frames overlapping by 39 px. Only one
   should be implemented.
2. **Three different button components on one screen.** `sl-button` (`2847:14998`,
   `14999`, `15000`, `15389`–`15391`), an app-local `Button` (`2847:15002`, "Add group"),
   and a raw `button primary` frame (`2847:15423`, "Search"). The first and last render
   with different radii (`800px` vs `24px`) and different icon treatments. Unify on
   `sl-button`.
3. **Two icon systems.** Font Awesome 6 Pro everywhere, except the row checkbox
   (`I2847:15090;58:540`) which is a Material Icons `check_box` glyph, and the header
   select-all (`2847:15085`) which is a hand-built box with a Font Awesome `minus`. The
   header and body checkboxes are therefore _different components rendering the same
   control_. Use `sl-checkbox` for both.
4. **Duplicate row data.** `2847:15109` and `2847:15112` are both "Study group English B1".
   Likely a copy/paste slip in the mock data, not a requirement.
5. **Content-column drift.** The content column is 1024 px, but the title row
   (`2847:14995`) is 1013 px, the filter card (`2847:15395`) 1023 px, and the section
   heading row (`2847:15077`) starts at x = 125 rather than 128. Normalise to 1024 px / 128 px.
6. **Empty placeholder frames.** `2847:15393` (72 × 20, empty), `2847:15394`, and
   `2847:15079` (150 × 40, empty). No content; ignore.
7. **Hidden layers left in place.** `2847:15345` (an entire hidden "Close" column),
   `2847:15076`, `2847:15072`, `2847:15244` (`table sorting icon`), `2847:15359`,
   `2847:15368`, `2847:15392`, `2847:15757` and 20 hidden "Frozen Yogurt" text nodes in the
   Action column. All `hidden="true"`; do not implement. The hidden `table sorting icon`
   does suggest the Name/Type/School year columns are meant to be sortable
   (`sl-grid-sort-column`).
8. **Figma layer named `sl-searchfield`; the code element is `sl-search-field`.** Do not
   emit the un-hyphenated tag.
9. **`sl-helper-theme` has no standalone code element.** In SLDS the helper/error text is a
   slot of `sl-form-field`, or standalone it is `sl-inline-message`. The design places it
   as a free-floating strip above the table, so `sl-inline-message` is the closer fit.
