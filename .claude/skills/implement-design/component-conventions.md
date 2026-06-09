# SLDS Component Conventions

The shared spec every `/implement-design` generation agent reads before writing code. It encodes how this monorepo actually structures a component package, derived from existing stable components (e.g. `packages/components/badge`). Follow it exactly — deviation produces code that won't build, lint, or render in Storybook.

When in doubt, open the nearest existing component of the same shape (a form control → `text-field`; a static indicator → `badge`; a container → `card`) and mirror it.

---

## Implementing a design — reproduce its content, don't over-abstract

When the task is to implement a specific Figma design (this whole pipeline — and especially example / page components), the result must **render the design's actual content**: the real breadcrumb labels, titles, list items, roster, etc. The target is a story that renders the design _and its content_ with little or no configuration — ideally just `<sl-your-component></sl-your-component>`. A reviewer should open the story and see the Figma design, not an empty shell that needs args.

Achieve that through **data ownership**, not by hardcoding content in every component:

- The **root / page component owns the data** — it obtains it (fetches from an endpoint / data-source; in an example, holds a realistic mock object with a comment noting where the fetch would go) and **passes the appropriate subset to each child as input properties**.
- **Child components are presentational** — they take data via input properties and render it; they do not fetch their own data and the story does not fill them in (the root does).
- So a header that shows breadcrumbs + a meta row receives `breadcrumbs` and the schedule fields as **properties from the page** and renders them — it is fed by the data owner, not by the story, and not via consumer slots. Repeated rows are mapped from a passed-in array.
- Reserve **slots** for genuinely arbitrary consumer content, never for the design's own data. A genuinely app-global feature list that isn't part of the fetched record may stay with the component that renders it — but call that out.

## Package layout

A component lives in `packages/components/<name>/` (kebab-case, singular). The hand-authored files are:

```
packages/components/<name>/
├── package.json
├── tsconfig.json
├── index.ts                 # re-exports the public API
├── register.ts              # defines the custom element
└── src/
    ├── <name>.ts            # the LitElement class
    ├── <name>.scss          # styles (compiled to <name>.scss.js by the build)
    ├── <name>.spec.ts       # Vitest browser tests
    └── <name>.stories.ts    # Storybook stories
```

Everything else (`*.js`, `*.d.ts`, `*.scss.js`, `custom-elements.json`, `CHANGELOG.md`) is **generated** — never hand-write it.

### `package.json`

Copy an existing stable component's `package.json` and change only: `name` (`@sl-design-system/<name>`), `version` (`0.0.1`), `status` (`"draft"` for new work), `description`, `repository.directory`, `homepage`. Keep `type`, `main`, `module`, `types`, `customElements`, `exports`, `files`, `sideEffects`, and `scripts` byte-for-byte identical. Add only the `lit` dev/peer dependency unless the component genuinely composes another `@sl-design-system/*` package — in which case add it to `dependencies`.

### `tsconfig.json`

Identical for every component:

```json
{
  "extends": "../../../tsconfig.base.json",
  "compilerOptions": { "composite": true, "rootDir": "./" },
  "include": ["index.ts", "register.ts", "src/**/*.ts"]
}
```

### `index.ts` / `register.ts`

```ts
// index.ts
export * from './src/<name>.js';
```

```ts
// register.ts
import { <ClassName> } from './src/<name>.js';

customElements.define('sl-<name>', <ClassName>);
```

Note the `.js` extensions in imports even though the source is `.ts` — this is required (NodeNext module resolution).

### Monorepo registration

After scaffolding, add the package to **`tsconfig.all.json`** `references` array (alphabetical):

```json
{ "path": "./packages/components/<name>" }
```

Without this the component is not type-checked by the root build.

---

## The LitElement class (`src/<name>.ts`)

Mirror this skeleton:

````ts
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './<name>.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-<name>': <ClassName>;
  }
}

// Public union types for properties, exported.
export type <ClassName>Size = 'sm' | 'md' | 'lg';

/**
 * One-sentence description of what the component does.
 *
 * ```html
 * <sl-<name>>...</sl-<name>>
 * ```
 *
 * @slot default - Contents of the component
 */
export class <ClassName> extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * The size of the component.
   *
   * @default 'md'
   */
  @property({ reflect: true }) size?: <ClassName>Size;

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
````

Rules:

- **Import styles from the compiled `./<name>.scss.js`**, not the `.scss`. The class won't type-check until the SCSS is built (see below).
- Properties that drive a CSS selector (`:host([size='lg'])`) must be `{ reflect: true }`.
- Variant/enum properties use exported string-union types, never raw `string`.
- JSDoc every public property. Style per CONTRIBUTING.md: "The `x` of the `component`." for options, "Whether the `component` is `x`." for boolean states. End with a period. Add `@default <value>` (no `@default` for booleans defaulting to false).
- Slots are documented with `@slot <name> - Description` in the class-level JSDoc block, above the class.
- Events: dispatch `sl-`-prefixed dasherized events (`sl-active-item-change`). Use the `EventEmitter` decorator from `@sl-design-system/shared` if other components use it for that pattern — check a neighbor.

### Accessibility hooks

- **Form controls** (anything that holds a user value): make it `formAssociated`, wire `ElementInternals`, and follow `text-field`/`checkbox` for `FormControlMixin` usage. Do not invent form plumbing — copy the established mixin wiring.
- **Components that wrap a native control or delegate a label**: use `ForwardAriaMixin` from `@sl-design-system/shared/mixins.js` so `aria-*` set on the host forwards to the inner element. Check `forward-aria-mixin.ts` for the exact API.
- Set the correct ARIA `role`/state in `render` or via `internals`, matching the role named in the decomposition manifest.
- **One `<sl-form>` per logical form — and keep the form, its controls, and its action buttons in the SAME component.** When a page/section has multiple form controls plus action buttons (Save / Cancel / Submit), the `<sl-form>` wraps all those controls _and_ the action bar so the buttons validate and collect every control at once. **Do not wrap a _child component_ in a parent-level `<sl-form>`**: if the form's controls live in a child's shadow DOM and the `<sl-form>` is in the parent, the parent form is effectively a separate (dummy) form — wrong architecture, even though the `composed` `sl-form-control` event technically bubbles to it. Instead, the component that contains the form controls **also** contains the `<sl-form>` and the buttons (one shadow tree). Give every control a `name`.
  - **The data-owner parent stays the owner**: it passes the initial form value _into_ that form component as an `@property`, and handles the form component's emitted `sl-save`/`sl-cancel`-style events. The form component owns the form _state_.
  - **In Lit, manage the form with a `FormController`** — `#form = new FormController<FormShape>(this)` on the component that renders the `<sl-form>` (it auto-discovers the `<sl-form>` in the render root). **Do not bind `.value` on each field**; set the whole form from the incoming value (`this.#form.value = this.value` in `updated()` when the `value` input changes), and read `this.#form.value` / `reportValidity()` / `reset()` for the actions. The fields only declare `name`/`label`/options. See `examples/lit/src/composite-form` and `examples/course-settings-page`.
- **Never use the `<main>` element (or `role="main"`) in a generated component** — the `main` landmark is reserved for the host application that embeds the component. Use a `<div>` (or an appropriate sectioning element like `<header>`/`<section>`) for layout wrappers instead. The same caution applies to other page-level singleton landmarks the host owns (e.g. a single top-level `<nav>` banner) — prefer neutral elements and let the consuming app provide the page landmarks.

---

## Composing child components — scoped custom elements

When a component is composed of other custom elements — child components you author, or `@sl-design-system/*` components it renders in its own shadow DOM — define those through a **scoped custom element registry** (`@open-wc/scoped-elements`), not the global one.

- A **child component used only inside a larger component must NOT register itself** — no `customElements.define`, no `register.js` side-effect import. It just exports its class.
- The **parent** extends `ScopedElementsMixin(LitElement)` and declares the children + any SLDS elements it renders in a `static get scopedElements()` map, importing the component **classes**:
  ```ts
  import {
    type ScopedElementsMap,
    ScopedElementsMixin
  } from '@open-wc/scoped-elements/lit-element.js';
  import { Panel } from '@sl-design-system/panel';
  export class Foo extends ScopedElementsMixin(LitElement) {
    static get scopedElements(): ScopedElementsMap {
      return { 'sl-panel': Panel, 'sl-foo-row': FooRow };
    }
  }
  ```
- Scoped registries only govern tags the component renders in **its own shadow template**. So a child you want scoped must be **rendered by the parent**, not slotted in from light DOM. Repeated structured children become a **data property** the parent maps over (e.g. `items: ItemInfo[]`) and renders, not a slot of `<child>` elements. Reserve slots for _content_ (arbitrary consumer markup) and forward it into internally-rendered scoped children with `<slot name="x" slot="x">`.
- Only the **top-level / public-entry** component registers globally (a `register.ts` for an SLDS package; a guarded `customElements.define` for a standalone example). Its internal children never do.
- Light-DOM elements the consumer writes themselves — including slotted `@sl-design-system/*` components — still need the **global** registry, so import those `register.js` side-effects where the consumer markup lives (the story / app / example entry), never inside a scoped child.

Reference implementations: `examples/lit/src/composite-form` and `examples/lesson-detail-page`.

## Icons (`sl-icon`)

Every `<sl-icon name="...">` you render needs its icon **registered** — the `name` alone renders nothing unless the SVG has been added to the `Icon` registry. In the component module that renders the icon, import the icon definition(s) and call `Icon.register(...)` at module load:

```ts
import { faCalendar, faStar } from '@fortawesome/pro-regular-svg-icons';
import { Icon } from '@sl-design-system/icon';

Icon.register(faCalendar, faStar);
// → enables <sl-icon name="far-calendar"> and <sl-icon name="far-star">
```

Name-prefix ↔ package: `far-*` → `@fortawesome/pro-regular-svg-icons`, `fas-*` → `pro-solid-svg-icons`, `fal-*` → `pro-light-svg-icons`, `fad-*` → `pro-duotone-svg-icons`. The export is the camelCase of the icon name (`faLocationDot` → `far-location-dot`). The `Icon` registry is global, so registering in the module that _chooses_ the icon also covers a generic child (e.g. an icon+label atom) that renders it by a passed-in name — register the concrete icons where they're decided.

## Localization (`@lit/localize`)

Only when the run's i18n decision is **on** (the orchestrator asks before decomposition). The repo is configured in `lit-localize.json`: `sourceLocale: "en"`, target locales `nl`, `it`, `es-ES`, `pl`, runtime mode, translations in `packages/locales`.

- Import from `@lit/localize` and decorate the component class:

  ```ts
  import { localized, msg } from '@lit/localize';

  @localized()
  export class Foo extends LitElement {
    /* … */
  }
  ```

- Wrap **every** user-visible string in `msg()` with a stable, namespaced `id`:
  ```ts
  html`<span>${msg('Show all', { id: 'sl.tabs.showAll' })}</span>`;
  ```
- The string passed to `msg()` is the **English source** (sourceLocale is `en`). If the design's original language isn't English, use the English source from the decomposer's Localized strings table; the original-language text is a _translation_ of the `nl` (etc.) locale, not the source in code.
- Ids are namespaced `<scope>.<component>.<key>` (e.g. `sl.tabs.showAll`). Keep them stable — they key the translations.
- Translations are extracted with `yarn extract-i18n` (lit-localize) into the xliff files under `packages/locales`; you don't hand-write locale bundles.
- When i18n is **off** for the run, render the design's text directly (no `msg()`), as the rest of this doc describes.

## SCSS (`src/<name>.scss`)

- Style the host with `:host` and state with attribute selectors: `:host([size='lg'])`, `:host([disabled])`.
- **Every visual value comes from a design token.** Colors → `var(--sl-color-*)`. Spacing/sizing/radius → `var(--sl-size-*)`. Typography → `var(--sl-text-*)` / `var(--sl-font-*)`. Never hard-code a hex, px, or rem that a token exists for. Use the exact token names quoted in the design manifest's Token Reference.
- **No `var()` fallback values.** Write `var(--sl-color-foreground-plain)`, never `var(--sl-color-foreground-plain, #121721)`. The token must exist; if you can't find the right one, that's a flag to raise (note it in your report), not a hex to fall back to.
- **Always use light-mode color tokens — even when the design is dark mode.** Pick the semantic token by its _role_ (page background, foreground, subtle text, accent…) from the light theme. Do **not** hard-code dark colors or reach for dark-variant tokens to match a dark mock-up. Theme switching (Storybook, and the app) remaps those same semantic tokens to dark automatically, so a correctly-tokenized light-mode component renders correctly in dark mode for free. (This is why a dark design that surfaces only raw hex should map to semantic light tokens, not to the dark hex.)
- **Don't set `display` (e.g. `:host { display: block }`) unless it intentionally changes the component's default rendering** — and when it does, say why in a comment. Don't add it as reflexive boilerplate.
- **Private custom properties (`--_x`) only when the value is reused** — i.e. set in one place and read in several, or varied across variant selectors. If a value is used exactly once, write it inline; don't introduce a single-use `--_x`.
- **Prefer styling a component's exposed `::part()` over adding wrapper elements.** Don't wrap slotted content in an extra `<div class="grid">` just to lay it out — style the host component's part instead, keeping the markup clean. E.g. to grid the fields inside an `<sl-panel>`, write `sl-panel::part(content) { display: grid; … }` rather than wrapping them in a `<div>`. This works for slotted children because the default `<slot>` is `display: contents`, so the slotted elements become grid/flex items of the part. For per-instance layout, combine a host class with the part: `sl-panel.general::part(content) { … }`. (Check the component's `@csspart` docs for the available parts.)
- Style slotted children with `::slotted(...)`.
- Logical properties throughout (`padding-inline`, `block-size`, `inline-size`, `margin-block-start`) — never `width`/`height`/`left`/`top`.

### Compiling SCSS

The class imports `./<name>.scss.js`, which is generated from the `.scss`. After writing or changing any `.scss`, run from the repo root:

```bash
node scripts/build-styles.js 'packages/components/<name>/**/*.scss'
```

This must succeed before the component will type-check or render.

---

## Tests (`src/<name>.spec.ts`)

Vitest browser tests using the project's `fixture` helper:

```ts
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { type <ClassName> } from './<name>.js';

describe('sl-<name>', () => {
  let el: <ClassName>;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-<name>>...</sl-<name>>`);
    });

    it('should ...', () => {
      expect(el).to.not.have.attribute('...');
    });
  });
});
```

Cover: default render, each reflected property (set → `await el.updateComplete` → assert attribute), keyboard interaction, ARIA attributes/role, and form association where applicable. Use the chai-style `expect(el).to.have.attribute(...)` matchers as the existing specs do. Run from repo root, not the package.

---

## Stories (`src/<name>.stories.ts`)

```ts
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type <ClassName> } from './<name>.js';

type Props = Pick<<ClassName>, 'size' | '...'>;
type Story = StoryObj<Props>;

export default {
  title: '<Category>/<ComponentName>',
  args: { /* sensible defaults */ },
  argTypes: { /* controls for every public prop */ },
  render: ({ size }) => html`<sl-<name> size=${ifDefined(size)}>...</sl-<name>>`
} satisfies Meta<Props>;

export const Basic: Story = {};
```

- **Page components** (a full-page / root composition like `<sl-...-page>`) set `parameters: { layout: 'fullscreen' }` on the story meta so they render edge-to-edge. Non-page components must **not** set this — leave the default padded canvas.
- `title` follows the existing category taxonomy (`Feedback & status/Badge`, `Form/Text field`, …) — pick the category from a neighbor in the same family.
- One control per public prop in `argTypes`.
- A `Basic` story plus one story per significant variant/state shown in the design.
- If `color-contrast` or another axe rule fires a known false positive, add the `parameters.a11y.config.rules` exclusion exactly as `badge.stories.ts` does — never disable a11y wholesale.

---

## Website docs (`website/src/categories/components/<name>/`)

Markdown docs powered by 11ty. Mirror an existing component's folder (`website/src/categories/components/badge/`). The set is:

- `<name>.md` — frontmatter card (title, description, `componentType`, `storybookCategory`, `eleventyNavigation`) + intro. Copy the structure; swap content.
- `usage.md`, `accessibility.md`, `specs.md`, `code.md` — each with the 11ty frontmatter (`title`, `tags`, `eleventyNavigation.parent`/`key`) and `<section>`-wrapped markdown body.

Keep prose grounded in the design and the component's real API — do not invent props or guidance the component doesn't have.

---

## Changeset

New components need a changeset. Create `.changeset/<random-slug>.md`:

```md
---
'@sl-design-system/<name>': minor
---

Added the new `<sl-<name>>` component.
```

---

## Naming summary

- Package: `@sl-design-system/<name>` (kebab, singular)
- Element: `<sl-<name>>` — always `sl-` prefixed
- Class: PascalCase (`TextField`)
- Events: `sl-`-prefixed, dasherized (`sl-value-change`)
- American English everywhere.
