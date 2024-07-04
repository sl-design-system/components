# @sl-design-system/grid

## 0.1.12

### Patch Changes

- Updated dependencies [[`6ab0c88`](https://github.com/sl-design-system/components/commit/6ab0c88a6fa49d3ea14cd42739458f98ce01e4cb), [`ac092e1`](https://github.com/sl-design-system/components/commit/ac092e16d29d3a0e404f2a05dbc35a7774e7fd7e), [`c4012af`](https://github.com/sl-design-system/components/commit/c4012af75faaec57e3a1dc5d7f2e8205ce1d3805), [`c4012af`](https://github.com/sl-design-system/components/commit/c4012af75faaec57e3a1dc5d7f2e8205ce1d3805), [`c4012af`](https://github.com/sl-design-system/components/commit/c4012af75faaec57e3a1dc5d7f2e8205ce1d3805), [`a3da76c`](https://github.com/sl-design-system/components/commit/a3da76c7df521c2241b565dc22025715f1231e9c), [`405689c`](https://github.com/sl-design-system/components/commit/405689ce9230d69cb5e839ef7b4d3444c1ad4a39), [`6ab0c88`](https://github.com/sl-design-system/components/commit/6ab0c88a6fa49d3ea14cd42739458f98ce01e4cb), [`ac092e1`](https://github.com/sl-design-system/components/commit/ac092e16d29d3a0e404f2a05dbc35a7774e7fd7e)]:
  - @sl-design-system/text-field@1.0.0
  - @sl-design-system/checkbox@1.0.0
  - @sl-design-system/select@1.0.0
  - @sl-design-system/icon@1.0.0
  - @sl-design-system/popover@1.0.0

## 0.1.11

### Patch Changes

- Updated dependencies [[`27ad98d`](https://github.com/sl-design-system/components/commit/27ad98dc8add269600afc90d59c07d768989928d), [`59a41aa`](https://github.com/sl-design-system/components/commit/59a41aa4b6530d5002e6e45313249e4abe7dac3b), [`1a25611`](https://github.com/sl-design-system/components/commit/1a25611d2727aefb2d3535c303714cff49def731)]:
  - @sl-design-system/text-field@0.1.25
  - @sl-design-system/popover@0.1.12
  - @sl-design-system/shared@0.2.11
  - @sl-design-system/select@0.0.28
  - @sl-design-system/checkbox@0.0.29

## 0.1.10

### Patch Changes

- Updated dependencies [[`244d50f`](https://github.com/sl-design-system/components/commit/244d50f46ee4c87aab26e167c8ca5b200c1d30c2)]:
  - @sl-design-system/text-field@0.1.24

## 0.1.9

### Patch Changes

- [#1116](https://github.com/sl-design-system/components/pull/1116) [`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537) - Various improvements and bug fixes:
  - Add missing select dependency
  - Fix issue with filter column not working with zero `0`
  - Fix drag & drop in combination with grouping
  - Add more stories with groupby combinations
  - Add hack to remove the "extra padding" at bottom of the body when using groups
  - Remove custom icons that are already part of the theme
  - Fix rendering of selection header when first column is a drag handle
  - Add ability to slot custom content in the group header (with example story)
  - Fix filter & sorter `change-in-update` Lit warning
  - Fix broken filter due to event naming regression
  - Refactor `groupBy` functionality to a single API in dataSource; previously you could also set group by using the `items-group-by` attribute/property, leading to unnecessary complexity
- Updated dependencies [[`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537), [`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537), [`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537)]:
  - @sl-design-system/shared@0.2.10
  - @sl-design-system/icon@0.0.10
  - @sl-design-system/checkbox@0.0.28
  - @sl-design-system/popover@0.1.11
  - @sl-design-system/select@0.0.27
  - @sl-design-system/text-field@0.1.23

## 0.1.8

### Patch Changes

- [#1110](https://github.com/sl-design-system/components/pull/1110) [`d22722e`](https://github.com/sl-design-system/components/commit/d22722e6792c19c76d0fb6ec476fac1ff241d52b) - Fix filter being reset after selection

- Updated dependencies [[`d22722e`](https://github.com/sl-design-system/components/commit/d22722e6792c19c76d0fb6ec476fac1ff241d52b)]:
  - @sl-design-system/shared@0.2.9
  - @sl-design-system/checkbox@0.0.27
  - @sl-design-system/popover@0.1.10
  - @sl-design-system/text-field@0.1.22

## 0.1.7

### Patch Changes

- [#1084](https://github.com/sl-design-system/components/pull/1084) [`a323fde`](https://github.com/sl-design-system/components/commit/a323fdea3595304caac520fa05c111d015f7d5fd) - Fix incorrect filter event names

## 0.1.6

### Patch Changes

- [#1081](https://github.com/sl-design-system/components/pull/1081) [`8da4a25`](https://github.com/sl-design-system/components/commit/8da4a251ccc588987850738e52c5b94ddd554a51) - Revert breaking event naming changes from #1061

- Updated dependencies [[`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da), [`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da), [`0d641dc`](https://github.com/sl-design-system/components/commit/0d641dcaa3a288111c3c6bf4862d3f6bed5a2cc3)]:
  - @sl-design-system/shared@0.2.8
  - @sl-design-system/popover@0.1.9
  - @sl-design-system/checkbox@0.0.26
  - @sl-design-system/text-field@0.1.21

## 0.1.5

### Patch Changes

- Updated dependencies [[`38b0ca4`](https://github.com/sl-design-system/components/commit/38b0ca4d72014605418639b69410863eb8e231ad)]:
  - @sl-design-system/shared@0.2.7
  - @sl-design-system/checkbox@0.0.25
  - @sl-design-system/popover@0.1.8
  - @sl-design-system/text-field@0.1.20

## 0.1.4

### Patch Changes

- [#1056](https://github.com/sl-design-system/components/pull/1056) [`51a32d1`](https://github.com/sl-design-system/components/commit/51a32d1331298cf1bc6c0a2311ec6204606d1126) - Fixed checkbox checked value;
  When a grid includes both a selection column and a filter column, a potential issue may arise. If you select a filter and then proceed to check a checkbox in the selection column, subsequently deselecting it, the checked status of the filtered item might not be visible. However, the filtering functionality remains intact.

  Fixed it by changing ?checked to .checked since it should have the same effect, as both the property and attribute control whether the checkbox is checked or not.

## 0.1.3

### Patch Changes

- [#1026](https://github.com/sl-design-system/components/pull/1026) [`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b) - Linting fixes for styling

- [#1027](https://github.com/sl-design-system/components/pull/1027) [`3be7a02`](https://github.com/sl-design-system/components/commit/3be7a02b4bc5218e5dd8f6e3405e6573cbd65c5f) - Cleaner workaround for grid scrolling bug

- Updated dependencies [[`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b), [`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b)]:
  - @sl-design-system/text-field@0.1.19
  - @sl-design-system/checkbox@0.0.24
  - @sl-design-system/popover@0.1.7
  - @sl-design-system/icon@0.0.9

## 0.1.2

### Patch Changes

- [#1018](https://github.com/sl-design-system/components/pull/1018) [`aaa09ff`](https://github.com/sl-design-system/components/commit/aaa09ffb78db9df6298ce77d51a79b7aed213e59) - Fix 3rd party dependencies to be peerDependencies instead

- [#995](https://github.com/sl-design-system/components/pull/995) [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5) - Linting fixes due to new eslint configuration

- Updated dependencies [[`aaa09ff`](https://github.com/sl-design-system/components/commit/aaa09ffb78db9df6298ce77d51a79b7aed213e59), [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5)]:
  - @sl-design-system/text-field@0.1.18
  - @sl-design-system/checkbox@0.0.23
  - @sl-design-system/shared@0.2.6
  - @sl-design-system/icon@0.0.8
  - @sl-design-system/popover@0.1.6

## 0.1.1

### Patch Changes

- Updated dependencies [[`dbc032b`](https://github.com/sl-design-system/components/commit/dbc032b3a7587dfcbdb6a2118330b039765cf0fb), [`5da216b`](https://github.com/sl-design-system/components/commit/5da216b3713c328eba06113d77d642462e1f05fc)]:
  - @sl-design-system/shared@0.2.5
  - @sl-design-system/popover@0.1.5
  - @sl-design-system/checkbox@0.0.22
  - @sl-design-system/text-field@0.1.17

## 0.1.0

### Minor Changes

- [#987](https://github.com/sl-design-system/components/pull/987) [`8ce8ec6`](https://github.com/sl-design-system/components/commit/8ce8ec64aafbc94916adfe7b7c25968a1b0975db) - Fix grid selection with DataSource

### Patch Changes

- Updated dependencies [[`216d62e`](https://github.com/sl-design-system/components/commit/216d62eb5a16277b4ea2767ea0530e570bf40abf), [`216d62e`](https://github.com/sl-design-system/components/commit/216d62eb5a16277b4ea2767ea0530e570bf40abf)]:
  - @sl-design-system/popover@0.1.4
  - @sl-design-system/shared@0.2.4
  - @sl-design-system/checkbox@0.0.21
  - @sl-design-system/text-field@0.1.16

## 0.0.36

### Patch Changes

- [#939](https://github.com/sl-design-system/components/pull/939) [`afc3d60`](https://github.com/sl-design-system/components/commit/afc3d606c20409b4ad2d589ffc0b899d3f853997) - Add support for grouping rows by an item property

- Updated dependencies [[`afc3d60`](https://github.com/sl-design-system/components/commit/afc3d606c20409b4ad2d589ffc0b899d3f853997)]:
  - @sl-design-system/shared@0.2.3
  - @sl-design-system/checkbox@0.0.20
  - @sl-design-system/popover@0.1.3
  - @sl-design-system/text-field@0.1.15

## 0.0.35

### Patch Changes

- Updated dependencies [[`e3c8bbb`](https://github.com/sl-design-system/components/commit/e3c8bbbd400ad07aa6ad0f984fc2b2d5e88c1e94), [`e3c8bbb`](https://github.com/sl-design-system/components/commit/e3c8bbbd400ad07aa6ad0f984fc2b2d5e88c1e94)]:
  - @sl-design-system/text-field@0.1.14
  - @sl-design-system/checkbox@0.0.19

## 0.0.34

### Patch Changes

- [#917](https://github.com/sl-design-system/components/pull/917) [`06cfb6b`](https://github.com/sl-design-system/components/commit/06cfb6bff8f2c1a8d4a132099f21f2e8dc4f2461) - Add select & text-field columns to grid

- [#903](https://github.com/sl-design-system/components/pull/903) [`9320cbc`](https://github.com/sl-design-system/components/commit/9320cbc446e479435860ad5f9756725b36acf764) - Add ability to drag and drop rows.

- [#925](https://github.com/sl-design-system/components/pull/925) [`2aff1dd`](https://github.com/sl-design-system/components/commit/2aff1dd7aa946cb2ee998d7d121ab585ca9ad39b) - Bump Lit and related dependencies

- Updated dependencies [[`06cfb6b`](https://github.com/sl-design-system/components/commit/06cfb6bff8f2c1a8d4a132099f21f2e8dc4f2461), [`9320cbc`](https://github.com/sl-design-system/components/commit/9320cbc446e479435860ad5f9756725b36acf764), [`2aff1dd`](https://github.com/sl-design-system/components/commit/2aff1dd7aa946cb2ee998d7d121ab585ca9ad39b)]:
  - @sl-design-system/shared@0.2.2
  - @sl-design-system/text-field@0.1.13
  - @sl-design-system/icon@0.0.7
  - @sl-design-system/checkbox@0.0.18
  - @sl-design-system/popover@0.1.2

## 0.0.33

### Patch Changes

- [#895](https://github.com/sl-design-system/components/pull/895) [`4b8e714`](https://github.com/sl-design-system/components/commit/4b8e714a7bdbc16c5066a8ef7a14528e7922ad4a) - Added vertical alignment for checkbox in header and rows of selection-column

- [#897](https://github.com/sl-design-system/components/pull/897) [`1623a24`](https://github.com/sl-design-system/components/commit/1623a247db8a6f5dd60b0c495061ed95c0e5b8f3) - Fix checked state not applying to selection column

- Updated dependencies []:
  - @sl-design-system/checkbox@0.0.17
  - @sl-design-system/text-field@0.1.12

## 0.0.32

### Patch Changes

- Updated dependencies [[`a05db1d`](https://github.com/sl-design-system/components/commit/a05db1dcc19153ce0c843782c6d5aff46a992acf), [`bbf18f7`](https://github.com/sl-design-system/components/commit/bbf18f7453debffe8f3bebf096a0552b8df60500), [`d881d5f`](https://github.com/sl-design-system/components/commit/d881d5fc5274be5275f910f445a16408d6bb2373), [`416a4bd`](https://github.com/sl-design-system/components/commit/416a4bdc49dd334d4a3c89c4697e9f69f22bf84b), [`85f57c8`](https://github.com/sl-design-system/components/commit/85f57c8ae5922a24edf1b6bdaef2554e5a057ed3), [`da5784c`](https://github.com/sl-design-system/components/commit/da5784ca4aec18bdd1b5326274e59e803d7859ec), [`bde9afa`](https://github.com/sl-design-system/components/commit/bde9afa06833adf91122df3960d04db6cb34d536), [`1b0c3e7`](https://github.com/sl-design-system/components/commit/1b0c3e7923300ea9c282398e5cc41669f441395a), [`0b41208`](https://github.com/sl-design-system/components/commit/0b41208f390b27e3738e0d81258abeaa18e19a0f), [`b507ee0`](https://github.com/sl-design-system/components/commit/b507ee07e119733d285a348e74f34c4b2d172902), [`d881d5f`](https://github.com/sl-design-system/components/commit/d881d5fc5274be5275f910f445a16408d6bb2373), [`c358c27`](https://github.com/sl-design-system/components/commit/c358c279fe022cc3935284e2dc7add6a57eda7c2), [`da5784c`](https://github.com/sl-design-system/components/commit/da5784ca4aec18bdd1b5326274e59e803d7859ec)]:
  - @sl-design-system/icon@0.0.6
  - @sl-design-system/text-field@0.1.11
  - @sl-design-system/checkbox@0.0.16
  - @sl-design-system/shared@0.2.1
  - @sl-design-system/popover@0.1.1

## 0.0.31

### Patch Changes

- [#790](https://github.com/sl-design-system/components/pull/790) [`9b8e371`](https://github.com/sl-design-system/components/commit/9b8e371932fbe979f3250e07c605ad39239d4f82) - Upgrade to latest `@open-wc/scoped-elements` to track the standards spec

- Updated dependencies [[`4ca7b20`](https://github.com/sl-design-system/components/commit/4ca7b20ee7d09ee2ccfcf2743fd48f00a8207e39), [`198c7c2`](https://github.com/sl-design-system/components/commit/198c7c277787d48276d402522f94f2d0d5132152), [`4ca7b20`](https://github.com/sl-design-system/components/commit/4ca7b20ee7d09ee2ccfcf2743fd48f00a8207e39), [`9b8e371`](https://github.com/sl-design-system/components/commit/9b8e371932fbe979f3250e07c605ad39239d4f82), [`9b8e371`](https://github.com/sl-design-system/components/commit/9b8e371932fbe979f3250e07c605ad39239d4f82), [`b3f9d42`](https://github.com/sl-design-system/components/commit/b3f9d42945c7b427105353ede3cf74ba3191792d)]:
  - @sl-design-system/icon@0.0.5
  - @sl-design-system/popover@0.1.0
  - @sl-design-system/shared@0.2.0
  - @sl-design-system/text-field@0.1.10
  - @sl-design-system/checkbox@0.0.15

## 0.0.30

### Patch Changes

- [#688](https://github.com/sl-design-system/components/pull/688) [`a816bfe`](https://github.com/sl-design-system/components/commit/a816bfec8e3459cc3b12def88922a421345768f0) - Upgrade to Lit 3.0

- [#736](https://github.com/sl-design-system/components/pull/736) [`83d016c`](https://github.com/sl-design-system/components/commit/83d016c5dee5918046aff29519b9356da51f8abc) - Add workaround for virtualizer scrolling bug https://github.com/lit/lit/issues/4232

- Updated dependencies [[`5883fee`](https://github.com/sl-design-system/components/commit/5883fee3bb584130e5cd0009b7a2ed9b45d124af), [`45bff4d`](https://github.com/sl-design-system/components/commit/45bff4d60a32f4d46d8c9c99200efeaa1be6a2f0), [`199a2fc`](https://github.com/sl-design-system/components/commit/199a2fc0b3f0efb54c06429fd91fa09071b337de), [`f3993f3`](https://github.com/sl-design-system/components/commit/f3993f394e17fe14c8a1fccb9d79e33d8aac4163), [`a816bfe`](https://github.com/sl-design-system/components/commit/a816bfec8e3459cc3b12def88922a421345768f0), [`1be481a`](https://github.com/sl-design-system/components/commit/1be481aa6b300d50ddcf9a36b7e2d14942baaef7)]:
  - @sl-design-system/text-field@0.1.9
  - @sl-design-system/shared@0.1.9
  - @sl-design-system/checkbox@0.0.14
  - @sl-design-system/popover@0.0.13
  - @sl-design-system/icon@0.0.4

## 0.0.29

### Patch Changes

- [#676](https://github.com/sl-design-system/components/pull/676) [`8210783`](https://github.com/sl-design-system/components/commit/8210783b47f97d299ea4005628cbfc21d3e393b9) - Fix missing parts in columns

## 0.0.28

### Patch Changes

- [#674](https://github.com/sl-design-system/components/pull/674) [`dac4905`](https://github.com/sl-design-system/components/commit/dac4905063ad4aafb238a515b133b6621901da44) - Fix selection count when filter is active

## 0.0.27

### Patch Changes

- [#672](https://github.com/sl-design-system/components/pull/672) [`6992852`](https://github.com/sl-design-system/components/commit/69928524af458423710621b82d70e6356637b38a) - Fix incorrect selection count after all rows have been selected

- Updated dependencies [[`680e9a9`](https://github.com/sl-design-system/components/commit/680e9a97c4332a37b5949ca74eb699a3bc95f448), [`5208fa3`](https://github.com/sl-design-system/components/commit/5208fa38b4d702f9939a2b6c19065bc7a6ffa2cb), [`7fc4823`](https://github.com/sl-design-system/components/commit/7fc482392ab89ca8cb15f0c9254b6758f6171baa)]:
  - @sl-design-system/text-input@0.1.8
  - @sl-design-system/checkbox@0.0.13
  - @sl-design-system/shared@0.1.8
  - @sl-design-system/popover@0.0.12

## 0.0.26

### Patch Changes

- Updated dependencies [[`34696fb`](https://github.com/sl-design-system/components/commit/34696fb6c288a8c6101b7a5b80cef1240229a522)]:
  - @sl-design-system/shared@0.1.7
  - @sl-design-system/checkbox@0.0.12
  - @sl-design-system/popover@0.0.11
  - @sl-design-system/text-input@0.1.7

## 0.0.25

### Patch Changes

- Updated dependencies [[`c901f6c`](https://github.com/sl-design-system/components/commit/c901f6c5409367d19f2ced63c486f820af834faf), [`2203785`](https://github.com/sl-design-system/components/commit/22037855352e444362e42ebfebf9e6d1295bada1), [`b9a0b33`](https://github.com/sl-design-system/components/commit/b9a0b338b4e4047dbd809e501c163fa97a39130e)]:
  - @sl-design-system/shared@0.1.6
  - @sl-design-system/popover@0.0.10
  - @sl-design-system/checkbox@0.0.11
  - @sl-design-system/text-input@0.1.6

## 0.0.24

### Patch Changes

- [#546](https://github.com/sl-design-system/components/pull/546) [`f1aed34`](https://github.com/sl-design-system/components/commit/f1aed34f48df752f74e218558948315234e2fa49) - Fix the grid not updating when the data-source updates

## 0.0.23

### Patch Changes

- [#543](https://github.com/sl-design-system/components/pull/543) [`6f125e6`](https://github.com/sl-design-system/components/commit/6f125e6886f85fcfb8521e656f682e7385fe8aff) - Various improvements to data source & grid state

- Updated dependencies [[`6f125e6`](https://github.com/sl-design-system/components/commit/6f125e6886f85fcfb8521e656f682e7385fe8aff)]:
  - @sl-design-system/shared@0.1.5
  - @sl-design-system/checkbox@0.0.10
  - @sl-design-system/popover@0.0.9
  - @sl-design-system/text-input@0.1.5

## 0.0.22

### Patch Changes

- [#541](https://github.com/sl-design-system/components/pull/541) [`8fee657`](https://github.com/sl-design-system/components/commit/8fee65766edce4b08815a8744196d728949226d9) - Update filter & sort state from dataSource

- Updated dependencies [[`46c49dd`](https://github.com/sl-design-system/components/commit/46c49dd2e281d7efbeed40c9ee1e22b44265bc1a)]:
  - @sl-design-system/shared@0.1.4
  - @sl-design-system/checkbox@0.0.9
  - @sl-design-system/popover@0.0.8
  - @sl-design-system/text-input@0.1.4

## 0.0.21

### Patch Changes

- [#536](https://github.com/sl-design-system/components/pull/536) [`fea2ecf`](https://github.com/sl-design-system/components/commit/fea2ecfc9c30d8525dec95eed269daadf1f54a9b) - Fix dependency issue by grouping events

## 0.0.20

### Patch Changes

- [#534](https://github.com/sl-design-system/components/pull/534) [`a4b8d7c`](https://github.com/sl-design-system/components/commit/a4b8d7cd9bbf6234fd0d0a85bb47b63d4e627132) - Cleanup types

## 0.0.19

### Patch Changes

- [#533](https://github.com/sl-design-system/components/pull/533) [`ac9fbc8`](https://github.com/sl-design-system/components/commit/ac9fbc8e3ff2a1408800b17db7cde56a32b8b3a6) - Add `position="bottom"` to filter popover so it does not appear below a sticky header above it in browsers that do not support popover yet

- [#533](https://github.com/sl-design-system/components/pull/533) [`ac9fbc8`](https://github.com/sl-design-system/components/commit/ac9fbc8e3ff2a1408800b17db7cde56a32b8b3a6) - Use explicit grid events instead of `CustomEvent`. Allows us to add a `column` property for column related events.

## 0.0.18

### Patch Changes

- [#521](https://github.com/sl-design-system/components/pull/521) [`46fe06a`](https://github.com/sl-design-system/components/commit/46fe06a1be95b1bc1c5244ee5631006bf9c91fc8) - Handle null & undefined when filtering

## 0.0.17

### Patch Changes

- [#519](https://github.com/sl-design-system/components/pull/519) [`13aa7e7`](https://github.com/sl-design-system/components/commit/13aa7e75e2f26262261dba498fde3412d4259939) - Handle blank values properly when filtering

- Updated dependencies [[`13aa7e7`](https://github.com/sl-design-system/components/commit/13aa7e75e2f26262261dba498fde3412d4259939)]:
  - @sl-design-system/shared@0.1.3
  - @sl-design-system/checkbox@0.0.8
  - @sl-design-system/popover@0.0.7
  - @sl-design-system/text-input@0.1.3

## 0.0.16

### Patch Changes

- Updated dependencies [[`8a53d80`](https://github.com/sl-design-system/components/commit/8a53d800564073f7840a9f6365b234df3351c44f)]:
  - @sl-design-system/shared@0.1.2
  - @sl-design-system/checkbox@0.0.7
  - @sl-design-system/popover@0.0.6
  - @sl-design-system/text-input@0.1.2

## 0.0.15

### Patch Changes

- [#515](https://github.com/sl-design-system/components/pull/515) [`b5f3257`](https://github.com/sl-design-system/components/commit/b5f3257d069613bce30e9417318b246023dffbab) - Add ability to use a custom sort function

## 0.0.14

### Patch Changes

- [#502](https://github.com/sl-design-system/components/pull/502) [`87a4d29`](https://github.com/sl-design-system/components/commit/87a4d2932a2ce45ae7767e2b988af7fe807916f4) - Fix tbody min-height not taking the border width into account

## 0.0.13

### Patch Changes

- [#500](https://github.com/sl-design-system/components/pull/500) [`3570d7f`](https://github.com/sl-design-system/components/commit/3570d7f87b98190a5bc5ce71718f93004f935cf4) - Add missing part names to sort & selection column

## 0.0.12

### Patch Changes

- [#497](https://github.com/sl-design-system/components/pull/497) [`bcb01a4`](https://github.com/sl-design-system/components/commit/bcb01a425048570dcca4e2dd3e909b6c2893b952) - Fix regresion with filter column click

## 0.0.11

### Patch Changes

- Updated dependencies [[`d7f7af8`](https://github.com/sl-design-system/components/commit/d7f7af8908b83a5ff5f88400d44cb578eb51e7bb), [`d7f7af8`](https://github.com/sl-design-system/components/commit/d7f7af8908b83a5ff5f88400d44cb578eb51e7bb), [`d7f7af8`](https://github.com/sl-design-system/components/commit/d7f7af8908b83a5ff5f88400d44cb578eb51e7bb), [`d7f7af8`](https://github.com/sl-design-system/components/commit/d7f7af8908b83a5ff5f88400d44cb578eb51e7bb)]:
  - @sl-design-system/shared@0.1.1
  - @sl-design-system/text-input@0.1.1
  - @sl-design-system/popover@0.0.5
  - @sl-design-system/checkbox@0.0.6

## 0.0.10

### Patch Changes

- [#462](https://github.com/sl-design-system/components/pull/462) [`df14a96`](https://github.com/sl-design-system/components/commit/df14a962e8771101feb9edf10b19fd256287189b) - Fix various grid issues:

  - Fix unexported filter types
  - Add `GridColumnAlignment` type
  - Add `itemsChanged()` callback for when the items in the grid have changed
  - Fix name of sorter direction change event to match other events
  - Fix initial checked state in selection column header

## 0.0.9

### Patch Changes

- [#456](https://github.com/sl-design-system/components/pull/456) [`0ea4cc3`](https://github.com/sl-design-system/components/commit/0ea4cc3b4345fcadff3687ae3c8730707088a874) - Various grid fixes

## 0.0.8

### Patch Changes

- [#453](https://github.com/sl-design-system/components/pull/453) [`36e9946`](https://github.com/sl-design-system/components/commit/36e9946d5eea0c76207fc3273563bacdd2ea01d5) - Add support for initial filtered/sorted columns

- [#450](https://github.com/sl-design-system/components/pull/450) [`0246004`](https://github.com/sl-design-system/components/commit/0246004048c9f66dd19bee69177d1cecaacd1b95) - Add support for options in the grid filter column

- [#451](https://github.com/sl-design-system/components/pull/451) [`7923328`](https://github.com/sl-design-system/components/commit/7923328bbd949d761803f28bb8ce18efdae8c1ef) - Fix missing border with horizontal overflow

- [#452](https://github.com/sl-design-system/components/pull/452) [`892687a`](https://github.com/sl-design-system/components/commit/892687a3c4c0306964641c0e62ffb015227d58d2) - When 1 or more rows are selected, change the header

- Updated dependencies [[`4c1ba25`](https://github.com/sl-design-system/components/commit/4c1ba250a5b5edc65a74c47b9fbd869324791f17), [`0246004`](https://github.com/sl-design-system/components/commit/0246004048c9f66dd19bee69177d1cecaacd1b95), [`4c1ba25`](https://github.com/sl-design-system/components/commit/4c1ba250a5b5edc65a74c47b9fbd869324791f17)]:
  - @sl-design-system/shared@0.1.0
  - @sl-design-system/checkbox@0.0.5
  - @sl-design-system/text-input@0.1.0

## 0.0.7

### Patch Changes

- [#422](https://github.com/sl-design-system/components/pull/422) [`441aca8`](https://github.com/sl-design-system/components/commit/441aca8e4c7d399b64462ef96e8461e4f0f7f738) - Add proper sort column icons

- [#401](https://github.com/sl-design-system/components/pull/401) [`bf18dd9`](https://github.com/sl-design-system/components/commit/bf18dd96c01d3af263c675c6d91d1d31e39904cf) - Relax `GridColumnRenderer` return types

- [#411](https://github.com/sl-design-system/components/pull/411) [`af16ed2`](https://github.com/sl-design-system/components/commit/af16ed273175db2e1cc92d22d616fbc572c73af6) - Improve scrolling behavior to allow for sticky header and columns at the same time

- [#431](https://github.com/sl-design-system/components/pull/431) [`e4f7724`](https://github.com/sl-design-system/components/commit/e4f77249d2f42bd9b5c170afda38e7c6a1c2b6c7) - Fix sort column scoped elements value

- [#424](https://github.com/sl-design-system/components/pull/424) [`0feefd4`](https://github.com/sl-design-system/components/commit/0feefd4405e44f37d3c566acac99a645bdcf688b) - Fix selection column width

- Updated dependencies [[`81957ec`](https://github.com/sl-design-system/components/commit/81957ec587349c09d0a3d4e8ae41301c5730785f), [`d0eae48`](https://github.com/sl-design-system/components/commit/d0eae48a112ec6c096ca6f3804cb248a390f04c8), [`8bf9457`](https://github.com/sl-design-system/components/commit/8bf945764ab0fec52c87053d4758f86f4f21ae05)]:
  - @sl-design-system/checkbox@0.0.4
  - @sl-design-system/icon@0.0.3

## 0.0.6

### Patch Changes

- [#391](https://github.com/sl-design-system/components/pull/391) [`7f57d0e`](https://github.com/sl-design-system/components/commit/7f57d0ec7427d1e6b55c08f01a8546611a71eed7) - Enable customisation of `<thead>` using CSS parts

## 0.0.5

### Patch Changes

- Updated dependencies [[`d45dbfa`](https://github.com/sl-design-system/components/commit/d45dbfa4289439cdfba237190dbf910478f282db)]:
  - @sl-design-system/shared@0.0.3
  - @sl-design-system/checkbox@0.0.3
  - @sl-design-system/input@0.0.3

## 0.0.4

### Patch Changes

- [#386](https://github.com/sl-design-system/components/pull/386) [`81c8d1f`](https://github.com/sl-design-system/components/commit/81c8d1f445e524c3b70ec3f8e4e106630dd60ea5) - Fix external styling on row hover

## 0.0.3

### Patch Changes

- [#384](https://github.com/sl-design-system/components/pull/384) [`155195e`](https://github.com/sl-design-system/components/commit/155195ef3d6531d991346d6aaff685ca64be210a) - Fix scoped elements with sortable column

## 0.0.2

### Patch Changes

- [#381](https://github.com/sl-design-system/components/pull/381) [`bf663ee`](https://github.com/sl-design-system/components/commit/bf663eecbb5e1607562c94058002569d481298eb) - Fix types to work without "nodenext" module resolution

- Updated dependencies [[`bf663ee`](https://github.com/sl-design-system/components/commit/bf663eecbb5e1607562c94058002569d481298eb)]:
  - @sl-design-system/checkbox@0.0.2
  - @sl-design-system/icon@0.0.2
  - @sl-design-system/input@0.0.2
  - @sl-design-system/shared@0.0.2

## 0.0.1

### Patch Changes

- [#352](https://github.com/sl-design-system/components/pull/352) [`26866e0`](https://github.com/sl-design-system/components/commit/26866e0eda550e6c17f37f0e9cb6a9d4302c06bb) - Refactor all NPM packages to `@sl-design-system/<component|theme>`

- [#378](https://github.com/sl-design-system/components/pull/378) [`9391d10`](https://github.com/sl-design-system/components/commit/9391d109252e5038e7eae7d8b42e305a49ef8e9f) - Use icons instead of emojis for the sorting headers

- Updated dependencies [[`9391d10`](https://github.com/sl-design-system/components/commit/9391d109252e5038e7eae7d8b42e305a49ef8e9f), [`26866e0`](https://github.com/sl-design-system/components/commit/26866e0eda550e6c17f37f0e9cb6a9d4302c06bb)]:
  - @sl-design-system/icon@0.0.1
  - @sl-design-system/checkbox@0.0.1
  - @sl-design-system/shared@0.0.1
  - @sl-design-system/input@0.0.1
