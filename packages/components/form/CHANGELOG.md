# @sl-design-system/form

## 1.0.3

### Patch Changes

- Updated dependencies [[`c8b9c89`](https://github.com/sl-design-system/components/commit/c8b9c89a367066ab241348c9f93e6e087ec796ea), [`96c5ade`](https://github.com/sl-design-system/components/commit/96c5ade1562ca5faf936ce59f13a2fb84abeac56)]:
  - @sl-design-system/shared@0.3.0
  - @sl-design-system/inline-message@1.0.1

## 1.0.2

### Patch Changes

- [#1322](https://github.com/sl-design-system/components/pull/1322) [`0f0e93c`](https://github.com/sl-design-system/components/commit/0f0e93c374f1706ce461217849d385649ed45a5a) - Move the `align-self: start` of checkbox and reverse switch to form-field. This
  fixes the alignment issue of checkbox and switch when not used inside a form-field.
- Updated dependencies [[`d787820`](https://github.com/sl-design-system/components/commit/d7878202384eab3f58908b1cf252851c6a3d2744), [`a705c3f`](https://github.com/sl-design-system/components/commit/a705c3f7034207b19a10a819bccd85a3347e0204), [`5f4226f`](https://github.com/sl-design-system/components/commit/5f4226f0025e4839fc5c8a694c2df26bafea67c2)]:
  - @sl-design-system/inline-message@1.0.0
  - @sl-design-system/shared@0.2.12

## 1.0.1

### Patch Changes

- [#1285](https://github.com/sl-design-system/components/pull/1285) [`7167331`](https://github.com/sl-design-system/components/commit/716733139cab1d2d0387b7a40b6b36a5546b92cb) - Missing inline-message dependency for form-validation-errors component

## 1.0.0

### Major Changes

- [#1281](https://github.com/sl-design-system/components/pull/1281) [`c4012af`](https://github.com/sl-design-system/components/commit/c4012af75faaec57e3a1dc5d7f2e8205ce1d3805) - First stable release

### Minor Changes

- [#1241](https://github.com/sl-design-system/components/pull/1241) [`6ab0c88`](https://github.com/sl-design-system/components/commit/6ab0c88a6fa49d3ea14cd42739458f98ce01e4cb) - Support composite form fields

  The `<sl-form-field>` component now supports more than 1 form control. The first form control will be the main control and the rest will be secondary controls. Only the first control will be linked to the field's label and help text. If the first form control does not have a validation message, then the second form control that does will be used etc. This allows for more complex fields like a radio group, with an "other" option that enables a text field when selected.

- [#1241](https://github.com/sl-design-system/components/pull/1241) [`6ab0c88`](https://github.com/sl-design-system/components/commit/6ab0c88a6fa49d3ea14cd42739458f98ce01e4cb) - New Lit `FormController` for binding to the `<sl-form>` element

  `FormController` is a new `ReactiveController` that you can use in your Lit components to bind to the `<sl-form>` element. It monitors any changes to the form's fields and controls and updates the form's validity state accordingly. This makes it easy to modify a component when the form changes state.

- [#1241](https://github.com/sl-design-system/components/pull/1241) [`6ab0c88`](https://github.com/sl-design-system/components/commit/6ab0c88a6fa49d3ea14cd42739458f98ce01e4cb) - New `<sl-form-validation-errors>` component

- [#1241](https://github.com/sl-design-system/components/pull/1241) [`6ab0c88`](https://github.com/sl-design-system/components/commit/6ab0c88a6fa49d3ea14cd42739458f98ce01e4cb) - Add pristine/dirty and untouched/touched state to form controls

- [#1258](https://github.com/sl-design-system/components/pull/1258) [`ac092e1`](https://github.com/sl-design-system/components/commit/ac092e16d29d3a0e404f2a05dbc35a7774e7fd7e) - Various improvements:
  - Add ability to set the form value using the `value` property on the form component
  - Add ability to set the form value on the `FormController`
  - Add ability to use nested & array names for form controls
  - Properly unregister controls & fields when they are removed from the DOM

### Patch Changes

- [#1279](https://github.com/sl-design-system/components/pull/1279) [`0208c28`](https://github.com/sl-design-system/components/commit/0208c282f68d9eac64a6609c5213094c8df04202) - Fix for form control element errors after disconnect in unit tests

## 0.0.15

### Patch Changes

- [#1215](https://github.com/sl-design-system/components/pull/1215) [`27ad98d`](https://github.com/sl-design-system/components/commit/27ad98dc8add269600afc90d59c07d768989928d) - Remove inline invalid icon and just have the form field display it, like the other form components.

- [#1210](https://github.com/sl-design-system/components/pull/1210) [`c3c9de6`](https://github.com/sl-design-system/components/commit/c3c9de6590f5abd1d8010186df127a665ee303b5) - Convert form events to `CustomEvent`s

- [#1215](https://github.com/sl-design-system/components/pull/1215) [`27ad98d`](https://github.com/sl-design-system/components/commit/27ad98dc8add269600afc90d59c07d768989928d) - Move the hint above the form control, so you can have both hint and validation error showing at the same time.

- Updated dependencies [[`59a41aa`](https://github.com/sl-design-system/components/commit/59a41aa4b6530d5002e6e45313249e4abe7dac3b)]:
  - @sl-design-system/shared@0.2.11

## 0.0.14

### Patch Changes

- Updated dependencies [[`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537), [`3295fa8`](https://github.com/sl-design-system/components/commit/3295fa8a92a7b0284a422232884f5fef77aa8537)]:
  - @sl-design-system/shared@0.2.10

## 0.0.13

### Patch Changes

- Updated dependencies [[`d22722e`](https://github.com/sl-design-system/components/commit/d22722e6792c19c76d0fb6ec476fac1ff241d52b)]:
  - @sl-design-system/shared@0.2.9

## 0.0.12

### Patch Changes

- Updated dependencies [[`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da), [`090c7b0`](https://github.com/sl-design-system/components/commit/090c7b039c8a7cadbdfbed0563764445d792c3da)]:
  - @sl-design-system/shared@0.2.8

## 0.0.11

### Patch Changes

- Updated dependencies [[`38b0ca4`](https://github.com/sl-design-system/components/commit/38b0ca4d72014605418639b69410863eb8e231ad)]:
  - @sl-design-system/shared@0.2.7

## 0.0.10

### Patch Changes

- [#1026](https://github.com/sl-design-system/components/pull/1026) [`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b) - Linting fixes for styling

## 0.0.9

### Patch Changes

- [#1018](https://github.com/sl-design-system/components/pull/1018) [`aaa09ff`](https://github.com/sl-design-system/components/commit/aaa09ffb78db9df6298ce77d51a79b7aed213e59) - Fix 3rd party dependencies to be peerDependencies instead

- [#995](https://github.com/sl-design-system/components/pull/995) [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5) - Linting fixes due to new eslint configuration

- Updated dependencies [[`aaa09ff`](https://github.com/sl-design-system/components/commit/aaa09ffb78db9df6298ce77d51a79b7aed213e59), [`12b0477`](https://github.com/sl-design-system/components/commit/12b0477da1f7ce615269b228a6fceb7cb8c6b4f5)]:
  - @sl-design-system/shared@0.2.6

## 0.0.8

### Patch Changes

- Updated dependencies [[`dbc032b`](https://github.com/sl-design-system/components/commit/dbc032b3a7587dfcbdb6a2118330b039765cf0fb), [`5da216b`](https://github.com/sl-design-system/components/commit/5da216b3713c328eba06113d77d642462e1f05fc)]:
  - @sl-design-system/shared@0.2.5

## 0.0.7

### Patch Changes

- Updated dependencies [[`216d62e`](https://github.com/sl-design-system/components/commit/216d62eb5a16277b4ea2767ea0530e570bf40abf), [`216d62e`](https://github.com/sl-design-system/components/commit/216d62eb5a16277b4ea2767ea0530e570bf40abf)]:
  - @sl-design-system/shared@0.2.4

## 0.0.6

### Patch Changes

- Updated dependencies [[`afc3d60`](https://github.com/sl-design-system/components/commit/afc3d606c20409b4ad2d589ffc0b899d3f853997)]:
  - @sl-design-system/shared@0.2.3

## 0.0.5

### Patch Changes

- [#925](https://github.com/sl-design-system/components/pull/925) [`2aff1dd`](https://github.com/sl-design-system/components/commit/2aff1dd7aa946cb2ee998d7d121ab585ca9ad39b) - Bump Lit and related dependencies

- Updated dependencies [[`06cfb6b`](https://github.com/sl-design-system/components/commit/06cfb6bff8f2c1a8d4a132099f21f2e8dc4f2461), [`9320cbc`](https://github.com/sl-design-system/components/commit/9320cbc446e479435860ad5f9756725b36acf764), [`2aff1dd`](https://github.com/sl-design-system/components/commit/2aff1dd7aa946cb2ee998d7d121ab585ca9ad39b)]:
  - @sl-design-system/shared@0.2.2

## 0.0.4

### Patch Changes

- [#894](https://github.com/sl-design-system/components/pull/894) [`a37667e`](https://github.com/sl-design-system/components/commit/a37667eb4478da696595fdda618b86d15262f60a) - Add support for async validation

- [#888](https://github.com/sl-design-system/components/pull/888) [`b8e7589`](https://github.com/sl-design-system/components/commit/b8e7589f88f447b6e1ee05bbbd0847425f1fcef2) - Fix optional/required label mark

## 0.0.3

### Patch Changes

- [#802](https://github.com/sl-design-system/components/pull/802) [`988e936`](https://github.com/sl-design-system/components/commit/988e936fabc65fb2b6cb83f5df7b6b7035280f2f) - New form-field component

- [#862](https://github.com/sl-design-system/components/pull/862) [`d881d5f`](https://github.com/sl-design-system/components/commit/d881d5fc5274be5275f910f445a16408d6bb2373) - Fix all form control validations to use i18n correctly

- [#861](https://github.com/sl-design-system/components/pull/861) [`416a4bd`](https://github.com/sl-design-system/components/commit/416a4bdc49dd334d4a3c89c4697e9f69f22bf84b) - Fix builtin vs custom validation behavior

  This add a new `sl-validate` event that is fired when the validity of the form control is updated. It fires _after_ any builtin validation has been performed, so it can be used to override the validity of the control.

- [#842](https://github.com/sl-design-system/components/pull/842) [`bde9afa`](https://github.com/sl-design-system/components/commit/bde9afa06833adf91122df3960d04db6cb34d536) - Improve and unify `show-validity` behavior

- [#872](https://github.com/sl-design-system/components/pull/872) [`da5784c`](https://github.com/sl-design-system/components/commit/da5784ca4aec18bdd1b5326274e59e803d7859ec) - Unify form values for all controls

- Updated dependencies [[`b507ee0`](https://github.com/sl-design-system/components/commit/b507ee07e119733d285a348e74f34c4b2d172902), [`d881d5f`](https://github.com/sl-design-system/components/commit/d881d5fc5274be5275f910f445a16408d6bb2373)]:
  - @sl-design-system/shared@0.2.1

## 0.0.2

### Patch Changes

- Updated dependencies [[`198c7c2`](https://github.com/sl-design-system/components/commit/198c7c277787d48276d402522f94f2d0d5132152), [`b3f9d42`](https://github.com/sl-design-system/components/commit/b3f9d42945c7b427105353ede3cf74ba3191792d)]:
  - @sl-design-system/shared@0.2.0

## 0.0.1

### Patch Changes

- [#705](https://github.com/sl-design-system/components/pull/705) [`5883fee`](https://github.com/sl-design-system/components/commit/5883fee3bb584130e5cd0009b7a2ed9b45d124af) - New form package with updated text field

- [#713](https://github.com/sl-design-system/components/pull/713) [`1be481a`](https://github.com/sl-design-system/components/commit/1be481aa6b300d50ddcf9a36b7e2d14942baaef7) - Move label component to form package

- Updated dependencies [[`45bff4d`](https://github.com/sl-design-system/components/commit/45bff4d60a32f4d46d8c9c99200efeaa1be6a2f0), [`199a2fc`](https://github.com/sl-design-system/components/commit/199a2fc0b3f0efb54c06429fd91fa09071b337de), [`a816bfe`](https://github.com/sl-design-system/components/commit/a816bfec8e3459cc3b12def88922a421345768f0)]:
  - @sl-design-system/shared@0.1.9
