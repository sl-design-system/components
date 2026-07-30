# @sl-design-system/listbox

## 0.2.1

### Patch Changes

- [#3494](https://github.com/sl-design-system/components/pull/3494) [`289ea43`](https://github.com/sl-design-system/components/commit/289ea4305ee138d52fe9007a6836df013402120e) - Prevent unstable scrolling in virtualized listboxes by disabling scroll anchoring and containing overscroll on the listbox host. This fixes cases where small touchpad scrolls could keep snapping the rendered range back to the same option, and prevents wheel scrolling at list boundaries from scrolling the underlying page.

- Updated dependencies [[`31092f3`](https://github.com/sl-design-system/components/commit/31092f3f6405344998dac94b5dbd70dc917c45da), [`ab43bd7`](https://github.com/sl-design-system/components/commit/ab43bd715bfb51b1a007bf2acb87e7061ae8ad19), [`c7efbd2`](https://github.com/sl-design-system/components/commit/c7efbd275e4638d5e94daa5d1a46fba73711f340)]:
  - @sl-design-system/virtual-list@0.1.1
  - @sl-design-system/icon@1.4.3

## 0.2.0

### Minor Changes

- [#3409](https://github.com/sl-design-system/components/pull/3409) [`7d96c3a`](https://github.com/sl-design-system/components/commit/7d96c3aebdc8922f0b031f2ea84aa04c12db2c59) - Add virtual list support for improved performance with large option lists

  The listbox component now uses the virtual-list component for efficient rendering of large lists. This provides better performance and smoother scrolling when dealing with many options.

  - Integrated virtual-list component for virtualization
  - Improved scrolling behavior and item visibility
  - Added support for CSS max-height constraints with virtual lists

### Patch Changes

- [#3448](https://github.com/sl-design-system/components/pull/3448) [`14ea88b`](https://github.com/sl-design-system/components/commit/14ea88b50c33027cc6b80ad93321b7911d3284f6) - Update `@open-wc/scoped-elements` due to typing fix

  This update fixes the export of the typings, which causes errors due to missing `override` keywords in the components. This is a patch update, as it only contains a fix for the export of the typings and does not introduce any breaking changes.

- [#3432](https://github.com/sl-design-system/components/pull/3432) [`d968f3e`](https://github.com/sl-design-system/components/commit/d968f3ed2c3601aaed68352feb1147f2ead35499) - Accessibility improvements for listbox screen reader support

  - Always set `aria-selected` on options, including grouped options in the selected group
  - Set correct `aria-posinset` and `aria-setsize` on virtualized options, excluding group headers from the count
  - Add group label context to the accessible name of grouped options for Safari/VoiceOver compatibility

- Updated dependencies [[`7d96c3a`](https://github.com/sl-design-system/components/commit/7d96c3aebdc8922f0b031f2ea84aa04c12db2c59)]:
  - @sl-design-system/virtual-list@0.1.0

## 0.1.7

### Patch Changes

- [#3297](https://github.com/sl-design-system/components/pull/3297) [`5592e42`](https://github.com/sl-design-system/components/commit/5592e4221c4cb279449ec450624d26796ecc5f4a) - Align options and group styling with Figma.

## 0.1.6

### Patch Changes

- [#2789](https://github.com/sl-design-system/components/pull/2789) [`063faff`](https://github.com/sl-design-system/components/commit/063faff05434c2e0dae8176d7ebe5f9b4562492f) - Fix issue with cloning of selected option due to unexpected `<style>` element

- Updated dependencies [[`1e7b6f6`](https://github.com/sl-design-system/components/commit/1e7b6f629f79d77576c2cb19d20f8884bb2f30c4)]:
  - @sl-design-system/icon@1.4.0

## 0.1.5

### Patch Changes

- [#2624](https://github.com/sl-design-system/components/pull/2624) [`6e34fcb`](https://github.com/sl-design-system/components/commit/6e34fcbb1884ab75574b5145560e959dc9ab53f8) - - Adds missing divider between groups and options,
  - Fixes rendering `sl-option-group-header` only when the label attribute is set.

## 0.1.4

### Patch Changes

- [#2547](https://github.com/sl-design-system/components/pull/2547) [`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68) - Bump patch version of `@open-wc/scoped-elements` peer dependency

- Updated dependencies [[`8f29a45`](https://github.com/sl-design-system/components/commit/8f29a4527d8fbe2bace08e32e31ba93aee0baf68), [`29f38d4`](https://github.com/sl-design-system/components/commit/29f38d4a44003f63e20965ed176dfa9bc16851e7)]:
  - @sl-design-system/icon@1.3.0

## 0.1.3

### Patch Changes

- [#2037](https://github.com/sl-design-system/components/pull/2037) [`094e4c7`](https://github.com/sl-design-system/components/commit/094e4c7d9e975e7e7a2d28e80d1c6980786492da) - Added overflow-wrap to force words to break when options are shown in a very narrow container.

## 0.1.2

### Patch Changes

- [#2005](https://github.com/sl-design-system/components/pull/2005) [`fc934eb`](https://github.com/sl-design-system/components/commit/fc934eba9f2049fda27d1e3f7c879789eea6254c) - Fix `@lit-labs/lit-virtualizer` imports to not accidentally register `<lit-virtualizer>` on the global custom element registry

## 0.1.1

### Patch Changes

- [#1912](https://github.com/sl-design-system/components/pull/1912) [`4b68034`](https://github.com/sl-design-system/components/commit/4b680344816bb1cefb66a6bc9fac7f9501f18ace) - Add missing `textContent` setter

## 0.1.0

### Minor Changes

- [#1791](https://github.com/sl-design-system/components/pull/1791) [`133b883`](https://github.com/sl-design-system/components/commit/133b883234d911dabe37bd3c8acef26afea20fe9) - Replace `--sl-size-borderWidth-subtle` with `--sl-size-borderWidth-default`

- [#1664](https://github.com/sl-design-system/components/pull/1664) [`849b154`](https://github.com/sl-design-system/components/commit/849b1544bcc7cc60de1eb37ec282f2e467efc7eb) - Use `--sl-size-borderWidth-subtle` instead of the old "default" token

- [#1713](https://github.com/sl-design-system/components/pull/1713) [`01abf58`](https://github.com/sl-design-system/components/commit/01abf5833d364a76dbdf4e0df0587d0fbec3848e) - Refactor styling to use new contextual tokens

### Patch Changes

- [#1632](https://github.com/sl-design-system/components/pull/1632) [`e68df34`](https://github.com/sl-design-system/components/commit/e68df344917a8d0bdc6a4c92f59079a247c6e7a9) - Add ability to render grouped items using lit-virtualizer:

  - New `optionGroupPath` property to specify the path to the group name in the option object
  - New `<sl-option-group-header>` component to render the group header
  - Add `items` property for advanced customization of how options are rendered (used in combobox)
  - Add `scrollToIndex(index: number)` method to scroll to a specific index in the listbox

- [#1709](https://github.com/sl-design-system/components/pull/1709) [`a62dee4`](https://github.com/sl-design-system/components/commit/a62dee4a381450cca44c647a54d850290e5b0f11) - Prepend light DOM elements to the host, instead of `append()`

  The fixes any possible issues where the element is added to the light DOM and Lit itself
  get's confused and thinks the element is rendered by Lit. This can cause Lit to later
  in the lifecycle remove the element from the light DOM, which is not what we want.

  By prepending the element to the host, we ensure that the element is not in any scope of Lit.
  This scope is visible in the DOM as HTML comments.

- [#1626](https://github.com/sl-design-system/components/pull/1626) [`99482e3`](https://github.com/sl-design-system/components/commit/99482e31dfee77fb99bf74a4fe325c3ccc08f6e6) - Add virtual list ability to listbox

- Updated dependencies [[`40cc538`](https://github.com/sl-design-system/components/commit/40cc538648e6ed5ac453fbe708bae8761caaab5e), [`bbcb7f7`](https://github.com/sl-design-system/components/commit/bbcb7f7cd48e22fa1e61f24ba645a4131b0c75ee)]:
  - @sl-design-system/icon@1.1.0

## 0.0.2

### Patch Changes

- [#1563](https://github.com/sl-design-system/components/pull/1563) [`ae44384`](https://github.com/sl-design-system/components/commit/ae44384129f1a787a82fd35262f3f24e0883df58) - Fix missing types in NPM package

## 0.0.1

### Patch Changes

- [#1492](https://github.com/sl-design-system/components/pull/1492) [`21302c2`](https://github.com/sl-design-system/components/commit/21302c28065512f1c89ffde17dbc3241a2306d5d) - New `<sl-listbox>`, `<sl-option>` and `<sl-option-group>` components
