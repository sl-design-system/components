---
'@sl-design-system/data-source': minor
'@sl-design-system/grid': minor
---

Add a new `setData(items: T[])` method to `ArrayListDataSource` for updating the data without losing state. This allows for bulk actions on selected rows in the grid, as shown in the updated selection story.

This also refactors how we store the collapsed group state in `ListDataSource` by moving it from the group item to a private set of collapsed group ids. This ensures that the collapsed state is preserved even when the group items are updated, which is important for the new `setData` method. The `FetchListDataSource` is also updated to reflect this change in how collapsed state is handled.
