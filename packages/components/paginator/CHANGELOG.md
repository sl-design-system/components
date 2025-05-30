# @sl-design-system/paginator

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
