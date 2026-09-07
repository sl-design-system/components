---
'@sl-design-system/menu': major
---

Make menu items with `aria-disabled="true"` focusable and navigable with the keyboard. This allows users to read the content of disabled menu items, which is especially important for accessibility.

**Breaking changes**

- The `disabled` property for `sl-menu-item` has been removed. Use `aria-disabled="true"` instead to disable a menu item. The `disabled` property is no longer supported and will have no effect. This change was made to improve accessibility and ensure that disabled menu items remain focusable and navigable with the keyboard.
