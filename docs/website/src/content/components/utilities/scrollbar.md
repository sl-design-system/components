---
title: Scrollbar
layout: docs
eleventyNavigation:
  key: Scrollbar
  parent: Utilities
---

`<sl-scrollbar>` renders a custom, themable scrollbar that controls a separate scrolling container.
It is intended for components that need a scrollbar that looks consistent across browsers and
platforms, such as the grid.

::: info
When in doubt, **always** prefer the native scrollbar. Only reach for `<sl-scrollbar>` when you
specifically need a custom one.
:::

## Usage

Point the scrollbar at the scroll container using the `scroller` attribute, which takes the `id` of
the element to control. The container itself usually hides its native scrollbar with
`scrollbar-width: none`.

```html
<div id="scroller" style="block-size: 100px; overflow: auto; scrollbar-width: none;">
  <div style="inline-size: 400%; block-size: 100px;">…wide content…</div>
</div>
<sl-scrollbar scroller="scroller"></sl-scrollbar>
```

## Examples

### Horizontal

By default the scrollbar is horizontal. Drag the thumb to scroll the linked container.

```html {.example .show-source}
<div id="scrollbar-h" style="inline-size: 400px; block-size: 100px; overflow: auto; scrollbar-width: none;">
  <div style="inline-size: 1200px; block-size: 100px; background: linear-gradient(to right, var(--sl-color-background-accent-blue-bold), var(--sl-color-background-accent-purple-bold));"></div>
</div>
<sl-scrollbar scroller="scrollbar-h" style="inline-size: 400px;"></sl-scrollbar>
```

### Vertical

Add the `vertical` attribute for a vertical scrollbar, and place it alongside a vertically
scrolling container.

```html
<div style="display: flex; gap: 0.5rem; block-size: 150px;">
  <div id="scroller" style="inline-size: 200px; overflow: auto; scrollbar-width: none;">
    <div style="block-size: 600px;">…tall content…</div>
  </div>
  <sl-scrollbar vertical scroller="scroller"></sl-scrollbar>
</div>
```

## API

See the [API reference](/api-reference/sl-scrollbar) for all attributes and properties.
