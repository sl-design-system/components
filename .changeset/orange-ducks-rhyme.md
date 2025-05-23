---
'@sl-design-system/data-source': minor
---

Big improvements to the `data-source` package:

#### DataSource
- Now a fully `abstract` class without any implementation details
- Removed the `id` parameter for `setSort()`
- Changed the `DataSourceSort` interface to be simpler:

```ts
export type DataSourceSort<Model> = {
  by: DataSourceSortFunction<Model> | PathKeys<Model>;
  direction: DataSourceSortDirection;
};
```

#### ListDataSource
Instead of `<sl-grid>` using `ListDataSource` *and* having a `GridViewModel` class *and* using `SelectionController`, `ListDataSource` now is setup to handle all the view model logic internally. This means `<sl-grid>` no longer needs a separate view model and selection controller.

If you try to combine grouping with pagination, it will log a warning to the console. Grouping and pagination are not compatible with each other. You can either group or paginate, but not both at the same time.

- Added `ListDataSourceItem`, `ListDataSourceDataItem` and `ListDataSourceGroupItem` view model types
- Added constructor options for filtering, grouping and sorting
- Added the ability to customize how groups are sorted by adding `groupSortBy` and `groupSortDirection` options
- Added `selects` property for single, multiple or no selection mode at all
- Moved selection methods from `SelectionController` into this class
- Emits a new `sl-selection-change` event when the selection changes
- Defines `collapseGroup()`, `expandGroup()`,  `toggleGroup()` and `isGroupCollapsed()` abstract methods
- Changed `reorder()` to be an abstract method

#### ArrayListDataSource
- Refactored to use the new view model types from `ListDataSource`
- Implemented group sorting
- Implemented selection logic for groups (selected, unselected, indeterminate)

#### FetchListDataSource
- Refactored to use the new view model types from `ListDataSource`
- Added `groups` constructor option when you want to use groups, but lazy load the data
- Added ability to lazy load group items (per page)
- Added the current group id to the `fetchPage()` method arguments as well
