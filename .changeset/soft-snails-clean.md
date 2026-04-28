---
'@sl-design-system/tool-bar': patch
---

Fix overflow behavior:
- Refactor overflow logic to more accurately calculate visible items, reserve space for the menu button, and handle the menu button margin correctly when all items are hidden.
- Update `tool-bar.ts` to use the new measurement utilities (`measureMenuButtonWidth` and `measureConstrainedWidth`) for more reliable overflow calculations.
- Update toolbar styles to prevent layout shifts during measurement and ensure correct sizing in flexible containers.
