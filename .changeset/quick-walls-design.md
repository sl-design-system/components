---
'@sl-design-system/scrollbar': patch
---

New `<sl-scrollbar>` utility component

This component is not meant for general usage. There are certain cases where
we need to have a scrollbar that is not the native scrollbar. This
component is meant to only be used in those cases.

One example of this is the horizontal scrollbar in the grid component: If you have a
page with a grid component that has a page scrollbar and the grid has a large number of
columns, then the native horizontal scrollbar will only be visible once you've scrolled
to the bottom of the page. For Windows users, this makes it very hard to scroll horizontally.
By using a custom scrollbar, we can control where the scrollbar is positioned. In the case of
grid, we can make the scrollbar use `position: sticky`, so it is always visible.
