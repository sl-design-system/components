---
title: Styling
layout: docs
eleventyNavigation:
  key: Grid styling
  title: Styling
  parent: Grid
---

The grid offers several attributes and CSS parts to adjust its appearance.

## Borders and stripes

- **`no-border`** — removes the outer border around the grid.
- **`no-row-border`** — removes the borders between rows.
- **`striped`** — gives rows alternating background colors for easier scanning.

```html
<sl-grid no-border>…</sl-grid>
<sl-grid no-row-border>…</sl-grid>
<sl-grid striped>…</sl-grid>
```

## Custom cell parts

Give a column a `parts` value to add CSS parts to its cells, then target them with `::part()`. A
`parts` function lets you apply parts conditionally based on the row data.

```html
<sl-grid>
  <sl-grid-column path="status" header="Status" parts="status"></sl-grid-column>
</sl-grid>

<style>
  sl-grid::part(status) {
    font-weight: var(--sl-text-typeset-fontWeight-semibold);
  }
</style>
```

You can also style whole rows by setting the grid's `itemParts` property to a function that returns
part names per row.

## API

See the [API reference](/api-reference/sl-grid) for all attributes and properties.
