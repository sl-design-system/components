# @sl-design-system/data-source

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
