---
title: Inline message
layout: component
eleventyNavigation:
  key: Inline message
  parent: Status
---

```html {.example .show-source}
<sl-inline-message variant="info">
  <h2 slot="title">Heads up</h2>
  The main content of the message.
</sl-inline-message>
```

## Usage

`<sl-inline-message>` is a prominent, in-page message that informs the user about the result of an
action or the state of a part of the interface. Unlike a toast, it stays in the layout next to the
content it relates to.

Put the main content in the default slot, and an optional heading in the `title` slot.

## Examples

### Variants

The `variant` attribute sets the tone and icon: `info`, `success`, `warning` or `danger`.

```html {.example .show-source .vertical}
<sl-inline-message variant="info">An informational message.</sl-inline-message>
<sl-inline-message variant="success">Your changes have been saved.</sl-inline-message>
<sl-inline-message variant="warning">Your subscription expires soon.</sl-inline-message>
<sl-inline-message variant="danger">Something went wrong.</sl-inline-message>
```

### With a title and details

Use the `title` slot for a heading and the default slot for richer content.

```html {.example .show-source}
<sl-inline-message variant="danger">
  <h2 slot="title">Could not save your changes</h2>
  Please fix the following errors:
  <ul style="margin: 0.25rem 0 0; padding-inline-start: 1.25rem;">
    <li>Title is required</li>
    <li>End date must be after the start date</li>
  </ul>
</sl-inline-message>
```

### Indismissible

By default the message has a close button. Add `indismissible` to remove it for messages that should
stay visible.

```html {.example .show-source}
<sl-inline-message variant="info" indismissible>This message cannot be dismissed.</sl-inline-message>
```

### Custom icon

Use the `icon` slot to override the default variant icon.

```html {.example .show-source}
<sl-inline-message variant="info">
  <sl-icon slot="icon" name="far-circle-question"></sl-icon>
  This example shows a custom icon.
</sl-inline-message>
```

## API

See the [API reference](/api-reference/sl-inline-message) for all attributes, properties and events.
