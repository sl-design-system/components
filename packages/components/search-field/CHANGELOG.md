# @sl-design-system/search-field

## 0.2.1

### Patch Changes

- [#2547](https://github.com/sl-design-system/components/pull/2547) [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68) - Bump patch version of `@open-wc/scoped-elements` peer dependency

- Updated dependencies [[`0c4f19b`](https://github.com/sl-design-system/components/commit/0c4f19beb6f66b6cba944c6bc4589252113554fb), [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68), [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68), [`0b48907`](https://github.com/sl-design-system/components/commit/0b48907b54289cbfd37266d870a42baba071ba1a), [`0e2e426`](https://github.com/sl-design-system/components/commit/0e2e426041997a299f3e35bcde499909d62f7ce9), [`17fbc40`](https://github.com/sl-design-system/components/commit/17fbc404a27bada6a5013c84c34a2936de604f16)]:
  - @sl-design-system/text-field@1.6.6
  - @sl-design-system/shared@0.9.0

## 0.2.0

### Minor Changes

- [#1975](https://github.com/sl-design-system/components/pull/1975) [`4a6f8ba`](https://github.com/sl-design-system/components/commit/4a6f8ba02f49e8be7b37028c9b6a558ad91d9664) - Minor improvements:
  - Add the ability to slot a different icon in the `prefix` slot
  - Use the same clearable button style as the select component

### Patch Changes

- [#2036](https://github.com/sl-design-system/components/pull/2036) [`b411a41`](https://github.com/sl-design-system/components/commit/b411a415b496b0ca15677b58ca41c7d770833b6e) - Improved translations by using `id` to prevent unnecessary overwriting, which will also help with adding translations in more languages in the future.

- Updated dependencies [[`1072075`](https://github.com/sl-design-system/components/commit/1072075e3f1b5f0bf8b07dc1f89fd39b9f7103d0), [`b411a41`](https://github.com/sl-design-system/components/commit/b411a415b496b0ca15677b58ca41c7d770833b6e), [`4a6f8ba`](https://github.com/sl-design-system/components/commit/4a6f8ba02f49e8be7b37028c9b6a558ad91d9664)]:
  - @sl-design-system/shared@0.8.0
  - @sl-design-system/text-field@1.6.4

## 0.1.3

### Patch Changes

- Updated dependencies [[`ab33cc8`](https://github.com/sl-design-system/components/commit/ab33cc86cc01480fb20206be689f9bbdb62bf0ad)]:
  - @sl-design-system/shared@0.7.0
  - @sl-design-system/text-field@1.6.3

## 0.1.2

### Patch Changes

- Updated dependencies [[`fa0b85d`](https://github.com/sl-design-system/components/commit/fa0b85d46c08018cd43de432c3a9705e7aede2c8), [`eaca9d2`](https://github.com/sl-design-system/components/commit/eaca9d24a6086d7a60dc5efc5332f16e80485d36), [`fe3c562`](https://github.com/sl-design-system/components/commit/fe3c562d4e18ab93e9209aaab1a604774cfba5fb)]:
  - @sl-design-system/shared@0.6.0
  - @sl-design-system/text-field@1.6.2

## 0.1.1

### Patch Changes

- [#1840](https://github.com/sl-design-system/components/pull/1840) [`94ec687`](https://github.com/sl-design-system/components/commit/94ec687d8d37f12dd569c902dd777b965ae3a029) - Fix `updated()` lifecycle loop warnings in the console

- Updated dependencies [[`94ec687`](https://github.com/sl-design-system/components/commit/94ec687d8d37f12dd569c902dd777b965ae3a029), [`b37b9a2`](https://github.com/sl-design-system/components/commit/b37b9a26dd9b0b0fe2f412a08803e75168cc4f1c)]:
  - @sl-design-system/text-field@1.6.1

## 0.1.0

### Minor Changes

- [#1794](https://github.com/sl-design-system/components/pull/1794) [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb) - Move `SlClearEvent` to shared package to avoid conflicts

- [#1805](https://github.com/sl-design-system/components/pull/1805) [`94e2a7b`](https://github.com/sl-design-system/components/commit/94e2a7bf1ccaaa9d547654603554cc6bdfdf66fb) - Refactor field buttons to `<sl-field-button>` component

  This new component is not a top-level component. It is just a button
  meant to be used with a text field related component.

  This also fixes several bugs where hover/active styling did not apply to
  slotted buttons.

- [#1713](https://github.com/sl-design-system/components/pull/1713) [`01abf58`](https://github.com/sl-design-system/components/commit/01abf5833d364a76dbdf4e0df0587d0fbec3848e) - Refactor styling to use new contextual tokens

### Patch Changes

- Updated dependencies [[`6309452`](https://github.com/sl-design-system/components/commit/63094521a7b262bd80c1a9a377086093d2844a8d), [`94e2a7b`](https://github.com/sl-design-system/components/commit/94e2a7bf1ccaaa9d547654603554cc6bdfdf66fb), [`cab0938`](https://github.com/sl-design-system/components/commit/cab093898b324073801945fc3771eec2014d6652), [`133b883`](https://github.com/sl-design-system/components/commit/133b883234d911dabe37bd3c8acef26afea20fe9), [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb), [`c4a93fb`](https://github.com/sl-design-system/components/commit/c4a93fba6f40b8e843a169117dfdd331a5d9d6e6), [`c19862e`](https://github.com/sl-design-system/components/commit/c19862e56455c3d8e27a9afc33bf684f89b04b75), [`94e2a7b`](https://github.com/sl-design-system/components/commit/94e2a7bf1ccaaa9d547654603554cc6bdfdf66fb), [`4e80437`](https://github.com/sl-design-system/components/commit/4e804374c3a02e88b04e4c1df662967740461f7c), [`b1e3b74`](https://github.com/sl-design-system/components/commit/b1e3b741e78400e3755ddaa0c5c4fdeed2e3f960), [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb), [`94e2a7b`](https://github.com/sl-design-system/components/commit/94e2a7bf1ccaaa9d547654603554cc6bdfdf66fb), [`4e57f9c`](https://github.com/sl-design-system/components/commit/4e57f9c60835a07db45f74fde73a3bf13b6abe51), [`01abf58`](https://github.com/sl-design-system/components/commit/01abf5833d364a76dbdf4e0df0587d0fbec3848e), [`7e8a441`](https://github.com/sl-design-system/components/commit/7e8a441b053715b896bb7ef775d4a24a93a5a9dd)]:
  - @sl-design-system/shared@0.5.0
  - @sl-design-system/text-field@1.6.0

## 0.0.6

### Patch Changes

- [#1563](https://github.com/sl-design-system/components/pull/1563) [`ae44384`](https://github.com/sl-design-system/components/commit/ae44384129f1a787a82fd35262f3f24e0883df58) - Fix missing types in NPM package

- Updated dependencies [[`33fd543`](https://github.com/sl-design-system/components/commit/33fd5432f1499051071662aaca9974c212304bc6), [`4714b36`](https://github.com/sl-design-system/components/commit/4714b36f1387d4d1731a310b621caf5a33be105b), [`ebe4c8a`](https://github.com/sl-design-system/components/commit/ebe4c8a32e85b753e2aa752a13b2dc23616bf1a9), [`33fd543`](https://github.com/sl-design-system/components/commit/33fd5432f1499051071662aaca9974c212304bc6)]:
  - @sl-design-system/text-field@1.5.0
  - @sl-design-system/shared@0.4.0

## 0.0.5

### Patch Changes

- Updated dependencies [[`c8b9c89`](https://github.com/sl-design-system/components/commit/c8b9c89a367066ab241348c9f93e6e087ec796ea), [`96c5ade`](https://github.com/sl-design-system/components/commit/96c5ade1562ca5faf936ce59f13a2fb84abeac56)]:
  - @sl-design-system/shared@0.3.0
  - @sl-design-system/text-field@1.3.5

## 0.0.4

### Patch Changes

- [#1332](https://github.com/sl-design-system/components/pull/1332) [`d80d9a8`](https://github.com/sl-design-system/components/commit/d80d9a8888398b646147268c02f40512fa8250e6) - Fix prefix & suffix icons having wrong color when disabled

- Updated dependencies [[`a705c3f`](https://github.com/sl-design-system/components/commit/a705c3f7034207b19a10a819bccd85a3347e0204), [`d80d9a8`](https://github.com/sl-design-system/components/commit/d80d9a8888398b646147268c02f40512fa8250e6), [`5f4226f`](https://github.com/sl-design-system/components/commit/5f4226f0025e4839fc5c8a694c2df26bafea67c2)]:
  - @sl-design-system/shared@0.2.12
  - @sl-design-system/text-field@1.3.4

## 0.0.3

### Patch Changes

- [#1299](https://github.com/sl-design-system/components/pull/1299) [`942bf3c`](https://github.com/sl-design-system/components/commit/942bf3ca851889bccd033e3a84f20d4f777c1e35) - Use the new field-button feature of the parent text-field component

- Updated dependencies [[`942bf3c`](https://github.com/sl-design-system/components/commit/942bf3ca851889bccd033e3a84f20d4f777c1e35)]:
  - @sl-design-system/text-field@1.2.0

## 0.0.2

### Patch Changes

- [#1296](https://github.com/sl-design-system/components/pull/1296) [`39a4cb2`](https://github.com/sl-design-system/components/commit/39a4cb206ad923862c902b3ac7dddd4ae5b87746) - Update to use the new TextField generic type

- Updated dependencies [[`39a4cb2`](https://github.com/sl-design-system/components/commit/39a4cb206ad923862c902b3ac7dddd4ae5b87746)]:
  - @sl-design-system/text-field@1.1.0

## 0.0.1

### Patch Changes

- [#1251](https://github.com/sl-design-system/components/pull/1251) [`a3da76c`](https://github.com/sl-design-system/components/commit/a3da76c7df521c2241b565dc22025715f1231e9c) - New component

- Updated dependencies [[`6ab0c88`](https://github.com/sl-design-system/components/commit/6ab0c88a6fa49d3ea14cd42739458f98ce01e4cb), [`c4012af`](https://github.com/sl-design-system/components/commit/c4012af75faaec57e3a1dc5d7f2e8205ce1d3805), [`a3da76c`](https://github.com/sl-design-system/components/commit/a3da76c7df521c2241b565dc22025715f1231e9c), [`6ab0c88`](https://github.com/sl-design-system/components/commit/6ab0c88a6fa49d3ea14cd42739458f98ce01e4cb)]:
  - @sl-design-system/text-field@1.0.0
