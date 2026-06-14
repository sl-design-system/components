---
title: Sorting
layout: docs
eleventyNavigation:
  key: Grid sorting
  title: Sorting
  parent: Grid
---

To let users sort the data, use `<sl-grid-sort-column>` instead of `<sl-grid-column>`. This adds a
clickable, sortable header that cycles through ascending, descending and unsorted. Not every column
has to be sortable — mix sort columns with regular ones as needed.

## Sortable columns

```html
<sl-grid>
  <sl-grid-sort-column path="studentNumber" header="Nr." grow="0"></sl-grid-sort-column>
  <sl-grid-sort-column path="fullName" header="Student"></sl-grid-sort-column>
  <sl-grid-column path="email" header="Email"></sl-grid-column>
</sl-grid>
```

When you set the data with the `items` property, the grid sorts it for you. For server-side or
otherwise managed data, provide a `dataSource` instead and the grid will ask it to sort.

```html
<sl-grid></sl-grid>

<script type="module">
  import { ArrayListDataSource } from '@sl-design-system/data-source';

  const grid = document.querySelector('sl-grid');
  grid.dataSource = new ArrayListDataSource(students);
</script>
```

## API

See the [API reference](/api-reference/sl-grid-sort-column) for all attributes and properties.
