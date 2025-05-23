---
'@sl-design-system/grid': minor
---

Big improvements:
- New visual styles throughout all components
- Refactored to use the new `ListDataSource` class and view model types
- Removed `SelectionController` since that logic is now part of `ListDataSource`
- Replaced the `clickable-row` property with `selects`; this new property combines the functionality of `clickable-row` and selection mode into a single property
   * `single-row`: Only one row can be selected at a time, by clicking anywhere on the row.
   * `multiple`: Multiple rows can be selected, but just by clicking on the selection column.
   * `multiple-row`: Multiple rows can be selected by clicking anywhere on the row.
- Removed the `sl-active-item-change` change event. Use the `sl-selection-change` event in combination with `selects="single-row"` to get the same behavior
- Fixed removing sort unnecessarily in certain cases
- Fixed superfluous calls to `dataSource.update()` when the data source was not changed
