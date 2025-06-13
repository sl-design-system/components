---
'@sl-design-system/grid': minor
---

This adds a new property `row-action` and removes the `selects` property. Using `row-action="activate"` will now activate the row when clicked, while `row-action="select"` will select the row. The `selects` property is no longer supported.

You should always have an interactive element inside the row, such as a button or link, to ensure proper accessibility and user experience. Do not rely on just `row-action` for interaction.
