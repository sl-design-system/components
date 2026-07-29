---
'@sl-design-system/angular': patch
---

The `slTooltip` directive no longer creates an `<sl-tooltip>` element when the tooltip text is
empty. Previously an empty tooltip was always inserted, which gave the anchor element an empty
accessible name or description. The tooltip is now created as soon as the text becomes non-empty
and removed again when it becomes empty.
