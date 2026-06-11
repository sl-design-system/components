---
'@sl-design-system/paginator': patch
'@sl-design-system/button': patch
---

Fix paginator selected page styling for `emphasis="bold"` by driving page button appearance via `fill`/`variant` (selected uses `variant="primary"` with `fill="solid"` for bold and `fill="outline"` for subtle), while keeping `aria-current="page"` for accessibility.

Update `sl-button` interaction styling so `fill="ghost"`/`fill="outline"` use the plain hover/active opacity tokens, and outline buttons marked `aria-current="page"` get a selected border color.
