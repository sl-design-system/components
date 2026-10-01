# Theme for run A10 (`FAM - Users`) — **`editorial-suite`**, derived, not assumed

```
node runs/harness/theme-match.mjs .implement-design/a10-etsl-fam-users/figma-variable-defs.json
```

| field                 | value             |
| --------------------- | ----------------- |
| `best`                | `editorial-suite` |
| `method`              | `token-name`      |
| `colorTokensInDesign` | 24                |
| matched               | **6 / 6**         |
| `absoluteAgreement`   | `1`               |
| `marginOverSecond`    | `6`               |
| `confident`           | `true`            |

Runner-up: a 14-way tie at 1/6 (`bingel-dc`, `bingel-int`, `clickedu`, `itslearning`, …).

## The hypothesis under test is FALSIFIED

A5 (`17214:103584`) and A10 (`17264:29098`) are two frames of **one Figma file**
(`S5QgDy8X9eqhvECPANSZMM`). They were expected to resolve to the same theme. They do not.

Twelve colour tokens appear in both frames' `figma-variable-defs.json`. **Ten are byte-identical.
Two differ — and those two are exactly the ones that decide the verdict:**

| token                           | A5 frame  | A10 frame | `editorial-suite` | `sanoma-learning` |
| ------------------------------- | --------- | --------- | ----------------- | ----------------- |
| `color/background/primary/bold` | `#3366ff` | `#137271` | **`#137271`**     | **`#3366ff`**     |
| `color/palette/grey/900`        | `#222222` | `#1d1f20` | **`#1d1f20`**     | **`#222222`**     |

Each frame's pair is an _exact_ hit on a different theme. A10's other four comparable tokens
confirm it: `foreground/bold` `#1d1f20`, `foreground/primary/bold` `#145b5b`,
`palette/grey/100` `#ececf1`, `foreground/primary/onBold` `#ffffff` — all editorial-suite's
resolved values, none of them sanoma-learning's.

**The per-file theme hypothesis does not hold for ETSL.** Theme is a property of the _frame's bound
variable mode_, not of the file and not of the team. The batch already knew a per-_team_ mapping
was wrong (two NSP designs resolve to `max` and `sanoma-learning`); this adds that a per-_file_
mapping is wrong too. The only safe rule is per-frame derivation — which is what the harness does.

**Consequence for A5:** its derived `sanoma-learning` stands for _its_ frame, and its colour
measurements under `editorial-suite` remain against the wrong theme. A10 does not rescue them; it
removes the "same file, so same theme" argument that would have let one run's derivation be
reused for the other. Each frame must be derived on its own.

**Second, independent line of evidence for A10.** The design binds
`text-new/typeset/fontFamily/heading: Raleway` and `…/body: Roboto`. `editorial-suite` declares
`--sl-brand-text-new-typeset-fontFamily-heading: Raleway` / `-body: Roboto`, and its Typekit
(`bws3iof`) is the one that ships those faces. Typography and colour agree. (A5's frame binds
`heading: Roboto`, which agrees with neither cleanly — a further sign the two frames were drawn
under different modes.)

---

## Fonts — MEASURED: the webfonts DO load. The batch's standing assumption is wrong here.

`document.fonts.check('14px Roboto')` -> **true**. `document.fonts.check('28px Raleway')` -> **true**.
Measured in the harness under `globals=theme:editorial-suite`, not assumed. The Typekit this theme
loads (`bws3iof`) really does serve both faces. **Text in this run renders in the design's own
typefaces, not a fallback.**

That contradicts the batch brief ("Expect text in a fallback face") and A5's note on this same
theme. Both are right about the `--sl-text-new-*-fontFamily` tokens, which resolve to `'Open Sans'`
— a face this Typekit does **not** ship. They are wrong as a blanket statement about the theme.
The LEGACY family tokens name exactly what the Typekit serves and what the design asks for:

- `--sl-heading-fontFamily` → Raleway — **loads**
- `--sl-text-fontFamily` → Roboto — **loads**
- any `--sl-text-new-*-fontFamily` → 'Open Sans' — **does not load**

So the rule is narrower than the brief states: this theme has a working font path and a broken one,
and which you get depends on which family token you reach for.

**Consequence for measurement.** A text run that differs from the reference in this run **cannot**
be excused as "the webfont is missing". That excuse was available to earlier runs; it is not
available here, and any text-width gap has to be explained some other way or left recorded.

## Typography — LONGHAND ONLY (verified by grep, not inherited)

`packages/themes/editorial-suite/theme.css` declares **zero bare `--sl-text-new-*` tokens**.
Only longhands. **Never write `font: var(--sl-text-new-…)`** — the var is undefined, the browser
drops the _entire_ declaration, and nothing errors.

- `--sl-text-new-body-{sm,md,lg}-{fontFamily,fontSize,fontWeight,lineHeight}` — body HAS fontWeight
- `--sl-text-new-heading-{sm,md,lg,xl,2xl}-{fontFamily,fontSize,lineHeight}` — heading has **no** fontWeight
- `--sl-text-new-input-{md,lg}-{fontFamily,fontSize,lineHeight}`
- `--sl-text-new-typeset-fontFamily-{body,heading,icon}`, `--sl-text-new-typeset-fontWeight-{regular,semiBold}`

Resolved: `heading-sm` 14/20, `heading-md` 16/20, `heading-lg` 24/32, `body-md` 14/20/400.

### The fontFamily trap — use the LEGACY family tokens

`--sl-text-new-typeset-fontFamily-{body,heading}` and every `--sl-text-new-*-fontFamily`
resolve to **`'Open Sans'`**, which this theme's Typekit does **not** ship _and which the design
does not ask for_. The design asks for Raleway/Roboto. Use:

```css
.title {
  font-family: var(--sl-heading-fontFamily); /* Raleway — matches the design */
  font-size: var(--sl-text-new-heading-md-fontSize);
  line-height: var(--sl-text-new-heading-md-lineHeight);
  font-weight: var(--sl-text-new-typeset-fontWeight-semiBold);
}
.body {
  font-family: var(--sl-text-fontFamily);
} /* Roboto */
```

Both legacy tokens exist in this theme and resolve correctly. Taking the `--sl-text-new-*`
family would render a fallback face _and_ the wrong typeface.

## Icons — only these 54, from `packages/themes/editorial-suite/icons.ts`

angle-down, arrow-left, arrow-right, arrow-up-right-from-square, badge-available, badge-away,
badge-donotdisturb, badge-offline, breadcrumb-separator, calendar, caret-down-solid,
caret-left-solid, caret-right-solid, check, check-solid, chevron-down, chevron-left,
chevron-right, circle-check-solid, circle-exclamation-solid, circle-solid, circle-xmark,
circle-xmark-solid, clock, dash-solid, diamond-exclamation-solid, ellipsis, ellipsis-down,
ellipsis-vertical, envelope, error, eye, face-smile, fav, grip-lines, hand, home-blank, info,
menu, minus, mobile, octagon-exclamation-solid, octagon-xmark-solid, pinata, plus, search,
smile, sort, sort-down, sort-up, square-arrow-up-right, star, triangle-exclamation-solid, xmark

- **Never** `import … from '@fortawesome/*'`. Not installed, no credential. This is a **render**
  blocker: the specifier fails to resolve, the module never runs, `customElements.define` never
  happens, and the story shows an unknown element with no shadow root.
- **Never** write `Icon.register(...)`. `.storybook/themes.ts` calls the theme's `setup()`, which
  registers all 54 before render.
- An icon the design needs and this list lacks is **left out with its footprint preserved** (keep
  the box so nothing shifts) and **recorded as a Stage 4 discrepancy**. Never hand-draw an SVG —
  invented artwork inside something about to be pixel-compared.
- A5, on this same file, found absent: `file`, `image`, `volume`, `play`, `signal-stream`,
  `pen-to-square`, `magnifying-glass-plus`.

## Overrides of the shipped `implement-design-lit` skill

1. "Every `<sl-icon>` needs `Icon.register(faX)` from `@fortawesome/pro-*`" — **forbidden here.**
2. "A `--sl-text-new-*` token is a `font:` shorthand" — **false here.** Longhands only.

## Known upstream defects — work around, record, do not fight

- **`sl-panel`**: `[part=header]` gets `flex: 1` and the body no grow factor on a column-flex host,
  so a stretched panel grows its grey _header_. Work around with
  `::part(header){flex:0 0 auto}` + `::part(body){flex:1 1 auto}`.
- **`sl-panel`** tightens header inline padding only under `:host([has-actions])`, which it sets
  for `slot="actions"` but not `slot="aside"`.
- **`sl-progress-bar`** ships `font: var(--sl-text-new-heading-sm)` — a bare token this theme does
  not define — so its label typography drops silently for every consumer of this theme.

## Reference screenshot

`get_screenshot` returned **1440×837** — the frame's exact size, **no canvas bleed this time**.
`reference-normalised.png` is byte-identical to `screenshot.png` (md5 `baa3ffb3…`), which is the
correct outcome of normalisation here, not a skipped step. The ~8px bleed other runs saw is
therefore intermittent, not constant — one more reason normalisation belongs in the harness.
