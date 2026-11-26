---
title: Grid usage
tags: usage
eleventyNavigation:
  parent: Grid
  key: GridUsage
---
<section class="no-heading">

<div class="ds-example" style="display: block;">
<sl-grid id="grid-usage-example">
<sl-grid-column path="subject"></sl-grid-column>
<sl-grid-column path="teacher"></sl-grid-column>
<sl-grid-column path="room"></sl-grid-column>
<sl-grid-column path="day" header="Day"></sl-grid-column>
<sl-grid-column path="time" header="Time"></sl-grid-column>
</sl-grid>
</div>

<div class="ds-code">

  ```html
<sl-grid id="grid-example">
    <sl-grid-column path="subject"></sl-grid-column>
    <sl-grid-column path="teacher"></sl-grid-column>
    <sl-grid-column path="room"></sl-grid-column>
    <sl-grid-column path="day" header="Day"></sl-grid-column>
    <sl-grid-column path="time" header="Time"></sl-grid-column>
</sl-grid>
  ```

  ```js
const grid = document.querySelector('#grid-example');

grid.items = [
  {
    subject: 'Mathematics',
    teacher: 'Ms. Johnson',
    room: 'A101',
    day: 'Monday',
    time: '09:00 - 10:00'
  },
  ...
];
  ```

</div>

</section>

<section>

## When to use

- To display structured data that users need to scan, compare or look up.
- To show data sets with multiple properties per item, such as people, orders or documents.
- When the data set is too large or too complex for a list or cards.

</section>

<section>

## When not to use

- For layout purposes. Use layout components or CSS instead.
- For a small amount of simple, non-interactive data. A native HTML table is sufficient.
- For content that is mainly text or images. Use a list or cards instead.

</section>

<section>

## How to use

### Columns

Choose the columns that matter most to the user and place them in order of importance, with the most identifying column first. Keep column headers short and descriptive.

### Rows

Each row represents exactly one item. Keep the row content consistent, so users can compare values in the same column.

### Empty values

When an item has no value for a column, leave the cell empty. Avoid placeholder text, unless the empty state could be mistaken for missing data.

### Long content

By default, cell content wraps over multiple lines. Use `ellipsize-text` when rows must stay on a single line, and make sure the full content is available elsewhere.

### Data

Use `items` when you have a simple array of data available. Use a data source (`dataSource`) when the data needs to be managed separately from the grid, or loaded from a server.

### Large data sets

Combine the grid with the paginator to keep the number of rows manageable.

</section>

<section>

## Anatomy

<div class="ds-table-wrapper">

|Item|Name| Description | Optional|
|-|-|-|-|
|1|...	|...|No|
|2|...	|...|No|
|3|...	|...|No|

{.ds-table .ds-table-align-top}

</div>

</section>

<script>
const usageGrid = document.querySelector("#grid-usage-example");

requestAnimationFrame(() => {
  usageGrid.items = [
    { id: "0", subject: "Mathematics", teacher: "Ms. Johnson", room: "A101", day: "Monday", time: "09:00 - 10:00" },
    { id: "1", subject: "Geography", teacher: "Mr. Patel", room: "B204", day: "Monday", time: "10:15 - 11:15" },
    { id: "2", subject: "Physics", teacher: "Dr. Nguyen", room: "Lab 2", day: "Tuesday", time: "09:00 - 10:30" },
    { id: "3", subject: "History", teacher: "Mrs. Carter", room: "C012", day: "Wednesday", time: "13:00 - 14:00" }
  ];
});
</script>
