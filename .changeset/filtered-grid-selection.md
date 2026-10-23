---
'@sl-design-system/grid': patch
'@sl-design-system/data-source': patch
---

Limit the grid header selection toggle to filtered array data and calculate its checked state from those results. Preserve hidden selections when deselecting filtered rows, including grouped and paginated data.

Synchronize group selection markers after filtered batch changes. Use known unfiltered remote totals when resetting select-all, without treating estimated or filtered counts as the complete dataset.
