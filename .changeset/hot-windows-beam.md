---
'@sl-design-system/button': minor
---

Various improvements:
- Fix missing inverted + disabled styling
- Add support for `aria-disabled="true"`

This adds the ability to "disable" a button using `aria-disabled="true"` instead of the `disabled` attribute. This is useful in cases where you want to disable a button but still want it to be focusable (for example, when using tooltips). There is visually no difference between the two.
