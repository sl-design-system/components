# @sl-design-system/tree

## 0.1.5

### Patch Changes

- [#2036](https://github.com/sl-design-system/components/pull/2036) [`b411a41`](https://github.com/sl-design-system/components/commit/b411a415b496b0ca15677b58ca41c7d770833b6e) - Improved translations by using `id` to prevent unnecessary overwriting, which will also help with adding translations in more languages in the future.

- [#2034](https://github.com/sl-design-system/components/pull/2034) [`1072075`](https://github.com/sl-design-system/components/commit/1072075e3f1b5f0bf8b07dc1f89fd39b9f7103d0) - Update `TreeDataSource` types to match with `DataSource`

- Updated dependencies [[`77b348d`](https://github.com/sl-design-system/components/commit/77b348d19a4869f9242d8ea1c70d32d1e6d04212), [`4a6f8ba`](https://github.com/sl-design-system/components/commit/4a6f8ba02f49e8be7b37028c9b6a558ad91d9664), [`1072075`](https://github.com/sl-design-system/components/commit/1072075e3f1b5f0bf8b07dc1f89fd39b9f7103d0), [`4a6f8ba`](https://github.com/sl-design-system/components/commit/4a6f8ba02f49e8be7b37028c9b6a558ad91d9664), [`b411a41`](https://github.com/sl-design-system/components/commit/b411a415b496b0ca15677b58ca41c7d770833b6e), [`1072075`](https://github.com/sl-design-system/components/commit/1072075e3f1b5f0bf8b07dc1f89fd39b9f7103d0), [`4a6f8ba`](https://github.com/sl-design-system/components/commit/4a6f8ba02f49e8be7b37028c9b6a558ad91d9664), [`a343e29`](https://github.com/sl-design-system/components/commit/a343e298d6b65966e04b3fbfc3598305a29bf1cc)]:
  - @sl-design-system/data-source@0.2.0
  - @sl-design-system/shared@0.8.0
  - @sl-design-system/checkbox@2.1.4

## 0.1.4

### Patch Changes

- [#2005](https://github.com/sl-design-system/components/pull/2005) [`fc934eb`](https://github.com/sl-design-system/components/commit/fc934eba9f2049fda27d1e3f7c879789eea6254c) - Fix `@lit-labs/lit-virtualizer` imports to not accidentally register `<lit-virtualizer>` on the global custom element registry

- Updated dependencies [[`fc934eb`](https://github.com/sl-design-system/components/commit/fc934eba9f2049fda27d1e3f7c879789eea6254c)]:
  - @sl-design-system/shared@0.7.2

## 0.1.3

### Patch Changes

- [#1953](https://github.com/sl-design-system/components/pull/1953) [`f09f025`](https://github.com/sl-design-system/components/commit/f09f0259b4c0fb0a139974431b8a4bad7d9df6c8) - Removed `--sl-icon-container-size`; the container now always has the same size as the icon. Use margin or an extra wrapper to create extra space around the icon when necessary.

- Updated dependencies [[`0a45fb2`](https://github.com/sl-design-system/components/commit/0a45fb23105fce305650c96c5962afe0bb10b930), [`8a08521`](https://github.com/sl-design-system/components/commit/8a08521ce3396630669fbc0c888e4a4d96aeaee5), [`f09f025`](https://github.com/sl-design-system/components/commit/f09f0259b4c0fb0a139974431b8a4bad7d9df6c8)]:
  - @sl-design-system/shared@0.7.1
  - @sl-design-system/data-source@0.1.3
  - @sl-design-system/icon@1.2.0

## 0.1.2

### Patch Changes

- [#1933](https://github.com/sl-design-system/components/pull/1933) [`6072e05`](https://github.com/sl-design-system/components/commit/6072e05d3d8e2c928608071fcbd4cf6f21daf70c) - - Use new contextual tokens for styling,
  - Improve a11y (including role `treegrid` with children of role `row` and `gridcell`).
- Updated dependencies [[`ab33cc8`](https://github.com/sl-design-system/components/commit/ab33cc86cc01480fb20206be689f9bbdb62bf0ad), [`f4e2875`](https://github.com/sl-design-system/components/commit/f4e2875883fd0b8501fa346c17e775a317b85926), [`6432836`](https://github.com/sl-design-system/components/commit/6432836922f8e2f733cd71868f6ffa9ce70ba65e)]:
  - @sl-design-system/shared@0.7.0
  - @sl-design-system/data-source@0.1.2
  - @sl-design-system/spinner@2.0.0
  - @sl-design-system/checkbox@2.1.3

## 0.1.1

### Patch Changes

- Updated dependencies [[`fa0b85d`](https://github.com/sl-design-system/components/commit/fa0b85d46c08018cd43de432c3a9705e7aede2c8), [`eaca9d2`](https://github.com/sl-design-system/components/commit/eaca9d24a6086d7a60dc5efc5332f16e80485d36), [`2eb8a85`](https://github.com/sl-design-system/components/commit/2eb8a857761c43c5be1ba06c5dc4a82a0c6c7151), [`fe3c562`](https://github.com/sl-design-system/components/commit/fe3c562d4e18ab93e9209aaab1a604774cfba5fb)]:
  - @sl-design-system/shared@0.6.0
  - @sl-design-system/checkbox@2.1.2
  - @sl-design-system/data-source@0.1.1

## 0.1.0

### Minor Changes

- [#1791](https://github.com/sl-design-system/components/pull/1791) [`133b883`](https://github.com/sl-design-system/components/commit/133b883234d911dabe37bd3c8acef26afea20fe9) - Replace `--sl-size-borderWidth-subtle` with `--sl-size-borderWidth-default`

- [#1713](https://github.com/sl-design-system/components/pull/1713) [`01abf58`](https://github.com/sl-design-system/components/commit/01abf5833d364a76dbdf4e0df0587d0fbec3848e) - Refactor styling to use new contextual tokens

### Patch Changes

- [#1816](https://github.com/sl-design-system/components/pull/1816) [`8b16a0f`](https://github.com/sl-design-system/components/commit/8b16a0fe9f7fbbbb76f92d112d94bf4c5e1d0995) - Fix multi select styling.

- [#1693](https://github.com/sl-design-system/components/pull/1693) [`4e57f9c`](https://github.com/sl-design-system/components/commit/4e57f9c60835a07db45f74fde73a3bf13b6abe51) - New tree component:
  - Added a new `<sl-tree>` component
  - Added `abstract` `TreeModel`, `FlatTreeModel` and `NestedTreeModel` classes
- Updated dependencies [[`6309452`](https://github.com/sl-design-system/components/commit/63094521a7b262bd80c1a9a377086093d2844a8d), [`4e57f9c`](https://github.com/sl-design-system/components/commit/4e57f9c60835a07db45f74fde73a3bf13b6abe51), [`cab0938`](https://github.com/sl-design-system/components/commit/cab093898b324073801945fc3771eec2014d6652), [`133b883`](https://github.com/sl-design-system/components/commit/133b883234d911dabe37bd3c8acef26afea20fe9), [`1a9604e`](https://github.com/sl-design-system/components/commit/1a9604e1fc70a6382a3545dafee527d7d674179d), [`7a62e08`](https://github.com/sl-design-system/components/commit/7a62e08afbcd5768277164a8075939c3d8c17667), [`de95129`](https://github.com/sl-design-system/components/commit/de951293157d273600e9f5bd97dd25cb21ce6d69), [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb), [`40cc538`](https://github.com/sl-design-system/components/commit/40cc538648e6ed5ac453fbe708bae8761caaab5e), [`c4a93fb`](https://github.com/sl-design-system/components/commit/c4a93fba6f40b8e843a169117dfdd331a5d9d6e6), [`c19862e`](https://github.com/sl-design-system/components/commit/c19862e56455c3d8e27a9afc33bf684f89b04b75), [`bbcb7f7`](https://github.com/sl-design-system/components/commit/bbcb7f7cd48e22fa1e61f24ba645a4131b0c75ee), [`8b16a0f`](https://github.com/sl-design-system/components/commit/8b16a0fe9f7fbbbb76f92d112d94bf4c5e1d0995), [`1b9463f`](https://github.com/sl-design-system/components/commit/1b9463fd91d5e3d99918868fbbd231b425a2a16d), [`b1e3b74`](https://github.com/sl-design-system/components/commit/b1e3b741e78400e3755ddaa0c5c4fdeed2e3f960), [`dd63dd8`](https://github.com/sl-design-system/components/commit/dd63dd88f83f81316dd133b2eb9383454dae0b2f), [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb), [`4e57f9c`](https://github.com/sl-design-system/components/commit/4e57f9c60835a07db45f74fde73a3bf13b6abe51), [`01abf58`](https://github.com/sl-design-system/components/commit/01abf5833d364a76dbdf4e0df0587d0fbec3848e), [`4e57f9c`](https://github.com/sl-design-system/components/commit/4e57f9c60835a07db45f74fde73a3bf13b6abe51), [`7e8a441`](https://github.com/sl-design-system/components/commit/7e8a441b053715b896bb7ef775d4a24a93a5a9dd), [`dd63dd8`](https://github.com/sl-design-system/components/commit/dd63dd88f83f81316dd133b2eb9383454dae0b2f), [`aefe4ec`](https://github.com/sl-design-system/components/commit/aefe4ecebafaf538b9bf129f66216413173686fe)]:
  - @sl-design-system/shared@0.5.0
  - @sl-design-system/checkbox@2.1.0
  - @sl-design-system/data-source@0.1.0
  - @sl-design-system/icon@1.1.0
  - @sl-design-system/button-bar@1.2.0
