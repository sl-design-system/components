---
'@sl-design-system/button': minor
---

Add `tooltip` property to button

Previously, adding a tooltip to a button required adding a sibling `<sl-tooltip>` element manually and wiring up the correct `aria-describedby` or `aria-labelledby` relationship by hand. This was especially cumbersome for icon-only buttons, where the tooltip doubles as the accessible label.

The new `tooltip` property improves the Developer Experience by letting you attach a tooltip directly on the button:

```html
<sl-button tooltip="Delete item">
  <sl-icon name="trash"></sl-icon>
</sl-button>
```

The button handles all the accessibility wiring automatically:

- For **icon-only buttons** the tooltip text acts as the accessible label (`aria-labelledby`).
- For **text buttons** the tooltip text acts as an accessible description (`aria-describedby`).
