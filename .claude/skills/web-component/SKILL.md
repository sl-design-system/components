---
name: web-component
description: Scaffold a new web component for the SL Design System with all required files following established patterns.
---

# Create a new component: $ARGUMENTS

You are scaffolding a new web component for the SL Design System. Follow the established patterns exactly.

## Step 1: Parse the arguments

The argument is the component name in kebab-case (e.g., `color-picker`). Derive:

- **kebab-name**: as given (e.g., `color-picker`)
- **PascalName**: PascalCase (e.g., `ColorPicker`)
- **tag**: `sl-<kebab-name>` (e.g., `sl-color-picker`)
- **package**: `@sl-design-system/<kebab-name>`
- **dir**: `packages/components/<kebab-name>`

Ask the user:

1. A short description of the component (one sentence, used in JSDoc and package.json).
2. Which tier the component fits:
   - **Basic** — extends `LitElement` directly (like badge)
   - **With scoped elements** — uses `ScopedElementsMixin` for inner SL components (like avatar, dialog)
   - **Form control** — uses `FormControlMixin` (like checkbox, select)
3. If "with scoped elements" or "form control": which inner SL components it needs (e.g., `icon`, `button`).
4. If "form control": whether it also needs scoped elements.
5. Whether the component needs localization (`@lit/localize` for `msg()` calls).

## Step 2: Create the files

Create all files below. Do NOT create `.scss`, `.scss.ts`, `.stories.ts`, or `.spec.ts` files — those are handled by separate skills.

---

### `<dir>/package.json`

```json
{
  "name": "<package>",
  "version": "0.0.1",
  "description": "<Description> component for the SL Design System",
  "license": "Apache-2.0",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/sl-design-system/components.git",
    "directory": "<dir>"
  },
  "homepage": "https://sanomalearning.design/components/<kebab-name>",
  "bugs": {
    "url": "https://github.com/sl-design-system/components/issues"
  },
  "type": "module",
  "main": "./index.js",
  "module": "./index.js",
  "types": "./index.d.ts",
  "customElements": "custom-elements.json",
  "exports": {
    ".": "./index.js",
    "./package.json": "./package.json",
    "./register.js": "./register.js"
  },
  "files": ["**/*.d.ts", "**/*.js", "**/*.js.map", "custom-elements.json"],
  "sideEffects": ["register.js"],
  "scripts": {
    "test": "echo \"Error: run tests from monorepo root.\" && exit 1"
  }
}
```

**Dependencies by tier:**

- **Basic** (no dependencies section):

  ```json
  "devDependencies": {
    "lit": "^3.3.2"
  },
  "peerDependencies": {
    "lit": "^3.1.4"
  }
  ```

- **With scoped elements** — add each inner SL component as a `dependency`, plus:

  ```json
  "dependencies": {
    "@sl-design-system/shared": "^0.11.0",
    "@sl-design-system/<inner>": "^<latest>"
  },
  "devDependencies": {
    "@open-wc/scoped-elements": "^3.0.6",
    "lit": "^3.3.2"
  },
  "peerDependencies": {
    "@open-wc/scoped-elements": "^3.0.6",
    "lit": "^3.1.4"
  }
  ```

- **Form control** — add form + shared as dependencies:

  ```json
  "dependencies": {
    "@sl-design-system/form": "^<latest>",
    "@sl-design-system/shared": "^0.11.0"
  },
  "devDependencies": {
    "lit": "^3.3.2"
  },
  "peerDependencies": {
    "lit": "^3.1.4"
  }
  ```

- **With localization** — add to dev + peer (merge with existing):
  ```json
  "devDependencies": {
    "@lit/localize": "^0.12.2"
  },
  "peerDependencies": {
    "@lit/localize": "^0.12.1"
  }
  ```

Look up the actual latest versions of any `@sl-design-system/*` dependencies from the packages in the monorepo.

---

### `<dir>/tsconfig.json`

```json
{
  "extends": "../../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "rootDir": "./"
  },
  "include": ["index.ts", "register.ts", "src/**/*.ts"]
}
```

---

### `<dir>/index.ts`

```ts
export * from './src/<kebab-name>.js';
```

---

### `<dir>/register.ts`

```ts
import { <PascalName> } from './src/<kebab-name>.js';

customElements.define('sl-<kebab-name>', <PascalName>);
```

---

### `<dir>/src/<kebab-name>.ts`

Follow the exact structure below. The member ordering within the class MUST be:

1. Static members (`styles`, `formAssociated`, `scopedElements`, `shadowRootOptions`)
2. Private `#` fields (controllers, observers, internal state)
3. Public fields
4. Event emitters (`@event`)
5. Properties with `@property` decorator (alphabetical)
6. Properties with `@state` decorator
7. `@query` / `@queryAssignedElements`
8. Getters/setters
9. Lifecycle methods: `connectedCallback`, `disconnectedCallback`, `firstUpdated`, `willUpdate`, `updated`, `render`
10. Public methods
11. Private event handlers (`#onFoo`) — alphabetical
12. Private utility methods

#### Tier: Basic

````ts
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './<kebab-name>.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    '<tag>': <PascalName>;
  }
}

/**
 * <Description>.
 *
 * ```html
 * <<tag>></<tag>>
 * ```
 *
 * @slot default - The default slot.
 */
export class <PascalName> extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
````

#### Tier: With scoped elements

Additional imports:

```ts
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { <InnerComponent> } from '@sl-design-system/<inner>/src/<inner>.js';
```

Class declaration:

```ts
export class <PascalName> extends ScopedElementsMixin(LitElement) {
```

Add static scopedElements getter after styles:

```ts
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-<inner>': <InnerComponent>
    };
  }
```

#### Tier: Form control

Additional imports:

```ts
import { FormControlMixin } from '@sl-design-system/form';
import { type EventEmitter, EventsController, event } from '@sl-design-system/shared';
import { type SlBlurEvent, type SlChangeEvent, type SlFocusEvent } from '@sl-design-system/shared/events.js';
```

Class declaration (without scoped elements):

```ts
export class <PascalName><T = any> extends FormControlMixin(LitElement) {
```

Class declaration (with scoped elements):

```ts
export class <PascalName><T = any> extends FormControlMixin(ScopedElementsMixin(LitElement)) {
```

Add after styles:

```ts
  /** @internal */
  static formAssociated = true;
```

Add event emitters:

```ts
  /** @internal Emits when the component loses focus. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

  /** @internal Emits when the value changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<T | null>>;

  /** @internal Emits when the component receives focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;
```

#### With localization

Add `@localized()` decorator above the class declaration and import:

```ts
import { localized, msg } from '@lit/localize';

@localized()
export class ...
```

### General conventions

- Use `@property({ reflect: true })` for properties that should appear as HTML attributes and be usable in CSS selectors.
- Use `?` for optional properties without defaults; assign a value for required properties with defaults.
- Boolean properties: `@property({ type: Boolean, reflect: true })`.
- Multi-word attributes use kebab-case: `@property({ attribute: 'display-name' })`.
- Type aliases go before the class, after `declare global`: `export type <PascalName>Size = 'sm' | 'md' | 'lg';`
- Naming: `<PascalName><PropertyName>` (e.g., `ButtonSize`, `DialogRole`).
- Private fields use `#` prefix (not TypeScript `private`).
- Event handlers: `#onEventName` in PascalCase (e.g., `#onClick`, `#onKeydown`).
- Slot change handlers type: `Event & { target: HTMLSlotElement }`.
- Use `EventsController` for DOM event handling (it auto-adds/removes listeners):
  ```ts
  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, {
    click: this.#onClick
  });
  ```
- All lifecycle overrides call `super` — `super.connectedCallback()` first, `super.disconnectedCallback()` last.
- `render()` returns `TemplateResult`.
- JSDoc: use `/** @internal */` for non-public API members. Document `@slot`, `@csspart`, `@cssprop` on the class.

## Step 3: Install dependencies

Run `yarn` from the monorepo root to link the new package.

## Step 4: Summary

List the created files and remind the user they still need to create:

- `src/<kebab-name>.scss` (styles)
- `src/<kebab-name>.stories.ts` (Storybook stories)
- `src/<kebab-name>.spec.ts` (tests)
