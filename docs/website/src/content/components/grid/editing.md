---
title: Editing
layout: docs
eleventyNavigation:
  key: Grid editing
  title: Editing
  parent: Grid
---

The grid supports editing cell values inline. Use a column type that renders an editable control,
such as `<sl-grid-text-field-column>`, which shows a text field in each cell of that column.

## Editable columns

```html
<sl-grid>
  <sl-grid-column path="firstName" header="First name"></sl-grid-column>
  <sl-grid-column path="lastName" header="Last name"></sl-grid-column>
  <sl-grid-text-field-column path="address.zip" header="Zip code"></sl-grid-text-field-column>
</sl-grid>
```

Editing a cell updates the corresponding property on the row's data object, so your underlying data
stays in sync.

## API

See the [API reference](/api-reference/sl-grid-text-field-column) for all attributes and properties.
