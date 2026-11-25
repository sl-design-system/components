---
title: Grid code
tags: code
APIdescription: Component has a range of properties to define the experience in different use cases.
eleventyNavigation:
  parent: Grid
  key: GridCode
---
<section class="no-heading">

<div class="ds-example">
<sl-grid id="grid-code-example">
<sl-grid-column path="firstName"></sl-grid-column>
<sl-grid-column path="lastName"></sl-grid-column>
<sl-grid-column path="email"></sl-grid-column>
<sl-grid-column path="address.phone" header="Phone"></sl-grid-column>
<sl-grid-column path="profession"></sl-grid-column>
</sl-grid>
</div>

<div class="ds-code">

  ```html
<sl-grid id="grid-example">
    <sl-grid-column path="firstName"></sl-grid-column>
    <sl-grid-column path="lastName"></sl-grid-column>
    <sl-grid-column path="email"></sl-grid-column>
    <sl-grid-column path="address.phone" header="Phone"></sl-grid-column>
    <sl-grid-column path="profession"></sl-grid-column>
</sl-grid>
  ```

  ```js
const grid = document.querySelector('#grid-example');

grid.items = [
  {
    firstName: 'Aria',
    lastName: 'Bailey',
    email: 'aria.bailey@company.com',
    address: { phone: '555-0100' },
    profession: 'Endocrinologist'
  }
];
  ```

</div>

</section>

<ds-install-info link-in-navigation package="grid"></ds-install-info>

<section>

## Using a data source

Setting `items` is the quickest way to show data. If you need more control, create a data source and assign it to the `dataSource` property instead. The grid uses the data source to get its rows and updates when the data source changes.

```js
import { ArrayListDataSource } from '@sl-design-system/data-source';

const grid = document.querySelector('#grid-example');

grid.dataSource = new ArrayListDataSource([
  { firstName: 'Aria', lastName: 'Bailey' },
  { firstName: 'Aaliyah', lastName: 'Butler' }
]);
```

For data that lives on a server, use `FetchListDataSource`.

### Fetching data from a server

`FetchListDataSource` loads data page by page, only when it is needed. It initially loads the data for the visible rows and fetches more as the user scrolls down. Provide the following options:

- `pageSize`: the number of items to load per request.
- `fetchPage`: an async function that receives the `page` (starting at 0) and `pageSize`, and returns an object with the `items` for that page and the `totalItems` on the server. The grid uses the total to determine the number of rows.

```js
import { FetchListDataSource, FetchListDataSourceError } from '@sl-design-system/data-source';

const grid = document.querySelector('#grid-example');

grid.dataSource = new FetchListDataSource({
  pageSize: 30,
  fetchPage: async ({ page, pageSize }) => {
    const response = await fetch(`/api/quotes?skip=${page * pageSize}&limit=${pageSize}`);

    if (response.ok) {
      const { quotes, total } = await response.json();

      return { items: quotes, totalItems: total };
    } else {
      throw new FetchListDataSourceError('Failed to fetch data', response);
    }
  }
});
```

While a page is loading, the grid shows placeholder rows. Throw a `FetchListDataSourceError` when the request fails, so the failure is reported correctly.

</section>

{% include "../component-table.njk" %}

<script>
const codeGrid = document.querySelector("#grid-code-example");

requestAnimationFrame(() => {
  codeGrid.items = [
    { id: "0", firstName: "Aria", lastName: "Bailey", email: "aria.bailey@company.com", address: { phone: "555-0100" }, profession: "Endocrinologist" },
    { id: "1", firstName: "Aaliyah", lastName: "Butler", email: "aaliyah.butler@company.com", address: { phone: "555-0101" }, profession: "Nephrologist" },
    { id: "2", firstName: "Eleanor", lastName: "Price", email: "eleanor.price@company.com", address: { phone: "555-0102" }, profession: "Ophthalmologist" }
  ];
});
</script>

