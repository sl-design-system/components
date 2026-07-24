# @sl-design-system/paginator

## 0.2.8

### Patch Changes

- [#3539](https://github.com/sl-design-system/components/pull/3539) [`ea71886`](https://github.com/sl-design-system/components/commit/ea71886f1e7d6d4b12b8e1c8b3a39d5a60a95a40) - Restore keyboard focus to the selected page button after choosing a page from the paginator page number menu.

- Updated dependencies [[`b061815`](https://github.com/sl-design-system/components/commit/b061815e01985d973dcf93fbde20c9c595095987), [`de31def`](https://github.com/sl-design-system/components/commit/de31defb47c51816aabf8dfa5d53666378f2d07c), [`d5d17f8`](https://github.com/sl-design-system/components/commit/d5d17f8859fc663af83f6e2dd47286b87bd96a48), [`ab43bd7`](https://github.com/sl-design-system/components/commit/ab43bd715bfb51b1a007bf2acb87e7061ae8ad19), [`b40a00a`](https://github.com/sl-design-system/components/commit/b40a00a7d2987aebe11982476f5dd6f158eab3b1), [`0a4f62e`](https://github.com/sl-design-system/components/commit/0a4f62e454ad02ea56889f73e0a5f35cda488dbc), [`5ac49c3`](https://github.com/sl-design-system/components/commit/5ac49c306cc25d5ae7a334e87fc26736dcade9a7), [`c7efbd2`](https://github.com/sl-design-system/components/commit/c7efbd275e4638d5e94daa5d1a46fba73711f340), [`9ca0bc2`](https://github.com/sl-design-system/components/commit/9ca0bc28d6596c061f33205f3422169960c8c180)]:
  - @sl-design-system/select@2.2.0
  - @sl-design-system/menu@0.4.0
  - @sl-design-system/icon@1.4.3
  - @sl-design-system/shared@0.12.3

## 0.2.7

### Patch Changes

- [#3448](https://github.com/sl-design-system/components/pull/3448) [`14ea88b`](https://github.com/sl-design-system/components/commit/14ea88b50c33027cc6b80ad93321b7911d3284f6) - Update `@open-wc/scoped-elements` due to typing fix

  This update fixes the export of the typings, which causes errors due to missing `override` keywords in the components. This is a patch update, as it only contains a fix for the export of the typings and does not introduce any breaking changes.

- [#3289](https://github.com/sl-design-system/components/pull/3289) [`7f08962`](https://github.com/sl-design-system/components/commit/7f08962d1e7313a87b58729d64c88e283c686e68) - Fix paginator selected page styling for `emphasis="bold"` by driving page button appearance via `fill`/`variant` (selected uses `variant="primary"` with `fill="solid"` for bold and `fill="outline"` for subtle), while keeping `aria-current="page"` for accessibility.

  Update `sl-button` interaction styling so `fill="ghost"`/`fill="outline"` use the plain hover/active opacity tokens, and outline buttons marked `aria-current="page"` get a selected border color.

- Updated dependencies [[`f2d2914`](https://github.com/sl-design-system/components/commit/f2d2914f4622de01b49e49b78abc17956e7438d3), [`db96be2`](https://github.com/sl-design-system/components/commit/db96be26709e837b1a4e3e6ea176b75c0823be2a), [`b19dbe7`](https://github.com/sl-design-system/components/commit/b19dbe7d6bffbf3f7e1373f4bcc5693b4352c3ba), [`d968f3e`](https://github.com/sl-design-system/components/commit/d968f3ed2c3601aaed68352feb1147f2ead35499), [`14ea88b`](https://github.com/sl-design-system/components/commit/14ea88b50c33027cc6b80ad93321b7911d3284f6), [`b558bd7`](https://github.com/sl-design-system/components/commit/b558bd704911d6bbd090b51c7f98000666b9094f), [`7f08962`](https://github.com/sl-design-system/components/commit/7f08962d1e7313a87b58729d64c88e283c686e68)]:
  - @sl-design-system/menu@0.3.4
  - @sl-design-system/shared@0.12.2
  - @sl-design-system/select@2.1.5
  - @sl-design-system/form@1.4.2
  - @sl-design-system/announcer@0.1.0
  - @sl-design-system/button@2.1.1

## 0.2.6

### Patch Changes

- [#3378](https://github.com/sl-design-system/components/pull/3378) [`93ce662`](https://github.com/sl-design-system/components/commit/93ce662b03d9189f121930cedd94e6552af9e666) - Prevent page numbers from wrapping in the extra small paginator page select

- [#3231](https://github.com/sl-design-system/components/pull/3231) [`1480226`](https://github.com/sl-design-system/components/commit/1480226d34dc977bcc40b80878ff6ce28ece301d) - Changed the translation keys for certain elements. Make sure you also update `@sl-design-system/locales` when updating to these component versions.

- Updated dependencies [[`5592e42`](https://github.com/sl-design-system/components/commit/5592e4221c4cb279449ec450624d26796ecc5f4a), [`78e7333`](https://github.com/sl-design-system/components/commit/78e733338fd67ef59797b3e02b22907fe0f5c638), [`7163d4e`](https://github.com/sl-design-system/components/commit/7163d4ee4cb47e4db591aceba2e3978f8f31b2c7), [`1480226`](https://github.com/sl-design-system/components/commit/1480226d34dc977bcc40b80878ff6ce28ece301d), [`7163d4e`](https://github.com/sl-design-system/components/commit/7163d4ee4cb47e4db591aceba2e3978f8f31b2c7), [`1480226`](https://github.com/sl-design-system/components/commit/1480226d34dc977bcc40b80878ff6ce28ece301d)]:
  - @sl-design-system/menu@0.3.3
  - @sl-design-system/button@2.1.0
  - @sl-design-system/form@1.4.1
  - @sl-design-system/shared@0.12.1

## 0.2.5

### Patch Changes

- Updated dependencies [[`50590de`](https://github.com/sl-design-system/components/commit/50590de476ff108cc28b865dbc96e3ca48399538), [`50590de`](https://github.com/sl-design-system/components/commit/50590de476ff108cc28b865dbc96e3ca48399538), [`dd96d1b`](https://github.com/sl-design-system/components/commit/dd96d1b88f030a7b4a81b51d77a8461b5692909c), [`01c7740`](https://github.com/sl-design-system/components/commit/01c7740ba9f15a3cbee3065a798424d783b2c452), [`99c1464`](https://github.com/sl-design-system/components/commit/99c1464e46f0f6c2f17d7d8ccd62f58bacaceeb3), [`50590de`](https://github.com/sl-design-system/components/commit/50590de476ff108cc28b865dbc96e3ca48399538), [`0d948ac`](https://github.com/sl-design-system/components/commit/0d948ac198645410455b47037fea89b25117e537)]:
  - @sl-design-system/button@2.0.0
  - @sl-design-system/shared@0.12.0
  - @sl-design-system/select@2.1.3
  - @sl-design-system/form@1.3.6
  - @sl-design-system/menu@0.3.1
  - @sl-design-system/announcer@0.0.8

## 0.2.4

### Patch Changes

- Updated dependencies [[`a4a0c23`](https://github.com/sl-design-system/components/commit/a4a0c23a5341a2026c23e6e7fdf05cfdd44dc16c), [`86ea95d`](https://github.com/sl-design-system/components/commit/86ea95defd6ecf26eec20a46fd4545efd386951f), [`a7ac909`](https://github.com/sl-design-system/components/commit/a7ac90987881881bd0cb916c583e68c785b52622), [`a4a0c23`](https://github.com/sl-design-system/components/commit/a4a0c23a5341a2026c23e6e7fdf05cfdd44dc16c), [`fd4a0d7`](https://github.com/sl-design-system/components/commit/fd4a0d79b4c0d9a1438b437bc7a1122f03d08c11), [`716e305`](https://github.com/sl-design-system/components/commit/716e305a7cc5cbafb5dd97b16c9f70e4320d45e4), [`9e361f4`](https://github.com/sl-design-system/components/commit/9e361f40a25242652c3f7878851fbfd2a75c8f3d), [`330e06f`](https://github.com/sl-design-system/components/commit/330e06ff36c7a5c96cf313b60a5013d6307477c7), [`1eb362d`](https://github.com/sl-design-system/components/commit/1eb362dd94930ce7c1cf028f3cfa7a3eec903ab2), [`771727b`](https://github.com/sl-design-system/components/commit/771727b4fa8ef952c01f72f9548ba6c74d9cb02d), [`14e1286`](https://github.com/sl-design-system/components/commit/14e12869d8250c9292b15c60e69c99907277302e), [`ed7376b`](https://github.com/sl-design-system/components/commit/ed7376b4aa21c5df7d50119d839000abbab1cbcf), [`2f8d8bf`](https://github.com/sl-design-system/components/commit/2f8d8bf32ca6e90eb9d117c1fcc434a59905769c), [`ae8b9da`](https://github.com/sl-design-system/components/commit/ae8b9da97d3e5adc0a9ecb8feabec67699893bcc), [`771727b`](https://github.com/sl-design-system/components/commit/771727b4fa8ef952c01f72f9548ba6c74d9cb02d)]:
  - @sl-design-system/button@1.3.4
  - @sl-design-system/menu@0.3.0
  - @sl-design-system/shared@0.11.0
  - @sl-design-system/icon@1.4.2
  - @sl-design-system/select@2.1.2
  - @sl-design-system/form@1.3.5
  - @sl-design-system/announcer@0.0.7

## 0.2.3

### Patch Changes

- Updated dependencies [[`e3eb2de`](https://github.com/sl-design-system/components/commit/e3eb2de61e86203aab22cd55bbad4cc058e66a2d), [`00dfe6c`](https://github.com/sl-design-system/components/commit/00dfe6c7dee443324748524b45dd25c4ca39278e), [`e3eb2de`](https://github.com/sl-design-system/components/commit/e3eb2de61e86203aab22cd55bbad4cc058e66a2d)]:
  - @sl-design-system/shared@0.10.0
  - @sl-design-system/select@2.1.1
  - @sl-design-system/announcer@0.0.6
  - @sl-design-system/button@1.3.3
  - @sl-design-system/form@1.3.3
  - @sl-design-system/menu@0.2.8

## 0.2.2

### Patch Changes

- [#2734](https://github.com/sl-design-system/components/pull/2734) [`f676dd5`](https://github.com/sl-design-system/components/commit/f676dd52c83ef2f3429d9a393b5ec634fc05bf0e) - Refactored tokens for padding, this was still using tokens that have now moved to the deprecated css files.

- Updated dependencies [[`f676dd5`](https://github.com/sl-design-system/components/commit/f676dd52c83ef2f3429d9a393b5ec634fc05bf0e), [`39b286c`](https://github.com/sl-design-system/components/commit/39b286c8937f2f9d8339864d44a1c666e50ec6ea), [`d807cb2`](https://github.com/sl-design-system/components/commit/d807cb22702dc5ac1399cf0528f9ceeeb1f09f60), [`f676dd5`](https://github.com/sl-design-system/components/commit/f676dd52c83ef2f3429d9a393b5ec634fc05bf0e), [`ef77be3`](https://github.com/sl-design-system/components/commit/ef77be3c11c6811d2f220c898847bd351c657435)]:
  - @sl-design-system/icon@1.4.1
  - @sl-design-system/select@2.1.0
  - @sl-design-system/menu@0.2.7
  - @sl-design-system/button@1.3.2

## 0.2.1

### Patch Changes

- [#2547](https://github.com/sl-design-system/components/pull/2547) [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68) - Bump patch version of `@open-wc/scoped-elements` peer dependency

- Updated dependencies [[`0b48907`](https://github.com/sl-design-system/components/commit/0b48907b54289cbfd37266d870a42baba071ba1a), [`0c4f19b`](https://github.com/sl-design-system/components/commit/0c4f19beb6f66b6cba944c6bc4589252113554fb), [`17fbc40`](https://github.com/sl-design-system/components/commit/17fbc404a27bada6a5013c84c34a2936de604f16), [`0c4f19b`](https://github.com/sl-design-system/components/commit/0c4f19beb6f66b6cba944c6bc4589252113554fb), [`0b48907`](https://github.com/sl-design-system/components/commit/0b48907b54289cbfd37266d870a42baba071ba1a), [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68), [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68), [`17fbc40`](https://github.com/sl-design-system/components/commit/17fbc404a27bada6a5013c84c34a2936de604f16), [`29f38d4`](https://github.com/sl-design-system/components/commit/29f38d4a44003f63e20965ed176dfa9bc16851e7), [`0e2e426`](https://github.com/sl-design-system/components/commit/0e2e426041997a299f3e35bcde499909d62f7ce9), [`5db3329`](https://github.com/sl-design-system/components/commit/5db33293ac0ac53dcb13c607a4df76500eca7141), [`17fbc40`](https://github.com/sl-design-system/components/commit/17fbc404a27bada6a5013c84c34a2936de604f16)]:
  - @sl-design-system/select@2.0.5
  - @sl-design-system/button@1.2.5
  - @sl-design-system/menu@0.2.5
  - @sl-design-system/form@1.3.0
  - @sl-design-system/announcer@0.0.5
  - @sl-design-system/shared@0.9.0
  - @sl-design-system/icon@1.3.0

## 0.2.0

### Minor Changes

- [#2120](https://github.com/sl-design-system/components/pull/2120) [`ee2985a`](https://github.com/sl-design-system/components/commit/ee2985af6b0124910ea1e5840bd3f46d3719fcc6) - Add `itemLabel` property to the 'paginator status' and 'paginator page size' to customize item label when it's necessary.

### Patch Changes

- Updated dependencies [[`e973712`](https://github.com/sl-design-system/components/commit/e973712439e562714aa0dfe427f88288a8ab78eb), [`5748337`](https://github.com/sl-design-system/components/commit/574833761ff5d1965f21ded94c26f1ff42272420), [`7371487`](https://github.com/sl-design-system/components/commit/7371487bd75cfceca454c243d199c572378d726f)]:
  - @sl-design-system/icon@1.2.1
  - @sl-design-system/form@1.2.4

## 0.1.3

### Patch Changes

- [#2036](https://github.com/sl-design-system/components/pull/2036) [`b411a41`](https://github.com/sl-design-system/components/commit/b411a415b496b0ca15677b58ca41c7d770833b6e) - Improved translations by using `id` to prevent unnecessary overwriting, which will also help with adding translations in more languages in the future.

- [#2034](https://github.com/sl-design-system/components/pull/2034) [`1072075`](https://github.com/sl-design-system/components/commit/1072075e3f1b5f0bf8b07dc1f89fd39b9f7103d0) - Various fixes:
  - Fix issue where the current `pageSize` sometimes did not reflect the `pageSize` property of the data source
  - Fix issue where 2 buttons with "1" were showing when there was only one page
  - Update types due to `ListDataSource` changes
- Updated dependencies [[`4a6f8ba`](https://github.com/sl-design-system/components/commit/4a6f8ba02f49e8be7b37028c9b6a558ad91d9664), [`1072075`](https://github.com/sl-design-system/components/commit/1072075e3f1b5f0bf8b07dc1f89fd39b9f7103d0), [`b411a41`](https://github.com/sl-design-system/components/commit/b411a415b496b0ca15677b58ca41c7d770833b6e), [`4a6f8ba`](https://github.com/sl-design-system/components/commit/4a6f8ba02f49e8be7b37028c9b6a558ad91d9664), [`094e4c7`](https://github.com/sl-design-system/components/commit/094e4c7d9e975e7e7a2d28e80d1c6980786492da)]:
  - @sl-design-system/select@2.0.4
  - @sl-design-system/shared@0.8.0
  - @sl-design-system/form@1.2.3
  - @sl-design-system/announcer@0.0.4
  - @sl-design-system/button@1.2.4
  - @sl-design-system/menu@0.2.4

## 0.1.2

### Patch Changes

- [#1926](https://github.com/sl-design-system/components/pull/1926) [`3766da5`](https://github.com/sl-design-system/components/commit/3766da571ddde0baea8daf63bd0d18a94b333a9d) - Fixed incorrect variables in Dutch translations, added missing translation

- Updated dependencies [[`ab33cc8`](https://github.com/sl-design-system/components/commit/ab33cc86cc01480fb20206be689f9bbdb62bf0ad)]:
  - @sl-design-system/shared@0.7.0
  - @sl-design-system/announcer@0.0.3
  - @sl-design-system/button@1.2.2
  - @sl-design-system/form@1.2.2
  - @sl-design-system/menu@0.2.2
  - @sl-design-system/select@2.0.3

## 0.1.1

### Patch Changes

- Updated dependencies [[`fa0b85d`](https://github.com/sl-design-system/components/commit/fa0b85d46c08018cd43de432c3a9705e7aede2c8), [`1d5a785`](https://github.com/sl-design-system/components/commit/1d5a785b38bc6243f7ab05205669e970a1355324), [`0db4860`](https://github.com/sl-design-system/components/commit/0db48604f9cbae73af25a08437a806dc7566273e), [`eaca9d2`](https://github.com/sl-design-system/components/commit/eaca9d24a6086d7a60dc5efc5332f16e80485d36), [`fe3c562`](https://github.com/sl-design-system/components/commit/fe3c562d4e18ab93e9209aaab1a604774cfba5fb)]:
  - @sl-design-system/shared@0.6.0
  - @sl-design-system/select@2.0.2
  - @sl-design-system/form@1.2.1
  - @sl-design-system/announcer@0.0.2
  - @sl-design-system/button@1.2.1
  - @sl-design-system/menu@0.2.1

## 0.1.0

### Minor Changes

- [#1794](https://github.com/sl-design-system/components/pull/1794) [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb) - Replace `<sl-select-option>` with `<sl-option>`

- [#1713](https://github.com/sl-design-system/components/pull/1713) [`01abf58`](https://github.com/sl-design-system/components/commit/01abf5833d364a76dbdf4e0df0587d0fbec3848e) - Refactor styling to use new contextual tokens

### Patch Changes

- [#1804](https://github.com/sl-design-system/components/pull/1804) [`7a0b48e`](https://github.com/sl-design-system/components/commit/7a0b48e981ad4c7cc1a34022625e6ae3ee55c977) - - Applied new tokens to the paginator,

  - Paginator component changes:
    - `size` property no longer controls the width of the layout of the entire paginator, but only the size of the components within the paginator,
    - new `width` property that controls the width of the layout of the entire paginator,
    - new `emphasis` property.

- [#1690](https://github.com/sl-design-system/components/pull/1690) [`1a9604e`](https://github.com/sl-design-system/components/commit/1a9604e1fc70a6382a3545dafee527d7d674179d) - Various improvements:

  - Add missing dependencies (announcer & form)
  - Rename `<sl-paginator-size>` to `<sl-paginator-page-size>`
  - Remove `pageSizes` property from `<sl-paginator>`
  - Refactor `dataSource` properties in all components
  - Only announce a page change when the user clicks on the previous/next buttons
  - Simplify the `<sl-paginator>` implementation
  - Fix `<sl-paginator>` announcements _after_ the component has been removed from the DOM
  - Fix lifecycle warnings displayed in the console
  - Disable the `<sl-select>` instead of hiding it when there are no page sizes

- [#1649](https://github.com/sl-design-system/components/pull/1649) [`5bbd9b9`](https://github.com/sl-design-system/components/commit/5bbd9b92fcabec343f9f1bf0c148ed02e5125179) - use new Announcer component

- [#1497](https://github.com/sl-design-system/components/pull/1497) [`dd63dd8`](https://github.com/sl-design-system/components/commit/dd63dd88f83f81316dd133b2eb9383454dae0b2f) - Added new `paginator`, `items counter` and `page size` components that can be used together or separately.

- [#1693](https://github.com/sl-design-system/components/pull/1693) [`4e57f9c`](https://github.com/sl-design-system/components/commit/4e57f9c60835a07db45f74fde73a3bf13b6abe51) - Refactor existing data sources into list specific datasources, clearing
  the way to add `TreeDataSource` in the `@sl-design-system/tree` package.

  - The base `DataSource` class has support for sorting and filtering
  - Grouping and pagination has been moved to the `ListDataSource` class
  - `ArrayDataSource` and `FetchDataSource` have been renamed to `ArrayListDataSource` and `FetchListDataSource` respectively

- [#1642](https://github.com/sl-design-system/components/pull/1642) [`cef2371`](https://github.com/sl-design-system/components/commit/cef2371d5868439edbba8156bf38c167b72f0f39) - Replace `--sl-color-text-default` with `--sl-color-text-plain`

- Updated dependencies [[`67f5b81`](https://github.com/sl-design-system/components/commit/67f5b810558d124289f26e3cc3fb2c59da97bb5f), [`389d0e2`](https://github.com/sl-design-system/components/commit/389d0e2a982dd40b4e3a04cf3b1d8b34204236a0), [`6309452`](https://github.com/sl-design-system/components/commit/63094521a7b262bd80c1a9a377086093d2844a8d), [`94e2a7b`](https://github.com/sl-design-system/components/commit/94e2a7bf1ccaaa9d547654603554cc6bdfdf66fb), [`5bbd9b9`](https://github.com/sl-design-system/components/commit/5bbd9b92fcabec343f9f1bf0c148ed02e5125179), [`7e8a441`](https://github.com/sl-design-system/components/commit/7e8a441b053715b896bb7ef775d4a24a93a5a9dd), [`cab0938`](https://github.com/sl-design-system/components/commit/cab093898b324073801945fc3771eec2014d6652), [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb), [`133b883`](https://github.com/sl-design-system/components/commit/133b883234d911dabe37bd3c8acef26afea20fe9), [`389d0e2`](https://github.com/sl-design-system/components/commit/389d0e2a982dd40b4e3a04cf3b1d8b34204236a0), [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb), [`40cc538`](https://github.com/sl-design-system/components/commit/40cc538648e6ed5ac453fbe708bae8761caaab5e), [`c4a93fb`](https://github.com/sl-design-system/components/commit/c4a93fba6f40b8e843a169117dfdd331a5d9d6e6), [`c19862e`](https://github.com/sl-design-system/components/commit/c19862e56455c3d8e27a9afc33bf684f89b04b75), [`bbcb7f7`](https://github.com/sl-design-system/components/commit/bbcb7f7cd48e22fa1e61f24ba645a4131b0c75ee), [`b413dae`](https://github.com/sl-design-system/components/commit/b413dae4961f8b1a4ee8e45ab9a421af455ffc51), [`1a9604e`](https://github.com/sl-design-system/components/commit/1a9604e1fc70a6382a3545dafee527d7d674179d), [`a62dee4`](https://github.com/sl-design-system/components/commit/a62dee4a381450cca44c647a54d850290e5b0f11), [`b1e3b74`](https://github.com/sl-design-system/components/commit/b1e3b741e78400e3755ddaa0c5c4fdeed2e3f960), [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb), [`94e2a7b`](https://github.com/sl-design-system/components/commit/94e2a7bf1ccaaa9d547654603554cc6bdfdf66fb), [`4e57f9c`](https://github.com/sl-design-system/components/commit/4e57f9c60835a07db45f74fde73a3bf13b6abe51), [`849b154`](https://github.com/sl-design-system/components/commit/849b1544bcc7cc60de1eb37ec282f2e467efc7eb), [`01abf58`](https://github.com/sl-design-system/components/commit/01abf5833d364a76dbdf4e0df0587d0fbec3848e), [`cab0938`](https://github.com/sl-design-system/components/commit/cab093898b324073801945fc3771eec2014d6652), [`c4a93fb`](https://github.com/sl-design-system/components/commit/c4a93fba6f40b8e843a169117dfdd331a5d9d6e6), [`cef2371`](https://github.com/sl-design-system/components/commit/cef2371d5868439edbba8156bf38c167b72f0f39)]:
  - @sl-design-system/menu@0.2.0
  - @sl-design-system/button@1.2.0
  - @sl-design-system/shared@0.5.0
  - @sl-design-system/select@2.0.0
  - @sl-design-system/announcer@0.0.1
  - @sl-design-system/form@1.2.0
  - @sl-design-system/icon@1.1.0
