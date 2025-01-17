---
'@sl-design-system/data-source': patch
'@sl-design-system/grid': patch
'@sl-design-system/paginator': patch
---

Refactor existing data sources into list specific datasources, clearing
the way to add `TreeDataSource` in the `@sl-design-system/tree` package.

- The base `DataSource` class has support for sorting and filtering
- Grouping and pagination has been moved to the `ListDataSource` class
- `ArrayDataSource` and `FetchDataSource` have been renamed to `ArrayListDataSource` and `FetchListDataSource` respectively
