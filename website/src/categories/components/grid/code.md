---
title: Grid code
tags: code
APIdescription: Component has a range of properties to define the experience in different use cases.
eleventyNavigation:
  parent: Grid
  key: GridCode
---
<section class="no-heading">

<div class="ds-example" style="display: block;">
<sl-grid id="grid-code-example">
<sl-grid-column path="firstName"></sl-grid-column>
<sl-grid-column path="lastName"></sl-grid-column>
<sl-grid-column path="email"></sl-grid-column>
<sl-grid-column path="address.phone" header="Guardian phone"></sl-grid-column>
<sl-grid-column path="grade" header="Grade"></sl-grid-column>
</sl-grid>
</div>

<div class="ds-code">

  ```html
<sl-grid id="grid-example">
    <sl-grid-column path="firstName"></sl-grid-column>
    <sl-grid-column path="lastName"></sl-grid-column>
    <sl-grid-column path="email"></sl-grid-column>
    <sl-grid-column path="address.phone" header="Guardian phone"></sl-grid-column>
    <sl-grid-column path="grade" header="Grade"></sl-grid-column>
</sl-grid>
  ```

  ```js
const grid = document.querySelector('#grid-example');

grid.items = [
  {
    firstName: 'Mia',
    lastName: 'Thompson',
    email: 'mia.thompson@oakwood.edu',
    address: { phone: '555-0100' },
    grade: '6'
  },
  ...
];
  ```

</div>

</section>

<ds-install-info link-in-navigation package="grid"></ds-install-info>

<section>

<sl-callout density="relaxed" variant="info">
  This page covers the basics of the grid: its structure and how to display data. Features such as sorting, filtering, selection and grouping will be documented on a later stage.
</sl-callout>

</section>

<section>

## Grid structure

A basic grid is made of the following parts:

1. **Header row**: contains the column headers, which describe the data in each column.
2. **Column**: defines which property of the data is shown and how it is displayed.
3. **Row**: shows one item of the data.
4. **Cell**: shows the value of a single property for a single row.

</section>

<section>

## Data

The grid gets its data from a data source. There are two ways to provide data:

- **`items`**: the simplest option. Set an array of objects and the grid wraps it in an in-memory data source for you. Use this when you have all the data available.
- **`dataSource`**: provide your own data source when you need more control, for example `ArrayListDataSource` for data in memory, or `FetchListDataSource` to load data from a server in pages.

The grid renders whatever the data source provides. When the data source changes, the grid updates its rows automatically.

</section>

<section>

## Key points

- Every column maps to a property of the data using its `path`. Nested properties are supported, for example `address.phone`.
- The header text of a column is derived from its `path`, or can be set explicitly with the `header` property.
- Use `striped` to make long rows easier to follow, or `no-border` and `no-row-border` for a lighter look.
- Use `ellipsize-text` to keep rows on a single line when cell content is long.

</section>

<section>

## Using a data source

Setting `items` is the quickest way to show data. If you need more control, create a data source and assign it to the `dataSource` property instead. The grid uses the data source to get its rows and updates when the data source changes.

```js
import { ArrayListDataSource } from '@sl-design-system/data-source';

const grid = document.querySelector('#grid-example');

grid.dataSource = new ArrayListDataSource([
  { firstName: 'Mia', lastName: 'Thompson', grade: '6' },
  { firstName: 'Noah', lastName: 'Williams', grade: '7' }
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

<section>

## TODO: include grand totals once it's merged

</section>

{% include "../component-table.njk" %}

<script>
const codeGrid = document.querySelector("#grid-code-example");

requestAnimationFrame(() => {
  codeGrid.items = [
    { id: "0", firstName: "Mia", lastName: "Thompson", email: "mia.thompson@oakwood.edu", address: { phone: "555-0100" }, grade: "6" },
    { id: "1", firstName: "Noah", lastName: "Williams", email: "noah.williams@oakwood.edu", address: { phone: "555-0101" }, grade: "7" },
    { id: "2", firstName: "Ava", lastName: "Martinez", email: "ava.martinez@oakwood.edu", address: { phone: "555-0102" }, grade: "6" }
  ];
});
</script>

