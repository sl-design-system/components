---
'@sl-design-system/listbox': patch
---

Prevent unstable scrolling in virtualized listboxes by disabling scroll anchoring and containing overscroll on the listbox host. This fixes cases where small touchpad scrolls could keep snapping the rendered range back to the same option, and prevents wheel scrolling at list boundaries from scrolling the underlying page.
