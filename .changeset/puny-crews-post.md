---
'@sl-design-system/text-area': minor
---

The default number of rows is now explicitly set to 3 (previously relied on browser default of 2), and the minimum height now properly respects the `rows` attribute when resizing. The `--sl-text-area-rows` CSS custom property has been removed and replaced with an internal css-variable for better minimum height handling; this means you only need the `rows` property to set the height of the text-area.

If you have a scenario where you set `--sl-text-area-rows` to a bigger value than `rows` this will be a "breaking" change in your application. It will still work, but it might look different.

