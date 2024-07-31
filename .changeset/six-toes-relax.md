---
'@sl-design-system/popover': minor
'@sl-design-system/select': minor
'@sl-design-system/shared': minor
'@sl-design-system/menu': minor
---

Fixed issue where popover was too small to show any content even if there was space on the other side of the anchor component.
The way to set the min and max size of the popover have changed: use the following properties instead of setting the width directly on the popover. (Those values will be ignored when calculating the size of the popover as it can exist in the available space)
--sl-popover-min-block-size
--sl-popover-max-block-size
--sl-popover-max-inline-size
