# @sl-design-system/listbox

## 0.1.0

### Minor Changes

- [#1664](https://github.com/sl-design-system/components/pull/1664) [`849b154`](https://github.com/sl-design-system/components/commit/849b1544bcc7cc60de1eb37ec282f2e467efc7eb) - Use `--sl-size-borderWidth-subtle` instead of the old "default" token

### Patch Changes

- [#1632](https://github.com/sl-design-system/components/pull/1632) [`e68df34`](https://github.com/sl-design-system/components/commit/e68df344917a8d0bdc6a4c92f59079a247c6e7a9) - Add ability to render grouped items using lit-virtualizer:

  - New `optionGroupPath` property to specify the path to the group name in the option object
  - New `<sl-option-group-header>` component to render the group header
  - Add `items` property for advanced customization of how options are rendered (used in combobox)
  - Add `scrollToIndex(index: number)` method to scroll to a specific index in the listbox

- [#1626](https://github.com/sl-design-system/components/pull/1626) [`99482e3`](https://github.com/sl-design-system/components/commit/99482e31dfee77fb99bf74a4fe325c3ccc08f6e6) - Add virtual list ability to listbox

- Updated dependencies [[`bbcb7f7`](https://github.com/sl-design-system/components/commit/bbcb7f7cd48e22fa1e61f24ba645a4131b0c75ee)]:
  - @sl-design-system/icon@1.0.3

## 0.0.2

### Patch Changes

- [#1563](https://github.com/sl-design-system/components/pull/1563) [`ae44384`](https://github.com/sl-design-system/components/commit/ae44384129f1a787a82fd35262f3f24e0883df58) - Fix missing types in NPM package

## 0.0.1

### Patch Changes

- [#1492](https://github.com/sl-design-system/components/pull/1492) [`21302c2`](https://github.com/sl-design-system/components/commit/21302c28065512f1c89ffde17dbc3241a2306d5d) - New `<sl-listbox>`, `<sl-option>` and `<sl-option-group>` components
