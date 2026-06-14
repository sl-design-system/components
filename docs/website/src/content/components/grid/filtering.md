---
title: Filtering
layout: docs
eleventyNavigation:
  key: Grid filtering
  title: Filtering
  parent: Grid
---

Use `<sl-grid-filter-column>` to let users narrow down the rows. The column adds a filter control to
its header; the `mode` attribute controls what kind of control it is.

## Filter columns

```html
<sl-grid>
  <sl-grid-filter-column path="fullName" header="Student"></sl-grid-filter-column>
  <sl-grid-filter-column path="group.name" header="Group"></sl-grid-filter-column>
  <sl-grid-filter-column path="school.id" header="School" mode="select" label-path="school.name"></sl-grid-filter-column>
</sl-grid>
```

## Modes

The `mode` attribute selects the filter control:

- **`text`** — a text field that matches on the column's value (the default).
- **`select`** — a list of the distinct values to choose from. Use `label-path` when you filter on
  an id but want to show a human-readable label.
- **`date`** / **`date-range`** — filter by a single date or a date range.

You can pre-apply a filter by setting the column's `value` attribute.

```html
<sl-grid-filter-column path="fullName" header="Student" value="ma"></sl-grid-filter-column>
```

## API

See the [API reference](/api-reference/sl-grid-filter-column) for all attributes and properties.
