---
title: Basics
layout: docs
eleventyNavigation:
  key: Grid basics
  title: Basics
  parent: Grid
---

A grid is made up of an `<sl-grid>` element with the data set on its `items` property, and one
`<sl-grid-column>` per column. Each column's `path` points to a property on the row data, and
`header` sets the column heading.

## Columns

```html
<sl-grid>
  <sl-grid-column path="studentNumber" header="Nr." grow="0"></sl-grid-column>
  <sl-grid-column path="fullName" header="Student" grow="3"></sl-grid-column>
  <sl-grid-column path="school.name" header="School" ellipsize-text></sl-grid-column>
</sl-grid>
```

- **`path`** — the (dot-separated) property to display, e.g. `school.name`.
- **`header`** — the column heading; defaults to a humanised version of the path.
- **`grow`** — how much the column grows relative to others (like `flex-grow`); use `grow="0"` for a
  fixed, content-sized column.
- **`ellipsize-text`** — truncates overflowing text with an ellipsis.
- **`align`** — aligns the cell content (`start`, `center` or `end`).

## Custom cell rendering

For anything beyond plain text, give a column a `renderer` function. Register any custom elements it
uses through `scopedElements`.

```html
<sl-grid></sl-grid>

<script type="module">
  import { Avatar } from '@sl-design-system/avatar';
  import { html } from 'lit';

  const grid = document.querySelector('sl-grid');
  grid.items = students;

  const column = grid.querySelector('sl-grid-column[path="fullName"]');
  column.scopedElements = { 'sl-avatar': Avatar };
  column.renderer = student => html`<sl-avatar .displayName=${student.fullName}></sl-avatar>`;
</script>
```

## Column groups

Wrap columns in an `<sl-grid-column-group>` to show a shared header above them.

```html
<sl-grid>
  <sl-grid-column-group header="Personal">
    <sl-grid-column path="firstName" header="First name"></sl-grid-column>
    <sl-grid-column path="lastName" header="Last name"></sl-grid-column>
  </sl-grid-column-group>
  <sl-grid-column path="email" header="Email"></sl-grid-column>
</sl-grid>
```

## API

See the API reference for [`sl-grid`](/api-reference/sl-grid) and
[`sl-grid-column`](/api-reference/sl-grid-column).
