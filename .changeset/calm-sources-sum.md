---
'@sl-design-system/data-source': minor
---

Add a `summary` property to `ListDataSource` and an optional `summary` field to the result of the `FetchListDataSource` fetch callback, so a grid can show totals (a summary row) for data that is not completely loaded. Provide the raw totals for all items matching the active filters; the latest response replaces the previous totals.
