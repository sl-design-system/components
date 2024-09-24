# @sl-design-system/menu

## 0.1.1

### Patch Changes

- [#1510](https://github.com/sl-design-system/components/pull/1510) [`563dccc`](https://github.com/sl-design-system/components/commit/563dccce29fc961ef46147c41a8f9f82bd2db384) - Do not transform token parts to kebab case, only add '-' in between

  This change is only for the new contextual tokens. Previously any snakeCase
  tokens would be transformed into kebab-case. This is not the desired behavior
  for the new contextual tokens.

- Updated dependencies [[`21302c2`](https://github.com/sl-design-system/components/commit/21302c28065512f1c89ffde17dbc3241a2306d5d)]:
  - @sl-design-system/shared@0.3.2

## 0.1.0

### Minor Changes

- [#1428](https://github.com/sl-design-system/components/pull/1428) [`c8b9c89`](https://github.com/sl-design-system/components/commit/c8b9c89a367066ab241348c9f93e6e087ec796ea) - Fixed issue where popover was too small to show any content even if there was space on the other side of the anchor component.
  The way to set the min and max size of the popover have changed: use the following properties instead of setting the width directly on the popover. (Those values will be ignored when calculating the size of the popover as it can exist in the available space)
  --sl-popover-min-block-size
  --sl-popover-max-block-size
  --sl-popover-max-inline-size

### Patch Changes

- [#1474](https://github.com/sl-design-system/components/pull/1474) [`96c5ade`](https://github.com/sl-design-system/components/commit/96c5ade1562ca5faf936ce59f13a2fb84abeac56) - Various improvements:
  - Refactor styling to use the new contextual tokens
  - Fix the "safe triangle" not working properly in some cases
  - Add animations when the menu is shown
  - Various small fixes
  - Remove single/multi select in `<sl-menu-button>`
- Updated dependencies [[`e3597ad`](https://github.com/sl-design-system/components/commit/e3597adca3a2b98f1507af55b7fb3748d9c29ffb), [`347418f`](https://github.com/sl-design-system/components/commit/347418fa98477365f5bc0aef1c70c9da4579f2a4), [`c8b9c89`](https://github.com/sl-design-system/components/commit/c8b9c89a367066ab241348c9f93e6e087ec796ea), [`ff1618c`](https://github.com/sl-design-system/components/commit/ff1618cdfa4d0060465d993f656345ba1044f88c), [`96c5ade`](https://github.com/sl-design-system/components/commit/96c5ade1562ca5faf936ce59f13a2fb84abeac56)]:
  - @sl-design-system/icon@1.0.2
  - @sl-design-system/button@1.0.3
  - @sl-design-system/shared@0.3.0

## 0.0.10

### Patch Changes

- Updated dependencies [[`c4012af`](https://github.com/sl-design-system/components/commit/c4012af75faaec57e3a1dc5d7f2e8205ce1d3805), [`fe047da`](https://github.com/sl-design-system/components/commit/fe047da265a3d657d74ee26df95ebd73f2d7ef7f), [`c4012af`](https://github.com/sl-design-system/components/commit/c4012af75faaec57e3a1dc5d7f2e8205ce1d3805)]:
  - @sl-design-system/icon@1.0.0
  - @sl-design-system/button@1.0.0

## 0.0.9

### Patch Changes

- [#1243](https://github.com/sl-design-system/components/pull/1243) [`6dbe047`](https://github.com/sl-design-system/components/commit/6dbe047d690a069a16c1d96172accce6fa2980cb) - Fix missing `d.ts` files

- Updated dependencies [[`59a41aa`](https://github.com/sl-design-system/components/commit/59a41aa4b6530d5002e6e45313249e4abe7dac3b)]:
  - @sl-design-system/shared@0.2.11
  - @sl-design-system/button@0.0.28

## 0.0.8

### Patch Changes

- [#1115](https://github.com/sl-design-system/components/pull/1115) [`9961697`](https://github.com/sl-design-system/components/commit/99616972eaef783779417d65c1b237dff801ad1f) - Only have menu-button close the menu if the user clicks on a menu item.

- [#1115](https://github.com/sl-design-system/components/pull/1115) [`9961697`](https://github.com/sl-design-system/components/commit/99616972eaef783779417d65c1b237dff801ad1f) - Prevent clicking on a menu item with an opened submenu from closing the submenu.

- Updated dependencies [[`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537), [`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537), [`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537)]:
  - @sl-design-system/shared@0.2.10
  - @sl-design-system/icon@0.0.10
  - @sl-design-system/button@0.0.27

## 0.0.7

### Patch Changes

- Updated dependencies [[`d22722e`](https://github.com/sl-design-system/components/commit/d22722e6792c19c76d0fb6ec476fac1ff241d52b)]:
  - @sl-design-system/shared@0.2.9
  - @sl-design-system/button@0.0.26

## 0.0.6

### Patch Changes

- [#1058](https://github.com/sl-design-system/components/pull/1058) [`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da) - Add `--sl-menu-(min|max)-inline-size` CSS custom properties

- [#1058](https://github.com/sl-design-system/components/pull/1058) [`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da) - Add button part for customization

- [#1058](https://github.com/sl-design-system/components/pull/1058) [`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da) - Fix scrolling when menu overflows

- Updated dependencies [[`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da), [`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da)]:
  - @sl-design-system/shared@0.2.8
  - @sl-design-system/button@0.0.25

## 0.0.5

### Patch Changes

- Updated dependencies [[`38b0ca4`](https://github.com/sl-design-system/components/commit/38b0ca4d72014605418639b69410863eb8e231ad)]:
  - @sl-design-system/shared@0.2.7
  - @sl-design-system/button@0.0.24

## 0.0.4

### Patch Changes

- [#1026](https://github.com/sl-design-system/components/pull/1026) [`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b) - Linting fixes for styling

- Updated dependencies [[`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b), [`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b)]:
  - @sl-design-system/button@0.0.23
  - @sl-design-system/icon@0.0.9

## 0.0.3

### Patch Changes

- [#1018](https://github.com/sl-design-system/components/pull/1018) [`aaa09ff`](https://github.com/sl-design-system/components/commit/aaa09ffb78db9df6298ce77d51a79b7aed213e59) - Fix 3rd party dependencies to be peerDependencies instead

- [#995](https://github.com/sl-design-system/components/pull/995) [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5) - Linting fixes due to new eslint configuration

- Updated dependencies [[`aaa09ff`](https://github.com/sl-design-system/components/commit/aaa09ffb78db9df6298ce77d51a79b7aed213e59), [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5)]:
  - @sl-design-system/shared@0.2.6
  - @sl-design-system/icon@0.0.8
  - @sl-design-system/button@0.0.22

## 0.0.2

### Patch Changes

- [#984](https://github.com/sl-design-system/components/pull/984) [`5da216b`](https://github.com/sl-design-system/components/commit/5da216b3713c328eba06113d77d642462e1f05fc) - Change `AnchorController` to use the arrow positioning of floating-ui

- Updated dependencies [[`dbc032b`](https://github.com/sl-design-system/components/commit/dbc032b3a7587dfcbdb6a2118330b039765cf0fb), [`5da216b`](https://github.com/sl-design-system/components/commit/5da216b3713c328eba06113d77d642462e1f05fc)]:
  - @sl-design-system/shared@0.2.5
  - @sl-design-system/button@0.0.21

## 0.0.1

### Patch Changes

- [#974](https://github.com/sl-design-system/components/pull/974) [`216d62e`](https://github.com/sl-design-system/components/commit/216d62eb5a16277b4ea2767ea0530e570bf40abf) - Add menu components

- Updated dependencies [[`216d62e`](https://github.com/sl-design-system/components/commit/216d62eb5a16277b4ea2767ea0530e570bf40abf), [`216d62e`](https://github.com/sl-design-system/components/commit/216d62eb5a16277b4ea2767ea0530e570bf40abf), [`216d62e`](https://github.com/sl-design-system/components/commit/216d62eb5a16277b4ea2767ea0530e570bf40abf)]:
  - @sl-design-system/shared@0.2.4
  - @sl-design-system/button@0.0.20
