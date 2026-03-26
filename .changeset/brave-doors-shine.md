---
'@sl-design-system/button': major
---

Use a native `<button>` element inside the shadow DOM instead of simulating button behavior on the host element

This change replaces the custom keyboard handling and ARIA role setup with a proper native button. Focus is now delegated to the inner button via `delegatesFocus`. The `icon-only` attribute has been replaced with a `:state(icon-only)` CSS custom state.
