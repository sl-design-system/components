---
'@sl-design-system/checkbox': major
---

Change `formValue` behavior to be boolean instead of `'on'`

This is a breaking change. Even though `'on'` matches the HTML standard, it is not the most common use case for a checkbox. This change will make it easier to use the component in most cases.

This also makes it possible to use a boolean when setting the value of the checkbox in a form using `FormController`.
