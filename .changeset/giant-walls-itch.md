---
'@sl-design-system/text-field': patch
---

Various bug fixes:
- Fix selector for field button not matching when not slotted
- Fix nested slotted `<input>` logic not working correctly
- Rename private `#syncInput` to public `updateInputElement` method that can be overridden
