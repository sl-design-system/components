---
'@sl-design-system/toggle-button': patch
---

Updated sl-toggle-button to use aria-labelledby for its tooltip connection when in icon-only mode. This ensures better accessibility and prevents duplicate labels by removing the redundant aria-label attribute from the host element while preserving its property value
