# Theme facts — run b-itsl-bookmk-deleted-course

**Derived theme: `itslearning`.** Evidence in `progress.json.themeDerived`.
`runs/harness/theme-match.mjs` could NOT score this design (`colorTokensInDesign: 0`) because the
frame uses the **itslearning legacy Figma library** (`$gray--900`, `Size/300`, `Body large`), not the
SLDS semantic variable paths the tool keys on. Fallback: literal hex agreement — itslearning 16/17
(0.941); every other theme 1/17 (0.059, only `#ffffff`). `default-font: "Lato"` occurs in exactly one
theme.css in the repo: itslearning.

## HARD RULES for generated CSS in this run

1. **NEVER `import ... from '@fortawesome/*'`. NEVER call `Icon.register(...)`.**
   `node_modules/@fortawesome` does not exist — Vite cannot resolve it, the module throws, and the
   whole story renders blank. This overrides the `implement-design-lit` skill and
   `component-conventions.md` "Icons" section, both of which are WRONG for this checkout.
   Use `<sl-icon name="...">` **bare** with a name from the list below; the theme's `setup()` has
   already registered the set. An icon not on the list is **omitted** and reported as a Stage 4
   discrepancy. Never hand-draw a replacement SVG — invented artwork corrupts a pixel comparison.

   itslearning registers these 54 names:
   angle-down arrow-left arrow-right arrow-up-right-from-square badge-available badge-away
   badge-donotdisturb badge-offline breadcrumb-separator calendar caret-down-solid caret-left-solid
   caret-right-solid check check-solid chevron-down chevron-left chevron-right circle-check-solid
   circle-exclamation-solid circle-solid circle-xmark circle-xmark-solid clock dash-solid
   diamond-exclamation-solid ellipsis ellipsis-down ellipsis-vertical envelope error eye face-smile
   fav grip-lines hand home-blank info menu minus mobile octagon-exclamation-solid octagon-xmark-solid
   pinata plus search smile sort sort-down sort-up square-arrow-up-right star
   triangle-exclamation-solid xmark

2. **NEVER write `font: var(--sl-text-new-*)`.** In itslearning there is **no** bare
   `--sl-text-new-heading-lg` (etc.) — only longhands. `font: var(--undefined)` makes the browser
   drop the WHOLE declaration: wrong family, size and line-height at once, with no error anywhere.
   `component-conventions.md` and the lit skill both state the shorthand exists. They are WRONG here.
   Write longhands:

   ```css
   font-family: var(--sl-text-new-heading-lg-fontFamily);
   font-size: var(--sl-text-new-heading-lg-fontSize);
   line-height: var(--sl-text-new-heading-lg-lineHeight);
   font-weight: var(
     --sl-text-new-typeset-fontWeight-semiBold
   ); /* headings have NO -fontWeight longhand */
   ```

   `body-*` DO have a `-fontWeight` longhand; `heading-*` and `input-*` do NOT.

3. **Token names are not token values.** Figma `Size/500` = 20, but `--sl-size-500` = **40px**.
   Always match the resolved value, never the number in the name.

4. **Border widths**: `--sl-size-borderWidth-default` = **2px** in itslearning
   (it aliases `-bold` = `--sl-size-025`). A 1px hairline needs `--sl-size-borderWidth-subtle`.

5. **The story must plain-import its component module** for the `customElements.define` side effect:
   `import './thing.js';`. `import { type Thing }` is erased and the element never registers.

6. Do not run `yarn install`, `yarn extract-i18n`, `yarn start`, or any writing `git` command.
   i18n is **off** — render text directly, no `msg()`.

## Resolved scales (itslearning)

| token                                                                 | value                                                         |
| --------------------------------------------------------------------- | ------------------------------------------------------------- |
| `--sl-size-010 / 025 / 050 / 075 / 100 / 150 / 200 / 300 / 400 / 500` | 1 / 2 / 4 / 6 / 8 / 12 / 16 / 24 / 32 / 40 px                 |
| `--sl-space-new-2xs / xs / sm / md / lg / xl / 2xl / 3xl`             | 2 / 4 / 6 / 8 / 16 / 24 / 32 / 64 px                          |
| `--sl-size-borderRadius-sm / md / lg / xl / full`                     | 2 / 4 / 8 / 12 / 50rem                                        |
| `--sl-text-new-body-sm / md / lg` fontSize                            | 12 / 14 / 16 px (lineHeight 16 / 20 / 24, fontWeight 400)     |
| `--sl-text-new-heading-sm / md / lg / xl / 2xl` fontSize              | 14 / 16 / 24 / 32 / 48 px (lineHeight 20 / 20 / 32 / 40 / 48) |
| `--sl-text-new-input-md / lg` fontSize                                | 14 / 14 px (lineHeight 24 / 32)                               |

**Font family gap:** the design's `default-font` is **Lato**; the itslearning theme ships
**'Open Sans'** for every `--sl-text-new-*-fontFamily`. Use the theme token anyway (never hardcode
Lato) and record the family difference as a Stage 4 discrepancy.

**Font size gaps:** design uses 18px (`Title M`) and 26px (`Title XL`); itslearning has no 18px and no
26px step. Nearest: 18 -> `heading-md` (16px), 26 -> `heading-lg` (24px). Record as discrepancies.

## Design colour -> itslearning token (all verified by resolving the theme's light-mode chain)

| Figma var                       | hex       | use this semantic token                                                  |
| ------------------------------- | --------- | ------------------------------------------------------------------------ |
| `$text` / `$gray--900`          | `#333333` | `--sl-color-foreground-bold`                                             |
| `$gray--700`                    | `#565656` | `--sl-color-foreground-subtle`                                           |
| `$gray--600`                    | `#757575` | `--sl-color-foreground-subtlest` (border use: `--sl-color-border-input`) |
| `$gray--500`                    | `#9b9b9b` | only `--sl-color-palette-grey-500` (no semantic alias)                   |
| `$outline` / `$gray--300`       | `#e1e1e1` | `--sl-color-border-plain`                                                |
| `$gray--200`                    | `#ececec` | only `--sl-color-palette-grey-200`                                       |
| `$gray--150`                    | `#f2f2f2` | `--sl-color-background-disabled`                                         |
| `$gray--100`                    | `#f4f4f4` | only `--sl-color-palette-grey-100`                                       |
| `$gray--50`                     | `#f9f9f9` | only `--sl-color-palette-grey-050`                                       |
| `$gray--0` / `$card-background` | `#ffffff` | `--sl-color-background-input-plain` (or `--sl-color-white`)              |
| `$brand--800`                   | `#42354a` | `--sl-color-foreground-brand`                                            |
| `$brand--700`                   | `#5d4a68` | only `--sl-color-palette-purple-700`                                     |
| `$brand--400`                   | `#a997b5` | `--sl-color-border-secondary-bold`                                       |
| `$blue--600`                    | `#0055b0` | `--sl-color-background-info-bold` / `--sl-color-border-focused`          |
| `$blue--700`                    | `#00458f` | `--sl-color-link-idle` (link hover: `--sl-color-link-hover` `#0f3b73`)   |
| `$blue--100`                    | `#ecf8ff` | only `--sl-color-palette-blue-050`                                       |
| `$green--600`                   | `#0b8356` | **GENUINELY UNBOUND — no itslearning token resolves to it.** Report it.  |

`--sl-color-foreground-plain` is `#4a4a4a`, which is NOT a colour the design uses; the design's body
text is `#333333` = `--sl-color-foreground-bold`. Do not reach for `-plain` by reflex.

## Code Connect

`get_code_connect_map` returned `{}` for the subtree AND for every significant node individually.
Root cause (analyst-verified): the frame is assembled from the **itslearning Figma library**, not the
SLDS Figma library, so there is nothing to map. This is NOT the known scoping artifact. Build from
`figma-design-context.md` + the screenshot; there are no snippets to follow.

## Hidden nodes

`figma-metadata.json` marks many nodes `hidden="true"` (an alternate `Card`, `BannerArea`,
`top panel` with search+Select, a second `Button`, the row checkbox `Cell`s, the first
`Bulk actions panel`, the trailing `cards`/`descriptioncard` block). **Do not render hidden nodes.**

## Corrections to the manifest's Token Reference (verified against theme.css)

- `--sl-color-elevation-surface-raised-default` **does not exist** in itslearning (no
  `--sl-color-elevation-*` or `--sl-color-surface-*` names exist at all). For the white card use
  `--sl-color-background-input-plain` (or `--sl-color-palette-grey-000`).
- These manifest suggestions were checked and DO exist: `--sl-size-175/250/350/600`,
  `--sl-size-borderRadius-md`, `--sl-size-new-icon-xl`, `--sl-color-palette-grey-000`,
  `--sl-color-palette-green-600`, `--sl-color-background-info-subtlest`,
  `--sl-color-border-accent-grey-bold`, `--sl-elevation-shadow-overlay`.
- Available elevation shadows are only: `--sl-elevation-shadow-sm`, `--sl-elevation-shadow-overlay`,
  `--sl-elevation-shadow-overflow`.
