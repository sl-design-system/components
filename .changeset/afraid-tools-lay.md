---
'@sl-design-system/tooltip': minor
---

Adds support for passing a config object to the tooltip directive (same as `Tooltip.lazy`).
The directive now accepts either a string (content) or a `TooltipConfig` with configurable properties like: `position`, `maxWidth`, `ariaRelation`, `context` and `parentNode`.