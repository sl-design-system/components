---
'@sl-design-system/grid': patch
---

Add `ellipsizeText` property to grid and column

When set on either `<sl-grid>` or `<sl-grid-column>` (or any of their variants), the `ellipsizeText` property
will render the table data using the `<sl-ellipsize-text>` component, which truncates text with an ellipsis when it
overflows its container. This is useful for tables with long text that would otherwise cause row height to grow.
The component also automatically adds a tooltip to the truncated text so that it can still be viewed.
