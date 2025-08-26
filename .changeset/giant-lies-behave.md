---
'@sl-design-system/form': minor
---

Various improvements & fixes
- Add support for more than 1 form control per form-field
- Add `for` property to `<sl-error>` so it is linked to the form control
- Add `controls` getter to `FormController` that returns a record when the form control name as key
- Add `controls` part to the form-field template so you can customize the layout
- Fix missing label in `<sl-form-validation-errors>` for `<sl-select>`
