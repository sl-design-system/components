# @sl-design-system/button

## 1.2.4

### Patch Changes

- Updated dependencies [[`1072075`](https://github.com/sl-design-system/components/commit/1072075e3f1b5f0bf8b07dc1f89fd39b9f7103d0), [`4a6f8ba`](https://github.com/sl-design-system/components/commit/4a6f8ba02f49e8be7b37028c9b6a558ad91d9664)]:
  - @sl-design-system/shared@0.8.0

## 1.2.3

### Patch Changes

- [#1980](https://github.com/sl-design-system/components/pull/1980) [`2257205`](https://github.com/sl-design-system/components/commit/22572056a4b5ed63762733f2e5af427f3e2ee6a5) - Fixes issue where button gets too small when in flex container

- Updated dependencies [[`fc934eb`](https://github.com/sl-design-system/components/commit/fc934eba9f2049fda27d1e3f7c879789eea6254c)]:
  - @sl-design-system/shared@0.7.2

## 1.2.2

### Patch Changes

- Updated dependencies [[`ab33cc8`](https://github.com/sl-design-system/components/commit/ab33cc86cc01480fb20206be689f9bbdb62bf0ad)]:
  - @sl-design-system/shared@0.7.0

## 1.2.1

### Patch Changes

- Updated dependencies [[`fa0b85d`](https://github.com/sl-design-system/components/commit/fa0b85d46c08018cd43de432c3a9705e7aede2c8), [`eaca9d2`](https://github.com/sl-design-system/components/commit/eaca9d24a6086d7a60dc5efc5332f16e80485d36), [`fe3c562`](https://github.com/sl-design-system/components/commit/fe3c562d4e18ab93e9209aaab1a604774cfba5fb)]:
  - @sl-design-system/shared@0.6.0

## 1.2.0

### Minor Changes

- [#1675](https://github.com/sl-design-system/components/pull/1675) [`389d0e2`](https://github.com/sl-design-system/components/commit/389d0e2a982dd40b4e3a04cf3b1d8b34204236a0) - Button improvements:

  - Added a new `shape` property that defaults to `square` but also accepts `pill` for rounded corners
  - Added a new `inverted` variant, to be used on dark/light background (depending on light/dark mode)
  - Removed default values of `fill`, `size`, `type` and `variant` properties
  - Replaced `default` variant with `secondary` variant. `secondary` is also the new default variant
  - Only enable animations when `prefers-reduced-motion` is not set
  - Refactor styling to use the new contextual tokens

  The above changes do not change the behavior of the component.

- [#1805](https://github.com/sl-design-system/components/pull/1805) [`94e2a7b`](https://github.com/sl-design-system/components/commit/94e2a7bf1ccaaa9d547654603554cc6bdfdf66fb) - Increase the padding for `md` from `32px` to `36px` and for `lg` from `40px` to `48px`.

- [#1713](https://github.com/sl-design-system/components/pull/1713) [`01abf58`](https://github.com/sl-design-system/components/commit/01abf5833d364a76dbdf4e0df0587d0fbec3848e) - Refactor styling to use new contextual tokens

### Patch Changes

- [#1690](https://github.com/sl-design-system/components/pull/1690) [`1a9604e`](https://github.com/sl-design-system/components/commit/1a9604e1fc70a6382a3545dafee527d7d674179d) - Fix text becoming selected when clicking fast

- Updated dependencies [[`6309452`](https://github.com/sl-design-system/components/commit/63094521a7b262bd80c1a9a377086093d2844a8d), [`cab0938`](https://github.com/sl-design-system/components/commit/cab093898b324073801945fc3771eec2014d6652), [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb), [`c4a93fb`](https://github.com/sl-design-system/components/commit/c4a93fba6f40b8e843a169117dfdd331a5d9d6e6), [`c19862e`](https://github.com/sl-design-system/components/commit/c19862e56455c3d8e27a9afc33bf684f89b04b75), [`b1e3b74`](https://github.com/sl-design-system/components/commit/b1e3b741e78400e3755ddaa0c5c4fdeed2e3f960), [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb), [`4e57f9c`](https://github.com/sl-design-system/components/commit/4e57f9c60835a07db45f74fde73a3bf13b6abe51)]:
  - @sl-design-system/shared@0.5.0

## 1.1.0

### Minor Changes

- [#1580](https://github.com/sl-design-system/components/pull/1580) [`33fd543`](https://github.com/sl-design-system/components/commit/33fd5432f1499051071662aaca9974c212304bc6) - Improve form integration behavior

  Previously, if you had an `<sl-button>` with `type` `reset` or `submit`, it would call the `<form>`'s `reset()` or `requestSubmit()` methods. With this change, the same behavior now works if you only have an `<sl-form>` element as the parent. If both `<form>` and `<sl-form>` elements are present, then the `<form>` element will take precedence. This makes it a minor change.

### Patch Changes

- Updated dependencies [[`4714b36`](https://github.com/sl-design-system/components/commit/4714b36f1387d4d1731a310b621caf5a33be105b), [`ebe4c8a`](https://github.com/sl-design-system/components/commit/ebe4c8a32e85b753e2aa752a13b2dc23616bf1a9), [`33fd543`](https://github.com/sl-design-system/components/commit/33fd5432f1499051071662aaca9974c212304bc6)]:
  - @sl-design-system/shared@0.4.0

## 1.0.3

### Patch Changes

- [#1456](https://github.com/sl-design-system/components/pull/1456) [`347418f`](https://github.com/sl-design-system/components/commit/347418fa98477365f5bc0aef1c70c9da4579f2a4) - Fixed selector that could cause incorrecty paddings on icon-only button in different fills

- Updated dependencies [[`c8b9c89`](https://github.com/sl-design-system/components/commit/c8b9c89a367066ab241348c9f93e6e087ec796ea), [`96c5ade`](https://github.com/sl-design-system/components/commit/96c5ade1562ca5faf936ce59f13a2fb84abeac56)]:
  - @sl-design-system/shared@0.3.0

## 1.0.2

### Patch Changes

- [#1365](https://github.com/sl-design-system/components/pull/1365) [`6c7f900`](https://github.com/sl-design-system/components/commit/6c7f9004959dfbb7a715a6ecec8d82da6b1e5e9c) - Added tokens for toggle button and updated style for ghost button to match

- Updated dependencies [[`5212fb6`](https://github.com/sl-design-system/components/commit/5212fb638d3eeb535d5988b8793db21fb4fcc220)]:
  - @sl-design-system/shared@0.2.13

## 1.0.1

### Patch Changes

- [#1351](https://github.com/sl-design-system/components/pull/1351) [`0f9c568`](https://github.com/sl-design-system/components/commit/0f9c5683edc57c217d7d27ce22add842eca074fe) - Made sure slotted elements in sl-button don't capture events. This caused problems with tooltips unexpectedly disappearing when using something other than text or sl-icon inside a button

## 1.0.0

### Major Changes

- [#1281](https://github.com/sl-design-system/components/pull/1281) [`c4012af`](https://github.com/sl-design-system/components/commit/c4012af75faaec57e3a1dc5d7f2e8205ce1d3805) - First stable release

### Minor Changes

- [#1234](https://github.com/sl-design-system/components/pull/1234) [`fe047da`](https://github.com/sl-design-system/components/commit/fe047da265a3d657d74ee26df95ebd73f2d7ef7f) - Add new `info` variant

## 0.0.28

### Patch Changes

- Updated dependencies [[`59a41aa`](https://github.com/sl-design-system/components/commit/59a41aa4b6530d5002e6e45313249e4abe7dac3b)]:
  - @sl-design-system/shared@0.2.11

## 0.0.27

### Patch Changes

- Updated dependencies [[`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537), [`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537)]:
  - @sl-design-system/shared@0.2.10

## 0.0.26

### Patch Changes

- Updated dependencies [[`d22722e`](https://github.com/sl-design-system/components/commit/d22722e6792c19c76d0fb6ec476fac1ff241d52b)]:
  - @sl-design-system/shared@0.2.9

## 0.0.25

### Patch Changes

- Updated dependencies [[`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da), [`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da)]:
  - @sl-design-system/shared@0.2.8

## 0.0.24

### Patch Changes

- Updated dependencies [[`38b0ca4`](https://github.com/sl-design-system/components/commit/38b0ca4d72014605418639b69410863eb8e231ad)]:
  - @sl-design-system/shared@0.2.7

## 0.0.23

### Patch Changes

- [#1026](https://github.com/sl-design-system/components/pull/1026) [`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b) - Linting fixes for styling

## 0.0.22

### Patch Changes

- [#995](https://github.com/sl-design-system/components/pull/995) [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5) - Linting fixes due to new eslint configuration

- Updated dependencies [[`aaa09ff`](https://github.com/sl-design-system/components/commit/aaa09ffb78db9df6298ce77d51a79b7aed213e59), [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5)]:
  - @sl-design-system/shared@0.2.6

## 0.0.21

### Patch Changes

- Updated dependencies [[`dbc032b`](https://github.com/sl-design-system/components/commit/dbc032b3a7587dfcbdb6a2118330b039765cf0fb), [`5da216b`](https://github.com/sl-design-system/components/commit/5da216b3713c328eba06113d77d642462e1f05fc)]:
  - @sl-design-system/shared@0.2.5

## 0.0.20

### Patch Changes

- [#974](https://github.com/sl-design-system/components/pull/974) [`216d62e`](https://github.com/sl-design-system/components/commit/216d62eb5a16277b4ea2767ea0530e570bf40abf) - Prevent icon from receiving focus

- Updated dependencies [[`216d62e`](https://github.com/sl-design-system/components/commit/216d62eb5a16277b4ea2767ea0530e570bf40abf), [`216d62e`](https://github.com/sl-design-system/components/commit/216d62eb5a16277b4ea2767ea0530e570bf40abf)]:
  - @sl-design-system/shared@0.2.4

## 0.0.19

### Patch Changes

- Updated dependencies [[`afc3d60`](https://github.com/sl-design-system/components/commit/afc3d606c20409b4ad2d589ffc0b899d3f853997)]:
  - @sl-design-system/shared@0.2.3

## 0.0.18

### Patch Changes

- Updated dependencies [[`06cfb6b`](https://github.com/sl-design-system/components/commit/06cfb6bff8f2c1a8d4a132099f21f2e8dc4f2461), [`9320cbc`](https://github.com/sl-design-system/components/commit/9320cbc446e479435860ad5f9756725b36acf764), [`2aff1dd`](https://github.com/sl-design-system/components/commit/2aff1dd7aa946cb2ee998d7d121ab585ca9ad39b)]:
  - @sl-design-system/shared@0.2.2

## 0.0.17

### Patch Changes

- [#892](https://github.com/sl-design-system/components/pull/892) [`c9c1395`](https://github.com/sl-design-system/components/commit/c9c1395c60eeb958dd25098e85c94818fac635bc) - removed focus state tokens, they are no longer used; the focusring is being used

## 0.0.16

### Patch Changes

- [#838](https://github.com/sl-design-system/components/pull/838) [`820171d`](https://github.com/sl-design-system/components/commit/820171dd3b507d92a4e885e2fb452d2984c0f27b) - Add missing `disabled` property

- [#853](https://github.com/sl-design-system/components/pull/853) [`555c301`](https://github.com/sl-design-system/components/commit/555c301f416a7a35dad4f167b21b91f0c735ce51) - Link button styling changes, link button tokens changes, itsLearning color values of solid button and focus ring changes

- [#838](https://github.com/sl-design-system/components/pull/838) [`820171d`](https://github.com/sl-design-system/components/commit/820171dd3b507d92a4e885e2fb452d2984c0f27b) - Fix incorrect focus indication for non-keyboard actions

- Updated dependencies [[`b507ee0`](https://github.com/sl-design-system/components/commit/b507ee07e119733d285a348e74f34c4b2d172902), [`d881d5f`](https://github.com/sl-design-system/components/commit/d881d5fc5274be5275f910f445a16408d6bb2373)]:
  - @sl-design-system/shared@0.2.1

## 0.0.15

### Patch Changes

- [#795](https://github.com/sl-design-system/components/pull/795) [`c15e60e`](https://github.com/sl-design-system/components/commit/c15e60eef61430b3a9b944c4f8438d19ce8bb3c1) - Fix background for default buttons + fix hover state for all buttons

- [#724](https://github.com/sl-design-system/components/pull/724) [`b3f9d42`](https://github.com/sl-design-system/components/commit/b3f9d42945c7b427105353ede3cf74ba3191792d) - Added avatar + added token for focus ring offset

- Updated dependencies [[`198c7c2`](https://github.com/sl-design-system/components/commit/198c7c277787d48276d402522f94f2d0d5132152), [`b3f9d42`](https://github.com/sl-design-system/components/commit/b3f9d42945c7b427105353ede3cf74ba3191792d)]:
  - @sl-design-system/shared@0.2.0

## 0.0.14

### Patch Changes

- [#688](https://github.com/sl-design-system/components/pull/688) [`a816bfe`](https://github.com/sl-design-system/components/commit/a816bfec8e3459cc3b12def88922a421345768f0) - Upgrade to Lit 3.0

- Updated dependencies [[`45bff4d`](https://github.com/sl-design-system/components/commit/45bff4d60a32f4d46d8c9c99200efeaa1be6a2f0), [`199a2fc`](https://github.com/sl-design-system/components/commit/199a2fc0b3f0efb54c06429fd91fa09071b337de), [`a816bfe`](https://github.com/sl-design-system/components/commit/a816bfec8e3459cc3b12def88922a421345768f0)]:
  - @sl-design-system/shared@0.1.9

## 0.0.13

### Patch Changes

- [#545](https://github.com/sl-design-system/components/pull/545) [`680e9a9`](https://github.com/sl-design-system/components/commit/680e9a97c4332a37b5949ca74eb699a3bc95f448) - changed focus indicator to outline instead of box shadow

- Updated dependencies [[`680e9a9`](https://github.com/sl-design-system/components/commit/680e9a97c4332a37b5949ca74eb699a3bc95f448), [`5208fa3`](https://github.com/sl-design-system/components/commit/5208fa38b4d702f9939a2b6c19065bc7a6ffa2cb)]:
  - @sl-design-system/shared@0.1.8

## 0.0.12

### Patch Changes

- Updated dependencies [[`34696fb`](https://github.com/sl-design-system/components/commit/34696fb6c288a8c6101b7a5b80cef1240229a522)]:
  - @sl-design-system/shared@0.1.7

## 0.0.11

### Patch Changes

- Updated dependencies [[`c901f6c`](https://github.com/sl-design-system/components/commit/c901f6c5409367d19f2ced63c486f820af834faf), [`2203785`](https://github.com/sl-design-system/components/commit/22037855352e444362e42ebfebf9e6d1295bada1), [`b9a0b33`](https://github.com/sl-design-system/components/commit/b9a0b338b4e4047dbd809e501c163fa97a39130e)]:
  - @sl-design-system/shared@0.1.6

## 0.0.10

### Patch Changes

- Updated dependencies [[`6f125e6`](https://github.com/sl-design-system/components/commit/6f125e6886f85fcfb8521e656f682e7385fe8aff)]:
  - @sl-design-system/shared@0.1.5

## 0.0.9

### Patch Changes

- Updated dependencies [[`46c49dd`](https://github.com/sl-design-system/components/commit/46c49dd2e281d7efbeed40c9ee1e22b44265bc1a)]:
  - @sl-design-system/shared@0.1.4

## 0.0.8

### Patch Changes

- Updated dependencies [[`13aa7e7`](https://github.com/sl-design-system/components/commit/13aa7e75e2f26262261dba498fde3412d4259939)]:
  - @sl-design-system/shared@0.1.3

## 0.0.7

### Patch Changes

- Updated dependencies [[`8a53d80`](https://github.com/sl-design-system/components/commit/8a53d800564073f7840a9f6365b234df3351c44f)]:
  - @sl-design-system/shared@0.1.2

## 0.0.6

### Patch Changes

- Updated dependencies [[`d7f7af8`](https://github.com/sl-design-system/components/commit/d7f7af8908b83a5ff5f88400d44cb578eb51e7bb), [`d7f7af8`](https://github.com/sl-design-system/components/commit/d7f7af8908b83a5ff5f88400d44cb578eb51e7bb)]:
  - @sl-design-system/shared@0.1.1

## 0.0.5

### Patch Changes

- Updated dependencies [[`4c1ba25`](https://github.com/sl-design-system/components/commit/4c1ba250a5b5edc65a74c47b9fbd869324791f17)]:
  - @sl-design-system/shared@0.1.0

## 0.0.4

### Patch Changes

- [#423](https://github.com/sl-design-system/components/pull/423) [`81957ec`](https://github.com/sl-design-system/components/commit/81957ec587349c09d0a3d4e8ae41301c5730785f) - Fix transitions and other minor styling issues

## 0.0.3

### Patch Changes

- Updated dependencies [[`d45dbfa`](https://github.com/sl-design-system/components/commit/d45dbfa4289439cdfba237190dbf910478f282db)]:
  - @sl-design-system/shared@0.0.3

## 0.0.2

### Patch Changes

- [#381](https://github.com/sl-design-system/components/pull/381) [`bf663ee`](https://github.com/sl-design-system/components/commit/bf663eecbb5e1607562c94058002569d481298eb) - Fix types to work without "nodenext" module resolution

- Updated dependencies [[`bf663ee`](https://github.com/sl-design-system/components/commit/bf663eecbb5e1607562c94058002569d481298eb)]:
  - @sl-design-system/shared@0.0.2

## 0.0.1

### Patch Changes

- [#352](https://github.com/sl-design-system/components/pull/352) [`26866e0`](https://github.com/sl-design-system/components/commit/26866e0eda550e6c17f37f0e9cb6a9d4302c06bb) - Refactor all NPM packages to `@sl-design-system/<component|theme>`

- Updated dependencies [[`26866e0`](https://github.com/sl-design-system/components/commit/26866e0eda550e6c17f37f0e9cb6a9d4302c06bb)]:
  - @sl-design-system/shared@0.0.1
