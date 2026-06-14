---
title: Spinner
layout: docs
eleventyNavigation:
  key: Spinner
  parent: Status
---

`<sl-spinner>` indicates that something is loading when you don't know how long it will take. For
tasks where you can measure progress, use a [progress bar](/components/status/progress-bar) instead.

The spinner uses `currentColor`, so it takes the text color of its container — which makes it easy
to use inside buttons and other colored surfaces.

## Usage

```html
<sl-spinner></sl-spinner>
```

## Examples

### Sizes

Use the `size` attribute to choose from `sm`, `md`, `lg`, `xl`, `2xl`, `3xl` and `4xl`.

```html {.example .show-source .horizontal}
<sl-spinner size="sm"></sl-spinner>
<sl-spinner size="md"></sl-spinner>
<sl-spinner size="lg"></sl-spinner>
<sl-spinner size="xl"></sl-spinner>
<sl-spinner size="2xl"></sl-spinner>
```

### In a button

Because the spinner inherits the current text color, it sits naturally inside a button to indicate a
pending action.

```html {.example .show-source .horizontal}
<sl-button variant="primary">
  <sl-spinner></sl-spinner>
  Sending
</sl-button>
<sl-button fill="outline">
  <sl-spinner></sl-spinner>
  Sending
</sl-button>
```

## API

See the [API reference](/api-reference/sl-spinner) for all attributes and properties.
