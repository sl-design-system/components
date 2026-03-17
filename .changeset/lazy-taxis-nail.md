---
'@sl-design-system/grid': patch
---

Fix scopedElements timing issue in columns when used in Angular

The sort column adds the `<sl-grid-sorter>` element to the scoped elements of the column. It did this in `connectedCallback`, which caused a timing issue in Angular. The fix is to have separate getters and setters for `scopedElements` and make sure the sorter is always part of the scoped elements. Any internal scoped elements should be defined in the `baseScopedElements` getter, which is merged with the user-defined `scopedElements` in the setter. This way, the sorter is always available when the user sets their own scoped elements, and there are no timing issues in Angular.
