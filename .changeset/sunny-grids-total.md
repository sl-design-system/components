---
'@sl-design-system/grid': minor
---

Add a summary row (grand totals) to the grid. Set `summary-type` (`number`, `text` or `boolean`) on a column to show a total: the sum or average of numbers, the count of non-empty text values, or the count, fraction or percentage of boolean values. The totals are calculated for all rows matching the active filters, across all pages. Use `summary-format` to fix the format of a column, `summary-label` to add a label, `summary-menu` to let the user change the format of boolean totals, and `summary` for custom content. The grid has `summary-position` (`bottom` by default, or `top`), `summary-format` and `summary-scope` (`all` or `page`) properties.
