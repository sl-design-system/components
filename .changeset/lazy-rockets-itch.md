---
'@sl-design-system/data-source': patch
---

New `@sl-design-system/data-source` package

This packages provides `DataSource`, `ArrayDataSource` and `FetchDataSource` classes
for managing data sources in the design system. At the moment, it is only used by the
grid components, but it can be used in future components as well.

`DataSource` and `ArrayDataSource` were previously part of the `@sl-design-system/shared`
package, but they have been moved to this new package to make them more reusable.

`FetchDataSource` is a new data source around the `window.fetch()` API that can be used to
fetch data from a remote server.
