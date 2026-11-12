---
'@sl-design-system/grid': patch
'@sl-design-system/data-source': patch
---

Limit the grid header selection toggle to filtered array data and calculate its checked state from those results. Preserve hidden selections when deselecting filtered rows, including grouped and paginated data.

Synchronize group selection markers after filtered batch changes. Use known unfiltered remote totals when resetting select-all, without treating estimated or filtered counts as the complete dataset.

Invalidate underestimated remote totals when fetched rows exceed them. Index unfiltered group membership for efficient batch reconciliation, preserve single-selection group members, and disable the select-all checkbox for empty results.

Recalculate aggregate lower bounds after every remote response, including filtered totals, empty pages, and partially known group totals. Reset stored selection ids when an unfiltered refresh shrinks the dataset, while preserving select-all without exclusions.
