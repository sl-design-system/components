---
'@sl-design-system/menu': patch
---

Fix an accessibility issue where selectable `sl-menu-item` elements only exposed `aria-checked` when selected.

Selectable items now always set `aria-checked` to `"true"` or `"false"` based on state, and non-selectable items remove the attribute.
This improves screen reader announcements and resolves ARIA required attribute violations in menu selection variants.
