---
'@sl-design-system/tooltip': major
---

Reworks tooltip hover timing to use fixed, non-configurable delays for more consistent UX:

- Show delay is now fixed at `500ms`.
- Hide delay is now fixed at `200ms`.
- Tooltip fade timing has been tuned for smoother open/close transitions.

`show-delay` and `hide-delay` are now deprecated legacy aliases and no longer affect runtime behavior.
