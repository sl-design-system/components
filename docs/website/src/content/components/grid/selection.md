---
title: Selection
layout: docs
eleventyNavigation:
  key: Grid selection
  title: Selection
  parent: Grid
---

The grid supports selecting one or multiple rows. Add an `<sl-grid-selection-column>` to show
checkboxes, or use the `selects` attribute to enable selection without a dedicated column.

## Multiple selection

Adding a selection column automatically enables multiple selection. Use `select-all` to include a
"select all" checkbox in the header.

```html
<sl-grid>
  <sl-grid-selection-column select-all></sl-grid-selection-column>
  <sl-grid-column path="fullName" header="Student"></sl-grid-column>
  <sl-grid-column path="email" header="Email"></sl-grid-column>
</sl-grid>
```

## Single selection

For single selection, use `<sl-grid-select-column>`, which renders radio buttons.

```html
<sl-grid>
  <sl-grid-select-column></sl-grid-select-column>
  <sl-grid-column path="fullName" header="Student"></sl-grid-column>
</sl-grid>
```

## Reacting to selection

Read the current selection from the grid's selection model, and listen for changes. The grid also
dispatches `sl-grid-active-row-change` when the active row changes.

```js
grid.addEventListener('sl-grid-active-row-change', event => {
  console.log('Active row:', event.detail);
});
```

## API

See the API reference for [`sl-grid-selection-column`](/api-reference/sl-grid-selection-column) and
[`sl-grid-select-column`](/api-reference/sl-grid-select-column).
