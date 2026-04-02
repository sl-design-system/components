---
name: design-tokens
description: Use correct SL Design System design tokens (CSS custom properties) in component SCSS. Covers token naming, categories, families, and best practices for color, size, opacity, elevation, and typography tokens.
---

# Design tokens guide for: $ARGUMENTS

You are selecting and applying design tokens for the SL Design System, a Lit 3 web component library. Tokens are CSS custom properties prefixed with `--sl-` defined by theme CSS files. Components never hard-code colors, sizes, or other visual values — they reference tokens.

## Token architecture

Tokens are authored in Tokens Studio and built via Style Dictionary into theme CSS files at `packages/themes/<theme>/`. Each theme produces:

- `css/base.css` — mode-independent tokens (sizes, border widths, radii, typography, icons)
- `css/light.css` / `css/dark.css` — mode-specific tokens (colors, opacities, elevations)
- `light.css` / `dark.css` — combined (base + mode) for convenience

Components import compiled SCSS (`<name>.scss.ts`) and must only use `var(--sl-*)` references — never raw values.

## Token naming convention

```
--sl-{category}[-{subcategory}]*[-{variant}]
```

## Token categories

### Size tokens — `--sl-size-*`

The most heavily used category. Raw spacing on a numeric scale:

| Token            | Value | Usage (files) |
| ---------------- | ----- | ------------- |
| `--sl-size-010`  | 1px   | 4             |
| `--sl-size-025`  | 2px   | 25            |
| `--sl-size-050`  | 4px   | 39            |
| `--sl-size-075`  | 6px   | 21            |
| `--sl-size-100`  | 8px   | 53            |
| `--sl-size-125`  | 10px  | 7             |
| `--sl-size-150`  | 12px  | 27            |
| `--sl-size-175`  | 14px  | 14            |
| `--sl-size-200`  | 16px  | 21            |
| `--sl-size-250`  | 20px  | 8             |
| `--sl-size-300`  | 24px  | 26            |
| `--sl-size-400`  | 32px  | 10            |
| `--sl-size-450`  | 36px  | 5             |
| `--sl-size-500`  | 40px  | 5             |
| `--sl-size-600`  | 48px  | 10            |
| `--sl-size-800`  | 64px  | 5             |
| `--sl-size-1000` | 80px  | 3             |

Use these for padding, gap, dimensions, and any spatial values. Subtract border widths where needed:

```scss
padding: calc(var(--sl-size-100) - var(--sl-size-borderWidth-action))
  calc(var(--sl-size-200) - var(--sl-size-borderWidth-action));
```

### Border width tokens — `--sl-size-borderWidth-*`

| Token                             | Typical value | Usage                           |
| --------------------------------- | ------------- | ------------------------------- |
| `--sl-size-borderWidth-default`   | 1px           | 31 files — standard borders     |
| `--sl-size-borderWidth-focusRing` | 2px           | 24 files — focus outline width  |
| `--sl-size-borderWidth-subtle`    | 1px           | 9 files — lighter borders       |
| `--sl-size-borderWidth-action`    | 1px or 2px    | 6 files — button/action borders |
| `--sl-size-borderWidth-bold`      | 2px           | 2 files — heavier borders       |
| `--sl-size-borderWidth-none`      | 0px           | 2 files                         |

### Border radius tokens — `--sl-size-borderRadius-*`

| Token                            | Usage                         |
| -------------------------------- | ----------------------------- |
| `--sl-size-borderRadius-default` | 35 files — standard rounding  |
| `--sl-size-borderRadius-full`    | 7 files — pill/circle (50rem) |
| `--sl-size-borderRadius-child`   | 3 files — inner elements      |
| `--sl-size-borderRadius-none`    | 2 files                       |

### Outline tokens

| Token                             | Usage    |
| --------------------------------- | -------- |
| `--sl-size-outlineOffset-default` | 23 files |
| `--sl-size-outlineWidth-default`  | 2 files  |

### Icon size tokens — `--sl-size-new-icon-*`

T-shirt sizing: `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`.

```scss
::slotted(sl-icon) {
  --sl-icon-size: var(--sl-size-new-icon-xs);
}
```

### Color tokens — `--sl-color-*`

The largest category (144 unique tokens). Organized by role:

#### Background colors — `--sl-color-background-*`

**Semantic backgrounds** (per intent: info, caution, neutral, primary, negative, positive, selected, secondary):

```
--sl-color-background-{intent}-bold              # Solid fill
--sl-color-background-{intent}-subtle             # Light fill
--sl-color-background-{intent}-subtlest           # Lightest fill
--sl-color-background-{intent}-interactive-bold   # Hover mix color for solid fills
--sl-color-background-{intent}-interactive-plain  # Hover mix color for ghost/transparent fills
```

**Accent backgrounds** (per hue: blue, green, grey, orange, purple, red, teal, yellow):

```
--sl-color-background-accent-{hue}-bold
--sl-color-background-accent-{hue}-subtle
--sl-color-background-accent-{hue}-subtlest
--sl-color-background-accent-{hue}-interactive-bold
--sl-color-background-accent-{hue}-interactive-plain
```

**Special backgrounds:**

| Token                                     | Usage    | Purpose               |
| ----------------------------------------- | -------- | --------------------- |
| `--sl-color-background-disabled`          | 14 files | Disabled elements     |
| `--sl-color-background-input-plain`       | 8 files  | Form input base color |
| `--sl-color-background-input-interactive` | 10 files | Form input hover mix  |
| `--sl-color-background-bold`              | general  | Bold surface          |
| `--sl-color-background-subtle`            | general  | Subtle surface        |
| `--sl-color-background-highlight`         | general  | Highlighted text/area |

**Inverted backgrounds** (for inverted contexts):

```
--sl-color-background-inverted-bold/subtle/subtlest/interactive-bold/interactive-plain
```

#### Foreground colors — `--sl-color-foreground-*`

**General foreground:**

| Token                            | Usage    | Purpose               |
| -------------------------------- | -------- | --------------------- |
| `--sl-color-foreground-plain`    | 31 files | Default text color    |
| `--sl-color-foreground-disabled` | 22 files | Disabled text         |
| `--sl-color-foreground-subtlest` | 11 files | Placeholder/hint text |
| `--sl-color-foreground-bold`     | 6 files  | Emphasized text       |
| `--sl-color-foreground-subtle`   | general  | De-emphasized text    |
| `--sl-color-foreground-brand`    | general  | Brand color text      |

**Semantic foreground** (per intent):

```
--sl-color-foreground-{intent}-bold      # Text color (ghost/outline fills)
--sl-color-foreground-{intent}-plain     # Standard text
--sl-color-foreground-{intent}-onBold    # Text on solid fill background
```

**Accent foreground** (per hue):

```
--sl-color-foreground-accent-{hue}-bold
--sl-color-foreground-accent-{hue}-plain
--sl-color-foreground-accent-{hue}-onBold
```

Grey additionally has: `faint`, `subtle`, `subtlest`, `onInverted`.

#### Border colors — `--sl-color-border-*`

| Token                              | Usage    | Purpose           |
| ---------------------------------- | -------- | ----------------- |
| `--sl-color-border-focused`        | 25 files | Focus ring color  |
| `--sl-color-border-plain`          | 20 files | Default border    |
| `--sl-color-border-disabled`       | 15 files | Disabled border   |
| `--sl-color-border-input`          | 9 files  | Form input border |
| `--sl-color-border-positive-plain` | 7 files  | Valid state       |
| `--sl-color-border-negative-plain` | 7 files  | Invalid state     |
| `--sl-color-border-selected`       | 6 files  | Selected state    |
| `--sl-color-border-bold`           | 5 files  | Emphasized border |
| `--sl-color-border-inverted`       | general  | Inverted context  |

#### Link and other colors

```
--sl-color-link-idle / --sl-color-link-hover / --sl-color-link-active
--sl-color-link-muted-idle / hover / active
--sl-color-blanket-plain              # Overlay backdrop
--sl-color-skeleton-plain / subtle    # Skeleton loading
--sl-color-black / --sl-color-white / --sl-color-transparent
```

### Opacity tokens — `--sl-opacity-*`

**Interactive opacity sets** (always used as idle/hover/active triplets):

| Set                                                     | Usage    | Purpose                             |
| ------------------------------------------------------- | -------- | ----------------------------------- |
| `--sl-opacity-interactive-plain-{idle,hover,active}`    | 22 files | Ghost/transparent fill interactions |
| `--sl-opacity-interactive-bold-{idle,hover,active}`     | 9 files  | Solid fill interactions             |
| `--sl-opacity-interactive-reversed-{idle,hover,active}` | 3 files  | Inverted context interactions       |

**Standalone opacity:**

| Token                   | Usage  |
| ----------------------- | ------ |
| `--sl-opacity-disabled` | 1 file |
| `--sl-opacity-subtle`   | 1 file |
| `--sl-opacity-subtlest` | 1 file |

### Elevation tokens — `--sl-elevation-*`

**Surfaces:**

| Token                                       | Usage    | Purpose                     |
| ------------------------------------------- | -------- | --------------------------- |
| `--sl-elevation-surface-raised-default`     | 15 files | Dropdown/overlay background |
| `--sl-elevation-surface-base-default`       | 3 files  | Base page surface           |
| `--sl-elevation-surface-raised-sunken`      | 2 files  | Inset/recessed areas        |
| `--sl-elevation-surface-raised-inverted`    | 1 file   | Tooltip background          |
| `--sl-elevation-surface-raised-primary`     | 1 file   | Toolbar                     |
| `--sl-elevation-surface-raised-alternative` | 1 file   | Grid header                 |

**Shadows:**

| Token                            | Usage   | Purpose                    |
| -------------------------------- | ------- | -------------------------- |
| `--sl-elevation-shadow-overlay`  | 7 files | Popover/dropdown shadow    |
| `--sl-elevation-shadow-overflow` | 4 files | Scroll container shadow    |
| `--sl-elevation-shadow-sm`       | 1 file  | Small shadow (switch knob) |

### Typography tokens — `--sl-text-*`

| Token                                       | Usage    | Purpose                      |
| ------------------------------------------- | -------- | ---------------------------- |
| `--sl-text-new-typeset-fontWeight-semiBold` | 18 files | Semi-bold text               |
| `--sl-text-new-typeset-fontWeight-regular`  | 2 files  | Regular weight               |
| `--sl-text-new-typeset-fontFamily-body`     | general  | Body font family             |
| `--sl-text-new-typeset-fontFamily-heading`  | 1 file   | Heading font family          |
| `--sl-text-new-body-{sm,md,lg}`             | general  | Body typography shorthand    |
| `--sl-text-new-heading-{sm,md,lg,xl,2xl}`   | general  | Heading typography shorthand |
| `--sl-text-new-input-{md,lg}`               | general  | Input typography shorthand   |

### Animation tokens — `--sl-animation-*`

| Token                            | Usage   |
| -------------------------------- | ------- |
| `--sl-animation-button-duration` | 2 files |
| `--sl-animation-button-easing`   | 2 files |

## Token families (tokens that go together)

### Family 1: Interactive background (the `color-mix` pattern)

The most important pattern. Always use as a complete set of three private vars:

```scss
:host {
  --_bg-color: var(--sl-color-background-{semantic}-{bold|plain});
  --_bg-mix-color: var(--sl-color-background-{semantic}-interactive-{bold|plain});
  --_bg-opacity: var(--sl-opacity-interactive-{bold|plain}-idle);

  background: color-mix(in srgb, var(--_bg-color), var(--_bg-mix-color) calc(100% * var(--_bg-opacity)));
}

:host(:hover) {
  --_bg-opacity: var(--sl-opacity-interactive-{bold|plain}-hover);
}

:host(:active) {
  --_bg-opacity: var(--sl-opacity-interactive-{bold|plain}-active);
}
```

**Bold** variant (solid fills — button, checkbox checked, radio checked, switch checked):

- Base: `--sl-color-background-*-bold`
- Mix: `--sl-color-background-*-interactive-bold`
- Opacity: `--sl-opacity-interactive-bold-{idle,hover,active}`

**Plain** variant (ghost/transparent — text-field, tab, menu-item, card, grid row):

- Base: `--sl-color-background-input-plain` or `transparent`
- Mix: `--sl-color-background-*-interactive-plain` or `--sl-color-background-input-interactive`
- Opacity: `--sl-opacity-interactive-plain-{idle,hover,active}`

### Family 2: Focus ring

Near-universal (24 files). Always define all three:

```scss
:host {
  outline: transparent solid var(--sl-size-borderWidth-focusRing);
  outline-offset: var(--sl-size-outlineOffset-default);
}

:host(:focus-visible) {
  outline-color: var(--sl-color-border-focused);
}
```

### Family 3: Disabled state

```scss
:host([disabled]) {
  pointer-events: none;
}
:host(:is([disabled], [aria-disabled='true'])) {
  color: var(--sl-color-foreground-disabled); // text
  background: var(--sl-color-background-disabled); // fill (solid variants)
  border-color: var(--sl-color-border-disabled); // border
  cursor: default;
}
```

### Family 4: Semantic variant (per intent)

Complete set for a single variant (e.g., primary):

```scss
// Solid fill
:host([variant='primary']) {
  --_bg-color: var(--sl-color-background-primary-bold);
  --_bg-mix-color: var(--sl-color-background-primary-interactive-bold);
  border-color: var(--sl-color-border-primary-bold);
  color: var(--sl-color-foreground-primary-onBold);
}

// Ghost fill
:host([variant='primary'][fill='ghost']) {
  --_bg-color: transparent;
  --_bg-mix-color: var(--sl-color-background-primary-interactive-plain);
  color: var(--sl-color-foreground-primary-bold);
}
```

Available intents: `primary`, `secondary`, `positive`, `negative`, `caution`, `info`, `neutral`, `selected`, `inverted`.

### Family 5: Input field

```scss
:host {
  --_bg-color: var(--sl-color-background-input-plain);
  --_bg-mix-color: var(--sl-color-background-input-interactive);
  --_bg-opacity: var(--sl-opacity-interactive-plain-idle);
  border-color: var(--sl-color-border-input);
}

// Invalid
:host([show-validity='invalid']) {
  --_bg-mix-color: var(--sl-color-background-negative-interactive-plain);
  border-color: var(--sl-color-border-negative-plain);
}

// Valid
:host([show-validity='valid']) {
  --_bg-mix-color: var(--sl-color-background-positive-interactive-plain);
  border-color: var(--sl-color-border-positive-plain);
}
```

### Family 6: Accent color (per hue)

For color-coded components (badge, avatar, progress-bar):

```scss
:host([color='blue']) {
  --_background: var(--sl-color-background-accent-blue-subtle);
  --_color: var(--sl-color-foreground-accent-blue-bold);
}

:host([color='blue'][emphasis='bold']) {
  --_background: var(--sl-color-background-accent-blue-bold);
  --_color: var(--sl-color-foreground-accent-blue-onBold);
}
```

Available hues: `blue`, `green`, `grey`, `orange`, `purple`, `red`, `teal`, `yellow`.

### Family 7: Elevated surface (overlays/dropdowns)

```scss
:host {
  background: var(--sl-elevation-surface-raised-default);
  box-shadow: var(--sl-elevation-shadow-overlay);
}
```

## Component-specific public tokens

Components may expose `--sl-<component>-*` tokens for consumer customization. Always provide a fallback:

```scss
:host {
  max-inline-size: var(--sl-tooltip-max-width, auto);
}
```

Examples from the codebase:

- `--sl-spinner-size` (default: `var(--sl-size-200)`)
- `--sl-icon-size` (default: `var(--sl-size-200)`)
- `--sl-tooltip-max-width` (default: `auto`)
- `--sl-popover-max-inline-size` (default: `80vw`)
- `--sl-drawer-max-inline-size` (default: `500px`)
- `--sl-combobox-listbox-maxBlockSize` (default: `20rem`)
- `--sl-text-area-rows` (default: `3`)
- `--sl-card-media-size` (default: `auto`)

## Best practices

1. **Never hard-code colors** — always use `--sl-color-*` tokens
2. **Never hard-code sizes** — use `--sl-size-*` tokens for spacing, dimensions, gaps
3. **Use private vars (`--_`) for variant switching** — define once, reassign in `:host([variant])` selectors
4. **Always use the complete `color-mix` triplet** for interactive backgrounds (base + mix + opacity)
5. **Always use the focus ring trio** (`borderWidth-focusRing` + `outlineOffset-default` + `border-focused`)
6. **Always use the disabled trio** (`foreground-disabled` + `background-disabled` + `border-disabled`)
7. **Match background emphasis to opacity variant** — `bold` background → `bold` opacity, `plain` background → `plain` opacity
8. **Pair foreground with background correctly** — `onBold` foreground on `bold` backgrounds, `bold` foreground on ghost/transparent fills
9. **Provide fallbacks for public component tokens** — `var(--sl-<component>-*, <default>)`
10. **Use `calc()` to subtract border widths from padding** — keeps visual size consistent across border width changes
11. **Prefer semantic tokens over palette tokens** — use `--sl-color-background-primary-bold` not `--sl-color-palette-blue-500`
12. **Use `transparent` as a keyword** — not `var(--sl-color-transparent)` when setting a private var to no color

## Things to AVOID

- Do NOT use hex colors, `rgb()`, or `hsl()` — use token references
- Do NOT use raw pixel values for spacing — use `--sl-size-*` tokens
- Do NOT mix bold/plain opacity sets with the wrong background variant
- Do NOT reference `--sl-color-palette-*` directly in components — use semantic tokens
- Do NOT create new token names — only use tokens defined in the theme CSS files
- Do NOT duplicate the `color-mix` formula — define private vars and reassign them
- Do NOT use `--sl-opacity-new-*` primitive tokens — use the semantic `--sl-opacity-interactive-*` tokens
