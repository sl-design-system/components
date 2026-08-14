---
'@sl-design-system/data-source': patch
---

Improve `ArrayListDataSource` item order handling.

- Keep the new row order when items are reordered.
- Allow moving whole groups in grouped data.
- Keep group order after `update()`.
