---
'@sl-design-system/time-field': patch
'@sl-design-system/tag': patch
---

Use the `@cssState` decorator for the remaining custom CSS states

The `has-value` state on `sl-time-field` was documented and styled, but never actually set, so a
time field with a value rendered it in the muted placeholder color instead of
`--sl-color-foreground-plain`. It is now set from the `value` accessor, matching `sl-date-field`.

The `has-focus` (time field) and `focus-visible` (tag) states are now declared with `@cssState`
instead of being added and removed by hand. These states are applied when the component updates
rather than synchronously, which is still before the browser paints.
