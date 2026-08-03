---
'@sl-design-system/checkbox': major
---

`sl-checkbox` is now a form associated custom element: the host element _is_ the form control,
rather than a wrapper around an `<input type="checkbox">`. All state is exposed through
`ElementInternals`, so there is no light DOM `<input>` or `<label>` to keep in sync anymore.

Breaking changes:

- The `input` property has been removed, along with the `input` and `label` slots. Anything that
  reached into `sl-checkbox` for its `<input>` (`checkbox.input`, `querySelector('input')`) needs to
  target the `sl-checkbox` element itself.
- The `no-label` attribute has been replaced by the `no-label` custom state, so style it with
  `:host(:state(no-label))` / `sl-checkbox:state(no-label)` instead of `sl-checkbox[no-label]`.
- The checkbox is now the focusable element, so focus, `tabindex` and ARIA all live on the host. A
  checkbox that should not be a tab stop of its own can opt out with `tabindex="-1"`, which the
  component preserves (a disabled checkbox is never focusable regardless).

New:

- A `checked` custom state, so a checked checkbox can be styled with `:state(checked)`.
- A `toggle(force?)` method that flips the checked state: it emits `sl-change`, marks the control
  dirty and updates its validity. Unlike clicking, it does not check whether the checkbox is
  disabled.
- Proper form association: the checkbox contributes its value to the surrounding `<form>` and
  restores its initial state on reset.

`sl-checkbox-group` now uses the `focusgroup` attribute for keyboard navigation instead of the
`RovingTabindexController`.

Breaking changes:

- `disabled` and `required` no longer reflect to attributes, so `sl-checkbox-group[disabled]` and
  `sl-checkbox-group[required]` selectors no longer match. Use the properties instead.
- The checkboxes are now wrapped in a `[part="wrapper"]` element, which carries `role="group"`
  instead of the host. The new `wrapper` CSS part is exposed for styling.
- Only slotted `sl-checkbox` elements count as group members now, so other elements (an `sl-tooltip`
  belonging to one of the checkboxes, for example) can be slotted without becoming part of the
  value.

Note that `focusgroup` is not yet implemented by any browser. Until it is, applications need to load
a polyfill such as `@microsoft/focusgroup-polyfill` for keyboard navigation to work.
