---
title: Ellipsize text
layout: component
eleventyNavigation:
  key: Ellipsize text
  parent: Utilities
---

```html {.example .show-source}
<sl-ellipsize-text style="width: 200px">
  This is a long text that should be truncated
</sl-ellipsize-text>
```

## Usage

`<sl-ellipsize-text>` truncates text that overflows its container with an ellipsis (…) and, when the
text is truncated, shows the full text in a tooltip on hover and focus. It watches its container for
size changes, so the truncation stays correct when the layout changes.

Use it wherever you have a fixed-width area that may contain text of unpredictable length, such as
table cells, list items or cards.

The component truncates based on the width of its container, so give it (or a parent) a constrained
width.

## Examples

### Basic

The first line is truncated and the full text is available in a tooltip. The second example has
plenty of room, so no ellipsis or tooltip is added.

```html {.example .show-source}
<sl-ellipsize-text style="width: 200px">
  This is a long text that should be truncated
</sl-ellipsize-text>
<sl-ellipsize-text style="width: 200px">Short text</sl-ellipsize-text>
```

## API

See the [API reference](/api-reference/sl-ellipsize-text) for all attributes and properties.
