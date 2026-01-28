# @sl-design-system/tag

## 0.1.9

### Patch Changes

- Updated dependencies [[`e3eb2de`](https://github.com/sl-design-system/components/commit/e3eb2de61e86203aab22cd55bbad4cc058e66a2d)]:
  - @sl-design-system/shared@0.10.0
  - @sl-design-system/tooltip@1.3.1

## 0.1.8

### Patch Changes

- [#2734](https://github.com/sl-design-system/components/pull/2734) [`f676dd5`](https://github.com/sl-design-system/components/commit/f676dd52c83ef2f3429d9a393b5ec634fc05bf0e) - Refactored token for icon sizing, this was still using tokens that have now moved to the deprecated css files.

- Updated dependencies [[`f676dd5`](https://github.com/sl-design-system/components/commit/f676dd52c83ef2f3429d9a393b5ec634fc05bf0e), [`d807cb2`](https://github.com/sl-design-system/components/commit/d807cb22702dc5ac1399cf0528f9ceeeb1f09f60)]:
  - @sl-design-system/icon@1.4.1

## 0.1.7

### Patch Changes

- [#2660](https://github.com/sl-design-system/components/pull/2660) [`d00e59b`](https://github.com/sl-design-system/components/commit/d00e59ba538edb328e418eaa652ad7d1e443916d) - Fix focus outline clipping due to z-index

- [#2692](https://github.com/sl-design-system/components/pull/2692) [`a166ced`](https://github.com/sl-design-system/components/commit/a166cedcbe6a35d3d34476765de523fa59c4dfbc) - Fix missing focus after removing a tag

  This set's the focus to the tag before the removed tag, or the next tag if the removed tag was the first one.

- Updated dependencies [[`d3b9d45`](https://github.com/sl-design-system/components/commit/d3b9d4512e33dbf10a2aa28efc94a54b93002285), [`659a92a`](https://github.com/sl-design-system/components/commit/659a92af4732d339f9830368b1e0e3bd48221714), [`c76f3c8`](https://github.com/sl-design-system/components/commit/c76f3c86cc289be16bdf7ad4ec09baf910d67361), [`f025c0f`](https://github.com/sl-design-system/components/commit/f025c0f3cbb83b72c80563e9d989402608add193), [`e2543df`](https://github.com/sl-design-system/components/commit/e2543df011b9d65b8e11a07323b3712f52859e0e)]:
  - @sl-design-system/tooltip@1.3.0
  - @sl-design-system/shared@0.9.1
  - @sl-design-system/icon@1.3.1

## 0.1.6

### Patch Changes

- [#2481](https://github.com/sl-design-system/components/pull/2481) [`0c4f19b`](https://github.com/sl-design-system/components/commit/0c4f19beb6f66b6cba944c6bc4589252113554fb) - Changed token used for the width of the focusring

- [#2547](https://github.com/sl-design-system/components/pull/2547) [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68) - Bump patch version of `@open-wc/scoped-elements` peer dependency

- Updated dependencies [[`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68), [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68), [`29f38d4`](https://github.com/sl-design-system/components/commit/29f38d4a44003f63e20965ed176dfa9bc16851e7), [`0e2e426`](https://github.com/sl-design-system/components/commit/0e2e426041997a299f3e35bcde499909d62f7ce9), [`17fbc40`](https://github.com/sl-design-system/components/commit/17fbc404a27bada6a5013c84c34a2936de604f16)]:
  - @sl-design-system/shared@0.9.0
  - @sl-design-system/icon@1.3.0
  - @sl-design-system/tooltip@1.1.7

## 0.1.5

### Patch Changes

- [#2036](https://github.com/sl-design-system/components/pull/2036) [`b411a41`](https://github.com/sl-design-system/components/commit/b411a415b496b0ca15677b58ca41c7d770833b6e) - Improved translations by using `id` to prevent unnecessary overwriting, which will also help with adding translations in more languages in the future.

- [#2017](https://github.com/sl-design-system/components/pull/2017) [`0ce2293`](https://github.com/sl-design-system/components/commit/0ce22939899889ab60bdd387ff88a10fa9d7f84e) - Fixes tabindexes for hidden tags in the stacked variant of `sl-tag-list`.

- Updated dependencies [[`d212503`](https://github.com/sl-design-system/components/commit/d21250333818c229635688c01a139b57ccd5ec86), [`1072075`](https://github.com/sl-design-system/components/commit/1072075e3f1b5f0bf8b07dc1f89fd39b9f7103d0), [`4a6f8ba`](https://github.com/sl-design-system/components/commit/4a6f8ba02f49e8be7b37028c9b6a558ad91d9664)]:
  - @sl-design-system/tooltip@1.1.5
  - @sl-design-system/shared@0.8.0

## 0.1.4

### Patch Changes

- [#1972](https://github.com/sl-design-system/components/pull/1972) [`c464140`](https://github.com/sl-design-system/components/commit/c46414048767d65a8489feae054904b9c12df8f5) - Fixing focusing removable tags in the `stacked` version, when there is no stack visible.

- Updated dependencies [[`fc934eb`](https://github.com/sl-design-system/components/commit/fc934eba9f2049fda27d1e3f7c879789eea6254c)]:
  - @sl-design-system/shared@0.7.2

## 0.1.3

### Patch Changes

- [#1953](https://github.com/sl-design-system/components/pull/1953) [`f09f025`](https://github.com/sl-design-system/components/commit/f09f0259b4c0fb0a139974431b8a4bad7d9df6c8) - Removed `--sl-icon-container-size`; the container now always has the same size as the icon. Use margin or an extra wrapper to create extra space around the icon when necessary.

- Updated dependencies [[`0a45fb2`](https://github.com/sl-design-system/components/commit/0a45fb23105fce305650c96c5962afe0bb10b930), [`f09f025`](https://github.com/sl-design-system/components/commit/f09f0259b4c0fb0a139974431b8a4bad7d9df6c8)]:
  - @sl-design-system/shared@0.7.1
  - @sl-design-system/icon@1.2.0

## 0.1.2

### Patch Changes

- Updated dependencies [[`ab33cc8`](https://github.com/sl-design-system/components/commit/ab33cc86cc01480fb20206be689f9bbdb62bf0ad), [`cfcd262`](https://github.com/sl-design-system/components/commit/cfcd262dd65859170196af041f1f6bdceefaf4f5)]:
  - @sl-design-system/shared@0.7.0
  - @sl-design-system/tooltip@1.1.4

## 0.1.1

### Patch Changes

- Updated dependencies [[`fa0b85d`](https://github.com/sl-design-system/components/commit/fa0b85d46c08018cd43de432c3a9705e7aede2c8), [`eaca9d2`](https://github.com/sl-design-system/components/commit/eaca9d24a6086d7a60dc5efc5332f16e80485d36), [`fe3c562`](https://github.com/sl-design-system/components/commit/fe3c562d4e18ab93e9209aaab1a604774cfba5fb)]:
  - @sl-design-system/shared@0.6.0
  - @sl-design-system/tooltip@1.1.3

## 0.1.0

### Minor Changes

- [#1813](https://github.com/sl-design-system/components/pull/1813) [`7b2fdc6`](https://github.com/sl-design-system/components/commit/7b2fdc6ee42af1b096b6f019b0f9e9daba5ed950) - Various improvements:
  - Add missing `disabled` property to `<sl-tag-list>` so the stack tag can be disabled
  - Change design from a visual stack to a regular tag with a `<number>+` text
  - Use the same size (`24px` for `md`, `36px` for `lg`) that is used elsewhere in the design system
  - Do not show the remove button when the tag is disabled
  - Use the new contextual tokens

- [#1713](https://github.com/sl-design-system/components/pull/1713) [`01abf58`](https://github.com/sl-design-system/components/commit/01abf5833d364a76dbdf4e0df0587d0fbec3848e) - Refactor styling to use new contextual tokens

### Patch Changes

- [#1642](https://github.com/sl-design-system/components/pull/1642) [`cef2371`](https://github.com/sl-design-system/components/commit/cef2371d5868439edbba8156bf38c167b72f0f39) - Various improvements:
  - Add `tabindex="-1"` to remove button
  - Minor style fixes
- Updated dependencies [[`6309452`](https://github.com/sl-design-system/components/commit/63094521a7b262bd80c1a9a377086093d2844a8d), [`cab0938`](https://github.com/sl-design-system/components/commit/cab093898b324073801945fc3771eec2014d6652), [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb), [`40cc538`](https://github.com/sl-design-system/components/commit/40cc538648e6ed5ac453fbe708bae8761caaab5e), [`c4a93fb`](https://github.com/sl-design-system/components/commit/c4a93fba6f40b8e843a169117dfdd331a5d9d6e6), [`c19862e`](https://github.com/sl-design-system/components/commit/c19862e56455c3d8e27a9afc33bf684f89b04b75), [`bbcb7f7`](https://github.com/sl-design-system/components/commit/bbcb7f7cd48e22fa1e61f24ba645a4131b0c75ee), [`b1e3b74`](https://github.com/sl-design-system/components/commit/b1e3b741e78400e3755ddaa0c5c4fdeed2e3f960), [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb), [`4e57f9c`](https://github.com/sl-design-system/components/commit/4e57f9c60835a07db45f74fde73a3bf13b6abe51), [`cab0938`](https://github.com/sl-design-system/components/commit/cab093898b324073801945fc3771eec2014d6652)]:
  - @sl-design-system/shared@0.5.0
  - @sl-design-system/icon@1.1.0
  - @sl-design-system/tooltip@1.1.2

## 0.0.4

### Patch Changes

- [#1599](https://github.com/sl-design-system/components/pull/1599) [`4714b36`](https://github.com/sl-design-system/components/commit/4714b36f1387d4d1731a310b621caf5a33be105b) - Various a11y related fixes

  `<sl-tag-list>`:
  - Use `aria-labelledby` for the tooltip instead of `aria-describedby`
  - Do not set an `aria-label` on the host element; `role="list"` provides enough information

  `<sl-tag>`:
  - Add ability to use Delete or Backspace keys to remove the tag
  - Use `aria-description` to describe how to remove the tag using the keyboard
  - Make the delete button have `aria-hidden="true"`
  - Remove `tabindex` from the `.wrapper` element in the shadow DOM

- Updated dependencies [[`4714b36`](https://github.com/sl-design-system/components/commit/4714b36f1387d4d1731a310b621caf5a33be105b), [`4714b36`](https://github.com/sl-design-system/components/commit/4714b36f1387d4d1731a310b621caf5a33be105b), [`ebe4c8a`](https://github.com/sl-design-system/components/commit/ebe4c8a32e85b753e2aa752a13b2dc23616bf1a9), [`3ce1a3b`](https://github.com/sl-design-system/components/commit/3ce1a3b2c7c185ae6499b7dad22056d4de96a3a0), [`33fd543`](https://github.com/sl-design-system/components/commit/33fd5432f1499051071662aaca9974c212304bc6)]:
  - @sl-design-system/tooltip@1.1.1
  - @sl-design-system/shared@0.4.0

## 0.0.3

### Patch Changes

- [#1492](https://github.com/sl-design-system/components/pull/1492) [`21302c2`](https://github.com/sl-design-system/components/commit/21302c28065512f1c89ffde17dbc3241a2306d5d) - Fix tag list width calculation

- Updated dependencies [[`21302c2`](https://github.com/sl-design-system/components/commit/21302c28065512f1c89ffde17dbc3241a2306d5d)]:
  - @sl-design-system/shared@0.3.2

## 0.0.2

### Patch Changes

- [#1484](https://github.com/sl-design-system/components/pull/1484) [`56ddcea`](https://github.com/sl-design-system/components/commit/56ddcea15cb6b9711b3735f60abe8a723ac831c0) - Fixed tag translations

## 0.0.1

### Patch Changes

- [#1422](https://github.com/sl-design-system/components/pull/1422) [`2833861`](https://github.com/sl-design-system/components/commit/28338611d0fccf175c3e22eb268fc5892522dc78) - Added tag and tag list component

- Updated dependencies [[`e3597ad`](https://github.com/sl-design-system/components/commit/e3597adca3a2b98f1507af55b7fb3748d9c29ffb), [`5c4063e`](https://github.com/sl-design-system/components/commit/5c4063ed63560ca3e07940492653d23a4ec009d8), [`c8b9c89`](https://github.com/sl-design-system/components/commit/c8b9c89a367066ab241348c9f93e6e087ec796ea), [`3070e81`](https://github.com/sl-design-system/components/commit/3070e81b03ec83ef79149c84d3e5e7876b38591f), [`ff1618c`](https://github.com/sl-design-system/components/commit/ff1618cdfa4d0060465d993f656345ba1044f88c), [`96c5ade`](https://github.com/sl-design-system/components/commit/96c5ade1562ca5faf936ce59f13a2fb84abeac56)]:
  - @sl-design-system/icon@1.0.2
  - @sl-design-system/tooltip@1.1.0
  - @sl-design-system/shared@0.3.0
