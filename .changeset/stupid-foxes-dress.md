---
'@sl-design-system/virtual-list': patch
'@sl-design-system/tabs': patch
'@sl-design-system/tree': patch
---

VirtualizerController now automatically calculates and updates scrollMargin when using window scrolling, keeping the virtual list correctly positioned during layout shifts and resize events.
The ResizeObserver in TabGroup unconditionally called scrollToTabPanelStart() on every resize, forcing the page to scroll to the active tab panel even when no tab change occurred. Removed scrollToTabPanelStart() from the ResizeObserver callback since resize events do not change the selected tab. Scrolling to the panel start is still triggered by user interaction and programmatic tab changes.
