---
'@sl-design-system/text-area': patch
---

The default number of rows is now explicitly set to 3 (previously it mimiced the browser default of 2). The `--sl-text-area-rows` CSS custom property has been removed and replaced with an internal css-variable for better minimum height handling; this means you only need the `rows` property to set the height of the text-area and no longer need to set `--sl-text-area-rows` when the minimum height is smaller than 3 rows.

If you currently have a scenario where you set `--sl-text-area-rows` to a bigger value than `rows` this will be a "breaking" change in your application. It will still work, but it might look different.
For example, if you have a component with `rows=6` and `--sl-text-area-rows: 7`, with this version it will get a height of `6lh`, making it smaller than in the previous version.

