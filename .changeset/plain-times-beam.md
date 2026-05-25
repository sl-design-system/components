---
'@sl-design-system/menu': patch
'@sl-design-system/tool-bar': patch
---

Expose `aria-disabled="true"` on disabled menu items so assistive technologies announce them as unavailable. Toolbar overflow menu items now preserve disabled semantics with `aria-disabled` instead of rendering hard-disabled menu items, keeping them reachable while preventing activation.
