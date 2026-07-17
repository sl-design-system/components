---
'@sl-design-system/grid': patch
---

Added accessible names to text field and select controls rendered inside editable grid cells. New `formControlColumnLabel` and `formControlLabel` properties can be used to customize the generated label with column and row context, such as `Zip John Doe` or `Status John Doe`, improving screen reader navigation in editable grids.
