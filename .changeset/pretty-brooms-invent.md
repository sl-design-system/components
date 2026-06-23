---
'@sl-design-system/select': patch
---

Accessibility improvements for select screen reader support

- Set `aria-activedescendant` when the popover opens so screen readers announce the current option immediately
- Set `aria-activedescendant` on mouse-open so AT context is maintained without applying a visual highlight
- Remove `aria-owns` from the select trigger/input because it is not needed for this implementation
- Always set `aria-selected` on options, including grouped options in the selected group
- Set correct `aria-posinset` and `aria-setsize` on virtualized options, excluding group headers from the count
- Add group label context to the accessible name of grouped options for Safari/VoiceOver compatibility
