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
- A `toggle(force?)` method that flips the checked state as if the user activated the checkbox: it
  emits `sl-change`, marks the control dirty and updates its validity.
- Proper form association: the checkbox contributes its value to the surrounding `<form>` and
  restores its initial state on reset.
