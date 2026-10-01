# Verified token reference — theme `itslearning`

Built by resolving **every** `--sl-*` declaration in `packages/themes/itslearning/theme.css`,
`typography.css` and `global.css` through its full `var()` chain (light mode = the first
definition wins; the dark block re-points the same names at `--sl-brand-dark-*`, which this theme
does not ship). Looked up **by resolved value**, not by name prefix — the lesson from two earlier
runs that manufactured phantom gaps by sweeping one namespace.

## Colour — all 16 hexes the design binds

14 of 16 have an exact token. The 2 that do not are the bronze pair on the course avatar.

| Figma variable         | hex       | exact token (role-correct choice)                                             | note                                                                                                                                                                                 |
| ---------------------- | --------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `$text` / `$gray--900` | `#333333` | `--sl-color-foreground-bold`                                                  | body + heading text                                                                                                                                                                  |
| `$gray--700`           | `#565656` | `--sl-color-foreground-subtle`                                                |                                                                                                                                                                                      |
| `$gray--600`           | `#757575` | `--sl-color-border-input` (borders) / `--sl-color-foreground-subtlest` (text) | 2px input borders                                                                                                                                                                    |
| `$gray--300`           | `#e1e1e1` | `--sl-color-border-plain`                                                     | card / row hairlines                                                                                                                                                                 |
| `$gray--200`           | `#ececec` | `--sl-color-background-inverted-interactive-plain`                            |                                                                                                                                                                                      |
| `$gray--150`           | `#f2f2f2` | `--sl-color-background-neutral-bold`                                          | page background                                                                                                                                                                      |
| `$gray--50`            | `#f9f9f9` | `--sl-elevation-surface-raised-sunken`                                        | table header + course bar fill                                                                                                                                                       |
| `$gray--0`             | `#ffffff` | `--sl-elevation-surface-raised-default`                                       | every white card/bar surface                                                                                                                                                         |
| `$accent--600`         | `#008859` | `--sl-color-background-primary-bold`                                          | "Add" button                                                                                                                                                                         |
| `$blue--700`           | `#00458f` | `--sl-color-link-idle`                                                        | every link                                                                                                                                                                           |
| `$gray--500`           | `#9b9b9b` | `--sl-color-palette-grey-500`                                                 | **primitive only** — no semantic role resolves to it                                                                                                                                 |
| `$brand--800`          | `#42354a` | `--sl-color-foreground-brand`                                                 | **role mismatch** — used as a _background_ (Actions button, Edit label); no `--sl-color-background-*` resolves to `#42354a`, only `foreground-*` and `--sl-color-palette-purple-800` |
| `$brand--700`          | `#5d4a68` | `--sl-color-palette-purple-700`                                               | **primitive only** — active pagination pill                                                                                                                                          |
| `$brand--400`          | `#a997b5` | `--sl-color-border-secondary-bold`                                            | secondary button border                                                                                                                                                              |
| `$bronze--100`         | `#feebbb` | **none**                                                                      | nearest `--sl-color-background-highlight` `#ffedcd`, ΔRGB 18.1 (B −18)                                                                                                               |
| `$bronze--200`         | `#ae7c3f` | **none**                                                                      | nearest `--sl-color-background-accent-yellow-interactive-bold` `#b67d1b`, **ΔRGB 36.9 (B −36) — the largest unavoidable delta in this run**                                          |

Raw hexes in the design that are **not** Figma variables, so not in `figma-variable-defs.json`:
`#d9e3e8` (`$pigeongrey--100`, file-type glyph disc — no token, 0 exact matches) and `#3f2f9b`
(the A11y annotation badge, which is not UI and must not be rendered).

## Typography — longhands ONLY

`itslearning` ships **zero** bare `--sl-text-new-<role>` shorthands. `font: var(--sl-text-new-body-md)`
resolves to nothing and the browser **drops the whole declaration**. Always write the longhands.
`heading-*` has `-fontFamily`, `-fontSize`, `-lineHeight` but **no `-fontWeight`** — add
`font-weight: var(--sl-text-new-typeset-fontWeight-semiBold)` (600) or a literal `700` where the
design says Bold. `body-*` does carry `-fontWeight` (400).

| Figma style               | px / weight | token prefix                                  | resolves to | delta                  |
| ------------------------- | ----------- | --------------------------------------------- | ----------- | ---------------------- |
| Title XL (page title)     | 26 Bold     | `--sl-text-new-heading-lg-*`                  | 24 / 32     | **−2px, no 26px rung** |
| Title L (panel heading)   | 22 Bold     | `--sl-text-new-heading-lg-*`                  | 24 / 32     | **+2px, no 22px rung** |
| Title M (course name)     | 18 Bold     | `--sl-text-new-body-lg-*` + `font-weight:700` | 16 / 24     | **−2px, no 18px rung** |
| Base / Base strong        | 16          | `--sl-text-new-body-lg-*`                     | 16 / 24     | exact                  |
| Base small / small strong | 14          | `--sl-text-new-body-md-*`                     | 14 / 20     | exact                  |

Figma's family is **Lato** (`default-font`); every theme token is `'Open Sans'`, which no loaded
Typekit serves. Use the token and record the fallback face as a Stage 4 discrepancy.

## Size / spacing — `Size/N` → `--sl-size-*`

`Size/10`→`025` (2) · `Size/25`→`050` (4) · `Size/50`→`100` (8) · `Size/100`→`150` (12) ·
`Size/200`→`175` (14) · `Size/300`→`200` (16) · `Size/500`→`250` (20) · `Size/700`→`300` (24) ·
`Size/900`→`400` (32) · `Size/1000`→`500` (40) · `ca-horisontal-margin` 48→`600` ·
`content-block` padding 32/20→`400`/`250` · `actions-gap` 12→`150` ·
`dropdown-vertical-padding` 4→`050` · `border-radius` 4→`--sl-size-borderRadius-md`.

No rung for the font sizes 18 / 22 / 26 (`Size/400`, `/600`, `/800`) — route those via typography,
never via `--sl-size-*`.

**Border widths.** `--sl-size-borderWidth-default` is **2px** in this theme.

- Card / Content-block / settings-summary / table-row hairlines are Figma `border` = **1px** →
  `--sl-size-borderWidth-subtle`.
- Search field, Select, Checkbox and the secondary buttons are Figma `border-2` = **2px** →
  `--sl-size-borderWidth-default`.
