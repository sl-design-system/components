---
'@sl-design-system/button': patch
---

Fixed styling of slotted `<a href>` elements inside `<sl-button>`. Global CSS from the application could override the link color and text decoration, causing the button to render incorrectly.

> **Note:** Slotting an `<a href>` inside an `<sl-button>` is considered bad practice. Use an `<a href>` directly. There are already styles for that in the theme's `global.css`.
