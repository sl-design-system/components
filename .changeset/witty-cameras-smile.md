---
'@sl-design-system/listbox': patch
---

Accessibility improvements for listbox screen reader support

- Always set `aria-selected` on options, including grouped options in the selected group
- Set correct `aria-posinset` and `aria-setsize` on virtualized options, excluding group headers from the count
- Add group label context to the accessible name of grouped options for Safari/VoiceOver compatibility
