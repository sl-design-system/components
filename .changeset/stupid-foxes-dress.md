---
'@sl-design-system/virtual-list': patch
'@sl-design-system/tree': patch
---

VirtualizerController now automatically calculates and updates scrollMargin when using window scrolling, keeping the virtual list correctly positioned during layout shifts and resize events.
