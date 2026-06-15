---
title: Text field
layout: component
eleventyNavigation:
  key: Text field
  parent: Form
---

```html {.example .show-source}
<sl-form-field label="Name">
  <sl-text-field placeholder="Your name"></sl-text-field>
</sl-form-field>
```

## Usage

`<sl-text-field>` is a single-line text input. Use it for short, free-form text such as a name, email
address or URL. For longer text, use a [text area](/components/form/text-area); for numbers, use a
[number field](/components/form/number-field).

Wrap it in an [`<sl-form-field>`](/components/form/form-field) to add a label, hint and validation
messages.

## Examples

### Types

Set the `type` attribute to `text` (default), `email`, `tel`, `url`, `password` or `number` to get
the appropriate keyboard and built-in validation.

```html {.example .show-source}
<sl-form-field label="Email">
  <sl-text-field type="email" placeholder="name@example.com"></sl-text-field>
</sl-form-field>
```

### Placeholder

```html {.example .show-source}
<sl-text-field placeholder="Type something here"></sl-text-field>
```

### Required

Add `required` so the field must be filled in. Inside an `<sl-form>`, the error message appears when
validation runs.

```html {.example .show-source}
<sl-form>
  <sl-form-field label="Name">
    <sl-text-field required></sl-text-field>
  </sl-form-field>
</sl-form>
```

### Disabled and readonly

```html {.example .show-source .vertical}
<sl-text-field value="Disabled" disabled></sl-text-field>
<sl-text-field value="Read only" readonly></sl-text-field>
```

### Prefix and suffix

Use the `prefix` and `suffix` slots to add icons or text alongside the input.

```html {.example .show-source}
<sl-text-field placeholder="Search">
  <sl-icon slot="prefix" name="far-magnifying-glass"></sl-icon>
</sl-text-field>
```

## API

See the [API reference](/api-reference/sl-text-field) for all attributes and properties.
