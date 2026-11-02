---
'@sl-design-system/grid': patch
---

Accessibility improvements:

- The checkbox in each group header now has a unique name that includes the name of the group, for example "Select group Allergist",
- The row checkboxes in `sl-grid-selection-column` now have a unique name that includes the row context, for example "Select row John Doe". Use the `formControlLabel` property of the column to provide the row label.
