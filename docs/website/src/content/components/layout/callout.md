---
title: Callout
layout: docs
eleventyNavigation:
  key: Callout
  parent: Layout
---

`<sl-callout>` is a prominent, in-page message that draws attention to important information. Unlike
an [inline message](/components/status/inline-message), a callout is not dismissible and is meant for
information that should stay visible, such as a tip or an important note within content.

Put the main content in the default slot and an optional heading in the `title` slot.

## Usage

```html
<sl-callout variant="info">
  <h2 slot="title">Good to know</h2>
  The main content of the callout.
</sl-callout>
```

## Examples

### Variants

The `variant` attribute sets the tone and icon: `info` (default), `success`, `warning` or `danger`.

```html {.example .show-source .vertical}
<sl-callout variant="info">An informational callout.</sl-callout>
<sl-callout variant="success">Everything is working as expected.</sl-callout>
<sl-callout variant="warning">Be careful with this setting.</sl-callout>
<sl-callout variant="danger">This action has serious consequences.</sl-callout>
```

### With a title

```html {.example .show-source}
<sl-callout variant="info">
  <h2 slot="title">Good to know</h2>
  You can combine a title with body content for more detailed callouts.
</sl-callout>
```

### Density

Use the `density` attribute to add more breathing room. It accepts `default` and `relaxed`.

```html {.example .show-source .vertical}
<sl-callout variant="info" density="default">A default-density callout.</sl-callout>
<sl-callout variant="info" density="relaxed">A relaxed callout with more spacing.</sl-callout>
```

### Custom icon

Use the `icon` slot to override the default variant icon.

```html {.example .show-source}
<sl-callout variant="info">
  <sl-icon slot="icon" name="far-rocket"></sl-icon>
  This callout uses a custom icon.
</sl-callout>
```

## API

See the [API reference](/api-reference/sl-callout) for all attributes and properties.
