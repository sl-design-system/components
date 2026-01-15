# @sl-design-system/tig

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
