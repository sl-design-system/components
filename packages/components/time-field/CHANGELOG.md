# @sl-design-system/time-field

## 0.3.1

### Patch Changes

- [#3694](https://github.com/sl-design-system/components/pull/3694) [`9417d4a`](https://github.com/sl-design-system/components/commit/9417d4ab0e2f0a2df800db4be713bc4cb7c299c3) - Fix published imports to resolve built JavaScript and type declarations by default, while preserving local source imports through a custom export condition.

- Updated dependencies [[`9417d4a`](https://github.com/sl-design-system/components/commit/9417d4ab0e2f0a2df800db4be713bc4cb7c299c3)]:
  - @sl-design-system/form@1.5.1
  - @sl-design-system/icon@1.4.5
  - @sl-design-system/listbox@0.2.3
  - @sl-design-system/shared@0.14.1
  - @sl-design-system/text-field@1.7.2

## 0.3.0

### Minor Changes

- [#3612](https://github.com/sl-design-system/components/pull/3612) [`1f40a9f`](https://github.com/sl-design-system/components/commit/1f40a9f5df96aa267ad2a9e4b84560baafda9707) - These components use the new `ElementInternalsMixin` for their `ElementInternals`. The `internals`
  property has been renamed to `elementInternals`. The old `internals` property is still available as
  a deprecated alias, so this is not a breaking change, but you should update your code, for example
  in tests, to use `elementInternals` instead. Reading `internals` logs a deprecation warning to the
  console in development builds.

### Patch Changes

- [#3571](https://github.com/sl-design-system/components/pull/3571) [`07bc4e5`](https://github.com/sl-design-system/components/commit/07bc4e59839582242bda1dddbea1dda5cd404652) - Build the package with tsdown

  The build has moved from esbuild to [tsdown](https://tsdown.dev). The public API is unchanged, but the published layout is different: compiled output now lives in `dist/` instead of the package root, and the package is resolved entirely through `exports`. The `main`, `module` and `types` fields have been dropped, since `exports` already points at both the JavaScript and, alongside it, the type declarations.

  Bundlers and TypeScript setups that understand `exports` (`moduleResolution: bundler`, `node16` or `nodenext`) need no changes.

- [#3612](https://github.com/sl-design-system/components/pull/3612) [`1f40a9f`](https://github.com/sl-design-system/components/commit/1f40a9f5df96aa267ad2a9e4b84560baafda9707) - Use the `@cssState` decorator for the remaining custom CSS states

  The `has-value` state on `sl-time-field` was documented and styled, but never actually set, so a
  time field with a value rendered it in the muted placeholder color instead of
  `--sl-color-foreground-plain`. It is now set from the `value` accessor, matching `sl-date-field`.

  The `has-focus` (time field) and `focus-visible` (tag) states are now declared with `@cssState`
  instead of being added and removed by hand. These states are applied when the component updates
  rather than synchronously, which is still before the browser paints.

- [#3571](https://github.com/sl-design-system/components/pull/3571) [`07bc4e5`](https://github.com/sl-design-system/components/commit/07bc4e59839582242bda1dddbea1dda5cd404652) - Declare dependencies that were previously missing from `package.json`

  These packages imported modules they never declared, relying on those packages happening to be present in the monorepo's hoisted `node_modules`. That works inside this repository, but it leaves consumers to install the transitive dependencies themselves, and it breaks under strict installers such as pnpm or Yarn PnP.

  Newly declared runtime dependencies:

  - `calendar`, `combobox`, `listbox`, `message-dialog`, `time-field` → `@sl-design-system/shared`
  - `card` → `@sl-design-system/menu`, `@sl-design-system/toggle-button`
  - `emoji` → `@sl-design-system/search-field`, `@sl-design-system/tabs`
  - `form` → `@sl-design-system/icon`
  - `paginator` → `@sl-design-system/data-source`, `@sl-design-system/listbox`
  - `panel`, `toggle-button` → `@sl-design-system/button`
  - `tree` → `@sl-design-system/menu`

  Newly declared peer dependencies:

  - `card`, `checkbox`, `editor`, `radio-group`, `toggle-group` → `@open-wc/scoped-elements`
  - `text-area`, `time-field`, `tree` → `@lit/localize`
  - `paginator` → `lit`

  Existing dependency ranges were also brought up to date: `editor` on `@sl-design-system/form` and `@sl-design-system/shared`, `emoji` and `form` on `@sl-design-system/shared`, and `tree` on `@sl-design-system/skeleton`.

- Updated dependencies [[`07bc4e5`](https://github.com/sl-design-system/components/commit/07bc4e59839582242bda1dddbea1dda5cd404652), [`4059835`](https://github.com/sl-design-system/components/commit/405983528dd1437f08ef23ffe095d2da740ba3dd), [`4059835`](https://github.com/sl-design-system/components/commit/405983528dd1437f08ef23ffe095d2da740ba3dd), [`1f40a9f`](https://github.com/sl-design-system/components/commit/1f40a9f5df96aa267ad2a9e4b84560baafda9707), [`1f40a9f`](https://github.com/sl-design-system/components/commit/1f40a9f5df96aa267ad2a9e4b84560baafda9707), [`1f40a9f`](https://github.com/sl-design-system/components/commit/1f40a9f5df96aa267ad2a9e4b84560baafda9707), [`07bc4e5`](https://github.com/sl-design-system/components/commit/07bc4e59839582242bda1dddbea1dda5cd404652), [`07bc4e5`](https://github.com/sl-design-system/components/commit/07bc4e59839582242bda1dddbea1dda5cd404652)]:
  - @sl-design-system/form@1.5.0
  - @sl-design-system/icon@1.4.4
  - @sl-design-system/listbox@0.2.2
  - @sl-design-system/shared@0.14.0
  - @sl-design-system/text-field@1.7.1

## 0.2.0

### Minor Changes

- [#3594](https://github.com/sl-design-system/components/pull/3594) [`05b9cfb`](https://github.com/sl-design-system/components/commit/05b9cfbf3e7149b6258a8f11519425fabeb60c60) - A new `shape` property that defaults to `rect` but also accepts `pill` for rounded corners.
  A new `size` property that defaults to `md` but also accepts `lg`.
  New styling of the field button.

### Patch Changes

- Updated dependencies [[`05b9cfb`](https://github.com/sl-design-system/components/commit/05b9cfbf3e7149b6258a8f11519425fabeb60c60)]:
  - @sl-design-system/text-field@1.7.0
  - @sl-design-system/form@1.4.3

## 0.1.3

### Patch Changes

- [#3499](https://github.com/sl-design-system/components/pull/3499) [`8e583d9`](https://github.com/sl-design-system/components/commit/8e583d9894ad680f4a7141a9c9b03bd999993d3b) - Changed the token used in the selected state of the hour and minute options

- Updated dependencies [[`ab43bd7`](https://github.com/sl-design-system/components/commit/ab43bd715bfb51b1a007bf2acb87e7061ae8ad19), [`c7efbd2`](https://github.com/sl-design-system/components/commit/c7efbd275e4638d5e94daa5d1a46fba73711f340), [`289ea43`](https://github.com/sl-design-system/components/commit/289ea4305ee138d52fe9007a6836df013402120e)]:
  - @sl-design-system/icon@1.4.3
  - @sl-design-system/listbox@0.2.1

## 0.1.2

### Patch Changes

- [#3448](https://github.com/sl-design-system/components/pull/3448) [`14ea88b`](https://github.com/sl-design-system/components/commit/14ea88b50c33027cc6b80ad93321b7911d3284f6) - Update `@open-wc/scoped-elements` due to typing fix

  This update fixes the export of the typings, which causes errors due to missing `override` keywords in the components. This is a patch update, as it only contains a fix for the export of the typings and does not introduce any breaking changes.

- Updated dependencies [[`14ea88b`](https://github.com/sl-design-system/components/commit/14ea88b50c33027cc6b80ad93321b7911d3284f6), [`7d96c3a`](https://github.com/sl-design-system/components/commit/7d96c3aebdc8922f0b031f2ea84aa04c12db2c59), [`d968f3e`](https://github.com/sl-design-system/components/commit/d968f3ed2c3601aaed68352feb1147f2ead35499)]:
  - @sl-design-system/text-field@1.6.11
  - @sl-design-system/listbox@0.2.0
  - @sl-design-system/form@1.4.2

## 0.1.1

### Patch Changes

- [#3123](https://github.com/sl-design-system/components/pull/3123) [`5d4d740`](https://github.com/sl-design-system/components/commit/5d4d740e249baa31f8dfe27055faeb8c56c8d21e) - Improved focus handling; clicking on the associated label works and the focus state when navigating to the chooser-button is improved

- [#3077](https://github.com/sl-design-system/components/pull/3077) [`03d369c`](https://github.com/sl-design-system/components/commit/03d369cfb7fccd00ee0d4572b854213df138b1dd) - Changed the internal working of the input to better support assistive technology (it now uses spin-buttons). The arrow up and down keys in the input field now use the same step as is shown for hours and minutes in the dropdown.

- Updated dependencies [[`99c1464`](https://github.com/sl-design-system/components/commit/99c1464e46f0f6c2f17d7d8ccd62f58bacaceeb3)]:
  - @sl-design-system/form@1.3.6
  - @sl-design-system/text-field@1.6.9

## 0.1.0

### Minor Changes

- [#2955](https://github.com/sl-design-system/components/pull/2955) [`ed7376b`](https://github.com/sl-design-system/components/commit/ed7376b4aa21c5df7d50119d839000abbab1cbcf) - Fix `time-field` to work properly with `min` and/or `max` constraints. Disable minutes that are out of range.

### Patch Changes

- [#3055](https://github.com/sl-design-system/components/pull/3055) [`5616832`](https://github.com/sl-design-system/components/commit/561683221a54010ff326b449468769597e22fb10) - Improved label for dropdown toggle button

- [#3061](https://github.com/sl-design-system/components/pull/3061) [`be0e099`](https://github.com/sl-design-system/components/commit/be0e0996c91a261fd8de5f8701d084268929fc17) - Accessibility improvements - fix focus management when the time picker dialog closes: the dialog now properly closes when focus leaves the component, Tab moves focus to the next focusable element outside the component, Shift+Tab moves focus to the clock button, and Escape or selecting a value restores focus to the text field.

- [#3091](https://github.com/sl-design-system/components/pull/3091) [`ddf0175`](https://github.com/sl-design-system/components/commit/ddf0175ec6f60add915c485e45c77511cf4c4664) - Change color token to --sl-color-foreground-plain in the timefield's dialog

- [#2954](https://github.com/sl-design-system/components/pull/2954) [`49eab13`](https://github.com/sl-design-system/components/commit/49eab1323d08cb12f995d20845391009cdb4217d) - Propagate `lang` attribute to the internal input element to improve screen reader accessibility for localized time formats.

- Updated dependencies [[`330e06f`](https://github.com/sl-design-system/components/commit/330e06ff36c7a5c96cf313b60a5013d6307477c7), [`ed7376b`](https://github.com/sl-design-system/components/commit/ed7376b4aa21c5df7d50119d839000abbab1cbcf), [`ae8b9da`](https://github.com/sl-design-system/components/commit/ae8b9da97d3e5adc0a9ecb8feabec67699893bcc)]:
  - @sl-design-system/icon@1.4.2
  - @sl-design-system/form@1.3.5
  - @sl-design-system/text-field@1.6.8

## 0.0.2

### Patch Changes

- [#2824](https://github.com/sl-design-system/components/pull/2824) [`ff5b844`](https://github.com/sl-design-system/components/commit/ff5b8447d854505f9d8619f2d7489d909dd757d0) - Multiple fixes:

  - For `required` time-field, native validation message is now used. The custom message "Please enter a time." appears only when the entered value is not a valid time.
  - Fixed an issue where the dialog time picker value did not update when the user typed a new value.

- [#2802](https://github.com/sl-design-system/components/pull/2802) [`c8eab5b`](https://github.com/sl-design-system/components/commit/c8eab5b28863fa41981a6e9f7e7caa7db5766ba0) - Fixes toggling time picker when clicking on the clock button.

- Updated dependencies [[`f676dd5`](https://github.com/sl-design-system/components/commit/f676dd52c83ef2f3429d9a393b5ec634fc05bf0e), [`d807cb2`](https://github.com/sl-design-system/components/commit/d807cb22702dc5ac1399cf0528f9ceeeb1f09f60)]:
  - @sl-design-system/icon@1.4.1

## 0.0.1

### Patch Changes

- [#2618](https://github.com/sl-design-system/components/pull/2618) [`1115612`](https://github.com/sl-design-system/components/commit/1115612e1fdf4ee38d9e484e92cc324e767f0e56) - New component

- Updated dependencies [[`09a1533`](https://github.com/sl-design-system/components/commit/09a1533558b2e16baa0d118b8348ee444e169854), [`c76f3c8`](https://github.com/sl-design-system/components/commit/c76f3c86cc289be16bdf7ad4ec09baf910d67361), [`e2543df`](https://github.com/sl-design-system/components/commit/e2543df011b9d65b8e11a07323b3712f52859e0e)]:
  - @sl-design-system/form@1.3.1
  - @sl-design-system/icon@1.3.1
