---
'@sl-design-system/button-bar': minor
---
`
Add `fill` and `variant` properties, similar to `size` that will be applied
to all child buttons. This can especially be useful when embedding the button bar
in another component where the buttons are slotted. This way the developer doesn't
have to set the same properties on each button manually.
