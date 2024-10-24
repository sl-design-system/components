# @sl-design-system/dialog

## 1.1.0

### Minor Changes

- [#1576](https://github.com/sl-design-system/components/pull/1576) [`b3619c7`](https://github.com/sl-design-system/components/commit/b3619c75d92f72d1db06146c93b98a3a5f86c035) - Improve ability to `extends Dialog`

  This change improves the ability to extend the Dialog component by splitting the `render()` method into smaller methods. This makes it easier to override specific parts of the Dialog component:

  - `renderHeader(title: string, subtitle: string)`
  - `renderBody()`
  - `renderFooter()`
  - `renderActions()`

  The `renderHeader` method is slightly different. If all you want to do is add a title or subtitle to the header, you can override the method and call `return super.renderHeader('My title', 'My subtitle')`.

  To be clear: the above API is only meant to be used when you are _extending_ the `Dialog` class. If you are using the `<sl-dialog>` element in your HTML, than you can still use the `header`, `body`, and `footer` slots as before.

### Patch Changes

- Updated dependencies [[`33fd543`](https://github.com/sl-design-system/components/commit/33fd5432f1499051071662aaca9974c212304bc6), [`4714b36`](https://github.com/sl-design-system/components/commit/4714b36f1387d4d1731a310b621caf5a33be105b), [`ebe4c8a`](https://github.com/sl-design-system/components/commit/ebe4c8a32e85b753e2aa752a13b2dc23616bf1a9), [`33fd543`](https://github.com/sl-design-system/components/commit/33fd5432f1499051071662aaca9974c212304bc6)]:
  - @sl-design-system/button@1.1.0
  - @sl-design-system/shared@0.4.0

## 1.0.4

### Patch Changes

- Updated dependencies [[`e3597ad`](https://github.com/sl-design-system/components/commit/e3597adca3a2b98f1507af55b7fb3748d9c29ffb), [`347418f`](https://github.com/sl-design-system/components/commit/347418fa98477365f5bc0aef1c70c9da4579f2a4), [`c8b9c89`](https://github.com/sl-design-system/components/commit/c8b9c89a367066ab241348c9f93e6e087ec796ea), [`ff1618c`](https://github.com/sl-design-system/components/commit/ff1618cdfa4d0060465d993f656345ba1044f88c), [`96c5ade`](https://github.com/sl-design-system/components/commit/96c5ade1562ca5faf936ce59f13a2fb84abeac56)]:
  - @sl-design-system/icon@1.0.2
  - @sl-design-system/button@1.0.3
  - @sl-design-system/shared@0.3.0

## 1.0.3

### Patch Changes

- [#1392](https://github.com/sl-design-system/components/pull/1392) [`fdf3644`](https://github.com/sl-design-system/components/commit/fdf36446ce68afe58d10ace6706258a46c822579) - Fix `max-inline-size` default behavior to account for inline margins

- [#1379](https://github.com/sl-design-system/components/pull/1379) [`4242ea2`](https://github.com/sl-design-system/components/commit/4242ea24a85d758a71bb8c88aa6ae8a0aba442b5) - Fix various issues:
  - Add focus outline for `<dialog>`; see https://adrianroselli.com/2020/10/dialog-focus-in-screen-readers.html#Update01
  - Add workaround for dialog focus behavior in combination with slots; see https://github.com/whatwg/html/issues/9245
  - Improve API documentation
- Updated dependencies [[`1ea82aa`](https://github.com/sl-design-system/components/commit/1ea82aad5579752ba52e8e6c08c97e3c14237816), [`1647361`](https://github.com/sl-design-system/components/commit/1647361aba7af478745fc30a8067154debff0808), [`5212fb6`](https://github.com/sl-design-system/components/commit/5212fb638d3eeb535d5988b8793db21fb4fcc220), [`6c7f900`](https://github.com/sl-design-system/components/commit/6c7f9004959dfbb7a715a6ecec8d82da6b1e5e9c)]:
  - @sl-design-system/button-bar@1.1.0
  - @sl-design-system/icon@1.0.1
  - @sl-design-system/shared@0.2.13
  - @sl-design-system/button@1.0.2

## 1.0.2

### Patch Changes

- [#1374](https://github.com/sl-design-system/components/pull/1374) [`836d6d5`](https://github.com/sl-design-system/components/commit/836d6d54ff835b81378d996deb8bf6cb8a108b43) - Remove any margin on the slotted (sub)title

## 1.0.1

### Patch Changes

- Updated dependencies [[`d787820`](https://github.com/sl-design-system/components/commit/d7878202384eab3f58908b1cf252851c6a3d2744), [`a705c3f`](https://github.com/sl-design-system/components/commit/a705c3f7034207b19a10a819bccd85a3347e0204), [`5f4226f`](https://github.com/sl-design-system/components/commit/5f4226f0025e4839fc5c8a694c2df26bafea67c2)]:
  - @sl-design-system/button-bar@1.0.0
  - @sl-design-system/shared@0.2.12

## 1.0.0

### Major Changes

- [#1281](https://github.com/sl-design-system/components/pull/1281) [`c4012af`](https://github.com/sl-design-system/components/commit/c4012af75faaec57e3a1dc5d7f2e8205ce1d3805) - First stable release

### Patch Changes

- Updated dependencies [[`c4012af`](https://github.com/sl-design-system/components/commit/c4012af75faaec57e3a1dc5d7f2e8205ce1d3805), [`fe047da`](https://github.com/sl-design-system/components/commit/fe047da265a3d657d74ee26df95ebd73f2d7ef7f), [`c4012af`](https://github.com/sl-design-system/components/commit/c4012af75faaec57e3a1dc5d7f2e8205ce1d3805)]:
  - @sl-design-system/icon@1.0.0
  - @sl-design-system/button@1.0.0

## 0.0.17

### Patch Changes

- [#1233](https://github.com/sl-design-system/components/pull/1233) [`68b6404`](https://github.com/sl-design-system/components/commit/68b6404bc5574b88daae711a2eb535c2572d23b1) - Fix dialog clipping the focus outline of form fields.

- Updated dependencies [[`59a41aa`](https://github.com/sl-design-system/components/commit/59a41aa4b6530d5002e6e45313249e4abe7dac3b), [`39c22ca`](https://github.com/sl-design-system/components/commit/39c22cad76661ad4b1f3a8f4bc56c576c36a94be)]:
  - @sl-design-system/shared@0.2.11
  - @sl-design-system/button-bar@0.0.7
  - @sl-design-system/button@0.0.28

## 0.0.16

### Patch Changes

- Updated dependencies [[`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537), [`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537), [`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537)]:
  - @sl-design-system/shared@0.2.10
  - @sl-design-system/icon@0.0.10
  - @sl-design-system/button@0.0.27

## 0.0.15

### Patch Changes

- Updated dependencies [[`d22722e`](https://github.com/sl-design-system/components/commit/d22722e6792c19c76d0fb6ec476fac1ff241d52b)]:
  - @sl-design-system/shared@0.2.9
  - @sl-design-system/button@0.0.26

## 0.0.14

### Patch Changes

- Updated dependencies [[`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da), [`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da)]:
  - @sl-design-system/shared@0.2.8
  - @sl-design-system/button@0.0.25

## 0.0.13

### Patch Changes

- Updated dependencies [[`38b0ca4`](https://github.com/sl-design-system/components/commit/38b0ca4d72014605418639b69410863eb8e231ad)]:
  - @sl-design-system/shared@0.2.7
  - @sl-design-system/button@0.0.24

## 0.0.12

### Patch Changes

- [#1026](https://github.com/sl-design-system/components/pull/1026) [`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b) - Linting fixes for styling

- Updated dependencies [[`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b), [`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b)]:
  - @sl-design-system/button-bar@0.0.6
  - @sl-design-system/button@0.0.23
  - @sl-design-system/icon@0.0.9

## 0.0.11

### Patch Changes

- [#1018](https://github.com/sl-design-system/components/pull/1018) [`aaa09ff`](https://github.com/sl-design-system/components/commit/aaa09ffb78db9df6298ce77d51a79b7aed213e59) - Fix 3rd party dependencies to be peerDependencies instead

- [#995](https://github.com/sl-design-system/components/pull/995) [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5) - Linting fixes due to new eslint configuration

- Updated dependencies [[`aaa09ff`](https://github.com/sl-design-system/components/commit/aaa09ffb78db9df6298ce77d51a79b7aed213e59), [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5)]:
  - @sl-design-system/button-bar@0.0.5
  - @sl-design-system/shared@0.2.6
  - @sl-design-system/icon@0.0.8
  - @sl-design-system/button@0.0.22

## 0.0.10

### Patch Changes

- Updated dependencies [[`dbc032b`](https://github.com/sl-design-system/components/commit/dbc032b3a7587dfcbdb6a2118330b039765cf0fb), [`5da216b`](https://github.com/sl-design-system/components/commit/5da216b3713c328eba06113d77d642462e1f05fc)]:
  - @sl-design-system/shared@0.2.5
  - @sl-design-system/button@0.0.21

## 0.0.9

### Patch Changes

- Updated dependencies [[`216d62e`](https://github.com/sl-design-system/components/commit/216d62eb5a16277b4ea2767ea0530e570bf40abf), [`216d62e`](https://github.com/sl-design-system/components/commit/216d62eb5a16277b4ea2767ea0530e570bf40abf), [`216d62e`](https://github.com/sl-design-system/components/commit/216d62eb5a16277b4ea2767ea0530e570bf40abf)]:
  - @sl-design-system/shared@0.2.4
  - @sl-design-system/button@0.0.20

## 0.0.8

### Patch Changes

- [#969](https://github.com/sl-design-system/components/pull/969) [`207bb08`](https://github.com/sl-design-system/components/commit/207bb08fdae47c80eb74eb07164d3a0478f6ae78) - Set dialog overflow from hidden (default) to visible

- Updated dependencies [[`afc3d60`](https://github.com/sl-design-system/components/commit/afc3d606c20409b4ad2d589ffc0b899d3f853997)]:
  - @sl-design-system/shared@0.2.3
  - @sl-design-system/button@0.0.19

## 0.0.7

### Patch Changes

- [#937](https://github.com/sl-design-system/components/pull/937) [`e4e94cb`](https://github.com/sl-design-system/components/commit/e4e94cbae85ef09c029920db0cb0ac9c92939097) - - Fix large body text

  - Fix backdrop not fading in/out during show/close
  - Fix backdrop not animating after pressing Escape
  - Add `--sl-dialog-max-inline-size` CSS public API

- [#925](https://github.com/sl-design-system/components/pull/925) [`2aff1dd`](https://github.com/sl-design-system/components/commit/2aff1dd7aa946cb2ee998d7d121ab585ca9ad39b) - - Add `sl-cancel` and `sl-close` events

  - Rename `disableClose` to `disableCancel` to better reflect its behavior
  - Rename `closingButton` to `closeButton` to better align with naming conventions

- [#925](https://github.com/sl-design-system/components/pull/925) [`2aff1dd`](https://github.com/sl-design-system/components/commit/2aff1dd7aa946cb2ee998d7d121ab585ca9ad39b) - Bump Lit and related dependencies

- Updated dependencies [[`06cfb6b`](https://github.com/sl-design-system/components/commit/06cfb6bff8f2c1a8d4a132099f21f2e8dc4f2461), [`e4e94cb`](https://github.com/sl-design-system/components/commit/e4e94cbae85ef09c029920db0cb0ac9c92939097), [`9320cbc`](https://github.com/sl-design-system/components/commit/9320cbc446e479435860ad5f9756725b36acf764), [`2aff1dd`](https://github.com/sl-design-system/components/commit/2aff1dd7aa946cb2ee998d7d121ab585ca9ad39b)]:
  - @sl-design-system/shared@0.2.2
  - @sl-design-system/button-bar@0.0.4
  - @sl-design-system/icon@0.0.7
  - @sl-design-system/button@0.0.18

## 0.0.6

### Patch Changes

- [#887](https://github.com/sl-design-system/components/pull/887) [`316c87a`](https://github.com/sl-design-system/components/commit/316c87a2eca2b7a0c9c7b0f5225e63a5ecdb5b26) - Added an animation of 0.001 seconds on open and close when reduced motion is on, otherwise the 'animationend' event isn't triggerd and the dialog doesn't close. (0s causes it still not to work in older versions of safari)

- Updated dependencies [[`c9c1395`](https://github.com/sl-design-system/components/commit/c9c1395c60eeb958dd25098e85c94818fac635bc)]:
  - @sl-design-system/button@0.0.17

## 0.0.5

### Patch Changes

- [#800](https://github.com/sl-design-system/components/pull/800) [`72212cb`](https://github.com/sl-design-system/components/commit/72212cbd4a60737b1077d98a94fc0e37188ffcec) - Added aria-label to icon-only close button

- Updated dependencies [[`820171d`](https://github.com/sl-design-system/components/commit/820171dd3b507d92a4e885e2fb452d2984c0f27b), [`a05db1d`](https://github.com/sl-design-system/components/commit/a05db1dcc19153ce0c843782c6d5aff46a992acf), [`bbf18f7`](https://github.com/sl-design-system/components/commit/bbf18f7453debffe8f3bebf096a0552b8df60500), [`555c301`](https://github.com/sl-design-system/components/commit/555c301f416a7a35dad4f167b21b91f0c735ce51), [`820171d`](https://github.com/sl-design-system/components/commit/820171dd3b507d92a4e885e2fb452d2984c0f27b), [`0b41208`](https://github.com/sl-design-system/components/commit/0b41208f390b27e3738e0d81258abeaa18e19a0f), [`b507ee0`](https://github.com/sl-design-system/components/commit/b507ee07e119733d285a348e74f34c4b2d172902), [`d881d5f`](https://github.com/sl-design-system/components/commit/d881d5fc5274be5275f910f445a16408d6bb2373)]:
  - @sl-design-system/button@0.0.16
  - @sl-design-system/icon@0.0.6
  - @sl-design-system/shared@0.2.1

## 0.0.4

### Patch Changes

- [#790](https://github.com/sl-design-system/components/pull/790) [`9b8e371`](https://github.com/sl-design-system/components/commit/9b8e371932fbe979f3250e07c605ad39239d4f82) - Upgrade to latest `@open-wc/scoped-elements` to track the standards spec

- Updated dependencies [[`4ca7b20`](https://github.com/sl-design-system/components/commit/4ca7b20ee7d09ee2ccfcf2743fd48f00a8207e39), [`4ca7b20`](https://github.com/sl-design-system/components/commit/4ca7b20ee7d09ee2ccfcf2743fd48f00a8207e39), [`9b8e371`](https://github.com/sl-design-system/components/commit/9b8e371932fbe979f3250e07c605ad39239d4f82)]:
  - @sl-design-system/icon@0.0.5

## 0.0.3

### Patch Changes

- [#679](https://github.com/sl-design-system/components/pull/679) [`e123f89`](https://github.com/sl-design-system/components/commit/e123f894a45a70d0d26ebd5f8a66bc41ea78814d) - Added dialog component

- [#688](https://github.com/sl-design-system/components/pull/688) [`a816bfe`](https://github.com/sl-design-system/components/commit/a816bfec8e3459cc3b12def88922a421345768f0) - Upgrade to Lit 3.0

- Updated dependencies [[`a816bfe`](https://github.com/sl-design-system/components/commit/a816bfec8e3459cc3b12def88922a421345768f0)]:
  - @sl-design-system/button-bar@0.0.3
  - @sl-design-system/icon@0.0.4

## 0.0.2

### Patch Changes

- [#381](https://github.com/sl-design-system/components/pull/381) [`bf663ee`](https://github.com/sl-design-system/components/commit/bf663eecbb5e1607562c94058002569d481298eb) - Fix types to work without "nodenext" module resolution

- Updated dependencies [[`bf663ee`](https://github.com/sl-design-system/components/commit/bf663eecbb5e1607562c94058002569d481298eb)]:
  - @sl-design-system/button-bar@0.0.2

## 0.0.1

### Patch Changes

- [#352](https://github.com/sl-design-system/components/pull/352) [`26866e0`](https://github.com/sl-design-system/components/commit/26866e0eda550e6c17f37f0e9cb6a9d4302c06bb) - Refactor all NPM packages to `@sl-design-system/<component|theme>`

- Updated dependencies [[`26866e0`](https://github.com/sl-design-system/components/commit/26866e0eda550e6c17f37f0e9cb6a9d4302c06bb)]:
  - @sl-design-system/button-bar@0.0.1
