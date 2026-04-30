---
'@sl-design-system/tool-bar': patch
---

Fix a bug where `sl-menu-item` click handlers did not fire from the toolbar overflow menu.

When a toolbar was collapsed, submenu actions originating from `sl-menu-button` were rendered in overflow but did not forward clicks to the original menu items. This change adds click proxying so selecting an overflow submenu item triggers the original item's click handler, restoring expected behavior in components such as Grid bulk actions.
