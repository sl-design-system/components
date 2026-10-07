---
'@sl-design-system/form': minor
---

Add `announce-errors` to `<sl-form>` to control automatic screen reader announcements for individual field validation errors when they are shown.

`announce-errors` is enabled by default. Set `announce-errors="false"` when you show aggregated error messaging instead (for example a single `<sl-inline-message>` with all errors), otherwise screen readers can announce both the field error and the aggregated summary. Form-field level announcement control is internal.
