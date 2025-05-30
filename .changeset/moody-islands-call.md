---
'@sl-design-system/grid': minor
---

Add `activeRow` property to grid with accompanying event

This changes adds a new `activeRow` property to the `<sl-grid>` component. This allows users to specify which row should be marked as active. The active row is marked using the `active` DOM part. It is styled similarly to a selected row. In order to enable the ability to activate a row, you need to add the `activatable-row` attribute to the `<sl-grid>` component. When the active row changes, an `sl-grid-active-row-change` event is dispatched.

You can combine the `activatable-row` feature with `selects="multiple"` feature to allow users to both activate and select a row.
