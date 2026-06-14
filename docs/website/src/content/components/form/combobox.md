---
title: Combobox
layout: docs
eleventyNavigation:
  key: Combobox
  parent: Form
---

`<sl-combobox>` combines a text input with a filterable list of options. As the user types, the list
narrows to matching options. It supports selecting a single value or multiple values, and can
optionally accept custom values that aren't in the list.

Use a combobox when there are many options to choose from; for a short, fixed set use a
[select](/components/form/select). Provide the options as `<sl-option>` elements inside an
`<sl-listbox>`.

## Usage

```html
<sl-form-field label="Country">
  <sl-combobox placeholder="Choose a country">
    <sl-listbox>
      <sl-option>Netherlands</sl-option>
      <sl-option>Belgium</sl-option>
      <sl-option>Germany</sl-option>
    </sl-listbox>
  </sl-combobox>
</sl-form-field>
```

## Examples

### Basic

Start typing to filter the options.

```html {.example .show-source}
<sl-combobox placeholder="Choose an option" aria-label="Choose an option" style="max-inline-size: 320px;">
  <sl-listbox>
    <sl-option>Option 1</sl-option>
    <sl-option>Option 2</sl-option>
    <sl-option>Option 3</sl-option>
  </sl-listbox>
</sl-combobox>
```

### Selected value

```html {.example .show-source}
<sl-combobox value="Option 2" aria-label="Choose an option" style="max-inline-size: 320px;">
  <sl-listbox>
    <sl-option>Option 1</sl-option>
    <sl-option>Option 2</sl-option>
    <sl-option>Option 3</sl-option>
  </sl-listbox>
</sl-combobox>
```

### Multiple selection

Add the `multiple` attribute to let the user select more than one option. Selected options appear as
removable [tags](/components/status/tag).

```html {.example .show-source}
<sl-combobox multiple placeholder="Choose options" aria-label="Choose options" style="max-inline-size: 320px;">
  <sl-listbox>
    <sl-option>Option 1</sl-option>
    <sl-option>Option 2</sl-option>
    <sl-option>Option 3</sl-option>
  </sl-listbox>
</sl-combobox>
```

### Custom values

Add `allow-custom-values` to let the user enter values that aren't in the list.

```html {.example .show-source}
<sl-combobox allow-custom-values placeholder="Type or choose" aria-label="Type or choose" style="max-inline-size: 320px;">
  <sl-listbox>
    <sl-option>Option 1</sl-option>
    <sl-option>Option 2</sl-option>
  </sl-listbox>
</sl-combobox>
```

## API

See the [API reference](/api-reference/sl-combobox) for all attributes and properties.
