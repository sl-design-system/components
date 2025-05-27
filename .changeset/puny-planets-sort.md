---
'@sl-design-system/paginator': patch
---

Various fixes:
- Fix issue where the current `pageSize` sometimes did not reflect the `pageSize` property of the data source
- Fix issue where 2 buttons with "1" were showing when there was only one page
- Update types due to `ListDataSource` changes
