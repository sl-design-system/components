---
'@sl-design-system/dialog': patch
---

Added an animation of 0.001 seconds on open and close when reduced motion is on, otherwise the 'animationend' event isn't triggerd and the dialog doesn't close. (0s causes it still not to work in older versions of safari)
