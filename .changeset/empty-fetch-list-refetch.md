---
'@sl-design-system/data-source': patch
---

Refetch an empty `FetchListDataSource` on `update()` so removing a filter that returned no results restores the available items, including when pagination is enabled.

Reuse pending page requests across updates with unchanged fetch options to avoid duplicate network calls. Ignore responses from requests invalidated by changes to filters, sorting, page size, custom options, or the fetch callback.
