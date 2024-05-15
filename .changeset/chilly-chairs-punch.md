---
"@sl-design-system/form": patch
---

Support composite form fields

The `<sl-form-field>` component now supports more than 1 form control. The first form control will be the main control and the rest will be secondary controls. Only the first control will be linked to the field's label and help text. If the first form control does not have a validation message, then the second form control that does will be used etc. This allows for more complex fields like a radio group, with an "other" option that enables a text field when selected.
