---
title: Radio group
layout: docs
eleventyNavigation:
  key: Radio group
  parent: Form
---

`<sl-radio-group>` presents a set of mutually exclusive choices — the user can pick exactly one. Use
it when all the options benefit from being visible at once; if there are many options or space is
limited, use a [select](/components/form/select) instead.

Place `<sl-radio>` elements in the default slot, each with a `value`.

## Usage

```html
<sl-form-field label="Size">
  <sl-radio-group>
    <sl-radio value="s">Small</sl-radio>
    <sl-radio value="m">Medium</sl-radio>
    <sl-radio value="l">Large</sl-radio>
  </sl-radio-group>
</sl-form-field>
```

## Examples

### Basic

```html {.example .show-source}
<sl-radio-group>
  <sl-radio value="1">One</sl-radio>
  <sl-radio value="2">Two</sl-radio>
  <sl-radio value="3">Three</sl-radio>
</sl-radio-group>
```

### Selected value

Set the group's `value` to preselect the matching radio.

```html {.example .show-source}
<sl-radio-group value="2">
  <sl-radio value="1">One</sl-radio>
  <sl-radio value="2">Two</sl-radio>
  <sl-radio value="3">Three</sl-radio>
</sl-radio-group>
```

### Horizontal

Add the `horizontal` attribute to lay the radios out in a row.

```html {.example .show-source}
<sl-radio-group horizontal>
  <sl-radio value="1">One</sl-radio>
  <sl-radio value="2">Two</sl-radio>
  <sl-radio value="3">Three</sl-radio>
</sl-radio-group>
```

### Disabled

```html {.example .show-source}
<sl-radio-group value="1" disabled>
  <sl-radio value="1">One</sl-radio>
  <sl-radio value="2">Two</sl-radio>
</sl-radio-group>
```

## API

See the [API reference](/api-reference/sl-radio-group) for all attributes and properties.
