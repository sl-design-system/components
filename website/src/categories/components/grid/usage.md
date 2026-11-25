---
title: Grid usage
tags: usage
eleventyNavigation:
  parent: Grid
  key: GridUsage
---
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

