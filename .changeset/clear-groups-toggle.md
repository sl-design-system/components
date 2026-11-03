---
'@sl-design-system/grid': patch
---

Accessibility improvement: the toggle button in each group header now has a unique name that includes the name of the group, for example "Toggle group Allergist". The name is set with `aria-labelledby`, so it also works with a custom `groupHeaderRenderer`.
