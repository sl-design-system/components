---
'@sl-design-system/grid': minor
---

Add an opt-in `keyboard-navigation="arrows"` variant with arrow-key navigation across cells and headers, a single tab stop and restoration of the last focused cell.

Support configurable page navigation through `keyboard-page-size`, text editing with Enter to save and Escape to discard, and access to multiple controls through a dedicated button. Edits are also saved when focus leaves the cell. Include support for virtualized rows, select components, grouped rows, bulk actions and disabled controls. The edit and access buttons use `<sl-button>` and the editor uses `<sl-text-field>`, so they match the design system.

Preserve column indices, header associations and sticky positioning in text-field and select columns.
