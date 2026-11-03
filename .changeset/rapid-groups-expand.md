---
'@sl-design-system/data-source': patch
---

Fix issues with groups in `FetchListDataSource`:

- The items of a group that starts collapsed are now loaded and shown when you expand it,
- Groups that were already expanded keep showing their items when you expand another group.
