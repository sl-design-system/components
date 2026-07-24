# `@sl-design-system/eslint-plugin-slds`

ESLint plugin for the SL Design System. It provides rules that enforce accessibility and code-style requirements specific to SLDS Lit web components.

## Installation

```bash
npm install --save-dev @sl-design-system/eslint-plugin-slds
# or
yarn add -D @sl-design-system/eslint-plugin-slds
```

## Usage

Use the `recommended` config to enable all rules at `error` level:

```js
// eslint.config.mjs
import slds from '@sl-design-system/eslint-plugin-slds';

export default [
  slds.configs.recommended
  // ... your other config
];
```

Or register the plugin and enable rules individually:

```js
import slds from '@sl-design-system/eslint-plugin-slds';

export default [
  {
    plugins: { slds },
    rules: {
      'slds/button-has-label': 'error',
      'slds/text-field-has-label': 'error'
      // ...
    }
  }
];
```

---

## Rules

### Accessibility rules

These rules check that interactive SLDS form controls always have an accessible label. A label can be provided via:

- `aria-label` attribute
- `aria-labelledby` attribute
- An enclosing `<sl-form-field>` element with a `label` / `.label` attribute, a child with `slot="label"`, or a direct `<sl-label>` child

Rules are aware of nested Lit `html\`...\``templates passed through interpolations — if a template is rendered inside a labeled`sl-form-field`, the label context is inherited automatically.

---

#### `slds/button-has-label`

Ensures `<sl-button>` elements have an accessible label.

**Accepted forms:**

- Text content: `<sl-button>Save</sl-button>`
- `aria-label`: `<sl-button aria-label="Close dialog"><sl-icon ...></sl-button>`
- The `tooltip` directive when `ariaRelation: 'label'` is set

**Invalid:**

```html
<sl-button><sl-icon name="close"></sl-icon></sl-button>
```

**Valid:**

```html
<sl-button>Save</sl-button>
<sl-button aria-label="Close dialog"><sl-icon name="close"></sl-icon></sl-button>
<sl-button ${tooltip('Close', { ariaRelation: 'label' })}><sl-icon name="close"></sl-icon></sl-button>
```

---

#### `slds/checkbox-has-label`

Ensures `<sl-checkbox>` elements have an accessible label.

**Accepted forms:**

- Text content as a child
- `aria-label` / `aria-labelledby` attribute
- Enclosed in a labeled `<sl-form-field>`

**Invalid:**

```html
<sl-checkbox></sl-checkbox> <sl-form-field><sl-checkbox></sl-checkbox></sl-form-field>
```

**Valid:**

```html
<sl-checkbox>Accept terms</sl-checkbox>
<sl-checkbox aria-label="Accept terms"></sl-checkbox>
<sl-form-field label="Terms"><sl-checkbox></sl-checkbox></sl-form-field>
```

---

#### `slds/checkbox-group-has-label`

Ensures `<sl-checkbox-group>` elements have an accessible label.

**Accepted forms:**

- `aria-label` / `aria-labelledby` attribute
- Enclosed in a labeled `<sl-form-field>`

**Invalid:**

```html
<sl-checkbox-group>...</sl-checkbox-group>
```

**Valid:**

```html
<sl-checkbox-group aria-label="Preferences">...</sl-checkbox-group>
<sl-form-field label="Preferences"><sl-checkbox-group>...</sl-checkbox-group></sl-form-field>
```

---

#### `slds/combobox-has-label`

Ensures `<sl-combobox>` elements have an accessible label. Also checks raw HTML strings in `element.innerHTML = ...` and `element.insertAdjacentHTML(...)` assignments.

**Accepted forms:**

- `aria-label` / `aria-labelledby` attribute
- Enclosed in a labeled `<sl-form-field>`

**Invalid:**

```html
<sl-combobox></sl-combobox>
```

```js
dialog.innerHTML = `<sl-combobox></sl-combobox>`;
```

**Valid:**

```html
<sl-combobox aria-label="Country"></sl-combobox>
<sl-form-field label="Country"><sl-combobox></sl-combobox></sl-form-field>
```

> **Note:** Template literals with expressions in `innerHTML`/`insertAdjacentHTML` are skipped (e.g. `` `<sl-combobox aria-label="${label}">` ``) since the dynamic value is treated as potentially labeled.

---

#### `slds/date-field-has-label`

Ensures `<sl-date-field>` elements have an accessible label.

**Accepted forms:**

- `aria-label` / `aria-labelledby` attribute
- Enclosed in a labeled `<sl-form-field>`

---

#### `slds/number-field-has-label`

Ensures `<sl-number-field>` elements have an accessible label.

**Accepted forms:**

- `aria-label` / `aria-labelledby` attribute
- Enclosed in a labeled `<sl-form-field>`

---

#### `slds/radio-has-label`

Ensures `<sl-radio>` elements have text content as an accessible label.

**Accepted forms:**

- Text content as a child (interpolated expressions count)

**Invalid:**

```html
<sl-radio value="yes"></sl-radio>
```

**Valid:**

```html
<sl-radio value="yes">Yes</sl-radio> <sl-radio value="yes">${label}</sl-radio>
```

---

#### `slds/radio-group-has-label`

Ensures `<sl-radio-group>` elements have an accessible label.

**Accepted forms:**

- `aria-label` / `aria-labelledby` attribute
- Enclosed in a labeled `<sl-form-field>`

---

#### `slds/select-has-label`

Ensures `<sl-select>` elements have an accessible label.

**Accepted forms:**

- `aria-label` / `aria-labelledby` attribute
- Enclosed in a labeled `<sl-form-field>`

---

#### `slds/switch-has-label`

Ensures `<sl-switch>` elements have an accessible label.

**Accepted forms:**

- Text content as a child
- `aria-label` / `aria-labelledby` attribute
- Enclosed in a labeled `<sl-form-field>`

---

#### `slds/text-area-has-label`

Ensures `<sl-textarea>` elements have an accessible label.

**Accepted forms:**

- `aria-label` / `aria-labelledby` attribute
- Enclosed in a labeled `<sl-form-field>`

---

#### `slds/text-field-has-label`

Ensures `<sl-text-field>` elements have an accessible label.

**Accepted forms:**

- `aria-label` / `aria-labelledby` attribute
- Enclosed in a labeled `<sl-form-field>`

**Invalid:**

```html
<sl-text-field></sl-text-field> <sl-form-field><sl-text-field></sl-text-field></sl-form-field>
```

**Valid:**

```html
<sl-text-field aria-label="Username"></sl-text-field>
<sl-form-field label="Username"><sl-text-field></sl-text-field></sl-form-field>
<sl-form-field .label="${label}"><sl-text-field></sl-text-field></sl-form-field>
<sl-form-field label="Username"> ${html`<sl-text-field></sl-text-field>`} </sl-form-field>
```

---

#### `slds/time-field-has-label`

Ensures `<sl-time-field>` elements have an accessible label.

**Accepted forms:**

- `aria-label` / `aria-labelledby` attribute
- Enclosed in a labeled `<sl-form-field>`

---

### Code-style rules

---

#### `slds/multiline-html-template`

🔧 _Auto-fixable_

Enforces that multiline `html\`...\`` tagged template literals have a newline immediately after the opening backtick and a newline immediately before the closing backtick. This is required so that Prettier formats the HTML content correctly.

**Invalid:**

```js
html`<div>
  <span>Hello</span>
</div>`;
```

**Valid:**

```js
html`
  <div>
    <span>Hello</span>
  </div>
`;
```

---

#### `slds/singleline-html-template-trimmed`

🔧 _Auto-fixable_

Enforces that single-line `html\`...\`` tagged template literals have no leading or trailing whitespace. Prettier sometimes collapses multiline templates into one line without trimming the surrounding spaces.

**Invalid:**

```js
html` <span>Hello</span> `;
```

**Valid:**

```js
html`<span>Hello</span>`;
html`${first} ${last}`; // spaces between expressions are fine
```

---

## How `sl-form-field` label detection works

A `<sl-form-field>` is considered labeled when **any** of the following is present:

| Pattern                                       | Example                           |
| --------------------------------------------- | --------------------------------- |
| `label` attribute                             | `<sl-form-field label="Name">`    |
| `.label` property binding                     | `<sl-form-field .label=${label}>` |
| Child with `slot="label"` and non-empty text  | `<div slot="label">Name</div>`    |
| Direct `<sl-label>` child with non-empty text | `<sl-label>Name</sl-label>`       |

Slotted elements that only contain an infotip (i.e. elements with a `slot` attribute) are not considered meaningful label content.

---

## Peer dependencies

| Package                  | Version   |
| ------------------------ | --------- |
| `eslint`                 | `^9.25.1` |
| `eslint-plugin-lit-a11y` | `^4.1.4`  |
