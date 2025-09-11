# @sl-design-system/scrollbar

## 0.1.2

### Patch Changes

- [#2547](https://github.com/sl-design-system/components/pull/2547) [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68) - Bump patch version of `@open-wc/scoped-elements` peer dependency

## 0.1.1

### Patch Changes

- [#1965](https://github.com/sl-design-system/components/pull/1965) [`cae9352`](https://github.com/sl-design-system/components/commit/cae9352f9d9fef34ef29fec1a475d0e4225d69e3) - Fix bug where adding/removing columns to the grid would not update the scrollbar

## 0.1.0

### Minor Changes

- [#1713](https://github.com/sl-design-system/components/pull/1713) [`01abf58`](https://github.com/sl-design-system/components/commit/01abf5833d364a76dbdf4e0df0587d0fbec3848e) - Refactor styling to use new contextual tokens

### Patch Changes

- [#1817](https://github.com/sl-design-system/components/pull/1817) [`ac0da6a`](https://github.com/sl-design-system/components/commit/ac0da6a50899a937176a1c53a4fc59eb65aa0df7) - Style fixes to align with new tokens

- [#1653](https://github.com/sl-design-system/components/pull/1653) [`f15d75c`](https://github.com/sl-design-system/components/commit/f15d75c6c3765b797f0bed57c5d1f2855cab4f7e) - New `<sl-scrollbar>` utility component

  This component is not meant for general usage. There are certain cases where
  we need to have a scrollbar that is not the native scrollbar. This
  component is meant to only be used in those cases.

  One example of this is the horizontal scrollbar in the grid component: If you have a
  page with a grid component that has a page scrollbar and the grid has a large number of
  columns, then the native horizontal scrollbar will only be visible once you've scrolled
  to the bottom of the page. For Windows users, this makes it very hard to scroll horizontally.
  By using a custom scrollbar, we can control where the scrollbar is positioned. In the case of
  grid, we can make the scrollbar use `position: sticky`, so it is always visible.
