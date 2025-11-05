---
'@sl-design-system/data-source': patch
---

Fix data not being invalidated when calling `FetchListDataSource.update()`

This fixes a bug where after adding a filter and calling `update()`, the `fetchPage` callback was not being called again. Instead the data source was still serving the old data from the previous `fetchPage` calls.
