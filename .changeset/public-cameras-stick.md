---
'@sl-design-system/grid': minor
---

Refactor row activation to work with keyboard

This change removes the `activatable-row` property and instead leaves it to the user to set the `activeRow` property on the `sl-grid` component. The examples in Storybook now also use a button with an avatar to activate the row, which is more accessible than using a checkbox. This fixes the issue we had before where we could not find a solution how to make the row activatable with the keyboard, while also keeping the checkbox for selection. Now, the row can be activated with the keyboard by focusing the button and pressing Enter or Space. And at the same time, the checkbox can still be used for selection.
