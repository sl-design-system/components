---
title: Pagination
layout: docs
eleventyNavigation:
  key: Grid pagination
  title: Pagination
  parent: Grid
---

For large data sets you can split the rows across pages and pair the grid with a
[paginator](/components/navigation/paginator). Drive both from the same `ArrayListDataSource`: the
data source knows the page size and current page, and the grid renders the current page.

## Paginated grid

```html
<sl-grid></sl-grid>
<sl-paginator></sl-paginator>

<script type="module">
  import { ArrayListDataSource } from '@sl-design-system/data-source';

  const dataSource = new ArrayListDataSource(students, { pageSize: 10 });

  const grid = document.querySelector('sl-grid');
  grid.dataSource = dataSource;

  const paginator = document.querySelector('sl-paginator');
  paginator.totalItems = students.length;
  paginator.pageSize = 10;
  paginator.addEventListener('sl-page-change', event => {
    dataSource.setPage(event.detail);
    dataSource.update();
  });
</script>
```

The data source paginates the rows, so the grid only renders the items for the current page.

## API

See the [API reference](/api-reference/sl-grid) for all attributes and properties.
