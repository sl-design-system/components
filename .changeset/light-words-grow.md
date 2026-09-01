---
'@sl-design-system/select': patch
---

Fix `sl-select` blur behavior:

- Emit `sl-blur` when clicking outside, including non-focusable content.
- Prevent duplicate `sl-blur` events in the same focus session.
- Keep clear-button blur behavior consistent when focus leaves the field.

Also update select focus-ring behavior to use keyboard-visible focus (`:focus-visible`).
