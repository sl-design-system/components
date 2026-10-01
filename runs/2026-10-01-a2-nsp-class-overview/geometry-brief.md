# Measured geometry — A2 class overview

Two independent sources, and they agree: **absolute positions from `get_metadata`** (Figma's own
layout numbers) and **colour-transition scans of `screenshot.png`** (what actually rendered).
Where they differ, the screenshot wins — it is the ground truth the Stage 4 diff is against.

Frame: **1280 × 1003**, origin at the frame's top-left.

## Vertical bands (scan at x = 640)

| Band                  | y range    | Height | Fill      | Token                                                                       |
| --------------------- | ---------- | -----: | --------- | --------------------------------------------------------------------------- |
| Global nav            | 0 – 55     |     56 | `#ffffff` | `--sl-elevation-surface-raised-default`                                     |
| Secondary (class) nav | 56 – 103   |     48 | `#f9fafb` | **unbound** — nearest `--sl-elevation-surface-raised-sunken` `#f6f8fa` (Δ3) |
| Page background       | 104 – 1002 |      — | `#f0f2f5` | `--sl-color-palette-grey-100`                                               |
| Class-code card       | 124 – 215  |     91 | `#ffffff` | `--sl-elevation-surface-raised-default`                                     |
| Students panel        | 235 – 962  |    728 | `#ffffff` | `--sl-elevation-surface-raised-default`                                     |

## Horizontal (scan at y = 170 and y = 600)

| Element          | x range   | Width |
| ---------------- | --------- | ----: |
| Page gutter      | 0 – 47    |    48 |
| Class-code card  | 48 – 397  |   350 |
| Students panel   | 48 – 1231 |  1184 |
| Grid             | 64 – 1215 |  1152 |
| Grid column 1..4 | 288 each  |   288 |

Column dividers land at **x = 352, 640, 928** (measured), confirming 4 × 288 starting at x = 64.
Dividers are **24 px tall short rules centred in the row**, not full-height — Figma's
`Vertical divider short` has `line "short" y=8 height=24` inside a 40 px row. Colour `#d0d9e0`
(`--sl-color-border-plain`). Horizontal row dividers measure `#e7ecef`.

## Grid internal rhythm (total 536 px, y 407 – 942)

| Row            | y range   | Height | Fill                                              |
| -------------- | --------- | -----: | ------------------------------------------------- |
| Header         | 407 – 454 |     48 | `#f6f8fa` `--sl-elevation-surface-raised-sunken`  |
| Filter         | 455 – 502 |     48 | `#ffffff`                                         |
| Data rows × 10 | 503 – 902 | 40 ea. | `#ffffff` (no zebra — variant says `Zebra=false`) |
| Footer         | 903 – 942 |     40 | `#ffffff`                                         |

Figma's grid instance lists **23 row children**: Header, Filter, `Row 01`…`Row 10`, a second node
named `Row 06` positioned last (**this is the footer row** — the layer name is stale), and ten more
`Row 11`…`Row 20` all `hidden="true"`. Only 11 are visible, and the last of them is the footer.

## Navigation (absolute, from `get_metadata` on `2422:87040`)

**Global bar**, y 0 – 56:

| Element           |    x |   y |    w × h | Content                      |
| ----------------- | ---: | --: | -------: | ---------------------------- |
| Logo              |    8 |  12 |  32 × 32 | blue tile, white "S"         |
| Link-nav          |   52 |   0 |  62 × 56 | Home                         |
| Link-nav          |  126 |   0 |  80 × 56 | Calendar                     |
| Link-nav          |  218 |   0 | 137 × 56 | Method catalogue             |
| Link-nav          |  367 |   0 | 143 × 56 | Teaching materials           |
| `sl-search-field` |  962 |  10 | 222 × 36 | placeholder "Search"         |
| profile cluster   | 1196 |  10 |  68 × 36 | `sl-avatar` + `chevron-down` |

A hidden `sl-button-pill` (36 × 36) sits under the profile cluster — `hidden="true"`, not rendered.

**Secondary bar**, y 56 – 104 (h 48):

| Element    |   x |   y |    w × h | Content                               |
| ---------- | --: | --: | -------: | ------------------------------------- |
| class name |  64 |  68 |  76 × 24 | **"5A English"**                      |
| Link-nav   | 152 |  56 |  81 × 48 | Overview                              |
| Link-nav   | 245 |  56 |  72 × 48 | Method                                |
| Link-nav   | 329 |  56 |  77 × 48 | Lessons                               |
| Link-nav   | 418 |  56 | 100 × 48 | **Participants** (active, underlined) |

> **Layer name ≠ content.** The class-name node is _named_ `Class Name` in `get_metadata`; its actual
> text, `5A English`, only appears in `get_design_context`. Any run that reads metadata alone would
> render the layer name as if it were copy. This is the same class of defect as A8's `sl-avatar`
> receiving the Figma caption _"7 students already joined"_ as its `display-name`.

## Class-code card (`2422:87221`, 350 × 91 at 48,124)

Padding `12px` inline / `16px` block; `justify-content: space-between`; radius 8.

- Text column (w 79), `gap: 15px`:
  - **"Class code"** — body/lg: 16px / 24px / weight 400, colour `#000000` (Figma binds
    `color/black`, not a foreground token — recorded as-is)
  - **"D9981"** — body/md: 14px / 20px / weight 500, colour `#59636e`
    (`--sl-color-foreground-subtlest`)
- Action cluster, `gap: 12px`: two 36 × 36 `<sl-button fill="ghost">`.
  Both Code Connect snippets carry the literal `aria-label="Button"` — replaced with real names.
  Their icons (`far-copy`, `far-share`) are **not in the theme** and are omitted.

## Students panel (`2422:87047`, 1184 × 728 at 48,235)

- **"Students"** heading at x 64, y 255, 56 × 20 — body/md bold (14px / 20px / weight 500)
- `sl-button-bar` #1 at x 64, y 295, 138 × 36 — solid primary "Add students"
  (leading icon `far-presentation-screen` **absent from theme**, omitted)
- `sl-button-bar` #2 at x 64, y 351, 121 × 36 — outline "Create groups"
- Grid at x 64, y 407, 1152 × 536

## Blueprint content — verbatim

The design carries **no domain data**. Reproduce these literals exactly:

- 4 column headers: `Text`, `Text`, `Text`, `Text`
- 4 filter inputs: `Placeholder` ×4
- 40 data cells (10 rows × 4 columns): `Text`
- footer row: `Footer`, with a trailing up-arrow (**`arrow-up` is not in the theme** — omitted)
