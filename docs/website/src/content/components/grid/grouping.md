---
title: Grouping
layout: docs
eleventyNavigation:
  key: Grid grouping
  title: Grouping
  parent: Grid
---

Grouping organises rows under collapsible group headers. To enable it, provide the grid with an
`ArrayListDataSource` configured with a `groupBy` path instead of setting `items` directly.

## Grouping rows

```html
<sl-grid>
  <sl-grid-sort-column path="fullName" header="Student"></sl-grid-sort-column>
  <sl-grid-sort-column path="email" header="Email"></sl-grid-sort-column>
  <sl-grid-column path="school.name" header="School"></sl-grid-column>
</sl-grid>

<script type="module">
  import { ArrayListDataSource } from '@sl-design-system/data-source';

  const grid = document.querySelector('sl-grid');
  grid.dataSource = new ArrayListDataSource(students, { groupBy: 'school.id' });
</script>
```

The grid renders a header for each group, which users can collapse and expand. For full control over
how a group header looks, set the grid's `groupHeaderRenderer` property.

## API

See the [API reference](/api-reference/sl-grid) for all attributes and properties.
