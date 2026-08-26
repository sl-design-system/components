---
'@sl-design-system/toggle-button': major
---

Refactor toggle button to use an internal `<button>` element. This improves accessibility and removes the need for manual keyboard and ARIA handling.

**Breaking changes**

- The `[icon-only]`, `[text-only]`, and `[error]` attributes have been replaced by CSS custom states (`:state(icon-only)`, `:state(text-only)`, `:state(error)`). Update any custom styles targeting these attributes. The `[pressed]` attribute is unchanged and still reflects the `pressed` property.
- The `shape` property type has changed from `ButtonShape` to `ToggleButtonShape` (`'rect' | 'pill'`).
- The `label` property (previously reflected as `aria-label`) has been removed. Use the new `tooltip` property instead.

**New features**

- Added a `tooltip` property for declaratively adding a tooltip. For icon-only buttons the tooltip acts as the accessible label; for other buttons it acts as an accessible description.
- Added CSS parts `button` and `tooltip` for styling the internal elements.
- Focus is now delegated to the internal `<button>` via `delegatesFocus: true`.
- ARIA attributes set on the host are now forwarded to the internal `<button>` via `ForwardAriaMixin`.
