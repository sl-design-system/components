# Shared brief — every Stage 3 implementer on run `a5-etsl-metadata-usage-widget` reads this

Run folder: `/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/a5-etsl-metadata-usage-widget/`
Output base: `/Users/marcin.ludwig/Repo/sl-design-system/components/examples/lit/src/_runs/a5-etsl-metadata-usage-widget/`
Figma reference screenshot: `<run>/screenshot.png` — open it, it is ground truth.
Framework skill: `/Users/marcin.ludwig/Repo/sl-design-system/components/tools/implement-design-plugin/skills/implement-design-lit/SKILL.md`
Conventions: `/Users/marcin.ludwig/Repo/sl-design-system/components/tools/implement-design-plugin/skills/implement-design/component-conventions.md`
Theme facts (READ THIS — it overrides both of the above in two places): `<run>/THEME-NOTES.md`
Manifest + full decomposition: `<run>/manifest.md`

Framework **lit** · i18n **OFF** (plain English literals, never `msg()`) · theme **editorial-suite**.

## This is an EXAMPLE target, not a published package

No `package.json`, no `register.ts`, no `src/` nesting, no website docs, no changeset, no Vitest spec.
Just co-located `.ts` + `.css` + `.stories.ts` (+ `.mock.ts`) in the component's own folder.
Mirror `examples/lit/src/_runs/a1-kampus-subchapter-feed/` for shape.

## Six rules that override the skills

1. **NEVER import `@fortawesome/*`.** It is not installed and there is no credential.
   **NEVER call `Icon.register(...)`** — the editorial-suite theme's own `setup()` already
   registered its 54 icons globally (`.storybook/themes.ts` → `@sl-design-system/editorial-suite`).
   Just render `<sl-icon name="...">` with a name from the 54 listed in THEME-NOTES.md.
   An icon the design needs that is not in the 54 is **LEFT OUT** and recorded as a discrepancy.
   Never hand-draw a replacement SVG — invented artwork corrupts the pixel comparison.
   This overrides `component-conventions.md` §Icons and `implement-design-lit` §Icons.

2. **NEVER use the `font:` shorthand with a `--sl-text-new-*` token.** editorial-suite ships
   **longhands only** — `font: var(--sl-text-new-body-md)` resolves to nothing and the browser
   silently drops the whole declaration. Use the four longhands. Headings have no `-fontWeight`
   longhand; take weight from `--sl-fontWeight-*`. Font families: use `--sl-heading-fontFamily`
   (Raleway) and `--sl-text-fontFamily` (Roboto) — **not** `--sl-text-new-typeset-fontFamily-*`,
   which resolve to 'Open Sans' in this theme. This overrides `implement-design-lit` §Styles.

3. **No hardcoded hex** except the eight documented `--etsl-color-*` run-local custom properties
   declared on the ROOT's `:host` (see THEME-NOTES.md). Children **consume** them
   (`var(--etsl-color-brand)`) and must NOT redeclare them — custom properties inherit through
   shadow boundaries. Everything else must be a real `--sl-*` token.

4. **No stub may be what makes a gate pass.** Do not write a local `.d.ts` to mask a missing
   module. If something will not type-check honestly, say so and stop.

5. **The story must import its component for the side effect.**
   `import { type Thing } from './thing.js'` is erased at transform time. A level-0 child does
   not register itself, so its own story must register it explicitly — see the story recipe below.

6. **Reproduce the design's ACTUAL content**, including its typos, verbatim. A reviewer must open
   the story and see the Figma design, not an empty shell. Your `.mock.ts` fixture carries it.

## Story recipe for a level-0 child (it does NOT self-register)

```ts
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@sl-design-system/button/register.js'; // any SLDS element used in LIGHT dom only
import { EtslFooWidget } from './etsl-foo-widget.js'; // value import — NOT `type`
import { fooWidgetMock } from './etsl-foo-widget.mock.js';

// The child does not register itself (only the root does). Register it here so the story renders.
customElements.get('sl-etsl-foo-widget') ||
  customElements.define('sl-etsl-foo-widget', EtslFooWidget);

export default {
  title: 'Runs/A5 ETSL Metadata usage widget/Foo widget',
  parameters: { layout: 'fullscreen' },
  render: () => html`<sl-etsl-foo-widget .model=${fooWidgetMock}></sl-etsl-foo-widget>`
} satisfies Meta;

export const Basic: StoryObj = {};
```

Use `ScopedElementsMixin(LitElement)` + `static scopedElements` for any SLDS element you render
inside YOUR OWN shadow root, and import its **class** (not `register.js`) for that.

## Type check

`npx tsc -p examples/lit/tsconfig.json --noEmit` — run from the repo root. It covers the whole
`examples/lit` tree, so **only fix errors in your own files**; pre-existing ones elsewhere are not yours.
Do NOT run `yarn start`, `yarn install`, or start a Storybook. One harness already serves every run.

## Report back

- files written (absolute paths)
- the exact Storybook story id you created (derive from the title: `runs-a5-etsl-metadata-usage-widget-foo-widget--basic`)
- every icon the design needed that you left out, and where
- every value you could not express with a token
- anything in the spec you could not implement, and why
