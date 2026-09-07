---
'@sl-design-system/tabs': patch
---

The overflow menu items for disabled tabs now correctly use `aria-disabled="true"` instead of the removed `disabled` property on `sl-menu-item`.
Selecting a disabled tab's overflow menu item no longer accidentally selects it.
