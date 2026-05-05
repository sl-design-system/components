---
'@sl-design-system/combobox': patch
---

Fix `filter-results` behavior in `sl-combobox` when leaving the field without selecting an option.

Previously, typing a search value and blurring the component could clear the input while keeping the internal filtered state, so reopening the list showed only stale filtered results.
Now, when focus leaves the component, filtered option visibility is reset to match the restored input value.

Also adds a regression test for the flow: type search text -> leave combobox (click/Tab) -> return to combobox.
