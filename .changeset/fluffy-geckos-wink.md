---
'@sl-design-system/radio-group': patch
'@sl-design-system/text-field': patch
'@sl-design-system/checkbox': patch
'@sl-design-system/textarea': patch
'@sl-design-system/select': patch
'@sl-design-system/switch': patch
'@sl-design-system/form': patch
---

Fix builtin vs custom validation behavior

This add a new `sl-validate` event that is fired when the validity of the form control is updated. It fires *after* any builtin validation has been performed, so it can be used to override the validity of the control.
