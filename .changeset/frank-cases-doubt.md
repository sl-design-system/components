---
'@sl-design-system/grid': minor
---

Add an opt-in `keyboard-navigation="arrows"` variant with arrow-key navigation across cells and headers, a single tab stop and restoration of the last focused cell.

Support configurable page navigation through `keyboard-page-size`, text editing with Enter to save and Escape to discard, and access to multiple controls by pressing Enter or Space on the focused cell. Edits are also saved when focus leaves the cell. Include support for virtualized rows, select components, grouped rows, bulk actions and disabled controls. Edit buttons use `<sl-button>` and editors use `<sl-text-field>`. Cells with multiple controls receive focus as a whole. Restore focus to the menu trigger after Escape closes its popup, and keep edit focus indicators visible inside the cell.

Preserve column indices, header associations and sticky positioning in text-field and select columns.
