---
'@sl-design-system/switch': major
---

`<sl-switch>` is now the form associated element itself. It uses `ElementInternals` for the form value and validity, and renders an `<input type="checkbox" role="switch">` in its shadow DOM as the control for the keyboard and assistive technology, following the [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/switch/examples/switch-checkbox/). ARIA attributes are forwarded to that input by `ForwardAriaMixin`, so `aria-disabled` now works: the switch looks disabled and cannot be toggled, but stays focusable, so a tooltip can explain why.

#### Breaking changes

- The switch no longer adds an `<input>`, a `<label>` and a `<style>` element to its light DOM, and the `input` slot has been removed. The `input` property now returns the input in the shadow DOM and is marked internal.
- The `formControlElement` is now the switch itself, so a `<label for="...">` should point at the id of the `<sl-switch>` element.
- The `checked` property is no longer reflected. Style the on state with the `checked` custom state (`sl-switch:state(checked)`) instead of the `[checked]` attribute selector; setting the attribute to give the switch its initial state still works.
- Calling `click()` no longer toggles the switch. Use the new `toggle()` method instead.

#### New features

- `toggle(force?)` toggles the switch from JavaScript the same way a user would: it emits an `sl-change` event and marks the switch as dirty. Pass `true` or `false` to set a specific state.
- The `tooltip` property shows a tooltip without having to add an `<sl-tooltip>` yourself, the same way `<sl-button>` does. It describes the switch, or labels it when the switch has no label.
- The `description` slot shows additional information below the label, linked to the control with `aria-describedby`.
- New CSS parts: `container`, `description`, `label`, `tooltip` and `wrapper`.
- New CSS states: `checked`, `has-description`, `has-infotip` and `no-label`.
