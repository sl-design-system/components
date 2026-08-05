---
title: ESLint plugin
description: An ESLint plugin that helps you write accessible and consistent code with SLDS components.
layout: "categories/getting-started.njk"
eleventyNavigation:
  parent: Utilities
  key: ESLint plugin
---

<section>

## Overview

`@sl-design-system/eslint-plugin-slds` adds ESLint rules for SLDS components in Lit templates and in raw HTML strings inside TS/JS code.

The plugin ships two categories of rules:

- **Accessibility rules** — make sure interactive form controls always have a label.
- **Code-style rules** — keep Lit template formatting consistent.

All rules are included in the `recommended` config and are set to `error`.

</section>

<section>

<ds-install-info package="eslint-plugin-slds"></ds-install-info>

</section>

<section>

## Setup

Add the plugin to your ESLint flat config and use the `recommended` preset:

```js
// eslint.config.mjs
import slds from '@sl-design-system/eslint-plugin-slds';

export default [
  slds.configs.recommended,
  // ... your other config
];
```

Or register the plugin and enable only the rules you want:

```js
// eslint.config.mjs
import slds from '@sl-design-system/eslint-plugin-slds';

export default [
  {
    plugins: { slds },
    rules: {
      'slds/button-has-label': 'error',
      'slds/text-field-has-label': 'error',
      // ...
    }
  }
];
```

</section>

<section>

## Accessibility rules

These rules check that SLDS form controls always have a label. A label can come from:

- an `aria-label` attribute,
- an `aria-labelledby` attribute,
- a surrounding `<sl-form-field>` with a label (see [How form-field label detection works](#how-form-field-label-detection-works)).

### `slds/button-has-label`

Ensures `<sl-button>` elements have an accessible label.

Accepted forms:
- text content: `<sl-button>Save</sl-button>`
- `aria-label` attribute
- the `tooltip` directive when `ariaRelation: 'label'` is set

```html
<!-- valid -->
<sl-button>Save</sl-button>
<sl-button aria-label="Close dialog"><sl-icon name="close"></sl-icon></sl-button>
<sl-button ${tooltip('Delete', { ariaRelation: 'label' })}><sl-icon name="trash"></sl-icon></sl-button>

<!-- invalid -->
<sl-button><sl-icon name="close"></sl-icon></sl-button>
```

### `slds/checkbox-has-label`

Ensures `<sl-checkbox>` elements have an accessible label.

Accepted forms: text content, `aria-label` / `aria-labelledby`, or enclosed in a labeled `<sl-form-field>`.

```html
<!-- valid -->
<sl-checkbox>Accept terms</sl-checkbox>
<sl-form-field label="Terms"><sl-checkbox></sl-checkbox></sl-form-field>

<!-- invalid -->
<sl-checkbox></sl-checkbox>
```

### `slds/checkbox-group-has-label`

Ensures `<sl-checkbox-group>` elements have an accessible label.

Accepted forms: `aria-label` / `aria-labelledby`, or enclosed in a labeled `<sl-form-field>`.

```html
<!-- valid -->
<sl-checkbox-group aria-label="Preferences">...</sl-checkbox-group>
<sl-form-field label="Preferences"><sl-checkbox-group>...</sl-checkbox-group></sl-form-field>

<!-- invalid -->
<sl-checkbox-group>...</sl-checkbox-group>
```

### `slds/combobox-has-label`

Ensures `<sl-combobox>` elements have an accessible label. It checks both Lit templates and raw HTML assigned to `element.innerHTML` and `element.insertAdjacentHTML()`.

Accepted forms: `aria-label` / `aria-labelledby`, or enclosed in a labeled `<sl-form-field>`.

> **Note:** Template literals with expressions (for example `` `<sl-combobox aria-label="${label}">` ``) are skipped in the raw HTML check because the label value is dynamic.

```html
<!-- valid -->
<sl-combobox aria-label="Country"></sl-combobox>
<sl-form-field label="Country"><sl-combobox></sl-combobox></sl-form-field>

<!-- invalid -->
<sl-combobox></sl-combobox>
```

### `slds/date-field-has-label`

Ensures `<sl-date-field>` elements have an accessible label.

Accepted forms: `aria-label` / `aria-labelledby`, or enclosed in a labeled `<sl-form-field>`.

### `slds/number-field-has-label`

Ensures `<sl-number-field>` elements have an accessible label.

Accepted forms: `aria-label` / `aria-labelledby`, or enclosed in a labeled `<sl-form-field>`.

### `slds/radio-has-label`

Ensures `<sl-radio>` elements have text content as their label.

```html
<!-- valid -->
<sl-radio value="yes">Yes</sl-radio>
<sl-radio value="yes">${label}</sl-radio>

<!-- invalid -->
<sl-radio value="yes"></sl-radio>
```

### `slds/radio-group-has-label`

Ensures `<sl-radio-group>` elements have an accessible label.

Accepted forms: `aria-label` / `aria-labelledby`, or enclosed in a labeled `<sl-form-field>`.

### `slds/select-has-label`

Ensures `<sl-select>` elements have an accessible label.

Accepted forms: `aria-label` / `aria-labelledby`, or enclosed in a labeled `<sl-form-field>`.

### `slds/switch-has-label`

Ensures `<sl-switch>` elements have an accessible label.

Accepted forms: text content, `aria-label` / `aria-labelledby`, or enclosed in a labeled `<sl-form-field>`.

### `slds/text-area-has-label`

Ensures `<sl-textarea>` elements have an accessible label.

Accepted forms: `aria-label` / `aria-labelledby`, or enclosed in a labeled `<sl-form-field>`.

### `slds/text-field-has-label`

Ensures `<sl-text-field>` elements have an accessible label.

Accepted forms: `aria-label` / `aria-labelledby`, or enclosed in a labeled `<sl-form-field>`.

```html
<!-- valid -->
<sl-text-field aria-label="Username"></sl-text-field>
<sl-form-field label="Username"><sl-text-field></sl-text-field></sl-form-field>

<!-- invalid -->
<sl-text-field></sl-text-field>
<sl-form-field><sl-text-field></sl-text-field></sl-form-field>
```

### `slds/time-field-has-label`

Ensures `<sl-time-field>` elements have an accessible label.

Accepted forms: `aria-label` / `aria-labelledby`, or enclosed in a labeled `<sl-form-field>`.

</section>

<section>

## Code-style rules

### `slds/multiline-html-template`

_(Auto-fixable)_

Enforces a newline right after the opening backtick and right before the closing backtick in multiline `html\`...\`` templates.

```js
// valid
html`
  <div>
    <span>Hello</span>
  </div>
`

// invalid
html`<div>
  <span>Hello</span>
</div>`
```

### `slds/singleline-html-template-trimmed`

_(Auto-fixable)_

Enforces no leading or trailing whitespace in single-line `html\`...\`` templates.

```js
// valid
html`<span>Hello</span>`
html`${first} ${last}`   // spaces between expressions are fine

// invalid
html` <span>Hello</span> `
```

</section>

<section>

## How form-field label detection works

A `<sl-form-field>` is treated as labeled when **any** of the following is true:

<div class="ds-table-wrapper">

| Pattern | Example |
|---|---|
| `label` attribute | `<sl-form-field label="Name">` |
| `.label` property binding | `<sl-form-field .label=${label}>` |
| Child element with `slot="label"` and text content | `<div slot="label">Name</div>` |
| Direct `<sl-label>` child with text content | `<sl-label>Name</sl-label>` |

{.ds-table}

</div>

</section>

<section>

## API

### Rules

<div class="ds-table-wrapper">

| Rule | Type | Auto-fixable | Description |
|------|------|:---:|-------------|
| `slds/button-has-label` | problem | | `<sl-button>` must have a label |
| `slds/checkbox-has-label` | problem | | `<sl-checkbox>` must have a label |
| `slds/checkbox-group-has-label` | problem | | `<sl-checkbox-group>` must have a label |
| `slds/combobox-has-label` | problem | | `<sl-combobox>` must have a label |
| `slds/date-field-has-label` | problem | | `<sl-date-field>` must have a label |
| `slds/number-field-has-label` | problem | | `<sl-number-field>` must have a label |
| `slds/radio-has-label` | problem | | `<sl-radio>` must have text content |
| `slds/radio-group-has-label` | problem | | `<sl-radio-group>` must have a label |
| `slds/select-has-label` | problem | | `<sl-select>` must have a label |
| `slds/switch-has-label` | problem | | `<sl-switch>` must have a label |
| `slds/text-area-has-label` | problem | | `<sl-textarea>` must have a label |
| `slds/text-field-has-label` | problem | | `<sl-text-field>` must have a label |
| `slds/time-field-has-label` | problem | | `<sl-time-field>` must have a label |
| `slds/multiline-html-template` | suggestion | ✓ | Multiline `html\`\`` must have newlines at start and end |
| `slds/singleline-html-template-trimmed` | suggestion | ✓ | Single-line `html\`\`` must have no leading/trailing whitespace |

{.ds-table .ds-table-align-top}


</div>

</section>
