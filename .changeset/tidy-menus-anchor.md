---
'@sl-design-system/menu': patch
'@sl-design-system/shared': patch
---

Position menus with CSS Anchor Positioning instead of the JavaScript-based `AnchorController`. Applications supporting browsers without native CSS Anchor Positioning must load the documented polyfill.

Prevent pending JavaScript popover positioning results from applying after cleanup.
