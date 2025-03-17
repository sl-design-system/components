---
'@sl-design-system/select': patch
---

Bug fixes:
1. Fix the `focusout` event handler too eagerly closing the dropdown
2. Fix `<sl-option>`s that were added after the initial rendering of the component not being accessible via keyboard navigation
