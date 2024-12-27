---
'@sl-design-system/paginator': patch
---

Various improvements:
- Add missing dependencies (announcer & form)
- Rename `<sl-paginator-size>` to `<sl-paginator-page-size>`
- Remove `pageSizes` property from `<sl-paginator>`
- Refactor `dataSource` properties in all components
- Only announce a page change when the user clicks on the previous/next buttons
- Simplify the `<sl-paginator>` implementation
- Fix `<sl-paginator>` announcements *after* the component has been removed from the DOM
- Fix lifecycle warnings displayed in the console
- Disable the `<sl-select>` instead of hiding it when there are no page sizes
