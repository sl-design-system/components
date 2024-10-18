# @sl-design-system/data-source

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
