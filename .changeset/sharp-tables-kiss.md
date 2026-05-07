---
'@sl-design-system/form': patch
---

Accessibility improvements:

- Automatically communicate label ID to associated form controls via `data-label-id` attribute, enabling proper `aria-labelledby` associations
- Clean up `data-label-id` attribute when label is disconnected or form control changes
