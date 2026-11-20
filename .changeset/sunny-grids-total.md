---
'@sl-design-system/grid': minor
---

Add a grand totals row to the grid. Set `grand-totals-type` (`number`, `text` or `boolean`) on a column to show a total: the sum or average of numbers, the count of non-empty text values, or the count, fraction or percentage of boolean values. The totals are calculated for all rows matching the active filters, across all pages.
Use `grand-totals-format` to fix the format of a column, `grand-totals-label` to add a label, `grand-totals-menu` to let the user change the format of boolean totals, and `grandTotals` for custom content. The grid has `grand-totals-position` (`bottom` by default, or `top`), `grand-totals-format` and `grand-totals-scope` (`all` or `page`) properties.
