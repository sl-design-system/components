---
'@sl-design-system/button-bar': minor
---

Add ability to style using `:state(icon-only)` and `:state(empty)`

The `.icon-only` class still works, but the new `:state()` pseudo-class allows for more flexible styling and is more in line with how states are typically handled in CSS. The `:state(icon-only)` pseudo-class applies when all buttons in the button bar are icon-only, while the `:state(empty)` pseudo-class applies when there are no buttons in the button bar.
