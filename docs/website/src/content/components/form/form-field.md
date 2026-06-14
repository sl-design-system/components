---
title: Form field
layout: docs
eleventyNavigation:
  key: Form field
  parent: Form
---

`<sl-form-field>` wraps a form control and provides the surrounding structure: a label, an optional
hint, and the validation messages. It works with any of the form controls and keeps their labelling
and error handling consistent.

In most cases you only need the `label` and `hint` attributes; the form field generates the
`<sl-label>`, `<sl-hint>` and error elements for you.

## Usage

```html
<sl-form-field label="Username" hint="Choose a unique name">
  <sl-text-field></sl-text-field>
</sl-form-field>
```

## Examples

### Label and hint

The `label` attribute renders the field's label, and `hint` renders helper text below the control.

```html {.example .show-source}
<sl-form-field label="Username" hint="This is a hint">
  <sl-text-field></sl-text-field>
</sl-form-field>
```

### Validation messages

When a control inside the form field is invalid, the field shows the error message. Wrap the field
in an `<sl-form>` and call `reportValidity()` to trigger validation.

```html {.example .show-source}
<sl-form>
  <sl-form-field label="Email">
    <sl-text-field type="email" required></sl-text-field>
  </sl-form-field>
</sl-form>
```

### Custom label, hint and error

For full control, slot your own `<sl-label>`, `<sl-hint>` and `<sl-error>` instead of using the
attributes. This lets you add rich content such as an [infotip](/components/utilities/infotip) in the
label.

```html {.example .show-source}
<sl-form-field>
  <sl-label>
    Username
    <sl-infotip slot="infotip">A unique identifier used for account login.</sl-infotip>
  </sl-label>
  <sl-text-field></sl-text-field>
  <sl-hint>Use letters and numbers only.</sl-hint>
</sl-form-field>
```

## API

See the [API reference](/api-reference/sl-form-field) for all attributes and properties.
