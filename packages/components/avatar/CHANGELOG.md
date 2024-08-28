# @sl-design-system/avatar

## 1.0.2

### Patch Changes

- [#1450](https://github.com/sl-design-system/components/pull/1450) [`6fdf413`](https://github.com/sl-design-system/components/commit/6fdf4134257825ac85b1e7fa64c92152ef229b2a) - Fix missing dependencies in avatar component

- Updated dependencies [[`5c4063e`](https://github.com/sl-design-system/components/commit/5c4063ed63560ca3e07940492653d23a4ec009d8), [`c8b9c89`](https://github.com/sl-design-system/components/commit/c8b9c89a367066ab241348c9f93e6e087ec796ea), [`3070e81`](https://github.com/sl-design-system/components/commit/3070e81b03ec83ef79149c84d3e5e7876b38591f), [`96c5ade`](https://github.com/sl-design-system/components/commit/96c5ade1562ca5faf936ce59f13a2fb84abeac56)]:
  - @sl-design-system/tooltip@1.1.0
  - @sl-design-system/shared@0.3.0

## 1.0.1

### Patch Changes

- [#1389](https://github.com/sl-design-system/components/pull/1389) [`f03971b`](https://github.com/sl-design-system/components/commit/f03971b7b338a4248df292060b91b6b903b6c8ed) - Minor style fixes:

  - Fix the title and subtitle text being cutoff for certain characters due not enough line-height
  - Use a different color for the subtitle text

- [#1389](https://github.com/sl-design-system/components/pull/1389) [`f03971b`](https://github.com/sl-design-system/components/commit/f03971b7b338a4248df292060b91b6b903b6c8ed) - Due to #1371, the subtitle is no longer shown for the `md` size

- Updated dependencies [[`5212fb6`](https://github.com/sl-design-system/components/commit/5212fb638d3eeb535d5988b8793db21fb4fcc220)]:
  - @sl-design-system/shared@0.2.13

## 1.0.0

### Major Changes

- [#1336](https://github.com/sl-design-system/components/pull/1336) [`d787820`](https://github.com/sl-design-system/components/commit/d7878202384eab3f58908b1cf252851c6a3d2744) - First stable release

### Minor Changes

- [#1325](https://github.com/sl-design-system/components/pull/1325) [`5f4226f`](https://github.com/sl-design-system/components/commit/5f4226f0025e4839fc5c8a694c2df26bafea67c2) - Simplify the avatar component:
  - Replace the internal badge by slotting an `<sl-badge>` element
  - Replace the badge cutout SVG logic with a CSS clip-path
  - Remove the `badgeText` and `status` properties (use the `sl-badge` element instead)
  - Remove the `fallback` property and add a `<slot name="fallback">` instead

### Patch Changes

- [#1263](https://github.com/sl-design-system/components/pull/1263) [`4861828`](https://github.com/sl-design-system/components/commit/4861828b27ef460fd5136382e70f8e83f9cb68a4) - Fixed focus border on smaller sizes, when avatar was image only the border wasn't round.

- Updated dependencies [[`a705c3f`](https://github.com/sl-design-system/components/commit/a705c3f7034207b19a10a819bccd85a3347e0204), [`5f4226f`](https://github.com/sl-design-system/components/commit/5f4226f0025e4839fc5c8a694c2df26bafea67c2)]:
  - @sl-design-system/tooltip@1.0.1
  - @sl-design-system/shared@0.2.12

## 0.2.10

### Patch Changes

- Updated dependencies [[`c4012af`](https://github.com/sl-design-system/components/commit/c4012af75faaec57e3a1dc5d7f2e8205ce1d3805)]:
  - @sl-design-system/tooltip@1.0.0

## 0.2.9

### Patch Changes

- Updated dependencies [[`59a41aa`](https://github.com/sl-design-system/components/commit/59a41aa4b6530d5002e6e45313249e4abe7dac3b)]:
  - @sl-design-system/shared@0.2.11
  - @sl-design-system/tooltip@0.0.26

## 0.2.8

### Patch Changes

- [#1188](https://github.com/sl-design-system/components/pull/1188) [`e457ed2`](https://github.com/sl-design-system/components/commit/e457ed26449cc2dc4cbddb778403d77198c7d43c) - Add ability to use avatar to link to a URL using the new `href` property

## 0.2.7

### Patch Changes

- Updated dependencies [[`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537), [`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537)]:
  - @sl-design-system/shared@0.2.10
  - @sl-design-system/tooltip@0.0.25

## 0.2.6

### Patch Changes

- Updated dependencies [[`d22722e`](https://github.com/sl-design-system/components/commit/d22722e6792c19c76d0fb6ec476fac1ff241d52b)]:
  - @sl-design-system/shared@0.2.9
  - @sl-design-system/tooltip@0.0.24

## 0.2.5

### Patch Changes

- Updated dependencies [[`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da), [`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da)]:
  - @sl-design-system/shared@0.2.8
  - @sl-design-system/tooltip@0.0.23

## 0.2.4

### Patch Changes

- Updated dependencies [[`38b0ca4`](https://github.com/sl-design-system/components/commit/38b0ca4d72014605418639b69410863eb8e231ad)]:
  - @sl-design-system/shared@0.2.7
  - @sl-design-system/tooltip@0.0.22

## 0.2.3

### Patch Changes

- [#1026](https://github.com/sl-design-system/components/pull/1026) [`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b) - Linting fixes for styling

- Updated dependencies [[`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b)]:
  - @sl-design-system/tooltip@0.0.21

## 0.2.2

### Patch Changes

- [#995](https://github.com/sl-design-system/components/pull/995) [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5) - Linting fixes due to new eslint configuration

- Updated dependencies [[`aaa09ff`](https://github.com/sl-design-system/components/commit/aaa09ffb78db9df6298ce77d51a79b7aed213e59), [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5)]:
  - @sl-design-system/tooltip@0.0.20
  - @sl-design-system/shared@0.2.6

## 0.2.1

### Patch Changes

- Updated dependencies [[`dbc032b`](https://github.com/sl-design-system/components/commit/dbc032b3a7587dfcbdb6a2118330b039765cf0fb), [`5da216b`](https://github.com/sl-design-system/components/commit/5da216b3713c328eba06113d77d642462e1f05fc)]:
  - @sl-design-system/shared@0.2.5
  - @sl-design-system/tooltip@0.0.19

## 0.2.0

### Minor Changes

- [#954](https://github.com/sl-design-system/components/pull/954) [`fe029ab`](https://github.com/sl-design-system/components/commit/fe029abb8011a24fdf55c00b823dbdd910740758) - Changed API, now you need to pass the display name and picture url as two separate attributes, instead of a user object

### Patch Changes

- Updated dependencies [[`216d62e`](https://github.com/sl-design-system/components/commit/216d62eb5a16277b4ea2767ea0530e570bf40abf), [`216d62e`](https://github.com/sl-design-system/components/commit/216d62eb5a16277b4ea2767ea0530e570bf40abf)]:
  - @sl-design-system/tooltip@0.0.18
  - @sl-design-system/shared@0.2.4

## 0.1.5

### Patch Changes

- Updated dependencies [[`afc3d60`](https://github.com/sl-design-system/components/commit/afc3d606c20409b4ad2d589ffc0b899d3f853997)]:
  - @sl-design-system/shared@0.2.3
  - @sl-design-system/tooltip@0.0.17

## 0.1.4

### Patch Changes

- [#883](https://github.com/sl-design-system/components/pull/883) [`b941f99`](https://github.com/sl-design-system/components/commit/b941f9943782a5a823bac0bf8433bb77c664e752) - Several small changes:

  - Hide subheader on horizontal orientation and size small.
  - Show tooltip with full name when name is truncated
  - Changed font size to improve readability

- [#910](https://github.com/sl-design-system/components/pull/910) [`7663098`](https://github.com/sl-design-system/components/commit/7663098350f0216221a810208ac068c62be6a1d9) - Rework avatar to fix change-in-update Lit warning

- Updated dependencies [[`06cfb6b`](https://github.com/sl-design-system/components/commit/06cfb6bff8f2c1a8d4a132099f21f2e8dc4f2461), [`b941f99`](https://github.com/sl-design-system/components/commit/b941f9943782a5a823bac0bf8433bb77c664e752), [`9320cbc`](https://github.com/sl-design-system/components/commit/9320cbc446e479435860ad5f9756725b36acf764), [`2aff1dd`](https://github.com/sl-design-system/components/commit/2aff1dd7aa946cb2ee998d7d121ab585ca9ad39b)]:
  - @sl-design-system/shared@0.2.2
  - @sl-design-system/tooltip@0.0.16

## 0.1.3

### Patch Changes

- [#792](https://github.com/sl-design-system/components/pull/792) [`0b41208`](https://github.com/sl-design-system/components/commit/0b41208f390b27e3738e0d81258abeaa18e19a0f) - Added badge component, added smaller icon.

- Updated dependencies [[`b507ee0`](https://github.com/sl-design-system/components/commit/b507ee07e119733d285a348e74f34c4b2d172902), [`d881d5f`](https://github.com/sl-design-system/components/commit/d881d5fc5274be5275f910f445a16408d6bb2373)]:
  - @sl-design-system/shared@0.2.1

## 0.1.2

### Patch Changes

- [#724](https://github.com/sl-design-system/components/pull/724) [`b3f9d42`](https://github.com/sl-design-system/components/commit/b3f9d42945c7b427105353ede3cf74ba3191792d) - Added avatar + added token for focus ring offset

## 0.1.1

### Patch Changes

- [#688](https://github.com/sl-design-system/components/pull/688) [`a816bfe`](https://github.com/sl-design-system/components/commit/a816bfec8e3459cc3b12def88922a421345768f0) - Upgrade to Lit 3.0

## 0.1.0

### Minor Changes

- [#572](https://github.com/sl-design-system/components/pull/572) [`5b5825f`](https://github.com/sl-design-system/components/commit/5b5825f7637ab81fc6acb1ca5438ceb547a326b0) - Add improved version of avatar component

## 0.0.2

### Patch Changes

- [#381](https://github.com/sl-design-system/components/pull/381) [`bf663ee`](https://github.com/sl-design-system/components/commit/bf663eecbb5e1607562c94058002569d481298eb) - Fix types to work without "nodenext" module resolution

## 0.0.1

### Patch Changes

- [#352](https://github.com/sl-design-system/components/pull/352) [`26866e0`](https://github.com/sl-design-system/components/commit/26866e0eda550e6c17f37f0e9cb6a9d4302c06bb) - Refactor all NPM packages to `@sl-design-system/<component|theme>`
