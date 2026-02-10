---
'@sl-design-system/menu': patch
---

Fixes keyboard navigation and focus management:
- Prevents arrow key events from bubbling up to parent elements (e.g. toolbar), preventing unintended navigation in parent components,
- Fixes submenu behavior when pressing `Escape` key - now properly closes the submenu and returns focus to the parent menu item,
- Implements initial focus so the first menu item is automatically focused when the menu opens,
- Adds `focusout` handling to close all open menus when focus leaves the menu component.