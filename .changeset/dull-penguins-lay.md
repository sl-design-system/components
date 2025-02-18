---
'@sl-design-system/select': major
---

BREAKING: Remove `<sl-select-option>` and `<sl-select-option-group>` and use `<sl-option>` and `<sl-option-group>` from the `@sl-design-system/listbox` package instead.

This change was made to align the select component with the listbox component. The listbox component is a more flexible and powerful component that can be used to create a variety of custom select-like components.

To update your code, replace all instances of `<sl-select-option>` with `<sl-option>` and `<sl-select-option-group>` with `<sl-option-group>`. Make sure you have those custom elements loaded. If not, you can import them from the `@sl-design-system/listbox` package.

Various improvements:
- Add `clearable` property for clearing the selection
- Add `aria-hidden="true"` to the placeholder content
- Add `aria-placeholder` to the `<sl-select-button>` when the placeholder is shown
- Hide the listbox popover when focus leaves the `<sl-select>` component
- Show the listbox popover immediately; only animate it when closing
- Focus the actual options in the listbox and don't use `aria-activedescendant`
