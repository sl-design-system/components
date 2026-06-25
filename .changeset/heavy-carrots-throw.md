---
'@sl-design-system/shared': patch
---

Improved focus behavior in `NewFocusGroupController`:

- The focused item now keeps `tabindex="0"` (instead of all elements being forced to `-1`), which makes Tab behavior consistent before and after arrow keys navigation.
- Focus handling on `focusin` is now more reliable when elements are re-rendered.
