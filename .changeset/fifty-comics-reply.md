---
'@sl-design-system/tooltip': patch
---

Fix the tooltip so it no longer appears when hovering over or focusing elements inside an open popover (e.g. menu items in an open menu attached to a menu-button with a tooltip).
Fix the tooltip so it correctly shows when hovering over a wrapper element (e.g. `sl-menu-button`) whose actual anchor (e.g. the inner `sl-button`) is inside its shadow DOM.
