---
'@sl-design-system/card': patch
---

Prevent duplicate title link clicks in cards with interactive slotted content. Card link proxying now uses a single stable click listener and ignores clicks from controls in the `menu-button` and `actions` slots, including toggle buttons and menu buttons.
