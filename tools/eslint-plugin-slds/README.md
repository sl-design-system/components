# `@sl-design-system/eslint-plugin-slds`

ESLint plugin for SL Design System components.
It adds accessibility and template style rules for Lit templates and (for specific rules) raw HTML strings in TS/JS.

## Installation

```bash
npm install --save-dev @sl-design-system/eslint-plugin-slds
yarn add -D @sl-design-system/eslint-plugin-slds
```

## Usage

Use the recommended config (all plugin rules on `error`):

```js
import slds from '@sl-design-system/eslint-plugin-slds';

export default [slds.configs.recommended];
```

Or enable rules one by one:

```js
import slds from '@sl-design-system/eslint-plugin-slds';

export default [
  {
    plugins: { slds },
    rules: {
      'slds/text-field-has-label': 'error',
      'slds/multiline-html-template': 'error'
    }
  }
];
```

## Rules

### Accessibility rules

These rules make sure interactive SLDS controls have an accessible label.
Depending on the component, a label can come from:

- Text content in the component
- `aria-label` or `aria-labelledby`
- A labeled parent `<sl-form-field>`

Available rules:

- `slds/button-has-label`
- `slds/checkbox-has-label`
- `slds/checkbox-group-has-label`
- `slds/combobox-has-label`
- `slds/date-field-has-label`
- `slds/number-field-has-label`
- `slds/radio-has-label`
- `slds/radio-group-has-label`
- `slds/select-has-label`
- `slds/switch-has-label`
- `slds/text-area-has-label`
- `slds/text-field-has-label`
- `slds/time-field-has-label`

Notes:

- `slds/radio-has-label` requires child content as the label.
- `slds/button-has-label` also accepts `tooltip(..., { ariaRelation: 'label' })`.
- `slds/combobox-has-label` also checks raw HTML in `innerHTML` and `insertAdjacentHTML`.

Example:

```html
<!-- invalid -->
<sl-text-field></sl-text-field>

<!-- valid -->
<sl-text-field aria-label="Username"></sl-text-field>
<sl-form-field label="Username">
  <sl-text-field></sl-text-field>
</sl-form-field>
```

### Code-style rules

- `slds/multiline-html-template` (auto-fixable)
- `slds/singleline-html-template-trimmed` (auto-fixable)

Examples:

```js
// invalid
html`<div>
  <span>Hello</span>
</div>`;

// valid
html`
  <div>
    <span>Hello</span>
  </div>
`;
```

```js
// invalid
html` <span>Hello</span> `;

// valid
html`<span>Hello</span>`;
```

## How `sl-form-field` label detection works

`<sl-form-field>` is treated as labeled when any of these is present:

- `label` attribute: `<sl-form-field label="Name">`
- `.label` binding: `<sl-form-field .label=${label}>`
- Child with `slot="label"` and meaningful content
- Direct `<sl-label>` child with meaningful content

Nested Lit `html` templates keep the label context when rendered inside a labeled `<sl-form-field>`.
