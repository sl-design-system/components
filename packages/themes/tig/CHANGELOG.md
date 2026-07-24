# @sl-design-system/tig

## 1.1.4

### Patch Changes

- [#3495](https://github.com/sl-design-system/components/pull/3495) [`4ce1186`](https://github.com/sl-design-system/components/commit/4ce1186f7bcafc04f78e91491d29a29c77b6e31a) - Up to date tokens.

- Updated dependencies [[`ab43bd7`](https://github.com/sl-design-system/components/commit/ab43bd715bfb51b1a007bf2acb87e7061ae8ad19), [`c7efbd2`](https://github.com/sl-design-system/components/commit/c7efbd275e4638d5e94daa5d1a46fba73711f340)]:
  - @sl-design-system/icon@1.4.3

## 1.1.3

### Patch Changes

- [#3359](https://github.com/sl-design-system/components/pull/3359) [`1dac781`](https://github.com/sl-design-system/components/commit/1dac78183220216dce0c7c8a2e2d36c6e4c7ebb8) - Fixes an issue where line-height variables had a duplicate unit (pxpx)

## 1.1.2

### Patch Changes

- [#3248](https://github.com/sl-design-system/components/pull/3248) [`fc60898`](https://github.com/sl-design-system/components/commit/fc60898ea3c7b5b234a13c6bf157e89528f3a11f) - Added new `octagon-xmark-solid` icon for use in Callout, Inline message, and Progress bar. Make sure to update your theme if you updated those components

## 1.1.1

### Patch Changes

- [#3142](https://github.com/sl-design-system/components/pull/3142) [`dd96d1b`](https://github.com/sl-design-system/components/commit/dd96d1b88f030a7b4a81b51d77a8461b5692909c) - Updated `global.css` file - improved dialog animations.

## 1.1.0

### Minor Changes

- [#3020](https://github.com/sl-design-system/components/pull/3020) [`738e4a7`](https://github.com/sl-design-system/components/commit/738e4a77005043de2f9977fab9fb04d4fce6369d) - Added

  - new elevation.surface.raised.primary token

  Fixed

  - form input interactive backgrounds (color.background.input.plain.interactive.plain) from plain to bold variants across all themes (e.g., accent.grey.interactive.bold) for better state contrast.

- [#2970](https://github.com/sl-design-system/components/pull/2970) [`e92ebb1`](https://github.com/sl-design-system/components/commit/e92ebb16c596919aaa301be2604ab5f3539738a9) - Caret icons have been updated to implement the new alignment strategy used in Font Awesome 7

### Patch Changes

- [#2982](https://github.com/sl-design-system/components/pull/2982) [`5784b96`](https://github.com/sl-design-system/components/commit/5784b9682e183391f842b10f1d194ceb137606f0) - Updated global.css so we have the opportunity to overwrite the link color from a component.

- Updated dependencies [[`330e06f`](https://github.com/sl-design-system/components/commit/330e06ff36c7a5c96cf313b60a5013d6307477c7)]:
  - @sl-design-system/icon@1.4.2

## 1.0.1

### Patch Changes

- [#2759](https://github.com/sl-design-system/components/pull/2759) [`7a7fd56`](https://github.com/sl-design-system/components/commit/7a7fd5650207f0f6be6c015d8f735345323ef5ff) - Added `icon.2xs` for use in `badge.MD`
  Added `color.background.highlight`

## 1.0.0

### Major Changes

- [#2734](https://github.com/sl-design-system/components/pull/2734) [`f676dd5`](https://github.com/sl-design-system/components/commit/f676dd52c83ef2f3429d9a393b5ec634fc05bf0e) - This is a major change after the refactoring of the Figma tokens and subsequently the webcomponents; with this release we removed the old tokens from the default css files, and moved all legacy tokens to a separate file. This means a breaking change; if you have components in your application that are not updated yet to the version that uses the new tokens the styling will be broken if you don't take action after using this version of the theme.
  To support these older component versions you can include `light-deprecated.css` in all places where you now include `light.css` until all components are updated and you can remove the legacy file.
  (`light.css` is taken as an example, this of course goes for all files, also `dark`, `base` and the `scss` files)

### Patch Changes

- Updated dependencies [[`f676dd5`](https://github.com/sl-design-system/components/commit/f676dd52c83ef2f3429d9a393b5ec634fc05bf0e), [`d807cb2`](https://github.com/sl-design-system/components/commit/d807cb22702dc5ac1399cf0528f9ceeeb1f09f60)]:
  - @sl-design-system/icon@1.4.1

## 0.4.1

### Patch Changes

- Updated dependencies [[`1e7b6f6`](https://github.com/sl-design-system/components/commit/1e7b6f629f79d77576c2cb19d20f8884bb2f30c4)]:
  - @sl-design-system/icon@1.4.0

## 0.4.0

### Minor Changes

- [#2618](https://github.com/sl-design-system/components/pull/2618) [`1115612`](https://github.com/sl-design-system/components/commit/1115612e1fdf4ee38d9e484e92cc324e767f0e56) - Added clock icon for use in `<sl-time-field>`

### Patch Changes

- Updated dependencies [[`c76f3c8`](https://github.com/sl-design-system/components/commit/c76f3c86cc289be16bdf7ad4ec09baf910d67361), [`e2543df`](https://github.com/sl-design-system/components/commit/e2543df011b9d65b8e11a07323b3712f52859e0e)]:
  - @sl-design-system/icon@1.3.1

## 0.3.0

### Minor Changes

- [#2597](https://github.com/sl-design-system/components/pull/2597) [`8ca3a20`](https://github.com/sl-design-system/components/commit/8ca3a20310ed9e0f4d176a44ac09cb4d4c1e2213) - First release since move to Tokens Studio

### Patch Changes

- [#2243](https://github.com/sl-design-system/components/pull/2243) [`29f38d4`](https://github.com/sl-design-system/components/commit/29f38d4a44003f63e20965ed176dfa9bc16851e7) - Updated icons (new Font Awesome version)

- [#2535](https://github.com/sl-design-system/components/pull/2535) [`395fffb`](https://github.com/sl-design-system/components/commit/395fffb6d25f8eba9fcd0aa629c1275daef6ab96) - Add missing package exports for CSS files

- Updated dependencies [[`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68), [`29f38d4`](https://github.com/sl-design-system/components/commit/29f38d4a44003f63e20965ed176dfa9bc16851e7)]:
  - @sl-design-system/icon@1.3.0

## 0.2.6

### Patch Changes

- [#2123](https://github.com/sl-design-system/components/pull/2123) [`4635741`](https://github.com/sl-design-system/components/commit/46357419216b68b32a476ac5f60c2fe762ae7b42) - Added TIG theme

- Updated dependencies [[`e973712`](https://github.com/sl-design-system/components/commit/e973712439e562714aa0dfe427f88288a8ab78eb), [`7371487`](https://github.com/sl-design-system/components/commit/7371487bd75cfceca454c243d199c572378d726f)]:
  - @sl-design-system/icon@1.2.1
