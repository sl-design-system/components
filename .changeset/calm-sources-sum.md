---
'@sl-design-system/data-source': minor
---

Add a `grandTotals` property to `ListDataSource` and an optional `grandTotals` field to the result of the `FetchListDataSource` fetch callback, so a grid can show totals (a grand totals row) for data that is not completely loaded. Provide the raw totals for all items matching the active filters; the latest response replaces the previous totals.
