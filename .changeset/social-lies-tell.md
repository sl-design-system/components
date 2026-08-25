---
'@sl-design-system/radio-group': minor
'@sl-design-system/checkbox': minor
---

Added `description` and `tooltip` support to `sl-checkbox` and `sl-radio`:

- Added `description` property and `slot="description"` for rendering helper/description text below the label.
- Added `tooltip` property to easily render an accessible description tooltip.
- Wrapped label and description inside `part="content"`.
- Associated description text with the form control via `aria-describedby`.
- Reflected presence of description with `has-description` host attribute.
