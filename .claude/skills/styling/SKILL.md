---
name: styling
description: Write or update SCSS styles and HTML template structure for SL Design System web components following established patterns and conventions.
---

# Write or update styles for: $ARGUMENTS

You are writing SCSS styles and/or updating the HTML template structure for the SL Design System, a Lit 3 web component library. Follow the established patterns exactly.

## Step 1: Understand the component

Read the component source file(s) and any existing SCSS to understand:

- All public properties that affect visual appearance (sizes, variants, colors, emphasis, fills)
- All interactive states (hover, active, focus, disabled, checked, selected, open)
- All form validation states (valid, invalid, show-validity)
- The shadow DOM structure (parts, slots, wrapper elements)
- How child components are composed (ScopedElementsMixin)

## Step 2: Write the SCSS file

The SCSS file goes at `packages/components/<name>/src/<name>.scss`. It compiles to a `.scss.ts` file via the build script and is imported as:

```typescript
import styles from './<name>.scss.js';
```

### Build pipeline

SCSS files are compiled via `scripts/build-styles.js`:

1. `sass.compileString()` with `loadPaths: ['node_modules']`
2. Stylelint auto-fix
3. Output wrapped in a Lit `css` tagged template literal → `<name>.scss.ts`

### SCSS features used

- **Nesting** (heavily used, SCSS/CSS native)
- **`//` comments** (stripped during compilation)
- **`calc()` with token arithmetic**
- **No `@use`, `@forward`, `@import`, `@mixin`, `@include`, or SCSS variables** — every file is self-contained

### Rule ordering

Follow this order strictly:

1. `:host` — default styles, CSS custom property defaults
2. `:host(...)` — variant/state overrides (sizes, colors, fills, disabled, focus, validation)
3. Internal element selectors — `[part='...']`, element selectors, class selectors
4. `::slotted(...)` selectors — styling for projected light DOM content
5. `@media` queries — typically `prefers-reduced-motion`
6. `@keyframes` — animation definitions

### `:host` block

Always start with `:host` defining the component's default display mode and private CSS custom properties:

```scss
:host {
  --_bg-color: var(--sl-color-background-secondary-bold);
  --_bg-mix-color: var(--sl-color-background-secondary-interactive-bold);
  --_bg-opacity: var(--sl-opacity-interactive-bold-idle);

  display: inline-flex;
  align-items: center;
  gap: var(--sl-size-100);
  // ...
}
```

Common display values: `inline-flex`, `flex`, `block`, `inline-grid`, `contents`.

### CSS custom properties (design tokens)

Three naming conventions:

**Public design tokens — `--sl-*` prefix** (from theme packages):

```scss
// Colors (semantic hierarchy)
var(--sl-color-background-primary-bold)
var(--sl-color-foreground-disabled)
var(--sl-color-border-focused)
var(--sl-color-border-negative-plain)

// Sizing (numeric scale)
var(--sl-size-025)    // 2px
var(--sl-size-050)    // 4px
var(--sl-size-100)    // 8px
var(--sl-size-200)    // 16px

// Other tokens
var(--sl-size-borderWidth-default)
var(--sl-size-borderWidth-focusRing)
var(--sl-size-borderRadius-default)
var(--sl-size-outlineOffset-default)
var(--sl-opacity-interactive-bold-idle)
var(--sl-elevation-shadow-overlay)
var(--sl-text-new-typeset-fontWeight-semiBold)
var(--sl-animation-button-duration)
var(--sl-animation-button-easing)
```

**Private/internal custom properties — `--_` prefix** (component-scoped):

```scss
:host {
  --_bg-color: var(--sl-color-background-secondary-bold);
}
:host([variant='primary']) {
  --_bg-color: var(--sl-color-background-primary-bold);
}
```

This pattern avoids repeating property declarations — only the custom property is reassigned in variants.

**Public component-level custom properties — `--sl-<component>-*`** (consumer API):

```scss
:host {
  --sl-spinner-size: var(--sl-size-200);
}
// Consumer can override: sl-spinner { --sl-spinner-size: 3rem; }
```

### The `color-mix()` pattern (interactive states)

This is the defining pattern for interactive backgrounds. Used in 26+ components:

```scss
:host {
  --_bg-color: var(--sl-color-background-secondary-bold);
  --_bg-mix-color: var(--sl-color-background-secondary-interactive-bold);
  --_bg-opacity: var(--sl-opacity-interactive-bold-idle);

  background: color-mix(in srgb, var(--_bg-color), var(--_bg-mix-color) calc(100% * var(--_bg-opacity)));
}

:host(:hover) {
  --_bg-opacity: var(--sl-opacity-interactive-bold-hover);
}

:host(:active) {
  --_bg-opacity: var(--sl-opacity-interactive-bold-active);
}
```

The three variables (`--_bg-color`, `--_bg-mix-color`, `--_bg-opacity`) are swapped across variants/states, keeping the actual `background` declaration in one place.

### Size handling

Use `:host([size='...'])` attribute selectors to override custom properties:

```scss
:host([size='sm']) {
  --sl-spinner-size: var(--sl-size-175);
  padding: calc(var(--sl-size-025) - var(--sl-size-borderWidth-action))
    calc(var(--sl-size-175) - var(--sl-size-borderWidth-action));
}

// Group sizes with :where for zero specificity when needed
:host(:where([size='lg'], [size='xl'], [size='2xl'])) {
  --_gap-inline: var(--sl-size-200);
}
```

### Variant/emphasis/color handling

```scss
// Variants
:host([variant='primary']) {
  --_bg-color: var(--sl-color-background-primary-bold);
  color: var(--sl-color-foreground-primary-bold);
}

// Fills (button-specific)
:host([fill='ghost']) {
  --_bg-color: transparent;
}
:host([fill='outline']) {
  --_bg-color: transparent;
}

// Emphasis
:host([emphasis='bold']) {
  --_background: var(--sl-color-background-accent-grey-bold);
  --_color: var(--sl-color-foreground-accent-grey-onBold);
}

// Color + emphasis compound
:host([color='blue'][emphasis='bold']) {
  --_background: var(--sl-color-background-accent-blue-bold);
}

// Use :where for zero-specificity compound selectors
:host([variant='primary']:where(:not([fill]), [fill='solid'])) {
  color: var(--sl-color-foreground-primary-onBold);
}
```

### Disabled state

Consistent pattern across all interactive components:

```scss
:host([disabled]) {
  pointer-events: none;
}

// Use :is() when supporting both disabled and aria-disabled
:host(:is([disabled], [aria-disabled='true'])) {
  color: var(--sl-color-foreground-disabled);
  cursor: default;
}

// Override backgrounds for solid fills
:host(:is([disabled], [aria-disabled='true']):where(:not([fill]), [fill='solid'])) {
  background: var(--sl-color-background-disabled);
}
```

Always use:

- `pointer-events: none`
- `var(--sl-color-foreground-disabled)` for text
- `var(--sl-color-background-disabled)` for backgrounds
- `var(--sl-color-border-disabled)` for borders

### Focus styling

```scss
:host {
  outline: transparent solid var(--sl-size-borderWidth-focusRing);
  outline-offset: var(--sl-size-outlineOffset-default);
}

:host(:focus-visible) {
  outline-color: var(--sl-color-border-focused);
}
```

For components where focus goes on an internal element:

```scss
[part='inner'] {
  outline: transparent solid var(--sl-size-borderWidth-focusRing);
  outline-offset: var(--sl-size-outlineOffset-default);
}
```

### Form validation states

```scss
:host([show-validity='invalid']) {
  --_bg-color: var(--sl-color-background-input-plain);
  --_bg-mix-color: var(--sl-color-background-negative-interactive-plain);
  border-color: var(--sl-color-border-negative-plain);
}

:host([show-validity='valid']) {
  --_bg-color: var(--sl-color-background-input-plain);
  --_bg-mix-color: var(--sl-color-background-positive-interactive-plain);
  border-color: var(--sl-color-border-positive-plain);
}
```

### CSS `:state()` pseudo-class

For custom states set via `ElementInternals.states`:

```scss
:host(:state(clear-focused)) {
  outline-color: transparent;
}

:host(:state(clearable):state(has-selection)) {
  .wrapper {
    padding-inline-end: calc(1lh + (var(--sl-size-100) - var(--sl-size-borderWidth-default)) * 2);
  }
}
```

### `::slotted()` selectors

Style projected light DOM content:

```scss
::slotted(sl-icon) {
  --sl-icon-size: var(--sl-size-new-icon-2xs);
}

// With named slots
slot[name='media']::slotted(*) {
  block-size: 100%;
  object-fit: cover;
}

// Nested inside :host variants
:host([size='lg']) {
  ::slotted(sl-icon) {
    --sl-icon-size: var(--sl-size-new-icon-xs);
  }
}

// Complex selectors
slot:not([name])::slotted(:is(sl-checkbox, sl-switch[reverse])) {
  align-self: start;
}
```

### `::part()` selectors

Used sparingly for styling child component parts from a parent:

```scss
sl-menu-button {
  &::part(button) {
    flex: 1;
  }
  &::part(menu) {
    max-inline-size: min(80vw, 50%);
  }
}
```

### `[part='...']` selectors

Used heavily for styling named shadow DOM elements:

```scss
[part='track'] {
  background: var(--_bg-color);
  border: var(--sl-size-borderWidth-default) solid var(--_border-color);
  border-radius: var(--sl-size-borderRadius-pill);
}

// Nested inside :host variants
:host([checked]) {
  [part='track'] {
    border-color: var(--sl-color-border-selected);
  }
}
```

### Transitions and animations

**Always gate transitions with `prefers-reduced-motion`:**

```scss
@media (prefers-reduced-motion: no-preference) {
  :host(:where(:active, :focus-visible, :hover)) {
    transition-duration: var(--sl-animation-button-duration);
    transition-property: background, border-color, color, outline-color;
    transition-timing-function: var(--sl-animation-button-easing);
  }
}
```

**Popover/dialog entry animations using `@starting-style`:**

```scss
:host(:where(:popover-open, .\\:popover-open)) {
  // stylelint-disable-next-line scss/at-rule-no-unknown
  @starting-style {
    display: block;
    opacity: 0;
  }
  opacity: 1;
}
```

**`transition-behavior: allow-discrete` for display transitions:**

```scss
@media (prefers-reduced-motion: no-preference) {
  transition: 0.2s cubic-bezier(0.25, 0, 0.3, 1);
  transition-behavior: allow-discrete;
  transition-property: display, opacity, overlay;
}
```

**Keyframe animations:**

```scss
@keyframes content-expand {
  0% {
    grid-template-rows: 0fr;
  }
  100% {
    grid-template-rows: 1fr;
  }
}
```

### Logical properties

Always use logical CSS properties instead of physical ones:

- `block-size` / `inline-size` (not `height` / `width`)
- `inset-block-start` / `inset-inline-end` (not `top` / `right`)
- `padding-block` / `padding-inline` (not `padding-top` / `padding-left`)
- `margin-block-start` / `margin-inline-end` (not `margin-top` / `margin-right`)
- `border-block-end` / `border-inline-start` (not `border-bottom` / `border-left`)

### `@supports` feature detection

Use for progressive enhancement:

```scss
@supports not selector(:popover-open) {
  background: var(--_background) !important;
  position: fixed;
}

@supports (text-box: trim-both) {
  margin-block-start: round(up, 1ex - 1cap, 1px);
}
```

### Stylelint disable comments

Use when needed for valid overrides:

```scss
// stylelint-disable-next-line color-no-hex
--_drop-target-outline: 2px solid #056dc2;

// stylelint-disable-next-line selector-class-pattern
:host(:where(:popover-open, .\\:popover-open)) { ... }

// stylelint-disable-next-line scss/at-rule-no-unknown
@starting-style { ... }
```

## Step 3: HTML template conventions

When updating the component's `render()` method, follow these patterns.

### Shadow DOM structure

Use `part="..."` attributes on structural elements for external styling hooks:

```typescript
override render(): TemplateResult {
  return html`
    <div part="header">
      <slot name="title"></slot>
    </div>
    <div part="body">
      <slot></slot>
    </div>
    <div part="footer">
      <slot name="actions"></slot>
    </div>
  `;
}
```

### Slots

- **Default slot**: `<slot></slot>` or `<slot @slotchange=${this.#onSlotChange}></slot>`
- **Named slots**: `<slot name="icon"></slot>`, `<slot name="actions"></slot>`
- Always listen for `@slotchange` when the component needs to react to slot content changes

### Conditional rendering

Use ternary with `nothing` (never `if` directives):

```typescript
${this.closable
  ? html`<sl-button @click=${this.#onClose} fill="ghost" variant="default">
      <sl-icon name="xmark"></sl-icon>
    </sl-button>`
  : nothing}
```

Use ternary between two templates when switching structures:

```typescript
${this.href
  ? html`<a href=${this.href} part="wrapper">${this.renderContent()}</a>`
  : html`<div part="wrapper">${this.renderContent()}</div>`}
```

### Attribute/property bindings

```typescript
// Attribute with ifDefined (optional string/enum)
size=${ifDefined(this.size)}

// Property binding (complex objects, arrays)
.items=${this.items}

// Boolean binding
?disabled=${this.disabled}

// ARIA attributes
aria-expanded=${this.open ? 'true' : 'false'}
aria-labelledby="title"
```

### Decomposed render methods

For complex components, break render into sub-methods for extensibility:

```typescript
override render(): TemplateResult {
  return html`
    <dialog part="dialog" aria-labelledby="title">
      ${this.renderHeader()}
      ${this.renderBody()}
      ${this.renderFooter()}
    </dialog>
  `;
}

renderHeader(): TemplateResult { ... }
renderBody(): TemplateResult { ... }
renderFooter(): TemplateResult { ... }
```

### Inline SVG

Use the `svg` tagged template literal for inline SVG content:

```typescript
import { type TemplateResult, html, svg } from 'lit';

svg`<path d="M4.1,12.7 9,17.6 20.3,6.3"></path>`;
```

### Native platform features

Prefer native HTML elements and APIs:

- `<dialog>` for modals/drawers (with `showModal()` / `close()`)
- `<details>` / `<summary>` for accordions
- Popover API (`popover` attribute, `showPopover()` / `hidePopover()`) for overlays
- `ElementInternals` for form participation and custom states

### Light DOM input pattern

For form controls, create a native `<input>` in the light DOM and slot it:

```typescript
connectedCallback(): void {
  super.connectedCallback();

  this.input = this.querySelector('input[slot="input"]') || document.createElement('input');
  this.input.slot = 'input';
  if (!this.input.parentElement) {
    this.append(this.input);
  }
}
```

## Things to AVOID

- Do NOT use physical CSS properties (`width`, `height`, `top`, `left`, `margin-top`, etc.) — use logical properties
- Do NOT use `@use`, `@forward`, `@import`, `@mixin`, `@include`, or SCSS variables
- Do NOT add transitions without gating them with `@media (prefers-reduced-motion: no-preference)`
- Do NOT use hex colors directly — use design tokens (`var(--sl-color-...)`)
- Do NOT use classes for structural shadow DOM elements — use `[part='...']`
- Do NOT use `!important` unless for feature-detection fallbacks
- Do NOT use `@container` queries (not used in this codebase)

## Step 4: Build and verify

After writing the SCSS, build to generate the `.scss.ts` file:

```bash
node scripts/build-styles.js packages/components/<name>/src/<name>.scss
```

Then start Storybook to verify the visual result:

```bash
yarn start --watch
```
