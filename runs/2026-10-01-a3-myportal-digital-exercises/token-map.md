# Token map — a3-myportal-digital-exercises · theme **`bingel-int`**

Every value below was resolved by running the theme's own `var()` chains to a literal, not read off a
name. Where a row says "exact", the design's value and the token's resolved value are the same
string. Implementers use this file in preference to the manifest's Token Reference, which was built
against **bingel-dc** and contradicts itself in three rows (see `IMPL-BRIEF.md`).

## Three traps that apply to THIS theme

1. **`--sl-text-new-*` shorthands do not exist here. Zero of them are declared** — only the
   longhands (`-fontSize`, `-lineHeight`, `-fontWeight`, `-fontFamily`). So
   `font: var(--sl-text-new-body-md)` names an undefined property, the browser **drops the whole
   declaration**, and nothing is logged. **Always write the longhands.**
2. **Token names are not values.** `--sl-size-500` is **40px**, not 5 or 50. The ladder is
   `--sl-size-N00 = N x 8px`.
3. **No webfont is loaded.** `bingel-int/typography.css` contains no `@font-face` and the theme
   names `'Open Sans'`. Text renders in a fallback face. Record it; do not chase it. (Related
   defect: the brand layer declares `--sl-brand-text-new-*-fontFamily: 'proxima-nova'` but nothing
   consumes it — the core block hardcodes `'Open Sans'`. The brand font token is dead.)

The `[data-user-group]` gate was checked: bingel-int declares typography inside
`[data-user-group='early'|'developing'|'advanced']` blocks, but **0 tokens are declared only there**
— every one also has a plain `body` declaration. The gate does not bite this theme.

## Colour — 20 of the design's 22 distinct colours have an exact token

| Design value | Where it is used                            | Token (exact unless noted)                                                                                                                               |
| ------------ | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `#0060B9`    | app bar ground, selected sidebar pill       | `--sl-color-palette-blue-500`                                                                                                                            |
| `#0074DF`    | primary interactive / focus border          | `--sl-color-background-interactive-plain`                                                                                                                |
| `#002649`    | body + link foreground                      | `--sl-color-palette-blue-800`                                                                                                                            |
| `#002F62`    | default-button foreground                   | `--sl-color-foreground-primary-bold`                                                                                                                     |
| `#001223`    | primary 900 (pressed)                       | `--sl-color-background-interactive-bold`                                                                                                                 |
| `#FFFFFF`    | surfaces, on-bold foreground                | `--sl-elevation-surface-base-default` / `--sl-color-foreground-primary-onBold`                                                                           |
| `#F2F3F5`    | sidebar ground                              | `--sl-color-background-neutral-bold`                                                                                                                     |
| `#E3E6EA`    | default-button border, plain count badge bg | `--sl-color-background-secondary-bold`                                                                                                                   |
| `#D5D9DE`    | plain borders                               | `--sl-color-border-plain`                                                                                                                                |
| `#C7CDD3`    | card border, input interactive              | `--sl-color-background-input-interactive`                                                                                                                |
| `#B8C0C8`    | disabled foreground                         | `--sl-color-foreground-disabled`                                                                                                                         |
| `#8D959D`    | breadcrumb divider, input border            | `--sl-color-border-input`                                                                                                                                |
| `#71777D`    | placeholder text                            | `--sl-color-foreground-subtlest`                                                                                                                         |
| `#54585D`    | count-badge text, subtle text               | `--sl-color-foreground-subtle`                                                                                                                           |
| `#373A3E`    | plain foreground                            | `--sl-color-foreground-plain`                                                                                                                            |
| `#1B1C1E`    | bold foreground                             | `--sl-color-foreground-accent-grey-bold`                                                                                                                 |
| `#ACD2F5`    | selected count badge bg                     | `--sl-color-palette-blue-100`                                                                                                                            |
| `#004D94`    | selected count badge text                   | `--sl-color-palette-blue-600`                                                                                                                            |
| `#FF9D00`    | warning / caution                           | `--sl-color-background-caution-bold`                                                                                                                     |
| `#235500`    | positive foreground                         | `--sl-color-foreground-positive-bold`                                                                                                                    |
| `#E0EAFF`    | **MAX badge ground**                        | **no exact token.** Nearest `--sl-color-palette-blue-050` `#E6F1FB`, RGB delta **10.0**                                                                  |
| `#2351DB`    | **MAX badge text**                          | **no exact token.** Nearest `--sl-color-background-accent-blue-bold` `#0074DF`, RGB delta **49.7** — the largest unavoidable colour delta in this design |

Shadows: `--sl-color-shadow-overlay1` = `#1b1c1e0a` and `-overlay2` = `#1b1c1e1f` in this theme,
while the design binds `#2222220a` / `#2222221f` (the unbranded core values). Use the theme's and
record the delta — it is an alpha-blend of a near-black, invisible in practice.
`--sl-elevation-shadow-overlay` exists as a composite and matches the design's two-layer structure.

## Typography — longhands only

| Design                                              | fontSize token                                  | lineHeight token                                                                           | weight                |
| --------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------- |
| 24 / 34 Bold ("Reken Maar! 4", "Digital Exercises") | `--sl-text-new-heading-lg-fontSize` (24, exact) | `--sl-text-new-heading-lg-lineHeight` = **32**, design wants 34 — **2px delta, record it** | `--sl-fontWeight-700` |
| 16 / 24 Bold, ls 1                                  | `--sl-text-new-body-lg-fontSize` (16)           | `--sl-text-new-body-lg-lineHeight` (24)                                                    | `--sl-fontWeight-700` |
| 14 / 20 Regular (body)                              | `--sl-text-new-body-md-fontSize` (14)           | `--sl-text-new-body-md-lineHeight` (20)                                                    | `--sl-fontWeight-400` |
| 14 / 20 SemiBold                                    | same two                                        | same                                                                                       | `--sl-fontWeight-600` |
| 12 / 16 Regular (meta, captions)                    | `--sl-text-new-body-sm-fontSize` (12)           | `--sl-text-new-body-sm-lineHeight` (16)                                                    | `--sl-fontWeight-400` |
| 14 / 16 SemiBold (links, avatar name)               | `--sl-text-new-body-md-fontSize` (14)           | `--sl-text-new-body-sm-lineHeight` (16)                                                    | `--sl-fontWeight-600` |
| 14 / 24 Regular (button label, input text)          | `--sl-text-new-input-md-fontSize` (14)          | `--sl-text-new-input-md-lineHeight` (24)                                                   | `--sl-fontWeight-400` |
| 16 / 24 Regular (large input)                       | `--sl-text-new-body-lg-fontSize` (16)           | `--sl-text-new-body-lg-lineHeight` (24)                                                    | `--sl-fontWeight-400` |
| 10px (smallest caption)                             | `--sl-typography-caption-md-fontSize` (10)      | `--sl-typography-caption-md-lineHeight` (14)                                               | `--sl-fontWeight-400` |

Family: `--sl-text-new-typeset-fontFamily-body` resolves to `'Open Sans'` — a bare family, safe to
use as `font-family`. **Never as part of a `font:` shorthand.**

## Spacing / size ladder (resolved)

`--sl-size-010` 1 · `-025` 2 · `-050` 4 · `-075` 6 · `-100` 8 · `-125` 10 · `-150` 12 · `-175` 14 ·
`-200` 16 · `-250` 20 · `-300` 24 · `-350` 28 · `-400` 32 · `-450` 36 · `-500` **40** · `-600` 48 ·
`-700` 56 · `-800` 64 · `-1000` 80. `--sl-space-NNN` mirrors every one of these except `-350`/`-450`.

New scale: `--sl-space-new-none` 0 · `-2xs` 2 · `-xs` 4 · `-sm` 6 · `-md` 8 · `-lg` 16 · `-xl` 24 ·
`-2xl` 32 · `-3xl` 64. **All four values the manifest flagged `(unbound — needs a token)` exist**
(`space-new/none`, `/sm`, `/xs`, `/md`) — hint 3 again.

Icon sizes: `--sl-size-new-icon-2xs` 10 · `-xs` 12 · `-sm` 14 · `-md` 16 · `-lg` 20 · `-xl` 24 ·
`-2xl` 32 · `-3xl` 48 · `-4xl` 64.

Radius: `--sl-size-borderRadius-none` 0 · `-sm` 2 · `-md` 4 · `-default` **4** · `-lg` 8 · `-xl` 12 ·
`-full` 50rem · `-child` `calc(4px / 2)` = 2.
Border width: `--sl-size-borderWidth-none` 0 · `-subtle` 1 · `-default` 1 · `-action` **1** ·
`-bold` 2 · `-focusRing` 2 · `-heavy` 4.

## Layout dimensions are not spacing steps

The design binds **no** size variables for layout. Rule: a padding/gap/radius that equals a ladder
value uses the token; a **layout dimension** with no matching step (the 240px sidebar, the 390px
left column, the 1200px content width, the 156x208 cover, the 56px app bar) is written as a **raw
px with an inline comment saying it is a layout dimension**. Do not invent a token name and do not
use a `var()` fallback.

## Icons the theme registers — all 34, and nothing else

angle-down · arrow-left · arrow-right · arrow-up-right-from-square · badge-available · badge-away ·
badge-donotdisturb · badge-offline · breadcrumb-separator · caret-down-solid · caret-left-solid ·
caret-right-solid · check-solid · chevron-down · chevron-left · chevron-right · circle-check-solid ·
circle-exclamation-solid · circle-solid · circle-xmark · circle-xmark-solid · dash-solid ·
diamond-exclamation-solid · ellipsis-down · ellipsis-vertical · face-smile · grip-lines ·
home-blank · octagon-exclamation-solid · octagon-xmark-solid · sort-down · sort-up ·
square-arrow-up-right · triangle-exclamation-solid

**Never `import … from '@fortawesome/*'`** — the package is absent from `node_modules`, Vite cannot
resolve it, the module throws at load and the page renders **nothing**. This is a render blocker,
not a cosmetic one. An icon the design needs and this list lacks is **omitted with its footprint
preserved** (an empty box of the right size) and recorded as a Stage 4 discrepancy. **Never
hand-drawn** — invented artwork inside a pixel-compared region makes the score partly a measurement
of the drawing.
