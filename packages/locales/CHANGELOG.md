# @sl-design-system/locales

## 0.3.2

### Patch Changes

- [#3461](https://github.com/sl-design-system/components/pull/3461) [`c7efbd2`](https://github.com/sl-design-system/components/commit/c7efbd275e4638d5e94daa5d1a46fba73711f340) - Added new translation for infotip in radio, checkbox and switch

- [#3214](https://github.com/sl-design-system/components/pull/3214) [`29fbc5e`](https://github.com/sl-design-system/components/commit/29fbc5e9e8f4620c2f22a050ec0b8fa85341163b) - Replace `sl.tag.removalInstructions` with `sl.tag.remove` (a parameterized string for the remove button label, e.g. "Remove tag 'X'") and add `sl.tagList.navigationInstructions` for tag-list roving tabindex instructions.

## 0.3.1

### Patch Changes

- [#3366](https://github.com/sl-design-system/components/pull/3366) [`a4fc3d8`](https://github.com/sl-design-system/components/commit/a4fc3d88a9982bc6fa3d7a750ba321ac0c31f054) - Add translations for `sl.combobox.options` in Dutch, Italian, Polish and Spanish. Remove obsolete translations for `sl.combobox.hideOptions` and `sl.combobox.showOptions`, as these keys have been replaced by `sl.combobox.options` for the combobox toggle button.

- [#3362](https://github.com/sl-design-system/components/pull/3362) [`32cbeef`](https://github.com/sl-design-system/components/commit/32cbeef88dc3a235f18653a1767c60b2b9fd3e85) - Add translations for `sl.grid.reorder` in Dutch, Italian, Polish and Spanish.

- [#3231](https://github.com/sl-design-system/components/pull/3231) [`1480226`](https://github.com/sl-design-system/components/commit/1480226d34dc977bcc40b80878ff6ce28ece301d) - Added Italian, Polish and Castilian Spanish language files

## 0.3.0

### Minor Changes

- [#3197](https://github.com/sl-design-system/components/pull/3197) [`40304dd`](https://github.com/sl-design-system/components/commit/40304ddcd4d74cf94a51ada5729a31ff05437f5e) - New translations for infotip

## 0.2.0

### Minor Changes

- [#3075](https://github.com/sl-design-system/components/pull/3075) [`6470631`](https://github.com/sl-design-system/components/commit/64706319468be7753a04742dd0d0920912076eec) - New translations for helper text in the `calendar` when there is `min`, `max` or both are set: `sl.calendar.rangeBetween`, `sl.calendar.rangeNoEarlierThan` and `sl.calendar.rangeNoLaterThan`.

- [#3055](https://github.com/sl-design-system/components/pull/3055) [`5616832`](https://github.com/sl-design-system/components/commit/561683221a54010ff326b449468769597e22fb10) - Improved label for Time Field toggle dropdown button.
  If you have a custom translation file make sure to update your translation for the key `sl.timeField.toggleDropdown` as well to mean "Select time"

### Patch Changes

- [#3075](https://github.com/sl-design-system/components/pull/3075) [`6470631`](https://github.com/sl-design-system/components/commit/64706319468be7753a04742dd0d0920912076eec) - Fixes Dutch translations for `sl.calendar.previousYears` and `sl.calendar.nextYears`.

## 0.1.0

### Minor Changes

- [#2618](https://github.com/sl-design-system/components/pull/2618) [`1115612`](https://github.com/sl-design-system/components/commit/1115612e1fdf4ee38d9e484e92cc324e767f0e56) - New translations for `<sl-time-field>`

## 0.0.13

### Patch Changes

- [#1975](https://github.com/sl-design-system/components/pull/1975) [`4a6f8ba`](https://github.com/sl-design-system/components/commit/4a6f8ba02f49e8be7b37028c9b6a558ad91d9664) - Update translations for grid

- [#2036](https://github.com/sl-design-system/components/pull/2036) [`b411a41`](https://github.com/sl-design-system/components/commit/b411a415b496b0ca15677b58ca41c7d770833b6e) - Improved translations by using `id` to prevent unnecessary overwriting, which will also help with adding translations in more languages in the future.

- [#2024](https://github.com/sl-design-system/components/pull/2024) [`a343e29`](https://github.com/sl-design-system/components/commit/a343e298d6b65966e04b3fbfc3598305a29bf1cc) - New grid translations

## 0.0.12

### Patch Changes

- [#1926](https://github.com/sl-design-system/components/pull/1926) [`3766da5`](https://github.com/sl-design-system/components/commit/3766da571ddde0baea8daf63bd0d18a94b333a9d) - Fixed incorrect variables in Dutch translations, added missing translation

## 0.0.11

### Patch Changes

- [#1497](https://github.com/sl-design-system/components/pull/1497) [`dd63dd8`](https://github.com/sl-design-system/components/commit/dd63dd88f83f81316dd133b2eb9383454dae0b2f) - New translations added necessary for `paginator`, `items counter` and `page size` components.

- [#1699](https://github.com/sl-design-system/components/pull/1699) [`abdf56b`](https://github.com/sl-design-system/components/commit/abdf56bf38c97ef5ca6d432f09346f7ad205c507) - - Fixed order of elements for screenreaders.
  - Fixed an issues that caused the dialog to flicker when the title would wrap with and action button beside it but not wrap when the button is in line with the title.

## 0.0.10

### Patch Changes

- [#1484](https://github.com/sl-design-system/components/pull/1484) [`56ddcea`](https://github.com/sl-design-system/components/commit/56ddcea15cb6b9711b3735f60abe8a723ac831c0) - Fixed tag translations

## 0.0.9

### Patch Changes

- [#1356](https://github.com/sl-design-system/components/pull/1356) [`b9b9ff0`](https://github.com/sl-design-system/components/commit/b9b9ff091acaaba3e01e08cfaa1474c275485485) - Update dutch translations

- [#1356](https://github.com/sl-design-system/components/pull/1356) [`b9b9ff0`](https://github.com/sl-design-system/components/commit/b9b9ff091acaaba3e01e08cfaa1474c275485485) - Add `<sl-emoji-browser>` translation

## 0.0.8

### Patch Changes

- [#1241](https://github.com/sl-design-system/components/pull/1241) [`6ab0c88`](https://github.com/sl-design-system/components/commit/6ab0c88a6fa49d3ea14cd42739458f98ce01e4cb) - Add pristine/dirty and untouched/touched state to form controls

## 0.0.7

### Patch Changes

- [#1092](https://github.com/sl-design-system/components/pull/1092) [`b4aeccc`](https://github.com/sl-design-system/components/commit/b4aeccc033b8827d1d0bfa80a410c3290bf9fb94) - Added breadcrumbs component

## 0.0.6

### Patch Changes

- [#1032](https://github.com/sl-design-system/components/pull/1032) [`7bfda37`](https://github.com/sl-design-system/components/commit/7bfda37c299fff1f8827ac042b268a64a7c4f32d) - - Fix missing types in the NPM package
  - Move the `@lit/localize` dependency to `peerDependencies`

## 0.0.5

### Patch Changes

- [#995](https://github.com/sl-design-system/components/pull/995) [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5) - Linting fixes due to new eslint configuration

## 0.0.4

### Patch Changes

- [#984](https://github.com/sl-design-system/components/pull/984) [`5da216b`](https://github.com/sl-design-system/components/commit/5da216b3713c328eba06113d77d642462e1f05fc) - Update locales

## 0.0.3

### Patch Changes

- [#862](https://github.com/sl-design-system/components/pull/862) [`d881d5f`](https://github.com/sl-design-system/components/commit/d881d5fc5274be5275f910f445a16408d6bb2373) - Fix all form control validations to use i18n correctly

- [#872](https://github.com/sl-design-system/components/pull/872) [`da5784c`](https://github.com/sl-design-system/components/commit/da5784ca4aec18bdd1b5326274e59e803d7859ec) - Add missing validation translation

## 0.0.2

### Patch Changes

- [#688](https://github.com/sl-design-system/components/pull/688) [`a816bfe`](https://github.com/sl-design-system/components/commit/a816bfec8e3459cc3b12def88922a421345768f0) - Upgrade to Lit 3.0

## 0.0.1

### Patch Changes

- [#352](https://github.com/sl-design-system/components/pull/352) [`26866e0`](https://github.com/sl-design-system/components/commit/26866e0eda550e6c17f37f0e9cb6a9d4302c06bb) - Refactor all NPM packages to `@sl-design-system/<component|theme>`
