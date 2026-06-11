# SLDS Component Conventions

The shared spec every `/implement-design` generation agent reads before writing code. It encodes how this monorepo actually structures a component package, derived from existing stable components (e.g. `packages/components/badge`). Follow it exactly — deviation produces code that won't build, lint, or render in Storybook.

When in doubt, open the nearest existing component of the same shape (a form control → `text-field`; a static indicator → `badge`; a container → `card`) and mirror it.

---

## Implementing a design — reproduce its content, don't over-abstract

When the task is to implement a specific Figma design (this whole pipeline — and especially example / page components), the result must **render the design's actual content**: the real breadcrumb labels, titles, list items, roster, etc. The target is a story that renders the design _and its content_ with little or no configuration — ideally just `<sl-your-component></sl-your-component>`. A reviewer should open the story and see the Figma design, not an empty shell that needs args.

Achieve that through **data ownership**, not by hardcoding content in every component:

- The **root / page component owns the data** — it obtains it (fetches from an endpoint / data-source; in an example, holds a realistic mock object with a comment noting where the fetch would go) and **passes the appropriate subset to each child**.
- **Pass a cohesive "model" object, not a long list of scalar properties.** A child that renders several related fields takes **one typed object input** (e.g. `header.model = { breadcrumbs, heading, subheading, status }`), not four separate `@property`s. That's how real apps pass data — a child receives the slice of the domain model it's responsible for, as a single object. Define an exported interface for each such model. Only split into individual properties when a value is genuinely independent (e.g. a single boolean `open` flag unrelated to the data).
- **The model is _domain data_ — values and stable keys only. Keep two things OUT of it:**
  - **Translated/UI strings.** Don't bake localized labels into the model. The model carries data and **stable keys** (`status: 'present'`, `toolId: 'groups'`); each component localizes its own visible strings **in its `render` via `msg()`, keyed off those values** (e.g. `msg('Present', { id: 'x.present' })` chosen by the `status` key). So translation lives in the component that displays it, not in the data owner. (Genuinely per-record text that the data source provides — a person's name, a free-text title — is data and is rendered directly, not `msg()`’d.)
  - **Structural / presentation config.** Things like the set of table columns (their order, abbreviations, icons), a fixed set of tabs, or option lists are **structure, not data** — define them as constants **inside the component** that renders them, not as model fields the parent passes in. The model says _which student has which status_; the component knows _what the status columns are_.
- **Child components are presentational** — they take their model (data) via input and render it, localizing their own labels; they do not fetch their own data and the story does not fill them in (the root does).
- So a header that shows breadcrumbs + a title + a status receives a single `model` object **from the page** and renders it — it is fed by the data owner, not by the story, and not via consumer slots. Repeated rows are mapped from an array on the model.
- Reserve **slots** for genuinely arbitrary consumer content, never for the design's own data. A genuinely app-global feature list that isn't part of the fetched record may stay with the component that renders it — but call that out.

## Output location & package layout

**The layout depends on where the run generates code** (the orchestrator asks). The two shapes:

- **Published design-system package** → `packages/components/<name>/` (kebab-case, singular): a full package with `package.json`, `register.ts`, `src/`, Vitest spec, website docs, and a changeset.
- **App / example path** (e.g. `examples/<root>/`): a lightweight, co-located set — the component(s) + a story, nested folders for children, one `index.ts`/`tsconfig.json` for the example, and **no** `package.json` / `register.ts` / website docs / changeset (the example is part of an existing private package). Mirror a neighbour under `examples/`.

Hand-authored files for a **published package**:

```
packages/components/<name>/
├── package.json
├── tsconfig.json
├── index.ts                 # re-exports the public API
├── register.ts              # defines the custom element
└── src/
    ├── <name>.ts            # the LitElement class
    ├── <name>.css           # styles (imported with { type: 'css' } — no build step)
    ├── <name>.spec.ts       # Vitest browser tests
    └── <name>.stories.ts    # Storybook stories (authored during implementation, see below)
```

For an **example**, drop `package.json`/`register.ts`/`src/`-nesting to taste and match the sibling examples; the `.ts` + `.css` + `.stories.ts` co-locate in the component's folder.

Everything else (`*.js`, `*.d.ts`, `custom-elements.json`, `CHANGELOG.md`) is **generated** — never hand-write it. **Styles are plain `.css` now (not `.scss`) and are imported directly via an import attribute — there is no `.scss.ts`/`build-styles` step.**

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
import styles from './<name>.css' with { type: 'css' };

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

- **Import styles from the plain `./<name>.css` with an import attribute**: `import styles from './<name>.css' with { type: 'css' };`. This yields a `CSSStyleSheet` (typed via the repo's `*.css` module declaration in `vite-env.d.ts`); assign it directly to `static styles`. There is **no `.scss` and no `build-styles` step** — Storybook/Vite and the example `tsdown` build both transform the `{ type: 'css' }` import into a constructable stylesheet, and edits to the `.css` **hot-reload automatically** (no dev-server restart).
- Properties that drive a CSS selector (`:host([size='lg'])`) must be `{ reflect: true }`.
- Variant/enum properties use exported string-union types, never raw `string`.
- JSDoc every public property. Style per CONTRIBUTING.md: "The `x` of the `component`." for options, "Whether the `component` is `x`." for boolean states. End with a period. Add `@default <value>` (no `@default` for booleans defaulting to false).
- Slots are documented with `@slot <name> - Description` in the class-level JSDoc block, above the class.
- **Events: declare them with the `@event` decorator + `EventEmitter` from `@sl-design-system/shared` — never hand-roll `new CustomEvent(...)` + `this.dispatchEvent(...)`.** This is the SLDS standard (see `tabs`, `tree`, `form`, `date-field`). The pattern:
  - Define the event type as an exported `CustomEvent` alias: `export type SlSaveEvent = CustomEvent<{ value: FormShape }>;` (use `CustomEvent<void>` when there's no detail).
  - Declare it in `GlobalEventHandlersEventMap` inside the file's `declare global` block so `addEventListener('sl-save', ...)` is typed.
  - Add an emitter field: `@event({ name: 'sl-save' }) saveEvent!: EventEmitter<SlSaveEvent>;` (the `name` is the `sl-`-prefixed dasherized event name).
  - Emit by calling `this.saveEvent.emit(detail)` (or `this.saveEvent.emit()` for a void detail). `EventEmitter.emit` already defaults to `{ bubbles: true, composed: true }`, so don't pass those manually.
  - Still document each event with `@fires <name> - …` in the class JSDoc.

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
- **For a list, be conservative: a plain `<ul>`/`<li>` (or the right semantic list) + CSS is usually enough — don't make a component per row.** Map the data array straight to `<li>`s in the parent and style them; reach for a dedicated `<sl-foo-row>` child **only** when the row has genuine internal complexity (its own interactive state, multiple event-wired controls, or real reuse elsewhere). A row that's just icon + text + link/avatar is an `<li>`, not a component. Likewise, don't wrap list items in extra `<div>`s when an `<li>` styled with CSS does the job. Prefer the smaller tree.
- Only the **top-level / public-entry** component registers globally (a `register.ts` for an SLDS package; a guarded `customElements.define` for a standalone example). Its internal children never do.
- Light-DOM elements the consumer writes themselves — including slotted `@sl-design-system/*` components — still need the **global** registry, so import those `register.js` side-effects where the consumer markup lives (the story / app / example entry), never inside a scoped child.

Reference implementations: `examples/lit/src/composite-form` and `examples/lesson-detail-page`.

### Choosing an SLDS container for a "card"

A design "card" (a bordered, rounded surface with a heading and stacked content) is almost always an **`sl-panel`** — it has a `heading` property, a default content slot, and a stylable `::part(content)`. Reserve **`sl-card`** for its specific media/title/actions layout (image + title + body + actions slots); it does **not** fit a generic titled content section, so don't force it. There is **no `sl-divider`** — render a divider as a styled `<hr>` or a bottom border. Check the component's own `@slot`/`@csspart`/`@property` docs before assuming an API.

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

**Authoritative reference for the Lit localization API:** <https://lit.dev/docs/localization/overview/> — `@lit/localize` (`msg()`, `@localized()`, `str`, `configureLocalization`/`configureTransformLocalization`, runtime vs. transform mode) and the `lit-localize` CLI (extraction → XLIFF, the `id`/source-string requirements). Read it before reaching for an unfamiliar part of the API.

- Import from `@lit/localize` and decorate the component class:

  ```ts
  import { localized, msg } from '@lit/localize';

  @localized()
  export class Foo extends LitElement {
    /* … */
  }
  ```

- Wrap **every** user-visible string in `msg()` with a stable, namespaced `id`, **in the `render` of the component that displays it**:
  ```ts
  html`<span>${msg('Show all', { id: 'sl.tabs.showAll' })}</span>`;
  ```
- **Localization belongs to the displaying component, not the data owner — never pass translated strings through a model.** A parent passes down **data + stable keys**; the child `msg()`’s its labels in `render`, choosing the string by the key. For an enum/key value, switch on it: e.g. a `status: 'present' | 'absent'` field maps to `{ present: msg('Present', { id: 'x.present' }), absent: msg('Absent', { id: 'x.absent' }) }[status]` inside the child. Every component that shows user-visible text carries `@localized()`. (Free-text the data source owns — names, titles — is data, rendered directly without `msg()`.)
- **`msg()` needs a LITERAL source string AND a literal `id` at the call site** — lit-localize extracts statically, so neither argument may be a variable or member expression. `msg(map[key].en, { id: map[key].id })` silently **fails to extract** (the string never reaches the locale files) — a bug invisible to type-check and to a literal-id grep. When the label depends on a data key, switch on the key and return a literal `msg()` per case (or a small set of literal-`msg()` thunks); keep only the non-string parts (icon names, etc.) in a map. Example:
  ```ts
  #label(status: Status): string {
    switch (status) {
      case 'present': return msg('Present', { id: 'x.present' });
      case 'absent':  return msg('Absent',  { id: 'x.absent' });
    }
  }
  ```
- The string passed to `msg()` is the **English source** (sourceLocale is `en`). If the design's original language isn't English, use the English source from the decomposer's Localized strings table; the original-language text is a _translation_ of the `nl` (etc.) locale, not the source in code. **A component built from a non-English design therefore renders English (the source) at runtime until the translated locale is built and loaded** — that's correct, not a bug.
- Ids are namespaced `<scope>.<component>.<key>` (e.g. `sl.tabs.showAll`). Keep them stable — they key the translations.
- Translations are extracted with `yarn extract-i18n` (lit-localize) into the xliff files under `packages/locales`; you don't hand-write locale bundles.
- When i18n is **off** for the run, render the design's text directly (no `msg()`), as the rest of this doc describes.
- **In an example built from a non-English design, write the MOCK DATA values in the source locale (English) too** — not the design's original language. The chrome localizes to the English source, so Dutch (etc.) mock values for dates, places, names, free-text bodies would leave the rendered example mixing languages (English chrome + foreign data). Translate the mock data to English so the example reads consistently; the original-language wording belongs only in the translated locale bundle, not in the component's mock data.

## Styles (`<name>.css`)

Plain CSS — **not SCSS**. Imported with `import styles from './<name>.css' with { type: 'css' };` (no build step; native CSS nesting is fine if you want it).

- Style the host with `:host` and state with attribute selectors: `:host([size='lg'])`, `:host([disabled])`.
- **Every visual value comes from a design token.** Colors → `var(--sl-color-*)`. Spacing/sizing/radius → `var(--sl-size-*)`. Typography → `var(--sl-text-*)` / `var(--sl-font-*)`. Never hard-code a hex, px, or rem that a token exists for. Use the exact token names quoted in the design manifest's Token Reference.
- **A `--sl-text-new-*` token is a `font:` _shorthand_ — it RESETS `font-weight` (and the other `font` longhands) to `normal`.** So `font: var(--sl-text-new-heading-sm)` renders at weight 400 even though the heading should be semibold/bold. For any non-regular text, **add an explicit `font-weight: var(--sl-fontWeight-600)` (semibold) or `var(--sl-fontWeight-700)` (bold) after the shorthand**. This has bitten multiple runs (un-bold headings, badge numbers) — set the weight whenever the design text isn't regular.
- **No `var()` fallback values.** Write `var(--sl-color-foreground-plain)`, never `var(--sl-color-foreground-plain, #121721)`. The token must exist; if you can't find the right one, that's a flag to raise (note it in your report), not a hex to fall back to.
- **Always use light-mode color tokens — even when the design is dark mode.** Pick the semantic token by its _role_ (page background, foreground, subtle text, accent…) from the light theme. Do **not** hard-code dark colors or reach for dark-variant tokens to match a dark mock-up. Theme switching (Storybook, and the app) remaps those same semantic tokens to dark automatically, so a correctly-tokenized light-mode component renders correctly in dark mode for free. (This is why a dark design that surfaces only raw hex should map to semantic light tokens, not to the dark hex.)
- **Don't set `display` (e.g. `:host { display: block }`) unless it intentionally changes the component's default rendering** — and when it does, say why in a comment. Don't add it as reflexive boilerplate.
- **Private custom properties (`--_x`) only when the value is reused** — i.e. set in one place and read in several, or varied across variant selectors. If a value is used exactly once, write it inline; don't introduce a single-use `--_x`.
- **Prefer styling a component's exposed `::part()` over adding wrapper elements.** Don't wrap slotted content in an extra `<div class="grid">` just to lay it out — style the host component's part instead, keeping the markup clean. E.g. to grid the fields inside an `<sl-panel>`, write `sl-panel::part(content) { display: grid; … }` rather than wrapping them in a `<div>`. This works for slotted children because the default `<slot>` is `display: contents`, so the slotted elements become grid/flex items of the part. For per-instance layout, combine a host class with the part: `sl-panel.general::part(content) { … }`. (Check the component's `@csspart` docs for the available parts.)
- Style slotted children with `::slotted(...)`.
- Logical properties throughout (`padding-inline`, `block-size`, `inline-size`, `margin-block-start`) — never `width`/`height`/`left`/`top`.

### Finding the right token

Don't guess token names from memory — the namespaces have real gotchas. Resolve them against the catalog:

- **Where they live**: the design tokens resolve in the theme files at `packages/themes/<theme>/light.css` (every `--sl-*` custom property is declared there), and the source definitions are under `packages/tokens/src/`. The manifest's Token Reference (built from the design's `get_variable_defs`) is your first source; confirm each name exists by grepping a `light.css`.
- **Namespace gotcha**: typography lives under **`--sl-text-new-*`** (e.g. `--sl-text-new-body-md`) as well as the older `--sl-text-*` — there is generally **no `--sl-text-typeset-*`** custom property even though the Figma variable path may read `text-new/typeset/...`. Color/size/foreground roles are `--sl-color-*` / `--sl-size-*`. Grep before you commit a name.
- **camelCase suffix gotcha**: token name segments are **camelCase**, not kebab — e.g. `--sl-color-foreground-primary-onBold` (not `-on-bold` or `-on`), `--sl-size-borderRadius-full`, `--sl-fontWeight-700`. When verifying a token exists, grep the **full name followed by `:`** (its declaration) — `grep -F -- '--sl-color-foreground-primary-onBold:' light.css`. A loose/prefix grep silently "passes" a truncated wrong name (`--sl-color-foreground-primary-on` looks fine but doesn't exist).
- **No exact match?** Pick the nearest semantic token by role and **note the gap in your report** (e.g. "design heading is 28px; nearest is `--sl-text-new-heading-xl` ≈ 32px"). Never invent a token name and never hardcode the raw value as a fallback.

### No build step

The class imports `./<name>.css` directly via the `{ type: 'css' }` attribute. There is **nothing to compile** — no `.scss`, no `.scss.ts`, no `build-styles.js`. Storybook/Vite and the example `tsdown` build read the `.css` at import time, and changes **hot-reload automatically** in the running dev server (no restart needed).

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

## Stories (`<name>.stories.ts`)

**A basic story is authored during implementation (Stage 3), before visual validation** — the visual-validator needs a rendered story to diff against, and `.css`/Lit HMR means iterating on it requires no dev-server restart. Stage 5 then adds variant stories (one per significant state) alongside tests/docs. For a **page** component, the basic story renders the root with no args (`<sl-...-page></sl-...-page>`) and sets `parameters: { layout: 'fullscreen' }`.

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

## Tests / docs / changeset apply per output location

The sections above (Vitest spec, website docs, changeset) are for a **published `packages/components/*` package**. When the run generates into an **app/example path** (e.g. `examples/`), Stage 5 is scoped to what that location actually uses — typically just the component + a fleshed-out story — and **skips** `package.json`, website docs, and the changeset, because the code lives inside an existing private package, not a new published one. Match what the neighbouring code in that location does rather than forcing the published-package set.

## Changeset

New **published-package** components need a changeset (skip for examples/apps). Create `.changeset/<random-slug>.md`:

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
