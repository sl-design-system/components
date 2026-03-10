---
'@sl-design-system/date-field': patch
---

Fix positioning of popover when there's not enough space

Due to the calendar element lazy rendering, the anchor directive was initialized before the calendar element was rendered. This caused the directive to calculate the position of the popover based on the height of the popover without the calendar. When the calendar was later rendered, the popover became taller and there was not enough space to position the popover at the bottom.

This problem will not happen when CSS Anchor Positioning is used. This standard is already supported in all latest browsers, but in some older versions (which we still support), it doesn't work.

The anchor directive has been changed so you can tell it to do nothing if CSS Anchor Positioning is supported. In that case, the directive will only initialize if the browser does not support CSS Anchor Positioning. This way, the popover will be positioned correctly in all browsers.
