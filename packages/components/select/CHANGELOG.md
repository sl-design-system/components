# @sl-design-system/select

## 2.0.5

### Patch Changes

- [#2086](https://github.com/sl-design-system/components/pull/2086) [`0b48907`](https://github.com/sl-design-system/components/commit/0b48907b54289cbfd37266d870a42baba071ba1a) - Various fixes:
  - Fix built-in validation bug when there already is a custom error
  - Fix disabled select getting keyboard focus
  - Fix missing label in `<sl-form-validation-errors>`

- [#2481](https://github.com/sl-design-system/components/pull/2481) [`0c4f19b`](https://github.com/sl-design-system/components/commit/0c4f19beb6f66b6cba944c6bc4589252113554fb) - Changed token used for the width of the focusring

- [#2547](https://github.com/sl-design-system/components/pull/2547) [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68) - Bump patch version of `@open-wc/scoped-elements` peer dependency

- [#2331](https://github.com/sl-design-system/components/pull/2331) [`17fbc40`](https://github.com/sl-design-system/components/commit/17fbc404a27bada6a5013c84c34a2936de604f16) - Fixes the issue where pressing the `Escape` key inside the select closes parent containers (such as dialogs).

- [#2561](https://github.com/sl-design-system/components/pull/2561) [`0e2e426`](https://github.com/sl-design-system/components/commit/0e2e426041997a299f3e35bcde499909d62f7ce9) - Remove duplication of `observedAttributes` from the components and into the `ObserveAttributesMixin`

- Updated dependencies [[`0b48907`](https://github.com/sl-design-system/components/commit/0b48907b54289cbfd37266d870a42baba071ba1a), [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68), [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68), [`29f38d4`](https://github.com/sl-design-system/components/commit/29f38d4a44003f63e20965ed176dfa9bc16851e7), [`0e2e426`](https://github.com/sl-design-system/components/commit/0e2e426041997a299f3e35bcde499909d62f7ce9), [`5db3329`](https://github.com/sl-design-system/components/commit/5db33293ac0ac53dcb13c607a4df76500eca7141), [`17fbc40`](https://github.com/sl-design-system/components/commit/17fbc404a27bada6a5013c84c34a2936de604f16)]:
  - @sl-design-system/form@1.3.0
  - @sl-design-system/listbox@0.1.4
  - @sl-design-system/shared@0.9.0
  - @sl-design-system/icon@1.3.0

## 2.0.4

### Patch Changes

- [#1975](https://github.com/sl-design-system/components/pull/1975) [`4a6f8ba`](https://github.com/sl-design-system/components/commit/4a6f8ba02f49e8be7b37028c9b6a558ad91d9664) - Fix the size of the clearable icon in the select button

- [#2036](https://github.com/sl-design-system/components/pull/2036) [`b411a41`](https://github.com/sl-design-system/components/commit/b411a415b496b0ca15677b58ca41c7d770833b6e) - Improved translations by using `id` to prevent unnecessary overwriting, which will also help with adding translations in more languages in the future.

- [#2037](https://github.com/sl-design-system/components/pull/2037) [`094e4c7`](https://github.com/sl-design-system/components/commit/094e4c7d9e975e7e7a2d28e80d1c6980786492da) - Added overflow-wrap to force words to break when options are shown in a very narrow container.

- Updated dependencies [[`1072075`](https://github.com/sl-design-system/components/commit/1072075e3f1b5f0bf8b07dc1f89fd39b9f7103d0), [`b411a41`](https://github.com/sl-design-system/components/commit/b411a415b496b0ca15677b58ca41c7d770833b6e), [`4a6f8ba`](https://github.com/sl-design-system/components/commit/4a6f8ba02f49e8be7b37028c9b6a558ad91d9664), [`094e4c7`](https://github.com/sl-design-system/components/commit/094e4c7d9e975e7e7a2d28e80d1c6980786492da)]:
  - @sl-design-system/shared@0.8.0
  - @sl-design-system/form@1.2.3
  - @sl-design-system/listbox@0.1.3

## 2.0.3

### Patch Changes

- Updated dependencies [[`ab33cc8`](https://github.com/sl-design-system/components/commit/ab33cc86cc01480fb20206be689f9bbdb62bf0ad)]:
  - @sl-design-system/shared@0.7.0
  - @sl-design-system/form@1.2.2

## 2.0.2

### Patch Changes

- [#1909](https://github.com/sl-design-system/components/pull/1909) [`1d5a785`](https://github.com/sl-design-system/components/commit/1d5a785b38bc6243f7ab05205669e970a1355324) - Log a warning when you use `<sl-select>` without having `<sl-option>` registered

- Updated dependencies [[`fa0b85d`](https://github.com/sl-design-system/components/commit/fa0b85d46c08018cd43de432c3a9705e7aede2c8), [`0db4860`](https://github.com/sl-design-system/components/commit/0db48604f9cbae73af25a08437a806dc7566273e), [`eaca9d2`](https://github.com/sl-design-system/components/commit/eaca9d24a6086d7a60dc5efc5332f16e80485d36), [`4b68034`](https://github.com/sl-design-system/components/commit/4b680344816bb1cefb66a6bc9fac7f9501f18ace), [`fe3c562`](https://github.com/sl-design-system/components/commit/fe3c562d4e18ab93e9209aaab1a604774cfba5fb)]:
  - @sl-design-system/shared@0.6.0
  - @sl-design-system/form@1.2.1
  - @sl-design-system/listbox@0.1.1

## 2.0.1

### Patch Changes

- [#1857](https://github.com/sl-design-system/components/pull/1857) [`0251830`](https://github.com/sl-design-system/components/commit/025183019319ffe77e665224c2e545a4a67e8c8b) - Bug fixes:
  1. Fix the `focusout` event handler too eagerly closing the dropdown
  2. Fix `<sl-option>`s that were added after the initial rendering of the component not being accessible via keyboard navigation

## 2.0.0

### Major Changes

- [#1794](https://github.com/sl-design-system/components/pull/1794) [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb) - BREAKING: Remove `<sl-select-option>` and `<sl-select-option-group>` and use `<sl-option>` and `<sl-option-group>` from the `@sl-design-system/listbox` package instead.

  This change was made to align the select component with the listbox component. The listbox component is a more flexible and powerful component that can be used to create a variety of custom select-like components.

  To update your code, replace all instances of `<sl-select-option>` with `<sl-option>` and `<sl-select-option-group>` with `<sl-option-group>`. If you used `<sl-select-option-group>`, please make sure to rename the `heading` property to `label` since that is different in `<sl-option-group>`.

  Make sure you have those custom elements loaded. If not, you can import them from the `@sl-design-system/listbox` package.

  Various improvements:
  - Add `clearable` property for clearing the selection
  - Hide the listbox popover when focus leaves the `<sl-select>` component
  - Show the listbox popover immediately; only animate it when closing
  - Focus the actual options in the listbox and don't use `aria-activedescendant`

### Minor Changes

- [#1805](https://github.com/sl-design-system/components/pull/1805) [`94e2a7b`](https://github.com/sl-design-system/components/commit/94e2a7bf1ccaaa9d547654603554cc6bdfdf66fb) - Increase the padding for `md` from `32px` to `36px` and for `lg` from `40px` to `48px`.

- [#1791](https://github.com/sl-design-system/components/pull/1791) [`133b883`](https://github.com/sl-design-system/components/commit/133b883234d911dabe37bd3c8acef26afea20fe9) - Replace `--sl-size-borderWidth-subtle` with `--sl-size-borderWidth-default`

- [#1713](https://github.com/sl-design-system/components/pull/1713) [`01abf58`](https://github.com/sl-design-system/components/commit/01abf5833d364a76dbdf4e0df0587d0fbec3848e) - Refactor styling to use new contextual tokens

### Patch Changes

- [#1711](https://github.com/sl-design-system/components/pull/1711) [`b413dae`](https://github.com/sl-design-system/components/commit/b413dae4961f8b1a4ee8e45ab9a421af455ffc51) - Fix NVDA accessibility issues (moving aria attributes to the `sl-select-button` and adding missing aria attributes).

- [#1709](https://github.com/sl-design-system/components/pull/1709) [`a62dee4`](https://github.com/sl-design-system/components/commit/a62dee4a381450cca44c647a54d850290e5b0f11) - Prepend light DOM elements to the host, instead of `append()`

  The fixes any possible issues where the element is added to the light DOM and Lit itself
  get's confused and thinks the element is rendered by Lit. This can cause Lit to later
  in the lifecycle remove the element from the light DOM, which is not what we want.

  By prepending the element to the host, we ensure that the element is not in any scope of Lit.
  This scope is visible in the DOM as HTML comments.

- [#1624](https://github.com/sl-design-system/components/pull/1624) [`cab0938`](https://github.com/sl-design-system/components/commit/cab093898b324073801945fc3771eec2014d6652) - Fix `ShadowRoot.createElement` type definition to properly match `document.createElement`

- Updated dependencies [[`6309452`](https://github.com/sl-design-system/components/commit/63094521a7b262bd80c1a9a377086093d2844a8d), [`7e8a441`](https://github.com/sl-design-system/components/commit/7e8a441b053715b896bb7ef775d4a24a93a5a9dd), [`cab0938`](https://github.com/sl-design-system/components/commit/cab093898b324073801945fc3771eec2014d6652), [`133b883`](https://github.com/sl-design-system/components/commit/133b883234d911dabe37bd3c8acef26afea20fe9), [`e68df34`](https://github.com/sl-design-system/components/commit/e68df344917a8d0bdc6a4c92f59079a247c6e7a9), [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb), [`40cc538`](https://github.com/sl-design-system/components/commit/40cc538648e6ed5ac453fbe708bae8761caaab5e), [`c4a93fb`](https://github.com/sl-design-system/components/commit/c4a93fba6f40b8e843a169117dfdd331a5d9d6e6), [`c19862e`](https://github.com/sl-design-system/components/commit/c19862e56455c3d8e27a9afc33bf684f89b04b75), [`bbcb7f7`](https://github.com/sl-design-system/components/commit/bbcb7f7cd48e22fa1e61f24ba645a4131b0c75ee), [`a62dee4`](https://github.com/sl-design-system/components/commit/a62dee4a381450cca44c647a54d850290e5b0f11), [`b1e3b74`](https://github.com/sl-design-system/components/commit/b1e3b741e78400e3755ddaa0c5c4fdeed2e3f960), [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb), [`99482e3`](https://github.com/sl-design-system/components/commit/99482e31dfee77fb99bf74a4fe325c3ccc08f6e6), [`4e57f9c`](https://github.com/sl-design-system/components/commit/4e57f9c60835a07db45f74fde73a3bf13b6abe51), [`849b154`](https://github.com/sl-design-system/components/commit/849b1544bcc7cc60de1eb37ec282f2e467efc7eb), [`01abf58`](https://github.com/sl-design-system/components/commit/01abf5833d364a76dbdf4e0df0587d0fbec3848e)]:
  - @sl-design-system/shared@0.5.0
  - @sl-design-system/form@1.2.0
  - @sl-design-system/listbox@0.1.0
  - @sl-design-system/icon@1.1.0

## 1.1.2

### Patch Changes

- Updated dependencies [[`4714b36`](https://github.com/sl-design-system/components/commit/4714b36f1387d4d1731a310b621caf5a33be105b), [`ebe4c8a`](https://github.com/sl-design-system/components/commit/ebe4c8a32e85b753e2aa752a13b2dc23616bf1a9), [`33fd543`](https://github.com/sl-design-system/components/commit/33fd5432f1499051071662aaca9974c212304bc6), [`33fd543`](https://github.com/sl-design-system/components/commit/33fd5432f1499051071662aaca9974c212304bc6)]:
  - @sl-design-system/shared@0.4.0
  - @sl-design-system/form@1.1.0

## 1.1.1

### Patch Changes

- [#1536](https://github.com/sl-design-system/components/pull/1536) [`d79c397`](https://github.com/sl-design-system/components/commit/d79c3977b15cf55c8a83db94fc4ab98a1fe7e328) - Fix combobox, radio-group and select not focusing the form control when clicking the label

- [#1492](https://github.com/sl-design-system/components/pull/1492) [`21302c2`](https://github.com/sl-design-system/components/commit/21302c28065512f1c89ffde17dbc3241a2306d5d) - Fix `.focus()` not working properly on the select component.

- Updated dependencies [[`21302c2`](https://github.com/sl-design-system/components/commit/21302c28065512f1c89ffde17dbc3241a2306d5d), [`000723a`](https://github.com/sl-design-system/components/commit/000723a8e42cb468383fa0b968eb31a672b95e80)]:
  - @sl-design-system/shared@0.3.2
  - @sl-design-system/form@1.0.4

## 1.1.0

### Minor Changes

- [#1428](https://github.com/sl-design-system/components/pull/1428) [`c8b9c89`](https://github.com/sl-design-system/components/commit/c8b9c89a367066ab241348c9f93e6e087ec796ea) - Fixed issue where popover was too small to show any content even if there was space on the other side of the anchor component.
  The way to set the min and max size of the popover have changed: use the following properties instead of setting the width directly on the popover. (Those values will be ignored when calculating the size of the popover as it can exist in the available space)
  --sl-popover-min-block-size
  --sl-popover-max-block-size
  --sl-popover-max-inline-size

### Patch Changes

- Updated dependencies [[`e3597ad`](https://github.com/sl-design-system/components/commit/e3597adca3a2b98f1507af55b7fb3748d9c29ffb), [`c8b9c89`](https://github.com/sl-design-system/components/commit/c8b9c89a367066ab241348c9f93e6e087ec796ea), [`ff1618c`](https://github.com/sl-design-system/components/commit/ff1618cdfa4d0060465d993f656345ba1044f88c), [`96c5ade`](https://github.com/sl-design-system/components/commit/96c5ade1562ca5faf936ce59f13a2fb84abeac56)]:
  - @sl-design-system/icon@1.0.2
  - @sl-design-system/shared@0.3.0
  - @sl-design-system/form@1.0.3

## 1.0.1

### Patch Changes

- [#1324](https://github.com/sl-design-system/components/pull/1324) [`a494f33`](https://github.com/sl-design-system/components/commit/a494f3300826d828bb4cfa3f39758729dd2b8704) - Dropdown disappears when select button is out of view

- Updated dependencies [[`a705c3f`](https://github.com/sl-design-system/components/commit/a705c3f7034207b19a10a819bccd85a3347e0204), [`0f0e93c`](https://github.com/sl-design-system/components/commit/0f0e93c374f1706ce461217849d385649ed45a5a), [`5f4226f`](https://github.com/sl-design-system/components/commit/5f4226f0025e4839fc5c8a694c2df26bafea67c2)]:
  - @sl-design-system/shared@0.2.12
  - @sl-design-system/form@1.0.2

## 1.0.0

### Major Changes

- [#1281](https://github.com/sl-design-system/components/pull/1281) [`c4012af`](https://github.com/sl-design-system/components/commit/c4012af75faaec57e3a1dc5d7f2e8205ce1d3805) - First stable release

### Minor Changes

- [#1241](https://github.com/sl-design-system/components/pull/1241) [`6ab0c88`](https://github.com/sl-design-system/components/commit/6ab0c88a6fa49d3ea14cd42739458f98ce01e4cb) - Add pristine/dirty and untouched/touched state to form controls

### Patch Changes

- [#1258](https://github.com/sl-design-system/components/pull/1258) [`ac092e1`](https://github.com/sl-design-system/components/commit/ac092e16d29d3a0e404f2a05dbc35a7774e7fd7e) - Fix bug where the validity would not reflect the selected state

- Updated dependencies [[`6ab0c88`](https://github.com/sl-design-system/components/commit/6ab0c88a6fa49d3ea14cd42739458f98ce01e4cb), [`c4012af`](https://github.com/sl-design-system/components/commit/c4012af75faaec57e3a1dc5d7f2e8205ce1d3805), [`6ab0c88`](https://github.com/sl-design-system/components/commit/6ab0c88a6fa49d3ea14cd42739458f98ce01e4cb), [`c4012af`](https://github.com/sl-design-system/components/commit/c4012af75faaec57e3a1dc5d7f2e8205ce1d3805), [`0208c28`](https://github.com/sl-design-system/components/commit/0208c282f68d9eac64a6609c5213094c8df04202), [`6ab0c88`](https://github.com/sl-design-system/components/commit/6ab0c88a6fa49d3ea14cd42739458f98ce01e4cb), [`6ab0c88`](https://github.com/sl-design-system/components/commit/6ab0c88a6fa49d3ea14cd42739458f98ce01e4cb), [`ac092e1`](https://github.com/sl-design-system/components/commit/ac092e16d29d3a0e404f2a05dbc35a7774e7fd7e)]:
  - @sl-design-system/form@1.0.0
  - @sl-design-system/icon@1.0.0

## 0.0.28

### Patch Changes

- [#1219](https://github.com/sl-design-system/components/pull/1219) [`1a25611`](https://github.com/sl-design-system/components/commit/1a25611d2727aefb2d3535c303714cff49def731) - Added wordbreak to options so they don't grow outside the sl-select-option box

- Updated dependencies [[`27ad98d`](https://github.com/sl-design-system/components/commit/27ad98dc8add269600afc90d59c07d768989928d), [`c3c9de6`](https://github.com/sl-design-system/components/commit/c3c9de6590f5abd1d8010186df127a665ee303b5), [`59a41aa`](https://github.com/sl-design-system/components/commit/59a41aa4b6530d5002e6e45313249e4abe7dac3b), [`27ad98d`](https://github.com/sl-design-system/components/commit/27ad98dc8add269600afc90d59c07d768989928d)]:
  - @sl-design-system/form@0.0.15
  - @sl-design-system/shared@0.2.11

## 0.0.27

### Patch Changes

- Updated dependencies [[`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537), [`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537), [`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537)]:
  - @sl-design-system/shared@0.2.10
  - @sl-design-system/icon@0.0.10
  - @sl-design-system/form@0.0.14

## 0.0.26

### Patch Changes

- [#1109](https://github.com/sl-design-system/components/pull/1109) [`f71aaee`](https://github.com/sl-design-system/components/commit/f71aaee7c5b18cc35c2729daad9308988329c1cd) - Fix missing border-radius on dropdown

- Updated dependencies [[`d22722e`](https://github.com/sl-design-system/components/commit/d22722e6792c19c76d0fb6ec476fac1ff241d52b)]:
  - @sl-design-system/shared@0.2.9
  - @sl-design-system/form@0.0.13

## 0.0.25

### Patch Changes

- Updated dependencies [[`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da), [`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da)]:
  - @sl-design-system/shared@0.2.8
  - @sl-design-system/form@0.0.12

## 0.0.24

### Patch Changes

- [#1076](https://github.com/sl-design-system/components/pull/1076) [`1958093`](https://github.com/sl-design-system/components/commit/19580930a666b18051aa0c64dafc7d9c0fdffaf4) - Fix incorrect color when selected & disabled

- Updated dependencies [[`38b0ca4`](https://github.com/sl-design-system/components/commit/38b0ca4d72014605418639b69410863eb8e231ad)]:
  - @sl-design-system/shared@0.2.7
  - @sl-design-system/form@0.0.11

## 0.0.23

### Patch Changes

- [#1026](https://github.com/sl-design-system/components/pull/1026) [`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b) - Linting fixes for styling

- Updated dependencies [[`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b), [`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b)]:
  - @sl-design-system/form@0.0.10
  - @sl-design-system/icon@0.0.9

## 0.0.22

### Patch Changes

- [#1018](https://github.com/sl-design-system/components/pull/1018) [`aaa09ff`](https://github.com/sl-design-system/components/commit/aaa09ffb78db9df6298ce77d51a79b7aed213e59) - Fix 3rd party dependencies to be peerDependencies instead

- [#995](https://github.com/sl-design-system/components/pull/995) [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5) - Linting fixes due to new eslint configuration

- Updated dependencies [[`aaa09ff`](https://github.com/sl-design-system/components/commit/aaa09ffb78db9df6298ce77d51a79b7aed213e59), [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5)]:
  - @sl-design-system/shared@0.2.6
  - @sl-design-system/form@0.0.9
  - @sl-design-system/icon@0.0.8

## 0.0.21

### Patch Changes

- Updated dependencies [[`dbc032b`](https://github.com/sl-design-system/components/commit/dbc032b3a7587dfcbdb6a2118330b039765cf0fb), [`5da216b`](https://github.com/sl-design-system/components/commit/5da216b3713c328eba06113d77d642462e1f05fc)]:
  - @sl-design-system/shared@0.2.5
  - @sl-design-system/form@0.0.8

## 0.0.20

### Patch Changes

- [#974](https://github.com/sl-design-system/components/pull/974) [`216d62e`](https://github.com/sl-design-system/components/commit/216d62eb5a16277b4ea2767ea0530e570bf40abf) - Make popover offset and viewportMargin themable

- Updated dependencies [[`216d62e`](https://github.com/sl-design-system/components/commit/216d62eb5a16277b4ea2767ea0530e570bf40abf), [`216d62e`](https://github.com/sl-design-system/components/commit/216d62eb5a16277b4ea2767ea0530e570bf40abf)]:
  - @sl-design-system/shared@0.2.4
  - @sl-design-system/form@0.0.7

## 0.0.19

### Patch Changes

- Updated dependencies [[`afc3d60`](https://github.com/sl-design-system/components/commit/afc3d606c20409b4ad2d589ffc0b899d3f853997)]:
  - @sl-design-system/shared@0.2.3
  - @sl-design-system/form@0.0.6

## 0.0.18

### Patch Changes

- [#927](https://github.com/sl-design-system/components/pull/927) [`e3c8bbb`](https://github.com/sl-design-system/components/commit/e3c8bbbd400ad07aa6ad0f984fc2b2d5e88c1e94) - Use `--sl-border-width-input-border` instead of the button border width

- [#927](https://github.com/sl-design-system/components/pull/927) [`e3c8bbb`](https://github.com/sl-design-system/components/commit/e3c8bbbd400ad07aa6ad0f984fc2b2d5e88c1e94) - Fix lack of contrast by using new tokens for the listbox

## 0.0.17

### Patch Changes

- [#925](https://github.com/sl-design-system/components/pull/925) [`2aff1dd`](https://github.com/sl-design-system/components/commit/2aff1dd7aa946cb2ee998d7d121ab585ca9ad39b) - Bump Lit and related dependencies

- Updated dependencies [[`06cfb6b`](https://github.com/sl-design-system/components/commit/06cfb6bff8f2c1a8d4a132099f21f2e8dc4f2461), [`9320cbc`](https://github.com/sl-design-system/components/commit/9320cbc446e479435860ad5f9756725b36acf764), [`2aff1dd`](https://github.com/sl-design-system/components/commit/2aff1dd7aa946cb2ee998d7d121ab585ca9ad39b)]:
  - @sl-design-system/shared@0.2.2
  - @sl-design-system/form@0.0.5
  - @sl-design-system/icon@0.0.7

## 0.0.16

### Patch Changes

- Updated dependencies [[`a37667e`](https://github.com/sl-design-system/components/commit/a37667eb4478da696595fdda618b86d15262f60a), [`b8e7589`](https://github.com/sl-design-system/components/commit/b8e7589f88f447b6e1ee05bbbd0847425f1fcef2)]:
  - @sl-design-system/form@0.0.4

## 0.0.15

### Patch Changes

- [#862](https://github.com/sl-design-system/components/pull/862) [`d881d5f`](https://github.com/sl-design-system/components/commit/d881d5fc5274be5275f910f445a16408d6bb2373) - Fix all form control validations to use i18n correctly

- [#861](https://github.com/sl-design-system/components/pull/861) [`416a4bd`](https://github.com/sl-design-system/components/commit/416a4bdc49dd334d4a3c89c4697e9f69f22bf84b) - Fix builtin vs custom validation behavior

  This add a new `sl-validate` event that is fired when the validity of the form control is updated. It fires _after_ any builtin validation has been performed, so it can be used to override the validity of the control.

- [#828](https://github.com/sl-design-system/components/pull/828) [`974e2a3`](https://github.com/sl-design-system/components/commit/974e2a305431be631be3b72a685dcf72199ea031) - Refactor `<sl-select>` to
  - use new `FormControlMixin` from the form package
  - use `aria-activedescendant` to indicate the currently focused option

- [#842](https://github.com/sl-design-system/components/pull/842) [`bde9afa`](https://github.com/sl-design-system/components/commit/bde9afa06833adf91122df3960d04db6cb34d536) - Improve and unify `show-validity` behavior

- [#872](https://github.com/sl-design-system/components/pull/872) [`da5784c`](https://github.com/sl-design-system/components/commit/da5784ca4aec18bdd1b5326274e59e803d7859ec) - Unify form values for all controls

- Updated dependencies [[`988e936`](https://github.com/sl-design-system/components/commit/988e936fabc65fb2b6cb83f5df7b6b7035280f2f), [`a05db1d`](https://github.com/sl-design-system/components/commit/a05db1dcc19153ce0c843782c6d5aff46a992acf), [`bbf18f7`](https://github.com/sl-design-system/components/commit/bbf18f7453debffe8f3bebf096a0552b8df60500), [`d881d5f`](https://github.com/sl-design-system/components/commit/d881d5fc5274be5275f910f445a16408d6bb2373), [`416a4bd`](https://github.com/sl-design-system/components/commit/416a4bdc49dd334d4a3c89c4697e9f69f22bf84b), [`bde9afa`](https://github.com/sl-design-system/components/commit/bde9afa06833adf91122df3960d04db6cb34d536), [`0b41208`](https://github.com/sl-design-system/components/commit/0b41208f390b27e3738e0d81258abeaa18e19a0f), [`b507ee0`](https://github.com/sl-design-system/components/commit/b507ee07e119733d285a348e74f34c4b2d172902), [`d881d5f`](https://github.com/sl-design-system/components/commit/d881d5fc5274be5275f910f445a16408d6bb2373), [`da5784c`](https://github.com/sl-design-system/components/commit/da5784ca4aec18bdd1b5326274e59e803d7859ec)]:
  - @sl-design-system/form@0.0.3
  - @sl-design-system/icon@0.0.6
  - @sl-design-system/shared@0.2.1

## 0.0.14

### Patch Changes

- [#724](https://github.com/sl-design-system/components/pull/724) [`b3f9d42`](https://github.com/sl-design-system/components/commit/b3f9d42945c7b427105353ede3cf74ba3191792d) - Added avatar + added token for focus ring offset

- Updated dependencies [[`198c7c2`](https://github.com/sl-design-system/components/commit/198c7c277787d48276d402522f94f2d0d5132152), [`b3f9d42`](https://github.com/sl-design-system/components/commit/b3f9d42945c7b427105353ede3cf74ba3191792d)]:
  - @sl-design-system/popover@0.1.0
  - @sl-design-system/shared@0.2.0

## 0.0.13

### Patch Changes

- [#688](https://github.com/sl-design-system/components/pull/688) [`a816bfe`](https://github.com/sl-design-system/components/commit/a816bfec8e3459cc3b12def88922a421345768f0) - Upgrade to Lit 3.0

- Updated dependencies [[`45bff4d`](https://github.com/sl-design-system/components/commit/45bff4d60a32f4d46d8c9c99200efeaa1be6a2f0), [`199a2fc`](https://github.com/sl-design-system/components/commit/199a2fc0b3f0efb54c06429fd91fa09071b337de), [`a816bfe`](https://github.com/sl-design-system/components/commit/a816bfec8e3459cc3b12def88922a421345768f0)]:
  - @sl-design-system/shared@0.1.9
  - @sl-design-system/popover@0.0.13

## 0.0.12

### Patch Changes

- [#545](https://github.com/sl-design-system/components/pull/545) [`680e9a9`](https://github.com/sl-design-system/components/commit/680e9a97c4332a37b5949ca74eb699a3bc95f448) - changed focus indicator to outline instead of box shadow

- [#642](https://github.com/sl-design-system/components/pull/642) [`5208fa3`](https://github.com/sl-design-system/components/commit/5208fa38b4d702f9939a2b6c19065bc7a6ffa2cb) - Added tooltip component + some cleanup in related components

- Updated dependencies [[`680e9a9`](https://github.com/sl-design-system/components/commit/680e9a97c4332a37b5949ca74eb699a3bc95f448), [`5208fa3`](https://github.com/sl-design-system/components/commit/5208fa38b4d702f9939a2b6c19065bc7a6ffa2cb)]:
  - @sl-design-system/shared@0.1.8
  - @sl-design-system/popover@0.0.12

## 0.0.11

### Patch Changes

- Updated dependencies [[`34696fb`](https://github.com/sl-design-system/components/commit/34696fb6c288a8c6101b7a5b80cef1240229a522)]:
  - @sl-design-system/shared@0.1.7
  - @sl-design-system/popover@0.0.11

## 0.0.10

### Patch Changes

- [#499](https://github.com/sl-design-system/components/pull/499) [`2203785`](https://github.com/sl-design-system/components/commit/22037855352e444362e42ebfebf9e6d1295bada1) - added select component

- Updated dependencies [[`c901f6c`](https://github.com/sl-design-system/components/commit/c901f6c5409367d19f2ced63c486f820af834faf), [`2203785`](https://github.com/sl-design-system/components/commit/22037855352e444362e42ebfebf9e6d1295bada1), [`b9a0b33`](https://github.com/sl-design-system/components/commit/b9a0b338b4e4047dbd809e501c163fa97a39130e)]:
  - @sl-design-system/shared@0.1.6
  - @sl-design-system/popover@0.0.10

## 0.0.9

### Patch Changes

- Updated dependencies [[`6f125e6`](https://github.com/sl-design-system/components/commit/6f125e6886f85fcfb8521e656f682e7385fe8aff)]:
  - @sl-design-system/shared@0.1.5
  - @sl-design-system/popover@0.0.9

## 0.0.8

### Patch Changes

- Updated dependencies [[`46c49dd`](https://github.com/sl-design-system/components/commit/46c49dd2e281d7efbeed40c9ee1e22b44265bc1a)]:
  - @sl-design-system/shared@0.1.4
  - @sl-design-system/popover@0.0.8

## 0.0.7

### Patch Changes

- Updated dependencies [[`13aa7e7`](https://github.com/sl-design-system/components/commit/13aa7e75e2f26262261dba498fde3412d4259939)]:
  - @sl-design-system/shared@0.1.3
  - @sl-design-system/popover@0.0.7

## 0.0.6

### Patch Changes

- Updated dependencies [[`8a53d80`](https://github.com/sl-design-system/components/commit/8a53d800564073f7840a9f6365b234df3351c44f)]:
  - @sl-design-system/shared@0.1.2
  - @sl-design-system/popover@0.0.6

## 0.0.5

### Patch Changes

- [#491](https://github.com/sl-design-system/components/pull/491) [`d7f7af8`](https://github.com/sl-design-system/components/commit/d7f7af8908b83a5ff5f88400d44cb578eb51e7bb) - Update popover implementation to match with the latest web standards

- Updated dependencies [[`d7f7af8`](https://github.com/sl-design-system/components/commit/d7f7af8908b83a5ff5f88400d44cb578eb51e7bb), [`d7f7af8`](https://github.com/sl-design-system/components/commit/d7f7af8908b83a5ff5f88400d44cb578eb51e7bb), [`d7f7af8`](https://github.com/sl-design-system/components/commit/d7f7af8908b83a5ff5f88400d44cb578eb51e7bb)]:
  - @sl-design-system/shared@0.1.1
  - @sl-design-system/popover@0.0.5

## 0.0.4

### Patch Changes

- Updated dependencies [[`0246004`](https://github.com/sl-design-system/components/commit/0246004048c9f66dd19bee69177d1cecaacd1b95), [`4c1ba25`](https://github.com/sl-design-system/components/commit/4c1ba250a5b5edc65a74c47b9fbd869324791f17), [`ab3fcd5`](https://github.com/sl-design-system/components/commit/ab3fcd59c0a69a47838b857749df7b80b9f0f99c)]:
  - @sl-design-system/popover@0.0.4
  - @sl-design-system/shared@0.1.0

## 0.0.3

### Patch Changes

- Updated dependencies [[`d45dbfa`](https://github.com/sl-design-system/components/commit/d45dbfa4289439cdfba237190dbf910478f282db)]:
  - @sl-design-system/shared@0.0.3
  - @sl-design-system/popover@0.0.3

## 0.0.2

### Patch Changes

- [#381](https://github.com/sl-design-system/components/pull/381) [`bf663ee`](https://github.com/sl-design-system/components/commit/bf663eecbb5e1607562c94058002569d481298eb) - Fix types to work without "nodenext" module resolution

- Updated dependencies [[`bf663ee`](https://github.com/sl-design-system/components/commit/bf663eecbb5e1607562c94058002569d481298eb)]:
  - @sl-design-system/popover@0.0.2
  - @sl-design-system/shared@0.0.2

## 0.0.1

### Patch Changes

- [#352](https://github.com/sl-design-system/components/pull/352) [`26866e0`](https://github.com/sl-design-system/components/commit/26866e0eda550e6c17f37f0e9cb6a9d4302c06bb) - Refactor all NPM packages to `@sl-design-system/<component|theme>`

- Updated dependencies [[`26866e0`](https://github.com/sl-design-system/components/commit/26866e0eda550e6c17f37f0e9cb6a9d4302c06bb)]:
  - @sl-design-system/popover@0.0.1
  - @sl-design-system/shared@0.0.1
