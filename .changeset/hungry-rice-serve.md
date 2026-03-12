---
'@sl-design-system/menu': patch
---

- `MenuButton` and `Button` now correctly block click/keyboard activation when `aria-disabled` is set, but remain focusable for improved accessibility and tooltip support.
- `MenuButton` no longer passes native `disabled` to its internal button to maintain focusability.
