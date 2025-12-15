---
title: Paginator code
tags: code
APIdescription: The paginator component offers settings for various scenarios.
eleventyNavigation:
  parent: Paginator
  key: PaginatorCode
---
<style>
#code-example {
  display: flex;
  flex-direction: column;
}

#code-example p {
  display: inline-flex;
  font-size: 1.4rem;
  gap: 1.6rem;
  margin-block: 0.8rem;
}

.pagination {
  display: inline-flex;
  justify-content: space-between;
  inline-size: 100%;
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
<sl-button id="my-btn" popovertarget="popover-2">More details...</sl-button>

<sl-popover id="popover-2" anchor="my-btn" position="bottom-start" aria-label="Information about the student...">
    <header>
      <sl-avatar display-name="John Smith">Primary school</sl-avatar>
      <sl-button aria-label="Close the popover" autofocus>
        <sl-icon name="xmark"></sl-icon>
      </sl-button>
    </header>
    <hr>
    <section>
      Da Vinci...
    </section>
</sl-popover>
  ```

</div>

</section>

<ds-install-info link-in-navigation package="paginator"></ds-install-info>

<section>

## Using data source with paginator

A data source is an abstraction that manages data fetching, state, and pagination logic.
It allows you to connect paginator components to your data in a consistent way,
whether that data comes from an API, local storage, or any other source.

### Setting up a data source

To use a data source with the paginator components, follow these steps:

1. **Create a data source instance** - Use `FetchListDataSource` for API-based data or implement your own data source
2. **Configure pagination settings** - Set `pageSize` and enable `pagination`
3. **Implement data fetching** - Define the `fetchPage` method to retrieve data for each page
4. **Connect to components** - Assign the same data source instance to `sl-paginator`, `sl-paginator-status`, and `sl-paginator-page-size`

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

setTimeout(async () => {
  console.log('pageSize', pageSize, 'paginatorStatus', paginatorStatus, 'paginator', paginator);

const response = await fetch(`https://dummyjson.com/quotes?skip=20&limit=100`);

console.log('response', response);

    const ds = new FetchListDataSource({
      pageSize: 5,
      pagination: true,
      fetchPage: async ({ page, pageSize }) => {
        const response = await fetch(`https://dummyjson.com/quotes?skip=${page * pageSize}&limit=${pageSize}`);

        if (response.ok) {
          const { quotes, total } = (await response.json()) ;

          return { items: quotes, totalItems: total };
        } else {
          throw new FetchListDataSourceError('Failed to fetch data', response);
        }
      }
    });

  console.log('ds', ds);
  
  paginatorStatus.dataSource = ds;
  paginator.dataSource = ds;
  pageSize.dataSource = ds;
}, 100)
</script>
