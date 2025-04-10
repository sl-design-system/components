---
'@sl-design-system/icon': minor
---

Icons now scale with text size; both set in css and by using browser (text) zoom. 
When an explicit font size is set to the parent of the icon, or if a user uses (text) zoom in the browser the icon will use the maximum value of either the set size or 1cap of the current font-size.
- Now uses new contextual tokens.
- Removed `--sl-icon-container-size`; the container now always has the same size as the icon. Use margin or an extra wrapper to create extra space around the icon when necessary.

