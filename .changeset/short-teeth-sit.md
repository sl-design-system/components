---
'@sl-design-system/number-field': patch
'@sl-design-system/text-field': patch
---

Fix unnecessary `sl-change` event being emitted on blur

This causes a chain of events that results in not being able to select a row in the data grid after filtering.
