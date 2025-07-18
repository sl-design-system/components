# @sl-design-system/text-field

## 1.6.4

### Patch Changes

- [#2036](https://github.com/sl-design-system/components/pull/2036) [`b411a41`](https://github.com/sl-design-system/components/commit/b411a415b496b0ca15677b58ca41c7d770833b6e) - Improved translations by using `id` to prevent unnecessary overwriting, which will also help with adding translations in more languages in the future.

- Updated dependencies [[`1072075`](https://github.com/sl-design-system/components/commit/1072075e3f1b5f0bf8b07dc1f89fd39b9f7103d0), [`b411a41`](https://github.com/sl-design-system/components/commit/b411a415b496b0ca15677b58ca41c7d770833b6e), [`4a6f8ba`](https://github.com/sl-design-system/components/commit/4a6f8ba02f49e8be7b37028c9b6a558ad91d9664)]:
  - @sl-design-system/shared@0.8.0
  - @sl-design-system/form@1.2.3

## 1.6.3

### Patch Changes

- Updated dependencies [[`ab33cc8`](https://github.com/sl-design-system/components/commit/ab33cc86cc01480fb20206be689f9bbdb62bf0ad)]:
  - @sl-design-system/shared@0.7.0
  - @sl-design-system/form@1.2.2

## 1.6.2

### Patch Changes

- Updated dependencies [[`fa0b85d`](https://github.com/sl-design-system/components/commit/fa0b85d46c08018cd43de432c3a9705e7aede2c8), [`0db4860`](https://github.com/sl-design-system/components/commit/0db48604f9cbae73af25a08437a806dc7566273e), [`eaca9d2`](https://github.com/sl-design-system/components/commit/eaca9d24a6086d7a60dc5efc5332f16e80485d36), [`fe3c562`](https://github.com/sl-design-system/components/commit/fe3c562d4e18ab93e9209aaab1a604774cfba5fb)]:
  - @sl-design-system/shared@0.6.0
  - @sl-design-system/form@1.2.1

## 1.6.1

### Patch Changes

- [#1840](https://github.com/sl-design-system/components/pull/1840) [`94ec687`](https://github.com/sl-design-system/components/commit/94ec687d8d37f12dd569c902dd777b965ae3a029) - Fix `updated()` lifecycle loop warnings in the console

- [#1833](https://github.com/sl-design-system/components/pull/1833) [`b37b9a2`](https://github.com/sl-design-system/components/commit/b37b9a26dd9b0b0fe2f412a08803e75168cc4f1c) - Do not use the caret cursor when readonly

## 1.6.0

### Minor Changes

- [#1805](https://github.com/sl-design-system/components/pull/1805) [`94e2a7b`](https://github.com/sl-design-system/components/commit/94e2a7bf1ccaaa9d547654603554cc6bdfdf66fb) - Increase the padding for `md` from `32px` to `36px` and for `lg` from `40px` to `48px`.

- [#1791](https://github.com/sl-design-system/components/pull/1791) [`133b883`](https://github.com/sl-design-system/components/commit/133b883234d911dabe37bd3c8acef26afea20fe9) - Replace `--sl-size-borderWidth-subtle` with `--sl-size-borderWidth-default`

- [#1805](https://github.com/sl-design-system/components/pull/1805) [`94e2a7b`](https://github.com/sl-design-system/components/commit/94e2a7bf1ccaaa9d547654603554cc6bdfdf66fb) - Refactor field buttons to `<sl-field-button>` component

  This new component is not a top-level component. It is just a button
  meant to be used with a text field related component.

  This also fixes several bugs where hover/active styling did not apply to
  slotted buttons.

- [#1713](https://github.com/sl-design-system/components/pull/1713) [`01abf58`](https://github.com/sl-design-system/components/commit/01abf5833d364a76dbdf4e0df0587d0fbec3848e) - Refactor styling to use new contextual tokens

### Patch Changes

- [#1785](https://github.com/sl-design-system/components/pull/1785) [`4e80437`](https://github.com/sl-design-system/components/commit/4e804374c3a02e88b04e4c1df662967740461f7c) - - Styling buttons improvements,

  - Formatting value changes - using `formattedValue` instead of `formatValue`.

- [#1805](https://github.com/sl-design-system/components/pull/1805) [`94e2a7b`](https://github.com/sl-design-system/components/commit/94e2a7bf1ccaaa9d547654603554cc6bdfdf66fb) - Fix able to submit a parent form using the enter key in readonly mode

- [#1633](https://github.com/sl-design-system/components/pull/1633) [`7e8a441`](https://github.com/sl-design-system/components/commit/7e8a441b053715b896bb7ef775d4a24a93a5a9dd) - Fix NVDA accessibility issues: moving aria attributes to the right control.

- Updated dependencies [[`6309452`](https://github.com/sl-design-system/components/commit/63094521a7b262bd80c1a9a377086093d2844a8d), [`7e8a441`](https://github.com/sl-design-system/components/commit/7e8a441b053715b896bb7ef775d4a24a93a5a9dd), [`cab0938`](https://github.com/sl-design-system/components/commit/cab093898b324073801945fc3771eec2014d6652), [`133b883`](https://github.com/sl-design-system/components/commit/133b883234d911dabe37bd3c8acef26afea20fe9), [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb), [`40cc538`](https://github.com/sl-design-system/components/commit/40cc538648e6ed5ac453fbe708bae8761caaab5e), [`c4a93fb`](https://github.com/sl-design-system/components/commit/c4a93fba6f40b8e843a169117dfdd331a5d9d6e6), [`c19862e`](https://github.com/sl-design-system/components/commit/c19862e56455c3d8e27a9afc33bf684f89b04b75), [`bbcb7f7`](https://github.com/sl-design-system/components/commit/bbcb7f7cd48e22fa1e61f24ba645a4131b0c75ee), [`a62dee4`](https://github.com/sl-design-system/components/commit/a62dee4a381450cca44c647a54d850290e5b0f11), [`b1e3b74`](https://github.com/sl-design-system/components/commit/b1e3b741e78400e3755ddaa0c5c4fdeed2e3f960), [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb), [`4e57f9c`](https://github.com/sl-design-system/components/commit/4e57f9c60835a07db45f74fde73a3bf13b6abe51), [`01abf58`](https://github.com/sl-design-system/components/commit/01abf5833d364a76dbdf4e0df0587d0fbec3848e)]:
  - @sl-design-system/shared@0.5.0
  - @sl-design-system/form@1.2.0
  - @sl-design-system/icon@1.1.0

## 1.5.0

### Minor Changes

- [#1580](https://github.com/sl-design-system/components/pull/1580) [`33fd543`](https://github.com/sl-design-system/components/commit/33fd5432f1499051071662aaca9974c212304bc6) - Improve implicit form submit behavior

  Previously when you pressed enter in a text field, it would call `requestSubmit()` on the associated `<form>` element. This mimics the behavior of the native `<input>` element. With this change, the behavior now also works if there is only a parent `<sl-form>` element. If both `<form>` and `<sl-form>` elements are present, then the `<form>` element will take precedence. This makes it a minor change.

### Patch Changes

- Updated dependencies [[`4714b36`](https://github.com/sl-design-system/components/commit/4714b36f1387d4d1731a310b621caf5a33be105b), [`ebe4c8a`](https://github.com/sl-design-system/components/commit/ebe4c8a32e85b753e2aa752a13b2dc23616bf1a9), [`33fd543`](https://github.com/sl-design-system/components/commit/33fd5432f1499051071662aaca9974c212304bc6), [`33fd543`](https://github.com/sl-design-system/components/commit/33fd5432f1499051071662aaca9974c212304bc6)]:
  - @sl-design-system/shared@0.4.0
  - @sl-design-system/form@1.1.0

## 1.4.0

### Minor Changes

- [#1492](https://github.com/sl-design-system/components/pull/1492) [`21302c2`](https://github.com/sl-design-system/components/commit/21302c28065512f1c89ffde17dbc3241a2306d5d) - Change the `autocomplete` property to be more flexible when inheriting

### Patch Changes

- [#1492](https://github.com/sl-design-system/components/pull/1492) [`21302c2`](https://github.com/sl-design-system/components/commit/21302c28065512f1c89ffde17dbc3241a2306d5d) - Various bug fixes:
  - Fix selector for field button not matching when not slotted
  - Fix nested slotted `<input>` logic not working correctly
  - Rename private `#syncInput` to public `updateInputElement` method that can be overridden
- Updated dependencies [[`21302c2`](https://github.com/sl-design-system/components/commit/21302c28065512f1c89ffde17dbc3241a2306d5d), [`000723a`](https://github.com/sl-design-system/components/commit/000723a8e42cb468383fa0b968eb31a672b95e80)]:
  - @sl-design-system/shared@0.3.2
  - @sl-design-system/form@1.0.4

## 1.3.5

### Patch Changes

- Updated dependencies [[`e3597ad`](https://github.com/sl-design-system/components/commit/e3597adca3a2b98f1507af55b7fb3748d9c29ffb), [`c8b9c89`](https://github.com/sl-design-system/components/commit/c8b9c89a367066ab241348c9f93e6e087ec796ea), [`ff1618c`](https://github.com/sl-design-system/components/commit/ff1618cdfa4d0060465d993f656345ba1044f88c), [`96c5ade`](https://github.com/sl-design-system/components/commit/96c5ade1562ca5faf936ce59f13a2fb84abeac56)]:
  - @sl-design-system/icon@1.0.2
  - @sl-design-system/shared@0.3.0
  - @sl-design-system/form@1.0.3

## 1.3.4

### Patch Changes

- [#1332](https://github.com/sl-design-system/components/pull/1332) [`d80d9a8`](https://github.com/sl-design-system/components/commit/d80d9a8888398b646147268c02f40512fa8250e6) - Fix prefix & suffix icons having wrong color when disabled

- Updated dependencies [[`a705c3f`](https://github.com/sl-design-system/components/commit/a705c3f7034207b19a10a819bccd85a3347e0204), [`0f0e93c`](https://github.com/sl-design-system/components/commit/0f0e93c374f1706ce461217849d385649ed45a5a), [`5f4226f`](https://github.com/sl-design-system/components/commit/5f4226f0025e4839fc5c8a694c2df26bafea67c2)]:
  - @sl-design-system/shared@0.2.12
  - @sl-design-system/form@1.0.2

## 1.3.3

### Patch Changes

- [#1310](https://github.com/sl-design-system/components/pull/1310) [`3161771`](https://github.com/sl-design-system/components/commit/3161771790870cd2bfeb52d9016dbb4f94c07056) - Fix missing cursor styling on input

## 1.3.2

### Patch Changes

- [#1308](https://github.com/sl-design-system/components/pull/1308) [`37b0c2c`](https://github.com/sl-design-system/components/commit/37b0c2c254466206c8789ed08b917776e3592768) - Fix cursor to be default when in readonly mode

## 1.3.1

### Patch Changes

- [#1303](https://github.com/sl-design-system/components/pull/1303) [`4aba9bf`](https://github.com/sl-design-system/components/commit/4aba9bf657f426d815e5850ef495ca9969bfa78e) - Fix scoping of CSS custom property `--_font` scoping being too specific

## 1.3.0

### Minor Changes

- [#1301](https://github.com/sl-design-system/components/pull/1301) [`c1b7630`](https://github.com/sl-design-system/components/commit/c1b763058f28f736545592da7b79b8f68aa65953) - Separate rendering of the input slot in its own method, so it can be composed in components that inherit from `TextField`.

## 1.2.0

### Minor Changes

- [#1299](https://github.com/sl-design-system/components/pull/1299) [`942bf3c`](https://github.com/sl-design-system/components/commit/942bf3ca851889bccd033e3a84f20d4f777c1e35) - Automatically style any `<button>`s that are slotted or in the shadow DOM as field buttons. An example of this can be found in the `<sl-search-field>` component.

## 1.1.0

### Minor Changes

- [#1296](https://github.com/sl-design-system/components/pull/1296) [`39a4cb2`](https://github.com/sl-design-system/components/commit/39a4cb206ad923862c902b3ac7dddd4ae5b87746) - Support other types than just string for inheritance:
  - Use `T extends { toString(): string } = string` type for `TextField`
  - Add `parseValue` method that converts the raw value to the given type (or throw an `Error` if it cannot be parsed)
  - Add `formatValue` method to format a value for display in the input

## 1.0.0

### Major Changes

- [#1281](https://github.com/sl-design-system/components/pull/1281) [`c4012af`](https://github.com/sl-design-system/components/commit/c4012af75faaec57e3a1dc5d7f2e8205ce1d3805) - First stable release

### Minor Changes

- [#1251](https://github.com/sl-design-system/components/pull/1251) [`a3da76c`](https://github.com/sl-design-system/components/commit/a3da76c7df521c2241b565dc22025715f1231e9c) - Add ability to override the prefix and suffix rendering

- [#1241](https://github.com/sl-design-system/components/pull/1241) [`6ab0c88`](https://github.com/sl-design-system/components/commit/6ab0c88a6fa49d3ea14cd42739458f98ce01e4cb) - Add pristine/dirty and untouched/touched state to form controls

### Patch Changes

- [#1241](https://github.com/sl-design-system/components/pull/1241) [`6ab0c88`](https://github.com/sl-design-system/components/commit/6ab0c88a6fa49d3ea14cd42739458f98ce01e4cb) - Focus the native element when calling `focus()`

- Updated dependencies [[`6ab0c88`](https://github.com/sl-design-system/components/commit/6ab0c88a6fa49d3ea14cd42739458f98ce01e4cb), [`c4012af`](https://github.com/sl-design-system/components/commit/c4012af75faaec57e3a1dc5d7f2e8205ce1d3805), [`6ab0c88`](https://github.com/sl-design-system/components/commit/6ab0c88a6fa49d3ea14cd42739458f98ce01e4cb), [`c4012af`](https://github.com/sl-design-system/components/commit/c4012af75faaec57e3a1dc5d7f2e8205ce1d3805), [`0208c28`](https://github.com/sl-design-system/components/commit/0208c282f68d9eac64a6609c5213094c8df04202), [`6ab0c88`](https://github.com/sl-design-system/components/commit/6ab0c88a6fa49d3ea14cd42739458f98ce01e4cb), [`6ab0c88`](https://github.com/sl-design-system/components/commit/6ab0c88a6fa49d3ea14cd42739458f98ce01e4cb), [`ac092e1`](https://github.com/sl-design-system/components/commit/ac092e16d29d3a0e404f2a05dbc35a7774e7fd7e)]:
  - @sl-design-system/form@1.0.0
  - @sl-design-system/icon@1.0.0

## 0.1.25

### Patch Changes

- [#1215](https://github.com/sl-design-system/components/pull/1215) [`27ad98d`](https://github.com/sl-design-system/components/commit/27ad98dc8add269600afc90d59c07d768989928d) - Remove inline invalid icon and just have the form field display it, like the other form components.

- Updated dependencies [[`27ad98d`](https://github.com/sl-design-system/components/commit/27ad98dc8add269600afc90d59c07d768989928d), [`c3c9de6`](https://github.com/sl-design-system/components/commit/c3c9de6590f5abd1d8010186df127a665ee303b5), [`59a41aa`](https://github.com/sl-design-system/components/commit/59a41aa4b6530d5002e6e45313249e4abe7dac3b), [`27ad98d`](https://github.com/sl-design-system/components/commit/27ad98dc8add269600afc90d59c07d768989928d)]:
  - @sl-design-system/form@0.0.15
  - @sl-design-system/shared@0.2.11

## 0.1.24

### Patch Changes

- [#1194](https://github.com/sl-design-system/components/pull/1194) [`244d50f`](https://github.com/sl-design-system/components/commit/244d50f46ee4c87aab26e167c8ca5b200c1d30c2) - Fix "The specified element is not a submit button." error when pressing Enter.

## 0.1.23

### Patch Changes

- Updated dependencies [[`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537), [`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537), [`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537)]:
  - @sl-design-system/shared@0.2.10
  - @sl-design-system/icon@0.0.10
  - @sl-design-system/form@0.0.14

## 0.1.22

### Patch Changes

- Updated dependencies [[`d22722e`](https://github.com/sl-design-system/components/commit/d22722e6792c19c76d0fb6ec476fac1ff241d52b)]:
  - @sl-design-system/shared@0.2.9
  - @sl-design-system/form@0.0.13

## 0.1.21

### Patch Changes

- Updated dependencies [[`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da), [`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da)]:
  - @sl-design-system/shared@0.2.8
  - @sl-design-system/form@0.0.12

## 0.1.20

### Patch Changes

- Updated dependencies [[`38b0ca4`](https://github.com/sl-design-system/components/commit/38b0ca4d72014605418639b69410863eb8e231ad)]:
  - @sl-design-system/shared@0.2.7
  - @sl-design-system/form@0.0.11

## 0.1.19

### Patch Changes

- [#1026](https://github.com/sl-design-system/components/pull/1026) [`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b) - Linting fixes for styling

- Updated dependencies [[`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b), [`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b)]:
  - @sl-design-system/form@0.0.10
  - @sl-design-system/icon@0.0.9

## 0.1.18

### Patch Changes

- [#1018](https://github.com/sl-design-system/components/pull/1018) [`aaa09ff`](https://github.com/sl-design-system/components/commit/aaa09ffb78db9df6298ce77d51a79b7aed213e59) - Fix 3rd party dependencies to be peerDependencies instead

- [#995](https://github.com/sl-design-system/components/pull/995) [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5) - Linting fixes due to new eslint configuration

- Updated dependencies [[`aaa09ff`](https://github.com/sl-design-system/components/commit/aaa09ffb78db9df6298ce77d51a79b7aed213e59), [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5)]:
  - @sl-design-system/shared@0.2.6
  - @sl-design-system/form@0.0.9
  - @sl-design-system/icon@0.0.8

## 0.1.17

### Patch Changes

- Updated dependencies [[`dbc032b`](https://github.com/sl-design-system/components/commit/dbc032b3a7587dfcbdb6a2118330b039765cf0fb), [`5da216b`](https://github.com/sl-design-system/components/commit/5da216b3713c328eba06113d77d642462e1f05fc)]:
  - @sl-design-system/shared@0.2.5
  - @sl-design-system/form@0.0.8

## 0.1.16

### Patch Changes

- Updated dependencies [[`216d62e`](https://github.com/sl-design-system/components/commit/216d62eb5a16277b4ea2767ea0530e570bf40abf), [`216d62e`](https://github.com/sl-design-system/components/commit/216d62eb5a16277b4ea2767ea0530e570bf40abf)]:
  - @sl-design-system/shared@0.2.4
  - @sl-design-system/form@0.0.7

## 0.1.15

### Patch Changes

- Updated dependencies [[`afc3d60`](https://github.com/sl-design-system/components/commit/afc3d606c20409b4ad2d589ffc0b899d3f853997)]:
  - @sl-design-system/shared@0.2.3
  - @sl-design-system/form@0.0.6

## 0.1.14

### Patch Changes

- [#927](https://github.com/sl-design-system/components/pull/927) [`e3c8bbb`](https://github.com/sl-design-system/components/commit/e3c8bbbd400ad07aa6ad0f984fc2b2d5e88c1e94) - Use `--sl-border-width-input-border` instead of the button border width

## 0.1.13

### Patch Changes

- [#925](https://github.com/sl-design-system/components/pull/925) [`2aff1dd`](https://github.com/sl-design-system/components/commit/2aff1dd7aa946cb2ee998d7d121ab585ca9ad39b) - Bump Lit and related dependencies

- Updated dependencies [[`06cfb6b`](https://github.com/sl-design-system/components/commit/06cfb6bff8f2c1a8d4a132099f21f2e8dc4f2461), [`9320cbc`](https://github.com/sl-design-system/components/commit/9320cbc446e479435860ad5f9756725b36acf764), [`2aff1dd`](https://github.com/sl-design-system/components/commit/2aff1dd7aa946cb2ee998d7d121ab585ca9ad39b)]:
  - @sl-design-system/shared@0.2.2
  - @sl-design-system/form@0.0.5
  - @sl-design-system/icon@0.0.7

## 0.1.12

### Patch Changes

- Updated dependencies [[`a37667e`](https://github.com/sl-design-system/components/commit/a37667eb4478da696595fdda618b86d15262f60a), [`b8e7589`](https://github.com/sl-design-system/components/commit/b8e7589f88f447b6e1ee05bbbd0847425f1fcef2)]:
  - @sl-design-system/form@0.0.4

## 0.1.11

### Patch Changes

- [#862](https://github.com/sl-design-system/components/pull/862) [`d881d5f`](https://github.com/sl-design-system/components/commit/d881d5fc5274be5275f910f445a16408d6bb2373) - Fix all form control validations to use i18n correctly

- [#861](https://github.com/sl-design-system/components/pull/861) [`416a4bd`](https://github.com/sl-design-system/components/commit/416a4bdc49dd334d4a3c89c4697e9f69f22bf84b) - Fix builtin vs custom validation behavior

  This add a new `sl-validate` event that is fired when the validity of the form control is updated. It fires _after_ any builtin validation has been performed, so it can be used to override the validity of the control.

- [#805](https://github.com/sl-design-system/components/pull/805) [`85f57c8`](https://github.com/sl-design-system/components/commit/85f57c8ae5922a24edf1b6bdaef2554e5a057ed3) - Simplify text-field component

- [#872](https://github.com/sl-design-system/components/pull/872) [`da5784c`](https://github.com/sl-design-system/components/commit/da5784ca4aec18bdd1b5326274e59e803d7859ec) - Add missing validation translation

- [#842](https://github.com/sl-design-system/components/pull/842) [`bde9afa`](https://github.com/sl-design-system/components/commit/bde9afa06833adf91122df3960d04db6cb34d536) - Improve and unify `show-validity` behavior

- [#865](https://github.com/sl-design-system/components/pull/865) [`c358c27`](https://github.com/sl-design-system/components/commit/c358c279fe022cc3935284e2dc7add6a57eda7c2) - When the text-field was smaller than a default native input field the suffix icon would fall outside the container. The minimum width of the input has been set to 0 so it won't push the icon out any more.

- [#872](https://github.com/sl-design-system/components/pull/872) [`da5784c`](https://github.com/sl-design-system/components/commit/da5784ca4aec18bdd1b5326274e59e803d7859ec) - Unify form values for all controls

- Updated dependencies [[`988e936`](https://github.com/sl-design-system/components/commit/988e936fabc65fb2b6cb83f5df7b6b7035280f2f), [`a05db1d`](https://github.com/sl-design-system/components/commit/a05db1dcc19153ce0c843782c6d5aff46a992acf), [`bbf18f7`](https://github.com/sl-design-system/components/commit/bbf18f7453debffe8f3bebf096a0552b8df60500), [`d881d5f`](https://github.com/sl-design-system/components/commit/d881d5fc5274be5275f910f445a16408d6bb2373), [`416a4bd`](https://github.com/sl-design-system/components/commit/416a4bdc49dd334d4a3c89c4697e9f69f22bf84b), [`bde9afa`](https://github.com/sl-design-system/components/commit/bde9afa06833adf91122df3960d04db6cb34d536), [`0b41208`](https://github.com/sl-design-system/components/commit/0b41208f390b27e3738e0d81258abeaa18e19a0f), [`b507ee0`](https://github.com/sl-design-system/components/commit/b507ee07e119733d285a348e74f34c4b2d172902), [`d881d5f`](https://github.com/sl-design-system/components/commit/d881d5fc5274be5275f910f445a16408d6bb2373), [`da5784c`](https://github.com/sl-design-system/components/commit/da5784ca4aec18bdd1b5326274e59e803d7859ec)]:
  - @sl-design-system/form@0.0.3
  - @sl-design-system/icon@0.0.6
  - @sl-design-system/shared@0.2.1

## 0.1.10

### Patch Changes

- [#790](https://github.com/sl-design-system/components/pull/790) [`9b8e371`](https://github.com/sl-design-system/components/commit/9b8e371932fbe979f3250e07c605ad39239d4f82) - Upgrade to latest `@open-wc/scoped-elements` to track the standards spec

- [#724](https://github.com/sl-design-system/components/pull/724) [`b3f9d42`](https://github.com/sl-design-system/components/commit/b3f9d42945c7b427105353ede3cf74ba3191792d) - Added avatar + added token for focus ring offset

- Updated dependencies [[`198c7c2`](https://github.com/sl-design-system/components/commit/198c7c277787d48276d402522f94f2d0d5132152), [`b3f9d42`](https://github.com/sl-design-system/components/commit/b3f9d42945c7b427105353ede3cf74ba3191792d)]:
  - @sl-design-system/shared@0.2.0
  - @sl-design-system/form@0.0.2

## 0.1.9

### Patch Changes

- [#705](https://github.com/sl-design-system/components/pull/705) [`5883fee`](https://github.com/sl-design-system/components/commit/5883fee3bb584130e5cd0009b7a2ed9b45d124af) - New form package with updated text field

- [#711](https://github.com/sl-design-system/components/pull/711) [`f3993f3`](https://github.com/sl-design-system/components/commit/f3993f394e17fe14c8a1fccb9d79e33d8aac4163) - Add sl-blur, sl-change, sl-focus and sl-input events

- [#688](https://github.com/sl-design-system/components/pull/688) [`a816bfe`](https://github.com/sl-design-system/components/commit/a816bfec8e3459cc3b12def88922a421345768f0) - Upgrade to Lit 3.0

- Updated dependencies [[`5883fee`](https://github.com/sl-design-system/components/commit/5883fee3bb584130e5cd0009b7a2ed9b45d124af), [`45bff4d`](https://github.com/sl-design-system/components/commit/45bff4d60a32f4d46d8c9c99200efeaa1be6a2f0), [`199a2fc`](https://github.com/sl-design-system/components/commit/199a2fc0b3f0efb54c06429fd91fa09071b337de), [`a816bfe`](https://github.com/sl-design-system/components/commit/a816bfec8e3459cc3b12def88922a421345768f0), [`1be481a`](https://github.com/sl-design-system/components/commit/1be481aa6b300d50ddcf9a36b7e2d14942baaef7)]:
  - @sl-design-system/form@0.0.1
  - @sl-design-system/shared@0.1.9

## 0.1.8

### Patch Changes

- [#545](https://github.com/sl-design-system/components/pull/545) [`680e9a9`](https://github.com/sl-design-system/components/commit/680e9a97c4332a37b5949ca74eb699a3bc95f448) - changed focus indicator to outline instead of box shadow

- Updated dependencies [[`680e9a9`](https://github.com/sl-design-system/components/commit/680e9a97c4332a37b5949ca74eb699a3bc95f448), [`5208fa3`](https://github.com/sl-design-system/components/commit/5208fa38b4d702f9939a2b6c19065bc7a6ffa2cb)]:
  - @sl-design-system/shared@0.1.8

## 0.1.7

### Patch Changes

- Updated dependencies [[`34696fb`](https://github.com/sl-design-system/components/commit/34696fb6c288a8c6101b7a5b80cef1240229a522)]:
  - @sl-design-system/shared@0.1.7

## 0.1.6

### Patch Changes

- Updated dependencies [[`c901f6c`](https://github.com/sl-design-system/components/commit/c901f6c5409367d19f2ced63c486f820af834faf), [`2203785`](https://github.com/sl-design-system/components/commit/22037855352e444362e42ebfebf9e6d1295bada1), [`b9a0b33`](https://github.com/sl-design-system/components/commit/b9a0b338b4e4047dbd809e501c163fa97a39130e)]:
  - @sl-design-system/shared@0.1.6

## 0.1.5

### Patch Changes

- Updated dependencies [[`6f125e6`](https://github.com/sl-design-system/components/commit/6f125e6886f85fcfb8521e656f682e7385fe8aff)]:
  - @sl-design-system/shared@0.1.5

## 0.1.4

### Patch Changes

- Updated dependencies [[`46c49dd`](https://github.com/sl-design-system/components/commit/46c49dd2e281d7efbeed40c9ee1e22b44265bc1a)]:
  - @sl-design-system/shared@0.1.4

## 0.1.3

### Patch Changes

- Updated dependencies [[`13aa7e7`](https://github.com/sl-design-system/components/commit/13aa7e75e2f26262261dba498fde3412d4259939)]:
  - @sl-design-system/shared@0.1.3

## 0.1.2

### Patch Changes

- Updated dependencies [[`8a53d80`](https://github.com/sl-design-system/components/commit/8a53d800564073f7840a9f6365b234df3351c44f)]:
  - @sl-design-system/shared@0.1.2

## 0.1.1

### Patch Changes

- [#491](https://github.com/sl-design-system/components/pull/491) [`d7f7af8`](https://github.com/sl-design-system/components/commit/d7f7af8908b83a5ff5f88400d44cb578eb51e7bb) - Update `autocomplete` types due to latest TypeScript version

- Updated dependencies [[`d7f7af8`](https://github.com/sl-design-system/components/commit/d7f7af8908b83a5ff5f88400d44cb578eb51e7bb), [`d7f7af8`](https://github.com/sl-design-system/components/commit/d7f7af8908b83a5ff5f88400d44cb578eb51e7bb)]:
  - @sl-design-system/shared@0.1.1

## 0.1.0

### Minor Changes

- [#454](https://github.com/sl-design-system/components/pull/454) [`4c1ba25`](https://github.com/sl-design-system/components/commit/4c1ba250a5b5edc65a74c47b9fbd869324791f17) - Styled input component

### Patch Changes

- Updated dependencies [[`4c1ba25`](https://github.com/sl-design-system/components/commit/4c1ba250a5b5edc65a74c47b9fbd869324791f17)]:
  - @sl-design-system/shared@0.1.0

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
