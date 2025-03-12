---
'@sl-design-system/checkbox': patch
'@sl-design-system/switch': patch
---

Accessibility improvements - fix Axe error where component has 2 labels by hiding the internal one from ARIA and instead using `aria-labelledby` on the `<input>`.

Details about [Axe error can be found here](https://dequeuniversity.com/rules/axe/4.10/form-field-multiple-labels?application=axeAPI).
