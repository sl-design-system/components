---
title: Scrolling
layout: docs
eleventyNavigation:
  key: Grid scrolling
  title: Scrolling
  parent: Grid
---

By default the grid grows to fit all of its rows. To keep the header visible and let the body scroll
within a fixed area, constrain the grid's height with CSS. The column headers stay sticky at the top
while the rows scroll.

## Scrollable grid

```html
<sl-grid style="block-size: 400px;">
  <sl-grid-column path="studentNumber" header="Nr." grow="0"></sl-grid-column>
  <sl-grid-column path="fullName" header="Student"></sl-grid-column>
  <sl-grid-column path="email" header="Email"></sl-grid-column>
</sl-grid>
```

The grid is also virtualized: it only renders the rows that are currently visible, so it stays
performant even with very large data sets.

## Sticky columns

Add the `sticky` attribute to a column to keep it pinned while the grid scrolls horizontally.

```html
<sl-grid-column path="fullName" header="Student" sticky></sl-grid-column>
```

## API

See the [API reference](/api-reference/sl-grid) for all attributes and properties.
