# @sl-design-system/dialog

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
