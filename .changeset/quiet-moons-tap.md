---
'@sl-design-system/toggle-group': minor
---

Update the group styling for the refactored toggle button

`@sl-design-system/toggle-button` has a major release in which the `[pressed]`, `[icon-only]`,
`[text-only]`, and `[error]` attributes were replaced by CSS custom states. The group styles its
slotted buttons, so it now targets `::slotted(sl-toggle-button:state(pressed))` instead of the
`[pressed]` attribute. The border radius of the first and last button is also applied through the
`--_button-border-radius` custom property rather than separate corner properties.

> [!IMPORTANT]
> Upgrade `@sl-design-system/toggle-group` and `@sl-design-system/toggle-button` together. These
> styles do not match an older toggle button, and the group only manages buttons that are instances
> of the `ToggleButton` class it was built against, so mixing versions leaves the pressed state
> unstyled and breaks keyboard navigation and single-select behavior.
