# @sl-design-system/accordion

## 1.2.2

### Patch Changes

- [#2923](https://github.com/sl-design-system/components/pull/2923) [`4f5e7c4`](https://github.com/sl-design-system/components/commit/4f5e7c495f5071a338bbd963b261636a558de59e) - Adds missing `icon` dependency.

- Updated dependencies [[`e3eb2de`](https://github.com/sl-design-system/components/commit/e3eb2de61e86203aab22cd55bbad4cc058e66a2d)]:
  - @sl-design-system/shared@0.10.0

## 1.2.1

### Patch Changes

- [#2765](https://github.com/sl-design-system/components/pull/2765) [`e03836f`](https://github.com/sl-design-system/components/commit/e03836fb034c14f627c8bd5335adf727a923f856) - Add icon part to `<sl-accordion-item>`

- [#2790](https://github.com/sl-design-system/components/pull/2790) [`ad62e35`](https://github.com/sl-design-system/components/commit/ad62e353a70f2cd4ef761fbfd2b1c63a4d0fadf7) - Remove background colors from accordion and accordion-item

  This fixes issues when `<sl-accordion>` is used in a container with a non-default background color.

- [#2644](https://github.com/sl-design-system/components/pull/2644) [`12cf7bc`](https://github.com/sl-design-system/components/commit/12cf7bc4e66b4e4cb02c4ce0cc2d1d7facb8b310) - Changed background to `--sl-elevation-surface-raised-default` so it has the lightest background possible (this is only a change for themes that has a base background colour that is not (almost) white

- Updated dependencies [[`d0c4db2`](https://github.com/sl-design-system/components/commit/d0c4db220c6a5826a0c9e5bc8ab3943884dfcd9c)]:
  - @sl-design-system/shared@0.9.2

## 1.2.0

### Minor Changes

- [#2570](https://github.com/sl-design-system/components/pull/2570) [`0c7dfc9`](https://github.com/sl-design-system/components/commit/0c7dfc90f32b00a03ecb52b6faec740e8e30e10e) - Various improvements:
  - Add a global and per instance `iconType` property with default value `plusminus` and new option `chevron`
  - Add `::part(details)` so you can remove the bottom border from the last `<sl-accordion-item>`
  - Add `summary-extras` slot for extra content in the header of the accordion item
  - Reduce `<summary>` font-size from 18px to 16px
  - Use relative font-size and inherit the font-family
  - Refactor styling to use contextual tokens

### Patch Changes

- [#2547](https://github.com/sl-design-system/components/pull/2547) [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68) - Bump patch version of `@open-wc/scoped-elements` peer dependency

- Updated dependencies [[`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68), [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68), [`0e2e426`](https://github.com/sl-design-system/components/commit/0e2e426041997a299f3e35bcde499909d62f7ce9), [`17fbc40`](https://github.com/sl-design-system/components/commit/17fbc404a27bada6a5013c84c34a2936de604f16)]:
  - @sl-design-system/shared@0.9.0

## 1.1.6

### Patch Changes

- Updated dependencies [[`1072075`](https://github.com/sl-design-system/components/commit/1072075e3f1b5f0bf8b07dc1f89fd39b9f7103d0), [`4a6f8ba`](https://github.com/sl-design-system/components/commit/4a6f8ba02f49e8be7b37028c9b6a558ad91d9664)]:
  - @sl-design-system/shared@0.8.0

## 1.1.5

### Patch Changes

- Updated dependencies [[`ab33cc8`](https://github.com/sl-design-system/components/commit/ab33cc86cc01480fb20206be689f9bbdb62bf0ad)]:
  - @sl-design-system/shared@0.7.0

## 1.1.4

### Patch Changes

- Updated dependencies [[`fa0b85d`](https://github.com/sl-design-system/components/commit/fa0b85d46c08018cd43de432c3a9705e7aede2c8), [`eaca9d2`](https://github.com/sl-design-system/components/commit/eaca9d24a6086d7a60dc5efc5332f16e80485d36), [`fe3c562`](https://github.com/sl-design-system/components/commit/fe3c562d4e18ab93e9209aaab1a604774cfba5fb)]:
  - @sl-design-system/shared@0.6.0

## 1.1.3

### Patch Changes

- Updated dependencies [[`6309452`](https://github.com/sl-design-system/components/commit/63094521a7b262bd80c1a9a377086093d2844a8d), [`cab0938`](https://github.com/sl-design-system/components/commit/cab093898b324073801945fc3771eec2014d6652), [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb), [`c4a93fb`](https://github.com/sl-design-system/components/commit/c4a93fba6f40b8e843a169117dfdd331a5d9d6e6), [`c19862e`](https://github.com/sl-design-system/components/commit/c19862e56455c3d8e27a9afc33bf684f89b04b75), [`b1e3b74`](https://github.com/sl-design-system/components/commit/b1e3b741e78400e3755ddaa0c5c4fdeed2e3f960), [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb), [`4e57f9c`](https://github.com/sl-design-system/components/commit/4e57f9c60835a07db45f74fde73a3bf13b6abe51)]:
  - @sl-design-system/shared@0.5.0

## 1.1.2

### Patch Changes

- Updated dependencies [[`4714b36`](https://github.com/sl-design-system/components/commit/4714b36f1387d4d1731a310b621caf5a33be105b), [`ebe4c8a`](https://github.com/sl-design-system/components/commit/ebe4c8a32e85b753e2aa752a13b2dc23616bf1a9), [`33fd543`](https://github.com/sl-design-system/components/commit/33fd5432f1499051071662aaca9974c212304bc6)]:
  - @sl-design-system/shared@0.4.0

## 1.1.1

### Patch Changes

- Updated dependencies [[`c8b9c89`](https://github.com/sl-design-system/components/commit/c8b9c89a367066ab241348c9f93e6e087ec796ea), [`96c5ade`](https://github.com/sl-design-system/components/commit/96c5ade1562ca5faf936ce59f13a2fb84abeac56)]:
  - @sl-design-system/shared@0.3.0

## 1.1.0

### Minor Changes

- [#1399](https://github.com/sl-design-system/components/pull/1399) [`de05a3b`](https://github.com/sl-design-system/components/commit/de05a3b26c6a027393791ed63289feba3967eb58) - Add the ability to slot a custom summary

### Patch Changes

- Updated dependencies [[`5212fb6`](https://github.com/sl-design-system/components/commit/5212fb638d3eeb535d5988b8793db21fb4fcc220)]:
  - @sl-design-system/shared@0.2.13

## 1.0.0

### Major Changes

- [#1336](https://github.com/sl-design-system/components/pull/1336) [`d787820`](https://github.com/sl-design-system/components/commit/d7878202384eab3f58908b1cf252851c6a3d2744) - First stable release

### Patch Changes

- [#1313](https://github.com/sl-design-system/components/pull/1313) [`9732df3`](https://github.com/sl-design-system/components/commit/9732df3478609c1261ea7245a924976d0b98d87b) - Fixed color of icon on disabled items

- Updated dependencies [[`a705c3f`](https://github.com/sl-design-system/components/commit/a705c3f7034207b19a10a819bccd85a3347e0204), [`5f4226f`](https://github.com/sl-design-system/components/commit/5f4226f0025e4839fc5c8a694c2df26bafea67c2)]:
  - @sl-design-system/shared@0.2.12

## 0.0.7

### Patch Changes

- [#1259](https://github.com/sl-design-system/components/pull/1259) [`4d3db78`](https://github.com/sl-design-system/components/commit/4d3db782667ce5f1c6b3b0938ebee5cb7a81d68a) - Fixed issue where icons got distorted when zooming in Safari

## 0.0.6

### Patch Changes

- Updated dependencies [[`59a41aa`](https://github.com/sl-design-system/components/commit/59a41aa4b6530d5002e6e45313249e4abe7dac3b)]:
  - @sl-design-system/shared@0.2.11

## 0.0.5

### Patch Changes

- [#1107](https://github.com/sl-design-system/components/pull/1107) [`ee7d9f7`](https://github.com/sl-design-system/components/commit/ee7d9f79ced5d189c8d1a54055535211222c00d4) - Tokens changes - improved color contrast

- [#1107](https://github.com/sl-design-system/components/pull/1107) [`ee7d9f7`](https://github.com/sl-design-system/components/commit/ee7d9f79ced5d189c8d1a54055535211222c00d4) - Fixed background color

- Updated dependencies [[`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537), [`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537)]:
  - @sl-design-system/shared@0.2.10

## 0.0.4

### Patch Changes

- Updated dependencies [[`d22722e`](https://github.com/sl-design-system/components/commit/d22722e6792c19c76d0fb6ec476fac1ff241d52b)]:
  - @sl-design-system/shared@0.2.9

## 0.0.3

### Patch Changes

- [#1062](https://github.com/sl-design-system/components/pull/1062) [`705daf5`](https://github.com/sl-design-system/components/commit/705daf5a8df25db662160879742355b0e355cb31) - Various improvements/bug fixes:
  - Fix a delay in the icon animation when the accordion closes
  - Fix the icon being squashed when the summary spans multiple lines
  - Add ability to navigate between accordion items using the arrow keys
  - Add public `toggle()` API to programmatically open/close accordion items
- Updated dependencies [[`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da), [`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da)]:
  - @sl-design-system/shared@0.2.8

## 0.0.2

### Patch Changes

- Updated dependencies [[`38b0ca4`](https://github.com/sl-design-system/components/commit/38b0ca4d72014605418639b69410863eb8e231ad)]:
  - @sl-design-system/shared@0.2.7

## 0.0.1

### Patch Changes

- [#1045](https://github.com/sl-design-system/components/pull/1045) [`f3e0a37`](https://github.com/sl-design-system/components/commit/f3e0a370ba5e9f4488c26efc8d79b44c18a1d5d4) - Added missing `background-color` for details wrapper, removed unnecessary `aria-disabled` attribute

- [#1036](https://github.com/sl-design-system/components/pull/1036) [`b39b2a3`](https://github.com/sl-design-system/components/commit/b39b2a3dc6764e16e9c611ac6c96a4eef61e9421) - New accordion component
