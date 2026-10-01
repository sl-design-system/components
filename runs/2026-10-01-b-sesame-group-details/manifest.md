# Design Manifest — b-sesame-group-details

> Stage 1 of `/implement-design`. Produced by `design-analyst` from the **remote** Figma MCP
> server (`mcp__figma__*`; the desktop server times out on this file). Theme: **itslearning**.
> Run folder: `/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/b-sesame-group-details/`

## Overview

Figma file **MySesame-Redesign** (`UBr399hnydpNF9P5Jb2vfx`, team Sesame), top-level node
**"Group details"** (`2142:48093`), frame **1280 × 2392 px**. It is a desktop teacher-facing
_group detail_ screen for the **MittSanoma** product: an app shell (top nav bar + school-selector
bar, Sanoma footer) wrapping a back-link, a page title, a three-row read-only detail list
(Group name / School year / Group type) each with an inline edit button, a destructive
"Archive group" action, a "Linking code" callout card showing the join code `AB3FRR`, a
three-tab strip (Students 10 / Teachers 1 / Manage student licenses), and — stacked in the
Students tab — an **"Add student to group" panel** (4-field search row + a "No matching results"
box), a **"Can't find the student?" create-student form** (5 fields, a radio group, an accordion,
a primary action row with a checkbox), and an **empty state** ("You don't have any students yet").

**Brand note that matters for every downstream decision:** this frame is drawn against
**MittSanoma / Sanoma Utbildning** branding — primary colour **teal `#01766d`**, Swedish Sanoma
wordmark with the "för dig som lär" payoff. It is _not_ the VanIn magenta (`#af1685`) of the
sibling run A4. The run theme is `itslearning` (primary = **green** `#008859` / `#005a3b`), so
every brand colour below is a role-mapping, never a value match.

### Calls made

| Call                   | Node(s)                                                                                          | Result                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------- |
| `get_metadata`         | `2142:48093`                                                                                     | OK — full tree, ~400 nodes (see below) |
| `get_code_connect_map` | 10 nodes (root + 9 spot checks)                                                                  | OK ×10 — **every one returned `{}`**   |
| `get_variable_defs`    | 13 nodes                                                                                         | OK ×13 — 25 distinct bound variables   |
| `get_design_context`   | `2142:48094`, `2142:48139`, `2142:48135`, `2142:48171`, `2142:48316`, `2142:48470`, `2142:48477` | OK ×7 — 100% of the visible surface    |
| `get_screenshot`       | `2142:48093` (×2: default + `contentsOnly`)                                                      | OK ×2                                  |

Zero transport errors. Zero retries needed. Raw outputs: `figma-metadata.txt`,
`figma-code-connect-map.json`, `figma-design-context.md`, `figma-variable-defs.json`
(+ `figma-variable-defs.PROBES.json` for per-node provenance).

### Screenshot — real pixel size, and why it is not 1280 wide

| Artifact                       | PNG size       | Node's natural canvas size |
| ------------------------------ | -------------- | -------------------------- |
| `screenshot.png`               | **934 × 1280** | **1744 × 2392**            |
| `screenshot-contents-only.png` | 934 × 1280     | 1744 × 2392                |

Both verified as real PNGs via `file` (`PNG image data, 934 x 1280, 8-bit/color RGBA`), 70 KB each.

The frame is **1280 × 2392**, but Figma renders **1744 × 2392** — **464 px of horizontal bleed**,
not the ~8 px seen in A4. The cause is identifiable: `<vector id="2142:48496" name="Arrow 9"
x="328" y="1775" width="1415" height="0">`, a stray zero-height annotation arrow that runs from
x=328 to x=1743, i.e. 463 px past the frame's right edge. It is a **child of the frame**, so
`contentsOnly: true` does not remove it — both renders are identical. Visible in the screenshot
as a hairline crossing the Username field and continuing across a pale-green void on the right.

For the orchestrator to normalise: the raw PNG was downsampled by **1280/2392 = 0.53512**. The
1280-px-wide design occupies the **left 934 × (1280/2392 × 2392) = left 685.0 px** of the PNG
(`1280 × 0.53512 = 685.0`); the remaining 249 px on the right is bleed. Do **not** crop the
original — it is cached as-returned.

---

## Existing SLDS Components Used

> ⚠️ **`get_code_connect_map` returned a literal empty object `{}` on all 10 probes** — root
> `2142:48093`, `2142:48105` (button secondary), `2142:48182` (sl-text_input), `2142:48136`
> (tab), `2142:48455` (radio group), `2142:48469` (checkbox), `2142:48465` (button primary),
> `2142:48156` (avatar), `3659:36698` (accordion), `2142:48491` (footer link). Not `null`
> entries, not `hasTemplate: false`, not an error — an **empty mapping**. This matches the two
> sibling runs from the same file (a4 `2847:14994`, a11 `116:19049`) exactly. It is a
> **file-level** condition: this Figma file is drawn against itslearning's own Figma library,
> which has no published Code Connect visible through the remote server.
>
> **This is the as-is case for MySesame-Redesign and is not a block.** Every row below is an
> explicit analyst inference and is marked **(inferred)**. Provenance for each is given.
>
> Nested instance ids (`I2142:48182;2711:12444`, …) are rejected by the remote server with
> `must be in the format "123:456"` and could not be probed — their absence is a tool limitation,
> not evidence.

Every `sl-*` name below was verified to exist as a real element in
`packages/components/` (`grep customElements.define`). Figma layer names were **not** trusted.

| Node ID(s)                                                                                           | Figma node name                                                    | SLDS component (verified to exist)                                                             | Provenance / snippet                                                                                                                                                                                               |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `2142:48182`                                                                                         | `sl-text_input`                                                    | **`sl-text-field`** (+ `sl-form-field` for the label)                                          | (inferred) — `sl-*` layer name; Figma description links the SLDS Text field docs. **Note the code tag is hyphenated `sl-text-field`, the Figma layer is `sl-text_input`.**                                         |
| `2142:48183`, `2142:48187`, `2142:48322`, `2142:48326`, `2142:48457`, `3659:36670`                   | `sl-text_input-theme [DEPRECATED]`                                 | **`sl-text-field`** + **`sl-form-field`**                                                      | (inferred) — same family; Figma itself marks it ⛔️ deprecated → "use \[Form Field\]".                                                                                                                              |
| `2142:48188`, `2142:48334`                                                                           | `sl-select`                                                        | **`sl-select`** + **`sl-option`**, wrapped in `sl-form-field`                                  | (inferred) — `sl-*` layer name; internal `sl-base-selectbox` + `select-box-down` chevron.                                                                                                                          |
| `2142:48455`                                                                                         | `sl-radio_group-theme`                                             | **`sl-radio-group`** + **`sl-radio`**                                                          | (inferred) — `sl-*` layer name; children `sl-radio-1`, `sl-radio-2`, `sl-base-radio`, `radio-box`.                                                                                                                 |
| `2142:48467` → `2142:48469`                                                                          | `sl-checkbox` → `sl-base-checkbox`                                 | **`sl-checkbox`**                                                                              | (inferred) — `sl-*` layer name; Figma description links the SLDS Checkbox docs (marked ⛔️ deprecated in Figma).                                                                                                    |
| `2142:48189`, `2142:48335`, `2142:48184`, `2142:48323`, `2142:48327`                                 | `sl-label-theme` / `… [DEPRECATED]`                                | label slot of **`sl-form-field`**                                                              | (inferred) — Figma description: "⛔️ deprecated. Please use the component \[Form Field\]". **There is no standalone `sl-label-theme` element**; `sl-label` exists but is the form-field internal.                   |
| `2142:48186`, `2142:48308`, `2142:48325`, `2142:48333`, `2142:48454` (all **hidden**)                | `sl-helper-theme [DEPRECATED]`                                     | hint slot of **`sl-form-field`** (`sl-hint`); standalone equivalent is **`sl-inline-message`** | (inferred) — all five are `hidden="true"`; no helper text is actually rendered on this screen.                                                                                                                     |
| `2142:48156`                                                                                         | `avatar_SU`                                                        | **`sl-avatar`** (`size="md"`, horizontal, subheader, badge)                                    | (inferred) — internals literally named `sl-avatar-circle-text` / `sl-avatar-circle`; Figma component `777:12400` description links the SLDS Avatar docs.                                                           |
| `2142:48136`, `2142:48137`, `2142:48138` (strip `2142:48135`)                                        | `DEMO - Tab-switches`                                              | **`sl-tab-group`** + **`sl-tab`** (+ `sl-tab-panel`)                                           | (inferred) — Figma descriptions "Tab / Default", "✨Variants". **The element is `sl-tab-group`, NOT `sl-tabs`** (A4's manifest says `sl-tabs`; that tag does not exist).                                           |
| `I2142:48136;11109:145011`, `I2142:48137;11109:145014`                                               | `number-tag`                                                       | **`sl-badge`**                                                                                 | (inferred) — Figma description on `2:69165` says "✅ implemented". 24 × 24 pill with a bold numeral.                                                                                                               |
| `3659:36698`                                                                                         | `Accordion-multiple-view`                                          | **`sl-accordion`** + **`sl-accordion-item`**                                                   | (inferred) — internals `accordion-header`, `accordion-header-base`, `Icon-animation/accordion-title`.                                                                                                              |
| `2142:48126`                                                                                         | `Linking code`                                                     | **`sl-card`**                                                                                  | (inferred) — a 364 × 184 filled, rounded (16 px), drop-shadowed container with a heading row and a value. No CC data; `sl-card` is the obvious host, though the design's 16 px radius is not an `sl-card` default. |
| `2142:48105`, `2142:48111`, `2142:48118`                                                             | `button secondary`                                                 | **`sl-button`** `fill="outline"` `shape="rect"` `size="sm"` + **`sl-icon`**                    | (inferred) — geometry/typography of an outline button. `ButtonFill = 'solid' \| 'outline' \| 'link' \| 'ghost'` and `ButtonShape = 'rect' \| 'pill'` both verified in `button.ts`.                                 |
| `2142:48465`                                                                                         | `button primary`                                                   | **`sl-button`** `fill="solid"` `variant="primary"` `shape="rect"`                              | (inferred) — solid `#01766d`, white bold 14/24 label, 4 px radius.                                                                                                                                                 |
| `2142:48168`                                                                                         | `button` ("Switch school")                                         | **`sl-button`** `fill="ghost"` / `fill="link"` `shape="pill"`                                  | (inferred) — 800 px radius, transparent fill, teal bold label; identical to A4's `2847:15075`.                                                                                                                     |
| `2142:48119`                                                                                         | `Button-sesame` ("Archive group")                                  | **`sl-button`** `fill="link"` or `fill="ghost"` `variant="danger"` + **`sl-icon`**             | (inferred) — a _frame_, not an instance; white fill, red semibold label, 6 px radius. See Inconsistencies #4.                                                                                                      |
| `2142:48097`, `2142:48458`, `2142:48466`                                                             | `< Back to Groups`, `Regenerate`, `Cancel`                         | **`sl-link`** (back) / **`sl-button fill="link"`** (Regenerate, Cancel)                        | (inferred) — all three are bare **text nodes** in Figma with teal bold/semibold type and no button chrome.                                                                                                         |
| `2142:48151`–`2142:48154`                                                                            | `menu item SU`                                                     | **`sl-tab-group`**/`sl-tab` or plain `<nav><ul><li><a>` + `sl-link`                            | (inferred) — same component as A4 `2847:15060`–`15063`; active item carries a 2 px underline.                                                                                                                      |
| `2142:48491`–`2142:48495`                                                                            | `menu item footer`                                                 | plain `<nav><ul><li><a>` + **`sl-link`**                                                       | (inferred) — base Figma component `2:69240`, the same one A4 used.                                                                                                                                                 |
| `2142:48163`, `2142:48311`, `2142:48315`, `I2142:48156;775:12282`, `I2142:48156;775:12286`, `2:8680` | `school-flag`, `magnifying-glass`, `close`, `gear`, `chevron-down` | **`sl-icon`**                                                                                  | (inferred) — every one is a Font Awesome 6 Pro **text glyph** (`font-['Font_Awesome_6_Pro:Regular'\|Solid']`), not an SVG.                                                                                         |

### Developer-placeable component count — the "53 component types" figure is inflated

`get_metadata` reports ~400 nodes for this frame. Stripping internals (`Focus ring`,
`sl_base-*`, `label-container`, `divider`, `group-title`, `NN-option-state`, `divider-line`,
`core-icon`, `icon-bg`, `badge-bg`) and the 30 hidden dropdown-panel option rows, a developer
would **place 16 distinct component types**:

`sl-text-field` ×7 · `sl-select` ×2 · `sl-radio-group` ×1 (2 radios) · `sl-checkbox` ×1 ·
`sl-form-field` ×9 · `sl-button` ×7 (3 outline icon, 1 solid, 1 ghost pill, 1 danger link, +
Cancel/Regenerate as links) · `sl-icon` ×8 · `sl-tab-group` ×1 (3 tabs) · `sl-badge` ×2 ·
`sl-accordion` ×1 · `sl-avatar` ×1 · `sl-card` ×1 · `sl-link` ×10 (4 nav + 5 footer + back) ·
plus 3 image assets and 2 pure-layout regions.

---

## Composition Candidates

- **App shell header** — `2142:48139` (= `2142:48140` top nav bar with wordmark `2142:48141`,
  nav `2142:48150`, avatar `2142:48156`; + `2142:48157` secondary school bar with
  `2142:48162` school-flag + name and `2142:48168` "Switch school"). One fixed 1280 × 120 unit;
  byte-for-byte the same construction as A4's `2847:15003`, only re-branded.
- **Detail row (label / value / edit)** — `2142:48100`, `2142:48106`, `2142:48112`. The identical
  72 px row with a `#cecfd2` bottom rule repeats three times; only the label, the value and
  (notionally) the edit target change. Clearly one repeatable unit.
- **Page header block** — `2142:48094` as a whole: back link `2142:48097`, title `2142:48095`,
  the three detail rows `2142:48098`, the destructive action `2142:48119`, and the
  `2142:48126` Linking-code card. These five travel together above the tab strip.
- **Linking code card** — `2142:48126` (`2142:48127` key icon + "Linking code" heading;
  `2142:48131` the `AB3FRR` value; `2142:48133` an empty 249 × 40 action slot). A self-contained
  callout; the empty slot is almost certainly meant to hold a copy/regenerate button.
- **Tab strip** — `2142:48135` with `2142:48136`/`48137`/`48138`. Three tabs, two carrying a
  `sl-badge` count, one active with a 2 px inset underline and a `#cecfd2` strip rule.
- **Add-student search panel** — `2142:48171` (heading `2142:48174`, intro `2142:48177`, the
  4-control row `2142:48181`, the no-results box `2142:48309`, close `2142:48314`). A dismissible
  panel that behaves as one search form.
- **Search control row** — `2142:48181` (`2142:48182` First name, `2142:48183` Last name,
  `2142:48187` Email, `2142:48188` Grade level). Four equal-flex labelled controls in one row.
- **Empty / no-results box** — `2142:48309`. White 992-wide card, centred `magnifying-glass`
  - "No matching results" + an explanatory line. A reusable inline empty-result pattern.
- **Create-student form** — `2142:48317` (intro `2142:48318`; field column `2142:48321` with
  First name / Last name / Grade level / Login type radios / "Login types explained" accordion /
  Email / Username; plus the floating `2142:48458` "Regenerate"). One form with one submit.
- **Form action row** — `2142:48459` (`2142:48465` Create new student, `2142:48466` Cancel,
  `2142:48467` "Create another" checkbox). The submit/cancel/persist-flag triad.
- **Page empty state** — `2142:48470` (illustration `2142:48471`, heading `2142:48475`, body
  `2142:48476`). Icon-above-text centred block; the same shape recurs across this product.
- **App shell footer** — `2142:48477` (Sanoma logo `2142:48479` + five legal links
  `2142:48491`–`2142:48495`).

---

## Net-New Primitive Candidates

_None._ Every visual element resolves to an existing SLDS component or to plain layout markup.
The list below records the elements that look net-new but are **not**, so the decomposer does not
mistake them:

- `2142:48126` **Linking code** — a filled, 16 px-radius, drop-shadowed callout holding a 36 px
  bold code. Looks bespoke; it is `sl-card` + typography. The only genuinely unmatched detail is
  the **16 px radius** (`--sl-size-borderRadius-xl` is 12 px, there is no 16 px radius token) and
  the 36 px type size (no 36 px font-size token). Shape: container.
- `I2142:48136;11109:145011` **number-tag** — a 24 × 24 amber count pill. `sl-badge`. Shape:
  indicator.
- `3659:36698` **Accordion-multiple-view** — the "+" toggle is drawn as two 1.979 px bars rather
  than an icon, and the whole thing is a `<button>` with a bottom border. `sl-accordion-item`.
  Shape: disclosure.
- `2142:48471` **Empty ison** (sic — the Figma layer is misspelt) — a 100 × 71 illustration asset,
  not a component and not an icon. See "Assets" below.
- `2142:48119` **Button-sesame** — an ad-hoc destructive action frame. `sl-button`. Shape:
  button-like.
- `2142:48096` the 28 px page title, `2142:48175`/`48178`/`48319` the 18 px section headings —
  typography, not components.

---

## Responsive Breakpoints

_Single breakpoint: 1280px._

`2142:48093` is the only frame for this design. No sibling frame at another width, no constraint
annotation, no layout-grid node in `get_metadata`. Fixed internal widths the implementer must
know, because they are hard-coded rather than fluid:

- **1280 px** — outer frame; app header `2142:48139` and footer `2142:48477` are full-bleed at
  this width.
- **1024 px content column** with a **128 px** left/right gutter — the header's secondary bar
  (`px-[128px]`), the footer (`px-[128px]`, inner `2142:48478` w=1024), the content panel
  `2142:48170` (x=128, w=1024) and the tab strip (w=1024) all agree.
- **992 px inner panel width** — `2142:48171` and `2142:48316` sit at x=16 inside the 1024 column
  (1024 − 2×16 = 992).
- **Drifts from that grid** (see Inconsistencies): `Group 26820` `2142:48094` is at **x=127**
  (w=1025), the tab strip `2142:48135` is at **x=130**, and the search row `2142:48181` is
  **991 px** inside a 992 px panel.

---

## Designer Annotations

_No annotation, comment or sticky-note layer exists in `2142:48093`._ One stray vector is
present but carries no text:

- `2142:48496` — `<vector name="Arrow 9" x=328 y=1775 width=1415 height=0>`. A leftover
  annotation arrow with no label. It is the sole cause of the 464 px screenshot bleed. **Do not
  implement.**

Everything that reads like guidance comes from **Figma component descriptions** returned by
`get_design_context`, not from annotations on this screen. Quoted verbatim because they carry
usage constraints:

- `sl-text_input` (`7:35563`) — "A text field component allows users to enter and edit
  single-line textual input. It serves as a fundamental building block for various form inputs in
  user interfaces". Docs: https://sanomalearning.design/categories/components/text-field/
- `sl-text_input-theme` (`7:4834`) — "✏️ Only edit the properties below The colors of this
  component are fixed and you wouldn't have to edit them. You can adjust the width of the field to
  fit your design."
- `sl-text_input-theme [DEPRECATED]` (`7:5182`) — "⛔️ This component is deprecated. Please use
  the component \[Form Field\] in your projects going forward. ✏️ Only edit the properties below
  …"
- `sl-label-theme [DEPRECATED]` (`7:5008`) — "⛔️ This component is deprecated. Please use the
  component \[Form Field\] in your projects going forward. Padding property"
- `sl-label-theme` (`2:99832`) — "Padding property"
- `sl_base-text_input-lg` (`7:4708`) and `sl_base-text_input-lg2` (`7:4824`) — "🚫 Do not edit
  this component. This component is used to build the text input component and not intended for
  independent use. ↖️ Instead, edit the top-level component."
- `sl-checkbox [DEPRECATED]` (`2:50638`) — "⛔️ This component is deprecated. Please use the
  component \[Form Field\] in your projects going forward. Checkboxes allow users to choose one or
  more items from a list of options, providing a convenient way to make selections. They typically
  appear in forms." Docs: https://sanomalearning.design/categories/components/checkbox/
- `sl-checkbox-theme [DEPRECATED]` (`2:50640`) — "⛔️ This component is deprecated. Please use
  the component \[Form Field\] in your projects going forward."
- `Property 1=Default` / Avatar (`777:12400`) — "An avatar is a visual representation of an
  entity, such as a user or an organization. **Notes** — A subheader on a small horizontal avatar
  is not allowed and is turned off by default."
  Docs: https://sanomalearning.design/categories/components/avatar/
- `DEMO - Tab-switches` (`2:69119`) — "✨Variants"
- `State=Active, Content=Number indicator` (`2:69159`) and `State=Inactive, Content=Number
indicator` (`2:69162`) — "Tab / Default"
- `number-tag` (`2:69165`) — "✅ implemented"

**Three of these descriptions say the design is built on components Figma itself marks
deprecated** (`sl-text_input-theme`, `sl-label-theme`, `sl-checkbox`), with the instruction to use
Form Field instead. That is a direct, in-file designer instruction to implement with
`sl-form-field`.

---

## Token Reference

Built primarily from `get_variable_defs` (25 distinct bound variables across 13 probed nodes —
`figma-variable-defs.json`), supplemented by `get_design_context`. Variable names are quoted
verbatim.

**Method for everything not variable-bound:** each raw value was searched **by resolved value**
across `packages/themes/` — the `itslearning` palette was flattened (all `var()` chains resolved
with a script) and the nearest entry computed by channel distance. No token name below was
invented; each was read out of `packages/themes/itslearning/theme.css` or
`typography.css`. Where no exact match exists, the nearest is named with its delta.

### Color — bound variables

| Bound variable (verbatim)                                 | Raw value | Where it is used                                        | itslearning token to use                                                                                                       |
| --------------------------------------------------------- | --------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `color/input/option/default/checked/default/background`   | `#01766D` | checked radio fill                                      | `--sl-color-background-primary-bold` (= `#008859`) — role match, value differs                                                 |
| `color/input/option/default/checked/default/border`       | `#01766D` | checked radio ring                                      | `--sl-color-border-primary-plain` (= `#008859`)                                                                                |
| `color/input/option/default/checked/default/icon`         | `#FFFFFF` | radio dot                                               | `--sl-color-foreground-inverted-plain` (**exact**, `#ffffff`)                                                                  |
| `color/input/option/default/checked/default/label`        | `#323232` | radio label                                             | `--sl-color-foreground-accent-grey-bold` (= `#333333`, Δ=3) — see note below                                                   |
| `color/input/option/default/unchecked/default/background` | `#FFFFFF` | unchecked radio / checkbox fill                         | `--sl-color-background-input-plain` (**exact**, `#ffffff`)                                                                     |
| `color/input/option/default/unchecked/default/border`     | `#5D5D5D` | unchecked radio + checkbox 2 px border                  | `--sl-color-foreground-subtle` (= `#565656`, Δ=21)                                                                             |
| `color/input/option/default/unchecked/default/label`      | `#323232` | radio / checkbox label                                  | `--sl-color-foreground-accent-grey-bold` (= `#333333`, Δ=3)                                                                    |
| `color/input/fieldLabel/text/default`                     | `#323232` | every field label                                       | `--sl-color-foreground-accent-grey-bold` (= `#333333`, Δ=3)                                                                    |
| `color/input/textField/default/default/inputText`         | `#323232` | input value text                                        | `--sl-color-foreground-accent-grey-bold` (= `#333333`, Δ=3)                                                                    |
| `color/input/textField/default/default/background`        | `#FFFFFF` | input fill                                              | `--sl-color-background-input-plain` (**exact**)                                                                                |
| `color/input/textField/default/default/border`            | `#9D9F9F` | input 1 px border                                       | `--sl-color-border-input` (= `#757575`, Δ=118) — role match; nearest _value_ is `--sl-color-palette-grey-500` `#9b9b9b` (Δ=10) |
| `secondary text color`                                    | `#5D5D5D` | "Linking code" heading, inactive tab label, placeholder | `--sl-color-foreground-subtle` (= `#565656`, Δ=21)                                                                             |
| `Neutrals/$kampus-color-gray-1`                           | `#F5F5F6` | Linking-code card fill                                  | `--sl-color-palette-grey-100` (= `#f4f4f4`, Δ=4) — semantically `--sl-elevation-surface-raised-sunken` (`#f9f9f9`)             |
| `Gray/gray 300`                                           | `#BFBFBF` | accordion bottom border                                 | `--sl-color-palette-grey-400` (= `#cfcfcf`, Δ=48) / `--sl-color-border-disabled`                                               |

> **`--sl-color-foreground-plain` resolves to `#4a4a4a` in itslearning**, not `#333333`. For the
> design's `#323232` body text the closer token is `--sl-color-foreground-accent-grey-bold`
> (`#333333`, Δ=3). If the decomposer prefers the plainer semantic name,
> `--sl-color-foreground-plain` is the right _role_ but is 24 units lighter. Both exist; pick
> deliberately and record which.

### Color — present in `get_design_context` but **not** variable-bound

Every value below was searched by resolved hex in `packages/themes/itslearning/`. **Only
`#ffffff` has an exact match in this theme.** Nearest entries are named with their
`|ΔR|+|ΔG|+|ΔB|` distance.

| Raw                      | Where                                                                                                                                                | itslearning: exact?                                                                                                                                    | Token to use                                                                                                                                                                                                |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `#01766d`                | back link, Switch school, outline-button border, primary button fill, Cancel, Regenerate, radio                                                      | **no** — nearest `--sl-color-palette-teal-700` `#066769` (Δ=24)                                                                                        | role: `--sl-color-background-primary-bold` / `--sl-color-foreground-primary-bold` / `--sl-color-border-primary-plain`. **itslearning's primary is green `#008859`, not teal — expect a visible hue shift.** |
| `#2e5c64`                | active tab 2 px inset underline (`2142:48136`)                                                                                                       | **no** — nearest `--sl-color-palette-teal-800` `#0a5757` (Δ=54)                                                                                        | `--sl-color-border-primary-bold` (= `#005a3b`). Note this is a _third_ teal, distinct from `#01766d` — see Inconsistencies #5.                                                                              |
| `#323232`                | all body/heading/label/icon text                                                                                                                     | **no** — `--sl-color-palette-grey-900` `#333333` (Δ=3)                                                                                                 | `--sl-color-foreground-accent-grey-bold` (`#333333`) or `--sl-color-foreground-plain` (`#4a4a4a`)                                                                                                           |
| `#323`                   | shorthand emitted by Figma for `2142:48175`/`48178`/`48319` headings — **expands to `#332233`**, almost certainly a Figma serialisation of `#323232` | n/a                                                                                                                                                    | treat as `#323232`                                                                                                                                                                                          |
| `#5d5d5d`                | secondary text, inactive tab, select placeholder, radio/checkbox border                                                                              | **no** — `--sl-color-palette-grey-700` `#565656` (Δ=21)                                                                                                | `--sl-color-foreground-subtle`                                                                                                                                                                              |
| `#9d9f9f`                | all input borders                                                                                                                                    | **no** — `--sl-color-palette-grey-500` `#9b9b9b` (Δ=10)                                                                                                | `--sl-color-border-input` (role; resolves `#757575`)                                                                                                                                                        |
| `#cecfd2`                | detail-row dividers (`2142:48100/48106/48112`), tab-strip rule (`2142:48135/48137/48138`)                                                            | **no** — `--sl-color-palette-grey-400` `#cfcfcf` (Δ=4)                                                                                                 | `--sl-color-border-plain` (resolves `#e1e1e1`) — or the near-exact `--sl-color-palette-grey-400`                                                                                                            |
| `#bfbfbf`                | accordion bottom border (`3659:36698`)                                                                                                               | **no** — `--sl-color-palette-purple-300` `#c2b5ca` (Δ=24), `--sl-color-palette-grey-400` `#cfcfcf` (Δ=48)                                              | `--sl-color-border-plain` / `--sl-color-border-disabled`                                                                                                                                                    |
| `#f5f5f6`                | Linking-code card fill                                                                                                                               | **no** — `--sl-color-palette-grey-100` `#f4f4f4` (Δ=4)                                                                                                 | `--sl-elevation-surface-raised-sunken` (`#f9f9f9`)                                                                                                                                                          |
| `#f6f8f8`                | footer background, accordion header background                                                                                                       | **no** — `--sl-color-palette-grey-050` `#f9f9f9` (Δ=5)                                                                                                 | `--sl-elevation-surface-raised-sunken` (`#f9f9f9`). **Do not use `--sl-color-background-subtle` — it resolves to the translucent `#9b9b9b33`, not a light surface.**                                        |
| `#f2a900`                | `number-tag` fill (tab counts)                                                                                                                       | **no** — nearest `--sl-color-palette-orange-400` `#fe8211` (Δ=68); `--sl-color-palette-yellow-500` `#d1901f` (Δ=89)                                    | `--sl-color-background-accent-yellow-bold` (role) — expect a large value shift. Vendor amber; flag to the designer.                                                                                         |
| `#ed1111`                | "Archive group" label + icon                                                                                                                         | **no** — nearest _red_ `--sl-color-palette-red-500` `#cf4444` (Δ=132); numerically nearest overall is `--sl-color-palette-orange-500` `#ef6707` (Δ=98) | `--sl-color-foreground-negative-bold` (= `#8e2626`)                                                                                                                                                         |
| `#ffffff`                | surfaces, inputs, button-on-brand label                                                                                                              | **yes** — `--sl-color-white` / `--sl-color-palette-grey-000`                                                                                           | `--sl-color-white` · `--sl-elevation-surface-raised-default` · `--sl-color-foreground-inverted-plain`                                                                                                       |
| `#000000`                | page title `2142:48096`, empty-state text `2142:48474`                                                                                               | **yes** — `--sl-color-black`                                                                                                                           | almost certainly meant to be `#323232`; use `--sl-color-foreground-accent-grey-bold`                                                                                                                        |
| `#222`                   | the shared `ChevronDown` glyph colour (`2:8680`)                                                                                                     | **no** — nearest `--sl-color-palette-grey-900` `#333333` (Δ=51)                                                                                        | `--sl-color-foreground-accent-grey-bold`                                                                                                                                                                    |
| `rgba(255,255,255,0.01)` | tab hit-area overlays                                                                                                                                | n/a                                                                                                                                                    | not a design intent — a Figma hit-target artefact. **Do not implement.**                                                                                                                                    |

**Conclusion on colour:** this design's grey ramp (`#323232 / #5d5d5d / #9d9f9f / #cecfd2 /
#bfbfbf / #f5f5f6 / #f6f8f8`) is the Sanoma ramp, and in `itslearning` it lands within Δ≤10 of
`grey-900 / grey-700 / grey-500 / grey-400 / grey-100 / grey-050` — close enough that the
semantic tokens are safe. The **brand teal `#01766d` has no home in this theme at all**
(itslearning primary is green); that one substitution will dominate any pixel comparison and
should be called out rather than treated as a defect.

### Size / Spacing — all verified in `theme.css`

Every spacing value in this design is on the 4 px scale and has an **exact** token:

`4px` → `--sl-size-050` · `8px` → `--sl-size-100` · `12px` → `--sl-size-150` ·
`16px` → `--sl-size-200` · `24px` → `--sl-size-300` · `32px` → `--sl-size-400` ·
`40px` → `--sl-size-500` · `56px` → `--sl-size-700` · `64px` → `--sl-size-800` ·
`80px` → `--sl-size-1000` · `2px` → `--sl-size-025` · `1px` → `--sl-size-010`

- **1 px borders** (inputs, dividers, accordion rule) → `--sl-size-010` or
  `--sl-size-borderWidth-subtle` (both 1px). **`--sl-size-border` does not exist** — do not emit it.
- **2 px borders** (radio ring, checkbox box, active-tab underline) → `--sl-size-borderWidth-default`
  / `-bold` / `-action` (all 2px), or `--sl-size-025`.
- **128 px page gutter** → **no exact token**; the scale tops out at `--sl-size-1000` = 80px.
  Compose as `calc(var(--sl-size-1000) + var(--sl-size-600))` or treat as a page constant.
- **13 px** accordion internal gap (`gap-[13px]`, `3659:36698`) → **no exact token**; between
  `--sl-size-150` (12px) and `--sl-size-175` (14px). Off-scale; normalise to 12px.
- **10 px** nav vertical padding (`py-[10px]`, `2142:48150`) → `--sl-size-125` (**exact**).
- **3 px / 1 px** number-tag padding (`px-[3px] py-px`) → 1px = `--sl-size-010`; **3 px has no
  token** (between `--sl-size-025` and `--sl-size-050`). Use `sl-badge`'s own padding.
- **9 px** avatar-badge glyph box → no token; use `sl-avatar`'s own badge sizing.

Border radii (all verified):

- `2px` → `--sl-size-borderRadius-sm` · `4px` → `--sl-size-borderRadius-md`
  (= `--sl-size-borderRadius-default`) · `8px` → `--sl-size-borderRadius-lg` ·
  `12px` → `--sl-size-borderRadius-xl`
- `800px` / `999px` (Switch-school pill, radio circle, avatar badge) → `--sl-size-borderRadius-full`
  (= `50rem`)
- **`6px`** (Archive-group frame `2142:48119`) → **no exact token**; between `-md` (4px) and
  `-lg` (8px).
- **`16px`** (Linking-code card `2142:48126`) → **no exact token**; the scale stops at `-xl`
  (12px).
- `0.825px` (accordion plus-glyph bar rounding) → sub-pixel; ignore.

Icon glyph sizes used: `9px`, `12px`, `14px`, `16px`, `18px`, `20px`, `24px`.
Tokens: `--sl-size-icon-font-2xs` 10px · `-xs` 12px · `-sm` **14px** · `-md` 16px · `-lg` 20px ·
`-xl` 24px (`--sl-size-new-icon-*` is an identical parallel set). **18 px and 9 px have no icon
token.** (A4's manifest states `--sl-size-icon-font-sm` is 12px — it is 14px.)

### Typography — the design is 100% **Open Sans**, and so is `--sl-typography-*`

> **Shorthand warning (confirmed for this theme).** Every typography slot in
> `packages/themes/itslearning/` ships **only as longhands** — `-fontFamily`, `-fontSize`,
> `-lineHeight`, `-fontWeight`, `-letterSpacing`. There is **no bare `--sl-typography-text-md`
> or `--sl-text-new-body-md`** token. `font: var(--sl-text-new-body-md)` resolves to nothing and
> the browser drops the whole declaration silently. Always set the longhands separately.
>
> **Also note the suffixes.** The real names end `-fontSize` / `-lineHeight` / `-fontFamily`.
> There is **no `-font` or `-line` suffix** (A4's manifest uses `--sl-text-new-heading-xl-font`
> and `-line`; neither exists).

Two Open-Sans scales exist in this theme and both are usable:

| Namespace           | Slots                                                                                                                                                                                               | Family        |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `--sl-typography-*` | `display-{sm,md,lg}`, `heading-{sm,md,lg}`, `title-{sm,md,lg}`, `text-{sm,md,lg}`, `label-{sm,md,lg}`, `caption-{md,lg}` — each with `-fontFamily/-fontSize/-lineHeight/-fontWeight/-letterSpacing` | `'Open Sans'` |
| `--sl-text-new-*`   | `heading-{sm,md,lg,xl,2xl}`, `body-{sm,md,lg}`, `input-{md,lg}`, `icon-{outline,solid}`, `typeset-*`                                                                                                | `'Open Sans'` |

**`--sl-typography-*` is the better fit here** because it carries matching weights. Bound
variables and their best token:

| Bound variable (verbatim)        | Value                                                                                                  | Used for                                                                                   | Best itslearning match                                                                                                                                                                                                                                               |
| -------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Body/Small`                     | `Font(family: "Open Sans", style: Regular, size: 16, weight: 400, lineHeight: 24, letterSpacing: 0)`   | inactive tab labels, body copy, input values                                               | `--sl-typography-text-lg-*` (16/24/400/0%) — **exact on all four**                                                                                                                                                                                                   |
| `Body/Small-bold`                | `Font(family: "Open Sans", style: Bold, size: 16, weight: 700, lineHeight: 24, letterSpacing: 0)`      | active tab label                                                                           | `--sl-typography-text-lg-*` + `--sl-fontWeight-bold` (slot ships 400)                                                                                                                                                                                                |
| `text/input/option/md`           | `Font(family: "Open Sans", style: Regular, size: 14, weight: 400, lineHeight: 20, letterSpacing: 0)`   | radio / checkbox labels                                                                    | `--sl-typography-text-md-*` (14/20/400/0%) — **exact on all four**                                                                                                                                                                                                   |
| `text/input/textField/text/lg`   | `Font(family: "Open Sans", style: Regular, size: 16, weight: 400, lineHeight: 24, letterSpacing: 0)`   | input text                                                                                 | `--sl-typography-text-lg-*` — **exact**                                                                                                                                                                                                                              |
| `text button`                    | `Font(family: "Open Sans", style: Bold, size: 14, weight: 700, lineHeight: 24, letterSpacing: 0)`      | primary/secondary button labels                                                            | **no exact** — `--sl-typography-text-md-*` is 14/20; `-text-lg-*` is 16/24. Nearest is 14px + `--sl-size-lineHeight-300` (24px) + `--sl-fontWeight-bold`.                                                                                                            |
| `text/input/fieldLabel/label/sm` | `Font(family: "Open Sans", style: Bold, size: 14, weight: 700, lineHeight: 16, letterSpacing: 0)`      | every field label                                                                          | **no exact** — `--sl-typography-label-lg-*` is 14/18/600/1%. Compose 14px + `--sl-size-lineHeight-200` (16px) + `--sl-fontWeight-bold`.                                                                                                                              |
| `text/input/fieldLabel/tag/sm`   | `Font(family: "Open Sans", style: Regular, size: 14, weight: 400, lineHeight: 16, letterSpacing: 0)`   | "(optional)" suffix                                                                        | same, with `--sl-fontWeight-regular`                                                                                                                                                                                                                                 |
| `UI/Tiny-bold`                   | `Font(family: "Open Sans", style: Bold, size: 12, weight: 700, lineHeight: 16, letterSpacing: 3)`      | `number-tag` numeral (ls 0.36px = 3%)                                                      | `--sl-typography-label-md-*` is 12/16/600/1%; `--sl-typography-text-sm-*` is 12/16/400/0%. Use text-sm sizes + `--sl-fontWeight-bold`; the 3% tracking has no token.                                                                                                 |
| `H3` and `H4` (identical)        | `Font(family: "Open Sans", style: SemiBold, size: 18, weight: 600, lineHeight: 100, letterSpacing: 0)` | "Add student TO GROUP", "Search for a student", "Can't find the student?", accordion title | **no 18 px token exists** in `--sl-typography-*` or `--sl-size-font-*`. Nearest sizes are 16px (`--sl-typography-title-md/sm`, w600 — right weight) and 22px (`--sl-typography-title-lg`, w600). Recommend `--sl-typography-title-md-*` + an 18px override, flagged. |

Unbound typography seen in `get_design_context`:

| Design value                                        | Node                                         | Token verdict                                                                                                                                                                                                                            |
| --------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Open Sans **Bold 28 / 40**, ls −0.56px (−2%)        | page title `2142:48096`                      | `--sl-typography-heading-sm-*` = 28/36/700/0% — **fontSize and weight exact**, lineHeight 4px short, no −2% tracking. There is **no 28 px `--sl-size-font-*`** (the scale jumps 24 → 32).                                                |
| Open Sans **Bold 36 / 40**, ls −0.72px              | linking code `2142:48132`                    | **no 36 px token.** `--sl-typography-heading-md-*` = 32/40/700 — lineHeight exact, size 4px short.                                                                                                                                       |
| Open Sans **Bold 24 / normal**                      | empty-state heading `2142:48475`             | `--sl-text-new-heading-lg-fontSize` = 24px, `-lineHeight` = 32px; or `--sl-size-font-300` (24px). Weight via `--sl-fontWeight-bold` (the slot ships no `-fontWeight`).                                                                   |
| Open Sans **Bold 28** value rows (`leading-[28px]`) | `2142:48104`, `48110`, `48116`               | 16px bold on a 28px line — `--sl-typography-text-lg-fontSize` (16px) + `--sl-size-lineHeight-*` has no 28px entry (jumps 24 → 32). Off-scale.                                                                                            |
| Open Sans **Regular 16 / 24**, ls −0.32px (−2%)     | detail-row labels `2142:48103/09/15`         | `--sl-typography-text-lg-*` — exact except the −2% tracking, which has no token.                                                                                                                                                         |
| Open Sans **SemiBold 14 / 24**                      | nav items, footer links, Cancel, school name | **no exact** — `--sl-typography-label-lg-*` is 14/18/600. Compose 14px + 24px line + `--sl-fontWeight-semiBold`.                                                                                                                         |
| Open Sans **Bold 14 / 16**                          | "Switch school" `I2142:48168;915:4408`       | same as `text/input/fieldLabel/label/sm` above                                                                                                                                                                                           |
| Open Sans **Bold 16 / 20**, ls 0.4px                | "Regenerate" `2142:48458`                    | 16px + `--sl-size-lineHeight-250` (20px) + `--sl-fontWeight-bold`; tracking untokenised                                                                                                                                                  |
| Open Sans **SemiBold 14 / 24**, ls 0.42px (3%)      | "Archive group" `2142:48124`                 | as above; tracking untokenised                                                                                                                                                                                                           |
| Open Sans **Regular 18 / 28**                       | accordion title                              | 18px has no token (see H3/H4)                                                                                                                                                                                                            |
| `leading-[21px]` and `leading-[25px]`               | no-results box `2142:48309`, headings        | off-scale line heights; no 21/25 px token. Normalise to 20/24.                                                                                                                                                                           |
| Open Sans **Regular 14 / 20** + **12 / 12**         | avatar name / role `2142:48156`              | `--sl-typography-text-md-*` (exact) / 12px with a 12px line — `--sl-size-lineHeight-150` = 12px (exact)                                                                                                                                  |
| **Font Awesome 6 Pro** Regular & Solid              | every icon glyph                             | the theme declares **`'Font Awesome 7 Pro'`** (`--sl-text-new-icon-outline-fontFamily`, `--sl-icon-typeset-fontFamily-classic`) — a **major-version mismatch** with the design. Use `sl-icon` and the theme registry, never a raw glyph. |

Named weights confirmed to exist: `--sl-fontWeight-regular` 400, `-medium` 500, `-semiBold` 600,
`-bold` 700 (plus the numeric `--sl-fontWeight-100`…`-950`).

### Other

| Bound variable (verbatim) | Value                                                                               | Token / verdict                                                                                                                                                                                               |
| ------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shadow-low`              | `Effect(type: DROP_SHADOW, color: #6D6E7359, offset: (0, 2), radius: 8, spread: 0)` | Linking-code card. Nearest: `--sl-elevation-shadow-overlay`. The rendered CSS is actually `drop-shadow(0px 2px 4px rgba(109,110,115,0.35))` — radius 4, not 8 (the variable and the applied effect disagree). |
| `boxShadow/none`          | `Effect(type: DROP_SHADOW, color: #00000000, offset: (0, 0), radius: 0, spread: 0)` | a no-op bound on every input and the checkbox — emit nothing.                                                                                                                                                 |

Unbound effects:

- `shadow-[inset_0px_-2px_0px_0px_#2e5c64]` — active-tab underline (`2142:48136`). Not a shadow
  intent: implement as a 2 px (`--sl-size-borderWidth-bold`) bottom border in
  `--sl-color-border-primary-bold`.
- `drop-shadow-[0px_0px_0px_rgba(0,0,0,0)]` — on every input wrapper. A no-op; emit nothing.

Surfaces:

- White panels / inputs / nav bars → `--sl-elevation-surface-raised-default` (`#ffffff`)
- `#f5f5f6` card and `#f6f8f8` footer/accordion → `--sl-elevation-surface-raised-sunken` (`#f9f9f9`)

---

## Assets — a known omission

**There is no asset-export step in this pipeline.** Four image assets are referenced and will be
missing from the implementation. All four URLs are short-lived Figma MCP asset links that expire
in 7 days; none may be linked from committed code.

| Node                                                  | Asset                                                  | Nature                                                           |
| ----------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------- |
| `2142:48141` / `2142:48145`                           | **MittSanoma wordmark**, 123.47 × 24, masked SVG       | brand logo — render a text wordmark sized to the box             |
| `2142:48479`                                          | **SANOMA + "för dig som lär" payoff**, 201.6 × 126 SVG | footer logo — render a text wordmark                             |
| `2142:48471`                                          | **"Empty ison"** illustration, 100 × 71.36 SVG         | empty-state art — substitute an `sl-icon` or omit, and record it |
| `2142:48120`, `2142:48128`, `I2142:48105;2846:104553` | `archive 1`, `key (5) 1`, pencil — 16 × 16 SVGs        | should be `sl-icon`, but see the icon gap below                  |

---

## Icon availability — `packages/themes/itslearning/icons.ts` registers **54** icons

Only these may be used. **`@fortawesome/*` is NOT installed in this checkout** — importing it is a
render blocker.

Registered: `angle-down`, `arrow-left`, `arrow-right`, `arrow-up-right-from-square`,
`badge-available`, `badge-away`, `badge-donotdisturb`, `badge-offline`, `breadcrumb-separator`,
`calendar`, `caret-down-solid`, `caret-left-solid`, `caret-right-solid`, `check`, `check-solid`,
`chevron-down`, `chevron-left`, `chevron-right`, `circle-check-solid`, `circle-exclamation-solid`,
`circle-solid`, `circle-xmark`, `circle-xmark-solid`, `clock`, `dash-solid`,
`diamond-exclamation-solid`, `ellipsis`, `ellipsis-down`, `ellipsis-vertical`, `envelope`,
`error`, `eye`, `face-smile`, `fav`, `grip-lines`, `hand`, `home-blank`, `info`, `menu`, `minus`,
`mobile`, `octagon-exclamation-solid`, `octagon-xmark-solid`, `pinata`, `plus`, `search`, `smile`,
`sort`, `sort-down`, `sort-up`, `square-arrow-up-right`, `star`, `triangle-exclamation-solid`,
`xmark`.

| Icon the design needs                     | Nodes                                    | Registered?                                                           |
| ----------------------------------------- | ---------------------------------------- | --------------------------------------------------------------------- |
| `chevron-down` (avatar menu, 2 selects)   | `I2142:48156;775:12286`, `2:8680`        | ✅ `chevron-down`                                                     |
| `magnifying-glass` (no-results)           | `2142:48311`                             | ✅ registered under the name **`search`** (`value: magnifying-glass`) |
| `close` / `xmark` (panel dismiss)         | `2142:48315`                             | ✅ `xmark`                                                            |
| accordion expand toggle (drawn as a `+`)  | `I3659:36698;…;5273:46106`               | ✅ `plus`                                                             |
| **pencil / edit** (3 inline edit buttons) | `I2142:48105;2846:104553` and 2 siblings | ❌ **not registered** — no `pencil`, `pen` or `edit`                  |
| **archive**                               | `2142:48120`                             | ❌ **not registered** — no `archive` / `box-archive`                  |
| **key**                                   | `2142:48128`                             | ❌ **not registered**                                                 |
| **school-flag**                           | `2142:48163`                             | ❌ **not registered** — no `school`, `flag`                           |
| **gear** (avatar badge)                   | `I2142:48156;775:12282`                  | ❌ **not registered** — no `gear` / `cog`                             |

**Five of nine icons are missing from the theme registry.** This is a recorded omission, not
something to work around by importing Font Awesome. Note also the theme declares
**`'Font Awesome 7 Pro'`** while the design uses **Font Awesome 6 Pro** glyphs.

---

## Relationship to the sibling run A4 (`a4-sesame-my-groups`, node `2847:14994`)

Same Figma file, same 1280 width, **shared source components**:

| Component (Figma base node)                            | A4 node(s)                 | This frame                  | Same?                                                                                                                          |
| ------------------------------------------------------ | -------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `menu item SU` (`772:26895`)                           | `2847:15060`–`15063`       | `2142:48151`–`48154`        | identical component; labels differ (Groups active in both)                                                                     |
| `avatar_SU` (`777:12400`)                              | `2847:15065`               | `2142:48156`                | identical; A4 = "Anna Magiera / Administrator / AM", here "Anna Magiera / **Teacher** / **EM**"                                |
| `button` "Switch school" (`915:4408`)                  | `2847:15075`               | `2142:48168`                | identical 800px-radius ghost pill                                                                                              |
| `menu item footer` (`2:69240`)                         | A4 footer `2:70481`–`86`   | `2142:48491`–`48495`        | same base component; **A4's footer has a language selector and 5 VanIn links; this footer has 5 Sanoma links and no selector** |
| `sl-text_input` family (`7:35563`, `7:5182`, `7:4824`) | `2847:15397` (search)      | 7 fields here               | same library                                                                                                                   |
| `sl-helper-theme`                                      | `2847:15709` (**visible**) | 5 instances, **all hidden** | A4 renders an error strip; here none render                                                                                    |
| `Icon-button` / `Icon-button-sesame` (`1:107`)         | `2847:15248` ×20           | `2142:48117` (**hidden**)   | present but hidden here                                                                                                        |

**A4 also owns a `groups-table`; this screen has no table at all** — the Students tab shows an
add-student form and an empty state, not a grid. There is no overlap to reuse.

### Where A4's reading looks wrong (verified against this checkout)

Recorded so the decomposer does not inherit the errors:

1. **`--sl-color-background-transparent` does not exist** in `itslearning/theme.css` (0 matches).
   A4 cites it three times.
2. **`--sl-color-border-subtle` does not exist.** The real name is `--sl-color-border-neutral-subtle`
   (which resolves to the translucent `#9b9b9b33`).
3. **`--sl-size-border` does not exist.** 1 px is `--sl-size-010` or `--sl-size-borderWidth-subtle`.
4. **`--sl-text-new-*-font` / `-line` do not exist.** The suffixes are `-fontSize`, `-lineHeight`,
   `-fontFamily`. A4 uses `--sl-text-new-heading-xl-font` and `-line` throughout its Stage-2 specs.
5. **28 px → `--sl-size-font-400` is wrong**; that token is 32px and there is no 28px entry.
6. **`--sl-size-icon-font-sm` is 14px**, not 12px; 12px is `-xs`.
7. **`sl-tabs` is not an element.** It is `sl-tab-group` (+ `sl-tab`, `sl-tab-panel`).
8. **`#f6f8f8` → `--sl-color-background-subtle` is misleading**; that token resolves to
   `#9b9b9b33`. `--sl-elevation-surface-raised-sunken` (`#f9f9f9`) is the surface A4 wanted.
9. A4's claim that `--sl-color-palette-grey-300` is an **exact** match for `#e1e1e1` — **correct**,
   confirmed.
10. A4's `sl-searchfield` → `sl-search-field` correction — **correct**, and the same class of
    trap recurs here (`sl-text_input` → `sl-text-field`).

---

## Inconsistencies found in the design

Recorded so the decomposer does not faithfully reproduce them.

1. **Layer name lies about content.** `2142:48104` is named **`4B`** but renders **"French 1D"**.
   The rendered text is authoritative.
2. **Icon layer name lies.** The three inline edit buttons contain a child named
   **`Icons/plus`** (`I2142:48105;2846:104553`), but the asset constant is `imgIconsEdit2` and the
   screenshot shows a **pencil**. Treat it as an edit/pencil icon.
3. **Avatar initials don't match the name.** `I2142:48156;775:12284` renders **"EM"** for
   **"Anna Magiera"** (should be "AM"). A4 has the same avatar with "AM".
4. **"Archive group" is not a button component.** `2142:48119` is a plain `<frame>` with
   `bg-white`, a **6 px** radius (every other button here is 4 px), a red `#ed1111` semibold
   label, `justify-end`, a hidden `icon-right` (`2142:48125`), and the `archive 1` icon placed at
   x=65 inside a 189 px box. Its geometry is broken; rebuild as `sl-button`.
5. **Three different teals on one screen.** `#01766d` (links, buttons, radio), `#2e5c64` (active
   tab underline), and the footer logo's dark green. Unify on one primary token.
6. **Five different button treatments.** `button secondary` (outline teal, 4px, icon-only),
   `button primary` (solid teal, 4px), `button` (ghost, 800px pill), `Button-sesame` (white/red,
   6px), and three bare **text nodes** acting as buttons (`< Back to Groups` `2142:48097`,
   `Cancel` `2142:48466`, `Regenerate` `2142:48458`). Unify on `sl-button` / `sl-link`.
7. **Two mutually exclusive states are drawn simultaneously.** The "Add student to group" panel
   (`2142:48171`), the create-student form (`2142:48316`) and the **empty state** "You don't have
   any students yet" (`2142:48470`, y=1937) are all visible at once — yet the Students tab badge
   says **10**. Pick one state; the empty state is almost certainly an alternative-state artboard
   left in place.
8. **The empty state's body copy is a bulleted list with one bullet.** `2142:48476` renders as
   `<ul><li class="list-disc">Start by adding a student</li></ul>`, centred. Almost certainly
   unintended.
9. **Grid drift.** The content column is 1024 px at x=128, but `Group 26820` (`2142:48094`) is at
   **x=127** with w=**1025**, the tab strip (`2142:48135`) is at **x=130**, the inner detail block
   (`2142:48098`) at **x=127**, and the search row (`2142:48181`) is **991 px** inside a 992 px
   panel. Normalise to 128 / 1024 / 992.
10. **The tab strip is double-positioned.** `2142:48135` ("tabs", x=130 y=568) sits inside
    `2142:48134` ("Group 26821", x=130 y=568) with identical geometry — a redundant wrapper.
11. **Two "Grade level" selects disagree.** `2142:48188` shows the placeholder "Please select"
    at 16/24 in a 242 px box; `2142:48334` shows the value "3" at **14/20** in a 320 px box.
    Every other input on the page is 16/24. The 14/20 one is the outlier.
12. **The Linking-code card has an empty action slot.** `2142:48133` is a 249 × 40 empty frame at
    the bottom of the card — presumably a missing "Copy code" button. Nothing to render.
13. **Three more empty/placeholder frames:** `2142:48095` (a 934 × 40 wrapper holding only the
    352 px title), `2142:48164` ("School label" wrapper), `2142:48462`/`48463`/`48464` (three
    nested single-child wrappers around the primary button).
14. **Footer links overflow their container.** `2142:48490` ("Frame 26827") is at **x=−143**
    inside a 520 px parent and is 663 px wide. The negative offset is how the five links fit.
15. **Action-row ordering is unusual.** In `2142:48459` the "Create another" checkbox
    (`2142:48467`) sits **below** the Create/Cancel buttons rather than above them.
16. **"Regenerate" is absolutely positioned.** `2142:48458` is placed at `left: 336px;
top: 621px` as a sibling of the whole form rather than next to the Username field it belongs
    to. Fragile; re-parent it.
17. **The design is built on Figma-deprecated components.** `sl-text_input-theme [DEPRECATED]`,
    `sl-label-theme [DEPRECATED]`, `sl-checkbox [DEPRECATED]` — Figma's own descriptions say to
    use **Form Field** instead. Implement with `sl-form-field`.
18. **Stray annotation arrow.** `2142:48496` ("Arrow 9", 1415 px wide, zero height) crosses the
    Username field and extends 463 px beyond the frame. Do not implement; it is the cause of the
    screenshot bleed.
19. **Hidden layers left in place** — do not implement any of these:
    `2142:48117` (`Icon-button-sesame`), `2142:48125` (`icon-right`), `2142:48165`
    (`roofing_FILL0_…`), `2142:48169` (`Button`), `2142:48186`/`48308`/`48325`/`48333`/`48454`
    (five `sl-helper-theme`), `2142:48196`/`48197`/`48343`/`48344` (inputText/placeholder),
    `2142:48200`/`48346` (Focus ring), `2142:48331` (`core-icon`), and the two entire 15-option
    dropdown **Panels** `2142:48202` and `2142:48348` (≈100 hidden nodes between them — a quarter
    of the whole tree). The panels do confirm `sl-select` should carry 15 `sl-option`s, with
    optional dividers and group titles.
20. **Figma emitted `#323` for three headings** (`2142:48175`, `48178`, `48319`) where every other
    text node uses `#323232`. `#323` expands to `#332233` (a purple); it is a serialisation
    artefact. Treat as `#323232`.

---

## Known gaps in this manifest

Stated plainly rather than papered over:

1. **The content panel's own background was not fetched.** `2142:48170` ("Frame 1000000800",
   x=128 w=1024 h=1293) was not called on its own — only its two children were. Its fill is
   therefore not in `figma-design-context.md`. From the screenshot it is a light grey matching the
   `#f6f8f8` used by the footer and accordion, but that is a visual read, not captured data. One
   extra `get_design_context` call on `2142:48170` would settle it.
2. **No text content was captured for the hidden dropdown panels** beyond the fact that each has
   15 option slots with placeholder `label` text. The real Grade-level option set is unknown; only
   the values "Please select" and "3" are visible.
3. **The Teachers and "Manage student licenses" tab panels are not drawn.** Only the Students tab
   has content.
4. **No asset export.** See the Assets section — four images will be missing.
5. **Five of nine required icons are missing from the itslearning registry.** See the Icon section.
6. **`#01766d` has no counterpart in the itslearning theme.** Any pixel comparison will show a
   teal→green shift across the back link, three outline buttons, the primary button, the radio,
   "Switch school", "Cancel" and "Regenerate". This is a theme-substitution consequence, not an
   implementation defect.

---

# Stage 1.5 — Orchestrator corrections (authoritative over the section above)

The analyst composed its Token Reference against **`itslearning`**, inherited from the two sibling
runs rather than derived. The theme was derived afterwards and is **`my-digital-book`**. Where the
two disagree, this section wins.

## The theme, and the evidence

`node runs/harness/theme-match.mjs .implement-design/b-sesame-group-details/figma-variable-defs.json`

| Field               | Value                                                          |
| ------------------- | -------------------------------------------------------------- |
| `best`              | **`my-digital-book`**                                          |
| `method`            | `hex-value-fallback`                                           |
| `absoluteAgreement` | **0.714** (5 of 7 distinct hexes)                              |
| `marginOverSecond`  | **2.5** (runner-ups `kampus`/`magister`/`teas`/`tig` at 0.286) |
| `confident`         | **`false`** — stated, not adopted quietly                      |

`confident: false` is correct for the tool's own bar: hex-fallback requires `compared >= 8`
(we have 7), `score >= 0.8` (0.714) and `score >= 3x` the runner-up (2.5). All three fail.

But the bar is computed over the **deduplicated hex set including colours that discriminate
nothing**, and that is what dilutes it. Per-hex:

| Hex       | Themes declaring it            | Discriminates?                                                                                 |
| --------- | ------------------------------ | ---------------------------------------------------------------------------------------------- |
| `#bfbfbf` | **my-digital-book only**       | yes                                                                                            |
| `#323232` | **my-digital-book only**       | yes                                                                                            |
| `#9d9f9f` | **my-digital-book only**       | yes                                                                                            |
| `#5d5d5d` | my-digital-book, magister, tig | yes                                                                                            |
| `#ffffff` | 16 themes                      | no — universal                                                                                 |
| `#01766d` | none                           | no — the MySesame brand teal                                                                   |
| `#f5f5f6` | kampus, teas (not mdb)         | no — its own name is `Neutrals/$kampus-color-gray-1`, a Kampus token pasted into a Sesame file |

Restricted to the four hexes that carry signal: **my-digital-book 4/4 = 1.000**, magister 1/4,
tig 1/4, **itslearning 0/4**. Margin 4.0.

**Verdict: decisive.** Not by the tool's gate, which this run reports as failed, but by the
per-hex uniqueness the gate does not look at.

## What the two themes actually differ in

`diff` of the two `theme.css` files is **639 lines, all inside the brand layer**. The first 3,780
lines — every size, radius, line-height, font slot, elevation and icon token — are byte-identical.
So the theme choice changes **colour only**. Specifically it does **not** change:

- the typography longhand-only rule (both: zero bare `font:` shorthands),
- `--sl-elevation-shadow-sm`, malformed identically in both (two offsets, no blur) — a **core**
  defect, not an itslearning one, contrary to what A4 recorded,
- the icon registry: `icons.ts` is byte-identical in both themes, 54 icons.

## Colour, re-resolved against `my-digital-book`

Exact matches went from **2 of 13** under `itslearning` to **8 of 13**. Every "genuinely unbound,
Δ up to 48" grey in the section above is an exact token here.

| Raw                                                              | Under `my-digital-book`                      | Token to use                                                                                                                                                                                                |
| ---------------------------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `#323232` text/labels/values                                     | **EXACT**                                    | `--sl-color-background-neutral-interactive-bold` (semantic sibling of `--sl-color-palette-grey-800`)                                                                                                        |
| `#5d5d5d` secondary text, inactive tab, unchecked control border | **EXACT**                                    | `--sl-color-foreground-subtle`                                                                                                                                                                              |
| `#9d9f9f` every input border                                     | **EXACT**                                    | `--sl-color-foreground-accent-grey-faint`                                                                                                                                                                   |
| `#bfbfbf` accordion rule                                         | **EXACT**                                    | `--sl-color-border-disabled`                                                                                                                                                                                |
| `#f6f8f8` footer + accordion header                              | **EXACT**                                    | `--sl-elevation-surface-raised-sunken`                                                                                                                                                                      |
| `#ed1111` "Archive group"                                        | **EXACT**                                    | `--sl-color-palette-red-500`                                                                                                                                                                                |
| `#ffffff` surfaces                                               | **EXACT**                                    | `--sl-elevation-surface-raised-default` / `--sl-color-background-input-plain`                                                                                                                               |
| `#000000` page title, empty-state text                           | **EXACT**                                    | `--sl-color-black` (but see Inconsistency 20 — likely meant `#323232`)                                                                                                                                      |
| `#01766d` brand teal — links, buttons, radio                     | no — **Δ=24**                                | `--sl-color-foreground-accent-teal-bold` / `--sl-color-border-accent-teal-bold` (`#066769`). **Use the teal ACCENT role, not `primary`** — `my-digital-book`'s primary is navy `#002044`, a far worse match |
| `#2e5c64` active-tab underline                                   | no — **Δ=54, the largest unavoidable delta** | `--sl-color-palette-teal-800` (`#0a5757`)                                                                                                                                                                   |
| `#f2a900` number-tag fill                                        | no — Δ=18                                    | `--sl-color-background-accent-yellow-bold` (`#ffae00`)                                                                                                                                                      |
| `#cecfd2` detail-row dividers, tab rule                          | no — Δ=15                                    | `--sl-color-border-plain` (`#cacbcb`)                                                                                                                                                                       |
| `#f5f5f6` Linking-code card fill                                 | no — Δ=6                                     | `--sl-elevation-surface-raised-sunken` (`#f6f8f8`)                                                                                                                                                          |

**Summary: 8 of 13 colours have an exact token. Largest unavoidable delta Δ=54 on `#2e5c64`
(active-tab underline, one 2px rule). The widely-used brand teal `#01766d` is Δ=24.**

Tokens the analyst named that do **not** exist in `my-digital-book` either — do not emit:
`--sl-color-background-transparent`, `--sl-color-border-subtle`, `--sl-size-border`,
any `--sl-text-new-*-font` or `-line`. Verified absent by grep.

## Icons — correcting the orchestrator's own first count

`icons.ts` registers **54** icons (an earlier orchestrator count of 34 was wrong — the regex
required quoted keys and missed the 20 written as bare identifiers). The analyst's list is right.
The two themes register an identical set, so the theme switch changes nothing here.

**Five of the nine glyphs this design needs are absent: `pencil`, `archive`, `key`,
`school-flag`, `gear`.** Each is to be **omitted with its footprint preserved** — an empty
`aria-hidden` box of the icon's measured size — and recorded as a Stage 4 discrepancy.
**No hand-drawn SVG.** A4 shipped a `run-icons.ts` of 15 inline-SVG approximations; that is the
practice this rule exists to stop, and this run does not repeat it.

## The reference screenshot — normalised

`get_screenshot` returned **934 x 1280** for a frame metadata reports as **1280 x 2392**. This is
not A4's ~8px bleed. Measured on the PNG: the frame occupies **x = 0..684** (685px); **x = 685..933
(249px, 27% of the image)** is Figma canvas carrying the stray annotation arrow `2142:48496`.

`685 / 1280 = 0.535156` and `1280 / 2392 = 0.535117` — the same uniform downscale to **53.5%**.

So the raw reference is wrong by a factor of **1.869** on every dimension _and_ 27% too wide.
Normalised once, by cropping to (0,0,685,1280) and rescaling to 1280 x 2392:
**`reference-normalised.png`**, written by `testing/normalise-reference.mjs`.
**Stage 4 measures against the normalised file. The raw `screenshot.png` is kept unaltered.**

## Naming — collision avoidance

Two sibling runs from this same Figma file are already registered: A4 took the `sl-my-groups-*`
tag and event namespace, A11 took `sl-sesame-*`. Neither namespaced by case. **Every tag and every
event in this run is prefixed `sl-b-sesame-group-details-`.**

---

# Decomposition (Stage 2)

Framework `lit` · i18n **off** · theme `my-digital-book` · output
`examples/lit/src/_runs/b-sesame-group-details/` (example path — no `package.json`,
no `register.ts`, no website docs, no changeset).

**Executed by the orchestrator, not `component-decomposer`.** The decomposer subagent terminated
on an account-level weekly quota (`resets Oct 4 at 8pm`). Per the runbook, a blocked pool means
doing the work directly rather than waiting. Recorded in `progress.json`.

## Component tree — 6 components (1 root + 5 children)

```
sl-b-sesame-group-details-page                 ← ROOT, data owner, the only customElements.define
  ├── …-app-header          app-header/        shared chrome, top
  ├── …-summary             summary/           back link, title, 3 detail rows, archive, linking code
  ├── …-add-student-panel   add-student-panel/ dismissible search panel + no-results box
  ├── …-create-student-form create-student-form/ the second form + its action row
  ├── …-empty-state         empty-state/       "You don't have any students yet"
  └── …-app-footer          app-footer/        shared chrome, bottom
```

Every tag and event is prefixed **`sl-b-sesame-group-details-`**. A4 owns `sl-my-groups-*` and
A11 owns `sl-sesame-*` in the same Storybook; neither namespaced by case, so a third frame reusing
either would silently win or lose the guarded `customElements.define` race.

Children are scoped via `ScopedElementsMixin` and export their class only. The tab strip lives in
the root (`sl-tab-group` + `sl-tab` + `sl-tab-panel`), because the panel bodies are the root's
children and routing them through a wrapper would add a component that owns nothing.

| Component           | Files (under the run base path)                                     |
| ------------------- | ------------------------------------------------------------------- |
| root                | `group-details-page.ts` / `.css` / `.stories.ts`                    |
| app-header          | `app-header/group-details-app-header.ts` / `.css`                   |
| summary             | `summary/group-details-summary.ts` / `.css`                         |
| add-student-panel   | `add-student-panel/group-details-add-student-panel.ts` / `.css`     |
| create-student-form | `create-student-form/group-details-create-student-form.ts` / `.css` |
| empty-state         | `empty-state/group-details-empty-state.ts` / `.css`                 |
| shared contracts    | `types.ts` (run root)                                               |

**Deliberately NOT components**, and why:

- **Detail row (label / value / edit)** — repeats 3× (`2142:48100/48106/48112`) but carries no
  state and no behaviour beyond one event. A `.map()` inside `summary` over a 3-element array.
- **Search control row** `2142:48181` — four `sl-form-field`s in a flex row; splitting it would
  separate controls from the single `<sl-form>` that must own them.
- **No-results box** `2142:48309` — 3 static nodes inside the panel that owns the search.
- **Form action row** `2142:48459` — two buttons and a checkbox belonging to the form's own
  `FormController`.
- **Linking-code card** `2142:48126` — one `sl-card` with two text nodes, rendered by `summary`.
  Its 249×40 action slot is empty in the design (Inconsistency 12); nothing to render.
- **Tab strip** — SLDS `sl-tab-group` is the component; wrapping it adds nothing.
- **Footer / nav link items** — `<li><a>`.

## Shared Types / Contracts — a run-root `types.ts`, deliberately

A11 found that exporting shared models from the root creates an import cycle: the root imports its
children, so a child importing a type back from the root closes the loop. A4 instead exported each
model from the child that consumes it, which works but scatters the contract across five files and
makes the root import from five places to build one mock.

This run takes A11's shape — **one `types.ts` at the run root, importing nothing** — because it is
acyclic by construction rather than by luck, and because two of these models (`StudentDraft`,
`GradeLevel`) are consumed by two different children.

```ts
// types.ts — imports nothing, so it can never participate in a cycle
export type NavId = 'learning-materials' | 'groups' | 'users' | 'licenses';
export type TabId = 'students' | 'teachers' | 'licenses';
export type LoginType = 'easy' | 'regular';
export type GroupDetailFieldId = 'name' | 'schoolYear' | 'type';

export interface AppHeaderModel {
  brandName: string; // 'MittSanoma' — rendered as text, see OQ-6
  activeNavId: NavId;
  user: { name: string; initials: string; role: string };
  school: { id: string; name: string };
}

export interface GroupDetailField {
  id: GroupDetailFieldId;
  label: string; // per-record data, not a UI literal
  value: string;
}

export interface GroupSummaryModel {
  groupId: string;
  fields: GroupDetailField[];
  linkingCode: string; // 'AB3FRR'
  canArchive: boolean;
}

export interface StudentSearchValue {
  firstName: string;
  lastName: string;
  email: string;
  gradeLevel: string; // '' = unselected
}

export interface StudentSearchModel {
  value: StudentSearchValue;
  resultCount: number; // 0 here -> the no-results box renders
}

export interface StudentDraft {
  firstName: string;
  lastName: string;
  gradeLevel: string;
  loginType: LoginType;
  email: string;
  username: string;
}

export interface CreateStudentModel {
  draft: StudentDraft;
  createAnother: boolean;
}

export interface AppFooterModel {
  organisationName: string;
}
```

Events (all `CustomEvent`, aliases exported from the component that emits them and added to
`GlobalEventHandlersEventMap`):

| Event name                                      | Detail                                            | Emitter             |
| ----------------------------------------------- | ------------------------------------------------- | ------------------- |
| `sl-b-sesame-group-details-nav-select`          | `{ navId: NavId }`                                | app-header          |
| `sl-b-sesame-group-details-switch-school`       | `void`                                            | app-header          |
| `sl-b-sesame-group-details-profile-select`      | `void`                                            | app-header          |
| `sl-b-sesame-group-details-back`                | `void`                                            | summary             |
| `sl-b-sesame-group-details-edit-field`          | `{ fieldId: GroupDetailFieldId }`                 | summary             |
| `sl-b-sesame-group-details-archive-group`       | `{ groupId: string }`                             | summary             |
| `sl-b-sesame-group-details-search-students`     | `StudentSearchValue`                              | add-student-panel   |
| `sl-b-sesame-group-details-dismiss-panel`       | `void`                                            | add-student-panel   |
| `sl-b-sesame-group-details-create-student`      | `{ draft: StudentDraft; createAnother: boolean }` | create-student-form |
| `sl-b-sesame-group-details-cancel-create`       | `void`                                            | create-student-form |
| `sl-b-sesame-group-details-regenerate-username` | `void`                                            | create-student-form |
| `sl-b-sesame-group-details-add-first-student`   | `void`                                            | empty-state         |
| `sl-b-sesame-group-details-legal-select`        | `{ linkId: string }`                              | app-footer          |

Emitted with the `@event` decorator + `EventEmitter` from `@sl-design-system/shared` — never a
hand-rolled `new CustomEvent`.

## Per-component specs

### 1. `sl-b-sesame-group-details-page` (root) — `group-details-page.ts`

Figma `2142:48093`. Sole data owner; holds one mock object with a `// fetch would go here`
comment. No public `@property`s — the story renders `<sl-b-sesame-group-details-page>` with zero
args. Owns the 1280 shell, the 1024 content column at a 128px gutter, and the tab strip
`2142:48135`.

Renders `sl-tab-group` with three `sl-tab`s: **Students** + `sl-badge` "10" (active),
**Teachers** + `sl-badge` "1", **Manage student licenses**. The tab set is a structural constant
in the root, not a model field. Only the Students panel has content (manifest gap 3); the other
two `sl-tab-panel`s render an empty region rather than invented content.

Handles all thirteen events above; each `#on…` handler mutates the mock and re-requests an update.
**No handler constructs a new model object inside `render`** — A4 hit a root that re-rendered 301
times per click from exactly that shape. Model objects are built once in field initialisers and
mutated in place by the handlers.

A11y: neutral `<div class="page">` — **no `<main>`/`role="main"`** (conventions forbid it).
`<h1>` "Group details" lives in `summary`.

Tokens: gutter `var(--sl-size-1000)` + `var(--sl-size-600)` = 128px (80 + 48, exact); content
column `1024px` (no token — a layout constant, recorded); panel surface
`--sl-elevation-surface-raised-sunken` (`#f6f8f8`, and see OQ-1); tab rule
`--sl-size-borderWidth-subtle` in `--sl-color-border-plain`; active underline
`--sl-size-borderWidth-bold` in `--sl-color-palette-teal-800` (Δ=54, the run's largest
unavoidable colour delta); tab label `--sl-typography-text-md-*` + `--sl-fontWeight-bold` active /
`--sl-fontWeight-regular` inactive, `--sl-color-foreground-subtle` inactive.

### 2. `…-app-header` — `app-header/group-details-app-header.ts`

Figma `2142:48139` (nav bar `2142:48140` + school bar `2142:48157`), avatar `2142:48156`,
switch-school `2142:48168`. **The same source component as A4's `2847:15003`** — see the
three-frame comparison below.

Presentational. `@property({ attribute: false }) model?: AppHeaderModel`. Emits nav-select,
switch-school, profile-select. The nav item list is an internal constant; the model carries only
`activeNavId`.

A11y: neutral `<div>` host (**not `role="banner"`**); `<nav aria-label="Main"><ul><li>`, active
item `aria-current="page"`; the avatar trigger is a `<button>` with no `aria-haspopup` and no
hardcoded `aria-expanded` — A11's Stage 6 found exactly that pattern announcing a menu that never
renders, and this run does not repeat it.

Composes `sl-avatar` (`size="md"`, horizontal, subheader), `sl-button`, `sl-icon`, `sl-link`.
**Icons omitted (not registered): `school-flag` (school bar), `gear` (avatar badge).** Each is an
`aria-hidden` box at its measured size — `school-flag` 16×16, `gear` 16×16. `chevron-down` IS
registered and is used for the avatar chevron.

Content: "MittSanoma"; "Learning materials", "**Groups**" (active, underlined), "Users",
"Licenses"; "Anna Magiera" / "Teacher" / "EM" (the initials disagree with the name —
Inconsistency 3 — rendered verbatim, see OQ-4); "Bogaerts International School"; "Switch school".

### 3. `…-summary` — `summary/group-details-summary.ts`

Figma `2142:48094`. `@property({ attribute: false }) model?: GroupSummaryModel`. Emits back,
edit-field, archive-group.

Renders: `sl-link` "< Back to Groups"; `<h1>` "Group details" (28px — **no 28px font-size token
exists**, so an explicit `28px` with the arithmetic recorded, see OQ-2); three detail rows mapped
from `model.fields`, each `<dt>/<dd>` + an outline icon-only `sl-button size="sm"`; the "Archive
group" destructive action rebuilt as `sl-button fill="link" variant="danger"` (Inconsistency 4 —
the Figma node is a broken frame, not a button); and the Linking-code `sl-card`.

**Icons omitted: `pencil` (×3 edit buttons, 16×16), `archive` (archive action, 16×16),
`key` (linking-code heading, 16×16).** Footprint preserved, nothing drawn.

Tokens: row rule `--sl-size-borderWidth-subtle` `--sl-color-border-plain` (`#cacbcb` vs the
design's `#cecfd2`, Δ=15); label `--sl-typography-text-md-*` `--sl-color-foreground-subtle`
(**exact**); value `--sl-typography-text-lg-*` + `--sl-fontWeight-bold`,
`--sl-color-background-neutral-interactive-bold` (`#323232`, **exact**); archive label
`--sl-color-palette-red-500` (`#ed1111`, **exact**); card fill
`--sl-elevation-surface-raised-sunken` (`#f6f8f8` vs the design's `#f5f5f6`, Δ=6), radius 16px
(**no 16px radius token** — `--sl-size-borderRadius-xl` is 12px; recorded, see OQ-3), shadow
`--sl-elevation-shadow-sm` **NOT used** — it is malformed in every theme (two offsets, no blur)
and paints a hard slab; a `box-shadow` built from `--sl-color-shadow-overlay1` + size tokens
instead, with the arithmetic in a comment.

Content: "Group name"/"French 1D" (the layer is named `4B` — Inconsistency 1, the rendered text
wins), "School year"/"22/23", "Group type"/"Study group", "Archive group", "Linking code",
"AB3FRR".

### 4. `…-add-student-panel` — `add-student-panel/group-details-add-student-panel.ts`

Figma `2142:48171`. **Owns its form state**: one `<sl-form>` wrapping all four controls, driven by
`FormController<StudentSearchValue>`; `this.#form.value = this.model.value` in `updated()`, never
a per-field `.value` binding. `@property({ attribute: false }) model?: StudentSearchModel`.
Emits search-students, dismiss-panel.

Composes `sl-form`, `sl-form-field` ×4, `sl-text-field` ×3, `sl-select` + `sl-option`, `sl-button`,
`sl-icon`. The Figma layers say `sl-text_input` and `sl-label-theme`; the real elements are
`sl-text-field` and the label slot of `sl-form-field` (Inconsistency 17 — Figma's own description
says to use Form Field).

**Icons: `xmark` (close) and `magnifying-glass` → the registry has `xmark` ✓ and `search` ✓** —
`magnifying-glass` is the Font Awesome name, `search` is the registered alias. Verified present.
No omissions in this component.

Renders the no-results box when `model.resultCount === 0`, which it is.

Content: "ADD STUDENT TO GROUP"; "Search for a student"; "Start by searching school records to add
an existing student."; labels "First name", "Last name", "Email (optional)", "Grade level";
values — First name placeholder "Type here", Last name **"Woźniak"**, Email placeholder
"Type here", Grade level "Please select"; "No matching results"; "Can't find the student? Please,
add a new student by clicking Create new student below."

### 5. `…-create-student-form` — `create-student-form/group-details-create-student-form.ts`

Figma `2142:48316` + action row `2142:48459`. One `<sl-form>` + `FormController<StudentDraft>` in
this component (the conventions forbid a parent-level form around a child's controls).
`@property({ attribute: false }) model?: CreateStudentModel`. Emits create-student,
cancel-create, regenerate-username.

Composes `sl-form`, `sl-form-field`, `sl-text-field` ×4, `sl-select` + `sl-option`,
`sl-radio-group` + `sl-radio` ×2, `sl-accordion` + `sl-accordion-item`, `sl-checkbox`,
`sl-button` ×2. **"Regenerate" is re-parented** next to the Username field it belongs to
(Inconsistency 16 — Figma absolutely positions it at `left:336px; top:621px` as a sibling of the
whole form).

**Icons: `plus` (accordion toggle) is registered ✓.** No omissions. The accordion toggle is drawn
in Figma as two 1.979px bars rather than an icon; `sl-accordion-item` supplies its own.

Grade level renders at `--sl-typography-text-lg-*` (16/24) like every other control, **not** the
outlier 14/20 the design gives this one select (Inconsistency 11) — see OQ-5.

Content: "Can't find the student?"; "If you can't find the student in the search suggestions or
you add the student to school records for the first time, hit Create new student button.";
"First name"/"Karol"; "Last name"/"Woźniak"; "Grade level"/"3"; "Login type" — "Easy login
(simple username, password and QR code)" (**checked**) / "Regular"; "Login types explained";
"Email (optional)" placeholder "Type here" + "Regenerate"; "Username"/"karol123";
"Create new student"; "Cancel"; "Create another" (unchecked).

### 6. `…-empty-state` — `empty-state/group-details-empty-state.ts`

Figma `2142:48470`. No model — two literals and one event. Emits add-first-student.
The illustration `2142:48471` is a 100×71 **image asset with no export step** (manifest Assets
section): rendered as an `aria-hidden` box of exactly 100×71, recorded as a Stage 4 discrepancy.
Not substituted, not drawn.

The body copy is a single-item bulleted list in Figma (Inconsistency 8). Rendered as a plain
centred `<p>` — see OQ-7.

Content: "You don't have any students yet"; "Start by adding a student".

### 7. `…-app-footer` — `app-footer/group-details-app-footer.ts`

Figma `2142:48477`. `@property({ attribute: false }) model?: AppFooterModel`. Emits legal-select.
The link list is an internal constant. **No language selector** — unlike A4's footer, which has
one; same base component `2:69240`, different composition.

A11y: neutral `<div>` host (**not `<footer>`/`role="contentinfo"`**); `<nav aria-label="Legal">`.
The Sanoma logo `2142:48479` is an unexported asset → `aria-hidden` box at its measured size plus
the text "Sanoma", recorded.

Links are laid out with a normal flex row, **not** reproducing Figma's `x=-143` negative offset
inside a 520px parent (Inconsistency 14).

Content: "Privacy Policy", "Terms & conditions", "Cookies", "Support",
"About our digital services". Background `--sl-elevation-surface-raised-sunken` (`#f6f8f8`,
**exact**).

## Net-New Primitives — confirmed **zero**

Every element resolves to an existing `sl-*` or to plain layout markup. The four that look
net-new (Linking-code card, number-tag, accordion toggle, Button-sesame) are `sl-card`,
`sl-badge`, `sl-accordion-item` and `sl-button`. All 21 `sl-*` tags named in this decomposition
were verified present by `grep customElements.define` in `packages/components/`.

## Open questions and the defaults chosen — 17

| #   | Question                                                                                                                                                                                       | Default chosen                                                                                                                                                                                                                |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The content panel's own background was never fetched (manifest gap 1) — `2142:48170` was not called on its own                                                                                 | Use `--sl-elevation-surface-raised-sunken` (`#f6f8f8`), matching the footer and accordion fills that _were_ captured. Recorded as a visual read, not captured data                                                            |
| 2   | ~~The 28px page title has no font-size token~~ — **corrected during Stage 3**: `--sl-typography-heading-sm-fontSize` **is** 28px. The absent token is A4's `--sl-size-font-400`, which is 32px | Use `--sl-typography-heading-sm-*`. No literal needed. The 36px linking-code value genuinely has no token and IS a recorded literal                                                                                           |
| 3   | The Linking-code card's 16px radius has no token (`--sl-size-borderRadius-xl` is 12px)                                                                                                         | Use `--sl-size-borderRadius-xl` (12px, Δ=4px) rather than a raw 16px — the token is within one ramp step and a layout constant is worse than a 4px radius delta                                                               |
| 4   | The avatar renders "EM" for "Anna Magiera" (Inconsistency 3); A4's same avatar renders "AM"                                                                                                    | Render "EM" verbatim so the visual diff matches, with a comment flagging it for the designer. Do not silently derive initials                                                                                                 |
| 5   | Two "Grade level" selects disagree — 16/24 in one, 14/20 in the other (Inconsistency 11)                                                                                                       | Render both at 16/24, the page-wide value. Accept a measurable text-size delta on the create-form select and record it, rather than reproducing a one-off                                                                     |
| 6   | Four image assets (MittSanoma wordmark, Sanoma footer logo, empty-state illustration, avatar picture) have **no export step**                                                                  | Render an `aria-hidden` box at each measured size, plus a text wordmark where one is legible. Never link an expiring Figma URL. Four Stage 4 discrepancies                                                                    |
| 7   | The empty-state body is a one-item bulleted list (Inconsistency 8)                                                                                                                             | Render a plain centred `<p>`. The bullet is almost certainly unintended; a one-item list is not a list                                                                                                                        |
| 8   | Three states are drawn at once — search panel, create form, empty state — while the tab badge says 10 students (Inconsistency 7)                                                               | **The default story renders all three**, because Stage 4's ground truth is the frame as drawn. Stage 5 adds `--search-only`, `--create-only` and `--empty` variants that show the realistic exclusive states                  |
| 9   | Grid drift: the content block is at x=127/w=1025, the tab strip at x=130, the search row 991px in a 992px panel (Inconsistency 9)                                                              | Normalise to 128 / 1024 / 992 everywhere. Expect a 1–2px measured delta against the reference at those three places, and report it rather than padding to match                                                               |
| 10  | The three teals — `#01766d`, `#2e5c64`, the footer logo green (Inconsistency 5)                                                                                                                | Map `#01766d` → `--sl-color-foreground-accent-teal-bold` (Δ=24) and `#2e5c64` → `--sl-color-palette-teal-800` (Δ=54). Do **not** unify them: unifying would hide a real design defect behind an implementation choice         |
| 11  | Why the teal accent rather than the `primary` role                                                                                                                                             | `my-digital-book`'s primary is navy `#002044`. The teal accent ramp is the nearest honest role. Recorded because it means `sl-button variant="primary"` must be restyled, which is reaching past the component's intended API |
| 12  | The Grade-level option sets are hidden 15-option panels whose labels were never captured (manifest gap 2)                                                                                      | Emit the two visible values plus grades 1–9 as a structural constant, commented as invented. Not model data                                                                                                                   |
| 13  | Teachers and "Manage student licenses" tab panels are not drawn (manifest gap 3)                                                                                                               | Render empty `sl-tab-panel`s. Do not invent content for an undrawn tab                                                                                                                                                        |
| 14  | `sl-card` vs a plain `<div>` for the Linking-code callout — the design's radius, padding and shadow all differ from `sl-card`'s defaults                                                       | Use `sl-card` and override through its `::part()`s where they exist; fall back to a plain container and report the gap if they do not                                                                                         |
| 15  | The Linking-code card's empty 249×40 action slot (Inconsistency 12)                                                                                                                            | Render nothing. An empty frame is not a control, and inventing a "Copy code" button would put content in the diff that the reference does not have                                                                            |
| 16  | The tab strip is double-positioned inside an identical wrapper (Inconsistency 10)                                                                                                              | Render one element. The wrapper is redundant                                                                                                                                                                                  |
| 17  | `#323` on three section headings expands to `#332233`, a purple (Inconsistency 20)                                                                                                             | Treat as `#323232` and use the exact token. A serialisation artefact, not a design decision                                                                                                                                   |

## Three-frame comparison — A4, A11 and this frame

Three frames of **one** Figma file, at 1280 / 360 / 1280. Where they overlap by **source Figma
component**, this is what the pipeline produced.

| Source Figma component       | A4                                                                                 | A11                                                                                      | B (this run)                                                                                    |
| ---------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `avatar_SU` `777:12400`      | `AppHeaderModel.user {name, initials, role}`                                       | `SesameUser {displayName, pictureUrl?}`                                                  | `AppHeaderModel.user {name, initials, role}`                                                    |
| school switcher `915:4408`   | `school: {id, name}` nested; event `sl-my-groups-switch-school`, detail **`void`** | `schoolId` + `schoolName` **flat**; event `sl-sesame-school-switch`, detail **`string`** | `school: {id, name}` nested; event `sl-b-sesame-group-details-switch-school`, detail **`void`** |
| `menu item SU` `772:26895`   | `NavId` union + internal nav constant                                              | — (mobile frame has a hamburger instead)                                                 | `NavId` union + internal nav constant                                                           |
| `menu item footer` `2:69240` | `@property() language?: string` **scalar**; event detail `{language: string}`      | `model?: FooterModel`; event detail **bare `string`**                                    | `model?: AppFooterModel`; **no language selector in this frame**                                |
| shared-type location         | exported from each child                                                           | run-root `types.ts`                                                                      | run-root `types.ts`                                                                             |
| tag namespace                | `sl-my-groups-*` (frame)                                                           | `sl-sesame-*` (team)                                                                     | `sl-b-sesame-group-details-*` (case)                                                            |

**The answer: they agree on vocabulary and disagree on interface shape — the same split an earlier
pair in this batch hit.** All three identify the same SLDS components for the same source nodes
(`sl-avatar`, `sl-button`, `sl-form-field`, `sl-link`); none disagrees about _what_ a node is. But
no two of the three produced a compatible API for a component they both drew from the same Figma
master:

- the **school switcher** is nested-object-and-void in two runs and flat-fields-and-string in the
  third;
- the **footer language selector** is a scalar property with an object detail in A4 and a model
  property with a bare-string detail in A11 — _opposite_ on both axes at once;
- the **avatar** carries `initials` as data in A4 and B, and derives it from `displayName` in A11.

A4 and B agree more often than either agrees with A11, and the obvious reading — that 1280 vs 360
is the cause — is wrong: the disagreements are in the data contract, which the viewport does not
touch. The actual cause is that nothing carries a decision from one frame to the next. The
decomposer sees one manifest and has no idea the component already exists.

This is the `pipeline-defects.md` item "the pipeline has no notion that two runs can describe the
same component", now measured across **three** frames rather than two, and with a sharper
consequence than the A1/B-Kampus pair showed: those two **minted the same tag** from the same
source component, so the collision was at least detectable. Here all three namespaces differ,
so nothing collides and nothing is detectable — three incompatible `AppHeader`s coexist happily,
and the first goal of the whole effort (Figma and code mapping identically) fails silently.

---

# Stages 3–6 (orchestrator-executed)

The `component-decomposer` subagent terminated on an **account-level weekly quota**
(`resets Oct 4 at 8pm`). Per the runbook, a blocked pool means doing the work directly rather than
waiting, so Stages 2–6 were executed by the orchestrator. Recorded in `progress.json`.

## Stage 3 — the gate that cannot fail

`runs/harness/typecheck.mjs` returned `{"totalErrors": 0, "verdict": "clean"}` for a tree that had
**66 syntax errors in scope**, and simultaneously reported both recorded baseline errors as "no
longer present".

Cause: it parses tsc stdout with `/\(\d+,\d+\): error TS\d+/` — the **plain** format. `tsc` here
emits **pretty ANSI** output even when its stdout is a pipe:

```
examples/…/file-table.ts:196:22 - <ESC>[91merror<ESC>[90m TS1005: ',' expected.
```

The regex matches **zero lines for any input**, so the tool always returns `clean`. The ANSI
escapes also split the literal `error TS`, so even a naive grep misses it. Fix: `--pretty false`
— with which 97 errors surface, correctly attributable by run folder.

This run's own gate was therefore run by hand, twice: against the shared `examples/lit`
project (0 errors attributable to this run) and against a scope-isolated tsconfig (0 errors),
because a sibling run's syntax errors can suppress semantic checking for everyone. **No stub
files, no `.d.ts`, no `@fortawesome` import.**

`check-tokens.mjs`, by contrast, was negative-controlled in this run and **works**: injecting
`--sl-color-does-not-exist-xyz` and `font: var(--sl-text-new-body-md)` produced one `missing` and
one `shorthandTrap`; reverted and re-verified clean. Final: **16 files scanned, 203 references
seen, 0 missing, 0 shorthand traps.**

## Stage 4 — three iterations, every fix with a named cause

| #   | Discrepancy                                                      | Cause (measured, not guessed)                                                                                                                                                                     | Fix                                                                                                      |
| --- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 1   | The avatar's "Teacher" subheader never rendered                  | `sl-avatar` documents `@slot - The subheading`; it is the **default** slot. A `slot="subheader"` is silently dropped                                                                              | Move the role into the default slot                                                                      |
| 2   | …still hidden after that                                         | `avatar.css`: `:host(:where([size='sm'],[size='md'])) { slot:not([name]) { display: none } }`. Probed computed `display: none` with the text correctly assigned                                   | `size="lg"`. Costs `--sl-size-500 − --sl-size-400 = 40 − 32 = 8px` of circle. Content kept over geometry |
| 3   | The back link and five footer links painted solid blue blocks    | `sl-link` is a link-styled **button**; its `:host` paints `--sl-color-background-secondary-bold`, and only `variant="primary"` sets `--_bg-color: transparent` for ghost/outline                  | Plain `<a>` + tokens. The design system has no bare-text-link component                                  |
| 4   | The tab count badges were transparent with inherited text colour | Probed: `--_background` resolved to `#ffae00` correctly, but computed `background-color` was `rgba(0,0,0,0)` and colour was `--sl-color-foreground-plain` — `sl-badge`'s `:host` block was losing | Set background/colour from the parent, on elements this component put in its own template                |

**No fix introduced a raw length to close a measured gap.** The residual page height is
**2371 vs 2392 = −21px (0.88%)**, left unpadded and recorded: it accumulates across twelve stacked
sections from the fallback face, the five omitted icon boxes, and the Grade-level 16/24
normalisation (OQ-5). Fitting a constant to it would be exactly the behaviour
`pipeline-defects.md` predicts under iteration pressure.

### Recorded Stage 4 discrepancies — none of them repaired, all of them measured

- **5 icons the theme lacks** — `pencil` (×3), `archive`, `key`, `school-flag`, `gear`. Omitted
  with a 16×16 `aria-hidden` footprint. **No hand-drawn SVG.** A4 shipped a `run-icons.ts` with 15
  inline-SVG approximations; this run does not repeat that.
- **4 image assets** — the MittSanoma wordmark, the Sanoma footer logo, the 100×71 empty-state
  illustration, the avatar picture. There is no asset-export step. Text where legible, an exact
  footprint otherwise.
- **Colour** — 8 of 13 exact. `#01766d` brand teal Δ=24; `#2e5c64` active-tab underline **Δ=54,
  the largest unavoidable delta**; `#f2a900` badge Δ=18; `#cecfd2` dividers Δ=15; `#f5f5f6` card
  Δ=6.
- **Radius** — the linking-code card is 16px in the design; the ramp has no 16px step, so
  `--sl-size-borderRadius-xl` (12px, Δ=4) is used rather than a literal.
- **Typeface** — every text node renders in the browser fallback. See below.
- **Avatar circle** — +8px, forced by discrepancy 2.

### The font, located precisely

The theme's **core** tokens hardcode the literal `'Open Sans'`:

```
--sl-text-new-body-md-fontFamily: 'Open Sans';
```

while the **brand layer of the same file** declares the face that actually loads:

```
--sl-brand-text-new-body-md-fontFamily: 'open-sans';
```

`document.fonts` reports `open-sans|loaded`. The core token **does not reference the brand token**
— it hardcodes a name no loaded face carries, so the correctly-named face is defined and then
never used. Colours indirect through the brand layer correctly; families do not.

This is not "the theme names a font the provider spells differently". It is a broken indirection
inside one file, and it means **no text in any run under `itslearning` or `my-digital-book`
renders in the intended face**. It bounds text fidelity for A4 and A11 as much as for this run.

## Stage 5 — stories

Example path, so story enrichment only: no spec, no website docs, no changeset, no i18n
extraction. Four stories, all `rendered`: `--basic` (h=2371), `--search-only` (1177),
`--create-only` (1709), `--empty-only` (1059). The three single-state variants are backed by a
real reflected property on the root and were **verified to change the rendered composition** —
they are not stub stories that merely set an attribute nothing reads.

## Stage 6 — the interaction pass

Stage 4 measures appearance and only appearance, so this run interacted with the result.

- **All 13 events fire** from real clicks, with correct detail payloads — `search-students`
  carries the live form value (`lastName: "Woźniak"`), `create-student` the live draft. The
  `FormController` wiring is real, not decorative.
- **9 interactions triggered 3 renders.** A4's root re-rendered **301 times per click** from
  building a model object inside `render`; every model here is built once in a field initialiser
  and mutated in place, and the measurement confirms it.
- **First tab stop is the first nav link** — focus order enters the page at the top.
- **0 page errors, 0 console errors, 0 failed requests.**

**One bug found, and only the interaction pass could have found it:** `create-student` emitted
`createAnother: null` on an event typed `boolean`. An unchecked `sl-checkbox` reports `null`, and
the destructuring default `{ createAnother = false }` fires only on `undefined`. Fixed with
`?? false` and re-verified. No still-image comparison, DOM diff, type check or token check would
ever have seen it.
