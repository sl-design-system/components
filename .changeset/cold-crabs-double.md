---
'@sl-design-system/grid': minor
---

Improve drag-and-drop behavior for grouped grids.

- Add support for dragging complete group rows (`tr[part~='group']`) and dropping them to reorder groups.
- Let users drop rows on a group header to move rows into that group.
- Add `group-label` to `sl-grid-group-header` so the group checkbox gets a clear `aria-label` (for example, `School A group`).
- Fix `sl-grid-drop` `position` in `between` mode — was always `'after'`, now correctly `'before'` or `'after'`.
- Improve drag feedback and refresh timing so reordered rows become visible immediately after drop.
