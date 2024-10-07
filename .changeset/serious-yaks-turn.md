---
'@sl-design-system/grid': patch
---

Automatically render an `<sl-skeleton>` component in each `<td>` element

When an item to be rendered equals `FetchDataSourcePlaceholder`, the column will render a
skeleton component instead of the item itself. This will help users understand that the
data is being fetched and will be displayed soon.

You have the option to customize the skeleton component by passing custom `renderer` function
to the column component. See Storybook for an example.

You will automatically get this behavior if you use the `FetchDataSource` (from the
`@sl-design-system/data-source` package) with the grid.
