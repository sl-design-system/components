---
'@sl-design-system/menu': patch
---

Fixes keyboard navigation:
- Prevents `ArrowLeft` and `ArrowRight` key events from bubbling up to parent elements (e.g. toolbar), preventing unintended navigation in parent components,
- Fixes submenu behavior when pressing `Escape` key - now properly closes the submenu and returns focus to the parent menu item.
