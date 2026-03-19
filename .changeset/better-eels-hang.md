---
'@sl-design-system/tag': patch
---

added a 0.5px buffer to the tag list visibility calculation to prevent layout oscillation (flickering) caused by sub-pixel rounding errors at certain zoom levels
