---
title: Paginator code
tags: code
APIdescription: {
  sl-paginator: "The paginator component offers settings for various scenarios.",
  sl-paginator-status: "Paginator status component displays pagination information using page, pageSize, and totalItems properties.",
  sl-paginator-page-size: "Paginator page size component provides properties to configure available page size options and current selection.",
}
eleventyNavigation:
  parent: Paginator
  key: PaginatorCode
---
<style>
.pagination {
  display: inline-flex;
  justify-content: space-between;
  inline-size: 100%;
}

sl-paginator {
 inline-size: 440px;
 justify-content: center;
}
</style>

<section class="no-heading">

<div class="ds-example">
<div class="pagination">
<sl-paginator-status id="status"></sl-paginator-status>
<sl-paginator id="paginator"></sl-paginator>
<sl-paginator-page-size id="page-size" page-sizes="[5,10,15,20]"></sl-paginator-page-size>
</div>
</div>

<div class="ds-code">

  ```html
<sl-paginator-status id="status"></sl-paginator-status>
<sl-paginator id="paginator"></sl-paginator>
<sl-paginator-page-size id="page-size" page-sizes="[5,10,15,20]"></sl-paginator-page-size>

<script>
  // This is an example with DataSource managing the pagination state
  
    import { ArrayListDataSource } from '@sl-design-system/data-source';
    
    const paginatorStatus = document.querySelector("#status");
    const paginator = document.querySelector("#paginator");
    const pageSize = document.querySelector("#page-size");
  
    const exams = Array.from({ length: 60 }).map((_, index) => `Exam ${index + 1}`);
  
    const ds = new ArrayListDataSource(exams, {
      pagination: true,
      page: 1,
      pageSize: 10
    });
  
    paginatorStatus.dataSource = ds;
    paginator.dataSource = ds;
    pageSize.dataSource = ds;
</script>
  ```

</div>

</section>

<ds-install-info link-in-navigation package="paginator"></ds-install-info>

<section>

## Using data source with paginator

A data source is an interface that manages data fetching, state, and pagination logic.
It allows you to connect paginator components to your data in a consistent way,
whether that data comes from an API, an in memory array, or any other source.

### Setting up a data source

To use a data source with the paginator components, follow these steps:

1. **Create a data source instance** - Use `FetchListDataSource` for API based data or `ArrayListDataSource` for in memory arrays. You can also implement your own data source by extending the ListDataSource class and implementing the required methods.
2. **Configure pagination settings** - Set `pageSize` and enable `pagination`.
3. **Implement data fetching** - Define the `fetchPage` method to retrieve data for each page (for API based data).
4. **Connect to components** - Assign the same data source instance to `sl-paginator`, `sl-paginator-status`, and `sl-paginator-page-size`.

### Example

```typescript
const ds = new FetchListDataSource({
  pageSize: 10,
  pagination: true,
  fetchPage: async ({ page, pageSize }) => {
    const response = await fetch(
      `https://api.example.com/data?skip=${page * pageSize}&limit=${pageSize}`
    );
    
    if (response.ok) {
      const { items, total } = await response.json();
      return { items, totalItems: total };
    } else {
      throw new FetchListDataSourceError('Failed to fetch data', response);
    }
  }
});

// Connect the data source to all paginator components
paginatorStatus.dataSource = ds;
paginator.dataSource = ds;
pageSize.dataSource = ds;
```
<br />

Once connected, the paginator components will automatically:
- Display the correct page information
- Fetch new data when users navigate between pages
- Update when the page size changes
- Show the total number of items and current range

</section>

{% include "../component-table.njk" %}

<script>
const paginatorStatus = document.querySelector("#status");
const paginator = document.querySelector("#paginator");
const pageSize = document.querySelector("#page-size");

setTimeout(() => {
const exams = Array.from({ length: 60 }).map((_, index) => `Exam ${index + 1}`);

const ds = new ArrayListDataSource(exams, {
  pagination: true,
  page: 1,
  pageSize: 10
});
  
paginatorStatus.dataSource = ds;
paginator.dataSource = ds;
pageSize.dataSource = ds;
}, 50);
</script>
