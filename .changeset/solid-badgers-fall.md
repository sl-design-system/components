---
'@sl-design-system/paginator': patch
'@sl-design-system/button': patch
---

Fix paginator page-state styling and align selected/non-selected interaction states with design tokens.

Paginator now drives page button colors via dedicated `--sl-button-*` CSS variables, including hover/active state opacity differences for subtle vs bold emphasis.

Button now supports these external style overrides in its background/color rendering with safe fallbacks to internal defaults, enabling parent components (such as paginator) to control state styling without breaking existing behavior.
