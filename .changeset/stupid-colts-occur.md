---
'@sl-design-system/form': minor
---

Add support for `<sl-infotip>`

This adds support for the new `sl-infotip` component, which is designed to be placed in the `infotip` slot of `<sl-label>`. When used, it automatically links its content to the associated form control's native input via `aria-describedby`, ensuring that screen readers announce the infotip content when the input receives focus.
