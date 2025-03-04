---
'@sl-design-system/number-field': minor
'@sl-design-system/search-field': minor
'@sl-design-system/text-field': minor
---

Refactor field buttons to `<sl-field-button>` component

This new component is not a top-level component. It is just a button
meant to be used with a text field related component.

This also fixes several bugs where hover/active styling did not apply to
slotted buttons.