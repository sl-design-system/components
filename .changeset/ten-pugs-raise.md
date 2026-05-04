---
'@sl-design-system/tooltip': major
---

Reworks tooltip hover timing to use fixed, non-configurable delays for more consistent UX:

- Show delay is now fixed at `500ms` and is no longer configurable.
- Hide delay is now fixed at `200ms` and is no longer configurable.
- Tooltip fade timing has been tuned for smoother open/close transitions.

`show-delay` and `hide-delay` are deprecated legacy aliases kept for backward compatibility only and no longer affect runtime behavior.
