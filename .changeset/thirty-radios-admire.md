---
"@sl-design-system/grid": patch
---

Various improvements and bug fixes:
- Add missing select dependency
- Fix issue with filter column not working with zero `0`
- Fix drag & drop in combination with grouping
- Add more stories with groupby combinations
- Add hack to remove the "extra padding" at bottom of the body when using groups
- Remove custom icons that are already part of the theme
- Fix rendering of selection header when first column is a drag handle
- Add ability to slot custom content in the group header (with example story)
- Fix filter & sorter `change-in-update` Lit warning
- Fix broken filter due to event naming regression
- Refactor `groupBy` functionality to a single API in dataSource; previously you could also set group by using the `items-group-by` attribute/property, leading to unnecessary complexity
