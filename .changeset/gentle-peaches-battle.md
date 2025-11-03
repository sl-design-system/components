---
'@sl-design-system/grid': patch
---

Improve reliability of selection mode

When you add an `<sl-grid-selection-column>` to a grid, the selection column automatically enables multiple selection mode on the data source. However, if you then changed the `items` property, the new data source would not have selection enabled. This fixes both cases by having a `selects` property on grid that is kept in sync with the data source. The selection column also sets the `selects` property on the grid.
