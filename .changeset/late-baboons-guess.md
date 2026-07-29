---
'@sl-design-system/panel': patch
---

Fix an accessibility issue where panels without actions rendered an empty toolbar in the header. The toolbar is now only rendered when the actions slot contains elements, preventing screen readers from announcing an empty toolbar.
