# @sl-design-system/number-field

## 0.1.5

### Patch Changes

- [#2547](https://github.com/sl-design-system/components/pull/2547) [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68) - Bump patch version of `@open-wc/scoped-elements` peer dependency

- [#2086](https://github.com/sl-design-system/components/pull/2086) [`0b48907`](https://github.com/sl-design-system/components/commit/0b48907b54289cbfd37266d870a42baba071ba1a) - - Fix issue where the form value wasn't being set correctly when the value was a number.
  - Fix number parser to remove any non essentials characters before parsing
  - Fix missing `sl-change` and `sl-validate` events
  - Change behavior so the formatted value is only updated when the value is programmatically changed, or when the input is blurred
  - Move validation to new `updateInternalValidity()` hook
- Updated dependencies [[`0c4f19b`](https://github.com/sl-design-system/components/commit/0c4f19beb6f66b6cba944c6bc4589252113554fb), [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68), [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68), [`0b48907`](https://github.com/sl-design-system/components/commit/0b48907b54289cbfd37266d870a42baba071ba1a), [`0e2e426`](https://github.com/sl-design-system/components/commit/0e2e426041997a299f3e35bcde499909d62f7ce9), [`17fbc40`](https://github.com/sl-design-system/components/commit/17fbc404a27bada6a5013c84c34a2936de604f16)]:
  - @sl-design-system/text-field@1.6.6
  - @sl-design-system/shared@0.9.0
  - @sl-design-system/format-number@0.0.5

## 0.1.4

### Patch Changes

- [#2036](https://github.com/sl-design-system/components/pull/2036) [`b411a41`](https://github.com/sl-design-system/components/commit/b411a415b496b0ca15677b58ca41c7d770833b6e) - Improved translations by using `id` to prevent unnecessary overwriting, which will also help with adding translations in more languages in the future.

- Updated dependencies [[`1072075`](https://github.com/sl-design-system/components/commit/1072075e3f1b5f0bf8b07dc1f89fd39b9f7103d0), [`b411a41`](https://github.com/sl-design-system/components/commit/b411a415b496b0ca15677b58ca41c7d770833b6e), [`4a6f8ba`](https://github.com/sl-design-system/components/commit/4a6f8ba02f49e8be7b37028c9b6a558ad91d9664)]:
  - @sl-design-system/shared@0.8.0
  - @sl-design-system/text-field@1.6.4
  - @sl-design-system/format-number@0.0.4

## 0.1.3

### Patch Changes

- Updated dependencies [[`ab33cc8`](https://github.com/sl-design-system/components/commit/ab33cc86cc01480fb20206be689f9bbdb62bf0ad)]:
  - @sl-design-system/shared@0.7.0
  - @sl-design-system/format-number@0.0.3
  - @sl-design-system/text-field@1.6.3

## 0.1.2

### Patch Changes

- Updated dependencies [[`fa0b85d`](https://github.com/sl-design-system/components/commit/fa0b85d46c08018cd43de432c3a9705e7aede2c8), [`eaca9d2`](https://github.com/sl-design-system/components/commit/eaca9d24a6086d7a60dc5efc5332f16e80485d36), [`fe3c562`](https://github.com/sl-design-system/components/commit/fe3c562d4e18ab93e9209aaab1a604774cfba5fb)]:
  - @sl-design-system/shared@0.6.0
  - @sl-design-system/format-number@0.0.2
  - @sl-design-system/text-field@1.6.2

## 0.1.1

### Patch Changes

- [#1848](https://github.com/sl-design-system/components/pull/1848) [`f15c0b5`](https://github.com/sl-design-system/components/commit/f15c0b5dd49957f480898eb90759a8681970beb1) - Fix validation not always updating

- [#1840](https://github.com/sl-design-system/components/pull/1840) [`94ec687`](https://github.com/sl-design-system/components/commit/94ec687d8d37f12dd569c902dd777b965ae3a029) - Fix `updated()` lifecycle loop warnings in the console

- Updated dependencies [[`94ec687`](https://github.com/sl-design-system/components/commit/94ec687d8d37f12dd569c902dd777b965ae3a029), [`b37b9a2`](https://github.com/sl-design-system/components/commit/b37b9a26dd9b0b0fe2f412a08803e75168cc4f1c)]:
  - @sl-design-system/text-field@1.6.1

## 0.1.0

### Minor Changes

- [#1805](https://github.com/sl-design-system/components/pull/1805) [`94e2a7b`](https://github.com/sl-design-system/components/commit/94e2a7bf1ccaaa9d547654603554cc6bdfdf66fb) - Refactor field buttons to `<sl-field-button>` component

  This new component is not a top-level component. It is just a button
  meant to be used with a text field related component.

  This also fixes several bugs where hover/active styling did not apply to
  slotted buttons.

### Patch Changes

- [#1785](https://github.com/sl-design-system/components/pull/1785) [`4e80437`](https://github.com/sl-design-system/components/commit/4e804374c3a02e88b04e4c1df662967740461f7c) - New `number-field` component.

- [#1805](https://github.com/sl-design-system/components/pull/1805) [`94e2a7b`](https://github.com/sl-design-system/components/commit/94e2a7bf1ccaaa9d547654603554cc6bdfdf66fb) - Fix being able to change the value using the arrow keys in readonly mode

- Updated dependencies [[`6309452`](https://github.com/sl-design-system/components/commit/63094521a7b262bd80c1a9a377086093d2844a8d), [`94e2a7b`](https://github.com/sl-design-system/components/commit/94e2a7bf1ccaaa9d547654603554cc6bdfdf66fb), [`cab0938`](https://github.com/sl-design-system/components/commit/cab093898b324073801945fc3771eec2014d6652), [`133b883`](https://github.com/sl-design-system/components/commit/133b883234d911dabe37bd3c8acef26afea20fe9), [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb), [`c4a93fb`](https://github.com/sl-design-system/components/commit/c4a93fba6f40b8e843a169117dfdd331a5d9d6e6), [`c19862e`](https://github.com/sl-design-system/components/commit/c19862e56455c3d8e27a9afc33bf684f89b04b75), [`4e80437`](https://github.com/sl-design-system/components/commit/4e804374c3a02e88b04e4c1df662967740461f7c), [`94e2a7b`](https://github.com/sl-design-system/components/commit/94e2a7bf1ccaaa9d547654603554cc6bdfdf66fb), [`4e80437`](https://github.com/sl-design-system/components/commit/4e804374c3a02e88b04e4c1df662967740461f7c), [`b1e3b74`](https://github.com/sl-design-system/components/commit/b1e3b741e78400e3755ddaa0c5c4fdeed2e3f960), [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb), [`94e2a7b`](https://github.com/sl-design-system/components/commit/94e2a7bf1ccaaa9d547654603554cc6bdfdf66fb), [`4e57f9c`](https://github.com/sl-design-system/components/commit/4e57f9c60835a07db45f74fde73a3bf13b6abe51), [`01abf58`](https://github.com/sl-design-system/components/commit/01abf5833d364a76dbdf4e0df0587d0fbec3848e), [`7e8a441`](https://github.com/sl-design-system/components/commit/7e8a441b053715b896bb7ef775d4a24a93a5a9dd)]:
  - @sl-design-system/shared@0.5.0
  - @sl-design-system/text-field@1.6.0
  - @sl-design-system/format-number@0.0.1
