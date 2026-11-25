---
title: Grid
tags: overview
eleventyNavigation:
  parent: Grid
  key: GridOverview
---
<section>
<div class="ds-example">
<sl-grid id="grid-overview-example">
<sl-grid-column path="firstName"></sl-grid-column>
<sl-grid-column path="lastName"></sl-grid-column>
<sl-grid-column path="email"></sl-grid-column>
<sl-grid-column path="profession"></sl-grid-column>
</sl-grid>
</div>

<div class="ds-code">

  ```html
<sl-grid id="grid-example">
    <sl-grid-column path="firstName"></sl-grid-column>
    <sl-grid-column path="lastName"></sl-grid-column>
    <sl-grid-column path="email"></sl-grid-column>
    <sl-grid-column path="profession"></sl-grid-column>
</sl-grid>
  ```

</div>
</section>

<section>

## What is a grid?

A grid presents data in rows and columns. Each row represents one item, and each column shows one property of that item. Users can scan the data, compare items and, depending on the configuration, act on them.

This page covers the basics of the grid: its structure and how to display data. Features such as sorting, filtering, selection and grouping are documented separately.

</section>

<section>

## Anatomy

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

## Related

- Use the [paginator](/components/paginator/) to split large data sets over multiple pages.

</section>

<script>
const overviewGrid = document.querySelector("#grid-overview-example");

requestAnimationFrame(() => {
  overviewGrid.items = [
    { id: "0", firstName: "Aria", lastName: "Bailey", email: "aria.bailey@company.com", profession: "Endocrinologist" },
    { id: "1", firstName: "Aaliyah", lastName: "Butler", email: "aaliyah.butler@company.com", profession: "Nephrologist" },
    { id: "2", firstName: "Eleanor", lastName: "Price", email: "eleanor.price@company.com", profession: "Ophthalmologist" }
  ];
});
</script>

