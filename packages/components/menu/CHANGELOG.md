# @sl-design-system/menu

## 0.2.6

### Patch Changes

- [#2682](https://github.com/sl-design-system/components/pull/2682) [`659a92a`](https://github.com/sl-design-system/components/commit/659a92af4732d339f9830368b1e0e3bd48221714) - Fix the keyboard shortcut being part of the menu item contents

  Use `aria-keyshortcuts` to expose the shortcut to assistive technologies

- [#2681](https://github.com/sl-design-system/components/pull/2681) [`bd0fa20`](https://github.com/sl-design-system/components/commit/bd0fa20294b989bab05e142f8f5346d3d919bbb3) - Fix sub menu item not having an initial `aria-expanded` attribute

- Updated dependencies [[`659a92a`](https://github.com/sl-design-system/components/commit/659a92af4732d339f9830368b1e0e3bd48221714), [`f025c0f`](https://github.com/sl-design-system/components/commit/f025c0f3cbb83b72c80563e9d989402608add193), [`c76f3c8`](https://github.com/sl-design-system/components/commit/c76f3c86cc289be16bdf7ad4ec09baf910d67361), [`e2543df`](https://github.com/sl-design-system/components/commit/e2543df011b9d65b8e11a07323b3712f52859e0e)]:
  - @sl-design-system/shared@0.9.1
  - @sl-design-system/button@1.3.0
  - @sl-design-system/icon@1.3.1

## 0.2.5

### Patch Changes

- [#2331](https://github.com/sl-design-system/components/pull/2331) [`17fbc40`](https://github.com/sl-design-system/components/commit/17fbc404a27bada6a5013c84c34a2936de604f16) - Fixes the issue where pressing the `Escape` key inside the menu closes parent containers (such as dialogs).

- [#2547](https://github.com/sl-design-system/components/pull/2547) [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68) - Bump patch version of `@open-wc/scoped-elements` peer dependency

- [#2561](https://github.com/sl-design-system/components/pull/2561) [`0e2e426`](https://github.com/sl-design-system/components/commit/0e2e426041997a299f3e35bcde499909d62f7ce9) - Remove duplication of `observedAttributes` from the components and into the `ObserveAttributesMixin`

- Updated dependencies [[`0c4f19b`](https://github.com/sl-design-system/components/commit/0c4f19beb6f66b6cba944c6bc4589252113554fb), [`0c4f19b`](https://github.com/sl-design-system/components/commit/0c4f19beb6f66b6cba944c6bc4589252113554fb), [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68), [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68), [`29f38d4`](https://github.com/sl-design-system/components/commit/29f38d4a44003f63e20965ed176dfa9bc16851e7), [`0e2e426`](https://github.com/sl-design-system/components/commit/0e2e426041997a299f3e35bcde499909d62f7ce9), [`17fbc40`](https://github.com/sl-design-system/components/commit/17fbc404a27bada6a5013c84c34a2936de604f16)]:
  - @sl-design-system/button@1.2.5
  - @sl-design-system/shared@0.9.0
  - @sl-design-system/icon@1.3.0

## 0.2.4

### Patch Changes

- Updated dependencies [[`1072075`](https://github.com/sl-design-system/components/commit/1072075e3f1b5f0bf8b07dc1f89fd39b9f7103d0), [`4a6f8ba`](https://github.com/sl-design-system/components/commit/4a6f8ba02f49e8be7b37028c9b6a558ad91d9664)]:
  - @sl-design-system/shared@0.8.0
  - @sl-design-system/button@1.2.4

## 0.2.3

### Patch Changes

- [#1953](https://github.com/sl-design-system/components/pull/1953) [`f09f025`](https://github.com/sl-design-system/components/commit/f09f0259b4c0fb0a139974431b8a4bad7d9df6c8) - Removed `--sl-icon-container-size`; the container now always has the same size as the icon. Use margin or an extra wrapper to create extra space around the icon when necessary.

- Updated dependencies [[`0a45fb2`](https://github.com/sl-design-system/components/commit/0a45fb23105fce305650c96c5962afe0bb10b930), [`f09f025`](https://github.com/sl-design-system/components/commit/f09f0259b4c0fb0a139974431b8a4bad7d9df6c8)]:
  - @sl-design-system/shared@0.7.1
  - @sl-design-system/icon@1.2.0

## 0.2.2

### Patch Changes

- Updated dependencies [[`ab33cc8`](https://github.com/sl-design-system/components/commit/ab33cc86cc01480fb20206be689f9bbdb62bf0ad)]:
  - @sl-design-system/shared@0.7.0
  - @sl-design-system/button@1.2.2

## 0.2.1

### Patch Changes

- Updated dependencies [[`fa0b85d`](https://github.com/sl-design-system/components/commit/fa0b85d46c08018cd43de432c3a9705e7aede2c8), [`eaca9d2`](https://github.com/sl-design-system/components/commit/eaca9d24a6086d7a60dc5efc5332f16e80485d36), [`fe3c562`](https://github.com/sl-design-system/components/commit/fe3c562d4e18ab93e9209aaab1a604774cfba5fb)]:
  - @sl-design-system/shared@0.6.0
  - @sl-design-system/button@1.2.1

## 0.2.0

### Minor Changes

- [#1791](https://github.com/sl-design-system/components/pull/1791) [`133b883`](https://github.com/sl-design-system/components/commit/133b883234d911dabe37bd3c8acef26afea20fe9) - Replace `--sl-size-borderWidth-subtle` with `--sl-size-borderWidth-default`

- [#1675](https://github.com/sl-design-system/components/pull/1675) [`389d0e2`](https://github.com/sl-design-system/components/commit/389d0e2a982dd40b4e3a04cf3b1d8b34204236a0) - Update to use the new button defaults

- [#1664](https://github.com/sl-design-system/components/pull/1664) [`849b154`](https://github.com/sl-design-system/components/commit/849b1544bcc7cc60de1eb37ec282f2e467efc7eb) - Use `--sl-size-borderWidth-subtle` instead of the old "default" token

- [#1713](https://github.com/sl-design-system/components/pull/1713) [`01abf58`](https://github.com/sl-design-system/components/commit/01abf5833d364a76dbdf4e0df0587d0fbec3848e) - Refactor styling to use new contextual tokens

### Patch Changes

- [#1777](https://github.com/sl-design-system/components/pull/1777) [`67f5b81`](https://github.com/sl-design-system/components/commit/67f5b810558d124289f26e3cc3fb2c59da97bb5f) - Fixed several accessibility issues;
  - Improved VoiceOver in support Chrome
  - Fixed keyboard navigation in submenu
  - Applied new tokens to menu and menu item
  - Renamed the `part` identifying `sl-menu` from `listbox` to `menu`
  - removed `--sl-menu-min-inline-size` and `--sl-menu-max-inline-size`; you can style the size of the menu through the `menu` part.

- [#1805](https://github.com/sl-design-system/components/pull/1805) [`94e2a7b`](https://github.com/sl-design-system/components/commit/94e2a7bf1ccaaa9d547654603554cc6bdfdf66fb) - Fix missing `shape` property on menu button that proxies to the button

- [#1637](https://github.com/sl-design-system/components/pull/1637) [`c4a93fb`](https://github.com/sl-design-system/components/commit/c4a93fba6f40b8e843a169117dfdd331a5d9d6e6) - Fix NVDA accessibility issues: moving aria attributes to the right (focusable) element in the MenuButton.

- [#1642](https://github.com/sl-design-system/components/pull/1642) [`cef2371`](https://github.com/sl-design-system/components/commit/cef2371d5868439edbba8156bf38c167b72f0f39) - Replace `--sl-color-text-default` with `--sl-color-text-plain`

- Updated dependencies [[`389d0e2`](https://github.com/sl-design-system/components/commit/389d0e2a982dd40b4e3a04cf3b1d8b34204236a0), [`6309452`](https://github.com/sl-design-system/components/commit/63094521a7b262bd80c1a9a377086093d2844a8d), [`94e2a7b`](https://github.com/sl-design-system/components/commit/94e2a7bf1ccaaa9d547654603554cc6bdfdf66fb), [`cab0938`](https://github.com/sl-design-system/components/commit/cab093898b324073801945fc3771eec2014d6652), [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb), [`40cc538`](https://github.com/sl-design-system/components/commit/40cc538648e6ed5ac453fbe708bae8761caaab5e), [`c4a93fb`](https://github.com/sl-design-system/components/commit/c4a93fba6f40b8e843a169117dfdd331a5d9d6e6), [`c19862e`](https://github.com/sl-design-system/components/commit/c19862e56455c3d8e27a9afc33bf684f89b04b75), [`bbcb7f7`](https://github.com/sl-design-system/components/commit/bbcb7f7cd48e22fa1e61f24ba645a4131b0c75ee), [`1a9604e`](https://github.com/sl-design-system/components/commit/1a9604e1fc70a6382a3545dafee527d7d674179d), [`b1e3b74`](https://github.com/sl-design-system/components/commit/b1e3b741e78400e3755ddaa0c5c4fdeed2e3f960), [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb), [`4e57f9c`](https://github.com/sl-design-system/components/commit/4e57f9c60835a07db45f74fde73a3bf13b6abe51), [`01abf58`](https://github.com/sl-design-system/components/commit/01abf5833d364a76dbdf4e0df0587d0fbec3848e)]:
  - @sl-design-system/button@1.2.0
  - @sl-design-system/shared@0.5.0
  - @sl-design-system/icon@1.1.0

## 0.1.3

### Patch Changes

- Updated dependencies [[`33fd543`](https://github.com/sl-design-system/components/commit/33fd5432f1499051071662aaca9974c212304bc6), [`4714b36`](https://github.com/sl-design-system/components/commit/4714b36f1387d4d1731a310b621caf5a33be105b), [`ebe4c8a`](https://github.com/sl-design-system/components/commit/ebe4c8a32e85b753e2aa752a13b2dc23616bf1a9), [`33fd543`](https://github.com/sl-design-system/components/commit/33fd5432f1499051071662aaca9974c212304bc6)]:
  - @sl-design-system/button@1.1.0
  - @sl-design-system/shared@0.4.0

## 0.1.2

### Patch Changes

- [#1540](https://github.com/sl-design-system/components/pull/1540) [`d52af39`](https://github.com/sl-design-system/components/commit/d52af39c81ca5e8ed2e5b27a79dc3bf3ad162899) - Set initial aria-details and aria-expanded on the menu button

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
