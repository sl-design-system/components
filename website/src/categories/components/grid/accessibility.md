---
title: Grid accessibility
tags: accessibility
eleventyNavigation:
  parent: Grid
  key: GridAccessibility
---
<section>

## Keyboard interactions

The grid is a table, so keyboard users move through it with the Tab key. Only interactive elements inside the grid, such as buttons, links or form controls in a cell, receive focus. Plain text cells are not focusable and can be read with a screen reader's table navigation.

To avoid tabbing through every interactive element in a large grid, the grid provides skip links. They are visually hidden until they receive focus.

|Key|Description|
|---|-----------|
|Tab|Moves focus to the next interactive element in the grid, in reading order. When the last interactive element has focus, focus moves out of the grid. When the grid is entered, the first focusable item is the "Skip to end of table" link.|
|Shift + Tab|Moves focus to the previous interactive element in the grid, or out of the grid.|
|Enter|Activates the focused skip link, button or link.|
|Space|Activates the focused button.|

{.ds-table .ds-table-align-top}

</section>

<section>

## TODO: include arrows navigation once it's merged

</section>

<section>

## Semantics

The grid is exposed to assistive technology as a table. Rows and cells use the `row`, `columnheader` and `cell` roles. The grid sets `aria-rowcount` and `aria-colcount`, and rows and cells have an `aria-rowindex` or `aria-colindex`, so screen reader users know where they are in the data.

</section>

<section>

## Skip links

The grid contains two skip links: "Skip to end of table" before the first row and "Skip to start of table" after the last row. They let keyboard users jump past the grid, or back to its start, without tabbing through every cell.

Use `no-skip-links` to remove the skip links only when the grid has no tab stops, or only a few.

</section>

<section>

## Guidelines

- Give every column a clear, descriptive header.
- Do not rely on color alone, such as striped rows, to convey meaning.
- Make sure the full content is available when text is ellipsized.

</section>

