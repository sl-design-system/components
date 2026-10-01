# Implementer brief — A1 Kampus "Subchapter feed page"

Read this first, then your own component spec in the prompt that spawned you.

## Fixed context (settled — do not ask, do not re-derive)

| Setting     | Value                                                                                                     |
| ----------- | --------------------------------------------------------------------------------------------------------- |
| Framework   | **lit**                                                                                                   |
| i18n        | **OFF** — render visible strings directly, no `msg()`. Design text is Finnish; keep verbatim.             |
| Output base | `/Users/marcin.ludwig/Repo/sl-design-system/components/examples/lit/src/_runs/a1-kampus-subchapter-feed/` |
| Theme       | `kampus`                                                                                                  |
| Breakpoint  | single, 1280px (page 1280×720)                                                                            |

This is an **example path**, not a published package: **no** `package.json`, **no** `register.ts`,
**no** website docs, **no** changeset, **no** spec file. Each component is
`<name>.ts` + `<name>.css` + `<name>.stories.ts`, co-located in its own folder.

Framework skill: `/Users/marcin.ludwig/Repo/sl-design-system/components/tools/implement-design-plugin/skills/implement-design-lit/SKILL.md`
Conventions: `/Users/marcin.ludwig/Repo/sl-design-system/components/tools/implement-design-plugin/skills/implement-design/component-conventions.md`
Manifest (design + decomposition + all defaults): `/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/a1-kampus-subchapter-feed/manifest.md`
Figma reference screenshot: `/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/a1-kampus-subchapter-feed/screenshot.png`

## Shared contracts — already written, do not redefine

`models.ts` and `mock-data.ts` exist at the output base. **Import from them; never redeclare a
type they export.** If a contract genuinely does not fit your component, say so in your report —
do not silently change it, because parallel siblings depend on the same module.

## Five rules that override your defaults

1. **Icons: inline SVG. Do NOT use `sl-icon`.** `sl-icon` renders nothing unless
   `Icon.register()` has run, nothing registers icons in this harness, and the Kampus theme ships
   only 34 glyphs — it has no search, bell, help, account, star, list, grid, link, pen or key. An
   unregistered `sl-icon` fails silently and invisibly. Write small inline `<svg viewBox="0 0 512
512">` glyphs with `fill="currentColor"`, sized via CSS. Keep them simple; exact path fidelity
   is not being measured, presence and size are.

2. **The story must import the component for its side effect.**
   `import { type Thing } from './thing.js'` is erased at transform time, so
   `customElements.define` never runs and Storybook renders an unregistered element — in the DOM,
   zero by zero, no shadow root. Your story file MUST contain a plain, non-type import:

   ```ts
   import './thing.js'; // side-effect import — registers the element
   import { type Thing } from './thing.js'; // types only
   ```

   The type check passes either way, which is exactly why this bug survives review. Check it.

3. **Verify every SLDS component before you compose it.** This Figma file publishes **no Code
   Connect mappings at all**, so every "use `sl-card`/`sl-tag`/`sl-breadcrumbs`" suggestion in the
   manifest is an _inference_. Before importing one, read its real source and stories under
   `packages/components/<name>/src/`. If its API fits, use it. If it does not, write bespoke markup
   instead — and **report which you chose and why**. A forced fit that renders wrong is worse than
   honest bespoke markup.

4. **Tokens.** Use `--sl-*` custom properties, not raw values, wherever a token exists.
   - Spacing 4/8/16/24/40/56px → `--sl-size-050/100/200/300/500/700`.
   - Purple `#643695` → `--sl-brand-light-color-palette-purple-700`;
     `#0E0E0F` → `--sl-brand-light-color-palette-grey-900`;
     `#F5F5F6` → `--sl-brand-light-color-palette-grey-050`; white → `--sl-color-white`.
   - Near-misses — accept the nearest semantic token and take the pixel delta:
     `#CECFD2`→grey-150, `#E2E2E4`→grey-100, `#444548`→grey-700, `#6D6E73`→grey-400,
     `#29292B`→grey-800, `#F0ECF5`→purple-100.
   - `#DB7109` (filled star) has **no token anywhere** — hardcode the hex with a comment.
   - Layout dims 74/360/846/798/390/176/144px have no token — hardcode px.
   - Typography: the Kampus scale resolves through a userGroup × breakpoint indirection, so use the
     public tokens and never chase a px value.
     `h1`→`--sl-heading-lg-*`, `h2`→`--sl-heading-md-*`, `h3`→`--sl-heading-sm-*`,
     `h4`→`--sl-title-sm-*`, `Body/Small`→`--sl-text-sm-*`,
     `UI/Button`+`UI/Small-semibold`→`--sl-label-md-*`,
     `UI/Extra-small-regular`→`--sl-text-sm-*`,
     `UI/Extra-small-semibold`/`UI/Extra-Tiny`/`UI/Extra-tiny-semibold`/`UI/Tiny-bold`→`--sl-label-sm-*`.
     Suffixes: `-fontSize`, `-lineHeight`, `-letterSpacing`; weights via
     `--sl-typography-{family}-{size}-fontWeight`.

5. **Styles are plain `.css`**, imported `import styles from './x.css' with { type: 'css' };`.
   There is no style build step. Do not write `.scss`.

## Element registration

Only the **root** (`sl-subchapter-feed-page`) registers globally, and it must guard:

```ts
if (!customElements.get('sl-subchapter-feed-page')) {
  customElements.define('sl-subchapter-feed-page', SubchapterFeedPage);
}
```

Every other component is rendered by its parent through `ScopedElementsMixin`'s
`scopedElements` map (`@open-wc/scoped-elements/lit-element.js`). **But your own story still needs
to render your component standalone** — so each non-root component ALSO guards a global define of
its own tag at the bottom of its module. A guarded define is safe in both places.

## Do NOT

- Do **not** run `yarn start`, `yarn install`, `link-workspaces.mjs`, or start a Storybook.
  A shared harness is already running on port 6010 and picks up your files automatically.
- Do **not** run any `git` command that writes. Seventeen other agents share this checkout.
- Do **not** invent placeholder images. `<img src="/assets/…">` 404s by design; that is a recorded
  Stage 4 discrepancy, not something to paper over.

## Story titles

Namespace every story so it cannot collide with the seventeen other runs in the same harness:

```ts
title: 'Runs/A1 Kampus Subchapter Feed/<Component Name>';
```

## Report back

Your component's file paths, **the exact Storybook story id** you created, which SLDS components
you verified and whether you used or rejected each, any contract in `models.ts` that did not fit,
and anything you had to guess.
