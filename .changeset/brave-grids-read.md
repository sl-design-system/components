---
'@sl-design-system/grid': patch
---

Fix column headers and cells being announced incorrectly by screen readers for column groups.

Accessibility improvements:

- Headers inside a column group are now exposed as cells, so VoiceOver reads them only once and no longer pairs them with the wrong group header.
- Group headers now have `aria-colindex` and `aria-colspan` and can be focused.
- Cells in a column group are now named by their group header(s) and column header, for example "Name First name Sophie".
- Form controls (text field and select) in grouped columns now include the group header(s) in their label.
- Columns with `hide-header-text` now set `aria-label` on the header, also for column groups.
- `aria-sort` is only set on headers that are real column headers.
- Hidden columns are now counted in `aria-colcount` and `aria-colindex`, as they are still rendered.

Fixes:

- Adding or removing a column in a column group now updates the header rows, accessibility attributes and column widths.
- Removing a sorted or filtered column from a column group now also removes its sort or filter from the data source.
- Header cells are now keyed by column, so removing a column no longer mixes up the filter and sort controls of the remaining columns.
