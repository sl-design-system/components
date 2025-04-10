---
'@sl-design-system/grid': minor
---

Minor improvements to filtering:
- Use the `originalItems` on `ListDataSource` to determine the filter options
- Add a new `getDisplayValue` method in `GridColumn` that can be overridden to customize the display value
- Add a new `labelPath` property to `<sl-grid-filter-column>` to specify the label for the display value

