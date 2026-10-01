# editorial-suite theme facts (verified by grep, 2026-10-01)

## Typography — LONGHAND ONLY

`packages/themes/editorial-suite/theme.css` defines NO bare `--sl-text-new-*` token.
Only longhands exist. **Never use the `font:` shorthand with a bare token** — an undefined
var makes the browser drop the whole declaration silently.

Available families:

- `--sl-text-new-body-{sm,md,lg}-{fontFamily,fontSize,fontWeight,lineHeight}` (body HAS fontWeight)
- `--sl-text-new-heading-{sm,md,lg,xl,2xl}-{fontFamily,fontSize,lineHeight}` (heading has NO fontWeight)
- `--sl-text-new-input-{md,lg}-{fontFamily,fontSize,lineHeight}`
- `--sl-text-new-typeset-fontFamily-{body,heading,icon}`
- `--sl-text-new-typeset-fontWeight-{regular,semiBold}`

For headings, take font-weight from `--sl-text-new-typeset-fontWeight-semiBold`.

Correct pattern:

```css
.title {
  font-family: var(--sl-text-new-heading-md-fontFamily);
  font-size: var(--sl-text-new-heading-md-fontSize);
  line-height: var(--sl-text-new-heading-md-lineHeight);
  font-weight: var(--sl-text-new-typeset-fontWeight-semiBold);
}
```

Older token set also present: `--sl-text-{sm,md,lg}-{fontSize,lineHeight,letterSpacing}`,
`--sl-text-fontFamily`, `--sl-heading-*`, `--sl-display-*`.

## Icons registered by the theme (icons.ts) — THE ONLY ICONS ALLOWED

angle-down, arrow-left, arrow-right, arrow-up-right-from-square, badge-available, badge-away,
badge-donotdisturb, badge-offline, breadcrumb-separator, calendar, caret-down-solid,
caret-left-solid, caret-right-solid, check, check-solid, chevron-down, chevron-left,
chevron-right, circle-check-solid, circle-exclamation-solid, circle-solid, circle-xmark,
circle-xmark-solid, clock, dash-solid, diamond-exclamation-solid, ellipsis, ellipsis-down,
ellipsis-vertical, envelope, error, eye, face-smile, fav, grip-lines, hand, home-blank, info,
menu, minus, mobile, octagon-exclamation-solid, octagon-xmark-solid, pinata, plus, search,
smile, sort, sort-down, sort-up, square-arrow-up-right, star, triangle-exclamation-solid, xmark

NEVER import `@fortawesome/*` — not installed, no credential. NEVER hand-draw a replacement SVG.
An icon the design needs and this list lacks is LEFT OUT and recorded as a Stage 4 discrepancy.

## Icon registration — nothing to do

`.storybook/themes.ts` calls `@sl-design-system/editorial-suite`'s `setup()` when
`globals=theme:editorial-suite`, and that `setup()` runs `Icon.register(icons)`.
So the theme's icons are ALREADY in the global `Icon` registry at render time.
Do **not** write `Icon.register(...)`, and do **not** import `@fortawesome/*`.
Just render `<sl-icon name="<one of the names above>">`.
(This overrides `component-conventions.md` §Icons, which assumes Font Awesome Pro.)

## Override of the Lit skill's typography line

`implement-design-lit/SKILL.md` says a `--sl-text-new-*` token is a `font:` shorthand.
In editorial-suite that is FALSE — no bare token exists. Use the four longhands.

## Colour substitutions — VERIFIED, use the token, record the delta

I re-grepped all of `packages/themes/` for each hex the analyst flagged unbound.
All four are genuinely absent (hint 3 did NOT flip them this time):
`#006666`, `#02242E`, `#CA6F2A`, `#003D3D` → zero hits anywhere in `packages/themes/`.
`#0d8e4c` and `#d3f8de` exist only in `sanoma-learning`, not editorial-suite.

**Do NOT hardcode the Figma hex.** `component-conventions.md` requires design tokens only.
Use the nearest editorial-suite semantic token below; the hex delta is recorded as an
expected Stage 4 discrepancy, not a bug to fix.

| Figma value                  | Where used                               | Use this token                                                          | Token resolves to  |
| ---------------------------- | ---------------------------------------- | ----------------------------------------------------------------------- | ------------------ |
| `#006666`                    | primary solid button bg/border           | `--sl-color-background-primary-bold`                                    | teal-600 `#137271` |
| `#006666`                    | primary link / outline fg+border         | `--sl-color-foreground-primary-bold` / `--sl-color-border-primary-bold` | teal-700 `#145b5b` |
| `#003D3D`                    | primary link :active fg                  | `--sl-color-palette-teal-800`                                           | `#154c4c`          |
| `#02242E`                    | app top bar bg, H1, tab labels           | `--sl-color-palette-teal-900`                                           | `#062b2d`          |
| `#CA6F2A`                    | all 25 Content-items progress indicators | `--sl-color-palette-orange-600`                                         | `#c64c08`          |
| `#0d8e4c`                    | "2409 Used" numeral                      | `--sl-color-foreground-accent-green-bold`                               | ETSL green-800     |
| `#d3f8de`                    | Used stat-tile fill                      | `--sl-color-background-accent-green-subtle`                             | `#149c4b33`        |
| `#ffffff`                    | white surfaces                           | `--sl-color-palette-grey-000`                                           | exact              |
| two-layer widget drop shadow | widget cards                             | `--sl-elevation-shadow-overlay`                                         | nearest available  |

## Fonts

The design is Raleway (headings) + Roboto (body). `--sl-text-new-typeset-fontFamily-{body,heading}`
both resolve to `'Open Sans'` in this theme's PUBLIC namespace — wrong family.
Use the legacy families, which are correct: `--sl-heading-fontFamily` (Raleway),
`--sl-display-fontFamily` (Raleway), `--sl-text-fontFamily` (Roboto).

## ORCHESTRATOR DECISION on the unbound colours (supersedes the table above)

The table above documents what a _theme fix_ would look like. For this run we do NOT
substitute a different hue, because swapping ETSL teal-600 `#137271` in for the design's
`#006666` would shift colour across the whole page and confound the fidelity measurement
with a theme-mapping choice.

**Do this instead.** The ROOT component (`etsl-dashboard-page.css`) declares a run-local
palette once on `:host`. Custom properties inherit through shadow boundaries, so all seven
children consume them without redeclaring:

```css
:host {
  /* unbound in editorial-suite — each needs a real theme token; see manifest Token Reference */
  --etsl-color-brand: #006666; /* primary button/link idle */
  --etsl-color-brand-active: #003d3d; /* primary link active */
  --etsl-color-chrome: #02242e; /* app top bar, H1, tab labels */
  --etsl-color-bar-indicator: #ca6f2a; /* the 26 content-item indicators */
  --etsl-color-metric-used: #0d8e4c; /* "2409 Used" numeral */
  --etsl-color-metric-used-surface: #d3f8de; /* Used stat-tile fill */
  --etsl-color-row-divider: rgb(0 0 0 / 12%); /* table row rule */
  --etsl-shadow-widget: 0 8px 16px #3232470f, 0 2px 4px #32324714;
}
```

Every OTHER colour must be a real `--sl-*` token — see the manifest Token Reference.
No other hardcoded hex anywhere.

**Fonts are NOT in this escape hatch** — use the legacy tokens, which are correct:
`--sl-heading-fontFamily` / `--sl-display-fontFamily` (Raleway), `--sl-text-fontFamily` (Roboto).
Do NOT use `--sl-text-new-typeset-fontFamily-{body,heading}` — both resolve to `'Open Sans'`.
