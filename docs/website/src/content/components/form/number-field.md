---
title: Number field
layout: docs
eleventyNavigation:
  key: Number field
  parent: Form
---

`<sl-number-field>` is an input for numeric values. It supports minimum and maximum bounds, a step
increment, optional step buttons, and locale-aware formatting for currencies, percentages and units.

Wrap it in an [`<sl-form-field>`](/components/form/form-field) to add a label, hint and validation
messages.

## Usage

```html
<sl-form-field label="Quantity">
  <sl-number-field min="0" step="1"></sl-number-field>
</sl-form-field>
```

## Examples

### Min, max and step

```html {.example .show-source}
<sl-number-field min="0" max="10" step="2" placeholder="0–10"></sl-number-field>
```

### Step buttons

Use the `step-buttons` attribute to show increment/decrement buttons, either at the `end` or on both
`edges`.

```html {.example .show-source .vertical}
<sl-number-field step-buttons="end" placeholder="End"></sl-number-field>
<sl-number-field step-buttons="edges" placeholder="Edges"></sl-number-field>
```

### Formatting

The `format-options` attribute takes the same options as
[`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat),
so you can format the value as a currency, percentage or unit.

```html {.example .show-source .vertical}
<sl-number-field format-options='{"style":"currency","currency":"EUR"}' placeholder="Amount"></sl-number-field>
<sl-number-field format-options='{"style":"percent"}' placeholder="Percentage"></sl-number-field>
<sl-number-field format-options='{"style":"unit","unit":"kilometer"}' placeholder="Distance"></sl-number-field>
```

### Disabled and readonly

```html {.example .show-source .vertical}
<sl-number-field value="42" disabled></sl-number-field>
<sl-number-field value="42" readonly></sl-number-field>
```

## API

See the [API reference](/api-reference/sl-number-field) for all attributes and properties.
