---
'@sl-design-system/menu': patch
---

- `MenuButton` and `Button` now correctly block click/keyboard activation when `aria-disabled` is set, but remain focusable for improved accessibility and tooltip support.
- Standalone `MenuButton` continues to use native `disabled` to remain non-focusable, while support for `aria-disabled` focusability has been improved.
