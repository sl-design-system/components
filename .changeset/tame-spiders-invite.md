---
'@sl-design-system/switch': major
---

`<sl-switch>` no longer adds an `<input>` element to the light DOM. The switch itself is now the form associated element, using `ElementInternals` for the form value and validity, and it renders an `<input type="checkbox" role="switch">` in its shadow DOM as the control for the keyboard and assistive technology, following the [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/switch/examples/switch-checkbox/).

ARIA attributes set on the switch are forwarded to that input by `ForwardAriaMixin`, the same way `<sl-button>` and `<sl-checkbox>` do it. This also means `aria-disabled` now works: the switch looks disabled and cannot be toggled, but stays focusable, so a tooltip can explain why.

#### Breaking changes

- The `input` property now returns the `<input>` in the shadow DOM instead of the one in the light DOM, and is marked internal.
- The `input` slot has been removed; slotting your own `<input>` is no longer supported.
- The switch no longer adds an `<input>`, a `<label>` and a `<style>` element to its light DOM. If you relied on those elements being there, for example in tests or in CSS, you need to update your code.
- The `formControlElement` is now the switch itself, so a `<label for="...">` should point at the id of the `<sl-switch>` element.
- The `checked` property is no longer reflected to an attribute. Style the on state with the `checked` custom state (`sl-switch:state(checked)`) instead of the `[checked]` attribute selector. Setting `checked` as an attribute to give the switch its initial state still works.

#### New `description` slot

The switch can show additional information below the label, indented to the same level as the label:

```html
<sl-switch>
  Receive notifications
  <span slot="description">We will send you an email when something happens</span>
</sl-switch>
```

The description is linked to the control with `aria-describedby`, so screen readers announce it along with the label.

#### New CSS parts

- `description` - The wrapper around the description
- `input` - The visually hidden input element
- `label` - The wrapper around the label text
- `tooltip` - The tooltip shown when the `tooltip` property is set
- `value` - The wrapper around the label and the infotip

#### New CSS states

- `checked` - Set when the switch is on
- `has-description` - Set when there is text in the description slot
- `has-label` - Set when there is text in the default slot

#### New `tooltip` property

The switch can show a tooltip, the same way `<sl-button>` does, without having to add an `<sl-tooltip>` yourself:

```html
<sl-switch aria-disabled="true" tooltip="Ask your teacher to unlock this setting">
  Enable Dyslexia-Friendly Font
</sl-switch>
```

When you hover anywhere on the switch, the tooltip is centered on the switch as a whole; when the toggle has focus, the tooltip is centered on the toggle. The tooltip describes the switch, unless the switch has no label, in which case it labels the switch.
