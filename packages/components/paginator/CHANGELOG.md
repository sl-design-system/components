# @sl-design-system/paginator

## 0.0.1

### Patch Changes

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

- [#1642](https://github.com/sl-design-system/components/pull/1642) [`cef2371`](https://github.com/sl-design-system/components/commit/cef2371d5868439edbba8156bf38c167b72f0f39) - Replace `--sl-color-text-default` with `--sl-color-text-plain`

- Updated dependencies [[`6309452`](https://github.com/sl-design-system/components/commit/63094521a7b262bd80c1a9a377086093d2844a8d), [`5bbd9b9`](https://github.com/sl-design-system/components/commit/5bbd9b92fcabec343f9f1bf0c148ed02e5125179), [`7e8a441`](https://github.com/sl-design-system/components/commit/7e8a441b053715b896bb7ef775d4a24a93a5a9dd), [`cab0938`](https://github.com/sl-design-system/components/commit/cab093898b324073801945fc3771eec2014d6652), [`c4a93fb`](https://github.com/sl-design-system/components/commit/c4a93fba6f40b8e843a169117dfdd331a5d9d6e6), [`c19862e`](https://github.com/sl-design-system/components/commit/c19862e56455c3d8e27a9afc33bf684f89b04b75), [`bbcb7f7`](https://github.com/sl-design-system/components/commit/bbcb7f7cd48e22fa1e61f24ba645a4131b0c75ee), [`1a9604e`](https://github.com/sl-design-system/components/commit/1a9604e1fc70a6382a3545dafee527d7d674179d), [`b1e3b74`](https://github.com/sl-design-system/components/commit/b1e3b741e78400e3755ddaa0c5c4fdeed2e3f960), [`849b154`](https://github.com/sl-design-system/components/commit/849b1544bcc7cc60de1eb37ec282f2e467efc7eb), [`cab0938`](https://github.com/sl-design-system/components/commit/cab093898b324073801945fc3771eec2014d6652), [`c4a93fb`](https://github.com/sl-design-system/components/commit/c4a93fba6f40b8e843a169117dfdd331a5d9d6e6), [`cef2371`](https://github.com/sl-design-system/components/commit/cef2371d5868439edbba8156bf38c167b72f0f39)]:
  - @sl-design-system/shared@0.4.1
  - @sl-design-system/announcer@0.0.1
  - @sl-design-system/form@1.1.1
  - @sl-design-system/icon@1.0.3
  - @sl-design-system/button@1.1.1
  - @sl-design-system/menu@0.2.0
  - @sl-design-system/select@1.1.3
