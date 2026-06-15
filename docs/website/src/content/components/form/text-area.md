---
title: Text area
layout: component
eleventyNavigation:
  key: Text area
  parent: Form
---

```html {.example .show-source}
<sl-form-field label="Comments">
  <sl-text-area placeholder="Type something here"></sl-text-area>
</sl-form-field>
```

## Usage

`<sl-text-area>` is a multi-line text input for longer, free-form content such as comments or
descriptions. For a single line of text, use a [text field](/components/form/text-field) instead.

Wrap it in an [`<sl-form-field>`](/components/form/form-field) to add a label, hint and validation
messages.

## Examples

### Basic

```html {.example .show-source}
<sl-text-area placeholder="Type something here"></sl-text-area>
```

### Rows

Use the `rows` attribute to set the initial visible height.

```html {.example .show-source}
<sl-text-area rows="5" placeholder="Five rows tall"></sl-text-area>
```

### Resize

The `resize` attribute controls how the user can resize the field: `vertical` (default), `none`,
`horizontal`, `both` or `auto` (grows with the content).

```html {.example .show-source .vertical}
<sl-text-area resize="none" placeholder="Not resizable"></sl-text-area>
<sl-text-area resize="auto" placeholder="Grows as you type"></sl-text-area>
```

### Length limits

Use `minlength` and `maxlength` to constrain the amount of text.

```html {.example .show-source}
<sl-form-field label="Bio" hint="Maximum 100 characters">
  <sl-text-area maxlength="100"></sl-text-area>
</sl-form-field>
```

### Disabled and readonly

```html {.example .show-source .vertical}
<sl-text-area value="Disabled" disabled></sl-text-area>
<sl-text-area value="Read only" readonly></sl-text-area>
```

## API

See the [API reference](/api-reference/sl-text-area) for all attributes and properties.
