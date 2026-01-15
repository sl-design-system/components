# @sl-design-system/angular

## 4.0.1

### Patch Changes

- [#2831](https://github.com/sl-design-system/components/pull/2831) [`6ebd73f`](https://github.com/sl-design-system/components/commit/6ebd73f8ccdba56be970ce5ab60a725a50d16000) - Changed the filename for combobox and added it to the list of exported components in the public api

- Updated dependencies [[`7f4bce7`](https://github.com/sl-design-system/components/commit/7f4bce770a362d17ea3465219a4f8f6a1bfbdb13)]:
  - @sl-design-system/text-area@1.1.5

## 4.0.0

### Major Changes

- [#2865](https://github.com/sl-design-system/components/pull/2865) [`d354e0d`](https://github.com/sl-design-system/components/commit/d354e0d89aca54203b509cab75f67de4f9475ee6) - - **IMPORTANT**: This version adds support for Angular 21 and requires:
  - Angular 19.0 or higher (tested with Angular 21.0) This means that support for Angular 18 is removed.
  - TypeScript 5.9.0 or higher
  - If upgrading from an older version, ensure your application meets these requirements

### Patch Changes

- Updated dependencies [[`f676dd5`](https://github.com/sl-design-system/components/commit/f676dd52c83ef2f3429d9a393b5ec634fc05bf0e), [`39b286c`](https://github.com/sl-design-system/components/commit/39b286c8937f2f9d8339864d44a1c666e50ec6ea), [`ff5b844`](https://github.com/sl-design-system/components/commit/ff5b8447d854505f9d8619f2d7489d909dd757d0), [`d807cb2`](https://github.com/sl-design-system/components/commit/d807cb22702dc5ac1399cf0528f9ceeeb1f09f60), [`c8eab5b`](https://github.com/sl-design-system/components/commit/c8eab5b28863fa41981a6e9f7e7caa7db5766ba0)]:
  - @sl-design-system/icon@1.4.1
  - @sl-design-system/select@2.1.0
  - @sl-design-system/time-field@0.0.2

## 3.4.0

### Minor Changes

- [#2618](https://github.com/sl-design-system/components/pull/2618) [`1115612`](https://github.com/sl-design-system/components/commit/1115612e1fdf4ee38d9e484e92cc324e767f0e56) - Add support for `<sl-time-field>`:
  - Added `TimeFieldDirective` to handle form binding
  - Added `TimeFieldComponent` wrapper around `<sl-time-field>`

### Patch Changes

- Updated dependencies [[`1115612`](https://github.com/sl-design-system/components/commit/1115612e1fdf4ee38d9e484e92cc324e767f0e56), [`09a1533`](https://github.com/sl-design-system/components/commit/09a1533558b2e16baa0d118b8348ee444e169854), [`1115612`](https://github.com/sl-design-system/components/commit/1115612e1fdf4ee38d9e484e92cc324e767f0e56), [`c76f3c8`](https://github.com/sl-design-system/components/commit/c76f3c86cc289be16bdf7ad4ec09baf910d67361), [`61989c4`](https://github.com/sl-design-system/components/commit/61989c46d7592bad8e48e6e29866a87ed222a229), [`e2543df`](https://github.com/sl-design-system/components/commit/e2543df011b9d65b8e11a07323b3712f52859e0e)]:
  - @sl-design-system/locales@0.1.0
  - @sl-design-system/form@1.3.1
  - @sl-design-system/time-field@0.0.1
  - @sl-design-system/icon@1.3.1
  - @sl-design-system/checkbox@2.1.6

## 3.3.0

### Minor Changes

- [#2615](https://github.com/sl-design-system/components/pull/2615) [`e5fa66b`](https://github.com/sl-design-system/components/commit/e5fa66b00e9b89445a724890e28e6ba12dc19b92) - Add `ComboboxDirective` to forms

- [#2512](https://github.com/sl-design-system/components/pull/2512) [`fcc7864`](https://github.com/sl-design-system/components/commit/fcc786484858d74bd8c93a40a6bb10b5f2d7664d) - - Add explicit `markForChanges()` to all `ControlValueAccessor` directives
  - Add support for the `<sl-number-field>` component:
    - Added `NumberFieldComponent` for exposing the web component API within Angular
    - Added `NumberFieldDirective` for Angular form integration

  The above work the same as the existing bindings (for `<sl-text-field>` for example).

### Patch Changes

- [#2447](https://github.com/sl-design-system/components/pull/2447) [`501a119`](https://github.com/sl-design-system/components/commit/501a1195d8d4cdb0d1a85b1fee1e4d2d7b36c41a) - Added missing peer dependencies: `dialog` and `tooltip`.

- Updated dependencies [[`0b48907`](https://github.com/sl-design-system/components/commit/0b48907b54289cbfd37266d870a42baba071ba1a), [`17fbc40`](https://github.com/sl-design-system/components/commit/17fbc404a27bada6a5013c84c34a2936de604f16), [`0c4f19b`](https://github.com/sl-design-system/components/commit/0c4f19beb6f66b6cba944c6bc4589252113554fb), [`0b48907`](https://github.com/sl-design-system/components/commit/0b48907b54289cbfd37266d870a42baba071ba1a), [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68), [`0b48907`](https://github.com/sl-design-system/components/commit/0b48907b54289cbfd37266d870a42baba071ba1a), [`17fbc40`](https://github.com/sl-design-system/components/commit/17fbc404a27bada6a5013c84c34a2936de604f16), [`29f38d4`](https://github.com/sl-design-system/components/commit/29f38d4a44003f63e20965ed176dfa9bc16851e7), [`0e2e426`](https://github.com/sl-design-system/components/commit/0e2e426041997a299f3e35bcde499909d62f7ce9), [`0b48907`](https://github.com/sl-design-system/components/commit/0b48907b54289cbfd37266d870a42baba071ba1a), [`5db3329`](https://github.com/sl-design-system/components/commit/5db33293ac0ac53dcb13c607a4df76500eca7141), [`e5fa66b`](https://github.com/sl-design-system/components/commit/e5fa66b00e9b89445a724890e28e6ba12dc19b92), [`588dae3`](https://github.com/sl-design-system/components/commit/588dae331fdc6ee20ea1ac25dd020070e2f3e694)]:
  - @sl-design-system/select@2.0.5
  - @sl-design-system/combobox@0.1.5
  - @sl-design-system/radio-group@1.1.5
  - @sl-design-system/text-field@1.6.6
  - @sl-design-system/text-area@1.1.4
  - @sl-design-system/checkbox@2.1.5
  - @sl-design-system/switch@1.1.5
  - @sl-design-system/form@1.3.0
  - @sl-design-system/number-field@0.1.5
  - @sl-design-system/icon@1.3.0

## 3.2.0

### Minor Changes

- [#2071](https://github.com/sl-design-system/components/pull/2071) [`9c6c5f0`](https://github.com/sl-design-system/components/commit/9c6c5f0cd9886f085af188e41f9a941c292aed92) - Add new `DialogService` that can be used for opening (by passing a component reference) and managing dialogs in Angular apps. Provides methods to show dialogs with custom components, pass data, and handle dialog lifecycle events. Tracks all opened dialogs and allows closing them programmatically.

### Patch Changes

- Updated dependencies [[`e973712`](https://github.com/sl-design-system/components/commit/e973712439e562714aa0dfe427f88288a8ab78eb), [`ea31f40`](https://github.com/sl-design-system/components/commit/ea31f4082be6b0ae423e0feded698f679046f7b9), [`5748337`](https://github.com/sl-design-system/components/commit/574833761ff5d1965f21ded94c26f1ff42272420), [`7371487`](https://github.com/sl-design-system/components/commit/7371487bd75cfceca454c243d199c572378d726f), [`919f116`](https://github.com/sl-design-system/components/commit/919f1168712569c5022a4ad6840fbce692ce6ea0)]:
  - @sl-design-system/icon@1.2.1
  - @sl-design-system/radio-group@1.1.4
  - @sl-design-system/form@1.2.4
  - @sl-design-system/text-field@1.6.5

## 3.1.0

### Minor Changes

- [#2080](https://github.com/sl-design-system/components/pull/2080) [`5dd2eac`](https://github.com/sl-design-system/components/commit/5dd2eacbf7e623455ff8e8f0ac4fc1d07798f34e) - Add support for Angular 20

### Patch Changes

- Updated dependencies [[`4a6f8ba`](https://github.com/sl-design-system/components/commit/4a6f8ba02f49e8be7b37028c9b6a558ad91d9664), [`4a6f8ba`](https://github.com/sl-design-system/components/commit/4a6f8ba02f49e8be7b37028c9b6a558ad91d9664), [`4a6f8ba`](https://github.com/sl-design-system/components/commit/4a6f8ba02f49e8be7b37028c9b6a558ad91d9664), [`b411a41`](https://github.com/sl-design-system/components/commit/b411a415b496b0ca15677b58ca41c7d770833b6e), [`a343e29`](https://github.com/sl-design-system/components/commit/a343e298d6b65966e04b3fbfc3598305a29bf1cc), [`d115aa5`](https://github.com/sl-design-system/components/commit/d115aa5a81b8b09ed29e5ad8b47385447ace43d0), [`094e4c7`](https://github.com/sl-design-system/components/commit/094e4c7d9e975e7e7a2d28e80d1c6980786492da)]:
  - @sl-design-system/locales@0.0.13
  - @sl-design-system/select@2.0.4
  - @sl-design-system/checkbox@2.1.4
  - @sl-design-system/form@1.2.3
  - @sl-design-system/radio-group@1.1.3
  - @sl-design-system/text-area@1.1.3
  - @sl-design-system/text-field@1.6.4
  - @sl-design-system/switch@1.1.4

## 3.0.0

### Major Changes

- [#1682](https://github.com/sl-design-system/components/pull/1682) [`edbc0e4`](https://github.com/sl-design-system/components/commit/edbc0e49ffef09a55248e68f783a6c5a2f1cd44b) - Upgrade to Angular 18 and drop support for 17

### Minor Changes

- [#1794](https://github.com/sl-design-system/components/pull/1794) [`e0b5ae4`](https://github.com/sl-design-system/components/commit/e0b5ae44fd61afd603927522fc8024c6ae7829bb) - Replace `<sl-select-option>` with `<sl-option>`

## 2.0.0

### Major Changes

- [#1456](https://github.com/sl-design-system/components/pull/1456) [`347418f`](https://github.com/sl-design-system/components/commit/347418fa98477365f5bc0aef1c70c9da4579f2a4) - BREAKING: Split entrypoints

  This change splits the wrappers for each web component package into their own secondary entrypoints.

  Before: `import { ButtonComponent } from '@sl-design-system/angular';`

  After: `import { ButtonComponent } from '@sl-design-system/angular/button';`

  This also moves the form bindings to `@sl-design-system/angular/forms`.

  This change is necessary to allow you to pick-and-choose which components you want to use in your application. This is a workaround because Angular creates Flattened ESM (FESM) bundles which include all components in a single file. This requires users to include _all_ web components in their application, even if they only use one.

### Patch Changes

- [#1446](https://github.com/sl-design-system/components/pull/1446) [`5dab445`](https://github.com/sl-design-system/components/commit/5dab445f7f4fee90b27b7142dfaa493baa278cb0) - Fix incorrect Angular dependencies to be on 17 or 18

- [#1479](https://github.com/sl-design-system/components/pull/1479) [`5c4063e`](https://github.com/sl-design-system/components/commit/5c4063ed63560ca3e07940492653d23a4ec009d8) - Add proper tooltip cleanup

## 1.0.1

### Patch Changes

- [#1296](https://github.com/sl-design-system/components/pull/1296) [`39a4cb2`](https://github.com/sl-design-system/components/commit/39a4cb206ad923862c902b3ac7dddd4ae5b87746) - Update to use the new TextField generic type

## 1.0.0

### Major Changes

- [#1281](https://github.com/sl-design-system/components/pull/1281) [`c4012af`](https://github.com/sl-design-system/components/commit/c4012af75faaec57e3a1dc5d7f2e8205ce1d3805) - First stable release

### Minor Changes

- [#1248](https://github.com/sl-design-system/components/pull/1248) [`fdf9a90`](https://github.com/sl-design-system/components/commit/fdf9a90e4621fb9c865ee307b9abd29ff03722ca) - Rename `<sl-textarea>` to `<sl-text-area>` to match `<sl-text-field>`

## 0.2.0

### Minor Changes

- [#1210](https://github.com/sl-design-system/components/pull/1210) [`c3c9de6`](https://github.com/sl-design-system/components/commit/c3c9de6590f5abd1d8010186df127a665ee303b5) - Various improvements:
  - Remove the `FormsModule` and make all form directives standalone

  This is a breaking change and the reason for the minor version bump. If you are using the `FormsModule` in
  your Angular app, you will need to remove it and import the form directives you are using individually.
  - Generate Angular wrappers for all public web components

  This will make it easier to use the components in Angular apps. You only need to import a specific component
  to be able to get Angular bindings and type safety. This also removes the need for specifying the `CUSTOM_ELEMENTS_SCHEMA`
  everywhere.
  - Add `slTooltip` directive for ease-of-use in Angular

  This is syntactic sugar for the `sl-tooltip` web component. It allows you to use the `slTooltip` directive on any
  element by passing in the tooltip content as an input.

## 0.1.7

### Patch Changes

- [#1185](https://github.com/sl-design-system/components/pull/1185) [`d377313`](https://github.com/sl-design-system/components/commit/d377313f5e5a9c3b3931732a5aa0f598ceabb29d) - Update dependencies

- [#1194](https://github.com/sl-design-system/components/pull/1194) [`244d50f`](https://github.com/sl-design-system/components/commit/244d50f46ee4c87aab26e167c8ca5b200c1d30c2) - Fix missing dependencies on web components

## 0.1.6

### Patch Changes

- [#1078](https://github.com/sl-design-system/components/pull/1078) [`c682819`](https://github.com/sl-design-system/components/commit/c68281990d696106c99df9aed579ab316e6c7ec9) - Updated Angular peerDependencies

## 0.1.5

### Patch Changes

- [#1026](https://github.com/sl-design-system/components/pull/1026) [`10c0cab`](https://github.com/sl-design-system/components/commit/10c0cabf69a1c2561a3ce459ed0ac67c7ae1bd6b) - Bump dependencies

## 0.1.4

### Patch Changes

- [#937](https://github.com/sl-design-system/components/pull/937) [`e4e94cb`](https://github.com/sl-design-system/components/commit/e4e94cbae85ef09c029920db0cb0ac9c92939097) - Bump minor angular version

## 0.1.3

### Patch Changes

- [#900](https://github.com/sl-design-system/components/pull/900) [`cf53c91`](https://github.com/sl-design-system/components/commit/cf53c91431aa014d9345a99a8c2a5f803d2c0f10) - Fix version not updating during release

## 0.1.2

### Patch Changes

- [#898](https://github.com/sl-design-system/components/pull/898) [`d572bb6`](https://github.com/sl-design-system/components/commit/d572bb663a2225608e435638b23047b6750fbd2f) - Bump version to fix release process

## 0.1.1

### Patch Changes

- [#872](https://github.com/sl-design-system/components/pull/872) [`da5784c`](https://github.com/sl-design-system/components/commit/da5784ca4aec18bdd1b5326274e59e803d7859ec) - Add form control directives for select and switch

- [#872](https://github.com/sl-design-system/components/pull/872) [`da5784c`](https://github.com/sl-design-system/components/commit/da5784ca4aec18bdd1b5326274e59e803d7859ec) - Refactor project setup
