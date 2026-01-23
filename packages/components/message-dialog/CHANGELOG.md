# @sl-design-system/message-dialog

## 1.1.3

### Patch Changes

- [#2913](https://github.com/sl-design-system/components/pull/2913) [`ce9c4ae`](https://github.com/sl-design-system/components/commit/ce9c4ae7b63b365e95289f2de2f9f13f6120a197) - Accessibility improvement - the message dialog uses `<h2>` for title.

## 1.1.2

### Patch Changes

- [#2481](https://github.com/sl-design-system/components/pull/2481) [`0c4f19b`](https://github.com/sl-design-system/components/commit/0c4f19beb6f66b6cba944c6bc4589252113554fb) - Changed token used for the width of the focusring

- [#2547](https://github.com/sl-design-system/components/pull/2547) [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68) - Bump patch version of `@open-wc/scoped-elements` peer dependency

- [#2548](https://github.com/sl-design-system/components/pull/2548) [`5db3329`](https://github.com/sl-design-system/components/commit/5db33293ac0ac53dcb13c607a4df76500eca7141) - Fixed wrong token for bold font-weight

- Updated dependencies [[`0c4f19b`](https://github.com/sl-design-system/components/commit/0c4f19beb6f66b6cba944c6bc4589252113554fb), [`0b48907`](https://github.com/sl-design-system/components/commit/0b48907b54289cbfd37266d870a42baba071ba1a), [`0c4f19b`](https://github.com/sl-design-system/components/commit/0c4f19beb6f66b6cba944c6bc4589252113554fb), [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68), [`17fbc40`](https://github.com/sl-design-system/components/commit/17fbc404a27bada6a5013c84c34a2936de604f16), [`5db3329`](https://github.com/sl-design-system/components/commit/5db33293ac0ac53dcb13c607a4df76500eca7141)]:
  - @sl-design-system/button@1.2.5
  - @sl-design-system/dialog@2.0.2

## 1.1.1

### Patch Changes

- [#2036](https://github.com/sl-design-system/components/pull/2036) [`b411a41`](https://github.com/sl-design-system/components/commit/b411a415b496b0ca15677b58ca41c7d770833b6e) - Improved translations by using `id` to prevent unnecessary overwriting, which will also help with adding translations in more languages in the future.

- Updated dependencies [[`b411a41`](https://github.com/sl-design-system/components/commit/b411a415b496b0ca15677b58ca41c7d770833b6e)]:
  - @sl-design-system/dialog@2.0.1
  - @sl-design-system/button@1.2.4

## 1.1.0

### Minor Changes

- [#1836](https://github.com/sl-design-system/components/pull/1836) [`ab33cc8`](https://github.com/sl-design-system/components/commit/ab33cc86cc01480fb20206be689f9bbdb62bf0ad) - Refactor message-dialog to use contextual tokens
  - Remove the `subtitle` attribute from `MessageDialogConfig` (this is a non-breaking change)
  - Use new contextual tokens for styling
  - Use a plain `<dialog>` instead of inheriting from `<sl-dialog>`
  - Use same desktop animations as `<sl-dialog>`

### Patch Changes

- Updated dependencies [[`ab33cc8`](https://github.com/sl-design-system/components/commit/ab33cc86cc01480fb20206be689f9bbdb62bf0ad)]:
  - @sl-design-system/dialog@2.0.0
  - @sl-design-system/button@1.2.2

## 1.0.1

### Patch Changes

- [#1866](https://github.com/sl-design-system/components/pull/1866) [`fe3c562`](https://github.com/sl-design-system/components/commit/fe3c562d4e18ab93e9209aaab1a604774cfba5fb) - Replace generic `unknown` type with `any` to be more forgiving

- Updated dependencies []:
  - @sl-design-system/button@1.2.1
  - @sl-design-system/dialog@1.2.1

## 1.0.0

### Major Changes

- [`8e75a53`](https://github.com/sl-design-system/components/commit/8e75a5312f15ee77aa61782049acc0a4a54b8aa6) - First stable release

### Patch Changes

- [#1379](https://github.com/sl-design-system/components/pull/1379) [`4242ea2`](https://github.com/sl-design-system/components/commit/4242ea24a85d758a71bb8c88aa6ae8a0aba442b5) - Various improvements:
  - Add `autofocus` attribute to `MessageDialogButton` config
  - Per the documentation, cancel buttons must use `fill="outline"` and `variant="primary"`
  - Improve API documentation

- [#1392](https://github.com/sl-design-system/components/pull/1392) [`fdf3644`](https://github.com/sl-design-system/components/commit/fdf36446ce68afe58d10ace6706258a46c822579) - A message dialog should be centered on mobile, unlike the dialog

- Updated dependencies [[`fdf3644`](https://github.com/sl-design-system/components/commit/fdf36446ce68afe58d10ace6706258a46c822579), [`6c7f900`](https://github.com/sl-design-system/components/commit/6c7f9004959dfbb7a715a6ecec8d82da6b1e5e9c), [`4242ea2`](https://github.com/sl-design-system/components/commit/4242ea24a85d758a71bb8c88aa6ae8a0aba442b5)]:
  - @sl-design-system/dialog@1.0.3
  - @sl-design-system/button@1.0.2

## 0.0.11

### Patch Changes

- Updated dependencies [[`fe047da`](https://github.com/sl-design-system/components/commit/fe047da265a3d657d74ee26df95ebd73f2d7ef7f), [`c4012af`](https://github.com/sl-design-system/components/commit/c4012af75faaec57e3a1dc5d7f2e8205ce1d3805), [`c4012af`](https://github.com/sl-design-system/components/commit/c4012af75faaec57e3a1dc5d7f2e8205ce1d3805)]:
  - @sl-design-system/button@1.0.0
  - @sl-design-system/dialog@1.0.0

## 0.0.10

### Patch Changes

- [#1243](https://github.com/sl-design-system/components/pull/1243) [`6dbe047`](https://github.com/sl-design-system/components/commit/6dbe047d690a069a16c1d96172accce6fa2980cb) - Fix missing `d.ts` files

- Updated dependencies [[`68b6404`](https://github.com/sl-design-system/components/commit/68b6404bc5574b88daae711a2eb535c2572d23b1)]:
  - @sl-design-system/dialog@0.0.17
  - @sl-design-system/button@0.0.28

## 0.0.9

### Patch Changes

- Updated dependencies []:
  - @sl-design-system/button@0.0.27
  - @sl-design-system/dialog@0.0.16

## 0.0.8

### Patch Changes

- Updated dependencies []:
  - @sl-design-system/button@0.0.26
  - @sl-design-system/dialog@0.0.15

## 0.0.7

### Patch Changes

- Updated dependencies []:
  - @sl-design-system/button@0.0.25
  - @sl-design-system/dialog@0.0.14

## 0.0.6

### Patch Changes

- Updated dependencies []:
  - @sl-design-system/button@0.0.24
  - @sl-design-system/dialog@0.0.13

## 0.0.5

### Patch Changes

- Updated dependencies [[`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b)]:
  - @sl-design-system/button@0.0.23
  - @sl-design-system/dialog@0.0.12

## 0.0.4

### Patch Changes

- [#1018](https://github.com/sl-design-system/components/pull/1018) [`aaa09ff`](https://github.com/sl-design-system/components/commit/aaa09ffb78db9df6298ce77d51a79b7aed213e59) - Fix 3rd party dependencies to be peerDependencies instead

- [#995](https://github.com/sl-design-system/components/pull/995) [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5) - Linting fixes due to new eslint configuration

- Updated dependencies [[`aaa09ff`](https://github.com/sl-design-system/components/commit/aaa09ffb78db9df6298ce77d51a79b7aed213e59), [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5)]:
  - @sl-design-system/dialog@0.0.11
  - @sl-design-system/button@0.0.22

## 0.0.3

### Patch Changes

- Updated dependencies []:
  - @sl-design-system/button@0.0.21
  - @sl-design-system/dialog@0.0.10

## 0.0.2

### Patch Changes

- Updated dependencies [[`216d62e`](https://github.com/sl-design-system/components/commit/216d62eb5a16277b4ea2767ea0530e570bf40abf)]:
  - @sl-design-system/button@0.0.20
  - @sl-design-system/dialog@0.0.9

## 0.0.1

### Patch Changes

- [#965](https://github.com/sl-design-system/components/pull/965) [`be112e9`](https://github.com/sl-design-system/components/commit/be112e9521dfba61a0ae2f229915036406f52bc0) - New utility for showing alert, confirmation or custom message dialogs

- Updated dependencies [[`207bb08`](https://github.com/sl-design-system/components/commit/207bb08fdae47c80eb74eb07164d3a0478f6ae78)]:
  - @sl-design-system/dialog@0.0.8
  - @sl-design-system/button@0.0.19
