---
'@sl-design-system/button': minor
'@sl-design-system/menu': minor
'@sl-design-system/tag': minor
'@sl-design-system/toggle-button': minor
---

Add `tooltip` property

Previously, adding a tooltip to any kind of component required adding a sibling `<sl-tooltip>` element manually and wiring up the correct `aria-describedby` or `aria-labelledby` relationship by hand. This was especially cumbersome for icon-only buttons, where the tooltip doubles as the accessible label.

The new `tooltip` property improves the Developer Experience by letting you set a tooltip directly on the component.

For buttons, it handles all the accessibility wiring automatically:

- For **icon-only buttons** the tooltip text acts as the accessible label (`aria-labelledby`).
- For **text buttons** the tooltip text acts as an accessible description (`aria-describedby`).
