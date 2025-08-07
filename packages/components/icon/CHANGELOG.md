# @sl-design-system/icon

## 1.2.1

### Patch Changes

- [#2121](https://github.com/sl-design-system/components/pull/2121) [`e973712`](https://github.com/sl-design-system/components/commit/e973712439e562714aa0dfe427f88288a8ab78eb) - Fixes issue in scenario where icon in a flex container was squeezed too small.

- [#2142](https://github.com/sl-design-system/components/pull/2142) [`7371487`](https://github.com/sl-design-system/components/commit/7371487bd75cfceca454c243d199c572378d726f) - Added a fallback for older browser because when the unit `cap` isn't supported. In those browsers the icons became VERY big.

## 1.2.0

### Minor Changes

- [#1953](https://github.com/sl-design-system/components/pull/1953) [`f09f025`](https://github.com/sl-design-system/components/commit/f09f0259b4c0fb0a139974431b8a4bad7d9df6c8) - Icons now scale with text size; both set in css and by using browser (text) zoom.
  When an explicit font size is set to the parent of the icon, or if a user uses (text) zoom in the browser the icon will use the maximum value of either the set size or 1cap of the current font-size.
  - Now uses new contextual tokens.
  - Removed `--sl-icon-container-size`; the container now always has the same size as the icon. Use margin or an extra wrapper to create extra space around the icon when necessary.

## 1.1.0

### Minor Changes

- [#1710](https://github.com/sl-design-system/components/pull/1710) [`40cc538`](https://github.com/sl-design-system/components/commit/40cc538648e6ed5ac453fbe708bae8761caaab5e) - Overhaul of how (custom) icons are maintained in figma and exported to be used in the packages.

  The following icons have changed:

  - `circle` has been renamed to `circle-solid`

  The following icons have been added:

  - `badge-available`
  - `badge-away`
  - `badge-donotdisturb`
  - `badge-offline`
  - `error`
  - `info`

  The following items have been removed (mainly in cleaning up, they were never meant to be there)

  - `svg-sort`
  - `svg-sort-down`
  - `svg-sort-up`

### Patch Changes

- [#1638](https://github.com/sl-design-system/components/pull/1638) [`bbcb7f7`](https://github.com/sl-design-system/components/commit/bbcb7f7cd48e22fa1e61f24ba645a4131b0c75ee) - Update `IconPrefix` type to be compatible with FontAwesome 6.7.0

## 1.0.2

### Patch Changes

- [#1483](https://github.com/sl-design-system/components/pull/1483) [`e3597ad`](https://github.com/sl-design-system/components/commit/e3597adca3a2b98f1507af55b7fb3748d9c29ffb) - Fixed slow loading when using dynamic binding in Angular to set the name of the icon

- [#1414](https://github.com/sl-design-system/components/pull/1414) [`ff1618c`](https://github.com/sl-design-system/components/commit/ff1618cdfa4d0060465d993f656345ba1044f88c) - Update icons to the latest fontawesome release (6.6.0)

## 1.0.1

### Patch Changes

- [#1395](https://github.com/sl-design-system/components/pull/1395) [`1647361`](https://github.com/sl-design-system/components/commit/1647361aba7af478745fc30a8067154debff0808) - Fixed issues where icons did not apply the color set on the parent element or in the `--sl-icon-fill-default` property

## 1.0.0

### Major Changes

- [#1281](https://github.com/sl-design-system/components/pull/1281) [`c4012af`](https://github.com/sl-design-system/components/commit/c4012af75faaec57e3a1dc5d7f2e8205ce1d3805) - First stable release

## 0.0.10

### Patch Changes

- [#1116](https://github.com/sl-design-system/components/pull/1116) [`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537) - Fix updating state in updated lifecycle callback (change-in-update Lit warning)

## 0.0.9

### Patch Changes

- [#1026](https://github.com/sl-design-system/components/pull/1026) [`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b) - Linting fixes for styling

- [#1026](https://github.com/sl-design-system/components/pull/1026) [`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b) - Clean up CSS custom properties that are public API

## 0.0.8

### Patch Changes

- [#1018](https://github.com/sl-design-system/components/pull/1018) [`aaa09ff`](https://github.com/sl-design-system/components/commit/aaa09ffb78db9df6298ce77d51a79b7aed213e59) - Fix 3rd party dependencies to be peerDependencies instead

- [#995](https://github.com/sl-design-system/components/pull/995) [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5) - Linting fixes due to new eslint configuration

## 0.0.7

### Patch Changes

- [#925](https://github.com/sl-design-system/components/pull/925) [`2aff1dd`](https://github.com/sl-design-system/components/commit/2aff1dd7aa946cb2ee998d7d121ab585ca9ad39b) - Bump Lit and related dependencies

## 0.0.6

### Patch Changes

- [#831](https://github.com/sl-design-system/components/pull/831) [`a05db1d`](https://github.com/sl-design-system/components/commit/a05db1dcc19153ce0c843782c6d5aff46a992acf) - Added retries when searching for icon to fix not loading of icon

- [#871](https://github.com/sl-design-system/components/pull/871) [`bbf18f7`](https://github.com/sl-design-system/components/commit/bbf18f7453debffe8f3bebf096a0552b8df60500) - Rename `registerIcon` and `registerIcons` into a single overloaded `register` method

- [#792](https://github.com/sl-design-system/components/pull/792) [`0b41208`](https://github.com/sl-design-system/components/commit/0b41208f390b27e3738e0d81258abeaa18e19a0f) - Added badge component, added smaller icon.

## 0.0.5

### Patch Changes

- [#786](https://github.com/sl-design-system/components/pull/786) [`4ca7b20`](https://github.com/sl-design-system/components/commit/4ca7b20ee7d09ee2ccfcf2743fd48f00a8207e39) - Fix outline being shown when focused

- [#786](https://github.com/sl-design-system/components/pull/786) [`4ca7b20`](https://github.com/sl-design-system/components/commit/4ca7b20ee7d09ee2ccfcf2743fd48f00a8207e39) - Remove tabindex=-1 which causes the icon to receive focus

- [#790](https://github.com/sl-design-system/components/pull/790) [`9b8e371`](https://github.com/sl-design-system/components/commit/9b8e371932fbe979f3250e07c605ad39239d4f82) - Update to the latest fontawesome icons

## 0.0.4

### Patch Changes

- [#688](https://github.com/sl-design-system/components/pull/688) [`a816bfe`](https://github.com/sl-design-system/components/commit/a816bfec8e3459cc3b12def88922a421345768f0) - Upgrade to Lit 3.0

## 0.0.3

### Patch Changes

- [#412](https://github.com/sl-design-system/components/pull/412) [`d0eae48`](https://github.com/sl-design-system/components/commit/d0eae48a112ec6c096ca6f3804cb248a390f04c8) - Fixed several icon issues, including not loading when rendering occurs before icons are registered.

## 0.0.2

### Patch Changes

- [#381](https://github.com/sl-design-system/components/pull/381) [`bf663ee`](https://github.com/sl-design-system/components/commit/bf663eecbb5e1607562c94058002569d481298eb) - Fix types to work without "nodenext" module resolution

## 0.0.1

### Patch Changes

- [#378](https://github.com/sl-design-system/components/pull/378) [`9391d10`](https://github.com/sl-design-system/components/commit/9391d109252e5038e7eae7d8b42e305a49ef8e9f) - Fix `registerIcons` overwriting any existing icons

- [#352](https://github.com/sl-design-system/components/pull/352) [`26866e0`](https://github.com/sl-design-system/components/commit/26866e0eda550e6c17f37f0e9cb6a9d4302c06bb) - Refactor all NPM packages to `@sl-design-system/<component|theme>`
