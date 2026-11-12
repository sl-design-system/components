---
'@sl-design-system/grid': patch
---

Fix missing interactive cell backgrounds for grid row actions by resolving the overlay on each cell, restoring hover feedback and the active and selected row colors.

Keep activated rows highlighted when the pointer leaves the row by applying the same opaque base background as selected rows, independently of the interactive overlay opacity.
