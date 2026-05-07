---
'@sl-design-system/tooltip': major
---

Reworks tooltip hover timing to use fixed, non-configurable delays for more consistent UX:

**Breaking change:** custom tooltip hover timing is no longer supported.

- Show delay is now fixed at `500ms` and is no longer configurable.
- Hide delay is now fixed at `200ms` and is no longer configurable.
- Tooltip fade timing has been tuned for smoother open/close transitions.

`show-delay` and `hide-delay` have been removed from the tooltip API. Custom hover timing is no longer supported.
