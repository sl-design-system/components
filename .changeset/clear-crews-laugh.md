---
'@sl-design-system/button': patch
---

Fixed styling of slotted `<a href>` elements inside `<sl-button>`. Global CSS from the application could override the link color and text decoration, causing the button to render incorrectly.
