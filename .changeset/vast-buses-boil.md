---
'@sl-design-system/radio-group': patch
---

Fix bug where radiogroup is invalid even though it has an initial value

The validity was not updated as part of the `slotchange` handler, causing the radiogroup to be invalid on initial render even though one of the radios was checked. This has been fixed by calling `#updateValueAndValidity` at the end of the `slotchange` handler.
