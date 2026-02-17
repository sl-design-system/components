---
'@sl-design-system/grid': patch
---

Fix scopedElements timing issue in sort-column when used in Angular

The sort column adds the `<sl-grid-sorter>` element to the scoped elements of the column. It did this in `connectedCallback`, which caused a timing issue in Angular. The fix is to have separate getters and setters for `scopedElements` and only add the `<sl-grid-sorter>` element when the `scopedElements` getter is called.
