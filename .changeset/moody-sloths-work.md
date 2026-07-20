---
'@sl-design-system/select': patch
---

Fix `sl-select` selected content rendering when projected option content temporarily has a non-document root, such as during Angular light DOM updates. The component now preserves scoped custom element importing when available and falls back to the node owner document otherwise.
