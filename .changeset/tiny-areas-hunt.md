---
'@sl-design-system/form': patch
---

Fix `sl-label` not updating when the locale changes. The label now only moves text and element nodes into the `<label>` element, leaving Lit's internal comment markers in place so the parent component can properly re-render translated content.
