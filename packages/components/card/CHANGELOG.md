# @sl-design-system/card

## 2.0.1

### Patch Changes

- [#2547](https://github.com/sl-design-system/components/pull/2547) [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68) - Bump patch version of `@open-wc/scoped-elements` peer dependency

## 2.0.0

### Major Changes

- [#2133](https://github.com/sl-design-system/components/pull/2133) [`67df189`](https://github.com/sl-design-system/components/commit/67df189d3333051ca69a779dd1a0c2cbfd0406b0) - Complete overhaul of the card component. Some slots have the same name, but a lot of the options and css-properties have changed.

  Breaking:
  - `--sl-card-media-x` and `--sl-card-media-y` have been removed
  - `--sl-card-stretch-image` is removed, using the `fit-image` attribute has a similar effect.
  - `--sl-card-media-aspect-ratio` is removed. `--sl-card-media-size` is new and has a similar function.
  - `--sl-card-orientation-breakpoint` is renamed to `--sl-card-horizontal-breakpoint`.
  - The `actions` slot is no longer used for the small button at the top right, but for a big button under the body of the card.
  - `padding` is replaced by `media-margin`.
  - `explicit-height` has been removed.
  - `height` is removed, the text (or grid in the case of subgrid) is leading, the image stretches.
  - `media-position` has been removed.

  New:
  - `--sl-card-image-backdrop` is added. This sets the background-property of the backdrop.
  - The `menu-button` slot is added for buttons in the top right of the card.
  - `subgrid` is added letting you control the layout of the card by the grid of the container where the cards are placed
  - `fit-image` is added, When set the image won't be stretched and cropped to fill the whole container, but instead shown fully, with a margin around it.
    In horizontal mode this will need the card to have an explicit image size set, either by subgrid or by `--sl-card-media-size`.
  - `image-backdrop` is added, When `fit-image` is set, setting this will create a blurred copy of the image in the margin around the image.
  - `media-margin` is added. Adds a little margin around the image.

## 1.0.0

### Major Changes

- [#1281](https://github.com/sl-design-system/components/pull/1281) [`c4012af`](https://github.com/sl-design-system/components/commit/c4012af75faaec57e3a1dc5d7f2e8205ce1d3805) - First stable release

## 0.0.6

### Patch Changes

- [#1243](https://github.com/sl-design-system/components/pull/1243) [`6dbe047`](https://github.com/sl-design-system/components/commit/6dbe047d690a069a16c1d96172accce6fa2980cb) - Fix missing `d.ts` files

## 0.0.5

### Patch Changes

- [#1054](https://github.com/sl-design-system/components/pull/1054) [`e3b3e4f`](https://github.com/sl-design-system/components/commit/e3b3e4f1a90fde0fa46d6f65c87d652348eecaee) - Fix responsiveness not working when element had been hidden or rerendered.

## 0.0.4

### Patch Changes

- [#1026](https://github.com/sl-design-system/components/pull/1026) [`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b) - Linting fixes for styling

## 0.0.3

### Patch Changes

- [#1018](https://github.com/sl-design-system/components/pull/1018) [`aaa09ff`](https://github.com/sl-design-system/components/commit/aaa09ffb78db9df6298ce77d51a79b7aed213e59) - Fix 3rd party dependencies to be peerDependencies instead

- [#995](https://github.com/sl-design-system/components/pull/995) [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5) - Linting fixes due to new eslint configuration

## 0.0.2

### Patch Changes

- [#884](https://github.com/sl-design-system/components/pull/884) [`be65bf1`](https://github.com/sl-design-system/components/commit/be65bf1344d99bf8f6d0f3b275e49d6f636f64aa) - Added card component
