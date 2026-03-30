---
'@sl-design-system/button-bar': major
---

Replace the `icon-only` attribute with a `:state(icon-only)` CSS custom state

The `iconOnly` property and `icon-only` attribute have been removed. The button bar now uses a CSS custom state (`:state(icon-only)`) to indicate when it only contains icon-only buttons. It also detects icon-only buttons using `:state(icon-only)` instead of the `icon-only` attribute.

The component is backward compatible with older button versions that use the `icon-only` attribute, so no manual updates should be needed. However, we recommend updating to the latest version of `@sl-design-system/button` to take advantage of the new features and improvements.

The `iconOnly` property was marked as internal API and was only used to set the `icon-only` attribute, so this change should not affect any public API. The button bar will automatically apply the `:state(icon-only)` state when it contains only icon-only buttons, so no manual updates should be needed.
