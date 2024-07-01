---
'@sl-design-system/dialog': patch
---

Remove any margin on the slotted (sub)title

This fixes the use of a heading element (`<h1>` for example) as the dialog (sub)title: heading elements by default have block margins.
