---
'@sl-design-system/text-field': patch
---

When the text-field was smaller than a default native input field the suffix icon would fall outside the container. The minimum width of the input has been set to 0 so it won't push the icon out any more.
