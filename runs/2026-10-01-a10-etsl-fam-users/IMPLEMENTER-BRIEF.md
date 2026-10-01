# A10 implementer brief — read this before writing a line

Case **A10 `FAM - Users`**, Figma `S5QgDy8X9eqhvECPANSZMM` / `17264:29098`, theme
**`editorial-suite`** (derived 6/6 — see `THEME-NOTES.md`), framework **lit**, **i18n OFF**,
output `examples/lit/src/_runs/a10-etsl-fam-users/`.

Reference image: `.implement-design/a10-etsl-fam-users/reference-normalised.png` (1440×837, no bleed).
Full spec: `.implement-design/a10-etsl-fam-users/manifest.md`.

## Ten rules, each learned the expensive way. Breaking one fails the run.

1. **Never `import … from '@fortawesome/*'`.** It is not installed and there is no credential.
   This is a **render** blocker, not a lint nit: the specifier fails to resolve, the module never
   executes, `customElements.define` never runs, and Storybook shows an unknown element with an
   empty shadow root. The capture still "succeeds" — which is why it is so dangerous.
2. **Never write `Icon.register(...)`.** `.storybook/themes.ts` calls the theme's `setup()`,
   which registers all 54 icons before render. Just write `<sl-icon name="…">`.
3. **Only the 54 icon names in `THEME-NOTES.md`.** An icon the design needs and the theme lacks is
   **omitted with its footprint preserved** (keep the box so nothing shifts) and **recorded as a
   Stage 4 discrepancy**. **Never hand-draw a replacement SVG** — a wave-1 run did, which puts
   invented artwork into something about to be pixel-compared.
4. **Never `font:` shorthand against a `--sl-text-new-*` token.** `editorial-suite` declares
   **no bare ones**. An undefined `var()` makes the browser drop the _entire_ declaration and
   nothing errors. Use the four longhands. Headings have **no** `-fontWeight` longhand — take it
   from `--sl-text-new-typeset-fontWeight-semiBold`.
5. **Font family comes from the legacy tokens.** `--sl-heading-fontFamily` = Raleway,
   `--sl-text-fontFamily` = Roboto — which is what the design asks for. Every
   `--sl-text-new-*-fontFamily` resolves to `'Open Sans'`, which this theme's Typekit does not
   ship. Size and line-height still come from the `--sl-text-new-*` longhands.
6. **No `var()` fallbacks on any `--sl-*` token.** A fallback hides a missing token, which is the
   exact failure mode the token checker exists to catch.
7. **A colour with no theme token gets a run-local `--a10-color-*` property**, declared once on
   the root `:host` with its Figma variable name in a comment. Never a bare hex inside a rule,
   and never an invented `--sl-*` name. `check-tokens.mjs` fails the run on an invented
   `--sl-*`; it is right to.
8. **Every tag and every event is prefixed `sl-a10-` / `sl-a10-`.** A5 is a different frame of
   the _same Figma file_ and already minted `sl-etsl-app-header`, `sl-etsl-dashboard-page`.
   The guarded-registration house style turns a tag collision into a **silent mis-render**
   (whichever module loads first wins), not an error.
9. **The story needs a separate bare `import './thing.js';`.** A `import { type X } from …` is
   erased at transform time; so is a _value_ import whose binding is only used in a type
   position. Only the bare side-effect import reliably runs `customElements.define`. The type
   check passes either way, which is why nothing in the pipeline catches it.
10. **Every fix must name its cause and show the arithmetic.** A fix that introduces a raw length
    without one is rejected. The cheapest way to close a pixel gap is always a constant fitted to
    the measurement, and that is exactly what must not happen: it is right at 1440 and wrong
    everywhere else, and no score can see the difference.

## Known upstream defects — work around them, record them, do not fight them

- **`sl-panel`** gives `[part=header]` `flex: 1` with no grow factor on the body, so a stretched
  panel grows its grey _header_. Fix: `::part(header){flex:0 0 auto}` + `::part(body){flex:1 1 auto}`.
- **`sl-panel`** tightens header inline padding only under `:host([has-actions])`, which it sets
  for `slot="actions"` but not `slot="aside"`.
- **`sl-progress-bar`** ships `font: var(--sl-text-new-heading-sm)` — a bare token this theme does
  not define — so its label typography drops silently for every consumer.
- **`packages/components/grid/src/grid.ts`** has two committed `TS2322` errors. They are the
  recorded baseline; `typecheck.mjs` tolerates them by name. **Do not "fix" them** — they are
  outside your scope and a shrunk baseline is reported as a problem.

## Expect text in a fallback face

Nothing here loads a webfont in the harness. Text will render in a fallback. A text element that
measures narrower than the reference is explained by that, and the explanation is the deliverable
— **do not pad it to fit.** A sibling run correctly refused to pad a 163px pill toward a 181px
reference once it had traced the cause to the missing webfont; the same run, on a cause it had
_not_ traced, replaced a content-hugging flex item with `inline-size: 420px` chosen so that
`420 + 24 = 444`. Both from the same agent in the same turn. The difference was whether naming
the cause was required. Here it is required.

## Assets: there is no export step

`<img src="/assets/…">` 404s — the harness serves `/assets` from an empty directory, and that
directory is **shared, so do not write to it**. The "Editorial Suite" wordmark (155×20) has no
substitute: omit it, hold the footprint, record it. Everything else the design exports as an
image is replaceable by a real component (`sl-avatar` for the initials, `sl-icon name="plus"`
for the plus glyph) or droppable (the 760×60 spacer vector → `flex: 1`).

## Gates you will be held to, run by the orchestrator

```sh
node runs/harness/typecheck.mjs    --scope examples/lit/src/_runs/a10-etsl-fam-users
node runs/harness/check-tokens.mjs --scope examples/lit/src/_runs/a10-etsl-fam-users --theme editorial-suite
node runs/harness/shoot.mjs --story <id> --out .implement-design/a10-etsl-fam-users/testing/<name>.png \
  --theme editorial-suite --width 1440 --height 837 --full
```

`tsc` exit 0 is unreachable in this repo; only `inScope` and `regressionsOutsideScope` count.
Only verdict `rendered` is evidence. **No stub may make a gate pass** — a wave-1 implementer wrote
a local `.d.ts` to mask a missing module, `tsc` went green, and the gate certified a tree whose
story could not load.

**Do not run `yarn start`, `yarn install`, or `yarn extract-i18n`, and do not start a Storybook.**
One harness on `:6010` serves every run and picks up new folders automatically.
