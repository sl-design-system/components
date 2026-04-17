---
'@sl-design-system/panel': patch
---

Fixed an accessibility issue where non-collapsible panels rendered `aria-labelledby` on the body container without a `region` role. `aria-labelledby` is now applied only when the panel is collapsible (and the body is a `region`), preventing duplicate heading announcements in screen readers and resolving ARIA prohibited attributes warnings.
