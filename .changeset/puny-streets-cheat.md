---
'@sl-design-system/tool-bar': patch
---

Fix missing labels for `sl-menu-button` items rendered in the tool-bar overflow menu when mapping happens before ARIA forwarding is ready (e.g. nested slot scenarios such as Grid bulk actions).

The overflow mapping now falls back from forwarded ARIA name/description to host `aria-labelledby` / `aria-label`, and finally to `slot="button"` text content, ensuring labels remain visible
