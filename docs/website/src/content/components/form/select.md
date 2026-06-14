---
title: Select
layout: docs
eleventyNavigation:
  key: Select
  parent: Form
---

`<sl-select>` lets the user choose a single option from a dropdown list. Use it when there are more
options than is practical for a [radio group](/components/form/radio-group), or when space is
limited. For free-text filtering, use a [combobox](/components/form/combobox).

Provide the choices as `<sl-option>` elements in the default slot, and group them with
`<sl-option-group>`.

## Usage

```html
<sl-form-field label="Country">
  <sl-select placeholder="Select an option">
    <sl-option value="nl">Netherlands</sl-option>
    <sl-option value="be">Belgium</sl-option>
    <sl-option value="de">Germany</sl-option>
  </sl-select>
</sl-form-field>
```

## Examples

### Basic

```html {.example .show-source}
<sl-select placeholder="Select an option" style="max-inline-size: 320px;">
  <sl-option value="1">Option 1</sl-option>
  <sl-option value="2">Option 2</sl-option>
  <sl-option value="3">Option 3</sl-option>
</sl-select>
```

### Selected value

Set the `value` attribute to preselect the matching option.

```html {.example .show-source}
<sl-select value="2" style="max-inline-size: 320px;">
  <sl-option value="1">Option 1</sl-option>
  <sl-option value="2">Option 2</sl-option>
  <sl-option value="3">Option 3</sl-option>
</sl-select>
```

### Groups

Group related options with `<sl-option-group>`.

```html {.example .show-source}
<sl-select placeholder="Select an option" style="max-inline-size: 320px;">
  <sl-option-group label="Group 1">
    <sl-option value="1">Option 1</sl-option>
    <sl-option value="2">Option 2</sl-option>
  </sl-option-group>
  <sl-option-group label="Group 2">
    <sl-option value="3">Option 3</sl-option>
    <sl-option value="4">Option 4</sl-option>
  </sl-option-group>
</sl-select>
```

### Clearable

Add `clearable` to let the user reset the selection.

```html {.example .show-source}
<sl-select value="1" clearable style="max-inline-size: 320px;">
  <sl-option value="1">Option 1</sl-option>
  <sl-option value="2">Option 2</sl-option>
</sl-select>
```

### Disabled

```html {.example .show-source}
<sl-select placeholder="Select an option" disabled style="max-inline-size: 320px;">
  <sl-option value="1">Option 1</sl-option>
</sl-select>
```

## API

See the [API reference](/api-reference/sl-select) for all attributes and properties.
