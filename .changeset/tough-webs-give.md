---
'@sl-design-system/grid': minor
---

Various improvements:
- Bulk selection actions are now shown in a floating tool-bar instead of replacing the header
- Filter column uses inline filters instead of popovers
- Filter column inherits from the sort column
- Filter column now supports custom filter functions
- Selection column now supports clicking anywhere inside the cell
- Sort column uses the new contextual tokens
- Fixes unregistering filter & sort columns
- Fixes styling issue with rows scrolling underneath a sticky header
- Fixes unnecessary updates to data-source, view-model and grid
- New `waitForGridToRenderData` utility method to be used in tests; available through the `@sl-design-system/grid/utils.js` import
