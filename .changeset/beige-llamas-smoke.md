---
'@sl-design-system/virtual-list': patch
'@sl-design-system/combobox': patch
---

Improved virtual list scrolling and grouped option behavior.

- Fixed `scrollMargin` handling so automatic window-scroll offsets are not overwritten by an implicit `0`, and clearing `scrollMargin` restores automatic behavior.
- Kept cached virtual-list measurements enabled internally for more stable rendering
- Prevented grouped combobox headers from being matched and selected as regular options
- Updated virtual-list and listbox stories to use deterministic `auto` scrolling and rerender selected item state correctly near the end of long lists
