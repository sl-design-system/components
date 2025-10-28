---
'@sl-design-system/button': patch
---

Replace `slotchange` with `MutationObserver` so text changes are also detected.

This fixes a bug in Angular where the text content of the button is changed after the custom element has been initialized, but the `slotchange` event does not fire. Due to `slotchange` not firing, the `icon-only` attribute isn't removed and the button styling breaks. Using a `MutationObserver` allows us to detect changes to the text content within the slot and fix the bug.
