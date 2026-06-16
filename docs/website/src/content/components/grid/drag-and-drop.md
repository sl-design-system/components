---
title: Drag and drop
layout: docs
eleventyNavigation:
  key: Grid drag and drop
  title: Drag and drop
  parent: Grid
---

The grid lets users reorder rows by dragging. The easiest way to enable this is to add an
`<sl-grid-drag-handle-column>`, which shows a drag handle and automatically sets the grid's
`draggable-rows` property to `between` (so rows can be dropped between other rows).

## Reordering rows

```html
<sl-grid>
  <sl-grid-drag-handle-column></sl-grid-drag-handle-column>
  <sl-grid-sort-column path="studentNumber" header="Nr." grow="0"></sl-grid-sort-column>
  <sl-grid-sort-column path="fullName" header="Student"></sl-grid-sort-column>
</sl-grid>
```

## Controlling drag behaviour

For finer control you can set the `draggable-rows` property yourself (`between`, `on-top` or
`on-grid`), and use the `dropFilter` property to decide which rows may be dropped where. The grid
dispatches a drop event you can use to update the underlying data.

## API

See the API reference for [`sl-grid`](/api-reference/sl-grid) and
[`sl-grid-drag-handle-column`](/api-reference/sl-grid-drag-handle-column).
