---
'@sl-design-system/tabs': patch
---

The ResizeObserver in TabGroup unconditionally called scrollToTabPanelStart() on every resize, forcing the page to scroll to the active tab panel even when no tab change occurred. Removed scrollToTabPanelStart() from the ResizeObserver callback since resize events do not change the selected tab. Scrolling to the panel start is still triggered by user interaction and programmatic tab changes.
