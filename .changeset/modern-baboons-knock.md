---
'@sl-design-system/shared': minor
'@sl-design-system/grid': minor
---

Migrate `DataSource` and `ArrayDataSource` to dedicated `@sl-design-system/data-source` package.

Since these are only used in the grid component, and that component is still in draft, migrating
this code into its own package is not considered a breaking change.
