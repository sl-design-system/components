# @sl-design-system/checkbox

## 2.1.4

### Patch Changes

- [#1975](https://github.com/sl-design-system/components/pull/1975) [`4a6f8ba`](https://github.com/sl-design-system/components/commit/4a6f8ba02f49e8be7b37028c9b6a558ad91d9664) - Fix styling regression on checkboxes without a label

- [#2036](https://github.com/sl-design-system/components/pull/2036) [`b411a41`](https://github.com/sl-design-system/components/commit/b411a415b496b0ca15677b58ca41c7d770833b6e) - Improved translations by using `id` to prevent unnecessary overwriting, which will also help with adding translations in more languages in the future.

- Updated dependencies [[`1072075`](https://github.com/sl-design-system/components/commit/1072075e3f1b5f0bf8b07dc1f89fd39b9f7103d0), [`b411a41`](https://github.com/sl-design-system/components/commit/b411a415b496b0ca15677b58ca41c7d770833b6e), [`4a6f8ba`](https://github.com/sl-design-system/components/commit/4a6f8ba02f49e8be7b37028c9b6a558ad91d9664)]:
  - @sl-design-system/shared@0.8.0
  - @sl-design-system/form@1.2.3

## 2.1.3

### Patch Changes

- Updated dependencies [[`ab33cc8`](https://github.com/sl-design-system/components/commit/ab33cc86cc01480fb20206be689f9bbdb62bf0ad)]:
  - @sl-design-system/shared@0.7.0
  - @sl-design-system/form@1.2.2

## 2.1.2

### Patch Changes

- [#1882](https://github.com/sl-design-system/components/pull/1882) [`2eb8a85`](https://github.com/sl-design-system/components/commit/2eb8a857761c43c5be1ba06c5dc4a82a0c6c7151) - Fix the issue with infinite loop when there is a null value. Prevent unnecessary updates, when the value changes in the checkbox-group.

- [#1866](https://github.com/sl-design-system/components/pull/1866) [`fe3c562`](https://github.com/sl-design-system/components/commit/fe3c562d4e18ab93e9209aaab1a604774cfba5fb) - Replace generic `unknown` type with `any` to be more forgiving

- Updated dependencies [[`fa0b85d`](https://github.com/sl-design-system/components/commit/fa0b85d46c08018cd43de432c3a9705e7aede2c8), [`0db4860`](https://github.com/sl-design-system/components/commit/0db48604f9cbae73af25a08437a806dc7566273e), [`eaca9d2`](https://github.com/sl-design-system/components/commit/eaca9d24a6086d7a60dc5efc5332f16e80485d36), [`fe3c562`](https://github.com/sl-design-system/components/commit/fe3c562d4e18ab93e9209aaab1a604774cfba5fb)]:
  - @sl-design-system/shared@0.6.0
  - @sl-design-system/form@1.2.1

## 2.1.1

### Patch Changes

- [#1846](https://github.com/sl-design-system/components/pull/1846) [`4db6380`](https://github.com/sl-design-system/components/commit/4db63809185726e6ec40b4c15a2e927a009d472f) - Accessibility improvements - fix Axe error where component has 2 labels by hiding the internal one from ARIA and instead using `aria-labelledby` on the `<input>`.

  Details about [Axe error can be found here](https://dequeuniversity.com/rules/axe/4.10/form-field-multiple-labels?application=axeAPI).

## 2.1.0

### Minor Changes

- [#1791](https://github.com/sl-design-system/components/pull/1791) [`133b883`](https://github.com/sl-design-system/components/commit/133b883234d911dabe37bd3c8acef26afea20fe9) - Replace `--sl-size-borderWidth-subtle` with `--sl-size-borderWidth-default`

- [#1713](https://github.com/sl-design-system/components/pull/1713) [`01abf58`](https://github.com/sl-design-system/components/commit/01abf5833d364a76dbdf4e0df0587d0fbec3848e) - Refactor styling to use new contextual tokens

### Patch Changes

- [#1693](https://github.com/sl-design-system/components/pull/1693) [`4e57f9c`](https://github.com/sl-design-system/components/commit/4e57f9c60835a07db45f74fde73a3bf13b6abe51) - Various fixes:

  - Fix bug where clicking a checkbox in a tree-node will not check it
  - Fix `sl-change` event firing multiple times for a single click

- [#1628](https://github.com/sl-design-system/components/pull/1628) [`7a62e08`](https://github.com/sl-design-system/components/commit/7a62e08afbcd5768277164a8075939c3d8c17667) - Fix NVDA accessibility issues, fix indeterminate state for screen readers.

- [#1683](https://github.com/sl-design-system/components/pull/1683) [`de95129`](https://github.com/sl-design-system/components/commit/de951293157d273600e9f5bd97dd25cb21ce6d69) - Fix linting error due to not explicitly stringifying nodes

- [#1816](https://github.com/sl-design-system/components/pull/1816) [`8b16a0f`](https://github.com/sl-design-system/components/commit/8b16a0fe9f7fbbbb76f92d112d94bf4c5e1d0995) - Fix the slotted label styling.

- [#1633](https://github.com/sl-design-system/components/pull/1633) [`7e8a441`](https://github.com/sl-design-system/components/commit/7e8a441b053715b896bb7ef775d4a24a93a5a9dd) - Fix NVDA accessibility issues: moving aria attributes to the right control.

- Updated dependencies [[`6309452`](https://github.com/sl-design-system/components/commit/63094521a7b262bd80c1a9a377086093d2844a8d), [`7e8a441`](https://github.com/sl-design-system/components/commit/7e8a441b053715b896bb7ef775d4a24a93a5a9dd), [`cab0938`](https://github.com/sl-design-system/components/commit/cab093898b324073801945fc3771eec2014d6652), [`133b883`](https://github.com/sl-design-system/components/commit/133b883234d911dabe37bd3c8acef26afea20fe9), [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb), [`c4a93fb`](https://github.com/sl-design-system/components/commit/c4a93fba6f40b8e843a169117dfdd331a5d9d6e6), [`c19862e`](https://github.com/sl-design-system/components/commit/c19862e56455c3d8e27a9afc33bf684f89b04b75), [`a62dee4`](https://github.com/sl-design-system/components/commit/a62dee4a381450cca44c647a54d850290e5b0f11), [`b1e3b74`](https://github.com/sl-design-system/components/commit/b1e3b741e78400e3755ddaa0c5c4fdeed2e3f960), [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb), [`4e57f9c`](https://github.com/sl-design-system/components/commit/4e57f9c60835a07db45f74fde73a3bf13b6abe51), [`01abf58`](https://github.com/sl-design-system/components/commit/01abf5833d364a76dbdf4e0df0587d0fbec3848e)]:
  - @sl-design-system/shared@0.5.0
  - @sl-design-system/form@1.2.0

## 2.0.1

### Patch Changes

- [#1599](https://github.com/sl-design-system/components/pull/1599) [`4714b36`](https://github.com/sl-design-system/components/commit/4714b36f1387d4d1731a310b621caf5a33be105b) - Set direction to vertical for keyboard navigation

- Updated dependencies [[`4714b36`](https://github.com/sl-design-system/components/commit/4714b36f1387d4d1731a310b621caf5a33be105b), [`ebe4c8a`](https://github.com/sl-design-system/components/commit/ebe4c8a32e85b753e2aa752a13b2dc23616bf1a9), [`33fd543`](https://github.com/sl-design-system/components/commit/33fd5432f1499051071662aaca9974c212304bc6), [`33fd543`](https://github.com/sl-design-system/components/commit/33fd5432f1499051071662aaca9974c212304bc6)]:
  - @sl-design-system/shared@0.4.0
  - @sl-design-system/form@1.1.0

## 2.0.0

### Major Changes

- [#1444](https://github.com/sl-design-system/components/pull/1444) [`5679f25`](https://github.com/sl-design-system/components/commit/5679f25338d5d5e356c6d5c0052bb7bf4a066f50) - Change `formValue` behavior to be boolean instead of `'on'`

  This is a breaking change. Even though `'on'` matches the HTML standard, it is not the most common use case for a checkbox. This change will make it easier to use the component in most cases.

  This also makes it possible to use a boolean when setting the value of the checkbox in a form using `FormController`.

### Patch Changes

- [#1443](https://github.com/sl-design-system/components/pull/1443) [`07b4c26`](https://github.com/sl-design-system/components/commit/07b4c2697c0a8221f808927b0c52f4a0c46567e9) - Fix bug where the `formValue` setter override was missing, causing an error

- Updated dependencies [[`c8b9c89`](https://github.com/sl-design-system/components/commit/c8b9c89a367066ab241348c9f93e6e087ec796ea), [`96c5ade`](https://github.com/sl-design-system/components/commit/96c5ade1562ca5faf936ce59f13a2fb84abeac56)]:
  - @sl-design-system/shared@0.3.0
  - @sl-design-system/form@1.0.3

## 1.0.3

### Patch Changes

- [#1421](https://github.com/sl-design-system/components/pull/1421) [`5051056`](https://github.com/sl-design-system/components/commit/5051056f67d8b25d96885d01c2fe7dde9e4c5ba4) - Fix group value not reflecting initial checked state

- Updated dependencies [[`5212fb6`](https://github.com/sl-design-system/components/commit/5212fb638d3eeb535d5988b8793db21fb4fcc220)]:
  - @sl-design-system/shared@0.2.13

## 1.0.2

### Patch Changes

- [#1369](https://github.com/sl-design-system/components/pull/1369) [`25d1de0`](https://github.com/sl-design-system/components/commit/25d1de0d8b6e032aa13463d18db201cf88d5ddd6) - Fix behavior to match native checkbox:

  - If a checkbox has no value, the form value should be `"on"` when checked
  - The value of the checkbox group should be an array of the form value of _all_ checkboxes
  - The form value will filter out any `null` values (so this change is not breaking)

  This also fixes the inability to check a checkbox in a group that has no values.

## 1.0.1

### Patch Changes

- [#1330](https://github.com/sl-design-system/components/pull/1330) [`0b955a1`](https://github.com/sl-design-system/components/commit/0b955a1f1fd23d600a39a7918ba51687762d1f85) - Fix accessibility - properly read checkbox state in Safari

- [#1322](https://github.com/sl-design-system/components/pull/1322) [`0f0e93c`](https://github.com/sl-design-system/components/commit/0f0e93c374f1706ce461217849d385649ed45a5a) - Move the `align-self: start` of checkbox and reverse switch to form-field. This
  fixes the alignment issue of checkbox and switch when not used inside a form-field.
- Updated dependencies [[`a705c3f`](https://github.com/sl-design-system/components/commit/a705c3f7034207b19a10a819bccd85a3347e0204), [`0f0e93c`](https://github.com/sl-design-system/components/commit/0f0e93c374f1706ce461217849d385649ed45a5a), [`5f4226f`](https://github.com/sl-design-system/components/commit/5f4226f0025e4839fc5c8a694c2df26bafea67c2)]:
  - @sl-design-system/shared@0.2.12
  - @sl-design-system/form@1.0.2

## 1.0.0

### Major Changes

- [#1281](https://github.com/sl-design-system/components/pull/1281) [`c4012af`](https://github.com/sl-design-system/components/commit/c4012af75faaec57e3a1dc5d7f2e8205ce1d3805) - First stable release

### Minor Changes

- [#1269](https://github.com/sl-design-system/components/pull/1269) [`405689c`](https://github.com/sl-design-system/components/commit/405689ce9230d69cb5e839ef7b4d3444c1ad4a39) - Refactor to use `<input type="checkbox">` instead of `ElementInternals` for better a11y

- [#1241](https://github.com/sl-design-system/components/pull/1241) [`6ab0c88`](https://github.com/sl-design-system/components/commit/6ab0c88a6fa49d3ea14cd42739458f98ce01e4cb) - Add pristine/dirty and untouched/touched state to form controls

### Patch Changes

- [#1258](https://github.com/sl-design-system/components/pull/1258) [`ac092e1`](https://github.com/sl-design-system/components/commit/ac092e16d29d3a0e404f2a05dbc35a7774e7fd7e) - Fix bug where setting the value would not be reflected in the checked state

- Updated dependencies [[`6ab0c88`](https://github.com/sl-design-system/components/commit/6ab0c88a6fa49d3ea14cd42739458f98ce01e4cb), [`c4012af`](https://github.com/sl-design-system/components/commit/c4012af75faaec57e3a1dc5d7f2e8205ce1d3805), [`6ab0c88`](https://github.com/sl-design-system/components/commit/6ab0c88a6fa49d3ea14cd42739458f98ce01e4cb), [`0208c28`](https://github.com/sl-design-system/components/commit/0208c282f68d9eac64a6609c5213094c8df04202), [`6ab0c88`](https://github.com/sl-design-system/components/commit/6ab0c88a6fa49d3ea14cd42739458f98ce01e4cb), [`6ab0c88`](https://github.com/sl-design-system/components/commit/6ab0c88a6fa49d3ea14cd42739458f98ce01e4cb), [`ac092e1`](https://github.com/sl-design-system/components/commit/ac092e16d29d3a0e404f2a05dbc35a7774e7fd7e)]:
  - @sl-design-system/form@1.0.0

## 0.0.29

### Patch Changes

- Updated dependencies [[`27ad98d`](https://github.com/sl-design-system/components/commit/27ad98dc8add269600afc90d59c07d768989928d), [`c3c9de6`](https://github.com/sl-design-system/components/commit/c3c9de6590f5abd1d8010186df127a665ee303b5), [`59a41aa`](https://github.com/sl-design-system/components/commit/59a41aa4b6530d5002e6e45313249e4abe7dac3b), [`27ad98d`](https://github.com/sl-design-system/components/commit/27ad98dc8add269600afc90d59c07d768989928d)]:
  - @sl-design-system/form@0.0.15
  - @sl-design-system/shared@0.2.11

## 0.0.28

### Patch Changes

- Updated dependencies [[`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537), [`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537)]:
  - @sl-design-system/shared@0.2.10
  - @sl-design-system/form@0.0.14

## 0.0.27

### Patch Changes

- Updated dependencies [[`d22722e`](https://github.com/sl-design-system/components/commit/d22722e6792c19c76d0fb6ec476fac1ff241d52b)]:
  - @sl-design-system/shared@0.2.9
  - @sl-design-system/form@0.0.13

## 0.0.26

### Patch Changes

- Updated dependencies [[`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da), [`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da)]:
  - @sl-design-system/shared@0.2.8
  - @sl-design-system/form@0.0.12

## 0.0.25

### Patch Changes

- Updated dependencies [[`38b0ca4`](https://github.com/sl-design-system/components/commit/38b0ca4d72014605418639b69410863eb8e231ad)]:
  - @sl-design-system/shared@0.2.7
  - @sl-design-system/form@0.0.11

## 0.0.24

### Patch Changes

- [#1026](https://github.com/sl-design-system/components/pull/1026) [`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b) - Linting fixes for styling

- Updated dependencies [[`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b)]:
  - @sl-design-system/form@0.0.10

## 0.0.23

### Patch Changes

- [#1018](https://github.com/sl-design-system/components/pull/1018) [`aaa09ff`](https://github.com/sl-design-system/components/commit/aaa09ffb78db9df6298ce77d51a79b7aed213e59) - Fix 3rd party dependencies to be peerDependencies instead

- [#995](https://github.com/sl-design-system/components/pull/995) [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5) - Linting fixes due to new eslint configuration

- Updated dependencies [[`aaa09ff`](https://github.com/sl-design-system/components/commit/aaa09ffb78db9df6298ce77d51a79b7aed213e59), [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5)]:
  - @sl-design-system/shared@0.2.6
  - @sl-design-system/form@0.0.9

## 0.0.22

### Patch Changes

- Updated dependencies [[`dbc032b`](https://github.com/sl-design-system/components/commit/dbc032b3a7587dfcbdb6a2118330b039765cf0fb), [`5da216b`](https://github.com/sl-design-system/components/commit/5da216b3713c328eba06113d77d642462e1f05fc)]:
  - @sl-design-system/shared@0.2.5
  - @sl-design-system/form@0.0.8

## 0.0.21

### Patch Changes

- Updated dependencies [[`216d62e`](https://github.com/sl-design-system/components/commit/216d62eb5a16277b4ea2767ea0530e570bf40abf), [`216d62e`](https://github.com/sl-design-system/components/commit/216d62eb5a16277b4ea2767ea0530e570bf40abf)]:
  - @sl-design-system/shared@0.2.4
  - @sl-design-system/form@0.0.7

## 0.0.20

### Patch Changes

- Updated dependencies [[`afc3d60`](https://github.com/sl-design-system/components/commit/afc3d606c20409b4ad2d589ffc0b899d3f853997)]:
  - @sl-design-system/shared@0.2.3
  - @sl-design-system/form@0.0.6

## 0.0.19

### Patch Changes

- [#927](https://github.com/sl-design-system/components/pull/927) [`e3c8bbb`](https://github.com/sl-design-system/components/commit/e3c8bbbd400ad07aa6ad0f984fc2b2d5e88c1e94) - Add small (`sm`) size for use in grid; this size is _not_ meant for general use

## 0.0.18

### Patch Changes

- Updated dependencies [[`06cfb6b`](https://github.com/sl-design-system/components/commit/06cfb6bff8f2c1a8d4a132099f21f2e8dc4f2461), [`9320cbc`](https://github.com/sl-design-system/components/commit/9320cbc446e479435860ad5f9756725b36acf764), [`2aff1dd`](https://github.com/sl-design-system/components/commit/2aff1dd7aa946cb2ee998d7d121ab585ca9ad39b)]:
  - @sl-design-system/shared@0.2.2
  - @sl-design-system/form@0.0.5

## 0.0.17

### Patch Changes

- Updated dependencies [[`a37667e`](https://github.com/sl-design-system/components/commit/a37667eb4478da696595fdda618b86d15262f60a), [`b8e7589`](https://github.com/sl-design-system/components/commit/b8e7589f88f447b6e1ee05bbbd0847425f1fcef2)]:
  - @sl-design-system/form@0.0.4

## 0.0.16

### Patch Changes

- [#862](https://github.com/sl-design-system/components/pull/862) [`d881d5f`](https://github.com/sl-design-system/components/commit/d881d5fc5274be5275f910f445a16408d6bb2373) - Fix all form control validations to use i18n correctly

- [#861](https://github.com/sl-design-system/components/pull/861) [`416a4bd`](https://github.com/sl-design-system/components/commit/416a4bdc49dd334d4a3c89c4697e9f69f22bf84b) - Fix builtin vs custom validation behavior

  This add a new `sl-validate` event that is fired when the validity of the form control is updated. It fires _after_ any builtin validation has been performed, so it can be used to override the validity of the control.

- [#842](https://github.com/sl-design-system/components/pull/842) [`bde9afa`](https://github.com/sl-design-system/components/commit/bde9afa06833adf91122df3960d04db6cb34d536) - Improve and unify `show-validity` behavior

- [#715](https://github.com/sl-design-system/components/pull/715) [`1b0c3e7`](https://github.com/sl-design-system/components/commit/1b0c3e7923300ea9c282398e5cc41669f441395a) - Use new `FormControlMixin` from the form package

- [#872](https://github.com/sl-design-system/components/pull/872) [`da5784c`](https://github.com/sl-design-system/components/commit/da5784ca4aec18bdd1b5326274e59e803d7859ec) - Unify form values for all controls

- Updated dependencies [[`988e936`](https://github.com/sl-design-system/components/commit/988e936fabc65fb2b6cb83f5df7b6b7035280f2f), [`d881d5f`](https://github.com/sl-design-system/components/commit/d881d5fc5274be5275f910f445a16408d6bb2373), [`416a4bd`](https://github.com/sl-design-system/components/commit/416a4bdc49dd334d4a3c89c4697e9f69f22bf84b), [`bde9afa`](https://github.com/sl-design-system/components/commit/bde9afa06833adf91122df3960d04db6cb34d536), [`b507ee0`](https://github.com/sl-design-system/components/commit/b507ee07e119733d285a348e74f34c4b2d172902), [`d881d5f`](https://github.com/sl-design-system/components/commit/d881d5fc5274be5275f910f445a16408d6bb2373), [`da5784c`](https://github.com/sl-design-system/components/commit/da5784ca4aec18bdd1b5326274e59e803d7859ec)]:
  - @sl-design-system/form@0.0.3
  - @sl-design-system/shared@0.2.1

## 0.0.15

### Patch Changes

- [#724](https://github.com/sl-design-system/components/pull/724) [`b3f9d42`](https://github.com/sl-design-system/components/commit/b3f9d42945c7b427105353ede3cf74ba3191792d) - Added avatar + added token for focus ring offset

- Updated dependencies [[`198c7c2`](https://github.com/sl-design-system/components/commit/198c7c277787d48276d402522f94f2d0d5132152), [`b3f9d42`](https://github.com/sl-design-system/components/commit/b3f9d42945c7b427105353ede3cf74ba3191792d)]:
  - @sl-design-system/shared@0.2.0

## 0.0.14

### Patch Changes

- [#688](https://github.com/sl-design-system/components/pull/688) [`a816bfe`](https://github.com/sl-design-system/components/commit/a816bfec8e3459cc3b12def88922a421345768f0) - Upgrade to Lit 3.0

- [#713](https://github.com/sl-design-system/components/pull/713) [`1be481a`](https://github.com/sl-design-system/components/commit/1be481aa6b300d50ddcf9a36b7e2d14942baaef7) - Add size property on the group component

- Updated dependencies [[`45bff4d`](https://github.com/sl-design-system/components/commit/45bff4d60a32f4d46d8c9c99200efeaa1be6a2f0), [`199a2fc`](https://github.com/sl-design-system/components/commit/199a2fc0b3f0efb54c06429fd91fa09071b337de), [`a816bfe`](https://github.com/sl-design-system/components/commit/a816bfec8e3459cc3b12def88922a421345768f0)]:
  - @sl-design-system/shared@0.1.9

## 0.0.13

### Patch Changes

- [#545](https://github.com/sl-design-system/components/pull/545) [`680e9a9`](https://github.com/sl-design-system/components/commit/680e9a97c4332a37b5949ca74eb699a3bc95f448) - changed focus indicator to outline instead of box shadow

- [#563](https://github.com/sl-design-system/components/pull/563) [`7fc4823`](https://github.com/sl-design-system/components/commit/7fc482392ab89ca8cb15f0c9254b6758f6171baa) - added tokens for size of the icon in the checkbox

- Updated dependencies [[`680e9a9`](https://github.com/sl-design-system/components/commit/680e9a97c4332a37b5949ca74eb699a3bc95f448), [`5208fa3`](https://github.com/sl-design-system/components/commit/5208fa38b4d702f9939a2b6c19065bc7a6ffa2cb)]:
  - @sl-design-system/shared@0.1.8

## 0.0.12

### Patch Changes

- Updated dependencies [[`34696fb`](https://github.com/sl-design-system/components/commit/34696fb6c288a8c6101b7a5b80cef1240229a522)]:
  - @sl-design-system/shared@0.1.7

## 0.0.11

### Patch Changes

- Updated dependencies [[`c901f6c`](https://github.com/sl-design-system/components/commit/c901f6c5409367d19f2ced63c486f820af834faf), [`2203785`](https://github.com/sl-design-system/components/commit/22037855352e444362e42ebfebf9e6d1295bada1), [`b9a0b33`](https://github.com/sl-design-system/components/commit/b9a0b338b4e4047dbd809e501c163fa97a39130e)]:
  - @sl-design-system/shared@0.1.6

## 0.0.10

### Patch Changes

- Updated dependencies [[`6f125e6`](https://github.com/sl-design-system/components/commit/6f125e6886f85fcfb8521e656f682e7385fe8aff)]:
  - @sl-design-system/shared@0.1.5

## 0.0.9

### Patch Changes

- Updated dependencies [[`46c49dd`](https://github.com/sl-design-system/components/commit/46c49dd2e281d7efbeed40c9ee1e22b44265bc1a)]:
  - @sl-design-system/shared@0.1.4

## 0.0.8

### Patch Changes

- Updated dependencies [[`13aa7e7`](https://github.com/sl-design-system/components/commit/13aa7e75e2f26262261dba498fde3412d4259939)]:
  - @sl-design-system/shared@0.1.3

## 0.0.7

### Patch Changes

- Updated dependencies [[`8a53d80`](https://github.com/sl-design-system/components/commit/8a53d800564073f7840a9f6365b234df3351c44f)]:
  - @sl-design-system/shared@0.1.2

## 0.0.6

### Patch Changes

- Updated dependencies [[`d7f7af8`](https://github.com/sl-design-system/components/commit/d7f7af8908b83a5ff5f88400d44cb578eb51e7bb), [`d7f7af8`](https://github.com/sl-design-system/components/commit/d7f7af8908b83a5ff5f88400d44cb578eb51e7bb)]:
  - @sl-design-system/shared@0.1.1

## 0.0.5

### Patch Changes

- [#450](https://github.com/sl-design-system/components/pull/450) [`0246004`](https://github.com/sl-design-system/components/commit/0246004048c9f66dd19bee69177d1cecaacd1b95) - Fix with incorrectly inherited box-shadow

- Updated dependencies [[`4c1ba25`](https://github.com/sl-design-system/components/commit/4c1ba250a5b5edc65a74c47b9fbd869324791f17)]:
  - @sl-design-system/shared@0.1.0

## 0.0.4

### Patch Changes

- [#423](https://github.com/sl-design-system/components/pull/423) [`81957ec`](https://github.com/sl-design-system/components/commit/81957ec587349c09d0a3d4e8ae41301c5730785f) - Fix transitions and other minor styling issues

- [#416](https://github.com/sl-design-system/components/pull/416) [`8bf9457`](https://github.com/sl-design-system/components/commit/8bf945764ab0fec52c87053d4758f86f4f21ae05) - Fix checkbox being too big when there is no label

## 0.0.3

### Patch Changes

- Updated dependencies [[`d45dbfa`](https://github.com/sl-design-system/components/commit/d45dbfa4289439cdfba237190dbf910478f282db)]:
  - @sl-design-system/shared@0.0.3

## 0.0.2

### Patch Changes

- [#381](https://github.com/sl-design-system/components/pull/381) [`bf663ee`](https://github.com/sl-design-system/components/commit/bf663eecbb5e1607562c94058002569d481298eb) - Fix types to work without "nodenext" module resolution

- Updated dependencies [[`bf663ee`](https://github.com/sl-design-system/components/commit/bf663eecbb5e1607562c94058002569d481298eb)]:
  - @sl-design-system/shared@0.0.2

## 0.0.1

### Patch Changes

- [#352](https://github.com/sl-design-system/components/pull/352) [`26866e0`](https://github.com/sl-design-system/components/commit/26866e0eda550e6c17f37f0e9cb6a9d4302c06bb) - Refactor all NPM packages to `@sl-design-system/<component|theme>`

- Updated dependencies [[`26866e0`](https://github.com/sl-design-system/components/commit/26866e0eda550e6c17f37f0e9cb6a9d4302c06bb)]:
  - @sl-design-system/shared@0.0.1
