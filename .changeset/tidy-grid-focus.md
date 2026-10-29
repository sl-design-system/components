---
'@sl-design-system/grid': patch
---

Preserve keyboard focus when activating, selecting or deselecting grid rows by using stable item IDs when rendering virtualized rows, and prevent view jumps when scrolling and selecting rows in Firefox.

Invalidate cached row heights after content edits, including in-place mutations, and retain small measured changes to the scroll extent.

Bound content snapshots so records referencing large shared collections do not undermine virtualization.
