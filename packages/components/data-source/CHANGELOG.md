# @sl-design-system/data-source

## 0.2.3

### Patch Changes

- [#2815](https://github.com/sl-design-system/components/pull/2815) [`df7af95`](https://github.com/sl-design-system/components/commit/df7af9509ebf675a572267f30cf36e835075b0fe) - Fix data not being invalidated when calling `FetchListDataSource.update()`

  This fixes a bug where after adding a filter and calling `update()`, the `fetchPage` callback was not being called again. Instead the data source was still serving the old data from the previous `fetchPage` calls.

## 0.2.2

### Patch Changes

- [#2655](https://github.com/sl-design-system/components/pull/2655) [`8d7163c`](https://github.com/sl-design-system/components/commit/8d7163cd05c3483cbdc2cb907236066ed90b963b) - Fix issue where the `selectAll` flag wasn't reset after manually deselecting all items

- Updated dependencies [[`659a92a`](https://github.com/sl-design-system/components/commit/659a92af4732d339f9830368b1e0e3bd48221714)]:
  - @sl-design-system/shared@0.9.1

## 0.2.1

### Patch Changes

- [#2614](https://github.com/sl-design-system/components/pull/2614) [`061367b`](https://github.com/sl-design-system/components/commit/061367b5daf905c9fe52a3630d9eaebc4bcb4e80) - Changed the way FetchListDataSourceError is exported in the package.

- [#2579](https://github.com/sl-design-system/components/pull/2579) [`6c72794`](https://github.com/sl-design-system/components/commit/6c727949b5aef75e1548416f80a7595fbd51e312) - Fix bug where group selection wasn't cleared

- Updated dependencies [[`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68), [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68), [`0e2e426`](https://github.com/sl-design-system/components/commit/0e2e426041997a299f3e35bcde499909d62f7ce9), [`17fbc40`](https://github.com/sl-design-system/components/commit/17fbc404a27bada6a5013c84c34a2936de604f16)]:
  - @sl-design-system/shared@0.9.0

## 0.2.0

### Minor Changes

- [#2034](https://github.com/sl-design-system/components/pull/2034) [`1072075`](https://github.com/sl-design-system/components/commit/1072075e3f1b5f0bf8b07dc1f89fd39b9f7103d0) - Big improvements to the `data-source` package:

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

  Instead of `<sl-grid>` using `ListDataSource` _and_ having a `GridViewModel` class _and_ using `SelectionController`, `ListDataSource` now is setup to handle all the view model logic internally. This means `<sl-grid>` no longer needs a separate view model and selection controller.

  If you try to combine grouping with pagination, it will log a warning to the console. Grouping and pagination are not compatible with each other. You can either group or paginate, but not both at the same time.
  - Added `ListDataSourceItem`, `ListDataSourceDataItem` and `ListDataSourceGroupItem` view model types
  - Added constructor options for filtering, grouping, pagination and sorting
  - Added the ability to customize how groups are sorted by adding `groupSortBy` and `groupSortDirection` options
  - Added `selects` property for single, multiple or no selection mode at all
  - Moved selection methods from `SelectionController` into this class
  - Emits a new `sl-selection-change` event when the selection changes
  - Defines `collapseGroup()`, `expandGroup()`, `toggleGroup()` and `isGroupCollapsed()` abstract methods
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

### Patch Changes

- [#2072](https://github.com/sl-design-system/components/pull/2072) [`77b348d`](https://github.com/sl-design-system/components/commit/77b348d19a4869f9242d8ea1c70d32d1e6d04212) - Fix regression with basic drag and drop of rows within grid

- [#1975](https://github.com/sl-design-system/components/pull/1975) [`4a6f8ba`](https://github.com/sl-design-system/components/commit/4a6f8ba02f49e8be7b37028c9b6a558ad91d9664) - Several bug fixes:
  - Fix text being parsed as floating point numbers during sorting
  - Fix the `DataSourceFilterFunction` to include the value in the function

- [#2024](https://github.com/sl-design-system/components/pull/2024) [`a343e29`](https://github.com/sl-design-system/components/commit/a343e298d6b65966e04b3fbfc3598305a29bf1cc) - Expand `ListDataSource.setGroupBy` by adding a parameter for the label path

- Updated dependencies [[`1072075`](https://github.com/sl-design-system/components/commit/1072075e3f1b5f0bf8b07dc1f89fd39b9f7103d0), [`4a6f8ba`](https://github.com/sl-design-system/components/commit/4a6f8ba02f49e8be7b37028c9b6a558ad91d9664)]:
  - @sl-design-system/shared@0.8.0

## 0.1.3

### Patch Changes

- [#1957](https://github.com/sl-design-system/components/pull/1957) [`8a08521`](https://github.com/sl-design-system/components/commit/8a08521ce3396630669fbc0c888e4a4d96aeaee5) - Add an `originalItems` property to `ListDataSource` for access to the unfiltered, unsorted items

- Updated dependencies [[`0a45fb2`](https://github.com/sl-design-system/components/commit/0a45fb23105fce305650c96c5962afe0bb10b930)]:
  - @sl-design-system/shared@0.7.1

## 0.1.2

### Patch Changes

- [#1923](https://github.com/sl-design-system/components/pull/1923) [`f4e2875`](https://github.com/sl-design-system/components/commit/f4e2875883fd0b8501fa346c17e775a317b85926) - Fixes default sorting order when list is grouped

- Updated dependencies [[`ab33cc8`](https://github.com/sl-design-system/components/commit/ab33cc86cc01480fb20206be689f9bbdb62bf0ad)]:
  - @sl-design-system/shared@0.7.0

## 0.1.1

### Patch Changes

- [#1866](https://github.com/sl-design-system/components/pull/1866) [`fe3c562`](https://github.com/sl-design-system/components/commit/fe3c562d4e18ab93e9209aaab1a604774cfba5fb) - Replace generic `unknown` type with `any` to be more forgiving

- Updated dependencies [[`fa0b85d`](https://github.com/sl-design-system/components/commit/fa0b85d46c08018cd43de432c3a9705e7aede2c8), [`eaca9d2`](https://github.com/sl-design-system/components/commit/eaca9d24a6086d7a60dc5efc5332f16e80485d36), [`fe3c562`](https://github.com/sl-design-system/components/commit/fe3c562d4e18ab93e9209aaab1a604774cfba5fb)]:
  - @sl-design-system/shared@0.6.0

## 0.1.0

### Minor Changes

- [#1690](https://github.com/sl-design-system/components/pull/1690) [`1a9604e`](https://github.com/sl-design-system/components/commit/1a9604e1fc70a6382a3545dafee527d7d674179d) - Add support for pagination to all data sources

### Patch Changes

- [#1624](https://github.com/sl-design-system/components/pull/1624) [`cab0938`](https://github.com/sl-design-system/components/commit/cab093898b324073801945fc3771eec2014d6652) - Refactor `getValueByPath` and related functions to properly infer type

- [#1676](https://github.com/sl-design-system/components/pull/1676) [`1b9463f`](https://github.com/sl-design-system/components/commit/1b9463fd91d5e3d99918868fbbd231b425a2a16d) - Fixing a bug with sorting numbers. Previously numbers were sorted like strings.

- [#1497](https://github.com/sl-design-system/components/pull/1497) [`dd63dd8`](https://github.com/sl-design-system/components/commit/dd63dd88f83f81316dd133b2eb9383454dae0b2f) - Fix missing data-source reference

- [#1693](https://github.com/sl-design-system/components/pull/1693) [`4e57f9c`](https://github.com/sl-design-system/components/commit/4e57f9c60835a07db45f74fde73a3bf13b6abe51) - Refactor existing data sources into list specific datasources, clearing
  the way to add `TreeDataSource` in the `@sl-design-system/tree` package.
  - The base `DataSource` class has support for sorting and filtering
  - Grouping and pagination has been moved to the `ListDataSource` class
  - `ArrayDataSource` and `FetchDataSource` have been renamed to `ArrayListDataSource` and `FetchListDataSource` respectively

- [#1497](https://github.com/sl-design-system/components/pull/1497) [`dd63dd8`](https://github.com/sl-design-system/components/commit/dd63dd88f83f81316dd133b2eb9383454dae0b2f) - Add possibility to use data source with pagination. Added `paginate` method.

- Updated dependencies [[`6309452`](https://github.com/sl-design-system/components/commit/63094521a7b262bd80c1a9a377086093d2844a8d), [`cab0938`](https://github.com/sl-design-system/components/commit/cab093898b324073801945fc3771eec2014d6652), [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb), [`c4a93fb`](https://github.com/sl-design-system/components/commit/c4a93fba6f40b8e843a169117dfdd331a5d9d6e6), [`c19862e`](https://github.com/sl-design-system/components/commit/c19862e56455c3d8e27a9afc33bf684f89b04b75), [`b1e3b74`](https://github.com/sl-design-system/components/commit/b1e3b741e78400e3755ddaa0c5c4fdeed2e3f960), [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb), [`4e57f9c`](https://github.com/sl-design-system/components/commit/4e57f9c60835a07db45f74fde73a3bf13b6abe51)]:
  - @sl-design-system/shared@0.5.0

## 0.0.1

### Patch Changes

- [#1575](https://github.com/sl-design-system/components/pull/1575) [`ebe4c8a`](https://github.com/sl-design-system/components/commit/ebe4c8a32e85b753e2aa752a13b2dc23616bf1a9) - New `@sl-design-system/data-source` package

  This packages provides `DataSource`, `ArrayDataSource` and `FetchDataSource` classes
  for managing data sources in the design system. At the moment, it is only used by the
  grid components, but it can be used in future components as well.

  `DataSource` and `ArrayDataSource` were previously part of the `@sl-design-system/shared`
  package, but they have been moved to this new package to make them more reusable.

  `FetchDataSource` is a new data source around the `window.fetch()` API that can be used to
  fetch data from a remote server.

- Updated dependencies [[`4714b36`](https://github.com/sl-design-system/components/commit/4714b36f1387d4d1731a310b621caf5a33be105b), [`ebe4c8a`](https://github.com/sl-design-system/components/commit/ebe4c8a32e85b753e2aa752a13b2dc23616bf1a9), [`33fd543`](https://github.com/sl-design-system/components/commit/33fd5432f1499051071662aaca9974c212304bc6)]:
  - @sl-design-system/shared@0.4.0
