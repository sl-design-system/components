---
'@sl-design-system/tree': minor
---

Whether or not a tree node is selectable is now determined by the `isSelectable` function, which defaults to returning true. This means that all nodes are selectable by default, and only an explicit `isSelectable` returning false opts out.
