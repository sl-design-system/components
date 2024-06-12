---
'@sl-design-system/tooltip': patch
'@sl-design-system/shared': patch
---

Various fixes:
- Make it possible to close a tooltip with Escape key
- Fix issue where the tooltip was broken after first show
- Fix showing shared tooltip
- Fix tooltip accessibility - removed `aria-expanded` which is not applicable for tooltips