---
'@sl-design-system/data-source': patch
---

Fix the items of groups in a `FetchListDataSource` that start collapsed: they are now loaded when the group is expanded, and they keep showing their items when another group is expanded afterwards.
