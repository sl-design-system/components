---
title: Grid
layout: docs
eleventyNavigation:
  key: Grid
  parent: Components
  order: 2
  icon: table-cells
---

`<sl-grid>` is a powerful data table for displaying and interacting with collections of data. It
supports sorting, filtering, grouping, selection, inline editing, pagination, drag-and-drop
reordering and custom styling.

Because the grid is data-driven, you provide the data through the `items` property (or a
`dataSource` for advanced scenarios) and describe the columns with `<sl-grid-column>` elements. The
examples throughout this section therefore configure the grid from JavaScript.

```html
<sl-grid></sl-grid>

<script type="module">
  const grid = document.querySelector('sl-grid');
  grid.items = [
    { name: 'Ada Lovelace', email: 'ada@example.com' },
    { name: 'Alan Turing', email: 'alan@example.com' }
  ];
</script>
```

```html
<sl-grid>
  <sl-grid-column path="name" header="Name"></sl-grid-column>
  <sl-grid-column path="email" header="Email"></sl-grid-column>
</sl-grid>
```

## Topics

This section is organised by feature, mirroring the grid stories in Storybook:

[Basics](/components/grid/basics)
: Columns, headers, custom renderers and column groups.

[Sorting](/components/grid/sorting)
: Let users sort the data by column.

[Filtering](/components/grid/filtering)
: Let users narrow down the rows shown.

[Grouping](/components/grid/grouping)
: Group rows under collapsible headers.

[Selection](/components/grid/selection)
: Select one or multiple rows.

[Editing](/components/grid/editing)
: Edit cell values inline.

[Pagination](/components/grid/pagination)
: Split the rows across pages.

[Scrolling](/components/grid/scrolling)
: Make the grid body scroll within a fixed height.

[Drag and drop](/components/grid/drag-and-drop)
: Reorder rows by dragging.

[Styling](/components/grid/styling)
: Borders, stripes and custom cell parts.
