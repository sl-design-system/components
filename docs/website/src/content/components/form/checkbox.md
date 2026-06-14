---
title: Checkbox
layout: docs
eleventyNavigation:
  key: Checkbox
  parent: Form
---

`<sl-checkbox>` is a single on/off choice, for example to accept terms or toggle an option. To offer
several related choices where more than one can be selected, use a
[checkbox group](/components/form/checkbox-group).

The label goes in the default slot.

## Usage

```html
<sl-checkbox>I agree to the terms</sl-checkbox>
```

## Examples

### Basic

```html {.example .show-source}
<sl-checkbox>Toggle me</sl-checkbox>
```

### Checked

```html {.example .show-source}
<sl-checkbox checked>Checked</sl-checkbox>
```

### Indeterminate

The `indeterminate` state represents a "partially selected" checkbox, often used for a parent that
controls a group of children.

```html {.example .show-source}
<sl-checkbox indeterminate>Indeterminate</sl-checkbox>
```

### Disabled

```html {.example .show-source .vertical}
<sl-checkbox disabled>Unchecked</sl-checkbox>
<sl-checkbox disabled checked>Checked</sl-checkbox>
```

### Required

Inside an `<sl-form>`, a required checkbox must be checked for the form to be valid.

```html {.example .show-source}
<sl-form>
  <sl-form-field>
    <sl-checkbox required>I accept the terms and conditions</sl-checkbox>
  </sl-form-field>
</sl-form>
```

## API

See the [API reference](/api-reference/sl-checkbox) for all attributes and properties.
