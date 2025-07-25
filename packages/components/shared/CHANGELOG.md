# @sl-design-system/shared

## 0.8.0

### Minor Changes

- [#2034](https://github.com/sl-design-system/components/pull/2034) [`1072075`](https://github.com/sl-design-system/components/commit/1072075e3f1b5f0bf8b07dc1f89fd39b9f7103d0) - Removed `SelectionController` since it has been removed from grid and that was the only user.

  See the data-source changes for more details.

### Patch Changes

- [#1975](https://github.com/sl-design-system/components/pull/1975) [`4a6f8ba`](https://github.com/sl-design-system/components/commit/4a6f8ba02f49e8be7b37028c9b6a558ad91d9664) - Use the default `any` type for the `SlSelectionChangeEvent`

## 0.7.2

### Patch Changes

- [#2005](https://github.com/sl-design-system/components/pull/2005) [`fc934eb`](https://github.com/sl-design-system/components/commit/fc934eba9f2049fda27d1e3f7c879789eea6254c) - Fix `@lit-labs/lit-virtualizer` imports to not accidentally register `<lit-virtualizer>` on the global custom element registry

## 0.7.1

### Patch Changes

- [#1963](https://github.com/sl-design-system/components/pull/1963) [`0a45fb2`](https://github.com/sl-design-system/components/commit/0a45fb23105fce305650c96c5962afe0bb10b930) - Add `selected` attribute to `SelectionController` that returns the number of selected items

## 0.7.0

### Minor Changes

- [#1836](https://github.com/sl-design-system/components/pull/1836) [`ab33cc8`](https://github.com/sl-design-system/components/commit/ab33cc86cc01480fb20206be689f9bbdb62bf0ad) - - Remove the `FocusTrapController` and related `focus-trap` dependency

  This was only used within `<sl-dialog>`. That component no longer uses this functionality. Because this was internal API, it's not seen as a breaking change.

  - Add new `MediaController` class to help manage media queries

## 0.6.0

### Minor Changes

- [#1593](https://github.com/sl-design-system/components/pull/1593) [`fa0b85d`](https://github.com/sl-design-system/components/commit/fa0b85d46c08018cd43de432c3a9705e7aede2c8) - Add date converters

### Patch Changes

- [#1904](https://github.com/sl-design-system/components/pull/1904) [`eaca9d2`](https://github.com/sl-design-system/components/commit/eaca9d24a6086d7a60dc5efc5332f16e80485d36) - Use `Constructor` type from `@open-wc/dedupe-mixin`

  This fixes a bug in the `d.ts` files where the `Constructor` type was not being imported correctly.

- [#1866](https://github.com/sl-design-system/components/pull/1866) [`fe3c562`](https://github.com/sl-design-system/components/commit/fe3c562d4e18ab93e9209aaab1a604774cfba5fb) - Replace generic `unknown` type with `any` to be more forgiving

## 0.5.0

### Minor Changes

- [#1794](https://github.com/sl-design-system/components/pull/1794) [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb) - Move `SlClearEvent` to shared package to avoid conflicts

- [#1794](https://github.com/sl-design-system/components/pull/1794) [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb) - Add support for passing a `Ref` to the `anchor()` directive

- [#1693](https://github.com/sl-design-system/components/pull/1693) [`4e57f9c`](https://github.com/sl-design-system/components/commit/4e57f9c60835a07db45f74fde73a3bf13b6abe51) - Add new `focusToElement` method to `FocusGroupController`

  This allows you to focus on a specific element within a focus group. This is
  useful when you want to focus on a specific element within a focus group, but still
  maintain the roving tabindex behavior.

### Patch Changes

- [#1667](https://github.com/sl-design-system/components/pull/1667) [`6309452`](https://github.com/sl-design-system/components/commit/63094521a7b262bd80c1a9a377086093d2844a8d) - Fix flaky unit tests due to focus-trap

- [#1624](https://github.com/sl-design-system/components/pull/1624) [`cab0938`](https://github.com/sl-design-system/components/commit/cab093898b324073801945fc3771eec2014d6652) - Refactor `getValueByPath` and related functions to properly infer type

- [#1637](https://github.com/sl-design-system/components/pull/1637) [`c4a93fb`](https://github.com/sl-design-system/components/commit/c4a93fba6f40b8e843a169117dfdd331a5d9d6e6) - Add new `ObserveAttributesMixin` mixin that can be used to rewrite aria attributes to the right element.

- [#1659](https://github.com/sl-design-system/components/pull/1659) [`c19862e`](https://github.com/sl-design-system/components/commit/c19862e56455c3d8e27a9afc33bf684f89b04b75) - Add FocusTrapController that can be used to trap focus within an element (component).

- [#1616](https://github.com/sl-design-system/components/pull/1616) [`b1e3b74`](https://github.com/sl-design-system/components/commit/b1e3b741e78400e3755ddaa0c5c4fdeed2e3f960) - Improved accessibilty of the table;
  - Added aria-rowindex and aria-rowcount;
  - Improved keyboardnavigation, including skip table links
  - Changed the way selecting works; active row by clicking on the entire row and selecting a row by checking the checkbox

## 0.4.0

### Minor Changes

- [#1575](https://github.com/sl-design-system/components/pull/1575) [`ebe4c8a`](https://github.com/sl-design-system/components/commit/ebe4c8a32e85b753e2aa752a13b2dc23616bf1a9) - Migrate `DataSource` and `ArrayDataSource` to dedicated `@sl-design-system/data-source` package.

  Since these are only used in the grid component, and that component is still in draft, migrating
  this code into its own package is not considered a breaking change.

- [#1580](https://github.com/sl-design-system/components/pull/1580) [`33fd543`](https://github.com/sl-design-system/components/commit/33fd5432f1499051071662aaca9974c212304bc6) - Add new `closestElementComposed` DOM utility method

  This new utility method is a wrapper around `HTMLElement.prototype.closest` that also considers the composed tree. This makes it easier to find the closest ancestor that matches a given selector, even if the element is in a shadow tree.

### Patch Changes

- [#1599](https://github.com/sl-design-system/components/pull/1599) [`4714b36`](https://github.com/sl-design-system/components/commit/4714b36f1387d4d1731a310b621caf5a33be105b) - Fix `RovingTabindexController` to correctly navigate between light & shadow DOM elements

## 0.3.2

### Patch Changes

- [#1492](https://github.com/sl-design-system/components/pull/1492) [`21302c2`](https://github.com/sl-design-system/components/commit/21302c28065512f1c89ffde17dbc3241a2306d5d) - Prevent anchor directive from initializing more than once on the same host

## 0.3.1

### Patch Changes

- [#1499](https://github.com/sl-design-system/components/pull/1499) [`d4bb7fe`](https://github.com/sl-design-system/components/commit/d4bb7fe67bf95807437e41528c334f62d6cff807) - Handle `rootMarginTop` being undefined

## 0.3.0

### Minor Changes

- [#1428](https://github.com/sl-design-system/components/pull/1428) [`c8b9c89`](https://github.com/sl-design-system/components/commit/c8b9c89a367066ab241348c9f93e6e087ec796ea) - Fixed issue where popover was too small to show any content even if there was space on the other side of the anchor component.
  The way to set the min and max size of the popover have changed: use the following properties instead of setting the width directly on the popover. (Those values will be ignored when calculating the size of the popover as it can exist in the available space)
  --sl-popover-min-block-size
  --sl-popover-max-block-size
  --sl-popover-max-inline-size

### Patch Changes

- [#1474](https://github.com/sl-design-system/components/pull/1474) [`96c5ade`](https://github.com/sl-design-system/components/commit/96c5ade1562ca5faf936ce59f13a2fb84abeac56) - Change popover positioning to use `inset` rather than `translate`

## 0.2.13

### Patch Changes

- [#1407](https://github.com/sl-design-system/components/pull/1407) [`5212fb6`](https://github.com/sl-design-system/components/commit/5212fb638d3eeb535d5988b8793db21fb4fcc220) - Fix typing of `SlToggleEvent` to be slightly more flexible

## 0.2.12

### Patch Changes

- [#1328](https://github.com/sl-design-system/components/pull/1328) [`a705c3f`](https://github.com/sl-design-system/components/commit/a705c3f7034207b19a10a819bccd85a3347e0204) - Various fixes:

  - Make it possible to close a tooltip with Escape key
  - Fix issue where the tooltip was broken after first show
  - Fix showing shared tooltip
  - Fix tooltip accessibility - removed `aria-expanded` which is not applicable for tooltips

- [#1325](https://github.com/sl-design-system/components/pull/1325) [`5f4226f`](https://github.com/sl-design-system/components/commit/5f4226f0025e4839fc5c8a694c2df26bafea67c2) - Remove the avatar config settings: no longer needed with the simplified avatar component

## 0.2.11

### Patch Changes

- [#1207](https://github.com/sl-design-system/components/pull/1207) [`59a41aa`](https://github.com/sl-design-system/components/commit/59a41aa4b6530d5002e6e45313249e4abe7dac3b) - Fixed accessibility support for popover by using correct aria-labels

## 0.2.10

### Patch Changes

- [#1116](https://github.com/sl-design-system/components/pull/1116) [`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537) - Add ability to update the items in a `DataSource`

- [#1116](https://github.com/sl-design-system/components/pull/1116) [`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537) - With popover we no longer need to worry about clipping ancestors when positioning

## 0.2.9

### Patch Changes

- [#1110](https://github.com/sl-design-system/components/pull/1110) [`d22722e`](https://github.com/sl-design-system/components/commit/d22722e6792c19c76d0fb6ec476fac1ff241d52b) - Add missing event type

## 0.2.8

### Patch Changes

- [#1058](https://github.com/sl-design-system/components/pull/1058) [`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da) - Add `getScrollParent()` utility method

- [#1058](https://github.com/sl-design-system/components/pull/1058) [`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da) - When calculating the max size of a popover, do not overwrite any existing max size properties if they are present

## 0.2.7

### Patch Changes

- [#1073](https://github.com/sl-design-system/components/pull/1073) [`38b0ca4`](https://github.com/sl-design-system/components/commit/38b0ca4d72014605418639b69410863eb8e231ad) - Fix missing events types

## 0.2.6

### Patch Changes

- [#1018](https://github.com/sl-design-system/components/pull/1018) [`aaa09ff`](https://github.com/sl-design-system/components/commit/aaa09ffb78db9df6298ce77d51a79b7aed213e59) - Fix 3rd party dependencies to be peerDependencies instead

- [#995](https://github.com/sl-design-system/components/pull/995) [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5) - Linting fixes due to new eslint configuration

## 0.2.5

### Patch Changes

- [#992](https://github.com/sl-design-system/components/pull/992) [`dbc032b`](https://github.com/sl-design-system/components/commit/dbc032b3a7587dfcbdb6a2118330b039765cf0fb) - Fix npm install problem due to tinykeys dependency

- [#984](https://github.com/sl-design-system/components/pull/984) [`5da216b`](https://github.com/sl-design-system/components/commit/5da216b3713c328eba06113d77d642462e1f05fc) - Change `AnchorController` to use the arrow positioning of floating-ui

## 0.2.4

### Patch Changes

- [#974](https://github.com/sl-design-system/components/pull/974) [`216d62e`](https://github.com/sl-design-system/components/commit/216d62eb5a16277b4ea2767ea0530e570bf40abf) - Make popover offset and viewportMargin themable

- [#974](https://github.com/sl-design-system/components/pull/974) [`216d62e`](https://github.com/sl-design-system/components/commit/216d62eb5a16277b4ea2767ea0530e570bf40abf) - Remove nested barrel files

## 0.2.3

### Patch Changes

- [#939](https://github.com/sl-design-system/components/pull/939) [`afc3d60`](https://github.com/sl-design-system/components/commit/afc3d606c20409b4ad2d589ffc0b899d3f853997) - Add ability to group by to DataSource

## 0.2.2

### Patch Changes

- [#917](https://github.com/sl-design-system/components/pull/917) [`06cfb6b`](https://github.com/sl-design-system/components/commit/06cfb6bff8f2c1a8d4a132099f21f2e8dc4f2461) - Add select & text-field columns to grid

- [#903](https://github.com/sl-design-system/components/pull/903) [`9320cbc`](https://github.com/sl-design-system/components/commit/9320cbc446e479435860ad5f9756725b36acf764) - Add user agent test method for Safari

- [#925](https://github.com/sl-design-system/components/pull/925) [`2aff1dd`](https://github.com/sl-design-system/components/commit/2aff1dd7aa946cb2ee998d7d121ab585ca9ad39b) - Bump Lit and related dependencies

## 0.2.1

### Patch Changes

- [#869](https://github.com/sl-design-system/components/pull/869) [`b507ee0`](https://github.com/sl-design-system/components/commit/b507ee07e119733d285a348e74f34c4b2d172902) - Emit `sl-selection-change` event when the selection changes in `SelectionController`

- [#862](https://github.com/sl-design-system/components/pull/862) [`d881d5f`](https://github.com/sl-design-system/components/commit/d881d5fc5274be5275f910f445a16408d6bb2373) - Refactor the `EventsController` to accept more types

## 0.2.0

### Minor Changes

- [#787](https://github.com/sl-design-system/components/pull/787) [`198c7c2`](https://github.com/sl-design-system/components/commit/198c7c277787d48276d402522f94f2d0d5132152) - Added popover component

### Patch Changes

- [#724](https://github.com/sl-design-system/components/pull/724) [`b3f9d42`](https://github.com/sl-design-system/components/commit/b3f9d42945c7b427105353ede3cf74ba3191792d) - Added avatar + added token for focus ring offset

## 0.1.9

### Patch Changes

- [#739](https://github.com/sl-design-system/components/pull/739) [`45bff4d`](https://github.com/sl-design-system/components/commit/45bff4d60a32f4d46d8c9c99200efeaa1be6a2f0) - Fix for incorrect box shadow values

- [#741](https://github.com/sl-design-system/components/pull/741) [`199a2fc`](https://github.com/sl-design-system/components/commit/199a2fc0b3f0efb54c06429fd91fa09071b337de) - Fix missing `@lit/localize` dependency

- [#688](https://github.com/sl-design-system/components/pull/688) [`a816bfe`](https://github.com/sl-design-system/components/commit/a816bfec8e3459cc3b12def88922a421345768f0) - Upgrade to Lit 3.0

## 0.1.8

### Patch Changes

- [#545](https://github.com/sl-design-system/components/pull/545) [`680e9a9`](https://github.com/sl-design-system/components/commit/680e9a97c4332a37b5949ca74eb699a3bc95f448) - changed focus indicator to outline instead of box shadow

- [#642](https://github.com/sl-design-system/components/pull/642) [`5208fa3`](https://github.com/sl-design-system/components/commit/5208fa38b4d702f9939a2b6c19065bc7a6ffa2cb) - Added tooltip component + some cleanup in related components

## 0.1.7

### Patch Changes

- [#552](https://github.com/sl-design-system/components/pull/552) [`34696fb`](https://github.com/sl-design-system/components/commit/34696fb6c288a8c6101b7a5b80cef1240229a522) - Fix regexp matching in `getValueByPath`

## 0.1.6

### Patch Changes

- [#551](https://github.com/sl-design-system/components/pull/551) [`c901f6c`](https://github.com/sl-design-system/components/commit/c901f6c5409367d19f2ced63c486f820af834faf) - Support arrays in `getValueByPath`

- [#499](https://github.com/sl-design-system/components/pull/499) [`2203785`](https://github.com/sl-design-system/components/commit/22037855352e444362e42ebfebf9e6d1295bada1) - added select component

- [#478](https://github.com/sl-design-system/components/pull/478) [`b9a0b33`](https://github.com/sl-design-system/components/commit/b9a0b338b4e4047dbd809e501c163fa97a39130e) - added textfield, text area and switch

## 0.1.5

### Patch Changes

- [#543](https://github.com/sl-design-system/components/pull/543) [`6f125e6`](https://github.com/sl-design-system/components/commit/6f125e6886f85fcfb8521e656f682e7385fe8aff) - Various improvements to data source & grid state

## 0.1.4

### Patch Changes

- [#539](https://github.com/sl-design-system/components/pull/539) [`46c49dd`](https://github.com/sl-design-system/components/commit/46c49dd2e281d7efbeed40c9ee1e22b44265bc1a) - Fix `EventsController` `listen()` types

## 0.1.3

### Patch Changes

- [#519](https://github.com/sl-design-system/components/pull/519) [`13aa7e7`](https://github.com/sl-design-system/components/commit/13aa7e75e2f26262261dba498fde3412d4259939) - Handle blank values properly when filtering

## 0.1.2

### Patch Changes

- [#517](https://github.com/sl-design-system/components/pull/517) [`8a53d80`](https://github.com/sl-design-system/components/commit/8a53d800564073f7840a9f6365b234df3351c44f) - Update `ArrayDataSource` to use custom sort function

## 0.1.1

### Patch Changes

- [#491](https://github.com/sl-design-system/components/pull/491) [`d7f7af8`](https://github.com/sl-design-system/components/commit/d7f7af8908b83a5ff5f88400d44cb578eb51e7bb) - Fix bug with `EventsController` where the cleanup did not happen

- [#491](https://github.com/sl-design-system/components/pull/491) [`d7f7af8`](https://github.com/sl-design-system/components/commit/d7f7af8908b83a5ff5f88400d44cb578eb51e7bb) - Add `positionPopover` utility utilising `@floating-ui/dom`

## 0.1.0

### Minor Changes

- [#454](https://github.com/sl-design-system/components/pull/454) [`4c1ba25`](https://github.com/sl-design-system/components/commit/4c1ba250a5b5edc65a74c47b9fbd869324791f17) - Styled hint and validation

## 0.0.3

### Patch Changes

- [#388](https://github.com/sl-design-system/components/pull/388) [`d45dbfa`](https://github.com/sl-design-system/components/commit/d45dbfa4289439cdfba237190dbf910478f282db) - Handle null values in valueByPath

## 0.0.2

### Patch Changes

- [#381](https://github.com/sl-design-system/components/pull/381) [`bf663ee`](https://github.com/sl-design-system/components/commit/bf663eecbb5e1607562c94058002569d481298eb) - Fix types to work without "nodenext" module resolution

## 0.0.1

### Patch Changes

- [#352](https://github.com/sl-design-system/components/pull/352) [`26866e0`](https://github.com/sl-design-system/components/commit/26866e0eda550e6c17f37f0e9cb6a9d4302c06bb) - Refactor all NPM packages to `@sl-design-system/<component|theme>`
